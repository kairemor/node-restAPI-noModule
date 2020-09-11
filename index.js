const http = require('http')
const url = require('url')
const stringDecoder = require('string_decoder').StringDecoder
const config = require('./config')
const _data = require('./lib/data')
const handlers = require('./lib/handlers')
const helpers = require('./lib/helpers')

_data.update('test', 'newFile', '{foo:bar}', (err) => {
	console.log(err);
})


// configure server 
const server = http.createServer((req, res) => {
	//Get the url and parse it   
	const parsedUrl = url.parse(req.url, true)
	// get path   
	const path = parsedUrl.pathname
	const trimmedPath = path.replace(/^\/+|\/+$/g, '')

	// get the query string as a object 
	const queryStringObject = parsedUrl.query
	// get the http method 
	const method = req.method.toLowerCase()

	//GEt the headers as objects
	const header = req.headers

	// Get the payload if there is any
	const decoder = new stringDecoder('utf-8')
	let buffer = ''
	req.on('data', data => {
		buffer += decoder.write(data)
	})
	req.on('end', () => {
		buffer += decoder.end()

		//choose the handler and the not found if needed
		var chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

		//Construct the data objects
		const data = {
			'method': method,
			'queryStringObject': queryStringObject,
			'trimmedPath': trimmedPath,
			'header': header,
			'payload': helpers.parseJsonToObject(buffer)
		}
		//Route to the choosen handler 
		chosenHandler(data, (statusCode, payload) => {
			//Default status code 200 or the renderred by the callback 
			statusCode = typeof (statusCode) == 'number' ? statusCode : 200

			// Use the payload called back by the handler or the default payload 
			payload = typeof (payload) == 'object' ? payload : {}


			//Convert the payload to a string 
			res.setHeader('Content-Type', 'application/json')
			var payloadString = JSON.stringify(payload)
			res.writeHead(statusCode)
			//send response 
			res.end(payloadString)

			//log the request 
			console.log("The returning response : ", statusCode, payloadString)
		})
		//log the request path 
		// console.log('the path actual ' + trimmedPath + " with the method : " + method)
		// console.log('The query is :', queryStringObject);
		// console.log("the reader request :", header);
		// console.log("the pyload : ", buffer);
	})

})

//listen port 
server.listen(config.port, 'localhost', () => {
	// console.log(process);
	console.log('listening on ', config.port, ' Env name is :', config.envName)
})



//Defining a request router 

var router = {
	'sample': handlers.sampler,
	'ping': handlers.ping,
	'users': handlers.users
}
const _data = require('./data')
const helpers = require('./helpers')
//define handler 
var handlers = {}

handlers.sampler = (data, cb) => {
    //Callback a http status code anf a payload object 
    cb(406, {
        'name': 'sample handler'
    })
}

handlers.ping = (data, cb) => {
    cb(200)
}

//nor found
handlers.notFound = (data, cb) => {
    cb(404)
}

handlers.users = (data, cb) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete']
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, cb)
    } else {
        cb(405)
    }
}

//Container for uthe users sub methods 

handlers._users = {}

//usrs post 
//require fistnamee lastname phone password 
handlers._users.post = (data, cb) => {
    //check all required field 
    const firstname = typeof (data.payload.firstname) == 'string' && data.payload.firstname.trim().length > 0 ? data.payload.firstname.trim() : false
    const lastname = typeof (data.payload.lastname) == 'string' && data.payload.lastname.trim().length > 0 ? data.payload.lastname.trim() : false
    const phone = typeof (data.payload.phone) == 'string' && data.payload.lastname.trim().length == 11 ? data.payload.phone.trim() : false
    const password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 5 ? data.payload.password.trim() : false
    const tosAgreement = typeof (data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false

    if (firstname && lastname && password && tosAgreement && phone) {
        // check the user doesn't exist 
        _data.read('users', phone, (err, data) => {
            if (err) {
                // hash the password 
                const hashedPassword = helpers.hash(password)

                if (hashedPassword) {
                    let userObject = {
                        'firstname': firstname,
                        'lastname': lastname,
                        'phone': phone,
                        'hashedPassword': hashedPassword,
                        'tosAgreement': tosAgreement
                    }

                    //stroe the users 

                    _data.create('users', phone, userObject, (err) => {
                        if (!err) {
                            cb(200)
                        } else {
                            cb(400, {
                                'Error': 'Could not create user'
                            })
                        }
                    })
                } else {
                    cb(500, {
                        'Error': 'Couldn\'t hash the password'
                    })
                }
            } else {
                //user with htis phone numer arleady existe
                cb(400, {
                    'Error': 'Users with this phone number already existe'
                })
            }
        })
    } else {
        cb(400, {
            'Error': 'Missing required fields'
        })
    }

}
//usrs get 
handlers._users.get = (data, cb) => {

}
//usrs put 
handlers._users.put = (data, cb) => {

}
//usrs delete 
handlers._users.delete = (data, cb) => {

}
module.exports = handlers
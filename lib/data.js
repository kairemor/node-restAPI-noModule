// Library for storing ans editing data 

const fs = require('fs')
const path = require('path')

// Container to be expoted
const lib = {}

// base directoey 

lib.basedir = path.join(__dirname, '../.data/')

lib.create = (dir, file, data, cb) => {
    // Open the file for writting 
    fs.open(lib.basedir + dir + '/' + file + '.json', 'wx', (err, fileDesc) => {
        if (!err && fileDesc) {
            // data to string 
            var stringdata = JSON.stringify(data);

            fs.writeFile(fileDesc, stringdata, (err) => {
                if (!err) {
                    fs.close(fileDesc, (err) => {
                        if (!err) {
                            cb(false)
                        } else {
                            cb('Error on closing file')
                        }
                    })
                } else {
                    cb('Error writing data')
                }
            })
        } else {
            cb('Could not create new file , may be exsite')
        }
    })
}

// read data 

lib.read = (dir, file, cb) => {
    fs.readFile(lib.basedir + dir + "/" + file + '.json', 'utf8', (err, data) => {
        cb(err, data)
    })
}

//update 

lib.update = (dir, file, data, cb) => {
    fs.open(lib.basedir + dir + '/' + file + '.json', 'r+', (err, fileDesc) => {
        if (!err && fileDesc) {
            const stringdata = JSON.stringify(data)

            // tuncate the content of the current file

            fs.ftruncate(fileDesc, (err) => {
                if (!err) {
                    fs.writeFile(fileDesc, stringdata, (err) => {
                        if (!err) {
                            fs.close(fileDesc, (err) => {
                                if (!err) {
                                    cb(null)
                                } else {
                                    cb('Error closing')
                                }
                            })
                        } else {
                            cb('Error writing file')
                        }
                    })
                } else {
                    cb('error to truncate')
                }
            })
        } else {
            cb('Could not open the file for updating ')
        }
    })
}

//deleting a file 

lib.delete = (dir, file, cb) => {
    fs.unlink(lib.basedir + dir + '/' + file + '.json', (err) => {
        if (!err) {
            cb(null)
        } else {
            cb('Error deleting the file')
        }
    })
}
module.exports = lib
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const {SERVER_PORT} = process.env
const {CONNECTION_STRING} = process.env
const {
    ping,
    quote,
    profile,
    register,
    login,
    addstockwatch,
    stockwatches
    /** ,
    getFileList,
    addFile,
    addVersion,
    getVersionList,
    deleteFile
    **/
} = require('./controller.js')

app.use(express.json())
app.use(cors())

// ENDPOINTS
app.get('/api/ping', ping)
app.get('/api/quote', quote)
app.get('/api/profile', profile)
app.post('/api/stockwatches', stockwatches)
app.post('/api/register', register)
app.post('/api/login', login)
app.post('/api/addstockwatch', addstockwatch)

// OLD ENDPOINTS
/** 
app.get('/api/allFiles', getFileList)

app.post('/api/addFile', addFile)
app.post('/api/addVersion', addVersion)
app.get('/api/versions/:fileId', getVersionList)
app.delete('/api/deleteFile/:fileId', deleteFile)

*/

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT} on db url ${CONNECTION_STRING}`))
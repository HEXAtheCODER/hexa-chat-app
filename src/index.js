const express = require('express');
const socket = require('socket.io');
const http = require('http');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const path = require('path');

const port = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)

const io = socket(server)

const publicDirectoryPath = path.join(__dirname , '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection' , (socket) => {

    socket.on('join', ({username,room}, callback) => {
        const {error, user} = addUser({id: socket.id, username, room})

        if(error){
           return callback(error)
        }

        socket.join(room)
        socket.broadcast.to(room).emit('message', generateMessage(username, 'joined'))
        io.to(room).emit('usersInRoom', getUsersInRoom(room), room)

        socket.emit('setUsername', username, room)

        callback()
    })

    socket.on('newMessage', (value, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('message', generateMessage(user.username, value))
        callback()
     })

   
    socket.on('location' , (position, callback) => {
        const user = getUser(socket.id)
        io.emit('locationMessage', generateLocationMessage(user.username,`https://google.com/maps?q=${position.latitude},${position.longitude}`))
        callback()
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('message', generateMessage(user.username, 'left'))
            io.to(user.room).emit('usersInRoom', getUsersInRoom(user.room), user.room)
        }
    })    
})

server.listen(port, () => {
    console.log('server running')
})
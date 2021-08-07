const socket = io()
const form = document.querySelector('form');
const inputField = document.querySelector('input');

const $submit = document.querySelector('#submit')
const $geolocationButtom = document.querySelector('#geolocation-buttom')
const $messages = document.querySelector('#messages')
const $usernameRoomInfo = document.querySelector('#username-room-info')

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const usernameRoomInfoTemplate = document.querySelector('#username-room-info-template').innerHTML
const totalUserTemplate = document.querySelector('#total-user-template').innerHTML

const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix:true})


socket.on('message', (mssg) => {
    const html = Mustache.render(messageTemplate,{
        sendBy : mssg.username,
        message : mssg.text,
        createdAt : moment(mssg.createdAt).format('h:mma')
    })

    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('setUsername', (username, room)=>{
    const html = Mustache.render(usernameRoomInfoTemplate,{
        username,
        room
    })

    $usernameRoomInfo.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (mssg) => {
    const html = Mustache.render(locationTemplate,{
        sendBy : mssg.username,
        message : mssg.text,
        createdAt : moment(mssg.createdAt).format('h:mma')
    })

    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('usersInRoom', (users, room)=>{
    const html = Mustache.render(totalUserTemplate,{
        room,
        users
    })

    document.querySelector('#total-user-info').innerHTML = html
})

form.addEventListener('submit' , (e) => {
    e.preventDefault();

    let value = e.target.elements.inputMessage.value

    $submit.disabled = true

    socket.emit('newMessage', value, ()=>{
        console.log('Message delivered')

        $submit.disabled = false
        
    })

    inputField.value = ''
})

document.querySelector('#geolocation-buttom').addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('Not supported')
    }

    $geolocationButtom.disabled = true

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('location',{latitude:position.coords.latitude, longitude:position.coords.longitude}, ()=>{
            $geolocationButtom.disabled = false
        })
    })
})

socket.emit('join', { username, room}, (error)=>{
    console.log(error)
})


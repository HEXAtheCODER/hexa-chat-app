const users = []

const addUser = ({ id, username, room}) => {

    username = username.trim()
    room = room.trim()

    if (!username || !room) {
        return { error : 'username and room required'}
    }

    const currentUserList = users.find((user)=>{
        return user.room === room && user.username === username
    })

    if(currentUserList !== undefined) {
        return { error : 'username already in use'}
    }

    const user = {
        id,
        username,
        room
    }

    users.push(user)

    return user

}

const removeUser = (id)=>{
    const targetIndex = users.findIndex((user)=>user.id === id)

    if(targetIndex !== -1){
        return users.splice(targetIndex, 1)[0]
    }    
}

const getUser = (id)=>{
    
    const user = users.find((user)=> user.id === id)

    if(user === undefined){
        return {
            error : 'No user found'
        }
    }

    return user
}

const getUsersInRoom = (room)=>{
    
    const usersInSameRoom = users.filter((user)=> user.room === room)

    return usersInSameRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}


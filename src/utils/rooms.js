const getActiveRooms = (keys) => {
    const activeRooms = []
    const arr = Array.from(keys.keys())
        for(let i in arr){
            const item = Array.from(keys.get(arr[i]))
            if (arr[i] !== item[0]) {
                activeRooms.push(arr[i])
            }
        }
    return activeRooms
}

module.exports = getActiveRooms
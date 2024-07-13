
const socket = io()

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((posistion) => {
        const { latitude, longitude } = posistion.coords

        //from frontend emit event

        socket.emit('send-location', { latitude, longitude })
    }, (error) => {
        console.log(error)
    },
        (error) => {
            console.log(error)
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    )
}

const map = L.map('map').setView([0, 0], 16)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "Gotham",
}).addTo(map)

const marker = {}
console.log('first')

socket.on('receive-location', (data) => {
    const { id, latitude, longitude } = data
    map.setView([latitude, longitude], 16)


    if (marker[id]) {
        marker[id].setLatLang([latitude, longitude])
    } else {
        marker[id] = L.marker([latitude, longitude]).addTo(map)
    }
})



socket.on("user-disconnected", (id) => {

    if (marker[id]) {
        map.removeLayer(marker[id])

        delete marker[id]
    }


})
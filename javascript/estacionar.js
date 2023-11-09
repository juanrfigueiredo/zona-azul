function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: { lat: -22.12071418762207, lng: -51.387351989746094 },
        disableDefaultUI: true,
        zoomControl: true,
        controlSize: 20,
    });
    new google.maps.Marker({
        position: { lat: -22.12071418762207, lng: -51.387351989746094 },
        map,
    });
}


document.addEventListener('DOMContentLoaded', function () {
    initMap();
    //get car info from local storage
    const carInfo = JSON.parse(localStorage.getItem('carInfo')) ?? null;

    if (carInfo) {
        const { type, brand, model, placa } = carInfo;
        document.getElementById('vehicle-type').textContent = model;
        document.getElementById('vehicle-model').innerHTML = placa;
    }
});
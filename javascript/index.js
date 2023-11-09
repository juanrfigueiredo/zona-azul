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
    const logout = document.getElementById('logout');
    const zonaAzul = document.getElementById('zona-azul');

    if (carInfo) {
        const { type, brand, model, placa } = carInfo;
        document.getElementById('vehicle-type').textContent = model;
        document.getElementById('vehicle-model').innerHTML = placa;

        logout.removeAttribute('hidden');
        zonaAzul.classList.remove('grid-span-4b2');
        zonaAzul.classList.add('grid-span-2b2');
    }


    logout.addEventListener('click', function () {
        if (confirm('Deseja realmente sair?')) {
            localStorage.removeItem('carInfo');
            window.location.href = "index.html";
        }
    });

    zonaAzul.addEventListener('click', function () {
        if (!carInfo) {
            alert('Cadastre um veículo para continuar');
            return;
        }
        window.location.href = "estacionar.html";
    });

});
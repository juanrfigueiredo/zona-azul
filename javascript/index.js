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



        verificarEstacionamento();

        function verificarEstacionamento(bool) {
            const estacionadosArray = JSON.parse(localStorage.getItem('estacionados')) || [];
            const placaExistente = estacionadosArray.find(estacionado => estacionado.placa === placa);
            const naoExpirado = placaExistente ? new Date(placaExistente.expired_at) > new Date() : false;
            // Obtenha a placa do veículo

            // Verifique se a placa já existe no Local Storage

            if (placaExistente) {
                if (naoExpirado) {
                    zonaAzul.classList.add('placa-existente');
                    // Obtenha o tempo restante para expirar
                    const diff = new Date(placaExistente.expired_at) - new Date();
                    const FaltaHoras = Math.floor(diff / (1000 * 60 * 60));
                    const FaltaMinutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const FaltaSegundos = Math.floor((diff % (1000 * 60)) / 1000);
                    if (bool) {
                        alert(`Esse veículo já está estacionado.` + '\n' + `O tempo restante é de ${FaltaHoras > 0 ? FaltaHoras + ' horas, ' : ""}${FaltaMinutos > 0 ? FaltaMinutos + ' minutos e ' : ""}${FaltaSegundos} segundos.`);
                        return true;
                    }
                }
            }
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
            if (verificarEstacionamento(true)) {
                return;
            }
            window.location.href = "./pages/estacionar.html";
        });
    }
});


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
    const { type, brand, model, placa } = carInfo;

    if (carInfo) {
        document.getElementById('vehicle-type').textContent = model;
        document.getElementById('vehicle-model').innerHTML = placa;
    }

    //add on click to the labels to call selectRadio function

    const radioLabels = document.querySelectorAll('.radio-label');
    radioLabels.forEach(label => {
        label.addEventListener('click', function () {
            const input = label.querySelector('input');
            selectRadio(input.value);
        });
    });

    selectRadio();

    function selectRadio(value) {
        const radioLabels = document.querySelectorAll('.radio-label');

        radioLabels.forEach(label => {
            const input = label.querySelector('input');
            if (input.value === value.toString()) {
                input.checked = true;
                label.classList.add('selected');
            } else {
                input.checked = false;
                label.classList.remove('selected');
            }
        });
    }

    const estacionarButton = document.getElementById('estacionarBtn');
    estacionarButton.addEventListener('click', function () {
        estacionar();
    });

    const estacionadosArray = JSON.parse(localStorage.getItem('estacionados')) || [];
    const placaExistente = estacionadosArray.find(estacionado => estacionado.placa === placa);
    const naoExpirado = placaExistente ? new Date(placaExistente.expired_at) > new Date() : false;

    verificarEstacionamento();

    function verificarEstacionamento() {
        // Obtenha a placa do veículo

        // Verifique se a placa já existe no Local Storage

        if (placaExistente) {
            if (naoExpirado) {
                document.getElementById('estacionarBtn').classList.add('placa-existente');
            }
        }
    }

    function estacionar() {

        // Verifique se a placa já existe no Local Storage

        if (placaExistente) {
            if (naoExpirado) {
                const diff = new Date(placaExistente.expired_at) - new Date();
                const FaltaHoras = Math.floor(diff / (1000 * 60 * 60));
                const FaltaMinutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const FaltaSegundos = Math.floor((diff % (1000 * 60)) / 1000);
                alert(`Esse veículo já está estacionado.` + '\n' + `O tempo restante é de ${FaltaHoras > 0 ? FaltaHoras + ' horas, ' : ""}${FaltaMinutos > 0 ? FaltaMinutos + ' minutos e ' : ""}${FaltaSegundos} segundos.`);
                return;
            }
            else {
                estacionadosArray.splice(estacionadosArray.indexOf(placaExistente), 1);
            }
        }

        // Obtenha a quantidade de cartões selecionados
        const quantidadeCartoes = document.querySelector('input[name="cartao"]:checked').value;

        // Calcule a data de expiração (em horas)
        const horasDeExpiracao = quantidadeCartoes * 1;

        // Obtenha a data e hora atual
        const dataAtual = new Date();

        // Crie o objeto com as informações
        const estacionadoInfo = {
            created_at: dataAtual.toISOString(),
            expired_at: new Date(dataAtual.getTime() + horasDeExpiracao * 60 * 60 * 1000).toISOString(),
            placa: placa
        };

        // Adicione o objeto ao array
        estacionadosArray.push(estacionadoInfo);

        // Converta o array para uma string JSON e armazene no Local Storage
        localStorage.setItem('estacionados', JSON.stringify(estacionadosArray));

        // Exemplo: Exiba um alerta informando que o estacionamento foi salvo
        console.log('Estacionamento salvo no Local Storage!');
        window.location.href = "../pages/estacionar.html";
    }


});



function initMap() {
  const initialLocation = {
    lat: -22.12071418762207,
    lng: -51.387351989746094,
  };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: initialLocation,
    disableDefaultUI: true,
    zoomControl: true,
    controlSize: 20,
  });

  // Adicionando marcador ao mapa
  new google.maps.Marker({
    position: initialLocation,
    map,
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initMap();

  const carInfo = JSON.parse(localStorage.getItem("carInfo")) ?? null;
  const { model, placa } = carInfo || {};

  if (carInfo) {
    updateVehicleInfo(model, placa);
  }

  colorParkingButton(placa);

  addClickEventToRadioLabels();
  addClickEventToParkingButton(placa);
  addClickEventToPayButton(placa);
  addClickEventToCopyButton();
  addClickEventToCloseButton();

  // Função para atualizar as informações do veículo no HTML
  function updateVehicleInfo(model, placa) {
    document.getElementById("vehicle-type").textContent = model;
    document.getElementById("vehicle-model").innerHTML = placa;
  }

  function addClickEventToRadioLabels() {
    const radioLabels = document.querySelectorAll(".radio-label");
    radioLabels.forEach((label) => {
      label.addEventListener("click", function () {
        const input = label.querySelector("input");
        const selectedValue = input.value;

        radioLabels.forEach((otherLabel) => {
          const otherInput = otherLabel.querySelector("input");
          if (otherInput.value === selectedValue) {
            otherInput.checked = true;
            otherLabel.classList.add("selected");
          } else {
            otherInput.checked = false;
            otherLabel.classList.remove("selected");
          }
        });
      });
    });
  }

  function isExpired(car) {
    const expiredDate = new Date(car.expired_at);
    const currentDate = new Date();
    return expiredDate < currentDate;
  }

  function isParked(placa) {
    const parkedCars = JSON.parse(localStorage.getItem("estacionados")) ?? [];
    const parkedCar = parkedCars.find(
      (car) => car.placa === placa && !isExpired(car)
    );
    return !!parkedCar;
  }

  function closeModal() {
    qrModal.style.display = "none";
  }

  function openModal() {
    const qrModal = document.getElementById("qrModal");
    const quantidadeCartoes = returnSelectedCardValue();
    const costSpan = document.getElementById("quantCartoes");
    const qrModalImage = document.getElementById("qrCodeImage");

    if (quantidadeCartoes == 1) {
      qrModalImage.src = "../images/1hr.png";
      costSpan.textContent = "R$ 2,50";
    } else {
      qrModalImage.src = "../images/2hr.png";
      costSpan.textContent = "R$ 5,00";
    }

    qrModal.style.display = "flex";
  }

  function addClickEventToParkingButton(placa) {
    const parkingButton = document.getElementById("estacionarBtn");
    parkingButton.addEventListener("click", function () {
      if (!isParked(placa)) {
        openModal();
      } else {
        showEstacionamentoStatus(placa);
      }
    });
  }

  function showEstacionamentoStatus(placa) {
    const parkedCars = JSON.parse(localStorage.getItem("estacionados")) ?? [];
    const car = parkedCars.find((car) => car.placa === placa);
    const diff = new Date(car.expired_at) - new Date();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    alert(
      `Esse veículo já está estacionado.\nO tempo restante é de ${
        hours > 0 ? hours + " horas, " : ""
      }${minutes > 0 ? minutes + " minutos e " : ""}${seconds} segundos.`
    );
  }

  function colorParkingButton(placa) {
    const parkingButton = document.getElementById("estacionarBtn");
    if (isParked(placa)) {
      parkingButton.classList.add("placa-existente");
    }
  }

  function returnSelectedCardValue() {
    const selectedCard = document.querySelector('input[name="cartao"]:checked');
    return selectedCard.value;
  }

  function parkTheCar(placa) {
    const parkedCars = JSON.parse(localStorage.getItem("estacionados")) ?? [];
    const parkedCar = parkedCars.find((car) => car.placa === placa);
    const carParkingExpired = parkedCar
      ? new Date(parkedCar?.expired_at) < new Date()
      : undefined;

    if (parkedCar && !carParkingExpired) {
      showEstacionamentoStatus(placa);
    } else if (parkedCar) {
      parkedCars.splice(parkedCars.indexOf(parkedCar), 1);
    }

    const cardQuant = returnSelectedCardValue();
    const hoursToExpire = cardQuant * 1;
    const now = new Date();
    const parkingInfo = {
      created_at: now.toISOString(),
      expired_at: new Date(
        now.getTime() + hoursToExpire * 60 * 60 * 1000
      ).toISOString(),
      placa: placa,
    };

    parkedCars.push(parkingInfo);
    localStorage.setItem("estacionados", JSON.stringify(parkedCars));
    console.log("Estacionamento salvo no Local Storage!");

    window.location.href = "../pages/estacionar.html";
  }

  function addClickEventToPayButton(placa) {
    const payButton = document.getElementById("paguedBtn");
    payButton.addEventListener("click", function () {
      parkTheCar(placa);
    });
  }

  function addClickEventToCopyButton() {
    let qrCodeText = "";
    const copyButton = document.getElementById("copyToClipboardBtn");
    const cardQuant = returnSelectedCardValue();
    copyButton.addEventListener("click", function () {
      if (cardQuant == 1) {
        qrCodeText =
          "00020126580014BR.GOV.BCB.PIX01365f147f51-91bb-4015-b70e-c038571fd91d52040000530398654042.505802BR5925Juan Rodrigues Figueiredo6009SAO PAULO62140510JLISxwTr9d630462EF";
      } else {
        qrCodeText =
          "00020126580014BR.GOV.BCB.PIX01365f147f51-91bb-4015-b70e-c038571fd91d52040000530398654045.005802BR5925Juan Rodrigues Figueiredo6009SAO PAULO621405108uVAScLPGm63045234";
      }

      navigator.clipboard
        .writeText(qrCodeText)
        .then(() => {
          // Success message or toast
          alert("Texto do código QR copiado!");
        })
        .catch((err) => {
          console.error("Error copying to clipboard: ", err);
        });
    });
  }

  function addClickEventToCloseButton() {
    const closeButton = document.getElementById("closeBtn");
    closeButton.addEventListener("click", function () {
      closeModal();
    });
  }
});

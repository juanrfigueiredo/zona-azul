// Função para inicializar o mapa
function initMap() {
  const initialLocation = { lat: -22.12071418762207, lng: -51.387351989746094 };
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

// Espera o carregamento do DOM para executar o código
document.addEventListener("DOMContentLoaded", function () {
  // Inicialização do mapa
  initMap();

  // Obtenção das informações do carro do armazenamento local
  const carInfo = JSON.parse(localStorage.getItem("carInfo")) ?? null;
  const { model, placa } = carInfo || {};

  // Atualização das informações no HTML se houver informações do carro
  if (carInfo) {
    document.getElementById("vehicle-type").textContent = model;
    document.getElementById("vehicle-model").innerHTML = placa;
  }

  // Adiciona evento de clique aos rótulos para chamar a função selectRadio
  const radioLabels = document.querySelectorAll(".radio-label");
  radioLabels.forEach((label) => {
    label.addEventListener("click", function () {
      const input = label.querySelector("input");
      selectRadio(input.value);
    });
  });

  // Função para selecionar o botão de rádio correspondente
  function selectRadio(value) {
    const radioLabels = document.querySelectorAll(".radio-label");

    radioLabels.forEach((label) => {
      const input = label.querySelector("input");
      if (input.value === value.toString()) {
        input.checked = true;
        label.classList.add("selected");
      } else {
        input.checked = false;
        label.classList.remove("selected");
      }
    });
  }

  // Obtenção da referência do botão "Estacionar"
  const estacionarButton = document.getElementById("estacionarBtn");
  estacionarButton.addEventListener("click", function () {
    // Verifica se a placa existe e se não expirou
    if (placaExistente && naoExpirado) {
      document.getElementById("estacionarBtn").classList.add("placa-existente");
      showEstacionamentoStatus();
      return;
    }
    openModal();
  });

  // Verifica se a placa existe nos carros estacionados
  const estacionadosArray =
    JSON.parse(localStorage.getItem("estacionados")) || [];
  const placaExistente = estacionadosArray.find(
    (estacionado) => estacionado.placa === placa
  );
  const naoExpirado = placaExistente
    ? new Date(placaExistente.expired_at) > new Date()
    : false;

  verificarEstacionamento();

  // Função para verificar o status do estacionamento
  function verificarEstacionamento() {
    if (placaExistente && naoExpirado) {
      document.getElementById("estacionarBtn").classList.add("placa-existente");
    }
  }

  // Exibe o status do estacionamento
  function showEstacionamentoStatus() {
    // Cálculo do tempo restante do estacionamento
    const diff = new Date(placaExistente.expired_at) - new Date();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    alert(
      `Esse veículo já está estacionado.\nO tempo restante é de ${
        hours > 0 ? hours + " horas, " : ""
      }${minutes > 0 ? minutes + " minutos e " : ""}${seconds} segundos.`
    );
  }

  // Função para realizar o processo de estacionamento
  function estacionar() {
    if (placaExistente && naoExpirado) {
      showEstacionamentoStatus();
    } else if (placaExistente) {
      estacionadosArray.splice(estacionadosArray.indexOf(placaExistente), 1);
    }

    const quantidadeCartoes = document.querySelector(
      'input[name="cartao"]:checked'
    ).value;
    const horasDeExpiracao = quantidadeCartoes * 1;
    const dataAtual = new Date();

    const estacionadoInfo = {
      created_at: dataAtual.toISOString(),
      expired_at: new Date(
        dataAtual.getTime() + horasDeExpiracao * 60 * 60 * 1000
      ).toISOString(),
      placa: placa,
    };

    estacionadosArray.push(estacionadoInfo);
    localStorage.setItem("estacionados", JSON.stringify(estacionadosArray));

    console.log("Estacionamento salvo no Local Storage!");
    window.location.href = "../pages/estacionar.html";
  }

  //------------------------QR CODE------------------------//
  const qrModal = document.getElementById("qrModal");
  const qrModalContent = document.getElementById("qrModalContent");
  const copyToClipboardBtn = document.getElementById("copyToClipboardBtn");
  const paguedBtn = document.getElementById("paguedBtn");
  const qrCodeImage = document.getElementById("qrCodeImage");
  const closeBtn = document.getElementById("closeBtn");
  const costSpan = document.getElementById("quantCartoes");

  // Function to open the modal
  function openModal() {
    const quantidadeCartoes = document.querySelector(
      'input[name="cartao"]:checked'
    ).value;
    qrCodeImage.src =
      quantidadeCartoes == 1 ? "../images/1hr.png" : "../images/2hr.png";

    costSpan.textContent = quantidadeCartoes == 1 ? "R$ 2,50" : "R$ 5,00";
    costSpan.style.color = "#000";
    qrModal.style.display = "flex";
  }

  closeBtn.addEventListener("click", function () {
    closeModal();
  });

  // Function to close the modal
  function closeModal() {
    qrModal.style.display = "none";
  }

  // Event listener for copying QR code text to clipboard
  copyToClipboardBtn.addEventListener("click", function () {
    const quantidadeCartoes = document.querySelector(
      'input[name="cartao"]:checked'
    ).value;

    const qrCodeText =
      quantidadeCartoes == 1
        ? "00020126580014BR.GOV.BCB.PIX01365f147f51-91bb-4015-b70e-c038571fd91d52040000530398654042.505802BR5925Juan Rodrigues Figueiredo6009SAO PAULO62140510JLISxwTr9d630462EF"
        : "00020126580014BR.GOV.BCB.PIX01365f147f51-91bb-4015-b70e-c038571fd91d52040000530398654045.005802BR5925Juan Rodrigues Figueiredo6009SAO PAULO621405108uVAScLPGm63045234"; // Replace with your QR code text
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

  // Event listener for "PAGUEI!" button click
  paguedBtn.addEventListener("click", function () {
    estacionar();
    closeModal();
  });
});

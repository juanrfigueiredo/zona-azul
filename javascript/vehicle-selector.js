var brands = [];
var models = [];

document.addEventListener('DOMContentLoaded', function () {
    const selectType = document.getElementById("selectType");
    const selectBrand = document.getElementById("selectBrand");
    const selectBrandInput = document.getElementById("selectBrandInput");
    const selectModel = document.getElementById("selectModel");
    const selectModelInput = document.getElementById("selectModelInput");
    const placaP1 = document.getElementById("placa-p1");
    const placaP2 = document.getElementById("placa-p2");
    const saveButton = document.querySelector('.button-active');

    loadBrandOptions();

    selectType.addEventListener('change', function () {
        loadBrandOptions();
        selectBrandInput.value = '';
        selectModelInput.value = '';
    });

    selectBrandInput.addEventListener('input', function () {
        filterOptions(selectBrandInput.value, brands, selectBrand);
    });

    function loadBrandOptions() {
        fetch(`json/${selectType.value}.brands.json`)
            .then(response => response.json())
            .then(data => {
                brands = data;
                populateOptions(data, selectBrand);
                loadModelOptions();
            });
    }

    selectBrand.addEventListener('change', function () {
        loadModelOptions();
    });

    selectBrandInput.addEventListener('focusout', function () {
        loadModelOptions();
    });

    function loadModelOptions() {
        let brand = selectBrand.value == "" ? '1' : selectBrand.value;
        fetch(`https://parallelum.com.br/fipe/api/v2/${selectType.value ?? cars}/brands/${brand}/models`)
            .then(response => response.json())
            .then(data => {
                models = data;
                populateOptions(data, selectModel);
            });
    }

    selectModelInput.addEventListener('input', function () {
        filterOptions(selectModelInput.value, models, selectModel);
    });

    function populateOptions(optionsArray, selectElement) {
        selectElement.innerHTML = '';
        for (var i = 0; i < optionsArray.length; i++) {
            var option = document.createElement("option");
            option.text = optionsArray[i].name; // Display model
            option.value = optionsArray[i].code; // Set code as the value
            selectElement.add(option);
        }
    }

    function filterOptions(filterValue, optionsArray, selectElement) {
        const filteredOptions = optionsArray.filter(option => {
            return option.name.toLowerCase().includes(filterValue.toLowerCase());
        });

        populateOptions(filteredOptions, selectElement);
    }

    saveButton.addEventListener('click', function () {
        if (validatePlaca()) {
            saveCarInformation();
            window.location.href = "index.html";
        } else {
            alert("Placa inválida. Preencha corretamente.");
        }
    });

    function validatePlaca() {
        //digito ou letra regex = 
        const placaRegex = /^[A-Z]{3}\d{1}\w{1}\d{2}$/;
        return placaRegex.test(`${placaP1.value.toUpperCase()}${placaP2.value.toUpperCase()}`);
    }

    function saveCarInformation() {
        // console.log({
        //     type: selectType.value,
        //     brand: selectBrand.options[selectBrand.selectedIndex].text,
        //     model: selectModel.options[selectModel.selectedIndex].text,
        //     placa: `${placaP1.value.toUpperCase()}${placaP2.value.toUpperCase()}`
        // })
        const carInfo = {
            type: selectType.value,
            brand: selectBrand.options[selectBrand.selectedIndex].text,
            model: selectModel.options[selectModel.selectedIndex].text,
            placa: `${placaP1.value.toUpperCase()}${placaP2.value.toUpperCase()}`
        };

        // Save car information in local storage
        localStorage.setItem('carInfo', JSON.stringify(carInfo));
    }
});

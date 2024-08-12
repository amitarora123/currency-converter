console.log("running script");

let url = `https://restcountries.com/v3.1/all`;
let apiBase = `https://api.exchangerate-api.com/v4/latest/`;
let from = document.querySelector('#from');
let to = document.querySelector('#to');

async function getCountries() {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

async function fetchAndLogData() {
    let data = await getCountries();
    console.log(data);
    
    let addedCodes = new Set();

    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const country = data[key];
            let countryCode = country.cca2;
            let currencies = country.currencies;
            let currencyCodes = currencies ? Object.keys(currencies) : [];
            
            if (addedCodes.has(countryCode)) continue;

            let fromOption = document.createElement('option');
            let toOption = document.createElement('option');

            fromOption.innerText = `${countryCode}`;
            fromOption.value = `${currencyCodes[0]}`;
            fromOption.setAttribute('data-country', countryCode);

            toOption.innerText = `${countryCode}`;
            toOption.value = `${currencyCodes[0]}`;
            toOption.setAttribute('data-country', countryCode);

            if (countryCode == "IN") {
                toOption.selected = "selected";
            }
            if (countryCode == "US") {
                fromOption.selected = "selected";
            }

            from.append(fromOption);
            to.append(toOption);

            addedCodes.add(countryCode);
        }
    }
    
    // Add event listeners after options are populated
    from.addEventListener("change", (evt) => updateFlag(evt.target));
    to.addEventListener("change", (evt) => updateFlag(evt.target));

    // Initially update flags based on the default selection
    updateFlag(from);
    updateFlag(to);
}

fetchAndLogData();

const updateFlag = (element) => {
    // Get the country code from the selected option
    let countryCode = element.options[element.selectedIndex].getAttribute('data-country');
    let img = element.parentElement.querySelector("img");
    
    if (!img) {
        img = document.createElement('img');
        img.width = 32;
        img.height = 32;
        element.parentElement.appendChild(img);
    }

    let newSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`;
    img.src = newSrc;
    console.log(`Flag updated for country code: ${countryCode}`);
};

// Add conversion logic
document.getElementById('converter').addEventListener('click', async (event) => {
    event.preventDefault();
    
    let amount = document.getElementById('amount').value;
    let fromCurrency = from.value;
    let toCurrency = to.value;

    if (amount && fromCurrency && toCurrency) {
        try {
            let response = await fetch(`${apiBase}${fromCurrency}`);
            let data = await response.json();
            let rate = data.rates[toCurrency];
            let result = amount * rate;
            document.getElementById('msg').innerText = `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`;
        } catch (error) {
            console.error('Error fetching conversion rate:', error);
            document.getElementById('msg').innerText = 'Error fetching conversion rate';
        }
    }
});

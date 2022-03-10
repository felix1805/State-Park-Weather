var userInputEl = document.querySelector('#stateSearch').value;
var submitBtnEl = document.querySelector('#submitBtn');
var formEl = document.querySelector('#form');
var resultsEl = document.querySelector('#results');
var weatherEl = document.querySelector('#weather');
var weatherCardsEl = document.querySelector('#weatherCards');
var currentDate = moment().format('MMM Do YYYY');



var toJSON = function (response) {
    return response.json();
};
var capitalize = function (string) {
    return string[0].toUpperCase() + string.slice(1);
}

// need to update so that localStorage saves userInputEl as an array entry, then create function to JSON.parse values from that array when they're needed
function logData(event) {
    event.preventDefault();
    var userInputEl = document.querySelector('#stateSearch').value;
    localStorage.setItem('searchValues', userInputEl);
    console.log(userInputEl);
    getParks();
}

function firstFive(zip) {
    return zip.substring(0,5);
}

function getParks() {
    resultsEl.innerHTML = '';
    weatherCardsEl.innerHTML = '';
    var parkHeader = document.createElement('h2');
    parkHeader.textContent = 'Parks: ';
    resultsEl.appendChild(parkHeader);
    var userInputEl = document.querySelector('#stateSearch').value;

    var parkURL = 'https://developer.nps.gov/api/v1/parks?stateCode=' + userInputEl + '&limit=30&start=0&api_key=B93I9aQi7T1FM0mnp8EPcpawoqg1G1XYI6IVWLWy'

    console.log(parkURL);

    fetch(parkURL)
        .then(toJSON)
        .then(function (results) {
            console.log(results);

            for (i = 0; i < results.data.length; i++) {
                var parkName = (JSON.stringify(results.data[i].fullName));
                var parkName = parkName.replace('"', '').slice(0, -1);
                var parkZIP = firstFive(results.data[i].addresses[0].postalCode);
                var parkDesc = (JSON.stringify(results.data[i].description))

                var parkCardEl = document.createElement('div');
                parkCardEl.setAttribute('id', 'parkCard')

                // create Elements here
                var parkNameEl = document.createElement('h2');
                var parkImg = document.createElement('img');
                var parkInfo = document.createElement('p');

                // add things to Elements here
                parkNameEl.textContent = parkName;
                parkImg.setAttribute('src', results.data[i].images[0].url);
                parkImg.setAttribute('id', 'parkPic');
                parkInfo.textContent = parkDesc.replace('"', '').slice(0, -1);

                // append Elements here
                parkCardEl.appendChild(parkNameEl);
                parkCardEl.appendChild(parkImg);
                parkCardEl.appendChild(parkInfo);

                // appends entire created card Element to page
                resultsEl.appendChild(parkCardEl);

                var weatherURL = 'https://api.openweathermap.org/data/2.5/weather?zip=' + parkZIP + ',US&appid=a12e022cb62b59c204d6c4c7065d99c2&units=imperial'

                fetch(weatherURL)
                    .then(toJSON)
                    .then(function (weatherResults) {
                        console.log(weatherResults);
                        console.log(weatherResults.main.temp);
                        console.log(weatherResults.wind.speed);
                        console.log(weatherResults.weather[0].description);


                        //create Elements here
                        var tempEl = document.createElement('p');
                        var humidEl = document.createElement('p');
                        var windEl = document.createElement('p');
                        var condEl = document.createElement('p');

                        //dress up Elements here
                        tempEl.textContent = weatherResults.main.temp + '°F';
                        humidEl.textContent = 'Humidity: ' + weatherResults.main.humidity + '%';
                        windEl.textContent = 'Wind Speed: ' + weatherResults.wind.speed + ' mph';
                        condEl.textContent = 'Current Conditions: ' + capitalize(weatherResults.weather[0].description);

                        //append Elements here
                        var weatherCardEl = document.createElement('div');
                        weatherCardEl.setAttribute('id', 'weatherCard');

                        weatherCardEl.appendChild(tempEl);
                        weatherCardEl.appendChild(humidEl);
                        weatherCardEl.appendChild(windEl);
                        weatherCardEl.appendChild(condEl);

                        weatherCardsEl.appendChild(weatherCardEl);
                    })
            }
        })
}

function displayDate() {
    console.log(currentDate);

    var today = document.createElement('p');
    today.setAttribute('id', 'currentDate')
    today.textContent = 'Today\'s Date is: ' + currentDate

    formEl.appendChild(today);
}

displayDate();

submitBtnEl.addEventListener('click', logData);
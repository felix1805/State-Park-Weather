var userInputEl = document.querySelector('#stateSearch');
var submitBtnEl = document.querySelector('#submitBtn');
var formEl = document.querySelector('#form');
var resultsEl = document.querySelector('#results');
var weatherEl = document.querySelector('#weather');
var weatherCardsEl = document.querySelector('#weatherCards');
var formHeadEl = document.querySelector('#formHead')
var currentDate = moment().format('MMM Do');
var historyContainer = document.querySelector(".history-container");

// var lastSearches = localStorage.getItem('searchValues');

// function logData(event) {
//     event.preventDefault();
//     var userInputEl = document.querySelector('#stateSearch').value;
//     if (lastSearches && lastSearches.length) {
//         localStorage.setItem('searchValues', lastSearches + ',' + userInputEl);
//         console.log(lastSearches)
//     } else {
//         localStorage.setItem('searchValues', userInputEl);
//     }
//     getParks();
// }

function logData(event) {
    event.preventDefault();
    console.log("am i working");
    var lastSearches = JSON.parse(localStorage.getItem('searchValues')) || [];
    if(lastSearches.length>=5) {
        lastSearches.shift();
    }
    if(!lastSearches.includes(userInputEl.value)){
        lastSearches.push(userInputEl.value);
    }

    localStorage.setItem('searchValues', JSON.stringify(lastSearches));

    var historyItem = document.createElement('button');
    historyItem.setAttribute('id', 'historyItems');
    historyItem.textContent = userInputEl.value;
    historyContainer.appendChild(historyItem);

    displayHistory();
    getParks();
}

function displayHistory(){
    var lastSearches =( JSON.parse(localStorage.getItem('searchValues')) || []).reverse();
    historyContainer.innerHTML ="";
    for(var search of lastSearches){
        var historyItem = document.createElement('button');
        historyItem.setAttribute('id', 'historyItems');
        historyItem.textContent = search;
        historyContainer.appendChild(historyItem);
    }
}
displayHistory();

var toJSON = function (response) {
    return response.json();
}
var capitalize = function (string) {
    return string[0].toUpperCase() + string.slice(1);
}
function firstFive(zip) {
    return zip.substring(0, 5);
}

// function displaySearches () {
//     console.log(lastSearches);
// }
function displaySearches() {
    // retrieves searches
    var lastSearches = JSON.parse(localStorage.getItem('searchValues')) || [];
    console.log(lastSearches);
}

function renderWeather(card, parkZIP) {
    var weatherURL = 'https://api.openweathermap.org/data/2.5/weather?zip=' + parkZIP + ',US&appid=a12e022cb62b59c204d6c4c7065d99c2&units=imperial'
    fetch(weatherURL)
        .then(toJSON)
        .then(function (weatherResults) {
            //create Elements here
            var weathHeadEl = document.createElement('p');
            var tempEl = document.createElement('p');
            var humidEl = document.createElement('p');
            var windEl = document.createElement('p');
            var condEl = document.createElement('p');
            //dress up Elements here
            tempEl.textContent = weatherResults.main.temp + '°F';
            humidEl.textContent = 'Humidity: ' + weatherResults.main.humidity + '%';
            windEl.textContent = 'Wind Speed: ' + weatherResults.wind.speed + ' mph';
            condEl.textContent = 'Current Conditions: ' + capitalize(weatherResults.weather[0].description);
            weathHeadEl.textContent = 'Weather';
            weathHeadEl.setAttribute('id', 'weathHead');
            //append Elements here
            var weatherCardEl = document.createElement('div');
            weatherCardEl.setAttribute('id', 'weatherCard');
            weatherCardEl.appendChild(weathHeadEl);
            weatherCardEl.appendChild(tempEl);
            weatherCardEl.appendChild(humidEl);
            weatherCardEl.appendChild(windEl);
            weatherCardEl.appendChild(condEl);
            card.appendChild(weatherCardEl);
        })
}

function getParks(term) {
    resultsEl.innerHTML = '';
    weatherCardsEl.innerHTML = '';

    var stateCode = term || userInputEl.value 
    var parkURL = 'https://developer.nps.gov/api/v1/parks?stateCode=' +stateCode + '&limit=30&start=0&api_key=B93I9aQi7T1FM0mnp8EPcpawoqg1G1XYI6IVWLWy'
    
    
    fetch(parkURL)
        .then(toJSON)
        .then(function (results) {
            console.log(results);
            for (i = 0; i < results.data.length; i++) {
                var parkName = (JSON.stringify(results.data[i].fullName));
                var parkName = parkName.replace('"', '').slice(0, -1);
                var parkZIP = firstFive(results.data[i].addresses[0].postalCode);
                var parkDesc = (JSON.stringify(results.data[i].description))
                var parkAlt = (JSON.stringify(results.data[i].images[0].altText))
                var parkCardEl = document.createElement('div');
                parkCardEl.setAttribute('id', 'parkCard')
                // create Elements here
                var parkNameEl = document.createElement('h2');
                var parkImg = document.createElement('img');
                var parkInfo = document.createElement('p');
                // add things to Elements here
                parkNameEl.textContent = parkName;
                parkNameEl.setAttribute('id', 'parkName');
                parkImg.setAttribute('src', results.data[i].images[0].url);
                parkImg.setAttribute('alt', parkAlt.replace('"', '').slice(0, -1))
                parkImg.setAttribute('id', 'parkPic');
                parkInfo.textContent = parkDesc.replace('"', '').slice(0, -1);
                parkInfo.setAttribute('id', 'parkDesc');
                // append Elements here
                parkCardEl.appendChild(parkNameEl);
                parkCardEl.appendChild(parkImg);
                parkCardEl.appendChild(parkInfo);
                // appends entire created card Element to page
                resultsEl.appendChild(parkCardEl);
                renderWeather(parkCardEl, parkZIP);
            }
        })
}

var memeGif = document.createElement('button')
memeGif.setAttribute('id', 'meme')
formEl.prepend(memeGif);

function dump() {
    resultsEl.innerHTML = '';
    formEl.innerHTML = '';
    var memeTime = document.createElement('img');
    memeTime.setAttribute('src', 'https://media2.giphy.com/media/ZecVmf45WkpxbI9bEK/giphy.gif?cid=790b76115ae0031e747794cea370d416ebb3518499f3447a&rid=giphy.gif&ct=g');
    resultsEl.appendChild(memeTime);
}

memeGif.addEventListener('click', dump);

function displayDate() {
    var today = document.createElement('p');
    today.setAttribute('id', 'currentDate')
    today.textContent = 'Today\'s Date is: ' + currentDate
    formHeadEl.appendChild(today);
}
displayDate();
// displaySearches();
submitBtnEl.addEventListener('click', logData);
historyContainer.addEventListener('click',function(e){
    e.preventDefault();
    if(e.target.type==="submit"){
        var term = e.target.textContent;
        getParks(term);
    }
})
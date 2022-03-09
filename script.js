var userInputEl = document.querySelector('#stateSearch').value;
var submitBtnEl = document.querySelector('#submitBtn');
var formEl = document.getElementById('#form');
var resultsEl = document.querySelector('#results');

var toJSON = function (response) {
    return response.json();
};

// need to update so that localStorage saves userInputEl as an array entry, then create function to JSON.parse values from that array when they're needed
function logData(event) {
    event.preventDefault();
    var userInputEl = document.querySelector('#stateSearch').value;
    localStorage.setItem('searchValues', userInputEl);
    console.log(userInputEl);
    getParks();
}

function getParks() {
    var userInputEl = document.querySelector('#stateSearch').value;

    var parkURL = 'https://developer.nps.gov/api/v1/passportstamplocations?stateCode=' + userInputEl + '&limit=30&start=0&api_key=B93I9aQi7T1FM0mnp8EPcpawoqg1G1XYI6IVWLWy'

    console.log(parkURL);

    fetch(parkURL)
        .then(toJSON)
        .then(function (results) {
            console.log(results);

            for (i = 0; i < results.data.length; i++) {
                var parkName = (JSON.stringify(results.data[i].label));

                var parkCardEl = document.createElement('div');

                var parkNameEl = document.createElement('h2');
                parkNameEl.textContent = parkName;
                parkCardEl.appendChild(parkNameEl);

                resultsEl.appendChild(parkCardEl);
            }
        })

}

submitBtnEl.addEventListener('click', logData);
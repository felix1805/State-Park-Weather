var userInputEl = document.querySelector('#stateSearch').value;
var submitBtnEl = document.querySelector('#submitBtn');
var formEl = document.getElementById('#form');

var toJSON = function (response) {
    return response.json();
};

function logData(event) {
    event.preventDefault();
    var userInputEl = document.querySelector('#stateSearch').value;
    localStorage.setItem('searchValues', userInputEl);
    console.log(userInputEl);
    getParks();
}

function getParks() {
    var userInputEl = document.querySelector('#stateSearch').value;

    var parkURL = 'https://developer.nps.gov/api/v1/passportstamplocations?stateCode=' + userInputEl + '&limit=10&start=0&api_key=B93I9aQi7T1FM0mnp8EPcpawoqg1G1XYI6IVWLWy'

    console.log(parkURL);

    fetch(parkURL)
        .then(toJSON)
        .then(function (data) {
            console.log(data);

            console.log(JSON.stringify(data.data[0].label))
            console.log(JSON.stringify(data.data[0].parks[0].states))
        })

}

submitBtnEl.addEventListener('click', logData);
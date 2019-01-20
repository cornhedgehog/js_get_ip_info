var err = document.getElementById("error");
err.hidden = true;
var ipListArea = document.getElementById("ips");
var resultArea = document.getElementById("result");
var resultNumber = 0;
var ipsArr = [];

function sendRequest() {
    var inputArray = ipListArea.value.split("\n");
    resultArea.value = "number;ip;country\n";

    // From this service you can get information not more for 100 IPs for one request
    // Split IPs array to subarrays with 100 elements
    while (inputArray.length) {
        var subArray = inputArray.splice(0, 100);
        get(subArray.join());
    }
}

function get(ips) {
    var request = new XMLHttpRequest();
    request.open('GET', 'http://api.sypexgeo.net/json/' + ips, true);

    request.onload = function () {

        var data = JSON.parse(this.response);
        if (Array.isArray(data)) {
            ipsArr = data;
        } else {
            ipsArr.push(data);
        }
        if (request.status >= 200 && request.status < 400) {
            resultArea.value = "";
            ipsArr.forEach(ipData => {
                resultArea.value += ++resultNumber + "; " + ipData.ip + "; " + (ipData.country == null ? "-" : ipData.country.name_en) + '\n';
            });
            ipsArr = [];
        }
        else {
            err.hidden = false;
            const errorMessage = document.createElement('marquee');
            errorMessage.textContent = `Error`;
            err.appendChild(errorMessage);
        }
    };
    request.send();
    resultNumber = 0;
}
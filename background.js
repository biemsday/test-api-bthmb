const ENTRIPOINT = "https://global-openapi.bithumb.pro/openapi/v1";
const CURRENCY = "/spot/ticker"
const WALLET = "/spot/assetList";

var timestamp = Date.now();
var msgNo = Math.round(Math.random() * 1000);
var version = "V1.0.0";

//add event listner on GET button
var getButton = document.getElementById('getButton');
getButton.addEventListener('click', getFetch);

function getFetch() {

    const status = response => {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        }
        return Promise.reject(new Error(response.statusText))
    }

    const json = response => response.json()

    fetch(ENTRIPOINT + CURRENCY + "?symbol=ETH-USDT")
        .then(status)
        .then(json)
        .then(data => {
            var divGet = document.getElementsByClassName("value")
            var responseValue = document.createElement('p')
            responseValue.innerHTML = "<p>" + data.data[0].c + "</p>"
            responseValue.className = "value"
            divGet[0].replaceWith(responseValue)
        })
        .catch(error => {
            console.log('Request failed', error)
        })
}

//add event listner on POST button
var postButton = document.getElementById('postButton')
postButton.addEventListener('click', postFetch);

function postFetch() {

    var api = document.getElementById('user-apiKey');
    var secret = document.getElementById('user-secret');

    //do presignature key string
    var presignature = "apiKey=" + api + "&assetType=wallet" + "&msgNo=" + msgNo + "&timestamp=" + timestamp + "&version=" + version;

    //do signature
    var hash = CryptoJS.HmacSHA256(presignature, secret.value);
    var signature = CryptoJS.enc.Base64.stringify(hash).toLocaleLowerCase();

    //do body request
    var signaturedPayload = {
        apiKey: api.value,
        assetType: "wallet",
        msgNo: msgNo,
        timestamp: timestamp,
        version: version,
        signature: signature
    };

    //func for sending POST request
    sendFetch = async() => {
        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signaturedPayload)
        };
        try {
            const fetchResponse = await fetch(ENTRIPOINT + WALLET, settings);
            const data = await fetchResponse.json();
            console.log(data)
            return data;
        } catch (e) {
            return e;
        }
    }
    sendFetch();
}
const ENTRIPOINT = "https://global-openapi.bithumb.pro/openapi/v1";
const WALLET = "/spot/assetList?assetType=wallet";

var api = "2c021c65e7947617f60d193c929b1246";
var secret = "9356d6e1541385b75aa6ec59981d1ed4dcb5e9df6aec4c5f921dcd64e0ef55cd";
var timestamp = Date.now();
var msgNo = Math.round(Math.random() * 1000);
var version = "V1.0.0";

//add event listner on GET button
var getButton = document.getElementById('get');
getButton.addEventListener('click', getFetch);

function getFetch() {

    const status = response => {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        }
        return Promise.reject(new Error(response.statusText))
    }

    const json = response => response.json()

    fetch(ENTRIPOINT)
        .then(status)
        .then(json)
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.log('Request failed', error)
        })

}

//add event listner on POST button
var postButton = document.getElementById('post')
postButton.addEventListener('click', postFetch);

function postFetch() {

    //do presignature key string
    var presignature = "apiKey=" + api + "&assetType=wallet" + "&msgNo=" + msgNo + "&timestamp=" + timestamp + "&version=" + version;

    //do signature
    var hash = CryptoJS.HmacSHA256(presignature, secret);
    var signature = CryptoJS.enc.Base64.stringify(hash).toLocaleLowerCase();

    //do body request
    var signaturedPayload = {
        apiKey: api,
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
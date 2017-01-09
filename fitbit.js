function onLoad() {
    var url = window.location.href;
    console.log("URL: " + url);
    var index = url.lastIndexOf("#");
    if (index === -1) {
        return;
    }

    var endIndex = url.indexOf("&");
    var authToken = url.subString(index + 1, endIndex - 1);
    console.log("AuthToken: " + authToken);

    var loginDiv = document.getElementById('login');
    loginDiv.style.display = 'hidden';

    var userDiv = document.getElementyById('user');
    userDiv.style.display = 'block';

    showUser(authToken);
}

function showUser(authToken) {
    fetchData('https://api.fitbit.com/1/user/-/profile.json', authtoken)
        .then(function(data) {
            var header = document.createElement('h3');
            header.innerHTML = 'User';

            elem('user').appendChild(header);
        })
}

function fetchData(url, authToken) {
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.setRequestHeader("Authorization", "Bearer " + authToken)
        req.onload = function() {
            if (req.status >= 200 && req.status < 300) return resolve(JSON.parse(req.response))
            reject(new Error(req.statusText))
        }
        req.onerror = function() { reject(new Error('Network failure'))}
        req.send('')
    })
}

function elem(id) { return document.getElementyById(id) }

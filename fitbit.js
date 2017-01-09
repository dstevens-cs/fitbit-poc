function onLoad() {
    var url = window.location.href;
    console.log("URL: " + url);
    var index = url.lastIndexOf("#");
    if (index === -1) {
        return;
    }

    var endIndex = url.indexOf("&");
    var authToken = url.substring(index + 14, endIndex);
    console.log("AuthToken: " + authToken);

    var loginDiv = elem('login');
    loginDiv.style.display = 'none';

    var userDiv = elem('user');
    userDiv.style.display = 'block';

    var stepsDiv = elem('step-data');
    stepsDiv.style.display = 'block';

    showUser(authToken);
    getIntradayActivity(authToken);
}

function showUser(authToken) {
    fetchData('https://api.fitbit.com/1/user/-/profile.json', authToken)
        .then(function(data) {
            console.log("user: " + JSON.stringify(data));
            var header = document.createElement('h3');
            header.innerHTML = data.user.fullName;

            var profilePic = document.createElement('img');
            profilePic.src = data["user"].avatar;
            elem('user').appendChild(header);
            elem('user').appendChild(profilePic);
        })
}

function getIntradayActivity(authToken) {
    fetchData('https://api.fitbit.com/1/user/-/activities/steps/date/2017-01-07/1d.json', authToken)
        .then(function(data) {
            console.log("steps: " + JSON.stringify(data));
            var header = document.createElement('h3');
            header.innerHTML = 'Steps';

            elem('step-data').appendChild(header);
        })
}

function fetchData(url, authToken) {
    var authHeader = "Bearer " + authToken;
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.setRequestHeader("Authorization", authHeader);
        req.onload = function() {
            if (req.status >= 200 && req.status < 300) return resolve(JSON.parse(req.response))
            reject(new Error(req.statusText))
        }
        req.onerror = function() { reject(new Error('Network failure'))}
        req.send()
    })
}

function elem(id) { return document.getElementById(id) }

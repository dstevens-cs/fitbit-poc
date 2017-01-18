function onLoad() {
    var url = window.location.href;
    var index = url.lastIndexOf("#");
    if (index === -1) {
        return;
    }

    var endIndex = url.indexOf("&");
    var authToken = url.substring(index + 14, endIndex);

    var loginDiv = elem('login');
    loginDiv.style.display = 'none';

    var userDiv = elem('user');
    userDiv.style.display = 'block';

    showUser(authToken);
    showData(authToken);
}

function showData(authToken) {
    getIntradayData(authToken, 'steps')
        .then(function(stepData) {
            getIntradayData(authToken, 'heart')
                .then(function(hrData) {
                    var header = document.createElement('h3');
                    header.innerHTML = 'Steps on ' + stepData["activities-steps"][0].dateTime + ": " + stepData["activities-steps"][0].value;
                    elem('fitbit-data').appendChild(header);

                    var data = {};
                    for(var stepObj in stepData["activities-steps-intraday"].dataset) {
                        data[stepObj] = stepData["activities-steps-intraday"].dataset[stepObj];
                        for(var hrObj in hrData["activities-heart-intraday"].dataset) {
                            if (hrData["activities-heart-intraday"].dataset[hrObj].time === stepData["activities-steps-intraday"].dataset[stepObj].time) {
                                data[stepObj].hr = hrData["activities-heart-intraday"].dataset[hrObj].value;
                            } else {
                                data[stepObj].hr = 'N/A';
                            }
                        }
                    }

                    console.log("data: " + JSON.stringify(data));
                    
                    drawTable(stepData["activities-steps-intraday"].dataset, hrData["activities-heart-intraday"].dataset);
                })
        })
}

function showUser(authToken) {
    fetchData('https://api.fitbit.com/1/user/-/profile.json', authToken)
        .then(function(data) {
            var header = document.createElement('h3');
            header.innerHTML = data.user.fullName;

            var profilePic = document.createElement('img');
            profilePic.src = data.user.avatar;
            elem('user').appendChild(header);
            elem('user').appendChild(profilePic);
        })
}

function getIntradayData(authToken, endpoint) {
    //var date = getDate();
    var url = 'https://api.fitbit.com/1/user/-/activities/' + endpoint + '/date/today/1d.json';
    return fetchData(url, authToken)
}

function drawTable(stepData, hrData) {
    var table = document.createElement('table');
    var tableHeader = document.createElement('tr');
    var timeHeader = document.createElement('th');
    timeHeader.innerHTML = 'Time';
    tableHeader.appendChild(timeHeader);

    var stepsHeader = document.createElement('th');
    stepsHeader.innerHTML = 'Steps';
    tableHeader.appendChild(stepsHeader);

    var hrHeader = document.createElement('th');
    hrHeader.innerHTML = 'Heartrate';
    tableHeader.appendChild(hrHeader);

    table.appendChild(tableHeader);

    stepData.map(function(obj) {
        var tableRow = document.createElement('tr');
        var timeCell = document.createElement('td');
        timeCell.innerHTML = obj.time;
        tableRow.appendChild(timeCell);

        var stepCell = document.createElement('td');
        stepCell.innerHTML = obj.value;
        tableRow.appendChild(stepCell);

        var hrCell = document.createElement('td');
        var hr = hrData[obj.key];
        if (hr == null) {
            hrCell.innerHTML = 'N/A'
        } else {
            hrCell.innerHTML = hr.value;
        }
        tableRow.appendChild(hrCell);

        table.appendChild(tableRow);
    })

    elem('fitbit-data').appendChild(table);
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

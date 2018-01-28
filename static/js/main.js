
// Query weather api--must be done on frontend


function getHeatIndex(T,R){
    R = R/100;
    c1 = -42.379;
    c2 = 2.049;
    c3 = 10.143;
    c4 = -0.224775;
    c5 = -0.00683783;
    c6 = -0.05481;
    c7 = 0.0012287;
    c8 = 0.0008528;
    c9 = -0.00000199;

    return (c1 + c2 * T + c3 * R + c4 * T * R + 
        c5 * T * T 
            + c6 * R * R + c7 * T * T * R + c8 * T * R * R 
            + c9 * T * T * R * R );
}

function getWeather(){
    // Get weather data
    zipcode = '33101';
    key = "f123ec11eb36daac9c3f5ef9a26c5ab6";
    $.getJSON("http://api.openweathermap.org/data/2.5/forecast?zip=" + zipcode + "&APPID=" + key ,function(json){
        var output = JSON.stringify(json, null, 2);
        var jsonParsed = JSON.parse(output);
        //console.log(typeof(jsonParsed.list[34].rain["3h"]));
        console.log(jsonParsed);
        var inputs = new Array();
        var outputs = new Array();
        for (var i = 0; i<40; i++){
            inputs.push(0);
            // outputs.push(0);
        };

        for (var i = 0; i < 40; i++) {
            var temperature = ((jsonParsed.list[i].main.temp) * (9.0/5.0)) - 459.67;
            var humidity = jsonParsed.list[i].main.humidity;
            var rain = typeof(jsonParsed.list[i].rain) === "undefined" || typeof(jsonParsed.list[i].rain["3h"]) === "undefined" ? 0 : parseFloat(jsonParsed.list[i].rain["3h"]);
            var snow = typeof(jsonParsed.list[i].snow) === "undefined" || typeof(jsonParsed.list[i].snow["3h"]) === "undefined" ? 0 : parseFloat(jsonParsed.list[i].snow["3h"]);
            var precipitation = rain + snow;
            heatIndex = getHeatIndex(temperature, humidity);

            inputs[i] = {
                Var2: String(precipitation), 
                Var1: String(heatIndex) // Humidity actually means heat index
            };
            setTimeout(getPrediction(inputs[i], function(d){
                outputs.push(d);
            }) ,100);
        }
        console.log('about to print final')
        var thing = [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 
               0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 
               0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 
               1, 1, 1, 0, 0, 0, 0, 1, 1, 1];
        setTimeout(function(){
            console.log(outputs);
            console.log('here');
            getBestAvailable(outputs, thing);
        }, 5000)

    });
}

function genListTxt(i){
    var total = ''
    a = Array(i);
    a.forEach(function(d, i){
        total += 'hi' + parseInt(d) + 'bye';
    });
    console.log(total);
}
console.log(genListTxt(10));

function getBestAvailable(forty_outputs, available_times){
    console.log('running get best available');
    paired = new Array();
    forty_outputs.forEach(function(d, i){
        paired.push({
            danger: forty_outputs[i],
            index: i,
            available: available_times[i]
        })
    })
    paired = paired.filter(function(d){ return d.available === 1; });
    paired.sort(function(a, b){ 
        if (a.danger < b.danger){
            return -1;
        }
        else {
            return 1;
        }
    })


    var num_teams = $('#num_teams').val();
    console.log(num_teams);
    var txt = ('<ul>' + genListTxt(3) + '</ul>');
    

    $('#list-div').html(txt);
}

function findGames(){
    console.log('about to ajax');
    var json = {
        'hi': 'there'
    };
    $.ajax({
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(json),
        url: '/games/',
        success: function(data){
            console.log('success function running in frontend');
            console.log(data);
        },
        failure: function(result){
            console.log('error');
        error();
        }
    });
    // redirect to thank you
    // window.location.href = '/thanks';
}

function addDates(){
    console.log('about to ajax');
    var json = {
        'hi': 'there'
    };
    $.ajax({
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(json),
        url: '/games/',
        success: function(data){
            console.log('success function running in frontend');
            console.log(data);
        },
        failure: function(result){
            console.log('error');
        error();
        }
    });
    // redirect to thank you
    // window.location.href = '/thanks';
}

// function getPredictions(in_list){
//     var arr = new Array(40);
//     console.log('get predictions');
    
//     for(var i=0; i++; i<40){
//         console.log('here');
//         console.log(i);
//         // arr[i] = getPrediction(in_list[i]);
//     }
// }

function getPrediction(params, callback){
    console.log(params);
    console.log('Get prediction called with params');
    console.log(params);
    $.ajax({
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(params),
        url: '/injuries/',
        success: function(data){
            // console.log('success function running in frontend');
            // console.log(data);
            return callback(data.Prediction.predictedValue);
        },
        failure: function(result){
            console.log('error');
        error();
        }
    });
    // redirect to thank you
    // window.location.href = '/thanks';
}
$(document).ready(function(){
    document.getElementById("predict").onclick = function(){
        getPrediction()
    };

    document.getElementById("add").onclick = function(){
        addDates()
    };

    document.getElementById("find").onclick = function(){
        findGames()
    };

    document.getElementById("weather").onclick = function(){
        getWeather()
    };
});
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const readline = require('readline-sync')

async function getBusTimes(){

    // console.log("enter a stop code")
    // stopCode = readline.prompt()
    let stopCode = "490015367S";

    var url = "https://api.tfl.gov.uk/StopPoint/" + stopCode + "/Arrivals"

    let busData = await fetch(url).then(response => response.json())
    // console.log(busData)

    console.log(busData)

    sortedBusData = busData.sort(function(first, second) {
        return first.timeToStation - second.timeToStation;
    });
        
    for (let i = 0; i<5; i++){
        console.log(sortedBusData[i].lineName)

    }


}


getBusTimes()

function getLatandLong(){

}

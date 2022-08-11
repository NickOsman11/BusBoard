const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const readline = require('readline-sync')
const response = await fetch(url)
const busData = await response.json

function getBusTimes(){

    console.log("enter a stop code")
    stopCode = readline.prompt()

    var url = "https://api.tfl.gov.uk/StopPoint/" + stopCode + "/Arrivals"



    console.log(busData)

    // for (let i = 0; i<5; i++){
    //     console.log(busData[i].timeToStation)
    // }
}

getBusTimes()


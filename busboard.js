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


async function getLatandLong(postcode){

    let baseurl = 'http://api.postcodes.io/postcodes/'
    let postcodedata

    let validationurl = baseurl + postcode + '/validate'
    let valid = await fetch(validationurl).then(response => response.json())

    if (valid.result){
        let postcodeurl = baseurl + postcode
        postcodedata = await(fetch(postcodeurl).then(response => response.json()))
    }

    let latitude = postcodedata.result.latitude
    let longitude = postcodedata.result.longitude

    return [latitude, longitude]

}



async function getStopPoints(postcode){
    let latandlong = await getLatandLong(postcode)
    let lat = latandlong[0]
    let lon = latandlong[1]
    let stopTypes = ['NaptanOnstreetBusCoachStopPair']
    let radius = [1000]


    let url = `https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=${stopTypes}&radius=${radius}`

    let stoppoints = await(fetch(url).then(response => response.json()))

    console.log(stoppoints)
}

getStopPoints('N16%205BN')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const readline = require('readline-sync')

async function getBusTimes(stopCode){

    // console.log("enter a stop code")
    // stopCode = readline.prompt()
    // let stopCode = "490012572E";
    console.log(stopCode)
    var url = "https://api.tfl.gov.uk/StopPoint/" + stopCode + "/Arrivals"
    let busData = await fetch(url).then(response => response.json())

    sortedBusData = busData.sort(function(first, second) {
        return first.timeToStation - second.timeToStation;
    });

    let sortedBusList = sortedBusData.map(x => x.lineName)

    return sortedBusList





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
    let stopTypes = ['NaptanPublicBusCoachTram']
    let radius = [500]


    let url = `https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=${stopTypes}&radius=${radius}`

    let stoppoints = await(fetch(url).then(response => response.json()))

    stoppointslist = stoppoints.stopPoints
    


    let sortedstops = stoppointslist.sort(function(first, second) {
        return first.distance - second.distance;
    });

    // console.log(sortedstops[0].id)
    stopArray = []
    sortedstops.slice(0,2).forEach(stop => stopArray.push(stop.id))
    console.log(stopArray)

    for (let i = 0; i<2; i++){
        console.log("stop array ", i, stopArray[i])
        getBusTimes((stopArray[i])).then(x => console.log(x))
    }
    // stopArray.forEach(x => (await getBusTimes(x)))

    
}
// let busTimes = getBusTimes("490012572E").then(x => console.log(x))

console.log(getStopPoints('N16%205BN'))
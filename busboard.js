const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const readline = require('readline-sync')

async function getBusTimes(stopCode){

    var url = "https://api.tfl.gov.uk/StopPoint/" + stopCode + "/Arrivals"
    let busData = await fetch(url).then(response => response.json())
    // console.log(busData)

    sortedBusData = busData.sort(function(first, second) {
        return first.timeToStation - second.timeToStation;
    });

    let sortedBusList = sortedBusData.map(x => x.lineName)

    return sortedBusList
}

async function getLatandLong(postcode){

    let baseurl = 'http://api.postcodes.io/postcodes/'
    let postcodedata

    let postcodeurl = baseurl + postcode
    postcodedata = await(fetch(postcodeurl).then(response => response.json()))

    let latitude = postcodedata.result.latitude
    let longitude = postcodedata.result.longitude

    return [latitude, longitude]

}

async function busBoard(){
    let postcode = await getValidPostcode()
    let latandlong = await getLatandLong(postcode)
    let lat = latandlong[0]
    let lon = latandlong[1]
    let stopTypes = ['NaptanPublicBusCoachTram']

    stopArray = await getStopPoints(lat, lon, stopTypes)

    let output = []

    // write this better and also add in bustimes
    for (let i = 0; i<stopArray.length; i++){
        let dict = {};
        console.log(stopArray[i])
        let times = await getBusTimes((stopArray[i])).then(x => console.log(x))
        dict[stopArray[i]] = times
        output.push(dict)
    }

    return output
}

async function getValidPostcode(){

    let postcodeIsValid; 
    let postcode;
    console.log("Enter a postcode")
    postcode = readline.prompt()

    do
    {
        try
        {
            let url = `https://api.postcodes.io/postcodes/${postcode}/validate`
            postcodeIsValid = await fetch(url)
                                    .then(x => x.json())

            if (postcodeIsValid.status != 200){
                throw "connection"
            }
            if (!postcodeIsValid.result){
                throw "invalid"
            }
        }
        catch (error){
            if (error === "connection"){
                console.log("Connection error, check connection and "
                            + "press enter to try again")
                readline.prompt()
            }
            if (error === "invalid"){
                console.log("Invalid postcode, try again:")
                postcode = readline.prompt()
            }
        }
    } while(!postcodeIsValid.result)

    return postcode
}

async function getStopPoints(lat, lon, stopTypes){
    console.log('please enter a distance')
    let radius = Math.min(readline.prompt(), 1000)
    let stoppointslist = []

    do{
        try{
            let url = `https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=${stopTypes}&radius=${radius}`
            let stoppoints = await(fetch(url).then(response => response.json()))
            stoppointslist = stoppoints.stopPoints

            if (stoppointslist.length == 0){

                throw `no stoppoints within distance`
            }
        }
        catch(error){
            if (error == 'no stoppoints within distance')
            console.log(`no stoppoints ${radius} m of this postcode. please extend try extending the radius`)
            radius = readline.prompt()
        }
    } while (stoppointslist.length == 0)
    
    let stopArray;

    if (stoppointslist.length == 1){
        stopArray = stoppointslist.map(stop => stop.id)
    } else{

        let sortedstops = stoppointslist.sort(function(first, second) {
            return first.distance - second.distance;
        });
        stopArray = sortedstops.slice(0,2).map(stop => stop.id)

    }

    return stopArray
}
busBoard()
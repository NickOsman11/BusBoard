async function getStopPoints(){
    let postcode = await getValidPostcode()
    let latandlong = await getLatandLong(postcode)
    let lat = latandlong[0]
    let lon = latandlong[1]
    let stopTypes = ['NaptanPublicBusCoachTram']
    let radius = [1]

    let url = `https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=${stopTypes}&radius=${radius}`

    let stoppoints = await(fetch(url).then(response => response.json()))

    stoppointslist = stoppoints.stopPoints

    let sortedstops = stoppointslist.sort(function(first, second) {
        return first.distance - second.distance;
    });

    stopArray = sortedstops.slice(0,2).map(stop => stop.id)

    let output = []
    for (let i = 0; i<2; i++){
        let dict = {};
        console.log(stopArray[i])
        let times = await getBusTimes((stopArray[i])).then(x => console.log(x))
        dict[stopArray[i]] = times
        output.push(dict)
    }

    return output
}

import request from 'request'

var token = "rlQkjaWAELGlRjdMyoRMPZdryEMZTsXj"

var urls = {
    AQ: "https://api.openaq.org/v1/cities",
    ncdc: "https://www.ncdc.noaa.gov/cdo-web/api/v2/datasets"
}

export async function scrapping(req, res) {
    var url = urls[req.params.type]
    request({
        url:url,
        headers: {
            'User-Agent': 'request',
            'Token': token
          }
    }, (err, result, body) => {
        if (err) { console.log(err); res.send(err) }
        res.send(body)
    })
}


const express = require('express');
const path = require('path');
const { default: axios } = require("axios");
const moment = require('moment');
const cors = require('cors');
const multer = require('multer');
const upload = multer();
require('dotenv').config();

const app = express();
app.use(cors());

app.set("view engine", "pug")

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/users")

    res.render('index', {
        users: data
    })
    console.log(data)
})

app.get('/metro', async (req, res) => {
    try {
    const { data } = await axios.get("https://api.transport.nsw.gov.au/v1/tp/add_info?outputFormat=rapidJSON&filterMOTType=2&filterPublicationStatus=current&version=10.2.1.42",
        {
            headers: {
                'Authorization': `${process.env.API_KEY}`,
                "content-type": "application/json"
            }
        })
    var moment = require('moment');
    res.render('metro', {
        notifications: data,
        moment: moment

    })

} catch(err) {
    console.log(err)
} 

})

app.get('/carpark', async (req, res) => {
    try {
    var moment = require('moment');
    res.render('carpark')
    } catch(err) {
        console.log(err)
    }

});

app.post('/carpark', upload.any(), async (req, res) => {
    try {
    const station = JSON.parse(JSON.stringify(req.body.station))
    console.log(station)
    var moment = require('moment');
    const date = new Date();
    const lastweekDate = date.setDate(date.getDate() - 7);
    const lastweekDateFormatted = moment(lastweekDate).format("YYYY-MM-DD")
    const lastweekDateTitle = moment(lastweekDate).format("dddd MMM Do YYYY")
    console.log(lastweekDateTitle)


    let endpoints = [
        `https://api.transport.nsw.gov.au/v1/carpark?facility=${station}`,
        `https://api.transport.nsw.gov.au/v1/carpark/history?facility=${station}&eventdate=${lastweekDateFormatted}`
    ];

    Promise.all(endpoints.map((endpoint) => axios.get(endpoint,
        {
            headers: {
                'Authorization': `${process.env.API_KEY}`,
                "content-type": "application/json"
            }
        }
    ))).then(
        axios.spread((...allData) => {
            const stationInfo = allData[0]
            const stationHistory = allData[1]
            var moment = require('moment');
            const facilityname = stationInfo.data.facility_name
            const totalspots = stationInfo.data.spots
            const occupiedspots = stationInfo.data.occupancy.total
            const availablespots = totalspots - occupiedspots
            const availablespotspercentage = Math.round((availablespots / totalspots) * 100)
            const messageDate = stationHistory.data
            res.send({
                facilityname: facilityname,
                totalspots: totalspots,
                occupiedspots: occupiedspots,
                availablespots: availablespots,
                availablespotspercentage: availablespotspercentage,
                messageDate: messageDate,
                lastweekDateTitle: lastweekDateTitle,
                moment: moment
            })
        })
    )
    } catch(err) {
        console.log(err)
    }
})

app.listen(process.env.PORT, () => {
    console.log("App listening")
})
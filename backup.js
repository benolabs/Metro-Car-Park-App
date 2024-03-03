doctype html 
html 
    head 
        link(rel="stylesheet" href="style.css")
        script(src='https://cdnjs.cloudflare.com/ajax/libs/axios/0.27.2/axios.min.js')

    body
      form(id= "form")
        select(id= "selector" name= "station")
          each station, key in {1: 'Kellyville', 2: 'Castle Hill', 30: 'Bellavista'}
            option(value= key)= station
        input(type='submit', value='Submit')

        div(id= "stationNum")

      script.
        showResult()
        function showResult() {
        
        let select = document.getElementById("selector")
        select.addEventListener("change", function () {
        let data = select.value
        console.log(data)
        })
        const form = document.querySelector("form")
        form.addEventListener('submit', (e) => {
        //e.preventDefault();
        const formData = new FormData(form)
        axios.post('http://127.0.0.1:3000/carpark', formData)
        .then(res => document.getElementById("stationNum").innerHTML = res.data.content)
        .catch(err => console.log(err))
        })
       
        }
      

    br
    br
    br

table.tablestyle 
    thead 
        tr 
          th Facility Name
          th Total Parking Spots
          th Total Occupied Spots
          th Total Available Spots

    tbody
        tr
            td= carspot.facility_name
            td= carspot.spots
            td= carspot.occupancy.total
            td= availablespots 
          
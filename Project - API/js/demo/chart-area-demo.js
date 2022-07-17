// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

const grafica = document.querySelector("#myAreaChart")



function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

// Area Chart Example
//var ctx = document.getElementById("myAreaChart");
/*var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
      label: "Earnings",
      lineTension: 0.3,
      backgroundColor: "rgba(78, 115, 223, 0.5)",
      borderColor: "rgba(78, 115, 223, 1)",
      pointRadius: 3,
      pointBackgroundColor: "rgba(78, 115, 223, 1)",
      pointBorderColor: "rgba(78, 115, 223, 1)",
      pointHoverRadius: 3,
      pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
      pointHoverBorderColor: "rgba(78, 115, 223, 1)",
      pointHitRadius: 10,
      pointBorderWidth: 2,
      data: [0, 10000, 5000, 15000, 10000, 20000, 15000, 25000, 20000, 30000, 25000, 40000],
    }],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          maxTicksLimit: 5,
          padding: 10,
          // Include a dollar sign in the ticks
          callback: function(value, index, values) {
            return '$' + number_format(value);
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
        }
      }
    }
  }
});*/



//Retorna un array con los ID disponibles de los objectos
function validID() {
  return fetch("https://collectionapi.metmuseum.org/public/collection/v1/objects")
    .then(response => response.json())
    .then(data => {
      //Retorna un object 
      return data.objectIDs;
    })
    .catch(err => console.error(err))
}

async function showTotalObjects() {
  let totalObjects = await validID()
  let areaTotalObjects = document.getElementById('quantity-objects')
  areaTotalObjects.innerHTML = totalObjects.length
}


//Retorna un registro para un objeto pasandose como parametro el ID
//Crea la ruta para obtener el registro.
function getObjectByID(objectID) {
  let pathObject = "https://collectionapi.metmuseum.org/public/collection/v1/objects/" + objectID

  // Retorna una promesa 
  return fetch(pathObject)
    .then(response => response.json())
    .then(data => {
      //Se creara el objeto con los campos necesarios
      let artworkDetails = {
        objectID: data.objectID,
        title: data.title,
        primaryImageSmall: data.primaryImageSmall,
        country: data.country,
        accesionYear: data.accesionYear,
        repository: data.repository,
        isHighlight: data.isHighlight,
        isPublicDomain: data.isPublicDomain,
        department: data.department,
        culture: data.culture,
        artistDisplayName: data.artistDisplayName,
        artistDisplayBio: data.artistDisplayBio,
        artistBeginDate: data.artistBeginDate,
        artistEndDate: data.artistEndDate,
        objectBeginDate: data.objectBeginDate,
        objectEndDate: data.objectEndDate,
        classification: data.classification

      }
      return artworkDetails;
    })
    .catch(err => console.error(err))
}

async function saveObjects() {
  //let arrayID = await validID(); // Funcion asincrona que recupera 488k de ID 
  let allObjects = []
  let container = document.getElementById('loader')
  if (localStorage.length > 0) {
    container.style.visibility = 'hidden';
    container.style.opacity = '0'
  }

  for (let i = 6500; i < 6600; i++) {
    let _Object = await getObjectByID(i);
    allObjects.push(_Object)
  }
  localStorage.setItem("artWorks", JSON.stringify(allObjects))
  container.style.visibility = 'hidden';
  container.style.opacity = '0'
}

function getCurrentIdObjects() {
  let local = JSON.parse(localStorage.getItem("artWorks"))
  let labelID = document.getElementById('quantity-id-used')
  labelID.innerHTML = local[0].objectID + " - " + local[local.length - 1].objectID
}




//Funcion que obtiene la cantidad de obras de arte por pais
function filterCountry() {
  let local = JSON.parse(localStorage.getItem("artWorks"));
  let conteo = {}
  for (const d of local) {
    if (conteo[d.country]) {

      conteo[d.country] += 1;
    } else {
      if (d.country != "" && d.country != undefined) {

        conteo[d.country] = 1;
      }
    }
  }
  return conteo;
}

// Funcion que filtra las obras de arte de acuerdo a su cultura.
function filterCulture() {
  let local = JSON.parse(localStorage.getItem("artWorks"));
  let departamentosCultura = {}
  for (const d of local) {
    if (departamentosCultura[d.culture]) {
      departamentosCultura[d.culture] += 1;
    } else {
      if (d.culture != "" && d.culture != undefined) {
        departamentosCultura[d.culture] = 1;
      }
    }
  }
  return departamentosCultura
}

// Funcion que filtra los artistas que murieron ordenado de mayor a menor
function filterDate() {
  let local = JSON.parse(localStorage.getItem("artWorks"));
  let dateEndArray = []
  let sortArray = local.sort((a, b) => a.artistEndDate - b.artistEndDate)
  sortArray.map(e => {
    if (e.artistEndDate != 0 || e == {}) {
      dateEndArray.push(e)
    }
  })
  return dateEndArray
}

// Funcion que retorna un array de fechas donde se comenzo hacer la obra ordenada.
function objectDate() {
  let local = JSON.parse(localStorage.getItem("artWorks"));
  let objectDateArray = []
  let sortObjectDate = local.sort((a, b) => a.objectBeginDate - b.objectBeginDate)
  sortObjectDate.map(e => {
    if (e.objectBeginDate != 0 || e == {}) {
      objectDateArray.push(e)
    }
  })
  return objectDateArray
}

// LLena el campo de opciones de graficos
function fillOptionCharts() {
  let templateCountry = `<option value="1">Por pais</option>`
  let templateCulture = `<option value="2">Por cultura</option>`

  document.querySelector('div.input-group-grafico > select').innerHTML += templateCountry
  document.querySelector('div.input-group-grafico > select').innerHTML += templateCulture
}

// Llena la etiqueta select con las obras.
function fillOptions() {
  let local = JSON.parse(localStorage.getItem("artWorks"));
  local.map((e) => {
    let template = `<option value="${e.objectID}">${e.title}</option>`
    document.querySelector('div.input-group > select').innerHTML += template;
  })
}

// Muestra cada arte segun la opcion de la etiqueta select
function showDescriptionWorks(index) {
  let local = JSON.parse(localStorage.getItem("artWorks"));
  local.map((e) => {
    if (e.objectID === Number(index)) {
      let template = `<div class="card" style="width: 18rem;">
      <img class="card-img-top" src="${e.primaryImageSmall === "" ? e.primaryImageSmall = "No existe imagen" : e.primaryImageSmall}" alt="No existe imagen">
      <div class="card-body">
        <h5 class="card-title">${e.title}</h5>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Pais: ${e.country}</li>
        <li class="list-group-item">Artista: ${e.artistDisplayName === "" ? e.artistDisplayName = "Desconocido" : e.artistDisplayName}</li>
        <li class="list-group-item">${e.artistBeginDate === "" ? e.artistBeginDate = "Desconocido" : e.artistBeginDate} - ${e.artistEndDate === "" ? e.artistEndDate = "Desconocido" : e.artistEndDate}</li>
        <li class="list-group-item">Clasificacion: ${e.classification === "" ? e.classification = "Desconocido" : e.classification}</li>
      </ul>
    </div>`
      document.getElementById('tarjeta').innerHTML += template;
    }
  })
}

// Muestra el grafico respecto a la opcion elegida
function createChartCulture(index) {
  const grafica = document.querySelector("#myAreaChart")
  let arregloCulturas = filterCulture();
  const axisX = Object.keys(arregloCulturas);
  const axisY = Object.values(arregloCulturas);

  const cantidadCulturas = {
    label: "Culturas Distintas",
    data: axisY,
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    borderColor: 'rgba(52, 162, 235, 1)',
    borderWidth: 1,
  };

  return new Chart(grafica, {
    type: 'bar',
    data: {
      labels: axisX,
      datasets: [
        cantidadCulturas,
      ]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }],
      },
    },
  })

}

// Muestra el grafico con los paises y la cantidad de obras de artes
function createChartCountry() {
  const grafica = document.querySelector("#myAreaChart")
  let arregloPaises = filterCountry()

  const ejeX = Object.keys(arregloPaises)
  const ejeY = Object.values(arregloPaises)

  const cantidadPaises = {
    label: "Cantidad de obras por pais",
    data: ejeY,
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    borderColor: 'rgba(52, 162, 235, 1)',
    borderWidth: 1,
  };

  return new Chart(grafica, {
    type: 'bar',
    data: {
      labels: ejeX,
      datasets: [
        cantidadPaises,
      ]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }],
      },
    },
  })
}

// Llena las opciones de filtrado de la tabla
function fillOptionTable() {
  let date = filterDate();
  let templateThreeObject = `<option value="3">Los 3 primeros</option>`
  let templateTenObject = `<option value="10">Los 10 primeros</option>`
  let templateAllObject = `<option value="${date.length}">Todos</option>`

  document.querySelector('div.input-group-table > select').innerHTML += templateThreeObject
  document.querySelector('div.input-group-table > select').innerHTML += templateTenObject
  document.querySelector('div.input-group-table > select').innerHTML += templateAllObject
}

//Llena dinamicamente la tabla 
function fillTable(quantityFilter) {
  let returnDate = filterDate();
  let labelTable = document.getElementById('content-body-table')

  for (let i = 0; i < Number(quantityFilter); i++) {
    let templateDate = `<tr>
    <td><a href="#">${returnDate[i].objectID}</a></td>
    <td>${returnDate[i].title}</td>
    <td>${returnDate[i].country}</td>
    <td>${returnDate[i].department}</td>
    <td><span class="badge badge-success">${returnDate[i].culture}</span></td>
    <td>${returnDate[i].objectBeginDate}</td>
    <td>${returnDate[i].artistEndDate}</td>
  </tr>
  <tr>`
    labelTable.innerHTML += templateDate
  }
  console.log(returnDate)
}



document.getElementById('seleccion').addEventListener('change', (evt) => {
  let selection = document.querySelector('div.input-group > select');
  let indexOption = selection.options[selection.selectedIndex].value;
  document.getElementById('tarjeta').innerHTML = "";
  showDescriptionWorks(indexOption);
})

document.getElementById('grafico').addEventListener('change', (evt) => {
  let opcion = document.querySelector('div.input-group-grafico > select');
  let indexOp = opcion.options[opcion.selectedIndex].value;

  switch (indexOp) {
    case "1":
      createChartCountry();
      break;
    case "2":
      createChartCulture();
      break;

    default:
      //grafica.innerHTML = ""
      break;
  }
})

document.getElementById('tabla').addEventListener('change', (evt) => {
  let opcionTabla = document.querySelector('div.input-group-table > select');
  let indexTable = opcionTabla.options[opcionTabla.selectedIndex].value
  let dateTable = filterDate();
  document.getElementById('content-body-table').innerHTML = ""
  switch (indexTable) {
    case "3":

      fillTable(Number(indexTable))
      break;
    case "10":

      fillTable(Number(indexTable))
      break;
    case String(dateTable.length):

      fillTable(Number(indexTable))
      break;
    default:
      //grafica.innerHTML = ""
      break;
  }
})


validID();
getCurrentIdObjects();
saveObjects();
filterCountry();
filterDate()
objectDate();
fillOptions()
fillOptionCharts();
fillOptionTable();
filterCulture();
fillTable();
showTotalObjects();
function traeIndicadores() {
  var region = document.getElementById("selectRegion") || false;
  if (region) {
    region = document.getElementById("selectRegion").value;
  } else {
    region = 0;
  }

  var gerencia = document.getElementById("selectGerencia") || false;
  if (gerencia) {
    gerencia = document.getElementById("selectGerencia").value;
  } else {
    gerencia = 0;
  }

  var division = document.getElementById("selectDivision") || false;
  if (division) {
    division = document.getElementById("selectDivision").value;
  } else {
    division = 0;
  }

  var ceve = document.getElementById("selectCeve") || false;
  if (ceve) {
    ceve = document.getElementById("selectCeve").value;
  } else {
    ceve = 0;
  }

  var ruta = document.getElementById("selectRuta") || false;
  if (ruta) {
    ruta = document.getElementById("selectRuta").value;
  } else {
    ruta = 0;
  }

  var categoria = document.getElementById("selectCategoria") || false;
  if (categoria) {
    categoria = document.getElementById("selectCategoria").value;
  } else {
    categoria = 0;
  }

  var marca = document.getElementById("selectMarca") || false;
  if (marca) {
    marca = document.getElementById("selectMarca").value;
  } else {
    marca = 0;
  }

  var familia = document.getElementById("selectFamilia") || false;
  if (familia) {
    familia = document.getElementById("selectFamilia").value;
  } else {
    familia = 0;
  }

  var producto = document.getElementById("selectProducto") || false;
  if (producto) {
    producto = document.getElementById("selectProducto").value;
  } else {
    producto = 0;
  }

  $.ajax({
    url: "utils/graphics/potenciales/trae_productos_potenciales_grafica_barras.php",
    dataType: "html",
    /* JSON, HTML, SJONP... */
    type: "POST",
    /* POST or GET; Default = GET */
    data: {
      region: region,
      gerencia: gerencia,
      division: division,
      ceve: ceve,
      ruta: ruta,
      categoria: categoria,
      marca: marca,
      familia: familia,
      producto: producto,
    },
    success: function (response) {
      const respuesta = JSON.parse(response);
      // Creamos la grafica
      const graficaBarras = document
        .querySelector("#graficaBarras")
        .getContext("2d");

      let chartStatusBarras = Chart.getChart("graficaBarras");
      if (chartStatusBarras != undefined) {
        chartStatusBarras.destroy();
      }

      etiquetas = respuesta[0].etiqueta;
      //conteo_usr = respuesta[0].conteo_usr;
      total_potencial_pesos = respuesta[0].total_potencial_pesos;
      total_potencial_clientes = respuesta[0].total_potencial_clientes;

      var datos = {
        labels: etiquetas,
        datasets: [
          {
            label: "Potencial Pesos",
            data: total_potencial_pesos, // <- Aquí estamos pasando el valor traído usando AJAX
            backgroundColor: "rgba(86, 132, 136, 1)", // Color de fondo
            borderWidth: 1, // Ancho del borde
            yAxisID: "y", //rango de valores mostrados
          },
          {
            label: "# Clientes con potencial",
            data: total_potencial_clientes, // <- Aquí estamos pasando el valor traído usando AJAX
            backgroundColor: "rgb(0, 159, 199)", // Color de fondo
            borderWidth: 1, // Ancho del borde
            yAxisID: "y1", //rango de valores mostrados
          },
        ],
      };

      // Podemos tener varios conjuntos de datos. Comencemos con uno
      var myChart_H1Barras = new Chart(graficaBarras, {
        type: "bar", // Tipo de gráfica
        data: datos,
        options: {
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            y: {
              type: "linear",
              beginAtZero: true,
              position: "left",
              ticks: {
                callback: function (value, index, ticks) {
                  return "$" + value.toLocaleString("es-MX");
                },
              },
            },
            y1: {
              type: "linear",
              beginAtZero: true,
              position: "right",
              grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
              },
              ticks: {
                callback: function (value, index, ticks) {
                  return value.toLocaleString("es-MX");
                },
              },
            },
          },
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
          },
          interaction: {
            intersect: false,
            mode: "index",
          },
        },
      });
    },
  });

  //tarjetas
  $.ajax({
    url: "utils/tarjetas/trae_tarjetas_potenciales_prod.php",
    method: "POST",
    data: {
      region: region,
      gerencia: gerencia,
      division: division,
      ceve: ceve,
      ruta: ruta,
      categoria: categoria,
      marca: marca,
      familia: familia,
      producto: producto,
    },
    success: function (result) {
      loading_modal.hide();
      const respuesta = JSON.parse(result);

      // Actualiza tarjeta de productos
      document.querySelector("#productos_potencial").innerHTML =
        respuesta["tarjeta_potencial_pesos"].toLocaleString("es-MX");

      // Actualiza tarjeta # clientes
      document.querySelector("#clientes_potenciales").innerHTML =
        respuesta["tarjeta_potencial_clientes"].toLocaleString("es-MX");
    },
  });
}

function traeCategoria() {
  $("#marca").empty();
  $("#familia").empty();
  $("#producto").empty();

  var region = document.getElementById("selectRegion") || false;
  if (region) {
    region = document.getElementById("selectRegion").value;
  } else {
    region = 0;
  }

  var gerencia = document.getElementById("selectGerencia") || false;
  if (gerencia) {
    gerencia = document.getElementById("selectGerencia").value;
  } else {
    gerencia = 0;
  }

  var division = document.getElementById("selectDivision") || false;
  if (division) {
    division = document.getElementById("selectDivision").value;
  } else {
    division = 0;
  }

  var ceve = document.getElementById("selectCeve") || false;
  if (ceve) {
    ceve = document.getElementById("selectCeve").value;
  } else {
    ceve = 0;
  }

  var ruta = document.getElementById("selectRuta") || false;
  if (ruta) {
    ruta = document.getElementById("selectRuta").value;
  } else {
    ruta = 0;
  }
  //trae categorias
  $.ajax({
    url: "utils/filters/trae_categorias.php",
    dataType: "html",
    /* JSON, HTML, SJONP... */
    type: "POST",
    /* POST or GET; Default = GET */
    data: {
      region: region,
      gerencia: gerencia,
      division: division,
      ceve: ceve,
      ruta: ruta,
    },
    beforeSend: function (xhr) {
      $("#selectCategoria").empty();
    },
    success: function (response) {
      $("#selectCategoria").append(response);
    },
  });
}

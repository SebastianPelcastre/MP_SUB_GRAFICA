$(document).ready(function () {
  obtener_ubicacion();
  setTimeout(function () {
    marker_usuario = L.marker([latitud_final, longitud_final], {
      icon: usuario,
    })
      .addTo(mymap)
      .bindPopup("" + latitud_final + "," + longitud_final);
    // mymap.flyTo([latitud_final,longitud_final], 13);
  }, 1000);
});

// Recuperamos del DOM el modal cuando se carga la información
const options = {
  backdrop: "static",
  keyboard: false,
};

const loading_modal = new bootstrap.Modal(
  document.querySelector("#loading-modal"),
  options
);

const body = document.querySelector("body");
console.log("body", body);
const modeSwitch = body.querySelector(".toggle-switch");

// Filtros
const filtro_region = document.getElementById("filtro-region");
const filtro_gerencia = document.getElementById("filtro-gerencia");
const filtro_division = document.getElementById("filtro-division");
const filtro_ceve = document.getElementById("filtro-ceve");
const filtro_supervisor = document.getElementById("filtro-supervisor");
const filtro_ruta = document.getElementById("filtro-ruta");

// Recuperamos el botón para filtrar
const btn_filtrar = document.querySelector("#filtro-btn");

window.onload = cargarFunciones();

function cargarFunciones() {
  traeIndicadores();
  mapa();
  loading_modal.show();
}

function borrarFiltros() {
  window.location.reload();
}

// Función para llenar filtro region
const read_filter_region = async () => {
  $.ajax({
    url: "utils/filters/trae_region.php",
    method: "POST",
    beforeSend: function () {
      // Mostramos el modal de carga en lo que finalizan las consultas
      // loading_modal.show();
    },
    success: function (result) {
      const json_result = JSON.parse(result);

      // Limpiar filtro
      $("#filtro-region").find("option").remove();

      json_result.map((element) => {
        const option = document.createElement("option");
        option.text = element;
        option.value = element;
        filtro_region.add(option);
      });

      //Actualizar
      $("#filtro-region").selectpicker("refresh");
    },
  });
};

// Función para llenar filtro gerencia
const read_filter_gerencia = async () => {
  let opciones_seleccionadas_regiones = [];

  for (let i = 0; i < filtro_region.selectedOptions.length; i++) {
    opciones_seleccionadas_regiones.push(
      filtro_region.selectedOptions[i].value
    );
  }

  if (opciones_seleccionadas_regiones.length > 0) {
    $.ajax({
      url: "utils/filters/trae_gerencias.php",
      method: "POST",
      data: {
        region: opciones_seleccionadas_regiones,
      },
      beforeSend: function () {
        // Mostramos el modal de carga en lo que finalizan las consultas
        // loading_modal.show();
      },
      success: function (result) {
        // loading_modal.hide();

        const json_result = JSON.parse(result);

        document.querySelector("#eliminarFiltros").classList.remove("d-none");

        // Limpiar filtro
        $("#filtro-gerencia").find("option").remove();

        json_result.map((element) => {
          const option = document.createElement("option");
          option.text = element;
          option.value = element;
          filtro_gerencia.add(option);
        });

        //Actualizar
        $("#filtro-gerencia").selectpicker("refresh");
      },
    });
  }
};

// Función para llenar filtro division
const read_filter_division = async () => {
  let opciones_seleccionadas_gerencias = [];

  for (let i = 0; i < filtro_gerencia.selectedOptions.length; i++) {
    opciones_seleccionadas_gerencias.push(
      filtro_gerencia.selectedOptions[i].value
    );
  }

  if (opciones_seleccionadas_gerencias.length > 0) {
    $.ajax({
      url: "utils/filters/trae_divisiones.php",
      method: "POST",
      data: {
        gerencia: opciones_seleccionadas_gerencias,
      },
      beforeSend: function () {
        // Mostramos el modal de carga en lo que finalizan las consultas
        // loading_modal.show();
      },
      success: function (result) {
        // loading_modal.hide();
        const json_result = JSON.parse(result);

        // Limpiar filtro
        $("#filtro-division").find("option").remove();

        json_result.map((element) => {
          const option = document.createElement("option");
          option.text = element;
          option.value = element;
          filtro_division.add(option);
        });

        //Actualizar
        $("#filtro-division").selectpicker("refresh");
      },
    });
  }
};

// Función para llenar filtro ceve
const read_filter_ceve = () => {
  let opciones_seleccionadas_divisiones = [];

  for (let i = 0; i < filtro_division.selectedOptions.length; i++) {
    opciones_seleccionadas_divisiones.push(
      filtro_division.selectedOptions[i].value
    );
  }

  if (opciones_seleccionadas_divisiones.length > 0) {
    $.ajax({
      url: "utils/filters/trae_ceves.php",
      method: "POST",
      data: {
        division: opciones_seleccionadas_divisiones,
      },
      beforeSend: function () {
        // Mostramos el modal de carga en lo que finalizan las consultas
        // loading_modal.show();
      },
      success: function (result) {
        // loading_modal.hide();
        const json_result = JSON.parse(result);

        // Limpiar filtro
        $("#filtro-ceve").find("option").remove();

        json_result.map((element) => {
          const option = document.createElement("option");
          option.text = element["nombre_ceve"];
          option.value = element["id_ceve"];
          filtro_ceve.add(option);
        });

        //Actualizar
        $("#filtro-ceve").selectpicker("refresh");
      },
    });
  }
};

// Función para llenar filtro ruta
const read_filter_ruta = async () => {
  let opciones_seleccionadas_ceves = [];

  for (let i = 0; i < filtro_ceve.selectedOptions.length; i++) {
    opciones_seleccionadas_ceves.push(filtro_ceve.selectedOptions[i].value);
  }

  if (opciones_seleccionadas_ceves.length > 0) {
    $.ajax({
      url: "utils/filters/trae_rutas.php",
      method: "POST",
      data: {
        ceve: opciones_seleccionadas_ceves,
      },
      beforeSend: function () {
        // Mostramos el modal de carga en lo que finalizan las consultas
        // loading_modal.show();
      },
      success: function (result) {
        // loading_modal.hide();
        const json_result = JSON.parse(result);

        // Limpiar filtro
        $("#filtro-ruta").find("option").remove();

        json_result.map((element) => {
          const option = document.createElement("option");
          option.text = element;
          option.value = element;
          filtro_ruta.add(option);
        });

        //Actualizar
        $("#filtro-ruta").selectpicker("refresh");
      },
    });
  }
};

let myChart_H1Barras = new Chart(graficaBarras, {});
let myChart_H1Lineas = new Chart(graficaLineas, {});
let myChart_H1 = new Chart(grafica, {});

function traeIndicadores() {
  // Obtener los arreglos de los filtros que el usuario haya seleccionado
  let opciones_seleccionadas_regiones = [];
  let opciones_seleccionadas_gerencias = [];
  let opciones_seleccionadas_divisiones = [];
  let opciones_seleccionadas_ceves = [];
  let opciones_seleccionadas_ruta = [];

  for (let i = 0; i < filtro_region.selectedOptions.length; i++) {
    opciones_seleccionadas_regiones.push(
      filtro_region.selectedOptions[i].value
    );
  }

  for (let i = 0; i < filtro_gerencia.selectedOptions.length; i++) {
    opciones_seleccionadas_gerencias.push(
      filtro_gerencia.selectedOptions[i].value
    );
  }
  for (let i = 0; i < filtro_division.selectedOptions.length; i++) {
    opciones_seleccionadas_divisiones.push(
      filtro_division.selectedOptions[i].value
    );
  }
  for (let i = 0; i < filtro_ceve.selectedOptions.length; i++) {
    opciones_seleccionadas_ceves.push(filtro_ceve.selectedOptions[i].value);
  }

  for (let i = 0; i < filtro_ruta.selectedOptions.length; i++) {
    opciones_seleccionadas_ruta.push(filtro_ruta.selectedOptions[i].value);
  }

  $.ajax({
    url: "utils/graphics/index/trae_cliente_potencial_grafica.php",
    dataType: "html",
    /* JSON, HTML, SJONP... */
    type: "POST",
    /* POST or GET; Default = GET */
    data: {
      region: opciones_seleccionadas_regiones,
      gerencia: opciones_seleccionadas_gerencias,
      division: opciones_seleccionadas_divisiones,
      ceve: opciones_seleccionadas_ceves,
      ruta: opciones_seleccionadas_ruta,
    },
    success: function (response) {
      const respuesta = JSON.parse(response);

      // Creamos la grafica
      const grafica = document.querySelector("#grafica").getContext("2d");

      let chartStatus = Chart.getChart("grafica");
      if (chartStatus != undefined) {
        chartStatus.destroy();
      }

      const etiquetas = [];
      const sin_visita = [];
      const cliente_con_tarea = [];
      respuesta.map((res) => {
        etiquetas.push(res.etiqueta);
        sin_visita.push(res.sin_visita);
        cliente_con_tarea.push(res.cliente_con_tarea);
      });

      var datos = {
        labels: etiquetas,
        datasets: [
          {
            label: "# Clientes con tareas",
            data: cliente_con_tarea, // <- Aquí estamos pasando el valor traído usando AJAX
            backgroundColor: "#0091D5", // Color de fondo
            borderColor: "#0091D5", // Color del borde
            borderWidth: 1, // Ancho del borde
          },
          {
            label: "Clientes por visitar",
            data: sin_visita, // <- Aquí estamos pasando el valor traído usando AJAX
            backgroundColor: "rgba(234, 106, 71, 1)", // Color de fondo
            borderColor: "rgba(234, 106, 71, 1)", // Color de borde
            borderWidth: 1, // Ancho del borde
          },
        ],
      };
      // Podemos tener varios conjuntos de datos. Comencemos con uno
      myChart_H1 = new Chart(grafica, {
        type: "bar", // Tipo de gráfica
        data: datos,
        options: {
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            x: {
              grid: {
                display: false,
              },
              stacked: true,
            },
            y: {
              stacked: true,
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

  $.ajax({
    url: "utils/graphics/index/trae_usuarios_acceso_grafica_barras.php",
    dataType: "html",
    /* JSON, HTML, SJONP... */
    type: "POST",
    /* POST or GET; Default = GET */
    data: {
      region: opciones_seleccionadas_regiones,
      gerencia: opciones_seleccionadas_gerencias,
      division: opciones_seleccionadas_divisiones,
      ceve: opciones_seleccionadas_ceves,
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
      total_usr_registrados = respuesta[0].total_usr_registrados;
      total_usr_accesos = respuesta[0].total_usr_accesos;
      total_usr_tareas = respuesta[0].total_usr_tareas;
      var datos = {
        labels: etiquetas,
        datasets: [
          {
            label: "Usuarios Registrados",
            data: total_usr_registrados, // <- Aquí estamos pasando el valor traído usando AJAX
            backgroundColor: "rgba(28, 48, 106, 1)", // Color de fondo
            borderColor: "rgba(28, 48, 106, 1)", // Color del borde
            borderWidth: 1, // Ancho del borde
          },
          {
            label: "Usuarios con acceso",
            data: total_usr_accesos, // <- Aquí estamos pasando el valor traído usando AJAX
            backgroundColor: "rgba(252, 3, 3)", // Color de fondo
            borderColor: "rgba(252, 3, 3)", // Color del borde
            borderWidth: 1, // Ancho del borde
          },
          {
            label: "Usuarios con tareas",
            data: total_usr_tareas, // <- Aquí estamos pasando el valor traído usando AJAX
            backgroundColor: "#0091D5", // Color de fondo
            borderColor: "#0091D5", // Color del borde
            borderWidth: 1, // Ancho del borde
          },
        ],
      };

      // Podemos tener varios conjuntos de datos. Comencemos con uno
      myChart_H1Barras = new Chart(graficaBarras, {
        type: "bar", // Tipo de gráfica
        data: datos,
        options: {
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
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

  $.ajax({
    url: "utils/graphics/index/trae_usuarios_acceso_grafica_lineas.php",
    dataType: "html",
    /* JSON, HTML, SJONP... */
    type: "POST",
    /* POST or GET; Default = GET */
    data: {
      region: opciones_seleccionadas_regiones,
      gerencia: opciones_seleccionadas_gerencias,
      division: opciones_seleccionadas_divisiones,
      ceve: opciones_seleccionadas_ceves,
    },
    success: function (response) {
      const respuestas = JSON.parse(response);

      let semanas = [];
      let totales = [];
      let registros_distintos = [];
      let registros_acumulado = [];
      let num_accesos = [];
      respuestas.map((element) => {
        totales.push(element.totales);
        semanas.push(element.semanas);
        registros_distintos.push(element.registros_distintos);
        registros_acumulado.push(element.registros_acumulado);
        num_accesos.push(element.num_accesos);
      });
      const graficaLineas = document.querySelector("#graficaLineas");

      let chartStatusLineas = Chart.getChart("graficaLineas");
      if (chartStatusLineas != undefined) {
        chartStatusLineas.destroy();
      }

      // Podemos tener varios conjuntos de datos. Comencemos con uno
      myChart_H1Lineas = new Chart(graficaLineas, {
        type: "line", // Tipo de gráfica
        data: {
          labels: semanas,
          datasets: [
            {
              label: "Total Usuarios",
              data: totales, // <- Aquí estamos pasando el valor traído usando AJAX
              backgroundColor: "rgba(28, 48, 106, 1)", // Color de fondo
              borderColor: "rgba(28, 48, 106, 1)", // Color de borde
              fill: false,
              lineTension: 0,
              radius: 0.1,
            },
            {
              label: "Registros Distintos",
              data: registros_distintos, // <- Aquí estamos pasando el valor traído usando AJAX
              backgroundColor: "rgba(86, 132, 136, 1)", // Color de fondo
              borderColor: "rgba(86, 132, 136, 1)", // Color de borde
              fill: false,
              lineTension: 0,
              radius: 0.1,
            },
            {
              label: "Usuarios distintos con accesos",
              data: num_accesos, // <- Aquí estamos pasando el valor traído usando AJAX
              backgroundColor: "rgba(252, 3, 3)", // Color de fondo
              borderColor: "rgba(252, 3, 3)", // Color de borde
              fill: false,
              lineTension: 0,
              radius: 0.1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            // y: {
            //   grid: {
            //     display: false,
            //   },
            // },
          },
          maintainAspectRatio: false,
          responsive: true,
          legend: {
            display: true,
            position: "bottom",
            labels: {
              boxWidth: 80,
              fontColor: "black",
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
}

puntos2 = [];

function remove_marker() {
  for (i = 0; i < puntos2.length; i++) {
    mymap.removeLayer(puntos2[i]);
  }
  puntos2 = [];
}

var firstpolyline;
var bandera_inicio = 0;

function mapa() {
  // Obtener los arreglos de los filtros que el usuario haya seleccionado
  let opciones_seleccionadas_regiones = [];
  let opciones_seleccionadas_gerencias = [];
  let opciones_seleccionadas_divisiones = [];
  let opciones_seleccionadas_ceves = [];
  let opciones_seleccionadas_ruta = [];

  for (let i = 0; i < filtro_region.selectedOptions.length; i++) {
    opciones_seleccionadas_regiones.push(
      filtro_region.selectedOptions[i].value
    );
  }

  for (let i = 0; i < filtro_gerencia.selectedOptions.length; i++) {
    opciones_seleccionadas_gerencias.push(
      filtro_gerencia.selectedOptions[i].value
    );
  }
  for (let i = 0; i < filtro_division.selectedOptions.length; i++) {
    opciones_seleccionadas_divisiones.push(
      filtro_division.selectedOptions[i].value
    );
  }
  for (let i = 0; i < filtro_ceve.selectedOptions.length; i++) {
    opciones_seleccionadas_ceves.push(filtro_ceve.selectedOptions[i].value);
  }

  for (let i = 0; i < filtro_ruta.selectedOptions.length; i++) {
    opciones_seleccionadas_ruta.push(filtro_ruta.selectedOptions[i].value);
  }

  $.ajax({
    url: "mapa.php",
    dataType: "html",
    /* JSON, HTML, SJONP... */
    type: "POST",
    /* POST or GET; Default = GET */
    data: {
      region: opciones_seleccionadas_regiones,
      gerencia: opciones_seleccionadas_gerencias,
      division: opciones_seleccionadas_divisiones,
      ceve: opciones_seleccionadas_ceves,
      ruta: opciones_seleccionadas_ruta,
      filtro: 1,
    },
    beforeSend: function (xhr) {
      remove_marker();
    },

    success: function (response) {
      var lat_fin;
      var lon_fin;

      if (response != []) {
        puntoPersona = JSON.parse(response);
        //var mymap = L.map('mapa').setView([19.25043211, -99.66460569], 13);
        for (var i = 0; i < puntoPersona.length; i++) {
          lat_fin = puntoPersona[i].latitud;
          lon_fin = puntoPersona[i].longitud;
          var marker = L.marker(
            [puntoPersona[i].latitud, puntoPersona[i].longitud],
            {
              icon: blue_icon,
            }
          )
            .addTo(mymap)
            .bindPopup(puntoPersona[i].mensaje);
          puntos2.push(marker);
        }
        mymap.setView([lat_fin, lon_fin], 8);
      }
    },
  });
}

$(document).ajaxStop(function () {
  loading_modal.hide();
});

// Agregamos un evento cuando se le de click al botón de filtrar
btn_filtrar.addEventListener("click", cargarFunciones);

// Agregamos evento cuando usuario seleccione opciones de regiones
$("#filtro-region").on("changed.bs.select", read_filter_gerencia);

// Agregamos evento cuando usuario seleccione opciones de gerencias
$("#filtro-gerencia").on("changed.bs.select", read_filter_division);

// Agregamos evento cuando usuario seleccione opciones de divisiones
$("#filtro-division").on("changed.bs.select", read_filter_ceve);

// Agregamos evento cuando usuario seleccione opciones de ceves
$("#filtro-ceve").on("changed.bs.select", read_filter_ruta);

read_filter_region();

function updateOptionsChart(chartArray) {
  const color = body.classList.contains("dark") ? "#b3b3b3" : "#e6e1e1";
  chartArray.forEach((chart) => {
    chart.options.plugins.legend.labels.color = color;
    chart.options.scales.y.ticks.color = color;
    chart.options.scales.y.grid.color = color;
    chart.options.scales.y.grid.borderColor = color;
    chart.options.scales.x.ticks.color = color;
    chart.options.scales.x.grid.color = color;
    chart.options.scales.x.grid.borderColor = color;
    chart.update();
  });
}

modeSwitch.addEventListener("click", () => {
  const chartArray = [];
  chartArray.push(myChart_H1Barras, myChart_H1Lineas, myChart_H1);
  updateOptionsChart(chartArray);
});

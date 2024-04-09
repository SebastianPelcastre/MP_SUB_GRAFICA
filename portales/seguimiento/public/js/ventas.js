let semanas = 0;

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
const filtro_semana = document.getElementById("filtro-semana");
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
  tarjetas();
  $("#contenido").removeClass("d-none");
  loading_modal.show();
}

function borrarFiltros() {
  window.location.reload();
}

// Función para llenar filtro semanas
const read_filter_semana = async () => {
  $.ajax({
    url: "utils/filters/trae_semanas.php",
    method: "POST",
    beforeSend: function () {
      // Mostramos el modal de carga en lo que finalizan las consultas
      // loading_modal.show();
    },
    success: function (result) {
      const json_result = JSON.parse(result);

      // Limpiar filtro
      $("#filtro-semana").find("option").remove();

      json_result.map((element) => {
        const option = document.createElement("option");
        option.text = element;
        option.value = element;
        filtro_semana.add(option);
      });

      //Actualizar
      $("#filtro-semana").selectpicker("refresh");
    },
  });
};

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

let suma_potencial = "";
let myChart_H1Barras_potencial = new Chart(graficaBarrasPotencial, {});
let myChart_H1Barras_comparativos = new Chart(graficaBarrasComparativo, {});
let myChart_H1Barras = new Chart(graficaBarras, {});
let myChart_H1Lineas = new Chart(graficaLineas, {});

function traeIndicadores() {
  // Obtener los arreglos de los filtros que el usuario haya seleccionado
  let opciones_seleccionadas_semanas = [];
  let opciones_seleccionadas_regiones = [];
  let opciones_seleccionadas_gerencias = [];
  let opciones_seleccionadas_divisiones = [];
  let opciones_seleccionadas_ceves = [];
  let opciones_seleccionadas_ruta = [];

  for (let i = 0; i < filtro_semana.selectedOptions.length; i++) {
    opciones_seleccionadas_semanas.push(filtro_semana.selectedOptions[i].value);
  }

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

  //Tarda 2 segundos
  $.ajax({
    url: "utils/graphics/ventas/trae_venta_promedio_semanas.php",
    dataType: "html",
    /* JSON, HTML, SJONP... */
    type: "POST",
    /* POST or GET; Default = GET */
    data: {
      semana: opciones_seleccionadas_semanas,
      region: opciones_seleccionadas_regiones,
      gerencia: opciones_seleccionadas_gerencias,
      division: opciones_seleccionadas_divisiones,
      ceve: opciones_seleccionadas_ceves,
      ruta: opciones_seleccionadas_ruta,
    },
    success: function (response) {
      const respuesta = JSON.parse(response);
      let etiquetas = [];
      let ventas_base = [];
      let ventas_reales = [];
      respuesta.map((element) => {
        etiquetas.push(element.semana_bimbo);
        ventas_base.push(Math.round(element.base));
        ventas_reales.push(Math.round(element.venta_real));
      });

      semanas = etiquetas.length;

      // Creamos la grafica de lineas
      const graficaLineas = document.querySelector("#graficaLineas");

      let chartStatusLineas = Chart.getChart("graficaLineas");
      if (chartStatusLineas != undefined) {
        chartStatusLineas.destroy();
      }

      const delta = (tooltipItems) => {
        let res = 0;
        tooltipItems.forEach(function (tooltipItem) {
          if (res === 0) {
            res = tooltipItem.parsed.y;
          } else {
            res = tooltipItem.parsed.y - res;
          }
        });
        return "Venta Incremental: " + res.toLocaleString("es-MX");
      };

      // Podemos tener varios conjuntos de datos. Comencemos con uno
      myChart_H1Lineas = new Chart(graficaLineas, {
        type: "line", // Tipo de gráfica
        data: {
          labels: etiquetas,
          datasets: [
            {
              label: "Venta Base",
              data: ventas_base, // <- Aquí estamos pasando el valor traído usando AJAX
              backgroundColor: "#0091D5", // Color de fondo
              fill: true,
              lineTension: 0,
              radius: 0.1,
            },
            {
              label: "Venta Total",
              data: ventas_reales, // <- Aquí estamos pasando el valor traído usando AJAX
              backgroundColor: "#A2ADD3", // Color de fondo
              fill: true,
              lineTension: 0,
              radius: 0.1,
            },
          ],
        },
        options: {
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
            x: {
              stacked: true,
              grid: {
                display: false,
              },
            },
          },
          interaction: {
            intersect: false,
            mode: "index",
          },
          locale: "es-MX",
          plugins: {
            tooltip: {
              callbacks: {
                footer: delta,
              },
            },
          },
        },
      });
    },
  });

  //Tarda 3 segundos
  $.ajax({
    url: "utils/graphics/ventas/trae_venta_promedio_estructura.php",
    dataType: "html",
    /* JSON, HTML, SJONP... */
    type: "POST",
    /* POST or GET; Default = GET */
    data: {
      semana: opciones_seleccionadas_semanas,
      region: opciones_seleccionadas_regiones,
      gerencia: opciones_seleccionadas_gerencias,
      division: opciones_seleccionadas_divisiones,
      ceve: opciones_seleccionadas_ceves,
      ruta: opciones_seleccionadas_ruta,
    },
    success: function (response) {
      const respuesta = JSON.parse(response);
      let etiquetas = [];
      let generacion_valor = [];
      let ventas_reales = [];
      let porcentaje_venta = [];
      let venta_base = [];
      respuesta.map((element) => {
        etiquetas.push(element.etiqueta);
        generacion_valor.push(Math.round(element.delta));
        ventas_reales.push(Math.round(element.venta_real));
        porcentaje_venta.push(Math.round(element.porcentaje));
        venta_base.push(Math.round(element.venta_base));
      });

      // Creamos la grafica de lineas
      const graficaBarras = document.querySelector("#graficaBarras");

      let chartStatusBarras = Chart.getChart("graficaBarras");
      if (chartStatusBarras != undefined) {
        chartStatusBarras.destroy();
      }
      // Podemos tener varios conjuntos de datos. Comencemos con uno
      myChart_H1Barras = new Chart(graficaBarras, {
        data: {
          labels: etiquetas,
          datasets: [
            {
              type: "line",
              label: "% de Incremento",
              data: porcentaje_venta,
              borderColor: "rgba(233,73,0,1)",
              pointBackgroundColor: "rgba(233,73,0,1)",
              backgroundColor: "rgba(233,73,0,1)",
              yAxisID: "y1",
            },
            {
              type: "bar", // Tipo de gráfica
              label: "Venta Base",
              data: venta_base, // <- Aquí estamos pasando el valor traído usando AJAX
              backgroundColor: "#0091D5", // Color de fondo
              fill: true,
              lineTension: 0,
              radius: 5,
            },
            {
              type: "bar", // Tipo de gráfica
              label: "Venta Incremental",
              data: generacion_valor, // <- Aquí estamos pasando el valor traído usando AJAX
              backgroundColor: "#A2ADD3", // Color de fondo
              fill: true,
              lineTension: 0,
              radius: 5,
            },
          ],
        },
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
              stacked: true,
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
                  return value.toLocaleString("es-MX") + "%";
                },
              },
            },
            x: {
              stacked: true,
              grid: {
                display: false,
              },
            },
          },
          interaction: {
            intersect: false,
            mode: "index",
          },
          locale: "es-MX",
        },
      });
    },
  });

  //Tarda 3 segundos
  $.ajax({
    url: "utils/graphics/ventas/trae_comparativo_potencial_vi.php",
    dataType: "html",
    /* JSON, HTML, SJONP... */
    type: "POST",
    /* POST or GET; Default = GET */
    data: {
      semana: opciones_seleccionadas_semanas,
      region: opciones_seleccionadas_regiones,
      gerencia: opciones_seleccionadas_gerencias,
      division: opciones_seleccionadas_divisiones,
      ceve: opciones_seleccionadas_ceves,
      ruta: opciones_seleccionadas_ruta,
    },
    success: function (response) {
      const respuesta = JSON.parse(response);

      suma_potencial = respuesta["suma_potencial"];

      let etiquetas = [];
      let generacion_valor = [];
      let potencial = [];
      let porcentaje_venta = [];

      respuesta["data"].map((element) => {
        etiquetas.push(element.etiqueta);
        generacion_valor.push(Math.round(element.delta));
        potencial.push(Math.round(element.potencial));
        porcentaje_venta.push(Math.round(element.porcentaje));
      });

      // Creamos la grafica de lineas
      const graficaBarrasComparativo = document.querySelector(
        "#graficaBarrasComparativo"
      );

      let chartStatusBarras = Chart.getChart("graficaBarrasComparativo");
      if (chartStatusBarras != undefined) {
        chartStatusBarras.destroy();
      }
      // Podemos tener varios conjuntos de datos. Comencemos con uno
      myChart_H1Barras_comparativos = new Chart(graficaBarrasComparativo, {
        data: {
          labels: etiquetas,
          datasets: [
            {
              type: "line",
              label: "% Alcance a potencial clientes con potencial",
              data: porcentaje_venta,
              borderColor: "rgba(233,73,0,1)",
              pointBackgroundColor: "rgba(233,73,0,1)",
              backgroundColor: "rgba(233,73,0,1)",
              yAxisID: "y1",
            },
            {
              type: "bar", // Tipo de gráfica
              label: "Prom. Semanal Venta Incremental",
              data: generacion_valor, // <- Aquí estamos pasando el valor traído usando AJAX
              backgroundColor: "#A2ADD3", // Color de fondo
              fill: true,
              lineTension: 0,
              radius: 5,
            },
            {
              type: "bar", // Tipo de gráfica
              label: "Potencial",
              data: potencial, // <- Aquí estamos pasando el valor traído usando AJAX
              backgroundColor: "rgb(0, 159, 199)", // Color de fondo
              fill: true,
              lineTension: 0,
              radius: 5,
            },
          ],
        },
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
                  return value.toLocaleString("es-MX") + "%";
                },
              },
            },
            x: {
              stacked: true,
              grid: {
                display: false,
              },
            },
          },
          interaction: {
            intersect: false,
            mode: "index",
          },
          locale: "es-MX",
        },
      });
    },
  });

  //3 segundos
  $.ajax({
    url: "utils/graphics/ventas/trae_potencial.php",
    dataType: "html",
    /* JSON, HTML, SJONP... */
    type: "POST",
    /* POST or GET; Default = GET */
    data: {
      semana: opciones_seleccionadas_semanas,
      region: opciones_seleccionadas_regiones,
      gerencia: opciones_seleccionadas_gerencias,
      division: opciones_seleccionadas_divisiones,
      ceve: opciones_seleccionadas_ceves,
      ruta: opciones_seleccionadas_ruta,
    },
    success: function (response) {
      const respuesta = JSON.parse(response);
      let etiquetas = [];
      let generacion_valor = [];
      let potencial = [];
      let porcentaje_venta = [];
      respuesta.map((element) => {
        etiquetas.push(element.etiqueta);
        generacion_valor.push(Math.round(element.delta));
        potencial.push(Math.round(element.potencial));
        porcentaje_venta.push(Math.round(element.porcentaje));
      });

      // Creamos la grafica de lineas
      const graficaBarrasPotencial = document.querySelector(
        "#graficaBarrasPotencial"
      );

      let chartStatusBarras = Chart.getChart("graficaBarrasPotencial");
      if (chartStatusBarras != undefined) {
        chartStatusBarras.destroy();
      }
      // Podemos tener varios conjuntos de datos. Comencemos con uno
      myChart_H1Barras_potencial = new Chart(graficaBarrasPotencial, {
        data: {
          labels: etiquetas,
          datasets: [
            {
              type: "line",
              label: "% Alcance a potencial clientes con plan de acción",
              data: porcentaje_venta,
              borderColor: "rgba(233,73,0,1)",
              pointBackgroundColor: "rgba(233,73,0,1)",
              backgroundColor: "rgba(233,73,0,1)",
              yAxisID: "y1",
            },
            {
              type: "bar", // Tipo de gráfica
              label: "Prom. Semanal Venta Incremental",
              data: generacion_valor, // <- Aquí estamos pasando el valor traído usando AJAX
              backgroundColor: "#A2ADD3", // Color de fondo
              fill: true,
              lineTension: 0,
              radius: 5,
            },
            {
              type: "bar", // Tipo de gráfica
              label: "Potencial",
              data: potencial, // <- Aquí estamos pasando el valor traído usando AJAX
              backgroundColor: "rgb(0, 159, 199)", // Color de fondo
              fill: true,
              lineTension: 0,
              radius: 5,
            },
          ],
        },
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
                  return value.toLocaleString("es-MX") + "%";
                },
              },
            },
            x: {
              stacked: true,
              grid: {
                display: false,
              },
            },
          },
          interaction: {
            intersect: false,
            mode: "index",
          },
          locale: "es-MX",
        },
      });
    },
  });
}

function tarjetas() {
  // Obtener los arreglos de los filtros que el usuario haya seleccionado
  let opciones_seleccionadas_semanas = [];
  let opciones_seleccionadas_regiones = [];
  let opciones_seleccionadas_gerencias = [];
  let opciones_seleccionadas_divisiones = [];
  let opciones_seleccionadas_ceves = [];
  let opciones_seleccionadas_ruta = [];

  for (let i = 0; i < filtro_semana.selectedOptions.length; i++) {
    opciones_seleccionadas_semanas.push(filtro_semana.selectedOptions[i].value);
  }

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
    url: "utils/tarjetas/read_tarjeta_clientes_planes_accion.php",
    method: "POST",
    data: {
      semana: opciones_seleccionadas_semanas,
      region: opciones_seleccionadas_regiones,
      gerencia: opciones_seleccionadas_gerencias,
      division: opciones_seleccionadas_divisiones,
      ceve: opciones_seleccionadas_ceves,
      ruta: opciones_seleccionadas_ruta,
    },
    success: function (result) {
      const json_result = JSON.parse(result);

      resultClientesPotenciales = json_result["tarjeta_cliente_potencial"];

      // Actualiza tarjeta de clientes
      document.querySelector("#tarjetas_clientes").innerHTML =
        json_result["tarjeta_cliente_potencial"].toLocaleString("es-MX");

      // Actualiza tarjeta # clientes con plan de accion
      document.querySelector("#clientes_con_plan").innerHTML =
        json_result[
          "trae_tarjetas_num_planes_acciones_distintos"
        ].toLocaleString("es-MX");

      let porcentaje_clientes;

      if (
        json_result["trae_tarjetas_num_planes_acciones_distintos"] == 0 ||
        json_result["tarjeta_cliente_potencial"] == 0
      ) {
        porcentaje_clientes = 0;
      } else {
        porcentaje_clientes =
          (json_result["trae_tarjetas_num_planes_acciones_distintos"] /
            json_result["tarjeta_cliente_potencial"]) *
          100;
      }

      var planes = Math.round(porcentaje_clientes);

      porcentaje_clientes = planes + "%";

      // Actualiza tarjeta de porcentaje de clientes
      document.querySelector("#tarjeta_porcentaje").innerHTML =
        porcentaje_clientes.toLocaleString("es-MX");
    },
  });

  $.ajax({
    url: "utils/tarjetas/trae_tarjetas_num_planes_accion.php",
    method: "POST",
    data: {
      semana: opciones_seleccionadas_semanas,
      region: opciones_seleccionadas_regiones,
      gerencia: opciones_seleccionadas_gerencias,
      division: opciones_seleccionadas_divisiones,
      ceve: opciones_seleccionadas_ceves,
      ruta: opciones_seleccionadas_ruta,
    },
    success: function (result) {
      const json_result = JSON.parse(result);

      // Actualiza tarjeta de planes
      document.querySelector("#tarjetas_planes").innerHTML =
        json_result["tarjeta_num_planes_accion"].toLocaleString("es-MX");
    },
  });

  $.ajax({
    url: "utils/tarjetas/trae_tarjetas_venta.php",
    method: "POST",
    data: {
      semana: opciones_seleccionadas_semanas,
      region: opciones_seleccionadas_regiones,
      gerencia: opciones_seleccionadas_gerencias,
      division: opciones_seleccionadas_divisiones,
      ceve: opciones_seleccionadas_ceves,
      ruta: opciones_seleccionadas_ruta,
    },
    success: function (result) {
      const json_result = JSON.parse(result);

      // Actualiza tarjeta de generacion de valor
      document.querySelector("#generacion_valor").innerHTML = Math.round(
        json_result["generacion_valor"]
      ).toLocaleString("es-MX");

      // Actualiza tarjeta de venta total
      document.querySelector("#tarjetas_venta_total").innerHTML = Math.round(
        json_result["venta_total"]
      ).toLocaleString("es-MX");

      let porcentaje_generado =
        (json_result["generacion_valor"] / json_result["venta_total"]) * 100;

      if (Number.isNaN(porcentaje_generado)) {
        porcentaje_generado = 0;
      }

      var ventas = Math.round(porcentaje_generado);

      var porcentaje_ventas = ventas + "%";

      // Actualiza tarjeta de porcentaje
      document.querySelector("#porcentaje_ventas").innerHTML =
        porcentaje_ventas.toLocaleString("es-MX");
    },
  });

  $.ajax({
    url: "utils/tarjetas/trae_tarjetas_incremento_venta.php",
    method: "POST",
    data: {
      semana: opciones_seleccionadas_semanas,
      region: opciones_seleccionadas_regiones,
      gerencia: opciones_seleccionadas_gerencias,
      division: opciones_seleccionadas_divisiones,
      ceve: opciones_seleccionadas_ceves,
      ruta: opciones_seleccionadas_ruta,
    },
    success: function (result) {
      const json_result = JSON.parse(result);

      // Actualiza tarjeta de incremento de venta
      document.querySelector("#incremento_venta").innerHTML =
        json_result["incremento_venta"].toLocaleString("es-MX");
    },
  });

  $.ajax({
    url: "utils/tarjetas/trae_tarjetas_potencial.php",
    method: "POST",
    data: {
      semana: opciones_seleccionadas_semanas,
      region: opciones_seleccionadas_regiones,
      gerencia: opciones_seleccionadas_gerencias,
      division: opciones_seleccionadas_divisiones,
      ceve: opciones_seleccionadas_ceves,
      ruta: opciones_seleccionadas_ruta,
    },
    success: function (result) {
      const json_result = JSON.parse(result);

      // Actualiza tarjeta de venta incremental
      document.querySelector("#venta_incremental").innerHTML = Math.round(
        json_result["porcentaje_ventas"]
      ).toLocaleString("es-MX");

      let porcentaje_potencial;

      if (
        json_result["porcentaje_ventas"] == 0 ||
        json_result["potencial"] == 0
      ) {
        porcentaje_potencial = 0;
      } else {
        porcentaje_potencial =
          (json_result["porcentaje_ventas"] / json_result["potencial"]) * 100;
      }

      if (Number.isNaN(porcentaje_potencial)) {
        porcentaje_potencial = 0;
      }
      var potencial_valor = Math.round(porcentaje_potencial);

      var potencial_venta = potencial_valor + "%";

      // Actualiza tarjeta de porcentaje
      document.querySelector("#porcentaje_potencial").innerHTML =
        potencial_venta.toLocaleString("es-MX");

      // Actualiza tarjeta de potenciales
      document.querySelector("#porcentaje_potencial_comparacion").innerHTML =
        Math.round(json_result["potencial"]).toLocaleString("es-MX");
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

read_filter_semana();
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
  chartArray.push(
    myChart_H1Barras,
    myChart_H1Barras_comparativos,
    myChart_H1Barras_potencial,
    myChart_H1Lineas
  );
  updateOptionsChart(chartArray);
});

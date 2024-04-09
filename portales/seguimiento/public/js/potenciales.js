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
const filtro_categoria = document.getElementById("filtro-categoria");
const filtro_marca = document.getElementById("filtro-marca");
const filtro_familia = document.getElementById("filtro-familia");
const filtro_producto = document.getElementById("filtro-producto");

// Recuperamos el botón para filtrar
const btn_filtrar = document.querySelector("#filtro-btn");

window.onload = cargarFunciones();

function cargarFunciones() {
  traeIndicadores();
  loading_modal.show();
}

function borrarFiltros() {
  window.location.reload();
}

// Función para llenar filtro marcas
const read_filter_marcas = async () => {
  $("#filtro-familia").empty();
  $("#filtro-producto").empty();

  // Obtener los arreglos de los filtros que el usuario haya seleccionado
  let opciones_seleccionadas_categorias = [];
  let opciones_seleccionadas_regiones = [];
  let opciones_seleccionadas_gerencias = [];
  let opciones_seleccionadas_divisiones = [];
  let opciones_seleccionadas_ceves = [];
  let opciones_seleccionadas_ruta = [];

  for (let i = 0; i < filtro_categoria.selectedOptions.length; i++) {
    opciones_seleccionadas_categorias.push(
      filtro_categoria.selectedOptions[i].value
    );
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
    url: "utils/filters/trae_marcas.php",
    method: "POST",
    data: {
      categoria: opciones_seleccionadas_categorias,
      region: opciones_seleccionadas_regiones,
      gerencia: opciones_seleccionadas_gerencias,
      division: opciones_seleccionadas_divisiones,
      ceve: opciones_seleccionadas_ceves,
      ruta: opciones_seleccionadas_ruta,
    },
    beforeSend: function () {
      // Mostramos el modal de carga en lo que finalizan las consultas
      // loading_modal.show();
    },
    success: function (result) {
      const json_result = JSON.parse(result);

      document.querySelector("#eliminarFiltros").classList.remove("d-none");

      // Limpiar filtro
      $("#filtro-marca").find("option").remove();

      json_result.map((element) => {
        const option = document.createElement("option");
        option.text = element;
        option.value = element;
        filtro_marca.add(option);
      });

      //Actualizar
      $("#filtro-marca").selectpicker("refresh");
    },
  });
};

// Función para llenar filtro familias
const read_filter_familias = async () => {
  $("#filtro-producto").empty();

  // Obtener los arreglos de los filtros que el usuario haya seleccionado
  let opciones_seleccionadas_categorias = [];
  let opciones_seleccionadas_marcas = [];
  let opciones_seleccionadas_regiones = [];
  let opciones_seleccionadas_gerencias = [];
  let opciones_seleccionadas_divisiones = [];
  let opciones_seleccionadas_ceves = [];
  let opciones_seleccionadas_ruta = [];

  for (let i = 0; i < filtro_categoria.selectedOptions.length; i++) {
    opciones_seleccionadas_categorias.push(
      filtro_categoria.selectedOptions[i].value
    );
  }

  for (let i = 0; i < filtro_marca.selectedOptions.length; i++) {
    opciones_seleccionadas_marcas.push(filtro_marca.selectedOptions[i].value);
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
    url: "utils/filters/trae_familia.php",
    method: "POST",
    data: {
      categoria: opciones_seleccionadas_categorias,
      marca: opciones_seleccionadas_marcas,
      region: opciones_seleccionadas_regiones,
      gerencia: opciones_seleccionadas_gerencias,
      division: opciones_seleccionadas_divisiones,
      ceve: opciones_seleccionadas_ceves,
      ruta: opciones_seleccionadas_ruta,
    },
    beforeSend: function () {
      // Mostramos el modal de carga en lo que finalizan las consultas
      // loading_modal.show();
    },
    success: function (result) {
      const json_result = JSON.parse(result);

      // Limpiar filtro
      $("#filtro-familia").find("option").remove();

      json_result.map((element) => {
        const option = document.createElement("option");
        option.text = element;
        option.value = element;
        filtro_familia.add(option);
      });

      //Actualizar
      $("#filtro-familia").selectpicker("refresh");
    },
  });
};

// Función para llenar filtro productos
const read_filter_productos = async () => {
  // Obtener los arreglos de los filtros que el usuario haya seleccionado
  let opciones_seleccionadas_categorias = [];
  let opciones_seleccionadas_marcas = [];
  let opciones_seleccionadas_familias = [];
  let opciones_seleccionadas_regiones = [];
  let opciones_seleccionadas_gerencias = [];
  let opciones_seleccionadas_divisiones = [];
  let opciones_seleccionadas_ceves = [];
  let opciones_seleccionadas_ruta = [];

  for (let i = 0; i < filtro_categoria.selectedOptions.length; i++) {
    opciones_seleccionadas_categorias.push(
      filtro_categoria.selectedOptions[i].value
    );
  }

  for (let i = 0; i < filtro_marca.selectedOptions.length; i++) {
    opciones_seleccionadas_marcas.push(filtro_marca.selectedOptions[i].value);
  }

  for (let i = 0; i < filtro_familia.selectedOptions.length; i++) {
    opciones_seleccionadas_familias.push(
      filtro_familia.selectedOptions[i].value
    );
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
    url: "utils/filters/trae_productos.php",
    method: "POST",
    data: {
      categoria: opciones_seleccionadas_categorias,
      marca: opciones_seleccionadas_marcas,
      familia: opciones_seleccionadas_familias,
      region: opciones_seleccionadas_regiones,
      gerencia: opciones_seleccionadas_gerencias,
      division: opciones_seleccionadas_divisiones,
      ceve: opciones_seleccionadas_ceves,
      ruta: opciones_seleccionadas_ruta,
    },
    beforeSend: function () {
      // Mostramos el modal de carga en lo que finalizan las consultas
      // loading_modal.show();
    },
    success: function (result) {
      const json_result = JSON.parse(result);

      // Limpiar filtro
      $("#filtro-producto").find("option").remove();

      json_result.map((element) => {
        const option = document.createElement("option");
        option.text = element["producto"];
        option.value = element["cod_prod"];
        filtro_producto.add(option);
      });

      //Actualizar
      $("#filtro-producto").selectpicker("refresh");
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
  document.getElementById("filtro-categoria").value = 0;
  if (document.getElementById("filtro-marca"))
    document.getElementById("filtro-marca").value = 0;
  if (document.getElementById("filtro-familia"))
    document.getElementById("filtro-familia").value = 0;
  if (document.getElementById("filtro-producto"))
    document.getElementById("filtro-producto").value = 0;

  $("#filtro-division").empty();
  $("#filtro-ceve").empty();
  $("#filtro-ruta").empty();

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
  document.getElementById("filtro-categoria").value = 0;
  if (document.getElementById("filtro-marca"))
    document.getElementById("filtro-marca").value = 0;
  if (document.getElementById("filtro-familia"))
    document.getElementById("filtro-familia").value = 0;
  if (document.getElementById("filtro-producto"))
    document.getElementById("filtro-producto").value = 0;

  $("#filtro-ceve").empty();
  $("#filtro-ruta").empty();

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
  document.getElementById("filtro-categoria").value = 0;
  if (document.getElementById("filtro-marca"))
    document.getElementById("filtro-marca").value = 0;
  if (document.getElementById("filtro-familia"))
    document.getElementById("filtro-familia").value = 0;
  if (document.getElementById("filtro_producto"))
    document.getElementById("filtro_producto").value = 0;

  $("#filtro-ruta").empty();

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
  document.getElementById("filtro-categoria").value = 0;
  if (document.getElementById("filtro-marca"))
    document.getElementById("filtro-marca").value = 0;
  if (document.getElementById("filtro-familia"))
    document.getElementById("filtro-familia").value = 0;
  if (document.getElementById("filtro-producto"))
    document.getElementById("filtro-producto").value = 0;

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

function traeIndicadores() {
  // Obtener los arreglos de los filtros que el usuario haya seleccionado
  let opciones_seleccionadas_regiones = [];
  let opciones_seleccionadas_gerencias = [];
  let opciones_seleccionadas_divisiones = [];
  let opciones_seleccionadas_ceves = [];
  let opciones_seleccionadas_ruta = [];
  let opciones_seleccionadas_categorias = [];
  let opciones_seleccionadas_marcas = [];
  let opciones_seleccionadas_familias = [];
  let opciones_seleccionadas_productos = [];

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

  for (let i = 0; i < filtro_categoria.selectedOptions.length; i++) {
    opciones_seleccionadas_categorias.push(
      filtro_categoria.selectedOptions[i].value
    );
  }

  for (let i = 0; i < filtro_marca.selectedOptions.length; i++) {
    opciones_seleccionadas_marcas.push(filtro_marca.selectedOptions[i].value);
  }

  for (let i = 0; i < filtro_familia.selectedOptions.length; i++) {
    opciones_seleccionadas_familias.push(
      filtro_familia.selectedOptions[i].value
    );
  }

  for (let i = 0; i < filtro_producto.selectedOptions.length; i++) {
    opciones_seleccionadas_productos.push(
      filtro_producto.selectedOptions[i].value
    );
  }

  $.ajax({
    url: "utils/graphics/potenciales/trae_productos_potenciales_grafica_barras.php",
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
      categoria: opciones_seleccionadas_categorias,
      marca: opciones_seleccionadas_marcas,
      familia: opciones_seleccionadas_familias,
      producto: opciones_seleccionadas_productos,
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
      region: opciones_seleccionadas_regiones,
      gerencia: opciones_seleccionadas_gerencias,
      division: opciones_seleccionadas_divisiones,
      ceve: opciones_seleccionadas_ceves,
      ruta: opciones_seleccionadas_ruta,
      categoria: opciones_seleccionadas_categorias,
      marca: opciones_seleccionadas_marcas,
      familia: opciones_seleccionadas_familias,
      producto: opciones_seleccionadas_productos,
    },
    success: function (result) {
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

// Función para llenar filtro categoria
const read_filter_categoria = async () => {
  $("#filtro-marca").empty();
  $("#filtro-familia").empty();
  $("#filtro-producto").empty();

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
    url: "utils/filters/trae_categorias.php",
    method: "POST",
    data: {
      region: opciones_seleccionadas_regiones,
      gerencia: opciones_seleccionadas_gerencias,
      division: opciones_seleccionadas_divisiones,
      ceve: opciones_seleccionadas_ceves,
      ruta: opciones_seleccionadas_ruta,
    },
    beforeSend: function () {
      // Mostramos el modal de carga en lo que finalizan las consultas
      // loading_modal.show();
    },
    success: function (result) {
      const json_result = JSON.parse(result);

      // Limpiar filtro
      $("#filtro-categoria").find("option").remove();

      json_result.map((element) => {
        const option = document.createElement("option");
        option.text = element;
        option.value = element;
        filtro_categoria.add(option);
      });

      //Actualizar
      $("#filtro-categoria").selectpicker("refresh");
    },
  });
};

// Recuperamos el form para descargar
const form_descarga = document.querySelector("#form_descarga");

const descarga = (e) => {
  e.preventDefault();

  // Obtener los arreglos de los filtros que el usuario haya seleccionado
  let opciones_seleccionadas_regiones = [];
  let opciones_seleccionadas_gerencias = [];
  let opciones_seleccionadas_divisiones = [];
  let opciones_seleccionadas_ceves = [];
  let opciones_seleccionadas_ruta = [];
  let opciones_seleccionadas_categorias = [];
  let opciones_seleccionadas_marcas = [];
  let opciones_seleccionadas_familias = [];
  let opciones_seleccionadas_productos = [];

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

  for (let i = 0; i < filtro_categoria.selectedOptions.length; i++) {
    opciones_seleccionadas_categorias.push(
      filtro_categoria.selectedOptions[i].value
    );
  }

  for (let i = 0; i < filtro_marca.selectedOptions.length; i++) {
    opciones_seleccionadas_marcas.push(filtro_marca.selectedOptions[i].value);
  }

  for (let i = 0; i < filtro_familia.selectedOptions.length; i++) {
    opciones_seleccionadas_familias.push(
      filtro_familia.selectedOptions[i].value
    );
  }

  for (let i = 0; i < filtro_producto.selectedOptions.length; i++) {
    opciones_seleccionadas_productos.push(
      filtro_producto.selectedOptions[i].value
    );
  }

  if (opciones_seleccionadas_ceves == 0) {
    Swal.fire({
      position: "top-end",
      icon: "warning",
      text: "Selecciona un ceve para poder descargar el archivo",
      showConfirmButton: false,
      timer: 2000,
      width: "400px",
    });
    return;
  }
  if (opciones_seleccionadas_categorias == 0) {
    Swal.fire({
      position: "top-end",
      icon: "warning",
      text: "Selecciona una categoría para poder descargar el archivo",
      showConfirmButton: false,
      timer: 2000,
      width: "400px",
    });
    return;
  }

  document.getElementById("region_descarga").value =
    opciones_seleccionadas_regiones;
  document.getElementById("gerencia_descarga").value =
    opciones_seleccionadas_gerencias;
  document.getElementById("division_descarga").value =
    opciones_seleccionadas_divisiones;
  document.getElementById("ceve_descarga").value = opciones_seleccionadas_ceves;
  document.getElementById("ruta_descarga").value = opciones_seleccionadas_ruta;
  document.getElementById("categoria_descarga").value =
    opciones_seleccionadas_categorias;
  document.getElementById("familia_descarga").value =
    opciones_seleccionadas_familias;
  document.getElementById("marca_descarga").value =
    opciones_seleccionadas_marcas;
  document.getElementById("producto_descarga").value =
    opciones_seleccionadas_productos;

  form_descarga.submit();
};

form_descarga.addEventListener("submit", function (e) {
  descarga(e);
});

$(document).ajaxStop(function () {
  loading_modal.hide();
});

// Agregamos un evento cuando se le de click al botón de filtrar
btn_filtrar.addEventListener("click", cargarFunciones);

// Agregamos evento cuando usuario seleccione opciones de regiones
$("#filtro-region").on("changed.bs.select", read_filter_gerencia);
$("#filtro-region").on("changed.bs.select", read_filter_categoria);

// Agregamos evento cuando usuario seleccione opciones de gerencias
$("#filtro-gerencia").on("changed.bs.select", read_filter_division);
$("#filtro-gerencia").on("changed.bs.select", read_filter_categoria);

// Agregamos evento cuando usuario seleccione opciones de divisiones
$("#filtro-division").on("changed.bs.select", read_filter_ceve);
$("#filtro-division").on("changed.bs.select", read_filter_categoria);

// Agregamos evento cuando usuario seleccione opciones de ceves
$("#filtro-ceve").on("changed.bs.select", read_filter_ruta);
$("#filtro-ceve").on("changed.bs.select", read_filter_categoria);

// Agregamos evento cuando usuario seleccione opciones de rutas
$("#filtro-ruta").on("changed.bs.select", read_filter_categoria);

// Agregamos evento cuando usuario seleccione opciones de categoria
$("#filtro-categoria").on("changed.bs.select", read_filter_marcas);

// Agregamos evento cuando usuario seleccione opciones de marca
$("#filtro-marca").on("changed.bs.select", read_filter_familias);

// Agregamos evento cuando usuario seleccione opciones de familia
$("#filtro-familia").on("changed.bs.select", read_filter_productos);

read_filter_region();
read_filter_categoria();

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
    chart.options.scales.y1.ticks.color = color;
    chart.options.scales.y1.grid.color = color;
    chart.options.scales.y1.grid.borderColor = color;
    chart.update();
  });
}

modeSwitch.addEventListener("click", () => {
  const chartArray = [];
  chartArray.push(myChart_H1Barras);
  updateOptionsChart(chartArray);
});

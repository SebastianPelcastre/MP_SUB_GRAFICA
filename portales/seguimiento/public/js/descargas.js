// Recuperamos del DOM el modal cuando se carga la información
const options = {
  backdrop: "static",
  keyboard: false,
};

const loading_modal = new bootstrap.Modal(
  document.querySelector("#loading-modal"),
  options
);

// Filtros
const filtro_semana = document.getElementById("filtro-semana");
const filtro_region = document.getElementById("filtro-region");
const filtro_gerencia = document.getElementById("filtro-gerencia");
const filtro_division = document.getElementById("filtro-division");
const filtro_ceve = document.getElementById("filtro-ceve");
const filtro_ruta = document.getElementById("filtro-ruta");

// Recuperamos el botón para filtrar
const btn_filtrar = document.querySelector("#filtro-btn");

window.onload = cargarFunciones();

function cargarFunciones() {
  loading_modal.show();
  setTimeout(() => {
    loading_modal.hide();
  }, 3000);
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

// Recuperamos el form para descargar
const form_descarga = document.querySelector("#form_descarga");
const form_descarga_two = document.querySelector("#form_descarga2");
const form_descarga_three = document.querySelector("#form_descarga3");
const form_descarga_four = document.querySelector("#form_descarga4");

const descarga = (e) => {
  e.preventDefault();

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

  document.getElementById("semana_descarga").value =
    opciones_seleccionadas_semanas;
  document.getElementById("region_descarga").value =
    opciones_seleccionadas_regiones;
  document.getElementById("gerencia_descarga").value =
    opciones_seleccionadas_gerencias;
  document.getElementById("division_descarga").value =
    opciones_seleccionadas_divisiones;
  document.getElementById("ceve_descarga").value = opciones_seleccionadas_ceves;
  document.getElementById("ruta_descarga").value = opciones_seleccionadas_ruta;

  form_descarga.submit();
};

const descarga2 = (e) => {
  e.preventDefault();

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

  document.getElementById("semana_descarga2").value =
    opciones_seleccionadas_semanas;
  document.getElementById("region_descarga2").value =
    opciones_seleccionadas_regiones;
  document.getElementById("gerencia_descarga2").value =
    opciones_seleccionadas_gerencias;
  document.getElementById("division_descarga2").value =
    opciones_seleccionadas_divisiones;
  document.getElementById("ceve_descarga2").value =
    opciones_seleccionadas_ceves;
  document.getElementById("ruta_descarga2").value = opciones_seleccionadas_ruta;

  form_descarga_two.submit();
};

const descarga3 = (e) => {
  e.preventDefault();

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

  document.getElementById("semana_descarga3").value =
    opciones_seleccionadas_semanas;
  document.getElementById("region_descarga3").value =
    opciones_seleccionadas_regiones;
  document.getElementById("gerencia_descarga3").value =
    opciones_seleccionadas_gerencias;
  document.getElementById("division_descarga3").value =
    opciones_seleccionadas_divisiones;
  document.getElementById("ceve_descarga3").value =
    opciones_seleccionadas_ceves;
  document.getElementById("ruta_descarga3").value = opciones_seleccionadas_ruta;

  form_descarga_three.submit();
};

const descarga4 = (e) => {
  e.preventDefault();

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

  document.getElementById("semana_descarga4").value =
    opciones_seleccionadas_semanas;
  document.getElementById("region_descarga4").value =
    opciones_seleccionadas_regiones;
  document.getElementById("gerencia_descarga4").value =
    opciones_seleccionadas_gerencias;
  document.getElementById("division_descarga4").value =
    opciones_seleccionadas_divisiones;
  document.getElementById("ceve_descarga4").value =
    opciones_seleccionadas_ceves;
  document.getElementById("ruta_descarga4").value = opciones_seleccionadas_ruta;
  form_descarga_four.submit();
};

form_descarga.addEventListener("submit", function (e) {
  descarga(e);
});
form_descarga_two.addEventListener("submit", function (e) {
  descarga2(e);
});
form_descarga_three.addEventListener("submit", function (e) {
  descarga3(e);
});
form_descarga_four.addEventListener("submit", function (e) {
  descarga4(e);
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

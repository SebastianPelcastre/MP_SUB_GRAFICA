// Recuperamos del DOM el modal cuando se carga la información
const options = {
  backdrop: "static",
  keyboard: false,
};

const loading_modal = new bootstrap.Modal(
  document.querySelector("#loading-modal"),
  options
);

// Filtros modal agregar usuarios
const filtro_gerencia = document.getElementById("filtro-gerencia");
const filtro_division = document.getElementById("filtro-division");
const filtro_ceve = document.getElementById("filtro-ceve");

// Filtros modal editar usuarios
const filtro_gerencia_editar = document.getElementById(
  "filtro-gerencia-editar"
);
const filtro_division_editar = document.getElementById(
  "filtro-division-editar"
);
const filtro_ceve_editar = document.getElementById("filtro-ceve-editar");

// Recuperamos el botón para filtrar
const btn_filtrar = document.querySelector("#filtro-btn");

function cargarFunciones() {
  traeIndicadores();
  loading_modal.show();
  setTimeout(() => {
    loading_modal.hide();
  }, 8000);
}

// Función para llenar filtro gerencia
const read_filter_gerencia = async () => {
  $.ajax({
    url: "utils/filters/trae_gerencias_matriz_usuarios.php",
    method: "POST",
    beforeSend: function () {
      // Mostramos el modal de carga en lo que finalizan las consultas
      // loading_modal.show();
    },
    success: function (result) {
      // loading_modal.hide();

      const json_result = JSON.parse(result);

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

const tabla_matriz_usuarios = $("#tabla-matriz-usuarios").DataTable({
  scrollY: 450,
  scrollX: "100%",
  scrollCollapse: true,
  lengthChange: false,
  searching: true,
  language: {
    searchPanes: {
      title: {
        _: "Filtros Seleccionados - %d",
        0: "Sin Filtros Seleccionados",
        1: "Un Filtro Seleccionado",
      },
      emptyPanes: "Sin Paneles de Búsqueda",
    },
    search: "Buscar",
    infoFiltered: "(filtrado de _MAX_ registros totales)",
    paginate: {
      next: "Siguiente",
      previous: "Atrás",
    },
    info: "Mostrando página _PAGE_ de _PAGES_",
  },
  ajax: "utils/matriz-usuarios/trae_matriz_usuarios.php",
  columns: [
    { data: "correo" },
    { data: "nombre_usuario" },
    { data: "no_colaborador" },
    { data: "editar" },
    { data: "eliminar" },
  ],
});

function traeIndicadores() {
  //Declaramos la variable para tomar los valores de la tabla
  let correo = "";
  let nombre_usuario = "";
  let no_colaborador = "";

  $(document).on("submit", "#agregarUsuarioForm", function (event) {
    event.preventDefault();

    //Campos donde se pasa el valor directamente
    let correo_supervisor_sistemas = $("#correo-supervisor").val();
    let nombre_colaborador = $("#nombre-colaborador").val();
    let no_colaborador = $("#no-colaborador").val();

    //Tomamos el valor de los select dentro del modal
    let opciones_seleccionadas_gerencias = [];
    let opciones_seleccionadas_divisiones = [];
    let opciones_seleccionadas_ceves = [];

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

    if (correo_supervisor_sistemas == "") {
      Swal.fire({
        icon: "info",
        title: "Oops...",
        text: "Favor de llenar todos los campos",
        showConfirmButton: false,
        timer: 1200,
      });
    } else {
      $.ajax({
        url: "utils/matriz-usuarios/insertar_usuario.php",
        method: "POST",
        data: {
          correo_supervisor_sistemas: correo_supervisor_sistemas,
          nombre_colaborador: nombre_colaborador,
          no_colaborador: no_colaborador,
          gerencia: opciones_seleccionadas_gerencias,
          division: opciones_seleccionadas_divisiones,
          ceve: opciones_seleccionadas_ceves,
        },
        success: function (result) {
          Swal.fire({
            icon: "success",
            title: "¡Su registro se ha guardado correctamente!",
            showConfirmButton: false,
            timer: 1500,
          });
          $("#agregarUsuarioModal").modal("hide");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
      });
    }
  });

  $(document).on("submit", "#editarUsuarioForm", function (event) {
    event.preventDefault();

    //Campos donde se pasa el valor directamente
    let correo_supervisor_sistemas_editado = $(
      "#editar-correo-supervisor"
    ).val();
    let nombre_colaborador_editado = $("#editar-nombre-colaborador").val();
    let no_colaborador_editado = $("#editar-no-colaborador").val();

    //Tomamos el valor de los select dentro del modal
    let opciones_seleccionadas_gerencias_editado = [];
    let opciones_seleccionadas_divisiones_editado = [];
    let opciones_seleccionadas_ceves_editado = [];

    for (let i = 0; i < filtro_gerencia_editar.selectedOptions.length; i++) {
      opciones_seleccionadas_gerencias_editado.push(
        filtro_gerencia_editar.selectedOptions[i].value
      );
    }
    for (let i = 0; i < filtro_division_editar.selectedOptions.length; i++) {
      opciones_seleccionadas_divisiones_editado.push(
        filtro_division_editar.selectedOptions[i].value
      );
    }
    for (let i = 0; i < filtro_ceve_editar.selectedOptions.length; i++) {
      opciones_seleccionadas_ceves_editado.push(
        filtro_ceve_editar.selectedOptions[i].value
      );
    }

    $.ajax({
      url: "utils/matriz-usuarios/editar_usuario.php",
      method: "POST",
      data: {
        correo_supervisor_sistemas_editado: correo_supervisor_sistemas_editado,
        correo_supervisor_sistemas_actual: correo,
        nombre_colaborador_editado: nombre_colaborador_editado,
        no_colaborador_editado: no_colaborador_editado,
        gerencia: opciones_seleccionadas_gerencias_editado,
        division: opciones_seleccionadas_divisiones_editado,
        ceve: opciones_seleccionadas_ceves_editado,
      },
      success: function (result) {
        Swal.fire({
          icon: "success",
          title: "¡Su registro se ha editado correctamente!",
          showConfirmButton: false,
          timer: 1500,
        });
        $("#agregarUsuarioModal").modal("hide");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      },
    });
  });

  tabla_matriz_usuarios.on("click", ".editar", function () {
    correo = tabla_matriz_usuarios.rows($(this).closest("tr")).data()[0].correo;
    nombre_usuario = tabla_matriz_usuarios
      .rows($(this).closest("tr"))
      .data()[0].nombre_usuario;
    no_colaborador = tabla_matriz_usuarios
      .rows($(this).closest("tr"))
      .data()[0].no_colaborador;

    //Abrimos el modal de editar usuarios
    $("#editarUsuarioModal").modal("show");

    // Función para llenar filtro gerencia editar usuario
    const read_filter_gerencia_editar = async () => {
      $.ajax({
        url: "utils/filters/trae_gerencias_matriz_usuarios.php",
        method: "POST",
        beforeSend: function () {
          // Mostramos el modal de carga en lo que finalizan las consultas
          // loading_modal.show();
        },
        success: function (result) {
          // loading_modal.hide();

          const json_result = JSON.parse(result);

          // Limpiar filtro
          $("#filtro-gerencia-editar").find("option").remove();

          json_result.map((element) => {
            const option = document.createElement("option");
            option.text = element;
            option.value = element;
            filtro_gerencia_editar.add(option);
          });

          //Actualizar
          $("#filtro-gerencia-editar").selectpicker("refresh");
        },
      });
    };

    // Función para llenar filtro division editar usuario
    const read_filter_division_editar = async () => {
      let opciones_seleccionadas_gerencias = [];

      for (let i = 0; i < filtro_gerencia_editar.selectedOptions.length; i++) {
        opciones_seleccionadas_gerencias.push(
          filtro_gerencia_editar.selectedOptions[i].value
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
            $("#filtro-division-editar").find("option").remove();

            json_result.map((element) => {
              const option = document.createElement("option");
              option.text = element;
              option.value = element;
              filtro_division_editar.add(option);
            });

            //Actualizar
            $("#filtro-division-editar").selectpicker("refresh");
          },
        });
      }
    };

    // Función para llenar filtro ceve editar usuario
    const read_filter_ceve_editar = () => {
      let opciones_seleccionadas_divisiones = [];

      for (let i = 0; i < filtro_division_editar.selectedOptions.length; i++) {
        opciones_seleccionadas_divisiones.push(
          filtro_division_editar.selectedOptions[i].value
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
            $("#filtro-ceve-editar").find("option").remove();

            json_result.map((element) => {
              const option = document.createElement("option");
              option.text = element["nombre_ceve"];
              option.value = element["id_ceve"];
              filtro_ceve_editar.add(option);
            });

            //Actualizar
            $("#filtro-ceve-editar").selectpicker("refresh");
          },
        });
      }
    };

    // Agregamos evento cuando usuario seleccione opciones de gerencias
    $("#filtro-gerencia-editar").on(
      "changed.bs.select",
      read_filter_division_editar
    );

    // Agregamos evento cuando usuario seleccione opciones de divisiones
    $("#filtro-division-editar").on(
      "changed.bs.select",
      read_filter_ceve_editar
    );

    read_filter_gerencia_editar();

    $("#editar-correo-supervisor").val(correo);
    $("#editar-nombre-colaborador").val(nombre_usuario);
    $("#editar-no-colaborador").val(no_colaborador);
  });

  tabla_matriz_usuarios.on("click", ".eliminar", function () {
    correo = tabla_matriz_usuarios.rows($(this).closest("tr")).data()[0].correo;
    $.ajax({
      url: "utils/matriz-usuarios/eliminar_usuario.php",
      method: "POST",
      data: {
        correo: correo,
      },
      success: function (result) {
        const jsonResult = JSON.parse(result);
        if (parseInt(jsonResult["status"]) === 1) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Lo sentimos algo salio, contacta a esteban.ramirez03@grupobimbo.com",
            showConfirmButton: false,
            timer: 1200,
          });
        } else if (parseInt(jsonResult["status"]) === 2) {
          Swal.fire({
            icon: "success",
            title: "¡Su registro se ha eliminado correctamente!",
            showConfirmButton: false,
            timer: 1200,
          });
        }
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      },
    });
  });
}

window.onload = cargarFunciones();

// Agregamos evento cuando usuario seleccione opciones de gerencias
$("#filtro-gerencia").on("changed.bs.select", read_filter_division);

// Agregamos evento cuando usuario seleccione opciones de divisiones
$("#filtro-division").on("changed.bs.select", read_filter_ceve);

read_filter_gerencia();

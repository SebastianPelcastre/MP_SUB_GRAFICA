// Recuperamos del DOM el modal cuando se carga la información
const options = {
  backdrop: "static",
  keyboard: false,
};

const loading_modal = new bootstrap.Modal(
  document.querySelector("#loading-modal"),
  options
);

const tipo_usuario = document.getElementById("tipo_usuario").value;

// Filtros
const filtro_region = document.getElementById("filtro-region");
const filtro_gerencia = document.getElementById("filtro-gerencia");
const filtro_division = document.getElementById("filtro-division");
const filtro_ceve = document.getElementById("filtro-ceve");
const filtro_supervisor = document.getElementById("filtro-supervisor");
const filtro_ruta = document.getElementById("filtro-ruta");

// Recuperamos el botón para filtrar
const btn_filtrar = document.querySelector("#filtro-btn");

function cargarFunciones() {
  traeIndicadores();
  loading_modal.show();
  setTimeout(() => {
    loading_modal.hide();
  }, 8000);
}

function borrarFiltros() {
  window.location.reload();
}

$("#supervision-btn").click(function () {
  Swal.fire({
    title: "Motivo de no supervisión",
    html: `<input type="text" id="colaborador" class='form-control mt-3' placeholder="No. Colaborador">
           <select id="motivo" class="form-select mt-3" aria-label="Default select example">
            <option selected value="suplencia">Suplencia</option>
            <option selected value="vacaciones">Vacaciones</option>
            <option selected value="incapacidad">Incapacidad</option>
            <option selected value="garra">Garra</option>
            <option selected value="apoyo">Apoyo CeVe</option>
            <option selected value="proyecto">Proyecto</option>
            <option selected value="capacitacion">Capacitación</option>
            <option selected value="curso">Curso</option>
            <option selected value="junta">Juntas</option>
           </select>
           <textarea id='comentario-supervision' class='form-control mt-3' placeholder='Ingresa un comentario (Opcional)'></textarea>
           <input class='form-control mt-3' type="text" id='fecha-supervision' value="15/03/2023 - 10/04/2023" />`,
    confirmButtonText: "Guardar",
    confirmButtonColor: "#27a844",
    focusConfirm: false,
    didOpen: () => {
      $("#fecha-supervision")
        .daterangepicker({
          minDate: new Date(),
          opens: "center",
          locale: {
            format: "YYYY-MM-DD",
            applyLabel: "Aplicar",
            cancelLabel: "Cancelar",
            fromLabel: "From",
            toLabel: "To",
            customRangeLabel: "Custom",
            weekLabel: "W",
            daysOfWeek: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
            monthNames: [
              "Enero",
              "Febrero",
              "Marzo",
              "Abril",
              "Mayo",
              "Junio",
              "Julio",
              "Agosto",
              "Septiembre",
              "Octubre",
              "Noviembre",
              "Diciembre",
            ],
            firstDay: 4,
          },
        })
        .on("showCalendar.daterangepicker", function (ev, picker) {
          picker.container.addClass("no-transition");

          setTimeout(
            function () {
              var calendarTop =
                $(this).offset().top - picker.container.height() - 10;
              var calendarLeft = $(this).offset().left;

              picker.container.css({
                top: calendarTop,
                left: calendarLeft,
              });

              setTimeout(function () {
                picker.container.removeClass("no-transition");
              }, 0.1);
            }.bind(this),
            1
          );
        });
    },
    preConfirm: () => {
      if (document.getElementById("colaborador").value == "") {
        Swal.showValidationMessage("Ingresa tu numero de colaborador");
      }
      return [
        document.getElementById("colaborador").value,
        document.getElementById("motivo").value,
        document.getElementById("comentario-supervision").value,
        document.getElementById("fecha-supervision").value,
      ];
    },
  }).then((result) => {
    if (result.value) {
      let no_colaborador = result.value[0];
      let motivo = result.value[1];
      let comentario_supervision = result.value[2];
      let fecha = result.value[3];
      if (comentario_supervision === "") {
        comentario_supervision = "SIN COMENTARIOS";
      }
      $.ajax({
        url: "utils/supervision/insertar_no_supervision.php",
        method: "post",
        data: {
          no_colaborador: no_colaborador,
          motivo: motivo,
          comentario_supervision: comentario_supervision,
          fecha: fecha,
        },
        success: function (data) {
          traeIndicadores();

          const jsonResult = JSON.parse(data);

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
              title: "¡Su registro se ha guardado correctamente!",
              showConfirmButton: false,
              timer: 1200,
            });
          }
        },
      });
    }
  });
});

// function verificarTipoUsuario(tipo_usuario) {
//   switch (tipo_usuario) {
//     case "supervisor":
//       // Ocultar los demás filtros
//       $(".col-12.col-md-6.col-xl-4").hide();
//       // Mostrar el filtro de ruta
//       $("#filtro-ruta").closest(".col-12.col-md-6.col-xl-4").show();
//       // Llenar el filtro de ruta
//       read_filter_ruta();
//       break;

//     case "divisional":
//       // Ocultar los filtros no necesarios
//       $("#filtro-region,#filtro-gerencia,#filtro-division")
//         .closest(".col-12.col-md-6.col-xl-4")
//         .hide();
//       // Mostrar y llenar los filtros necesarios
//       $("#filtro-ceve,#filtro-supervisor,#filtro-ruta")
//         .closest(".col-12.col-md-6.col-xl-4")
//         .show();
//       // Llenar los filtros necesarios
//       read_filter_ceve();
//       read_filter_supervisor();
//       read_filter_ruta();
//       break;

//     case "gerente":
//       // Ocultar los filtros no necesarios
//       $("#filtro-region,#filtro-gerencia")
//         .closest(".col-12.col-md-6.col-xl-4")
//         .hide();
//       // Mostrar y llenar los filtros necesarios
//       $("#filtro-division,#filtro-ceve,#filtro-supervisor,#filtro-ruta")
//         .closest(".col-12.col-md-6.col-xl-4")
//         .show();
//       // Llenar los filtros necesarios
//       read_filter_division();
//       read_filter_ceve();
//       read_filter_supervisor();
//       read_filter_ruta();
//       break;

//     default:
//       // Mostrar todos los filtros
//       $(".col-12.col-md-6.col-xl-4").show();
//       // Llenar todos los filtros
//       read_filter_region();
//       read_filter_gerencia();
//       read_filter_division();
//       read_filter_ceve();
//       read_filter_supervisor();
//       read_filter_ruta();
//   }
// }

// $(document).ready(function () {
//   verificarTipoUsuario(tipo_usuario);
// });

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

// Función para llenarfiltro supervisor
const read_filter_supervisor = () => {
  let opciones_seleccionadas_ceves = [];

  for (let i = 0; i < filtro_ceve.selectedOptions.length; i++) {
    opciones_seleccionadas_ceves.push(filtro_ceve.selectedOptions[i].value);
  }

  if (opciones_seleccionadas_ceves.length > 0) {
    $.ajax({
      url: "utils/filters/trae_supervisor.php",
      method: "POST",
      data: {
        ceves: opciones_seleccionadas_ceves,
      },
      beforeSend: function () {
        // Mostramos el modal de carga en lo que finalizan las consultas
        // loading_modal.show();
      },
      success: function (result) {
        // loading_modal.hide();
        const json_result = JSON.parse(result);

        // Limpiar filtro
        $("#filtro-supervisor").find("option").remove();

        json_result.map((element) => {
          const option = document.createElement("option");
          option.text = element["supervisor"];
          option.value = element["cod_supervisor"];
          filtro_supervisor.add(option);
        });

        //Actualizar
        $("#filtro-supervisor").selectpicker("refresh");
      },
    });
  }
};

// Función para llenar filtro ruta
const read_filter_ruta = async () => {
  let opciones_seleccionadas_supervisor = [];

  for (let i = 0; i < filtro_supervisor.selectedOptions.length; i++) {
    opciones_seleccionadas_supervisor.push(
      filtro_supervisor.selectedOptions[i].value
    );
  }

  if (opciones_seleccionadas_supervisor.length > 0) {
    $.ajax({
      url: "utils/filters/trae_rutas_calificacion_rutas.php",
      method: "POST",
      data: {
        supervisor: opciones_seleccionadas_supervisor,
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

const tabla_calificacion_rutas = $("#tabla-impulsos").DataTable({
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
  ajax: "utils/tables/trae_calificacion_rutas.php",
  columns: [
    { data: "cod_ceve", visible: false },
    { data: "cod_ruta" },
    { data: "tipo_ruta" },
    { data: "itinerados_real" },
    {
      data: "porcentaje_potencial",
      render: $.fn.dataTable.render.number(","),
    },
    {
      data: "porcentaje_efectividad",
      render: $.fn.dataTable.render.number(","),
    },
    {
      data: "porcentaje_alcance_presupuesto",
      render: $.fn.dataTable.render.number(","),
    },
    {
      data: "porcentaje_existencia",
      render: $.fn.dataTable.render.number(","),
    },
    {
      data: "porcentaje_pesito",
      render: $.fn.dataTable.render.number(","),
    },
    {
      data: "saldo_credito_vencido",
      render: $.fn.dataTable.render.number(","),
    },
    {
      data: "clientes_con_pesito_vencido",
      render: $.fn.dataTable.render.number(","),
    },
    {
      data: "clientes_credito_pesito_otorgado",
      render: $.fn.dataTable.render.number(","),
    },
    {
      data: "venta_cero_ultimas_4_semanas",
      render: $.fn.dataTable.render.number(","),
    },
    {
      data: "saldo_compra_fresco",
      render: $.fn.dataTable.render.number(","),
    },
    {
      data: "clientes_reales_compra_fresco",
      render: $.fn.dataTable.render.number(","),
    },
    {
      data: "ctes_desviacion_reales",
      render: $.fn.dataTable.render.number(","),
    },
    {
      data: "clientes_frecuencia_incorrecta",
      render: $.fn.dataTable.render.number(","),
    },
    {
      data: "evaluacion",
      render: $.fn.dataTable.render.number(","),
    },
    { data: "fecha_comentario" },
  ],
  aoColumnDefs: [
    {
      aTargets: [17],
      fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
        if (sData >= 0 && sData <= 60) {
          $(nTd).css("background-color", "#e32424");
        } else if (sData >= 61 && sData <= 85) {
          $(nTd).css("background-color", "#fff236");
        } else if (sData >= 86 && sData <= 100) {
          $(nTd).css("background-color", "#46eb5f");
        }
      },
    },
  ],
  drawCallback: function (settings) {
    var api = this.api();

    if (api.rows({ page: "current" }).data().length > 0) {
      const numeroRegistros = api.rows().data().length;

      for (let i = 0; i < numeroRegistros; i++) {
        $(`#filtroFecha_${i}`).daterangepicker({
          singleDatePicker: true,
          minDate: new Date(),
          opens: "center",
          locale: {
            format: "YYYY-MM-DD",
            label: "Textos",
            applyLabel: "Aplicar",
            cancelLabel: "Cancelar",
            fromLabel: "From",
            toLabel: "To",
            customRangeLabel: "Custom",
            weekLabel: "W",
            daysOfWeek: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
            monthNames: [
              "Enero",
              "Febrero",
              "Marzo",
              "Abril",
              "Mayo",
              "Junio",
              "Julio",
              "Agosto",
              "Septiembre",
              "Octubre",
              "Noviembre",
              "Diciembre",
            ],
            firstDay: 4,
          },
        });
      }
    }
  },
});

tabla_calificacion_rutas.on("click", ".fecha", function () {
  let id = $(this).attr("id");

  Swal.fire({
    title: "Agendar ruta",
    html: "<input class='form-control text-center' style='width: -webkit-fill-available;' type='text' id='fecha''/><textarea id='comentario' class='form-control text-center mt-3' placeholder='Ingresa un comentario (Opcional)'/>",
    focusConfirm: false,
    showCloseButton: true,
    confirmButtonText: "Agendar",
    confirmButtonColor: "#2c8528",
    didOpen: () => {
      $("#fecha").daterangepicker({
        singleDatePicker: true,
        minDate: new Date(),
        opens: "center",
        locale: {
          format: "YYYY-MM-DD",
          applyLabel: "Aplicar",
          cancelLabel: "Cancelar",
          fromLabel: "From",
          toLabel: "To",
          customRangeLabel: "Custom",
          weekLabel: "W",
          daysOfWeek: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
          monthNames: [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
          ],
          firstDay: 4,
        },
      });
    },
    preConfirm: () => {
      return [
        document.getElementById("fecha").value,
        document.getElementById("comentario").value,
      ];
    },
  }).then((result) => {
    if (result.value) {
      let fecha = result.value[0];
      let ceve = tabla_calificacion_rutas
        .rows($(this).closest("tr"))
        .data()[0].cod_ceve;
      let ruta = tabla_calificacion_rutas
        .rows($(this).closest("tr"))
        .data()[0].cod_ruta;
      let comentario = result.value[1];
      if (comentario === "") {
        comentario = "SIN COMENTARIOS";
      }

      $.ajax({
        url: "utils/calendario/insertar_fecha.php",
        method: "post",
        data: {
          ceve: ceve,
          ruta: ruta,
          comentario: comentario,
          fecha: fecha,
        },
        success: function (data) {
          traeIndicadores();

          const jsonResult = JSON.parse(data);

          if (parseInt(jsonResult["status"]) === 1) {
            Swal.fire({
              icon: "info",
              title: "¡Ya tienes asignada una ruta para el dia seleccionado!",
              showConfirmButton: true,
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Entendido",
            });
          } else if (parseInt(jsonResult["status"]) === 2) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Lo sentimos algo salio, contacta a esteban.ramirez03@grupobimbo.com",
              showConfirmButton: false,
              timer: 1200,
            });
          } else if (parseInt(jsonResult["status"]) === 3) {
            Swal.fire({
              icon: "success",
              title: "¡Su registro se ha guardado correctamente!",
              showConfirmButton: false,
              timer: 1200,
            });
          }
        },
      });
    }
  });
});

function traeIndicadores() {
  // Obtener los arreglos de los filtros que el usuario haya seleccionado
  let opciones_seleccionadas_regiones = [];
  let opciones_seleccionadas_gerencias = [];
  let opciones_seleccionadas_divisiones = [];
  let opciones_seleccionadas_ceves = [];
  let opciones_seleccionadas_supervisores = [];
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

  for (let i = 0; i < filtro_supervisor.selectedOptions.length; i++) {
    opciones_seleccionadas_supervisores.push(
      filtro_supervisor.selectedOptions[i].value
    );
  }

  for (let i = 0; i < filtro_ruta.selectedOptions.length; i++) {
    opciones_seleccionadas_ruta.push(filtro_ruta.selectedOptions[i].value);
  }

  $.ajax({
    url: "utils/tables/trae_calificacion_rutas.php",
    method: "POST",
    data: {
      region: opciones_seleccionadas_regiones,
      gerencia: opciones_seleccionadas_gerencias,
      division: opciones_seleccionadas_divisiones,
      ceve: opciones_seleccionadas_ceves,
      supervisor: opciones_seleccionadas_supervisores,
      ruta: opciones_seleccionadas_ruta,
    },
    success: function (result) {
      calificacionRutas = JSON.parse(result);

      tabla_calificacion_rutas.clear();
      tabla_calificacion_rutas.rows.add(calificacionRutas["data"]).draw();
      tabla_calificacion_rutas.columns.adjust();
    },
  });

  if (tipo_usuario != "supervisor") {
    function loadEvents() {
      var calendarEl = document.getElementById("calendar");

      var calendar = new FullCalendar.Calendar(calendarEl, {
        editable: false,
        header: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        buttonText: {
          today: "Hoy: " + moment().locale("es").format("DD - MMMM"),
        },
        locale: "es",
        events: "utils/calendario/trae_calendario.php",
        selectable: true,
        eventClick: function (info) {
          var comentario = info.event.extendedProps["comentario"];
          var comentarioHtml = comentario
            ? "<p>Comentario: " + comentario + "</p>"
            : "";

          var nombreColaborador = info.event.extendedProps["nombre_usuario"];
          var nombreHtml =
            "<p>Nombre del Supervisor: " + nombreColaborador + "</p>";

          Swal.fire({
            title:
              info.event.extendedProps["id_ceve"] == 0
                ? "El motivo de no supervisión es:  " +
                  info.event.extendedProps["motivo"]
                : info.event.startStr,
            icon: "info",
            html:
              info.event.extendedProps["id_ceve"] == 0
                ? nombreHtml + comentarioHtml // Agrega el nombre y el comentario aquí si el id_ceve es 0
                : nombreHtml +
                  "<p>" +
                  "Ruta: " +
                  info.event.extendedProps["id_ruta"] +
                  "</br>" +
                  "CeVe: " +
                  info.event.extendedProps["id_ceve"] +
                  "</p>" +
                  comentarioHtml, // Agrega el nombre y el comentario aquí si el id_ceve no es 0
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: false,
            showDenyButton: false,
            cancelButtonText: "Cerrar",
          });
        },
      });
      calendar.render();
    }
  } else {
    function loadEvents() {
      var calendarEl = document.getElementById("calendar");

      var calendar = new FullCalendar.Calendar(calendarEl, {
        editable: true,
        header: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        buttonText: {
          //Here I make the button show French date instead of a text.
          today: "Hoy: " + moment().locale("es").format("DD - MMMM"),
        },
        locale: "es",
        events: "utils/calendario/trae_calendario.php",
        selectable: true,
        eventClick: function (info) {
          var comentario = info.event.extendedProps["comentario"];
          var comentarioHtml = comentario
            ? "<p>Comentario: " + comentario + "</p>"
            : "";

          Swal.fire({
            title:
              info.event.extendedProps["id_ceve"] == 0
                ? "El motivo de no supervisión es:  " +
                  info.event.extendedProps["motivo"]
                : "El dia de hoy: " + info.event.startStr,
            icon: "info",
            html:
              info.event.extendedProps["id_ceve"] == 0
                ? comentarioHtml
                : "<p>" +
                  "Para la ruta: " +
                  info.event.extendedProps["id_ruta"] +
                  "</br>" +
                  "Del CeVe: " +
                  info.event.extendedProps["id_ceve"] +
                  "</p>" +
                  comentarioHtml,
            showCloseButton: true,
            showCancelButton: true,
            showDenyButton: true,
            cancelButtonText: "Cerrar",
            confirmButtonText: "Eliminar",
            confirmButtonColor: "#d92145",
            denyButtonText: "Editar",
            denyButtonColor: "#42a4f5",
          }).then((result) => {
            if (result.isConfirmed) {
              if (info.event.extendedProps["id_ceve"] == 0) {
                let fecha_inicio = info.event.startStr;
                let fecha_fin = info.event.endStr;
                let no_colaborador = info.event.extendedProps["no_colaborador"];
                let comentario = info.event.extendedProps["comentario"];
                //Se hace la validacion de vacio debido a que si la fecha es para un unico dia solamente toma la fecha de inicio y la variable llega vacia al ajax por lo cual colocamos el valor de inicio debido a que solo es un dia, si no toma el rango de fechas
                if (fecha_fin == "") {
                  fecha_fin = info.event.startStr;
                }
                $.ajax({
                  url: "utils/supervision/eliminar_no_supervision.php",
                  method: "post",
                  data: {
                    fecha_inicio: fecha_inicio,
                    fecha_fin: fecha_fin,
                    no_colaborador: no_colaborador,
                    motivo: comentario,
                  },
                  success: function (data) {
                    traeIndicadores();
                    const jsonResult = JSON.parse(data);

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
                  },
                });
              } else {
                let fecha = info.event.startStr;
                let ceve = info.event.extendedProps["id_ceve"];
                let ruta = info.event.extendedProps["id_ruta"];
                $.ajax({
                  url: "utils/calendario/eliminar_fecha.php",
                  method: "post",
                  data: { fecha: fecha, ceve: ceve, ruta: ruta },
                  success: function (data) {
                    traeIndicadores();
                    const jsonResult = JSON.parse(data);

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
                  },
                });
              }
            } else if (result.isDenied) {
              if (info.event.extendedProps["id_ceve"] == 0) {
                Swal.fire({
                  title: "Editar motivo de supervisión",
                  html:
                    info.event.extendedProps.comentario === "SIN COMENTARIOS"
                      ? `<select id="motivo" class="form-select mt-3" aria-label="Default select example">
                            <option selected value="suplencia">Suplencia</option>
                            <option selected value="vacaciones">Vacaciones</option>
                            <option selected value="incapacidad">Incapacidad</option>
                            <option selected value="garra">Garra</option>
                            <option selected value="apoyo">Apoyo CeVe</option>
                            <option selected value="proyecto">Proyecto</option>
                            <option selected value="capacitacion">Capacitación</option>
                            <option selected value="curso">Curso</option>
                            <option selected value="junta">Juntas</option>
                            </select>
                            <textarea id='comentario-supervision' class='form-control mt-3' placeholder='Ingresa un comentario (Opcional)'></textarea>
                            <input class='form-control mt-3' type="text" id='fecha-supervision' value="15/03/2023 - 10/04/2023" />`
                      : `<select id="motivo" class="form-select mt-3" aria-label="Default select example">
                            <option selected value="suplencia">Suplencia</option>
                            <option selected value="vacaciones">Vacaciones</option>
                            <option selected value="incapacidad">Incapacidad</option>
                            <option selected value="garra">Garra</option>
                            <option selected value="apoyo">Apoyo CeVe</option>
                            <option selected value="proyecto">Proyecto</option>
                            <option selected value="capacitacion">Capacitación</option>
                            <option selected value="curso">Curso</option>
                            <option selected value="junta">Juntas</option>
                            </select>
                            <textarea id='comentario-supervision' class='form-control mt-3' placeholder='Ingresa un comentario (Opcional)'>` +
                        info.event.extendedProps.comentario +
                        `</textarea>
                            <input class='form-control mt-3' type="text" id='fecha-supervision' value="15/03/2023 - 10/04/2023" /> `,
                  confirmButtonText: "Guardar",
                  confirmButtonColor: "#27a844",
                  focusConfirm: false,
                  didOpen: () => {
                    $("#fecha-supervision").daterangepicker({
                      minDate: new Date(),
                      opens: "center",
                      locale: {
                        format: "YYYY-MM-DD",
                        applyLabel: "Aplicar",
                        cancelLabel: "Cancelar",
                        fromLabel: "From",
                        toLabel: "To",
                        customRangeLabel: "Custom",
                        weekLabel: "W",
                        daysOfWeek: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
                        monthNames: [
                          "Enero",
                          "Febrero",
                          "Marzo",
                          "Abril",
                          "Mayo",
                          "Junio",
                          "Julio",
                          "Agosto",
                          "Septiembre",
                          "Octubre",
                          "Noviembre",
                          "Diciembre",
                        ],
                        firstDay: 4,
                      },
                    });
                  },
                  preConfirm: () => {
                    return [
                      document.getElementById("motivo").value,
                      document.getElementById("comentario-supervision").value,
                      document.getElementById("fecha-supervision").value,
                    ];
                  },
                }).then((result) => {
                  if (result.value) {
                    let no_colaborador =
                      info.event.extendedProps["no_colaborador"];
                    let motivoAnterior = info.event.extendedProps["motivo"];
                    let motivoActualizado = result.value[0];
                    let comentario = result.value[1];
                    let fechaInicioAnterior = info.event.startStr;
                    let fechaFinAnterior = info.event.endStr;
                    let fechaActualizada = result.value[2];
                    //Se hace la validacion de vacio debido a que si la fecha es para un unico dia solamente toma la fecha de inicio y la variable llega vacia al ajax por lo cual colocamos el valor de inicio debido a que solo es un dia, si no toma el rango de fechas
                    if (fechaFinAnterior == "") {
                      fechaFinAnterior = info.event.startStr;
                    }
                    $.ajax({
                      url: "utils/supervision/editar_no_supervision.php",
                      method: "post",
                      data: {
                        no_colaborador: no_colaborador,
                        motivoAnterior: motivoAnterior,
                        motivoActualizado: motivoActualizado,
                        comentario: comentario,
                        fechaInicioAnterior: fechaInicioAnterior,
                        fechaFinAnterior: fechaFinAnterior,
                        fechaActualizada: fechaActualizada,
                      },
                      success: function (data) {
                        traeIndicadores();

                        const jsonResult = JSON.parse(data);

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
                            title: "¡Su registro se ha guardado correctamente!",
                            showConfirmButton: false,
                            timer: 1200,
                          });
                        }
                      },
                    });
                  }
                });
              } else {
                Swal.fire({
                  title: "Editar Fecha",
                  html:
                    info.event.extendedProps.comentario === "SIN COMENTARIOS"
                      ? '<input class="form-control text-center" style="width: -webkit-fill-available;" type="text" id="fecha" value="' +
                        info.event.startStr +
                        '">' +
                        '<textarea id="comentario" class="form-control text-center mt-3" placeholder="Ingresa un comentario (Opcional)"/>'
                      : '<input class="form-control text-center" style="width: -webkit-fill-available;" type="text" id="fecha" value="' +
                        info.event.startStr +
                        '">' +
                        '<textarea id="comentario" class="form-control text-center mt-3" placeholder="Ingresa un comentario (Opcional)">' +
                        info.event.extendedProps.comentario +
                        "</textarea>",
                  focusConfirm: false,
                  showCloseButton: true,
                  confirmButtonText: "Confirmar",
                  didOpen: () => {
                    $("#fecha").daterangepicker({
                      singleDatePicker: true,
                      minDate: new Date(),
                      opens: "center",
                      locale: {
                        format: "YYYY-MM-DD",
                        applyLabel: "Aplicar",
                        cancelLabel: "Cancelar",
                        fromLabel: "From",
                        toLabel: "To",
                        customRangeLabel: "Custom",
                        weekLabel: "W",
                        daysOfWeek: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
                        monthNames: [
                          "Enero",
                          "Febrero",
                          "Marzo",
                          "Abril",
                          "Mayo",
                          "Junio",
                          "Julio",
                          "Agosto",
                          "Septiembre",
                          "Octubre",
                          "Noviembre",
                          "Diciembre",
                        ],
                        firstDay: 4,
                      },
                    });
                  },
                  preConfirm: () => {
                    return [
                      document.getElementById("fecha").value,
                      document.getElementById("comentario").value,
                    ];
                  },
                }).then((result) => {
                  if (result.value) {
                    let fechaNueva = result.value[0];
                    let fechaAnterior = info.event.startStr;
                    let comentario = result.value[1];
                    let ceve = info.event.extendedProps["id_ceve"];
                    let ruta = info.event.extendedProps["id_ruta"];
                    $.ajax({
                      url: "utils/calendario/actualizar_fecha.php",
                      method: "post",
                      data: {
                        fechaNueva: fechaNueva,
                        fechaAnterior: fechaAnterior,
                        comentario: comentario,
                        ceve: ceve,
                        ruta: ruta,
                      },
                      success: function (data) {
                        traeIndicadores();
                        const jsonResult = JSON.parse(data);

                        if (parseInt(jsonResult["status"]) === 1) {
                          Swal.fire({
                            icon: "info",
                            title:
                              "¡Ya tienes asignada una ruta para el dia seleccionado!",
                            showConfirmButton: true,
                            confirmButtonColor: "#3085d6",
                            confirmButtonText: "Entendido",
                          });
                        } else if (parseInt(jsonResult["status"]) === 2) {
                          Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Lo sentimos algo salio, contacta a esteban.ramirez03@grupobimbo.com",
                            showConfirmButton: false,
                            timer: 1200,
                          });
                        } else if (parseInt(jsonResult["status"]) === 3) {
                          Swal.fire({
                            icon: "success",
                            title: "¡Su registro se ha editado correctamente!",
                            showConfirmButton: false,
                            timer: 1200,
                          });
                        }
                      },
                    });
                  }
                });
              }
            }
          });
        },
      });

      calendar.render();
    }
  }
  loadEvents();
}

// Agregamos un evento cuando se le de click al botón de filtrar
btn_filtrar.addEventListener("click", cargarFunciones);

// Agregamos evento cuando usuario seleccione opciones de regiones
$("#filtro-region").on("changed.bs.select", read_filter_gerencia);

// Agregamos evento cuando usuario seleccione opciones de gerencias
$("#filtro-gerencia").on("changed.bs.select", read_filter_division);

// Agregamos evento cuando usuario seleccione opciones de divisiones
$("#filtro-division").on("changed.bs.select", read_filter_ceve);

// Agregamos evento cuando usuario seleccione opciones de ceves
$("#filtro-ceve").on("changed.bs.select", read_filter_supervisor);

// Agregamos evento cuando usuario seleccione algunos supervisores
$("#filtro-supervisor").on("changed.bs.select", read_filter_ruta);

read_filter_region();

window.onload = cargarFunciones();

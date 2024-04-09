const filtroGrupo = document.querySelector("#filtro-grupo");
const filtroCadena = document.querySelector("#filtro-cadena");
const filtroRegion = document.querySelector("#filtro-region");
const filtroGerencia = document.querySelector("#filtro-gerencia");
const filtroDivision = document.querySelector("#filtro-division");
const filtroCeve = document.querySelector("#filtro-ceve");
document.querySelector(".bs-select-all");
document.querySelector(".bs-deselect-all");
// const form = document.querySelector("#form-encuesta");

// $('#filtro-grupo').selectpicker('val', 'TODAS');

// function traerFiltrosEstructuraCanalModerno({ id }){
//   let tipoFiltro = id.split("-")[1];
//   let filtroInferior = "grupo";
// // let opcionesCadena = [];
//   let opcionesSeleccionadas = [];
//   let opcionesCollection = [];
//   let url = "utils/filters/traerGrupos.php";

//   if(tipoFiltro === "grupo"){
//     opcionesCollection = filtroGrupo.selectedOptions;
//     url = "utils/filters/traerCadenas.php";
//     filtroInferior = "cadena";
//   }

//   for (let i = 0; i < opcionesCollection.length; i++) {
//     opcionesSeleccionadas.push(opcionesCollection[i].value);
//   }

//   console.log(opcionesSeleccionadas)

//   const data = new FormData();
//   data.append("opciones", JSON.stringify(opcionesSeleccionadas));

//   fetch(url, {
//     method: "POST",
//     body: data,
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       $(`#filtro-${filtroInferior}`).find("option").remove();
//       data.map((d) => {
//         const option = document.createElement("option");
//         option.text = d;
//         option.value = d;
//         document.querySelector(`#filtro-${filtroInferior}`).add(option);
//       });
//       $(`#filtro-${filtroInferior}`).selectpicker("refresh");
//     });
// }

// $("#filtro-grupo").on("changed.bs.select", (event) => {
//   traerFiltrosEstructuraCanalModerno(event.target);
// });
// $("#filtro-grupo").on("loaded.bs.select", (event) => {
//   console.log(document.querySelector(".bs-select-all"))
// });

// traerFiltrosEstructuraCanalModerno({ id: "filtro-inicial" })

function traerFiltrosEstructuraVentas({ id }) {
  let tipoFiltro = id.split("-")[1];
  let filtroInferior = "";
  let opcionesSeleccionadas = [];
  let opcionesCollection;
  let opcionesSeleccionadasCadenas = [];
  let opcionesCollectionCadenas;
  let url = "";

  switch (tipoFiltro) {
    case "grupo":
      opcionesCollection = filtroGrupo.selectedOptions;
      url = "utils/filters/traerCadenas.php";
      filtroInferior = "cadena";
      break;
    case "cadena":
      opcionesCollection = filtroCadena.selectedOptions;
      url = "utils/filters/traerRegiones.php";
      filtroInferior = "region";
      break;
    case "region":
      opcionesCollection = filtroRegion.selectedOptions;
      url = "utils/filters/traerGerencias.php";
      filtroInferior = "gerencia";
      break;
    case "gerencia":
      opcionesCollection = filtroGerencia.selectedOptions;
      url = "utils/filters/traerDivisiones.php";
      filtroInferior = "division";
      break;
    case "division":
      opcionesCollection = filtroDivision.selectedOptions;
      url = "utils/filters/traerCeves.php";
      filtroInferior = "ceve";
      break;
    case "ceve":
      opcionesCollection = filtroCeve.selectedOptions;
      url = "utils/filters/traerRutas.php";
      filtroInferior = "ruta";
      break;
    default:
      opcionesCollection = [];
      url = "utils/filters/traerGrupos.php";
      filtroInferior = "grupo";
      break;
  }

  opcionesCollectionCadenas = filtroCadena.selectedOptions;

  for (let i = 0; i < opcionesCollectionCadenas.length; i++) {
    opcionesSeleccionadasCadenas.push(opcionesCollectionCadenas[i].value);
  }

  for (let i = 0; i < opcionesCollection.length; i++) {
    opcionesSeleccionadas.push(opcionesCollection[i].value);
  }

  const data = new FormData();
  data.append("opciones", JSON.stringify(opcionesSeleccionadas));
  data.append("cadenas", JSON.stringify(opcionesSeleccionadasCadenas));

  fetch(url, {
    method: "POST",
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      $(`#filtro-${filtroInferior}`).find("option").remove();
      console.log(data);
      data.map((d) => {
        const option = document.createElement("option");
        option.text = d;
        option.value = d;
        document.querySelector(`#filtro-${filtroInferior}`).add(option);
      });
      $(`#filtro-${filtroInferior}`).selectpicker("refresh");
      if (filtroInferior == "cadena") {
        $("#filtro-cadena").selectpicker("selectAll");
      }
    });
}

// Event Listeners
$("#filtro-grupo").on("changed.bs.select", (event) => {
  traerFiltrosEstructuraVentas(event.target);
});
$("#filtro-cadena").on("changed.bs.select", (event) => {
  traerFiltrosEstructuraVentas(event.target);
});
$("#filtro-region").on("changed.bs.select", (event) => {
  traerFiltrosEstructuraVentas(event.target);
});
$("#filtro-gerencia").on("changed.bs.select", (event) => {
  traerFiltrosEstructuraVentas(event.target);
});
$("#filtro-division").on("changed.bs.select", (event) => {
  traerFiltrosEstructuraVentas(event.target);
});

traerFiltrosEstructuraVentas({ id: "filtro-inicial" });

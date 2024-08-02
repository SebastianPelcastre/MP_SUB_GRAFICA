const tabla = new DataTable('#table', {
  scrollCollapse: true,
  scrollY: '450px',
  info: false,
  lengthChange: false,
  layout: {
    top1: {
        searchPanes:{
          cascadePanes:true,
          initCollapsed: true,
          orderable: false
        }
    }
},
columnDefs: [
  {
      searchPanes: {
          show: false, 
          orderable: false
      },
      targets: [0, 4, 6, 7, 8, 11, 12]
  },
  {
    searchPanes: {
        show: true,
        orderable: false
    },
    targets: [2, 3, 1, 5, 9]
  },
  {
    searchPanes:{
      orderable: false,
      show: true,
      header: 'ESTATUS',
      options:[{
        label:'No realizado',
        value: function(rowData, rowIdx){
          return rowData[10] === '<p>No realizado</p>' 
        }
      },
      {
        label:'En proceso',
        value: function(rowData, rowIdx){
          return rowData[10] === '<p>En proceso</p>' 
        }
      },
      {
        label:'Realizado',
        value: function(rowData, rowIdx){
          return  rowData[10] === '<p>Realizado</p>'
        }
      }
    ]
    },
    targets:[10]
  }
],
  language: {
    searchPanes: {
      orderable: false,
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
})

 const cantidadAlertas = document.querySelector('input[name="numAlertas"]').value
  const toastLiveExample = document.getElementById('liveToast')

  for (let i = 0; i < cantidadAlertas; i++) {
    const toastTrigger = document.getElementById(`liveToastBtn-${i}`)
    const toastTrigger2 = document.getElementById(`liveToastBtn2-${i}`)

    if (toastTrigger || toastTrigger2) {
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
      toastTrigger.addEventListener('change', () => {
        toastBootstrap.show()
      })
      toastTrigger2.addEventListener('change', () => {
        toastBootstrap.show()
      })
    }
  } 

const form = document.getElementById("form")
const options = {
  backdrop: "static",
  keyboard: false,
}
const loadingModal = new bootstrap.Modal(
  document.querySelector("#loading-modal"),
  options
)
const failModal = new bootstrap.Modal(
  document.querySelector("#fail-modal"),
  options
)

const submitForm = (e) => {
    e.preventDefault()

  //INTRODUCIR LÓGICA PARA MOSTRAR MODAL DE CONFIRMACIÓN

  const formData = new FormData(form)
  const datosEnviar = []

  const numItems = parseInt(formData.get("numAlertas"))

  for (let i = 0; i < numItems; i++) {
    const idAlerta = formData.get('idAlerta-' + i)
    const observaciones = formData.get("comentario-" + i)
    const fechaRegistro = formData.get('fechaRegistro')
    const radios = document.getElementsByName("estado-" + i)
    let realizado = null
    for (let j = 0; j < radios.length; j++) {
      if (radios[j].checked) {
        switch(radios[j].value){
          case 'si':
            realizado = 1
            break
          case 'no':
            realizado = 2
            break
          case 'en-proceso':
            realizado = 3
            break
        }
        break
      }
    }

    if (realizado !== null && observaciones !== null) {
      const itemData = {
        idAlerta: idAlerta,
        realizado: realizado,
        observaciones: observaciones,
        fechaRegistro: fechaRegistro
      }
      datosEnviar.push(itemData)
    }  
  }

  if(datosEnviar.length !== 0){
    for (let i = 0; i < datosEnviar.length; i++) {
      if (datosEnviar[i].realizado == null || datosEnviar[i].observaciones == ''){
        document.querySelector("#mensaje-error").innerHTML =
            'Debe seleccionar una opción de estatus seguimiento e ingresar observaciones en todas las alertas que desee responder'
          failModal.show()
          return
      }
    }
  }
  else{
    document.querySelector("#mensaje-error").innerHTML =
            'Debe responder al menos una alerta con su estatus de seguimiento y observaciones'
          failModal.show()
          return
  }

  // console.log(datosEnviar)

  // return

  $.ajax({
    url: "utils/validate/validarFormulario.php",
    method: "POST",
    data: { datosEnviar }, // Enviar el array como JSON
    beforeSend: function () {
      loadingModal.show()
    },
    success: function (result) {
      loadingModal.hide()
      const jsonResult = JSON.parse(result)

      for(let i = 0; i < jsonResult.length; i++){
        if (jsonResult[i]["status"] === 401) {
          document.querySelector("#mensaje-error").innerHTML =
            jsonResult[i]["mensaje"]
          failModal.show()
          return
        }
  
        if (jsonResult[i]["status"] === 200) {
          location.href = "registro-exitoso.php"
        }
      }
    },
  })
}

form.addEventListener("submit", submitForm)

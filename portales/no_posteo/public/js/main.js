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

  const formData = new FormData(form)

  let datosEnviar = []

  const idCausa = formData.get("causa")
  const planAccion = formData.get("planAccion")
  const fechaResolucion = formData.get("fechaResolucion")
  const idPlanta = formData.get("idPlanta")
  const semanaAlerta = formData.get("semanaAlerta")
  const fechaEmision = formData.get("fechaEmision")
  const fechaRegistro = formData.get("fechaRegistro")
  const causa = formData.get('otros')

  // Verificar si los campos necesarios están seleccionados
  if (idCausa && planAccion && fechaResolucion) {
    // Construir el objeto para el item actual
    const itemData = { 
      semana: semanaAlerta,
      idPlanta: idPlanta,
      fechaEmision: fechaEmision,
      idCausa: idCausa,
      otro: causa,
      planAccion: planAccion,
      fechaResolucion: fechaResolucion,
      // comentarios: comentarios,
      fechaRegistro: fechaRegistro
    }

    // Agregar el objeto al array
    datosEnviar.push(itemData)
  }else{
        document.querySelector("#mensaje-error").innerHTML =
        'Debe ingresar una causa, un plan de acción y una fecha de resolución'
        failModal.show()
        return
  }

  // Mostrar el array resultante en la consola (puedes quitar esto en producción)
  console.log(datosEnviar)
  return

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

      if (jsonResult["status"] === 401) {
        document.querySelector("#mensaje-error").innerHTML =
          jsonResult["mensaje"]
        failModal.show()
        return
      }

      if (jsonResult["status"] === 200) {
        fetch('../../../apis/enviarCorreoAceptacion.php',{
          method: 'POST',
          body: datosEnviar
        })
        .then( )
        .then
          location.href = "registro-exitoso.php"
        
      }
    },
  })
}

form.addEventListener("submit", submitForm)

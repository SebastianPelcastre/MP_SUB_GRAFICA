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

  const datosEnviar = []


  const idItem = formData.get("id-" + i)
  const idCausa = formData.get("causa-" + i)
  const idPlanAccion = formData.get("planAccion-" + i)
  const fechaResolucion = formData.get("fechaResolucion-" + i)
  const comentarios = formData.get("comentario-" + i)
  const idPlanta = formData.get("idPlanta")
  const semanaAlerta = formData.get("semanaAlerta")
  const fechaEmision = formData.get("fechaEmision")
  const fechaRegistro = formData.get("fechaRegistro")

  // Verificar si los campos necesarios están seleccionados
  if (idCausa && idPlanAccion && fechaResolucion) {
    // Construir el objeto para el item actual
    const itemData = {
      idItem: idItem,
      semana: semanaAlerta,
      idPlanta: idPlanta,
      fechaEmision: fechaEmision,
      idCausa: idCausa,
      idPlan: idPlanAccion,
      fechaResolucion: fechaResolucion,
      comentarios: comentarios,
    }

    // Agregar el objeto al array
    datosEnviar.push(itemData)
  }

  // Mostrar el array resultante en la consola (puedes quitar esto en producción)
  console.log(datosEnviar)
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

      if (jsonResult["status"] === 401) {
        document.querySelector("#mensaje-error").innerHTML =
          jsonResult["mensaje"]
        failModal.show()
        return
      }

      if (jsonResult["status"] === 200) {
        fetch('../../../apis/enviarCorreoConfirmacion.php',{
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

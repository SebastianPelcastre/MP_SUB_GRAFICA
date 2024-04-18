<?php
require '../../../../utils/conexion_sql_azure.php';

$query = '
SELECT 
    fixed_aniosem_bimbo
FROM
    MKS_MP_SUB.SEMANAS_BIMBO
WHERE
    dia BETWEEN CAST(GETDATE() -53 AS DATE) AND CAST(GETDATE() -5 AS DATE)
GROUP BY
    fixed_aniosem_bimbo
ORDER BY
    fixed_aniosem_bimbo';

$result = sqlsrv_query($conn_sql_azure, $query);

$semanasAlertas = array();
while ($row = sqlsrv_fetch_array($result)) {
    $semanasAlertas[] = $row['fixed_aniosem_bimbo'];
}

function convertirAEntero($valor)
{
    return intval($valor);
}
$semanasAlerta = array_map("convertirAEntero", $semanasAlertas);
// $semanasAlerta = [202406, 202407, 202408, 202409, 202410, 202411, 202412, 202413];

// $semanasAlerta = array_values(array_diff($semanasAlerta, ["202353"]));

$query = '
SELECT 
    da.id_planta,
    cp.nombre
FROM 
    MKS_MP_SUB.DATOS_ALERTAS da
INNER JOIN 
    MKS_MP_SUB.CAT_PLANTAS cp
    ON da.id_planta = cp.id_planta
WHERE
    da.id_tipo_alerta IN (2,3)
    AND da.alerta = 1
    AND da.id_tipo = 2
    AND aniosemana = ' . $semanasAlerta[sizeof($semanasAlerta) - 1] . '
GROUP BY 
    da.id_planta,
    cp.nombre';

$result = sqlsrv_query($conn_sql_azure, $query);

$plantasAlertadas = array();

while ($row = sqlsrv_fetch_array($result)) {
    $plantasAlertadas[] = $row['id_planta'];
}

$plantasAlertadas = [2002, 2046];

?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>sub-tendencia</title>
</head>

<body>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <div id="div-canvas">
    </div>
    <a href="" id="descargarGrafica"></a>
    <input type="hidden" id="plantasAlertadas" value="<?php echo json_encode($plantasAlertadas) ?>">
    <input type="hidden" id="datosGrafica">
    <input type="hidden" id="idPlanta">
    <input type="hidden" id="semanas" value="<?php echo json_encode($semanasAlerta) ?>">
    <script>
        let contador = 0
        const a = document.getElementById('descargarGrafica')
        var inputDatosGrafica = document.getElementById('datosGrafica').value
        const inputSemanas = document.querySelector('#semanas')
        const inputIdPlanta = document.querySelector('#idPlanta')

        const crearGrafica = async () => {
            // console.log('crear: ', inputIdPlanta.value)
            const formData = new FormData()
            formData.append('idPlanta', inputIdPlanta.value)
            formData.append('semanas', inputSemanas.value)
            formData.append('id_tipo_alerta', 2)
            formData.append('id_tipo', 2)
            const response = await fetch('../../../apis/datosGraficaTendencia.php', {
                method: 'POST',
                body: formData
            })
            const data = await response.json()

                .then(data => {

                    inputDatosGrafica = JSON.stringify(data.datosGrafica)

                    const div = document.getElementById('div-canvas')

                    const canvasAnterior = document.getElementById(`myChart-${contador}`)
                    if (canvasAnterior) {
                        Chart.getChart(canvasAnterior).destroy()
                    }

                    const newCanvas = document.createElement('canvas')
                    newCanvas.id = `myChart-${contador}`

                    div.appendChild(newCanvas)

                    const labels = JSON.parse(inputSemanas.value)

                    const datasets = data.datosGrafica.map(item => {
                        var colorLine = getRandomColor()
                        return {
                            label: item.item,
                            data: item.semanas.map(semana => semana.importe),
                            borderColor: colorLine,
                            backgroundColor: colorLine,
                            borderWidth: 1,
                            fill: false
                        };
                    });

                    const ctx = document.getElementById(`myChart-${contador}`);
                    const chart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: datasets
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            animation: false
                        }
                    })
                    a.setAttribute('data-src', chart.toBase64Image())
                    contador++
                })
        }

        const enviar = async (idPlanta, datosGrafica, image) => {
            // console.log(image)
            const formData = new FormData()
            formData.append('image', image)
            formData.append('idPlanta', idPlanta)
            formData.append('datosGrafica', inputDatosGrafica)
            formData.append('semanas', inputSemanas.value)
            formData.append('id_tipo_alerta', 2)
            formData.append('id_tipo', 2)
            const response = await fetch('../../../apis/enviarAlertaTendencia.php', {
                method: 'POST',
                body: formData
            })
            const data = await response.json()
                .then(data => {
                    if (data.status === 200) {
                        console.log('Correo Enviado')
                    }
                })
        }

        const arrayColors = ['321E1E', '40679E', 'EE4266', 'FBA834', '59D5E0', 'EBF400', '9B4444', '910A67', '15F5BA', 'D2DE32', 'F4CE14', 'A4CE95', '008170', '5B0888', 'CF0A0A']

        function getRandomColor() {
            if (arrayColors.length === 0) {
                const nuevoColor = generarColorAleatorio()
                arrayColors.push(nuevoColor)
            }

            const indice = Math.floor(Math.random() * arrayColors.length)

            const color = arrayColors.splice(indice, 1)[0]

            return '#' + color
        }

        function generarColorAleatorio() {
            const color = Math.floor(Math.random() * 16777215).toString(16)
            return '0'.repeat(6 - color.length) + color
        }

        const plantas = JSON.parse(document.querySelector('#plantasAlertadas').value)

        async function procesarPlanta(planta) {
            inputIdPlanta.value = planta
            await crearGrafica()
            // console.log(a.getAttribute('data-src'))
            enviar(inputIdPlanta.value, inputDatosGrafica, a.getAttribute('data-src'))
        }

        async function procesarTodasLasPlantas() {
            for (let i = 0; i < plantas.length; i++) {
                await procesarPlanta(plantas[i])
            }
        }

        procesarTodasLasPlantas()
    </script>

</body>


</html>
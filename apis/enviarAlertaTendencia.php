<?php
require '../../utils/conexion_sql_azure.php';

// Incluye toda la librería de PHP Mailer
require '../../utils/PHPMailer/src/PHPMailer.php';
require '../../utils/PHPMailer/src/Exception.php';
require '../../utils/PHPMailer/src/SMTP.php';

// Credenciales para el correo
require '../../utils/credenciales_correo.php';

$semanasAlerta = json_decode($_POST['semanas'], true);

$LOCAL_URL = 'http://localhost';
$PROD_URL = 'https://cananaliticadv.bimboconnect.com';
$FECHA_EMISION = date('Y-m-d');

$tipo = '';

if ($_POST['id_tipo'] == 1) {
    $tipo = 'MATERIAS PRIMAS';
} else {
    $tipo = 'SUBENSAMBLES';
}
// $query = '
// SELECT 
//     fixed_aniosem_bimbo
// FROM
//     MKS_MP_SUB.SEMANAS_BIMBO
// WHERE
//     dia BETWEEN CAST(GETDATE() -53 AS DATE) AND CAST(GETDATE() -5 AS DATE)
// GROUP BY
//     fixed_aniosem_bimbo
// ORDER BY
//     fixed_aniosem_bimbo';

// $result = sqlsrv_query($conn_sql_azure, $query);

// $semanasAlerta = array();
// while ($row = sqlsrv_fetch_array($result)) {
//     $semanasAlerta[] = $row['fixed_aniosem_bimbo'];
// }

$query = '
SELECT 
	nombre
FROM 
	MKS_MP_SUB.CAT_PLANTAS
WHERE
	id_planta = ' . $_POST['idPlanta'] . '';

$result = sqlsrv_query($conn_sql_azure, $query);

$nombrePlanta = '';
while ($row = sqlsrv_fetch_array($result)) {
    $nombrePlanta = $row['nombre'];
}
// $semanasAlerta = [202401, 202402, 202403, 202404, 202405, 202406, 202407, 202408];

$query = '
SELECT 
    da.id_item, COUNT(*) AS cantidad
FROM 
    MKS_MP_SUB.DATOS_ALERTAS da
WHERE
    da.id_planta = ' . $_POST['idPlanta'] . '
    AND da.aniosemana IN (' . implode(',', $semanasAlerta) . ')
    AND alerta = 1
    AND id_tipo = ' . $_POST['id_tipo'] . '
    AND id_tipo_alerta IN (2,3)
GROUP BY da.id_item
ORDER BY da.id_item
';

$result = sqlsrv_query($conn_sql_azure, $query);

$historico = array();

while ($row = sqlsrv_fetch_array($result)) {
    $subdata = array();
    $subdata['item'] = $row['id_item'];
    $subdata['cantidad'] = $row['cantidad'];
    $historico[] = $subdata;
}

$itemsTabla = json_decode($_POST['datosGrafica'], true);

foreach ($itemsTabla as &$itemTabla) {
    $cantidadItem = array_filter($historico, function ($cantidad) use ($itemTabla) {
        return $cantidad['item'] === $itemTabla['id_item'];
    });
    $cantidadItem = reset($cantidadItem);
    if ($cantidadItem) {
        $itemTabla['cantidad'] = $cantidadItem['cantidad'];
    } else {
        $itemTabla['cantidad'] = 0;
    }
}

$acumuladoHistorico = 0;
$sumaPorSemana = [];

foreach ($itemsTabla as $item) {
    $acumuladoHistorico += $item['cantidad'];
    foreach ($item['semanas'] as $semana) {
        $semanaNumber = $semana['semana'];
        if (!isset($sumaPorSemana[$semanaNumber])) {
            $sumaPorSemana[$semanaNumber] = 0;
        }
        if (isset($semana['acumulado'])) {
            $sumaPorSemana[$semanaNumber] += $semana['acumulado'];
        }
    }
}

$items = array_column($itemsTabla, 'id_item');

$globalStyles = '
    <style>
        h1 {
            color: #2F5597;
            font-weight: bolder;
            text-align: center;
        }

        h2 {
            text-align: center;
            font-weight: bolder;
        }

        li>span {
            font-weight: bold;
        }

        .footer {
            font-style: italic;
            font-weight: bolder;
            color: blue;
            text-align: center;
        }

        /*table*/
            
        table {
            border-collapse: collapse;
        }

        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
        }

        thead {
            background-color: #4472C4;
            color: white;
        }

        th {
            border: 1px solid #ddd;
            padding: 16px;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        .subtitle{
            color: #2F5597;
        }
        .sub{
            text-decoration: underline;
            font-weight: normal;
        }
        .us{
            background-color: #FFE699;
            color: black;
        }
        .acumulado{
            background-color: #9BC2E6;
        }
        .text-red{
            color:red;
        }

    </style>
    ';


$encabezadoCorreo = '
<h1> MICROLEAK DE ' .  $tipo . ' | CAN</h1>

<h2 class="text-red">ALERTA POR TENDENCIA</h2>

<h2><span class="subtitle">Planta:</span>' . $_POST['idPlanta'] . '_' . $nombrePlanta . '</h2>

<h2><span class="subtitle">Año Semana:</span> ' . $semanasAlerta[sizeof($semanasAlerta) - 1] . '</h2>';


$mensajeAlerta = '
<p>Esta alerta fue detonada debido a que los ajustes absolutos en la Planta no han mejorado.</p>
<h2 style="text-align: start;">CRITERIOS PARA LA ALERTA</h2>
<ol style="text-align: start;">
    <li>Se calcula el promedio de ajuste de inventario absoluto para cada Planta – Item en las últimas 8 semanas</li>
    <li>Se calcula el porcentaje de variación del ajuste de la semana actual contra el histórico de las últimas 8 semanas</li>
    <li>Se seleccionan las combinaciones Planta – Item con ajuste mayor o igual al 3% en términos absolutos</li>
    <li>Se seleccionan los 5 items de materiales y los 5 items de subensambles con mayor consumo en pesos</li>
</ol>
<p>Cifras en pesos</p>
<br />
';

$numSemanas = sizeof($semanasAlerta);

$encabezadoTabla = '
    <table>
        <thead>
            <tr>
                <th>ITEMS</th>
                <th>NOMBRE</th>
                <th>Alertas en las últimas 8 semanas</th>';

foreach ($semanasAlerta as $semanaAlerta) {
    $encabezadoTabla = $encabezadoTabla . '<th>' . $semanaAlerta . '</th>';
}
$encabezadoTabla = $encabezadoTabla . '
            </tr>
        </thead>';

$filasTabla = '';
$filaAcumulado = '';
$contador = 0;

$filaAcumulado = '
            <tr class="acumulado">
                <td></td>
                <td>ACUMULADO PLANTA (Valores Absolutos)</td>
                <td>' . $acumuladoHistorico . '</td>';
foreach ($sumaPorSemana as $semana) {
    $filaAcumulado = $filaAcumulado . '
                <td> ' . number_format($semana, 0, '.', ',') . ' </td>';
}

$filaAcumulado = $filaAcumulado . '</tr>';

for ($i = 0; $i < sizeof($itemsTabla); $i++) {
    $columnaItemId = '<td>' . $itemsTabla[$i]['id_item'] . '</td>';
    if ($contador == 0) {
        $columnaLink = '<td rowspan="' . sizeof($items) . '"><a href="' . $LOCAL_URL . '/mp_sub_grafica/portales/tendencia/index.php?idPlanta=' . $_POST['idPlanta'] . '&semanaAlerta=' . $semanasAlerta[sizeof($semanasAlerta) - 1] . '&fechaEmision=' . $FECHA_EMISION . '&items=' . implode(',', $items) . '&id_tipo=' . $_POST['id_tipo'] . ' " target="_blank">LINK</a></td>';
    }
    $filasTabla = $filasTabla . '<tr>' . $columnaItemId . '<td>' . $itemsTabla[$i]['item'] . '</td><td>' . $itemsTabla[$i]['cantidad'] . '</td>';

    foreach ($itemsTabla[$i]['semanas'] as $semana) {
        $filasTabla = $filasTabla . '<td>' . number_format($semana['importe'], 0, '.', ',') . '</td>';
    }

    $filasTabla = $filasTabla . $columnaLink . '</tr>';

    $contador += 1;
}

$cuerpoTabla = '<tbody>' . $filaAcumulado . $filasTabla . '</tbody> </table>';



$tablaCompleta = $encabezadoTabla . $cuerpoTabla;

$correoCompleto = $globalStyles .  $encabezadoCorreo .  $mensajeAlerta . '<center>' . $tablaCompleta . '</center>';

$image = $_POST['image'];

$folderPath = "../uploads/";
$image_parts = explode(",", $image);
$image_base64 = base64_decode($image_parts[1]);
$grafica = imagecreatefromstring($image_base64);
imagealphablending($grafica, false);
imagesavealpha($grafica, true);
$width = imagesx($grafica);
$height = imagesy($grafica);
$percent = 1;
$newwidth = $width * $percent;
$newheight = $height * $percent;

$thumb = imagecreatetruecolor($newwidth, $newheight);

// Ajuste para manejar correctamente el tipo de color
imagealphablending($thumb, false);
imagesavealpha($thumb, true);

if (!imagecopyresampled($thumb, $grafica, 0, 0, 0, 0, $newwidth, $newheight, $width, $height)) {
    die('Error al copiar y redimensionar la imagen');
}

$name = $_POST['idPlanta'] . '_' . $_POST['id_tipo'] . '.png';
$file = $folderPath . $name;

$output = imagepng($thumb, $file, 9); // Usa el tercer parámetro para la calidad de compresión

if (!$output) {
    echo json_encode(["status" => 500, "mensaje" => "Error al guardar la imagen"]);
    die;
} // else {
//     echo json_encode(['status' => 200, 'mensaje' => 'Correo enviado con éxito']);
// }

// Envío de correo
$subject = 'Alerta Microleak ' . $tipo . ' Tendencia';
$mail = new PHPMailer\PHPMailer\PHPMailer(true);
$mail->SetLanguage("es", '../../utils/PHPMailer/language/');
$mail->IsSMTP();
$mail->CharSet = 'UTF-8';
$mail->Host = "smtp.office365.com";
$mail->SMTPAuth = true;
$mail->Port = 587; // Or 587
$mail->Username = $account;
$mail->Password = $password;
$mail->SMTPSecure = 'tls';
$mail->From = $from;
$mail->FromName = $from_name;
$mail->isHTML(true);
$mail->Subject = $subject;
$mail->Body = $correoCompleto;

$basePath = __DIR__;
$imagen = $basePath . '/../uploads/' . $_POST['idPlanta'] . '_' . $_POST['id_tipo'] . '.png';
$cid = md5($imagen);
$mail->AddEmbeddedImage($imagen, $cid, 'gráfica.png');
$mail->Body .= '<center><img src="cid:' . $cid . '" alt="Grafica"></center>';

$query = '
SELECT
    crup.correo
FROM
    MKS_MP_SUB.CAT_RELACION_USUARIOS_PLANTAS crup
INNER JOIN 
    MKS_MP_SUB.CAT_RELACION_ALERTA_PUESTOS crap
    ON crup.id_puesto = crap.id_puesto
INNER JOIN 
    MKS_MP_SUB.CAT_TIPO ct
    ON crap.item_type = ct.id_tipo
WHERE 
    crap.id_tipo_alerta = ' . $_POST['id_tipo_alerta'] . '
    AND crap.item_type = ' . $_POST['id_tipo'] . '
    AND crup.id_planta = ' . $_POST['idPlanta'] . '
GROUP BY 
    crup.correo
';

$result = sqlsrv_query($conn_sql_azure, $query);

$correos = array();
while ($row = sqlsrv_fetch_array($result)) {
    $correos[] = $row['correo'];
}

// echo '<p>Usuarios:</p>';
// echo '<ul>';

// Agregamos a los destinatarios principales
foreach ($correos as $correo) {
    // echo '<li>' . $correo . '</li>';
    // $mail->addAddress($correo);
}

// echo '</ul>';
// echo '<br>';

// Copia a Analítica Avanzada
// $mail->addBCC('ana.segovia@grupobimbo.com');
// $mail->addBCC('daniel.robles@grupobimbo.com');
$mail->addBCC('sebastian.pelcastre@grupobimbo.com');
// $mail->addBCC('israel.gonzalez@grupobimbo.com');

if (!$mail->send()) {
    // $query = '
    //     INSERT INTO
    //         MKS_Datos_Complementarios.ALERTAS_EMITIDAS
    //     VALUES
    //         (' . $ceveAlertado['id_ceve'] . ',' . $semanasAlerta[sizeof($semanasAlerta) - 1] . ', \'' . $FECHA_EMISION . '\', ' . $ERROR_ENVIO . ')';
} else {
    // $query = '
    //     INSERT INTO
    //         MKS_Datos_Complementarios.ALERTAS_EMITIDAS
    //     VALUES
    //         (' . $ceveAlertado['id_ceve'] . ',' . $semanasAlerta[sizeof($semanasAlerta) - 1] . ', \'' . $FECHA_EMISION . '\', ' . $ENVIO_EXITOSO . ')';

    $mail->clearAllRecipients();
    $mail->clearAttachments();
    $mail->clearCustomHeaders();
    $mail->clearBCCs();
    $mail->clearCCs();
    $mail->clearReplyTos();
    $mail->Subject = '';
    $mail->Body = '';
    unlink($imagen);

    echo json_encode(['status' => 200, 'mensaje' => 'Correo enviado con éxito']);
    sleep(2);
}


//EOF
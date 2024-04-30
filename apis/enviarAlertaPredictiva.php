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
$asunto = '';
$mensaje = '';

if ($_POST['id_tipo'] == 1) {
    $tipo = 'MATERIAS PRIMAS';
    $asunto = 'Materias Primas';
    $mensaje = '<p><span class="bold">Supervisor  de materias primas/ Jefe de mantenimiento:</span> Revisar en conjunto la causa, elegir un plan de acción y fecha de resolución para evitar el ajuste de los items alertados y en el checkbox del portal de respuesta seleccionar las figuras que estuvieron presentes en la generación del plan de acción</p>';
} else {
    $tipo = 'SUBENSAMBLES';
    $asunto = 'Subensambles';
    $mensaje = '<p><span class="bold">Ingeniero de procesos/ Jefe de mantenimiento:</span> Revisar en conjunto la causa, elegir un plan de acción y fecha de resolución para evitar el ajuste de los items alertados y en el checkbox del portal de respuesta seleccionar las figuras que estuvieron presentes en la generación del plan de acción</p>';
}

// echo json_encode($_POST);
// die;

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
$query = '
SELECT 
    next_bimboweek
FROM
    MKS_MP_SUB.SEMANAS_BIMBO
WHERE
    dia = CAST(GETDATE() -5 AS DATE)';

$result = sqlsrv_query($conn_sql_azure, $query);

$siguienteSemana = 0;
while ($row = sqlsrv_fetch_array($result)) {
    $siguienteSemana = $row['next_bimboweek'];
}

// $siguienteSemana = 202414;

$itemsTabla = json_decode($_POST['datosGrafica'], true);

// echo $_POST['datosGrafica'];
// die;

$query = '
SELECT 
    id_item, 
    ajuste_inv_predicted_mod 
FROM
    MKS_MP_SUB.DATOS_ALERTAS
WHERE
    id_planta = ' . $_POST['idPlanta'] . '
    AND aniosemana =' . $siguienteSemana . '
    AND id_item IN (\'' . implode('\',\'', array_column($itemsTabla, 'id_item')) . '\')
    AND id_tipo = ' . $_POST['id_tipo'] . '
';

$result = sqlsrv_query($conn_sql_azure, $query);

$importeEsperado = array();

while ($row = sqlsrv_fetch_array($result)) {
    $subdata = array();
    $subdata['id_item'] = $row['id_item'];
    $subdata['importe'] = $row['ajuste_inv_predicted_mod'];
    $importeEsperado[] = $subdata;
}

$items = array_column($itemsTabla, 'id_item');

// echo json_encode($itemsTabla);
// die;

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
    .text-red{
        color:red;
    }
    .bold{
        font-weight: bolder;
    }

</style>
';

$encabezadoCorreo = '
<h1>MICROLEAK DE ' . $tipo . ' | CAN</h1>

<h2 class="text-red">ALERTA PREDICTIVA</h2>

<h2><span class="subtitle">Planta:</span>' . $_POST['idPlanta'] . '_' . $nombrePlanta . '</h2>

<h2><span class="subtitle">Año Semana de emisión:</span> ' . $semanasAlerta[sizeof($semanasAlerta) - 1] . '</h2>';

$mensajeAlerta = '
<p>A continuación se muestran los items que tienen mayor probabilidad de reportar un ajuste de inventarios; es información que aún no ocurre y que con tu ayuda evitaremos que suceda.</p>
<br/>
' . $mensaje . '
<h2 style="text-align: start;">CRITERIOS PARA LA ALERTA</h2>
<ol style="text-align: start;">
    <li>Se calcula el ajuste de inventario absoluto para cada Planta - Item</li>
    <li>Se seleccionan las combinaciones Planta – Item que tienen un ajuste mayor igual al 3% en términos absolutos</li>
    <li>Se ordenan de mayor a menor en cuanto a consumo real en pesos de la semana más reciente</li>
    <li>Se eligen los 5 items para materias primas y los 5 items para subensamble con mayor consumo real en pesos</li>
    <li>A esas 10 series se les calcula el pronóstico para conocer cuál es el valor esperado de ajuste en la próxima semana</li>
</ol>
<p>Cifras en pesos</p>
';

$numSemanas = sizeof($semanasAlerta);

$encabezadoTabla = '
<table>
    <thead>
        <tr>
            <th>ITEMS</th>
            <th>NOMBRE ITEM</th>';

for ($i = 0; $i < $numSemanas; $i++) {
    $encabezadoTabla = $encabezadoTabla . '<th>' . $semanasAlerta[$i] . '</th>';
}
$encabezadoTabla = $encabezadoTabla . '
            <th class="us">' . $siguienteSemana . '</th>
        </tr>
    </thead>';

$filasTabla = '';

$contador = 0;

foreach ($items as $item) {
    $columnaPredictiva = '';
    foreach ($importeEsperado as $importe) {
        if ($importe['id_item'] == $item) {
            $columnaPredictiva = '<td>' . number_format($importe['importe'], 0, '.', ',') . '</td>';
        }
    }
    foreach ($itemsTabla as $itemTabla) {
        if ($item == $itemTabla['id_item']) {
            $columnaItem = '';
            $columnaLink = '';
            $columnaItemId = '';

            $columnaItemId = '<td>' . $item . '</td>';
            if ($contador == 0) {
                $columnaLink = '<td rowspan="' . sizeof($items) . '"><a href="' . $PROD_URL . '/mp_sub_grafica/portales/predictiva/index.php?idPlanta=' . $_POST['idPlanta'] . '&semanaAlerta=' . $semanasAlerta[sizeof($semanasAlerta) - 1] . '&fechaEmision=' . $FECHA_EMISION . '&items=' . implode(',', $items) . '&id_tipo=' . $_POST['id_tipo'] . ' " target="_blank">LINK</a></td>';
            }

            $filasTabla = $filasTabla . '
            <tr>
                ' . $columnaItemId . '
                ' . $columnaItem . '
                <td>' . $itemTabla['item'] . '</td>';

            foreach ($itemTabla['semanas'] as $semana) {
                $filasTabla = $filasTabla . '<td>' . number_format($semana['importe'], 0, '.', ',') . '</td>';
            }

            $filasTabla = $filasTabla . $columnaPredictiva . $columnaLink . '
            </tr>
            ';

            $contador += 1;
        }
    }
}

$cuerpoTabla = '<tbody>' . $filasTabla . '</tbody> </table>';

$tablaCompleta = $encabezadoTabla . $cuerpoTabla;

$correoCompleto = $globalStyles .  $encabezadoCorreo .  $mensajeAlerta . '<center>' . $tablaCompleta . '</center><br/>';

// echo $correoCompleto;
// echo '<br/><br/>';

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
$subject = 'Alerta Microleak ' . $asunto . ' Predictiva ' . $semanasAlerta[sizeof($semanasAlerta) - 1];
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
    $mail->addAddress($correo);
}

// echo '</ul>';
// echo '<br>';

// Copia a Analítica Avanzada
$mail->addBCC('ana.segovia@grupobimbo.com');
$mail->addBCC('daniel.robles@grupobimbo.com');
$mail->addBCC('sebastian.pelcastre@grupobimbo.com');
$mail->addBCC('israel.gonzalez@grupobimbo.com');

$ERROR_ENVIO = 0;
$ENVIO_EXITOSO = 1;

if (!$mail->send()) {
    for ($i = 0; $i < sizeof($items); $i++) {
        $query = '
         INSERT INTO
            MKS_MP_SUB.ALERTAS_EMITIDAS_PREDICTIVA_TENDENCIA
         VALUES
             (' . $semanasAlerta[sizeof($semanasAlerta) - 1] . ', ' . $_POST['idPlanta'] . ', \'' . $items[$i] . '\', ' . $_POST['id_tipo_alerta'] . ', ' . $_POST['id_tipo'] . ', \'' . $FECHA_EMISION . '\', ' . $ERROR_ENVIO . ')';
        if (!sqlsrv_query($conn_sql_azure, $query)) {
            echo $query;
            echo '<br />';
            echo '<br />';
            die(print_r(sqlsrv_errors()));
        }
    }
} else {
    for ($i = 0; $i < sizeof($items); $i++) {
        $query = '
         INSERT INTO
             MKS_MP_SUB.ALERTAS_EMITIDAS_PREDICTIVA_TENDENCIA
         VALUES
            (' . $semanasAlerta[sizeof($semanasAlerta) - 1] . ', ' . $_POST['idPlanta'] . ', \'' . $items[$i] . '\', ' . $_POST['id_tipo_alerta'] . ', ' . $_POST['id_tipo'] . ', \'' . $FECHA_EMISION . '\', ' . $ENVIO_EXITOSO . ')';
        if (!sqlsrv_query($conn_sql_azure, $query)) {
            echo $query;
            echo '<br />';
            echo '<br />';
            die(print_r(sqlsrv_errors()));
        }
    }

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
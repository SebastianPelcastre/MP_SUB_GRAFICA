<?php

require '../../utils/conexion_sql_azure.php';

// Incluye toda la librería de PHP Mailer
require '../../utils/PHPMailer/src/PHPMailer.php';
require '../../utils/PHPMailer/src/Exception.php';
require '../../utils/PHPMailer/src/SMTP.php';

// Credenciales para el correo
require '../../utils/credenciales_correo.php';

$LOCAL_URL = 'http://localhost';
$PROD_URL = 'https://cananaliticadv.bimboconnect.com';
$FECHA_EMISION = date('Y-m-d');

$json_data = file_get_contents('php://input');

$respuestasRegistradas = json_decode($json_data, true);

$idTipo = $respuestasRegistradas[0]['tipo'];
$idPlanta = $respuestasRegistradas[0]['idPlanta'];

// print_r($respuestasRegistradas[0]['idPlanta']);

$query = '
SELECT 
	nombre
FROM 
	MKS_MP_SUB.CAT_PLANTAS
WHERE
	id_planta = ' . $idPlanta . '';

$result = sqlsrv_query($conn_sql_azure, $query);

$nombrePlanta = '';
while ($row = sqlsrv_fetch_array($result)) {
    $nombrePlanta = $row['nombre'];
}

$globalStyles = '
    <style>
        h1 {
            font-weight: bolder;
            text-align: center;
        }
        h2{
            text-align: center;
            font-weight:normal;
        }
        .text-red{
            color: red;
        }
        .text-blue{
            color:blue;
        }
        .bold{
            font-weight: bolder;
        }
        .start{
            text-align: start;
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
            background-color: #1c306a;
            color: white;
        }

        th {
            border: 1px solid #ddd;
            padding: 16px;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
    </style>';

$encabezadoCorreo = '<h1> RESPUESTAS REGISTRADAS </h1>

<h2><span class="subtitle">Planta:</span>' . $idPlanta . '_' . $nombrePlanta . '</h2>

<h2><span class="subtitle">Año Semana de emisión:</span> ' . $respuestasRegistradas[0]['semana'] . '</h2>';

$numSemanas = sizeof($respuestasRegistradas);

$encabezadoTabla = '
<table>
    <thead>
        <tr>
            <th>ITEMS</th>
            <th>NOMBRE ITEM</th>
            <th>CAUSA</th>
            <th>PLAN DE ACCIÓN</th>
            <th>COMENTARIOS</th>
        </tr>
    </thead>';

$filasTabla = '';

$contador = 0;

foreach ($respuestasRegistradas as $respuesta) {
    $query = '
    SELECT 
        nombre
    FROM 
        MKS_MP_SUB.CAT_ITEMS
    WHERE
        id_item= \'' . $respuesta['idItem'] . '\'';

    $result = sqlsrv_query($conn_sql_azure, $query);

    $nombreItem = '';
    while ($row = sqlsrv_fetch_array($result)) {
        $nombreItem = $row['nombre'];
    }

    $query = '
    SELECT 
        causa
    FROM 
        MKS_MP_SUB.CAT_CAUSAS
    WHERE
        id_causa = ' . $respuesta['idCausa'] . '';

    $result = sqlsrv_query($conn_sql_azure, $query);

    $causa = '';
    while ($row = sqlsrv_fetch_array($result)) {
        $causa = $row['causa'];
    }

    $query = '
    SELECT 
        nombre_plan
    FROM 
        MKS_MP_SUB.CAT_PLANES
    WHERE
        id_plan = ' . $respuesta['idPlan'] . '';

    $result = sqlsrv_query($conn_sql_azure, $query);

    $plan = '';
    while ($row = sqlsrv_fetch_array($result)) {
        $plan = $row['nombre_plan'];
    }

    $comentarios = empty($respuesta['comentarios']) ? 'SIN COMENTARIOS' : $respuesta['comentarios'];

    $filasTabla .= '
        <tr>
            <td>' . $respuesta['idItem'] . '</td>
            <td>' . $nombreItem . '</td>
            <td>' . $causa . '</td>
            <td>' . $plan . '</td>
            <td>' . $comentarios . '</td>
        </tr>
    ';


    $contador += 1;
}

$cuerpoTabla = '<tbody>' . $filasTabla . '</tbody> </table>';

$tablaCompleta = $encabezadoTabla . $cuerpoTabla;

$correoCompleto = $globalStyles .  $encabezadoCorreo . '<center>' . $tablaCompleta . '</center><br/>';

$subject = 'Confirmación Respuestas Registradas Alerta Predictiva ' . (($idTipo == 1) ? 'Materias Primas ' : 'Subensambles ') . $respuestasRegistradas[0]['semana'];
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

$correos = array();

if ($idTipo == 1 && $respuesta['mantenimiento'] != null && $respuesta['materiales'] != null) {
    $query = '
    SELECT
	crup.correo 
    FROM 
        MKS_MP_SUB.CAT_RELACION_USUARIOS_PLANTAS crup 
    WHERE 	
        id_puesto IN (1, 10)
        AND id_planta = ' . $idPlanta . '
    ';
    $result = sqlsrv_query($conn_sql_azure, $query);

    while ($row = sqlsrv_fetch_array($result)) {
        $correos[] = $row['correo'];
    }
} elseif ($idTipo == 2 && $respuesta['mantenimiento'] != null && $respuesta['materiales'] != null) {
    $query = '
    SELECT
	crup.correo 
    FROM 
        MKS_MP_SUB.CAT_RELACION_USUARIOS_PLANTAS crup 
    WHERE 	
        id_puesto IN (2, 10)
        AND id_planta = ' . $idPlanta . '
    ';
    $result = sqlsrv_query($conn_sql_azure, $query);

    while ($row = sqlsrv_fetch_array($result)) {
        $correos[] = $row['correo'];
    }
} elseif ($idTipo = 1 && $respuesta['materiales'] != null && $respuesta['mantenimiento'] == null) {
    $query = '
    SELECT
	crup.correo 
    FROM 
        MKS_MP_SUB.CAT_RELACION_USUARIOS_PLANTAS crup 
    WHERE 	
        id_puesto IN (1)
        AND id_planta = ' . $idPlanta . '
    ';
    $result = sqlsrv_query($conn_sql_azure, $query);

    while ($row = sqlsrv_fetch_array($result)) {
        $correos[] = $row['correo'];
    }
} elseif ($idTipo = 2 && $respuesta['materiales'] != null && $respuesta['mantenimiento'] == null) {
    $query = '
    SELECT
	crup.correo 
    FROM 
        MKS_MP_SUB.CAT_RELACION_USUARIOS_PLANTAS crup 
    WHERE 	
        id_puesto IN (2)
        AND id_planta = ' . $idPlanta . '
    ';
    $result = sqlsrv_query($conn_sql_azure, $query);

    while ($row = sqlsrv_fetch_array($result)) {
        $correos[] = $row['correo'];
    }
} elseif ($idTipo = 1 && $respuesta['materiales'] == null && $respuesta['mantenimiento'] != null) {
    $query = '
    SELECT
	crup.correo 
    FROM 
        MKS_MP_SUB.CAT_RELACION_USUARIOS_PLANTAS crup 
    WHERE 	
        id_puesto IN (10)
        AND id_planta = ' . $idPlanta . '
    ';
    $result = sqlsrv_query($conn_sql_azure, $query);

    while ($row = sqlsrv_fetch_array($result)) {
        $correos[] = $row['correo'];
    }
} elseif ($idTipo = 2 && $respuesta['materiales'] == null && $respuesta['mantenimiento'] = !null) {
    $query = '
    SELECT
	crup.correo 
    FROM 
        MKS_MP_SUB.CAT_RELACION_USUARIOS_PLANTAS crup 
    WHERE 	
        id_puesto IN (10)
        AND id_planta = ' . $idPlanta . '
    ';
    $result = sqlsrv_query($conn_sql_azure, $query);

    while ($row = sqlsrv_fetch_array($result)) {
        $correos[] = $row['correo'];
    }
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

$ERROR_ENVIO = 0;
$ENVIO_EXITOSO = 1;

if (!$mail->send()) {
    echo json_encode(array(
        'status' => 500,
        'mensaje' => 'Error al enviar correo de confirmación'
    ));
} else {
    echo json_encode(array(
        'status' => 200,
        'mensaje' => 'Correo de confirmación enviado con éxito'
    ));
}

// EOF
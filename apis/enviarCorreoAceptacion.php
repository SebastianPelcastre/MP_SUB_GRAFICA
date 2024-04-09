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

$respuesta = json_decode($json_data, true);

echo $respuesta[0]['idPLanta'];
die;

//EOF
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

// EOF
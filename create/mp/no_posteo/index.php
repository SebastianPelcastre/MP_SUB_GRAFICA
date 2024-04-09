<?php

require '../../../../utils/conexion_sql_azure.php';

// Incluye toda la librería de PHP Mailer
require '../../../../utils/PHPMailer/src/PHPMailer.php';
require '../../../../utils/PHPMailer/src/Exception.php';
require '../../../../utils/PHPMailer/src/SMTP.php';

// Credenciales para el correo
require '../../../../utils/credenciales_correo.php';

$LOCAL_URL = 'http://localhost';
$PROD_URL = 'https://cananaliticadv.bimboconnect.com';
$FECHA_EMISION = date('Y-m-d');

$query = '
SELECT 
	Aniosem_Bimbo
FROM
	dataminer_2019.fecha_aniosem_bimbo
WHERE
	dia = CAST(GETDATE() -5 AS DATE)';

$result = sqlsrv_query($conn_sql_azure, $query);

$semanaAlerta = 0;
while ($row = sqlsrv_fetch_array($result)) {
    $semanaAlerta = $row['Aniosem_Bimbo'];
};

$query = '
SELECT
da.id_planta, cp.nombre,
SUM(r_consumo_real_pesos) r_consumo_real_pesos,
SUM(ajuste_inv_real) ajuste_inv_real
FROM 
	MKS_MP_SUB.DATOS_ALERTAS da
INNER JOIN 
	MKS_MP_SUB.CAT_PLANTAS cp
	ON da.id_planta = cp.id_planta
WHERE 
	aniosemana = ' . $semanaAlerta . '
	AND da.id_tipo =  1 
    AND da.id_planta IN (2008, 2031, 2046, 2051)
GROUP BY 
	da.id_planta,
	cp.nombre
HAVING ((SUM(r_consumo_real_pesos) = 0 OR SUM(ajuste_inv_real) = 0))
ORDER BY da.id_planta ';

$result = sqlsrv_query($conn_sql_azure, $query);

$ids = array();
$plantas = array();

while ($row = sqlsrv_fetch_array($result)) {
    $subdata = array();
    $ids[] = $row['id_planta'];
    $subdata['id'] = $row['id_planta'];
    $subdata['nombre'] = $row['nombre'];
    $plantas[] = $subdata;
};

$styles = '
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

$encabezadoCorreo = '<h1>Plantas <span class="text-red">sin posteo</span> Materias Primas</h1>

    <h2>Año Semana de emisión: <span class="bold">' . $semanaAlerta . '</span></h2>

    <h2>Microleaks Materias Primas | Consultoría de Análisis para Negocio</h2>

    <h2><span class="bold">Información con corte al Lunes a las 23:59 hrs</span></h2>
    ';

$notasCorreo = '
    <h3 class="text-red start bold">ATENCION</h3>
    <p>No responder este correo; Esta notificación fue enviada por un sistema automatizado.</p>
    <br />
    
    <h3 class="text-blue">CRITERIOS DE ALERTA</h3>
    <p>Las alertas por no posteo se emiten cuando no se registre en tiempo el posteo de la planta.</p>
    ';

//<h3 class="bold"><span class="text-red">**NOTA</span> Información tomada el martes a las 12:00pm con corte de domingo a lunes.</h3>


$encabezadoTabla = '
    <table>
            <thead>
                <tr>
                    <th>PLANTA ID</th>
                    <th>PLANTA</th>
                </tr>
            </thead>
    ';

$filasTabla = '';

$columnaId = '';
$columnaPlanta = '';
foreach ($plantas as $planta) {
    $columnaId = '<td>' . $planta['id'] . '</td>';
    $columnaPlanta = '<td>' . $planta['nombre'] . '</td>';
    $columnaLink = '<td><a href="' . $LOCAL_URL . '/mp_sub_grafica/portales/no_posteo/index.php?idPlanta=' . $planta['id'] . '&semanaAlerta=' . $semanaAlerta . '&fechaEmision=' . $FECHA_EMISION . '&id_tipo=1 " target="_blank">LINK</a></td>';
    $filasTabla = $filasTabla . '<tr>
        ' . $columnaId . $columnaPlanta . /*$columnaLink .*/  '
        </tr>';
}

$cuerpoTabla = '<tbody>' . $filasTabla . '</tbody></table>';
$tablaCompleta = '<center>' . $encabezadoTabla . $cuerpoTabla . '</center>';

$correoCompleto = $styles . $encabezadoCorreo . $notasCorreo . $tablaCompleta;

echo $correoCompleto;
echo '<br/><br/>';

// Envío de correo
$subject = 'Alerta Microleak Materias Primas No Posteo ' . $semanaAlerta;
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
    crap.id_tipo_alerta = 5
    AND crap.item_type = 1
    AND crup.id_planta IN (' . implode(',', $ids) . ')
GROUP BY 
    crup.correo
';

$result = sqlsrv_query($conn_sql_azure, $query);

$correos = array();
while ($row = sqlsrv_fetch_array($result)) {
    $correos[] = $row['correo'];
}

echo '<p>Usuarios:</p>';
echo '<ul>';

// Agregamos a los destinatarios principales
foreach ($correos as $correo) {
    echo '<li>' . $correo . '</li>';
    // $mail->addAddress($correo);
}

echo '</ul>';
echo '<br>';

// Copia a Analítica Avanzada
$mail->addBCC('ana.segovia@grupobimbo.com');
$mail->addBCC('daniel.robles@grupobimbo.com');
$mail->addBCC('sebastian.pelcastre@grupobimbo.com');
$mail->addBCC('israel.gonzalez@grupobimbo.com');

$ERROR_ENVIO = 0;
$ENVIO_EXITOSO = 1;

// if (!$mail->send()) {
// foreach ($ids as $id) {
//     $query = '
//                 INSERT INTO
//                     MKS_MP_SU.BITACORA_ENVIOS_NO_POSTEO
//                 VALUES
//                     (' . $id . ',\'' . $FECHA_EMISION . '\', ' . $semanaAlerta . ', ' . $ERROR_ENVIO . ')';
// }
// if (!sqlsrv_query($conn_sql_azure, $query)) {
//     echo $query;
//     echo '<br />';
//     echo '<br />';
//     die(print_r(sqlsrv_errors()));
// }
// } else {
// foreach ($ids as $id) {
//     $query = '
//                     INSERT INTO
//                         MKS_MP_SU.BITACORA_ENVIOS_NO_POSTEO
//                     VALUES
//                         (' . $id . ',\'' . $FECHA_EMISION . '\', ' . $semanaAlerta . ', ' . $ENVIO_EXITOSO . ')';
// }
// if (!sqlsrv_query($conn_sql_azure, $query)) {
//     echo $query;
//     echo '<br />';
//     echo '<br />';
//     die(print_r(sqlsrv_errors()));
// }
// }

//EOF
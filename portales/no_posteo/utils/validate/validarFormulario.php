<?php

sleep(1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Validamos variables

    if (!isset($_POST['datosEnviar'])) {
        echo json_encode(array(
            'status' => 401,
            'mensaje' => 'Error al recuperar datos'
        ));
        die;
    }

    $datosEnviar = $_POST['datosEnviar'];

    if (!is_array($datosEnviar)) {
        echo json_encode(array(
            'status' => 401,
            'mensaje' => 'datosEnviar no es un array'
        ));
        die;
    }

    foreach ($datosEnviar as $planta) {
        if (empty($planta['idPlanta'])) {
            echo json_encode(array(
                'status' => 401,
                'mensaje' => 'Error: El campo idPlanta está vacío'
            ));
            die;
        }

        if (empty($planta['semana'])) {
            echo json_encode(array(
                'status' => 401,
                'mensaje' => 'Error: El campo semana está vacío'
            ));
            die;
        }

        if (empty($planta['fechaEmision'])) {
            echo json_encode(array(
                'status' => 401,
                'mensaje' => 'Error: El campo fechaEmision está vacío'
            ));
            die;
        }
        require '../../../../../utils/conexion_sql_azure.php';

        $query = '
        SELECT
            *
        FROM 
            MKS_MP_SUB.BITACORA_ENVIOS_NO_POSTEO
        WHERE
            semana = ?
            AND id_planta = ?
            AND fecha_emisión = ?
        ';

        $params = array($planta['semana'], $planta['idPlanta'], $planta['fechaEmision']);

        if (!$result = sqlsrv_query($conn_sql_azure, $query, $params)) {
            echo json_encode(array(
                'status' => 500,
                'mensaje' => 'Error al validar respuesta'
            ));
            die;
        }
        if (sqlsrv_has_rows($result)) {
            echo json_encode(array(
                'status' => 401,
                'mensaje' => 'Esta alerta ya fue contestada para la planta ' . $planta['idItem'] . ''
            ));
            die;
        }
    }




    // Si todo el formulario es correcto, guardamos la respuesta
    // require '../create/enviarRespuestas.php';
    echo json_encode(array(
        'status' => 200,
        'mensaje' => 'Validado'
    ));

    die;
}

 // EOF
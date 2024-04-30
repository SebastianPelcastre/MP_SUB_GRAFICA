<?php

sleep(1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Validamos variables

    if (!isset($_POST['datosEnviar'])) {
        echo json_encode(array(
            'status' => 401,
            'mensaje' => 'Error al recuperar respuesta'
        ));
        die;
    }

    $datosEnviar = $_POST['datosEnviar'];

    if (!is_array($datosEnviar)) {
        echo json_encode(array(
            'status' => 401,
            'mensaje' => 'Error al recuperar datos'
        ));
        die;
    }

    foreach ($datosEnviar as $item) {
        if (empty($item['idAlerta'])) {
            echo json_encode(array(
                'status' => 401,
                'mensaje' => 'Error al recuperar id de la alerta'
            ));
            die;
        }

        if (empty($item['realizado'])) {
            echo json_encode(array(
                'status' => 401,
                'mensaje' => 'Error al recuperar status de seguimiento'
            ));
            die;
        }

        if (empty($item['observaciones'])) {
            echo json_encode(array(
                'status' => 401,
                'mensaje' => 'Error al recuperar observaciones'
            ));
            die;
        }

        if (empty($item['fechaRegistro'])) {
            echo json_encode(array(
                'status' => 401,
                'mensaje' => 'Error al recuperar fecha de registro'
            ));
            die;
        }
        require '../../../../../../utils/conexion_sql_azure.php';

        $query = '
        SELECT
            *
        FROM 
            MKS_Datos_Complementarios.RESPUESTAS_PORTAL_SEGUIMIENTO
        WHERE
            id_alerta = ?
            AND fecha_registro = ?
        ';

        $params = array($item['idAlerta'], $item['fechaRegistro']);

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
                'mensaje' => 'Esta alerta ya fue contestada para la alerta con id ' . $item['idAlerta'] . ''
            ));
            die;
        }
    }

    // echo json_encode(array(
    //     'status' => 200,
    //     'mensaje' => 'Respuesta Guardada'
    // ));

    // Si todo el formulario es correcto, guardamos la respuesta
    require '../create/enviarRespuestas.php';

    die;
}


 // EOF
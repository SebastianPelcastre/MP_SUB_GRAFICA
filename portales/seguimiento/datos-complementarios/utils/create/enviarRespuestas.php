<?php

require '../../../../../../utils/conexion_sql_azure.php';

$respuestas = array();

foreach ($datosEnviar as $dato) {

    $id_historico = htmlspecialchars($dato['idAlerta']);
    $realizado = htmlspecialchars($dato['realizado']);
    $observaciones = htmlspecialchars($dato['observaciones']);
    $fechaRegistro = htmlspecialchars($dato['fechaRegistro']);

    $query = '
    INSERT INTO 
        MKS_Datos_Complementarios.RESPUESTAS_PORTAL_SEGUIMIENTO
    VALUES
        (?, ?, ?, ?)
    ';

    $params = array(
        $id_historico,
        $realizado,
        $observaciones,
        $fechaRegistro
    );

    if (!$result = sqlsrv_query($conn_sql_azure, $query, $params)) {
        echo json_encode(array(
            'status' => 500,
            'mensaje' => 'Error al insertar respuestas'
        ));
        die;
    }
}

$respuestas[] = array(
    'status' => 200,
    'mensaje' => 'Respuesta guardada con éxito'
);

echo json_encode($respuestas);

// EOF
<?php

require '../../../../../utils/conexion_sql_azure.php';

foreach ($datosEnviar as $dato) {

    $aniosem = htmlspecialchars($dato['semana']);
    $fechaEmision = htmlspecialchars($dato['fechaEmision']);
    $idPlanta = htmlspecialchars($dato['idPlanta']);
    $fechaResolucion = htmlspecialchars($dato['fechaResolucion']);
    $idCausa = htmlspecialchars($dato['idCausa']);
    $planAccion = htmlspecialchars($dato['planAccion']);
    $fechaRegistro = htmlspecialchars($dato['fechaRegistro']);

    $query = '
    INSERT INTO 
        MKS_MP_SUB.BITACORA_ENVIOS_NO_POSTEO
    VALUES
        (?, ?, ?);
    SELECT SCOPE_IDENTITY()
    ';

    $params = array(
        $idPlanta,
        $fechaEmision,
        $aniosem
    );

    if (!$result = sqlsrv_query($conn_sql_azure, $query, $params)) {
        echo json_encode(array(
            'status' => 500,
            'mensaje' => 'Error al insertar respuestas'
        ));
        die;
    }

    sqlsrv_next_result($result);
    sqlsrv_fetch($result);
    $idRespuesta = sqlsrv_get_field($result, 0);

    $query = '
    INSERT INTO
        MKS_MP_SUB.RESPUESTAS_NO_POSTEO
    VALUES
        (?, ?, ?, ?, ?, ?)';

    $params = array($idRespuesta, $idCausa, $planAccion, $fechaResolucion, $fechaRegistro);

    echo json_encode(array(
        'status' => 200,
        'mensaje' => 'Respuesta guardada con éxito'
    ));

    require '../../../../apis/enviarCorreoAceptacion.php';
}

// EOF
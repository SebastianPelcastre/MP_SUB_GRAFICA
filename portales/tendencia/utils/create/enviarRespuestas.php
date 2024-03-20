<?php

require '../../../../../utils/conexion_sql_azure.php';

foreach ($datosEnviar as $dato) {

    $item = htmlspecialchars($dato['idItem']);
    $aniosem = htmlspecialchars($dato['semana']);
    $fechaEmision = htmlspecialchars($dato['fechaEmision']);
    $idPlanta = htmlspecialchars($dato['idPlanta']);
    $fechaResolucion = htmlspecialchars($dato['fechaResolucion']);
    $idCausa = htmlspecialchars($dato['idCausa']);
    $idPlan = htmlspecialchars($dato['idPlan']);
    $comentario = htmlspecialchars($dato['comentarios']);

    $indicador = 0;

    if ($comentario !== "") {
        $indicador = 1;
    }

    $query = '
    INSERT INTO 
        MKS_MP_SUB.RESPUESTAS_TENDENCIA
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?);
    SELECT SCOPE_IDENTITY()
    ';

    $params = array(
        $item,
        $aniosem,
        $idPlanta,
        $fechaEmision,
        $idCausa,
        $idPlan,
        $fechaResolucion,
        $indicador
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

    if ($indicador === 1) {
        $query = '
        INSERT INTO
            MKS_MP_SUB.COMENTARIOS_TENDENCIA
        VALUES
        (?,?)';

        $params = array($idRespuesta, $comentario);

        if (!$result = sqlsrv_query($conn_sql_azure, $query, $params)) {
            echo json_encode(array(
                'status' => 500,
                'mensaje' => 'Error al insertar comentarios'
            ));
            die;
        }
    }

    echo json_encode(array(
        'status' => 200,
        'mensaje' => 'Respuesta guardada con éxito'
    ));
}

// EOF
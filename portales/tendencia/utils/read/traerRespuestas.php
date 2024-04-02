<?php

$query = '
SELECT
    r.id,
	r.id_item,
	r.fecha_resolucion,
	CASE
        WHEN c.comentario IS NULL THEN \'SIN COMENTARIO\'
        ELSE c.comentario
    END AS comentario
FROM
	MKS_MP_SUB.RESPUESTAS_TENDENCIA r
LEFT JOIN 
    MKS_MP_SUB.COMENTARIOS_TENDENCIA c
    ON r.id = c.id_respuesta
WHERE
    r.id_planta = ?
    AND r.semana = ?
    AND r.id_item IN (\'' . implode('\',\'', $items) . '\')
GROUP BY
    r.id,
    r.id_item,
    r.fecha_resolucion,
    c.comentario';

$params = array(
    $idPlanta,
    $semanaAlerta
);
if (!$result = sqlsrv_query($conn_sql_azure, $query, $params)) {
    echo 'Error al traer respuestas';
    print_r(sqlsrv_errors());
    die;
}

$respuestas = array();
while ($row = sqlsrv_fetch_array($result)) {
    $subdata = array();
    $subdata['idItem'] = $row['id_item'];
    $subdata['causa'] = $row['causa'];
    $subdata['fechaResolucion'] = $row['fecha_resolucion']->format('Y-m-d');
    $subdata['comentario'] = $row['comentario'];
    $respuestas[] = $subdata;
}
// echo json_encode($comentarios);
// die;

// EOF
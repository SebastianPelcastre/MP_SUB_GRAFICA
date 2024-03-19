<?php

$query = '
SELECT
    r.id,
	r.id_item,
	cc.causa,
	cp.nombre_plan,
	r.fecha_resolucion,
	CASE
        WHEN c.comentario IS NULL THEN \'SIN COMENTARIO\'
        ELSE c.comentario
    END AS comentario
FROM
	MKS_MP_SUB.RESPUESTAS r
INNER JOIN
	MKS_MP_SUB.CAT_CAUSAS cc
	ON r.id_causa = cc.id_causa
INNER JOIN 
	MKS_MP_SUB.CAT_PLANES cp
	ON r.id_plan_accion = cp.id_plan
LEFT JOIN 
    MKS_MP_SUB.COMENTARIOS c
    ON r.id = c.id_respuesta
WHERE
    r.id_planta = ?
    AND r.semana = ?
    AND r.id_item IN (\'' . implode('\',\'', $items) . '\')
GROUP BY
    r.id,
    r.id_item,
    cc.causa,
    cp.nombre_plan,
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
    $subdata['nombrePlan'] = $row['nombre_plan'];
    $subdata['fechaResolucion'] = $row['fecha_resolucion']->format('Y-m-d');
    $subdata['comentario'] = $row['comentario'];
    $respuestas[] = $subdata;
}
// echo json_encode($comentarios);
// die;

// EOF
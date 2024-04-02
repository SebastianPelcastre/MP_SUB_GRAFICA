<?php

$query = '
SELECT
	benp.id, benp.id_planta, benp.fecha_emision, rnp.plan_accion, rnp.fecha_resolucion 
FROM
	MKS_MP_SUB.RESPUESTAS_NO_POSTEO rnp
INNER JOIN 
	MKS_MP_SUB.CAT_CAUSAS cc 
	ON cc.id_causa = rnp.id_causa 
INNER JOIN 
	MKS_MP_SUB.BITACORA_ENVIOS_NO_POSTEO benp 
	ON benp.id = rnp.id_envio 
WHERE
    benp.id_planta = ?';

$params = array(
    $idPlanta
);
if (!$result = sqlsrv_query($conn_sql_azure, $query, $params)) {
    echo 'Error al traer respuestas';
    print_r(sqlsrv_errors());
    die;
}

$respuestas = array();
while ($row = sqlsrv_fetch_array($result)) {
    $subdata = array();
    $subdata['idItem'] = $row['id'];
    $subdata['planta'] = $row['id_planta'];
    $subdata['fechaEmision'] = $row['fecha_emision']->format('Y-m-d');
    $subdata['planAccion'] = $row['plan_accion'];
    $subdata['fechaResolucion'] = $row['fecha_resolucion']->format('Y-m-d');
    $respuestas[] = $subdata;
}

// EOF
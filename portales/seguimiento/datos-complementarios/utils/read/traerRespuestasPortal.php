<?php

// require '../../../../../utils/conexion_sql_azure.php';
// $id_planta = $_SESSION['id_planta'];
$query = '
SELECT 
	rps.id_alerta,
	eps.status , 
	rps.observaciones
FROM
	MKS_Datos_Complementarios.RESPUESTAS_PORTAL_SEGUIMIENTO rps 
INNER JOIN
	MKS_MP_SUB.ESTATUS_PORTAL_SEGUIMIENTO eps 
	ON rps.realizado = eps.id 
WHERE 	
	id_alerta IN (\'' . implode('\',\'', array_column($respuestas, 'id')) . '\')
';

$result = sqlsrv_query($conn_sql_azure, $query);

$seguimientos = array();

while ($row = sqlsrv_fetch_array($result)) {
	$subdata = array();
	$subdata['id'] = $row['id_alerta'];
	$subdata['realizado'] = $row['status'];
	$subdata['observaciones'] = $row['observaciones'];
	$seguimientos[] = $subdata;
}

// echo json_encode($respuestas);
// die;


// EOF
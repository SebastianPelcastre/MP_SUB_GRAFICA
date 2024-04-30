<?php

// require '../../../../../utils/conexion_sql_azure.php';
// $id_planta = $_SESSION['id_planta'];
$query = '
SELECT 
	STRING_AGG(cu.nombre, \', \') nombre
FROM 
	MKS_Datos_Complementarios.RELACION_CEVES_USUARIOS crup 
INNER JOIN 
	MKS_Datos_Complementarios.USUARIOS cu 
	ON crup.correo_usuario  = cu.correo_usuario
WHERE 
	crup.id_ceve IN (' . implode(',', $id_ceve) . ')
	AND cu.id_puesto IN (11)
';

$result = sqlsrv_query($conn_sql_azure, $query);

$nombre = '';

while ($row = sqlsrv_fetch_array($result)) {
	$nombre = $row['nombre'];
}

// echo json_encode($respuestas);
// die;


// EOF
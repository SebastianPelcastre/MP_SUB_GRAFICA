<?php

// require '../../../../../utils/conexion_sql_azure.php';
// $id_planta = $_SESSION['id_planta'];
$query = '
SELECT 
	STRING_AGG(cu.nombre, \', \') nombre
FROM 
    MKS_MP_SUB.CAT_RELACION_USUARIOS_PLANTAS crup 
INNER JOIN 
	MKS_MP_SUB.CAT_USUARIOS cu 
	ON crup.correo = cu.correo 
WHERE 
	crup.id_planta IN (' . implode(',', $id_planta) . ')
	AND cu.id_puesto IN (3,4)
';

$result = sqlsrv_query($conn_sql_azure, $query);

$nombre = '';

while ($row = sqlsrv_fetch_array($result)) {
	$nombre = $row['nombre'];
}

// echo $query;

// die;


// EOF
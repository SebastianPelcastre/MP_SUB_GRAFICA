<?php

$idPlanta = htmlspecialchars(trim($_GET['idPlanta']));
$semanaAlerta = htmlspecialchars(trim($_GET['semanaAlerta']));
$fechaEmision = htmlspecialchars(trim($_GET['fechaEmision']));
$fechaMaximaPlan = date('Y-m-d', strtotime($fechaEmision . '+ 14 days'));
$idTipo = $_GET['id_tipo'];

$query = '
SELECT
	cp.nombre,
	cr.region
FROM
	MKS_MP_SUB.CAT_PLANTAS cp
INNER JOIN 
	MKS_MP_SUB.CAT_REGIONES cr
	ON cp.id_region = cr.id_region
WHERE
	cp.id_planta = ?';

$params = array(
    $idPlanta
);

$result = sqlsrv_query($conn_sql_azure, $query, $params);

$nombrePlanta = '';
$region = '';
while ($row = sqlsrv_fetch_array($result)) {
    $nombrePlanta = $row['nombre'];
    $region = $row['region'];
}

// EOF
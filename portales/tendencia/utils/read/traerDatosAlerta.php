<?php

$idPlanta = htmlspecialchars(trim($_GET['idPlanta']));
$semanaAlerta = htmlspecialchars(trim($_GET['semanaAlerta']));
$fechaEmision = htmlspecialchars(trim($_GET['fechaEmision']));
$fechaMaximaPlan = date('Y-m-d', strtotime($fechaEmision . '+ 14 days'));
$items = explode(',', $_GET['items']);
// $tipo = htmlspecialchars(trim($_GET['tipo']));
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

$query = '
SELECT
    ci.nombre,
    da.ajuste_inv_real
FROM
	MKS_MP_SUB.CAT_ITEMS ci
INNER JOIN 
    MKS_MP_SUB.DATOS_ALERTAS da 
    ON ci.id_item = da.id_item
WHERE
	ci.id_item IN (\'' . implode('\',\'', $items) . '\')
    AND da.aniosemana = ' . $semanaAlerta . '
    AND da.id_planta = ' . $idPlanta . '
    AND da.id_tipo = ' . $idTipo;

$result = sqlsrv_query($conn_sql_azure, $query);

$nombresItems = array();
$montosItem = array();

while ($row = sqlsrv_fetch_array($result)) {
    $nombresItems[] = $row['nombre'];
    $montosItem[] = $row['ajuste_inv_real'];
}

$datosAlerta = array();

for ($i = 0; $i < count($items); $i++) {
    $datosAlerta[] = [
        'id' => $items[$i],
        'nombre' => $nombresItems[$i],
        'monto' => $montosItem[$i]
    ];
}

// echo json_encode($datosAlerta);
// die;

// EOF
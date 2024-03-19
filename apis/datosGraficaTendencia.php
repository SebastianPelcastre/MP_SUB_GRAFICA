<?php
require '../../utils/conexion_sql_azure.php';

$query = '
SELECT 
    fixed_aniosem_bimbo
FROM
    MKS_MP_SUB.SEMANAS_BIMBO
WHERE
    dia BETWEEN CAST(GETDATE() -53 AS DATE) AND CAST(GETDATE() -5 AS DATE)
GROUP BY
    fixed_aniosem_bimbo
ORDER BY
    fixed_aniosem_bimbo';

$result = sqlsrv_query($conn_sql_azure, $query);

$semanasAlerta = array();
while ($row = sqlsrv_fetch_array($result)) {
    $semanasAlerta[] = $row['fixed_aniosem_bimbo'];
}
$semanasAlerta = [202401, 202402, 202403, 202404, 202405, 202406, 202407, 202408];

$query = '
SELECT 
    da.id_item,
    ci.nombre
FROM 
    MKS_MP_SUB.DATOS_ALERTAS da
INNER JOIN 
    MKS_MP_SUB.CAT_ITEMS ci
    ON da.id_item = ci.id_item
WHERE
    da.id_planta = ' . $_POST['idPlanta'] . '
    AND da.aniosemana = ' . $semanasAlerta[sizeof($semanasAlerta) - 1] . '
    AND alerta = 1
    AND da.id_tipo = ' . $_POST['id_tipo'] . '
    AND id_tipo_alerta IN (' . $_POST['id_tipo_alerta'] . ',3)
';

$result = sqlsrv_query($conn_sql_azure, $query);

$itemsAlertados = array();

while ($row = sqlsrv_fetch_array($result)) {
    $subdata = array();
    $subdata['id_item'] = $row['id_item'];
    $subdata['nombre'] = $row['nombre'];
    $itemsAlertados[] = $subdata;
}

$query = '
SELECT
    id_item,
    aniosemana,
    ajuste_inv_real,
    ajuste_inv_real_abs
FROM
    MKS_MP_SUB.DATOS_ALERTAS      
WHERE
    id_planta = ' . $_POST['idPlanta'] . '
    AND aniosemana IN (' . implode(',', $semanasAlerta) . ')
    AND id_item IN (\'' . implode('\',\'', array_column($itemsAlertados, 'id_item')) . '\')
    AND id_tipo = ' . $_POST['id_tipo'] . '
GROUP BY
    id_item,
    aniosemana,
    ajuste_inv_real,
    ajuste_inv_real_abs
';

$result = sqlsrv_query($conn_sql_azure, $query);

$importesItems = array();

while ($row = sqlsrv_fetch_array($result)) {
    $subdata = array();
    $subdata['id_item'] = $row['id_item'];
    $subdata['semana'] = $row['aniosemana'];
    $subdata['importe'] = $row['ajuste_inv_real'];
    $subdata['absoluto'] = $row['ajuste_inv_real_abs'];
    $importesItems[] = $subdata;
}

$itemsTabla = array();

foreach ($itemsAlertados as $itemAlertado) {
    $semanasTabla = array();
    foreach ($semanasAlerta as $semanaAlerta) {
        $subdataSemana = array();
        $subdataSemana['semana'] = $semanaAlerta;
        $banderaImporte = false;
        foreach ($importesItems as $importeItem) {
            if ($itemAlertado['id_item'] == $importeItem['id_item'] && $semanaAlerta == $importeItem['semana']) {
                $subdataSemana['importe'] = $importeItem['importe'];
                $subdataSemana['acumulado'] = $importeItem['absoluto'];
                $banderaImporte = true;
                break;
            }
        }
        if (!$banderaImporte) {
            $subdataSemana['importe'] = 0;
        }
        $semanasTabla[] = $subdataSemana;
    }

    $itemsTabla[] = ['id_item' => $itemAlertado['id_item'], 'item' => $itemAlertado['nombre'], 'semanas' => $semanasTabla];
}

echo json_encode(['datosGrafica' => $itemsTabla, 'idPlanta' => $_POST['idPlanta']]);

// EOF
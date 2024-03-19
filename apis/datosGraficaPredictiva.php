<?php
require '../../utils/conexion_sql_azure.php';

$semanasAlerta = json_decode($_POST['semanas'], true);

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
    ajuste_inv_real
FROM
    MKS_MP_SUB.DATOS_ALERTAS      
WHERE
    id_planta = ' . $_POST['idPlanta'] . '
    AND aniosemana IN (' . implode(',', $semanasAlerta) . ')
    AND id_item IN (\'' . implode('\',\'', array_column($itemsAlertados, 'id_item')) . '\')
    AND id_tipo = ' . $_POST['id_tipo'] . '
';

$result = sqlsrv_query($conn_sql_azure, $query);

$importesItems = array();

while ($row = sqlsrv_fetch_array($result)) {
    $subdata = array();
    $subdata['id_item'] = $row['id_item'];
    $subdata['semana'] = $row['aniosemana'];
    $subdata['importe'] = $row['ajuste_inv_real'];
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



// echo '<script> crearGrafica(' . json_encode($itemsTabla) . ', ' . $_POST['idPlanta'] . ') </script>';
echo json_encode(['datosGrafica' => $itemsTabla, 'idPlanta' => $_POST['idPlanta']]);

// EOF
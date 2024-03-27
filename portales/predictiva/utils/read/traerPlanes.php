<?php

require '../../../../../utils/conexion_sql_azure.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $selectedValue = $_POST['selectedValue'];

    $query = '
    SELECT
        cp.id_plan,  
        cp.nombre_plan
    FROM 
        MKS_MP_SUB.CAT_RELACION_CAUSAS_PLANES crcp
    INNER JOIN 
        MKS_MP_SUB.CAT_PLANES cp 
        ON crcp.id_plan = cp.id_plan 
    WHERE 
        crcp.id_causa = ' . $selectedValue;

    $result = sqlsrv_query($conn_sql_azure, $query);

    $planes = array();
    while ($row = sqlsrv_fetch_array($result)) {
        $subdata = array();
        $subdata['id'] = $row['id_plan'];
        $subdata['nombre'] = $row['nombre_plan'];
        $planes[] = $subdata;
    }
    echo json_encode($planes);
}
// EOF
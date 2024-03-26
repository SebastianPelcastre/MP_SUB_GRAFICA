<?php

$query = '
SELECT 
	id_plan,
	nombre_plan
FROM
	MKS_MP_SUB.CAT_PLANES';

$result = sqlsrv_query($conn_sql_azure, $query);

$planes = array();
while ($row = sqlsrv_fetch_array($result)) {
    $subdata = array();
    $subdata['id'] = $row['id_plan'];
    $subdata['nombre'] = $row['nombre_plan'];
    $planes[] = $subdata;
}

// EOF
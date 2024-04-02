<?php

$query = '
SELECT DISTINCT 
	cc.id_causa,
	cc.causa 
FROM 
	MKS_MP_SUB.CAT_RELACION_CAUSAS_PLANES crcp 
INNER JOIN 
	MKS_MP_SUB.CAT_CAUSAS cc 
	ON cc.id_causa = crcp.id_causa 
WHERE 	
	crcp.id_tipo = ' . $idTipo . '
	AND cc.id_tipo_alerta = 1
ORDER BY 
	cc.causa';

$result = sqlsrv_query($conn_sql_azure, $query);

$causas = array();
while ($row = sqlsrv_fetch_array($result)) {
	$subdata = array();
	$subdata['id'] = $row['id_causa'];
	$subdata['causa'] = $row['causa'];
	$causas[] = $subdata;
}

// EOF
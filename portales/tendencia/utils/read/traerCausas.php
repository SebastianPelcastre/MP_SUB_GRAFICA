<?php

$query = '
SELECT 
	*
FROM
	MKS_MP_SUB.CAT_CAUSAS';

$result = sqlsrv_query($conn_sql_azure, $query);

$causas = array();
while ($row = sqlsrv_fetch_array($result)) {
	$subdata = array();
	$subdata['id'] = $row['id_causa'];
	$subdata['causa'] = $row['causa'];
	$causas[] = $subdata;
}

// EOF
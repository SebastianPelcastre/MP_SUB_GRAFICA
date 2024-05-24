<?php

// require '../../../../../utils/conexion_sql_azure.php';
// $id_planta = $_SESSION['id_planta'];
$query = '
SELECT
c2.id,
c2.semana,
c2.nombre_planta,
c2.id_planta,
c2.id_item,
c2.nombre_item,
c2.tipo,
c2.puesto,
c2.correos,
c1.plan_accion,
c1.fecha_resolucion,
c1.comentario,
c2.responsables
FROM
(
SELECT
	r.id_item,
	ci.nombre,
	ctt.tipo,
	ct.id_planta,
	ct.nombre nombre_planta,
	r.plan_accion,
	r.fecha_resolucion,
	r.comentarios,
	c.comentario,
	CASE
	WHEN semana = 202454 THEN 202501
	WHEN semana >= 202414 THEN semana 
	ELSE semana -1
	END semana
FROM
	MKS_MP_SUB.RESPUESTAS_TENDENCIA r
INNER JOIN	
	MKS_MP_SUB.CAT_PLANTAS ct
	ON r.id_planta = ct.id_planta
LEFT JOIN
	MKS_MP_SUB.COMENTARIOS c
	ON r.id = c.id_respuesta
INNER JOIN
	MKS_MP_SUB.CAT_ITEMS ci
	ON ci.id_item = r.id_item
INNER JOIN
	MKS_MP_SUB.CAT_TIPO ctt
	ON ctt.id_tipo  = ci.id_tipo
--WHERE semana = 202412
GROUP BY
    r.id_item,
    ci.nombre,
    ctt.tipo ,
	ct.id_planta,
    r.plan_accion,
    r.fecha_resolucion,
    r.comentarios,
    c.comentario,
    ct.nombre,
    semana)
AS c1
RIGHT JOIN (    
	SELECT da.id, cp2.nombre nombre_planta, da.id_planta, ct.tipo , da.id_item, ci.nombre nombre_item, cp.puesto, crup.correos, da.semana, up.responsables
FROM MKS_MP_SUB.ALERTAS_EMITIDAS_PREDICTIVA_TENDENCIA da
LEFT JOIN MKS_MP_SUB.CAT_RELACION_ALERTA_PUESTOS crap
ON crap.item_type = da.id_tipo
INNER JOIN (
	SELECT 
		crup.id_planta, 
		STRING_AGG(crup.correo, \', \') correos
	FROM 
		MKS_MP_SUB.CAT_RELACION_USUARIOS_PLANTAS crup 
	INNER JOIN 
		MKS_MP_SUB.CAT_USUARIOS cu 
		ON crup.correo = cu.correo 
	WHERE 
		crup.id_planta IN (' . implode(',', $id_planta) . ')
		AND crup.id_puesto IN (1,2)
	GROUP BY
		crup.id_planta
) crup
ON da.id_planta = crup.id_planta
INNER JOIN MKS_MP_SUB.CAT_TIPO ct ON
da.id_tipo = ct.id_tipo
INNER JOIN MKS_MP_SUB.CAT_PUESTOS cp
ON crap.id_puesto = cp.id_puesto
INNER JOIN MKS_MP_SUB.CAT_ITEMS ci
ON ci.id_item = da.id_item
INNER JOIN MKS_MP_SUB.CAT_PLANTAS cp2
ON cp2.id_planta = da.id_planta
INNER JOIN (
	SELECT 
		crup.id_planta, 
		STRING_AGG(cu.nombre, \', \') responsables
	FROM 
		MKS_MP_SUB.CAT_RELACION_USUARIOS_PLANTAS crup 
	INNER JOIN 
		MKS_MP_SUB.CAT_USUARIOS cu 
		ON crup.correo = cu.correo 
	WHERE 
		crup.id_planta IN (' . implode(',', $id_planta) . ')
		AND crup.id_puesto IN (3,4)
	GROUP BY
		crup.id_planta
) up
ON da.id_planta = up.id_planta
WHERE da.id_tipo_alerta IN (2)
AND crap.id_puesto in (6)
GROUP BY da.id, cp2.nombre, da.id_planta, ct.tipo , da.id_item, ci.nombre, cp.puesto, crup.correos, da.semana, up.responsables)
--AND da.aniosemana = 202411)
AS c2
ON (c1.id_item = c2.id_item AND c1.id_planta = c2.id_planta AND c2.semana = c1.semana)
WHERE c2.semana not in (202409) AND c2.id_planta IN (' . implode(',', $id_planta) . ')
ORDER BY semana
';

$result = sqlsrv_query($conn_sql_azure, $query);

$respuestas = array();

while ($row = sqlsrv_fetch_array($result)) {
	$subdata = array();
	$subdata['id'] = $row['id'];
	$subdata['semana'] = $row['semana'];
	$subdata['nombre_planta'] = $row['nombre_planta'];
	$subdata['id_planta'] = $row['id_planta'];
	$subdata['id_item'] = $row['id_item'];
	$subdata['nombre_item'] = $row['nombre_item'];
	$subdata['tipo'] = $row['tipo'];
	$subdata['puesto'] = $row['puesto'];
	$subdata['correos'] = $row['correos'];
	$subdata['nombre_plan'] = $row['plan_accion'];
	$subdata['fecha_resolucion'] = $row['fecha_resolucion'];
	$subdata['comentario'] = $row['comentario'];
	$subdata['responsables'] = $row['responsables'];
	$respuestas[] = $subdata;
}

// echo $query;
// die;


// EOF
<?php

// require '../../../../../utils/conexion_sql_azure.php';

$query = '
SELECT
c2.aniosemana,
c2.nombre_planta,
c2.id_planta,
c2.id_item,
c2.nombre_item,
c2.tipo,
c2.puesto,
correo,
c1.causa,
c1.nombre_plan,
c1.fecha_resolucion,
c1.comentario
FROM
(
SELECT
	r.id_item,
	ci.nombre,
	ctt.tipo,
	ct.id_planta,
	ct.nombre nombre_planta,
	cc.causa,
	cp.nombre_plan,
	r.fecha_resolucion,
	r.comentarios,
	c.comentario,
	CASE
	WHEN semana = 202454 THEN 202501
	ELSE semana -1
	END semana
FROM
	MKS_MP_SUB.RESPUESTAS r
INNER JOIN	
	MKS_MP_SUB.CAT_PLANTAS ct
	ON r.id_planta = ct.id_planta
INNER JOIN
	MKS_MP_SUB.CAT_CAUSAS cc
	ON r.id_causa = cc.id_causa
INNER JOIN
	MKS_MP_SUB.CAT_PLANES cp
	ON r.id_plan_accion = cp.id_plan
INNER JOIN
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
	cc.causa,
    cp.nombre_plan,
    r.fecha_resolucion,
    r.comentarios,
    c.comentario,
    ct.nombre,
    semana)
AS c1
RIGHT JOIN (    
SELECT cp2.nombre nombre_planta, da.id_planta, ct.tipo , da.id_item,ci.nombre nombre_item, cp.puesto, STRING_AGG(crup.correo, \', \') correo, da.aniosemana
FROM MKS_MP_SUB.DATOS_ALERTAS da
LEFT JOIN MKS_MP_SUB.CAT_RELACION_ALERTA_PUESTOS crap
ON crap.item_type = da.id_tipo
LEFT JOIN MKS_MP_SUB.CAT_RELACION_USUARIOS_PLANTAS crup
ON (crap.id_puesto = crup.id_puesto AND da.id_planta = crup.id_planta)
INNER JOIN MKS_MP_SUB.CAT_TIPO ct ON
da.id_tipo = ct.id_tipo
INNER JOIN MKS_MP_SUB.CAT_PUESTOS cp
ON crap.id_puesto = cp.id_puesto
INNER JOIN MKS_MP_SUB.CAT_ITEMS ci
ON ci.id_item = da.id_item
INNER JOIN MKS_MP_SUB.CAT_PLANTAS cp2
ON cp2.id_planta = da.id_planta
WHERE da.id_tipo_alerta IN (1,3)
AND crap.id_puesto in (1,2)
GROUP BY cp2.nombre, da.id_planta, ct.tipo , da.id_item, ci.nombre, cp.puesto, da.aniosemana)
--AND da.aniosemana = 202411)
AS c2
ON (c1.id_item = c2.id_item AND c1.id_planta = c2.id_planta AND c2.aniosemana = c1.semana)
WHERE c2.aniosemana not in (202409)
ORDER BY aniosemana
';

$result = sqlsrv_query($conn_sql_azure, $query);

$respuestas = array();

while ($row = sqlsrv_fetch_array($result)) {
    $subdata = array();
    $subdata['semana'] = $row['aniosemana'];
    $subdata['nombre_planta'] = $row['nombre_planta'];
    $subdata['id_planta'] = $row['id_planta'];
    $subdata['id_item'] = $row['id_item'];
    $subdata['nombre_item'] = $row['nombre_item'];
    $subdata['tipo'] = $row['tipo'];
    $subdata['puesto'] = $row['puesto'];
    $subdata['correo'] = $row['correo'];
    $subdata['causa'] = $row['causa'];
    $subdata['nombre_plan'] = $row['nombre_plan'];
    $subdata['fecha_resolucion'] = $row['fecha_resolucion'];
    $subdata['comentario'] = $row['comentario'];
    $respuestas[] = $subdata;
}

// EOF
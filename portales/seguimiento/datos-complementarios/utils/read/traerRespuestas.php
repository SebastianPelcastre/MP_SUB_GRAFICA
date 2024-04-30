<?php

// require '../../../../../utils/conexion_sql_azure.php';
// $id_planta = $_SESSION['id_planta'];
$query = '
SELECT 
	ae.id,
	ae.id_ceve,
	ae.nombre_ceve,
	ae.semana_emision,
	ae.fecha_emision,
	da.tipo_alerta,
	da.id_razon,
	da.nombre_razon,
	da.nombre_puesto,
	da.correos,
	da.nombre_plan,
	da.fecha_resolucion
FROM (
	/* UNIVERSO TOTAL A MOSTRAR */
	SELECT
		ae.id,
		c.id AS id_ceve,
		c.nombre AS nombre_ceve,
		ae.semana AS semana_emision,
		ae.fecha_emision
	FROM 
		MKS_Datos_Complementarios.ALERTAS_EMITIDAS ae 
	INNER JOIN	
		MKS_Datos_Complementarios.CEVES c 
		ON ae.id_ceve = c.id 
	WHERE 
		ae.estado = 1
		AND ae.id_ceve IN (' . implode(',', $id_ceve) . ')
) ae
INNER JOIN (	
	SELECT 
		pr.*,
		r.nombre_plan,
		r.fecha_resolucion
	FROM (
		/* PRONOSTICOS */
		SELECT
			c.id AS id_ceve,
			da.semana,
			\'PREDIVTIVA\' AS tipo_alerta,
		    g.id AS id_grupo,
		    g.nombre AS nombre_grupo,
		    da.id_razon,
		    r.descripcion AS nombre_razon,
		    u.nombre_puesto,
		    u.correos
		FROM 
		    MKS_Datos_Complementarios.DATA_ALERTAS_PRONOSTICO da 
		INNER JOIN 
		    MKS_Datos_Complementarios.RELACION_GRUPOS_RAZONES rgr 
		    ON da.id_razon = rgr.id_razon 
		INNER JOIN 
		    MKS_Datos_Complementarios.GRUPOS g 
		    ON rgr.id_grupo = g.id 
		INNER JOIN 
		    MKS_Datos_Complementarios.RAZONES r 
		    ON da.id_razon = r.id 
		INNER JOIN
		    MKS_Datos_Complementarios.CEVES c
		    ON da.id_ceve = c.id
		INNER JOIN (
			SELECT
				re.id_razon,
				re.id_puesto,
				p.nombre AS nombre_puesto,
				STRING_AGG(u.correo_usuario, \', \') AS correos
			FROM
				MKS_Datos_Complementarios.RELACION_ENVIOS re 
			INNER JOIN
				MKS_Datos_Complementarios.USUARIOS u 
				ON re.id_puesto = u.id_puesto
			INNER JOIN
				MKS_Datos_Complementarios.PUESTOS p 
				ON re.id_puesto = p.id
			WHERE 
				id_tipo_envio = 1
				AND re.id_puesto = 1
				AND re.destinatario_principal = 1
			GROUP BY
				re.id_razon,
				re.id_puesto,
				p.nombre
		) u
			ON da.id_razon = u.id_razon
		WHERE
		    da.alerta = 0
		    AND da.semana >= 202415
	) pr
	LEFT JOIN (
		/* RESPUESTAS */
		SELECT
			rd.id_ceve,
			rd.semana_alerta,
			rd.id_grupo,
			prd.id_razon,
			prd.nombre_plan,
			prd.fecha_resolucion
		FROM 
			MKS_Datos_Complementarios.RESPUESTAS_DC rd  
		INNER JOIN (
			SELECT
				prd.id_respuesta,
				prd.id_razon,
				prd.id_plan,
				p.descripcion AS nombre_plan,
				prd.fecha_resolucion
			FROM
				MKS_Datos_Complementarios.PLANES_REGISTRADOS_DC prd 
			INNER JOIN
				MKS_Datos_Complementarios.PLANES p
				ON prd.id_plan = p.id
		) prd
			ON rd.id = prd.id_respuesta
	) r
		ON pr.id_ceve = r.id_ceve
		AND pr.semana = r.semana_alerta
		AND pr.id_grupo = r.id_grupo
		AND pr.id_razon = r.id_razon
	    
	UNION
	
	SELECT 
		pr.*,
		r.nombre_plan,
		r.fecha_resolucion
	FROM (
		/* PERIÓDICA */
		SELECT
			c.id AS id_ceve,
			da.semana,
			\'POR OCURRENCIA\' AS tipo_alerta,
		    g.id AS id_grupo,
		    g.nombre AS nombre_grupo,
		    da.id_razon,
		    r.descripcion AS nombre_razon,
		    u.nombre_puesto,
		    u.correos
		FROM 
		    MKS_Datos_Complementarios.DATA_ALERTAS da 
		INNER JOIN 
		    MKS_Datos_Complementarios.RELACION_GRUPOS_RAZONES rgr 
		    ON da.id_razon = rgr.id_razon 
		INNER JOIN 
		    MKS_Datos_Complementarios.GRUPOS g 
		    ON rgr.id_grupo = g.id 
		INNER JOIN 
		    MKS_Datos_Complementarios.RAZONES r 
		    ON da.id_razon = r.id 
		INNER JOIN
		    MKS_Datos_Complementarios.CEVES c
		    ON da.id_ceve = c.id
		INNER JOIN (
			SELECT
				re.id_razon,
				re.id_puesto,
				p.nombre AS nombre_puesto,
				STRING_AGG(u.correo_usuario, \', \') AS correos
			FROM
				MKS_Datos_Complementarios.RELACION_ENVIOS re 
			INNER JOIN
				MKS_Datos_Complementarios.USUARIOS u 
				ON re.id_puesto = u.id_puesto
			INNER JOIN
				MKS_Datos_Complementarios.PUESTOS p 
				ON re.id_puesto = p.id
			WHERE 
				id_tipo_envio = 1
				AND re.id_puesto = 1
				AND re.destinatario_principal = 1
			GROUP BY
				re.id_razon,
				re.id_puesto,
				p.nombre
		) u
			ON da.id_razon = u.id_razon
		WHERE
		    da.alerta = 1
	) pr
	LEFT JOIN (
		/* RESPUESTAS */
		SELECT
			rd.id_ceve,
			rd.semana_alerta,
			rd.id_grupo,
			prd.id_razon,
			prd.nombre_plan,
			prd.fecha_resolucion
		FROM 
			MKS_Datos_Complementarios.RESPUESTAS_DC rd  
		INNER JOIN (
			SELECT
				prd.id_respuesta,
				prd.id_razon,
				prd.id_plan,
				p.descripcion AS nombre_plan,
				prd.fecha_resolucion
			FROM
				MKS_Datos_Complementarios.PLANES_REGISTRADOS_DC prd 
			INNER JOIN
				MKS_Datos_Complementarios.PLANES p
				ON prd.id_plan = p.id
		) prd
			ON rd.id = prd.id_respuesta
	) r
		ON pr.id_ceve = r.id_ceve
		AND pr.semana = r.semana_alerta
		AND pr.id_grupo = r.id_grupo
		AND pr.id_razon = r.id_razon
) da
	ON ae.id_ceve = da.id_ceve
	AND ae.semana_emision = da.semana
ORDER BY
	ae.id
';

$result = sqlsrv_query($conn_sql_azure, $query);

$respuestas = array();

while ($row = sqlsrv_fetch_array($result)) {
	$subdata = array();
	$subdata['id'] = $row['id'];
	$subdata['id_ceve'] = $row['id_ceve'];
	$subdata['nombre_ceve'] = $row['nombre_ceve'];
	$subdata['semana'] = $row['semana_emision'];
	$subdata['fecha_emision'] = $row['fecha_emision'];
	$subdata['tipo_alerta'] = $row['tipo_alerta'];
	$subdata['id_razon'] = $row['id_razon'];
	$subdata['razon'] = $row['nombre_razon'];
	$subdata['puesto'] = $row['nombre_puesto'];
	$subdata['correos'] = $row['correos'];
	$subdata['plan'] = $row['nombre_plan'];
	$subdata['fecha_resolucion'] = $row['fecha_resolucion'];
	$respuestas[] = $subdata;
}

// echo json_encode($respuestas);
// die;


// EOF
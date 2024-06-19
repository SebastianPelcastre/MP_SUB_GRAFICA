<?php

set_time_limit(0);

include("../../../../utils/conexion_sql_azure.php");

session_start();

if (isset($_POST['no_colaborador']) && isset($_POST['correo'])) {

    $no_colaborador = $_POST['no_colaborador'];
    $correo = $_POST['correo'];

    $qry_usuarios = '
	SELECT 
        *
    FROM
        MKS_MP_SUB.USURIOS_PORTAL_SEGUIMIENTO
    WHERE 	
        correo = \'' . $correo . '\' 
        AND numero_colaborador = ' . $no_colaborador . '
        AND activo = 1';

    if (!$resultUsr = sqlsrv_query($conn_sql_azure, $qry_usuarios)) {
        echo '<script type="text/javascript">';
        echo 'alert("Usuario o contraseña incorrectos.");';
        echo "window.history.back();";
        echo '</script>';
        die(print_r(sqlsrv_errors()));
    };

    $array_usr = sqlsrv_fetch_array($resultUsr);

    if (sqlsrv_has_rows($resultUsr)) {
        $qry_planta_usuario = '
        SELECT 
        	id_planta
        FROM 
            MKS_MP_SUB.CAT_RELACION_USUARIOS_PLANTAS crup
        WHERE 
        	correo = \'' . $correo . '\'
            AND id_puesto IN (3,4,9,12)
        GROUP BY
        	id_planta';

        $result = sqlsrv_query($conn_sql_azure, $qry_planta_usuario);

        if (sqlsrv_has_rows($result)) {

            $plantas_usuario = array();
            while ($row = sqlsrv_fetch_array($result)) {
                $plantas_usuario[] = $row['id_planta'];
            }

            $hoy = date("Y-m-d H:i:s");
            $id_usr = $array_usr['id'];

            $_SESSION['nombre_usuario'] = $array_usr['nombre'];
            $_SESSION['id_usuario_cookie'] = $array_usr['id'];
            $_SESSION['id_planta'] = json_encode($plantas_usuario);
            $_SESSION['tipo_usuario'] = '';
            $_SESSION['no_colaborador'] = $no_colaborador;
            $_SESSION['correo'] = $correo;


            echo '<script type="text/javascript">';
            echo 'window.location.href = "../index.php";';
            echo '</script>';
        } else {
            $query = '
            SELECT
                correo_usuario 
            FROM
                MKS_Datos_Complementarios.USUARIOS u 
            WHERE
                correo_usuario = \'' . $correo . '\' AND id_puesto IN (2,3)
            ';

            $result = sqlsrv_query($conn_sql_azure, $query);

            if (sqlsrv_has_rows($result)) {
                $query = '
                SELECT
                    id_ceve
                FROM
                    MKS_Datos_Complementarios.RELACION_CEVES_USUARIOS
                WHERE
                    correo_usuario = \'' . $correo . '\'
                ';

                $result = sqlsrv_query($conn_sql_azure, $query);

                $ceves_usuario = array();
                while ($row = sqlsrv_fetch_array($result)) {
                    $ceves_usuario[] = $row['id_ceve'];
                }

                $hoy = date("Y-m-d H:i:s");
                $id_usr = $array_usr['id'];

                $_SESSION['nombre_usuario'] = $array_usr['nombre'];
                $_SESSION['id_usuario_cookie'] = $array_usr['id'];
                $_SESSION['id_ceve'] = json_encode($ceves_usuario);
                $_SESSION['tipo_usuario'] = '';
                $_SESSION['no_colaborador'] = $no_colaborador;
                $_SESSION['correo'] = $correo;


                echo '<script type="text/javascript">';
                echo 'window.location.href = "../datos-complementarios/index.php";';
                echo '</script>';
            } else {
                echo '<script type="text/javascript">';
                echo 'alert("Usuario o contraseña incorrectos.");';
                echo "window.history.back();";
                echo '</script>';
            }
        }
    } else {
        echo '<script type="text/javascript">';
        echo 'alert("Usuario o contraseña incorrectos.");';
        echo "window.history.back();";
        echo '</script>';
    }
} else {
    echo "No llegaron los datos";
}

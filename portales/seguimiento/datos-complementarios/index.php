<?php

require '../../../../utils/conexion_sql_azure.php';

//Validamos que tenga sesión iniciada 
session_start();

if (isset($_SESSION['nombre_usuario']) && isset($_SESSION['id_usuario_cookie'])) {
    // include("../../..//utils/conexion_sql_azure.php");
    $nombre_usuario = $_SESSION['nombre_usuario'];
    $id_usuario = $_SESSION['id_usuario_cookie'];
    $id_ceve = json_decode($_SESSION['id_ceve'], true);
    echo '<script type="text/javascript">';
    echo ' var id_usuario = ' . $id_usuario;
    echo '</script>';
} else {
    echo '<script type="text/javascript">';
    echo 'alert("Por favor inicia sesión.");';
    echo 'window.location.href = "login/index.php";';
    echo '</script>';
}

require './utils/read/traerRespuestas.php';

require './utils/read/traerRespuestasPortal.php';

require './utils/read/traerResponsable.php';

?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PORTAL SEGUIMIENTO</title>
    <!-- Bootstrap -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://cdn.datatables.net/2.0.5/css/dataTables.bootstrap5.css" />
    <link rel="stylesheet" href="https://cdn.datatables.net/searchpanes/2.3.1/css/searchPanes.bootstrap5.css" />
    <link rel="stylesheet" href="https://cdn.datatables.net/select/2.0.1/css/select.bootstrap5.css" />
    <!-- <link rel="stylesheet" href="public/css/bootstrap.min.css" /> -->
    <!-- CSS -->
    <link rel="stylesheet" href="public/css/main.css" />
    <!-- BoxIcons CSS -->
    <link href="https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css" rel="stylesheet" />
    <!-- DataTable CSS -->
    <link rel="stylesheet" href="https://cdn.datatables.net/2.0.3/css/dataTables.dataTables.css" />

    <style type="text/css">
        #mapa {
            height: 380px;
        }
    </style>
</head>

<body>
    <!-- Sidebar -->
    <nav class="sidebar close" id="sidebar">
        <header>
            <div class="image-text">
                <span class="image">
                    <img src="media/logo-grupo-bimbo.png" alt="Logo Grupo Bimbo" />
                </span>

                <div class="home-text logo-text d-none d-md-block">
                    <span class="name fw-bold">MICROLEAKS</span>
                </div>
            </div>
            <i class='bx bx-chevron-right toggle' id="toggler-btn"></i>
        </header>

        <div class="menu-bar">
            <div class="menu">
                <ul class="menu-links">
                    <li class="nav-link" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Datos Complementarios">
                        <a href="index.php">
                            <i class='bx bx-time-five icon'></i>
                            <span class="home-text nav-text">Datos Complementarios</span>
                        </a>
                    </li>
                    <!-- 
                    <li class="nav-link" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Tendencia">
                        <a href="./">
                            <i class='bx bx-line-chart icon'></i>
                            <span class="home-text nav-text">Tendencia <br> (En desarrollo)</span>
                        </a>
                    </li> -->
                </ul>
            </div>

            <div class="bottom-content">
                <li data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Cerrar Sesión">
                    <a href="../login/cierra_sesion.php">
                        <i class='bx bx-log-out icon'></i>
                        <span class="home-text nav-text">Cerrar Sesión</span>
                    </a>
                </li>

                <li class="mode sidebar-li" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Modo Obscuro">
                    <div class="sun-moon">
                        <i class="bx bx-moon icon moon"></i>
                        <i class="bx bx-sun icon sun"></i>
                    </div>
                    <span class="mode-text home-text d-none d-md-block">Obscuro</span>

                    <div class="toggle-switch">
                        <span class="switch"></span>
                    </div>
                </li>
            </div>
        </div>
    </nav>

    <!-- Content -->
    <section class="home" id="home">
        <div class="container-fluid">
            <!-- Encabezado -->
            <header class="row header p-2 px-xl-4">
                <div class="col-12 ms-md-2 d-flex gap-2 align-items-center">
                    <i class='bx bx-chevron-right toggle d-md-none' id="btn-toggler-sm"></i>
                    <div class="fs-4 fs-xl-1 text-uppercase fw-bold">
                        Seguimiento
                    </div>
                </div>
            </header>

            <!-- Principal -->
            <main class="row p-2 px-xl-4">
                <div class="row">
                    <div class="col">
                        <h1 class="text-center title">SEGUIMIENTO ALERTAS DATOS COMPLEMENTARIOS | CAN</h1>
                    </div>
                </div>
                <div class="row justify-content-md-center mt-3">
                    <div class="col-12">
                        <div class="card shadow border border-top-0 border-end-0 border-bottom-0 border-main">
                            <form class="card-body" id="form" method="POST">
                                <div class="table-responsive">
                                    <table class="table display nowrap w-100" id="table">
                                        <thead class="table-light">
                                            <tr>
                                                <th>ID CEVE</th>
                                                <th>NOMBRE CEVE</th>
                                                <th>SEMANA</th>
                                                <th>TIPO</th>
                                                <th>ID RAZÓN</th>
                                                <th>RAZÓN</th>
                                                <th>PUESTO</th>
                                                <th>CORREO(S)</th>
                                                <th>PLAN DE ACCIÓN</th>
                                                <th>FECHA DE RESOLUCIÓN</th>
                                                <th>¿SE LLEVÓ A CABO EL PLAN DE ACCIÓN?</th>
                                                <th>OBSERVACIONES (MÁXIMO 255 CARÁCTERES)</th>
                                                <th>RESPONSABLES (CONTRALORD CEVE)</th>
                                            </tr>
                                        </thead>
                                        <tbody class="table-group-divider">
                                            <?php
                                            $contador = 0;
                                            foreach ($respuestas as $respuesta) {
                                                $respuestaParaItem = 'SIN RESPUESTA';

                                                if ($respuesta['plan'] !== null && $respuesta['fecha_resolucion'] !== null) {
                                                    $coincidenciaEncontrada = false;
                                                    foreach ($seguimientos as $seguimiento) {
                                                        if ($seguimiento['id'] == $respuesta['id']) {
                                                            $coincidenciaEncontrada = true;
                                                            $columnaRealizado = '
                                                            <td style="vertical-align: middle;">
                                                                <p>' . $seguimiento['realizado'] . '</p>
                                                            </td>';
                                                            $columnaObservaciones = '
                                                            <td style="vertical-align: middle;">
                                                                <p>' . $seguimiento['observaciones'] . '</p>
                                                            </td>';
                                                            break;
                                                        }
                                                    }

                                                    if ($coincidenciaEncontrada == false) {
                                                        $columnaRealizado = ' 
                                                        <td style="vertical-align: middle;">
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio" value="si" id="si-' . $contador . '" name="estado-' . $contador . '">
                                                                <label class="form-check-label" for="si-' . $contador . '">
                                                                    Sí
                                                                </label>
                                                            </div>
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio" value="no" id="liveToastBtn2-' . $contador . '" name="estado-' . $contador . '">
                                                                <label class="form-check-label" for="no-' . $contador . '">
                                                                    No
                                                                </label>
                                                            </div>
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio" value="en-proceso" id="liveToastBtn-' . $contador . '" name="estado-' . $contador . '">
                                                                <label class="form-check-label" for="en-proceso-' . $contador . '">
                                                                    En proceso
                                                                </label>
                                                            </div>
                                                        </td>';
                                                        $columnaObservaciones = '
                                                        <td style="vertical-align: middle;">
                                                            <div class="form-floating" style="height: 100%">
                                                                <textarea class="form-control" rows="2" name="comentario-' . $contador . '" maxlength="255" id="observaciones-' . $contador . '"></textarea>
                                                                <label for="observaciones-' . $contador . '">Observaciones</label>
                                                            </div>
                                                        </td>';
                                                    }

                                                    $columnaPlanAccion = '
                                                    <td style="vertical-align: middle;">
                                                        <p>' . $respuesta['plan'] . '</p>
                                                    </td>';

                                                    $columnaFechaResolucion = '
                                                    <td style="vertical-align: middle;text-align:center;">
                                                        <p>' . $respuesta['fecha_resolucion']->format('d/m/Y') . '</p>
                                                    </td>';
                                                } else {

                                                    $columnaPlanAccion = '
                                                    <td style="vertical-align: middle;">
                                                        <p>' . $respuestaParaItem . '</p>
                                                    </td>';

                                                    $columnaFechaResolucion = '
                                                    <td style="vertical-align: middle; text-align:center;">
                                                        <p>' . $respuestaParaItem . '</p>
                                                    </td>';

                                                    $columnaRealizado = '
                                                    <td></td>';

                                                    $columnaObservaciones = '
                                                    <td></td>';
                                                }
                                            ?>
                                                <tr style="white-space: nowrap">
                                                    <td style="vertical-align: middle;"><?php echo $respuesta['id_ceve'] ?><input type="hidden" value="<?php echo $respuesta['id']; ?>" name="idAlerta-<?php echo $contador ?>" /></td>
                                                    <td style="vertical-align: middle;"><?php echo $respuesta['nombre_ceve'] ?></td>
                                                    <td style="vertical-align: middle;"> <?php echo $respuesta['semana']; ?></td>
                                                    <td style="vertical-align: middle;"><?php echo $respuesta['tipo_alerta'] ?></td>
                                                    <td style="vertical-align: middle;"><?php echo $respuesta['id_razon'] ?></td>
                                                    <td style="vertical-align: middle;"><?php echo $respuesta['razon'] ?></td>
                                                    <td style="vertical-align: middle;"><?php echo $respuesta['puesto'] ?></td>
                                                    <td style="vertical-align: middle;"><?php echo $respuesta['correos'] ?></td>
                                                    <?php echo $columnaPlanAccion; ?>
                                                    <?php echo $columnaFechaResolucion; ?>
                                                    <?php echo $columnaRealizado; ?>
                                                    <?php echo $columnaObservaciones; ?>
                                                    <td style="vertical-align: middle;"><?php echo $nombre; ?></td>
                                                </tr>
                                            <?php
                                                $contador += 1;
                                            }
                                            ?>
                                        </tbody>
                                    </table>
                                </div>

                                <input type="hidden" value="<?php echo date('Y-m-d'); ?>" name="fechaRegistro" />

                                <input type="hidden" value="<?php echo sizeof($respuestas); ?>" name="numAlertas" id="numAlertas" />
                                <div class="row justify-content-center mt-3">
                                    <div class="col-12 col-lg-6">
                                        <button type="submit" class="btn btn-main w-100 fw-bold" id="btn-submit">Enviar Registro</button>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <!-- Termina principal -->

            <!-- Pie de página -->
            <footer class="row p-2 px-xl-4 mt-5">
                <div class="row">
                    <div class="col">
                        <h6 class="fw-bold text-center"><?php echo date('Y') ?> Todos los derechos reservados | Grupo Bimbo</h6>
                    </div>
                </div>
            </footer>
            <!-- Termina pie de página -->
        </div>
    </section>

    <!-- Loading modal -->
    <div class="modal fade" id="loading-modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body d-flex flex-column align-items-center justify-content-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Realizando operación</span>
                    </div>
                    <p class="mt-3">Realizando operación</p>
                    <p class="fs-6 mt-3">Tomará unos segundos...</p>
                </div>
            </div>
        </div>
    </div>
    <!-- Ends loading modal -->

    <!-- Fail modal -->
    <div class="modal fade" id="fail-modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-danger">
                    <h5 class="modal-title fw-bold text-white">Error</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body d-flex flex-column align-items-center justify-content-center">
                    <p class="mt-3 fw-bold" id="mensaje-error"></p>
                </div>
            </div>
        </div>
    </div>
    <!-- Ends fail modal -->

    <!-- Toast -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-warning">
                <i class='bx bxs-bell icon'></i>
                <strong class="me-auto">Aviso</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                En caso de seleccionar "En proceso", indicar nueva fecha de resolución en las observaciones
            </div>
        </div>
    </div>
    <!-- Ends Toast -->

    <!-- jQuery -->
    <!-- <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script> -->
    <script src="https://code.jquery.com/jquery-3.7.1.js"></script>
    <!-- Main JS -->
    <script src="public/js/main.min.js"></script>
    <!-- Bootstrap JS -->
    <!-- <script src="public/js/bootstrap.min.js"></script> -->

    <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    <!-- DataTable JS -->
    <script src="https://cdn.datatables.net/2.0.5/js/dataTables.js"></script>
    <script src="https://cdn.datatables.net/2.0.5/js/dataTables.bootstrap5.js"></script>
    <script src="https://cdn.datatables.net/searchpanes/2.3.1/js/dataTables.searchPanes.js"></script>
    <script src="https://cdn.datatables.net/searchpanes/2.3.1/js/searchPanes.bootstrap5.js"></script>
    <!-- <script src="https://cdn.datatables.net/searchpanes/2.3.1/js/searchPanes.dataTables.js"></script> -->
    <script src="https://cdn.datatables.net/select/2.0.1/js/dataTables.select.js"></script>
    <script src="https://cdn.datatables.net/select/2.0.1/js/select.bootstrap5.js"></script>
    <script src="public/js/main.js"></script>

</body>

</html>
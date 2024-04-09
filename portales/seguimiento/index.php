<?php

require '../../../utils/conexion_sql_azure.php';

//Validamos que tenga sesión iniciada 
session_start();

if (isset($_SESSION['nombre_usuario']) && isset($_SESSION['id_usuario_cookie'])) {
    // include("../../..//utils/conexion_sql_azure.php");
    $nombre_usuario = $_SESSION['nombre_usuario'];
    $id_usuario = $_SESSION['id_usuario_cookie'];
    $id_planta = json_decode($_SESSION['id_planta'], true);
    echo '<script type="text/javascript">';
    echo ' var id_usuario = ' . $id_usuario;
    echo '</script>';
    // echo json_encode($id_planta);
    // die;
} else {
    echo '<script type="text/javascript">';
    echo 'alert("Por favor inicia sesión.");';
    echo 'window.location.href = "login/index.php";';
    echo '</script>';
}

require './utils/read/traerRespuestas.php';

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
    <!-- CSS -->
    <link rel="stylesheet" href="public/css/main.css" />
    <!-- BoxIcons CSS -->
    <link href="https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css" rel="stylesheet" />
    <!-- Bootstrap -->
    <link rel="stylesheet" href="public/css/bootstrap.min.css" />
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
                    <li class="nav-link" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Uso">
                        <a href="index.php">
                            <i class='bx bx-mobile-alt icon'></i>
                            <span class="home-text nav-text">MP y SUB Predictiva</span>
                        </a>
                    </li>

                    <li class="nav-link" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Ventas">
                        <a href="ventas.php">
                            <i class='bx bx-money-withdraw icon'></i>
                            <span class="home-text nav-text">MP y SUB Tendencia</span>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="bottom-content">
                <li data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Cerrar Sesión">
                    <a href="login/cierra_sesion.php">
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
                        <h1 class="text-center title">SEGUIMIENTO ALERTAS MP Y SUB PREDICTIVAS | CAN</h1>
                    </div>
                </div>
                <div class="row justify-content-md-center mt-3">
                    <div class="col-12">
                        <div class="card shadow border border-top-0 border-end-0 border-bottom-0 border-main">
                            <form class="card-body" id="form" method="POST">
                                <div class="table-responsive">
                                    <table class="table" id="table">
                                        <thead class="table-light">
                                            <tr>
                                                <th>SEMANA</th>
                                                <th>PLANTA</th>
                                                <th>NOMBRE PLANTA</th>
                                                <th>ITEM</th>
                                                <th>NOMBRE ITEM</th>
                                                <th>TIPO</th>
                                                <th>PUESTO</th>
                                                <th>CORREO</th>
                                                <th>CAUSA</th>
                                                <th>PLAN DE ACCIÓN</th>
                                                <th>FECHA DE RESOLUCIÓN</th>
                                                <th>COMENTARIO</th>
                                                <th>¿SE LLEVÓ A CABO EL PLAN DE ACCIÓN?</th>
                                                <th>OBSERVACIONES (MÁXIMO 255 CARÁCTERES)</th>
                                            </tr>
                                        </thead>
                                        <tbody class="table-group-divider">
                                            <?php
                                            $contador = 0;

                                            foreach ($respuestas as $respuesta) {
                                                $columnaCausa = '';
                                                $columnaPlanAccion = '';
                                                $columnaFechaResolucion = '';
                                                $columnaComentarios = '';
                                                $respuestaParaItem = 'SIN RESPUESTA';

                                                if ($respuesta['causa'] !== null && $respuesta['nombre_plan'] !== null) {
                                                    $columnaCausa = '<td style="vertical-align: middle;text-align:center;"><p>' . $respuesta['causa'] . '</p></td>';

                                                    $columnaPlanAccion = '<td style="vertical-align: middle;text-align:center;"><p>' . $respuesta['nombre_plan'] . '</p></td>';

                                                    $columnaFechaResolucion = '<td style="vertical-align: middle;text-align:center;"><p>' . $respuesta['fecha_resolucion']->format('d/m/Y') . '</p></td>';
                                                    if ($respuesta['comentario'] == '') {
                                                        $columnaComentarios = '';
                                                        '<td style="vertical-align: middle;"><p>SIN COMENTARIOS</p></td>';
                                                    } else {
                                                        $columnaComentarios = '<td style="vertical-align: middle;"><p>' . $respuesta['comentario'] . '</p></td>';
                                                    }
                                                } else {
                                                    $columnaCausa = '<td style="vertical-align: middle;"><p>' . $respuestaParaItem . '</p></td>';

                                                    $columnaPlanAccion = '<td style="vertical-align: middle;"><p>' . $respuestaParaItem . '</p></td>';

                                                    $columnaFechaResolucion = '<td style="vertical-align: middle;"><p>' . $respuestaParaItem . '</p></td>';

                                                    $columnaComentarios = '<td style="vertical-align: middle;"> <div style="vertical-align: middle;">' . $respuestaParaItem . '</div></td>';
                                                }
                                            ?>
                                                <tr>
                                                    <td style="vertical-align: middle;"><?php echo $respuesta['semana'] ?></td>
                                                    <td style="vertical-align: middle;"><?php echo $respuesta['id_planta'] ?></td>
                                                    <td style="vertical-align: middle;"><?php echo $respuesta['nombre_planta'] ?></td>
                                                    <td style="vertical-align: middle;"><?php echo $respuesta['id_item'] ?></td>
                                                    <td style="vertical-align: middle;"><?php echo $respuesta['nombre_item'] ?></td>
                                                    <td style="vertical-align: middle;"><?php echo $respuesta['tipo'] ?></td>
                                                    <td style="vertical-align: middle;"><?php echo $respuesta['puesto'] ?></td>
                                                    <td style="vertical-align: middle;"><?php echo $respuesta['correo'] ?></td>
                                                    <?php echo $columnaCausa ?>
                                                    <?php echo $columnaPlanAccion; ?>
                                                    <?php echo $columnaFechaResolucion; ?>
                                                    <?php echo $columnaComentarios; ?>
                                                    <td>
                                                        <?php if ($respuesta['causa'] !== null && $respuesta['nombre_plan'] !== null) {
                                                        ?>
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio" value="si" id="si-<?php echo $contador ?>" name="estado-<?php echo $contador ?>">
                                                                <label class="form-check-label" for="si-<?php echo $contador ?>">
                                                                    Sí
                                                                </label>
                                                            </div>
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio" value="no" id="no-<?php echo $contador ?>" name="estado-<?php echo $contador ?>">
                                                                <label class="form-check-label" for="no-<?php echo $contador ?>">
                                                                    No
                                                                </label>
                                                            </div>
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio" value="en-proceso-<?php echo $contador ?>" id="en-proceso-<?php echo $contador ?>" name="estado-<?php echo $contador ?>">
                                                                <label class="form-check-label" for="en-proceso-<?php echo $contador ?>">
                                                                    En proceso
                                                                </label>
                                                                <hr>
                                                                <div class="d-none" id="instruccion-<?php echo $contador ?>">
                                                                    <p>En caso de seleccionar "En proceso", indicar nueva fecha de resolución en los comentarios</p>
                                                                </div>
                                                            </div>
                                                        <?php
                                                        } ?>
                                                    </td>
                                                    <td>
                                                        <div class="form-floating" style="height: 100%">
                                                            <?php if ($respuesta['causa'] !== null && $respuesta['nombre_plan'] !== null) {
                                                            ?>
                                                                <textarea class="form-control" rows="2" name="comentario-<?php echo $contador ?>" maxlength="255" id="observaciones-<?php echo $contador ?>"></textarea>
                                                                <label for="observaciones-<?php echo $contador ?>">Observaciones</label>
                                                            <?php
                                                            } ?>
                                                        </div>
                                                    </td>
                                                </tr>
                                            <?php
                                                $contador += 1;
                                            }
                                            ?>
                                        </tbody>
                                    </table>
                                </div>

                                <input type="hidden" value="<?php echo $_GET['idPlanta']; ?>" name="idPlanta" />
                                <!-- <input type="hidden" value="<?php //echo $_GET['tipoAlerta']; 
                                                                    ?>" name="tipoAlerta" /> -->
                                <input type="hidden" value="<?php echo $_GET['semanaAlerta']; ?>" name="semanaAlerta" />
                                <input type="hidden" value="<?php echo $_GET['fechaEmision']; ?>" name="fechaEmision" />
                                <input type="hidden" value="<?php echo date('Y-m-d'); ?>" name="fechaRegistro" />

                                <input type="hidden" value="<?php echo sizeof($respuestas); ?>" name="numAlertas" id="numAlertas" />

                                <div class="row justify-content-center mt-3">
                                    <div class="col-12 col-lg-6">
                                        <?php
                                        // if (sizeof($respuestas) !== sizeof($respuestas)) {
                                        ?>
                                        <button type="submit" class="btn btn-main w-100 fw-bold" id="btn-submit">Enviar Registro</button>
                                        <?php
                                        // }
                                        ?>
                                    </div>
                                </div>
                                <div class="row justify-content-center mt-3">
                                    <div class="col-12 col-lg-6">
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
                <div class="modal-header fail-modal">
                    <h5 class="modal-title fw-bold">Error</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body d-flex flex-column align-items-center justify-content-center">
                    <p class="mt-3 fw-bold" id="mensaje-error"></p>
                </div>
            </div>
        </div>
    </div>
    <!-- Ends fail modal -->

    <!-- Main JS -->
    <script src="public/js/main.min.js"></script>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <!-- Bootstrap JS -->
    <script src="public/js/bootstrap.min.js"></script>
    <!-- DataTable JS -->
    <script src="https://cdn.datatables.net/2.0.3/js/dataTables.js"></script>
    <script src="public/js/main.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            var cantidadAlertas = document.querySelector('input[name="numAlertas"]').value;

            for (var i = 0; i < cantidadAlertas; i++) {
                const radioButton = document.querySelector(`#en-proceso-${i}`);

                radioButton.addEventListener("change", function() {
                    const contador = this.id.split('-')[2];
                    const instruccionesDiv = document.querySelector(`#instruccion-${contador}`);

                    if (this.checked) {
                        instruccionesDiv.classList.remove('d-none');
                    } else {
                        instruccionesDiv.classList.add('d-none');
                    }
                });
            }
        });
    </script>




</body>

</html>
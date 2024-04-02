<?php

require '../../../utils/conexion_sql_azure.php';

require './utils/read/traerRespuestas.php';

// require './utils/read/traerPlanes.php';

// require './utils/read/traerCausas.php';

// require './utils/read/traerRespuestas.php';

?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PORTAL SEGUIMIENTO</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="../public/css/bootstrap.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="public/css/main.css">
    <!-- DataTable CSS -->
    <link rel="stylesheet" href="https://cdn.datatables.net/2.0.3/css/dataTables.dataTables.css" />
</head>

<body>
    <!-- Encabezado -->
    <div class="bg-header w-100">
        <header class="container">
            <div class="row">
                <div class="col p-3 text-center">
                    <img src="../img/logo-microleaks.png" alt="logo microleaks">
                </div>
            </div>
        </header>
    </div>
    <!-- Termina encabezado -->

    <!-- Principal -->
    <main class="container mt-5">
        <div class="row">
            <div class="col">
                <h1 class="text-center title">SEGUIMIENTO MICROLEAK | CAN</h1>
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
                                        <th>SEGUIMIENTO</th>
                                        <th>OBSERVACIONES</th>
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
                                            <td></td>
                                            <td></td>
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

                        <input type="hidden" value="<?php echo sizeof($datosAlerta); ?>" name="numItems" />

                        <div class="row justify-content-center mt-3">
                            <div class="col-12 col-lg-6">
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
    <footer class="container mt-5">
        <div class="row">
            <div class="col">
                <h6 class="fw-bold text-center"><?php echo date('Y') ?> Todos los derechos reservados | Grupo Bimbo</h6>
            </div>
        </div>
    </footer>
    <!-- Termina pie de página -->
    <!-- Pie de página -->

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

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <!-- Bootstrap JS -->
    <script src="../public/js/bootstrap.min.js"></script>
    <!-- DataTable JS -->
    <script src="https://cdn.datatables.net/2.0.3/js/dataTables.js"></script>
    <script src="./public/js/main.js"></script>
    <script>
    </script>

</body>

</html>
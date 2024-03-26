<?php

require '../../../utils/conexion_sql_azure.php';

require './utils/read/traerDatosAlerta.php';

require './utils/read/traerPlanes.php';

require './utils/read/traerCausas.php';

require './utils/read/traerRespuestas.php';

?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PORTAL ALERTA PREDICTIVA</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="../public/css/bootstrap.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="public/css/main.css">
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
                <h1 class="text-center title">MICROLEAK DE <?php if ($idTipo == 1) {
                                                                echo 'MATERIAS PRIMAS';
                                                            } else {
                                                                echo 'SUBENSAMBLES';
                                                            } ?> | CAN</h1>
            </div>
        </div>
        <div class="row justify-content-md-center mt-3">
            <div class="col-12">
                <div class="card shadow border border-top-0 border-end-0 border-bottom-0 border-main">
                    <form class="card-body" id="form" method="POST">
                        <div class=" row mb-3">
                            <div class="col">
                                <p class="fs-5">Planta: <?php echo $idPlanta . '_' . $nombrePlanta; ?></p>
                            </div>
                            <div class="col">
                                <p class="fs-5 text-center"></p>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col">
                                <p class="fs-5 ">Año semana: <?php echo $semanaAlerta; ?></p>
                            </div>
                            <div class="col">
                                <p class="fs-5 text-center"></p>
                            </div>
                        </div>
                        <!-- <div class="row mb-3">
                            <div class="col">
                                <p class="fs-5 ">Fecha Respuesta: <?php //echo !empty($respuesta) ? $respuesta['fechaRespuesta'] : date('Y-m-d'); 
                                                                    ?></p>
                            </div>
                            <div class="col">
                                <p class="fs-5 text-center"></p>
                            </div>
                        </div> -->
                        <div class="table-responsive">
                            <table class="table">
                                <thead class="table-light">
                                    <tr>
                                        <th>FECHA DE EMISIÓN</th>
                                        <th>CAUSA</th>
                                        <th>PLAN DE ACCIÓN</th>
                                        <th>FECHA DE RESOLUCIÓN</th>
                                        <th>COMENTARIOS (MÁXIMO 255 CARÁCTERES)</th>
                                    </tr>
                                </thead>
                                <tbody class="table-group-divider">
                                    <td style="vertical-align: middle;text-align:center;"><?php echo $fechaEmision ?></td>
                                    <td style="vertical-align: middle;text-align:center;">
                                        <select class="form-select" name="causas" id="causas" onchange="selectValue(this.value)">
                                            <option value="disabled" selected disabled>Seleccione una causa de no posteo</option>
                                            <?php
                                            $options = '';
                                            foreach ($causas as $causa) {
                                                $options = $options . '<option value=' . $causa['id'] . '>' . $causa['causa'] . '</option>';
                                            }
                                            echo $options;
                                            ?>
                                        </select>
                                    </td>
                                    <td style="vertical-align: middle;text-align:center;" id="planAccion"> <input class="form-control" type="text"> </td>
                                    <td style="vertical-align: middle;text-align:center;" id="fechaResolucion"> <input class="form-control" type="date"> </td>
                                    <td style="vertical-align: middle;text-align:center;" id="comentario"> <input class="form-control" type="text"> </td>
                                </tbody>
                            </table>
                        </div>

                        <input type="hidden" value="<?php echo $_GET['idPlanta']; ?>" name="idPlanta" />
                        <input type="hidden" value="<?php echo $_GET['tipoAlerta']; ?>" name="tipoAlerta" />
                        <input type="hidden" value="<?php echo $_GET['semanaAlerta']; ?>" name="semanaAlerta" />
                        <input type="hidden" value="<?php echo $_GET['fechaEmision']; ?>" name="fechaEmision" />
                        <input type="hidden" value="<?php echo date('Y-m-d'); ?>" name="fechaRegistro" />

                        <div class="row justify-content-center mt-3">
                            <div class="col-12 col-lg-6">
                                <textarea class="d-none form-control" name="otros" id="otros" cols="30" rows="5" placeholder="Escriba una causa de No Posteo"></textarea>
                            </div>
                        </div>
                        <div class="row justify-content-center mt-3">
                            <div class="col-12 col-lg-6">
                                <?php
                                // if (sizeof($datosAlerta) !== sizeof($respuestas)) {
                                ?>
                                <button type="submit" class="btn btn-main w-100 fw-bold" id="btn-submit">Enviar Registro</button>
                                <?php
                                // }
                                ?>
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
    <script src="./public/js/main.js"></script>
    <script>
        const otros = document.querySelector('#otros')
        const selectValue = (selectedValue) => {

            if (selectedValue == 20) {
                otros.classList.remove("d-none")
            } else {
                otros.classList.add("d-none")
            }
        }
    </script>

</body>

</html>
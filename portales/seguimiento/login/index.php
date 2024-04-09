<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Sistema web Portal de seguimiento Microleaks">
    <meta name="author" content="CAN Analítica">
    <link rel="icon" type="image/png" href="img/BimboLogo.png">
    <title>Login - Portal de seguimiento Microleaks</title>
    <!-- Custom fonts for this template-->
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">
    <!-- Custom styles for this template-->
    <link href="css/sb-admin-2.min.css" rel="stylesheet">
</head>

<body class="bg-gradient-primary">
    <div class="container">
        <!-- Outer Row -->
        <div class="row justify-content-center">
            <div class="col-xl-6 col-lg-9 col-md-9">
                <div class="card o-hidden border-0 shadow-lg my-5">
                    <div class="card-body p-0">
                        <!-- Nested Row within Card Body -->
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="p-5">
                                    <div class="text-center">
                                        <img src="img/BimboLogo.png" width="60%" height="60%">&nbsp;&nbsp;&nbsp;&nbsp;
                                        <!-- <img src="img/can_logo.png" width="50%" height="50%"> -->
                                        <hr>
                                        <br>
                                        <h1 class="h4 text-gray-900 mb-4">Seguimiento Microleaks</h1>
                                        <br>
                                    </div>
                                    <form class="user" method="POST" action="valida_login.php" name="form_login" autocomplete="off">
                                        <div class="form-group">
                                            <input type="text" name="correo" class="form-control form-control-user" id="correo" placeholder="Ingresa tu correo" autocomplete="off" autofocus>
                                        </div>
                                        <div class="form-group">
                                            <input type="password" name="no_colaborador" class="form-control form-control-user" id="no_colaborador" placeholder="Ingresa tu número de colaborador" autocomplete="off">
                                        </div>
                                        <button class="btn btn-primary btn-user btn-block" type="submit">Iniciar sesión</button>
                                    </form>
                                    <div class="text-center">

                                    </div>
                                </div>
                                <hr>
                                <div class="text-center">
                                    <small>Desarrollado por CAN Analítica &copy; <?php echo date("Y"); ?><br></small><br>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</body>

</html>
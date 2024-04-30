<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Materias Primas y SubEnsambles</title>
  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="../public/css/bootstrap.min.css">
  <!-- Custom CSS -->
  <link rel="stylesheet" href="./public/css/main.css">
</head>

<body>
  <!-- Encabezado -->
  <div class="bg-header w-100">
    <header class="container">
      <div class="row">
        <div class="col p-3 text-center">
          <img src="../../img/logo-microleaks.png" alt="logo microleaks">
        </div>
      </div>
    </header>
  </div>
  <!-- Termina encabezado -->

  <!-- Principal -->
  <main class="container mt-5">
    <div class="row">
      <div class="col text-center">
        <div class="card shadow">
          <div class="card-body">
            <img src="../../img/checked.png" alt="exitoso" height="250" width="250">
            <h1 class="fw-bold mt-3">Registro Guardado Correctamente</h1>
            <div class="row justify-content-center mt-3">
              <div class="col-12 col-lg-6">
                <a href="./index.php">
                  <button type="submit" class="btn btn-main w-100 fw-bold" id="btn-submit">Volver</button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <!-- Termina principal -->

  <!-- Pie de página -->
  <footer class="container mt-5">
    <div class="row">
      <div class="col">
        <h6 class="fw-bold text-center"><?php echo date('Y'); ?> Todos los derechos reservados | Grupo Bimbo | Analítica Avanzada</h6>
      </div>
    </div>
  </footer>
  <!-- Termina pie de página -->

  <!-- Bootstrap JS -->
  <script src="../public/js/bootstrap.min.js"></script>
</body>

</html>
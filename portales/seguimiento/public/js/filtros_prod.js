function traeMarcas() {
  $('#familia').empty();
  $('#producto').empty();

  var region = document.getElementById('selectRegion') || false
  if (region) {
    region = document.getElementById('selectRegion').value;
  } else {
    region = 0;
  }

  var gerencia = document.getElementById('selectGerencia') || false
  if (gerencia) {
    gerencia = document.getElementById('selectGerencia').value;
  } else {
    gerencia = 0;
  }

  var division = document.getElementById('selectDivision') || false
  if (division) {
    division = document.getElementById('selectDivision').value;
  } else {
    division = 0;
  }

  var ceve = document.getElementById('selectCeve') || false
  if (ceve) {
    ceve = document.getElementById('selectCeve').value;
  } else {
    ceve = 0;
  }

  var ruta = document.getElementById('selectRuta') || false
  if (ruta) {
    ruta = document.getElementById('selectRuta').value;
  } else {
    ruta = 0;
  }
  var categoria = document.getElementById('selectCategoria').value;

  $.ajax({
    url: "utils/filters/trae_marcas.php",
    dataType: "html",
    /* JSON, HTML, SJONP... */
    type: "POST",
    /* POST or GET; Default = GET */
    data: {
      categoria: categoria,
      region: region,
      gerencia: gerencia,
      division: division,
      ceve: ceve,
      ruta: ruta
    },
    beforeSend: function (xhr) {
      $("#marca").empty();
    },
    success: function (response) {
      $("#marca").append(response);
      loading_modal.show();
      traeIndicadores();
      $("#eliminarFiltros").css("display", "block");
    },
  });
}

function traeFamilias() {
  $('#producto').empty();
  
  var region = document.getElementById('selectRegion') || false
  if (region) {
    region = document.getElementById('selectRegion').value;
  } else {
    region = 0;
  }

  var gerencia = document.getElementById('selectGerencia') || false
  if (gerencia) {
    gerencia = document.getElementById('selectGerencia').value;
  } else {
    gerencia = 0;
  }

  var division = document.getElementById('selectDivision') || false
  if (division) {
    division = document.getElementById('selectDivision').value;
  } else {
    division = 0;
  }

  var ceve = document.getElementById('selectCeve') || false
  if (ceve) {
    ceve = document.getElementById('selectCeve').value;
  } else {
    ceve = 0;
  }

  var ruta = document.getElementById('selectRuta') || false
  if (ruta) {
    ruta = document.getElementById('selectRuta').value;
  } else {
    ruta = 0;
  }
  var categoria = document.getElementById('selectCategoria').value;
  var marca = document.getElementById('selectMarca').value;

  $.ajax({
    url: "utils/filters/trae_familia.php",
    dataType: "html",
    /* JSON, HTML, SJONP... */
    type: "POST",
    /* POST or GET; Default = GET */
    data: {
      categoria: categoria,
      marca: marca,
      region: region,
      gerencia: gerencia,
      division: division,
      ceve: ceve,
      ruta: ruta
    },
    beforeSend: function (xhr) {
      $("#familia").empty();
    },
    success: function (response) {
      $("#familia").append(response);
      loading_modal.show();
      traeIndicadores();
    },
  });
}

function traeProductos() {
  var region = document.getElementById('selectRegion') || false
  if (region) {
    region = document.getElementById('selectRegion').value;
  } else {
    region = 0;
  }

  var gerencia = document.getElementById('selectGerencia') || false
  if (gerencia) {
    gerencia = document.getElementById('selectGerencia').value;
  } else {
    gerencia = 0;
  }

  var division = document.getElementById('selectDivision') || false
  if (division) {
    division = document.getElementById('selectDivision').value;
  } else {
    division = 0;
  }

  var ceve = document.getElementById('selectCeve') || false
  if (ceve) {
    ceve = document.getElementById('selectCeve').value;
  } else {
    ceve = 0;
  }

  var ruta = document.getElementById('selectRuta') || false
  if (ruta) {
    ruta = document.getElementById('selectRuta').value;
  } else {
    ruta = 0;
  }
  var categoria = document.getElementById('selectCategoria').value;
  var marca = document.getElementById('selectMarca').value;
  var familia = document.getElementById('selectFamilia').value;

  $.ajax({
    url: "utils/filters/trae_productos.php",
    dataType: "html",
    /* JSON, HTML, SJONP... */
    type: "POST",
    /* POST or GET; Default = GET */
    data: {
      categoria: categoria,
      marca: marca,
      familia: familia,
      region: region,
      gerencia: gerencia,
      division: division,
      ceve: ceve,
      ruta: ruta
    },
    beforeSend: function (xhr) {
      $("#producto").empty();
    },
    success: function (response) {
      $("#producto").append(response);
      loading_modal.show();
      traeIndicadores();
    },
  });
}

function traeGerencias() { 
  document.getElementById('selectCategoria').value = 0;
  if(document.getElementById('selectMarca')) document.getElementById('selectMarca').value = 0;
  if(document.getElementById('selectFamilia')) document.getElementById('selectFamilia').value = 0;
  if(document.getElementById('selectProducto')) document.getElementById('selectProducto').value = 0;

  $('#division').empty();
  $('#ceve').empty();
  $('#ruta').empty();

  var region = document.getElementById('selectRegion').value;

  $.ajax({
    url: "utils/filters/trae_gerencias_prod.php",
    dataType: "html",
    /* JSON, HTML, SJONP... */
    type: "POST",
    /* POST or GET; Default = GET */
    data: {
      region: region
    },
    beforeSend: function (xhr) {
      $("#gerencia").empty();
    },
    success: function (response) {
      $("#gerencia").append(response);
      loading_modal.show();
      traeIndicadores(); 
      traeCategoria();
      $("#eliminarFiltros").css("display", "block");
    },
  });
}

function traeDivisiones() {
  document.getElementById('selectCategoria').value = 0;
  if(document.getElementById('selectMarca')) document.getElementById('selectMarca').value = 0;
  if(document.getElementById('selectFamilia')) document.getElementById('selectFamilia').value = 0;
  if(document.getElementById('selectProducto')) document.getElementById('selectProducto').value = 0;

  $('#ceve').empty();
  $('#ruta').empty();

  var gerencia = document.getElementById('selectGerencia').value;

  $.ajax({
    url: "utils/filters/trae_divisiones_prod.php",
    dataType: "html",
    /* JSON, HTML, SJONP... */
    type: "POST",
    /* POST or GET; Default = GET */
    data: {
      gerencia: gerencia
    },
    beforeSend: function (xhr) {
      $("#division").empty();
      loading_modal.show();
    },
    success: function (response) {
      $("#division").append(response);
      traeIndicadores();
      traeCategoria(); 
    },
  });
}

function traeCeves() {
  document.getElementById('selectCategoria').value = 0;
  if(document.getElementById('selectMarca')) document.getElementById('selectMarca').value = 0;
  if(document.getElementById('selectFamilia')) document.getElementById('selectFamilia').value = 0;
  if(document.getElementById('selectProducto')) document.getElementById('selectProducto').value = 0;

  $('#ruta').empty();

  var division = document.getElementById('selectDivision').value;

  $.ajax({
    url: "utils/filters/trae_ceves_prod.php",
    dataType: "html",
    /* JSON, HTML, SJONP... */
    type: "POST",
    /* POST or GET; Default = GET */
    data: {
      division: division
    },
    beforeSend: function (xhr) {
      $("#ceve").empty();
      loading_modal.show();
    },
    success: function (response) {
      $("#ceve").append(response);
      traeIndicadores();
      traeCategoria(); 
    },
  });
}

function traeRutas() {
  document.getElementById('selectCategoria').value = 0;
  if(document.getElementById('selectMarca')) document.getElementById('selectMarca').value = 0;
  if(document.getElementById('selectFamilia')) document.getElementById('selectFamilia').value = 0;
  if(document.getElementById('selectProducto')) document.getElementById('selectProducto').value = 0;

  var ceve = document.getElementById('selectCeve').value;
  var division = document.getElementById('selectDivision').value;
  var gerencia = document.getElementById('selectGerencia').value;
  
  $.ajax({
    url: "utils/filters/trae_rutas_prod.php",
    dataType: "html",
    /* JSON, HTML, SJONP... */
    type: "POST",
    /* POST or GET; Default = GET */
    data: {
      gerencia: gerencia,
      division: division,
      ceve: ceve
    },
    beforeSend: function (xhr) {
      $("#ruta").empty();
      loading_modal.show();
    },
    success: function (response) {
      $("#ruta").append(response);
      traeIndicadores();
      traeCategoria(); 
    },
  });
}

function selectRuta(){
  loading_modal.show();
  traeIndicadores();
  traeCategoria(); 
}

function selectProd(){
  loading_modal.show();
  traeIndicadores();
}

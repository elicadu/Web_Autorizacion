let nombre_responsable = document.getElementById('nombre_responsable').value;
let fecha_responsable = document.getElementById('fecha_responsable').value;

setTimeout(function buscar_auto() {

  document.getElementById('buscar_primero').addEventListener('click', buscar_auto);
  
  numero_solicitudes()
  numero_solicitudes_diarias()

  fetch('/consulta')
    .then(response => response.json())
    .then(data => {
      const id = data.id;
      const radicado = data.numero_radicado;
      const nombre = data.alistado_por; 
      const fecha = data.alistamiento;
      const por_alistaer = data.datetime;

      const fechaHora = new Date(fecha);
      const hora = fechaHora.getHours();
      const minutos = fechaHora.getMinutes();
      const segundos = fechaHora.getSeconds();
      const horaFormateada = hora + ":" + minutos + ":" + segundos;
      const dia = fechaHora.getDate();
      const mes = fechaHora.getMonth() + 1;
      const anio = fechaHora.getFullYear();
      const fechaFormateada = dia + "/" + mes + "/" + anio;

      const fechaHora2 = new Date(por_alistaer);
      const hora2 = fechaHora2.getHours();
      const minutos2 = fechaHora2.getMinutes();
      const segundos2 = fechaHora2.getSeconds();
      const horaFormateada2 = hora2 + ":" + minutos2 + ":" + segundos2;
      const dia2 = fechaHora2.getDate();
      const mes2 = fechaHora2.getMonth() + 1;
      const anio2 = fechaHora2.getFullYear();
      const fechaFormateada2 = dia2 + "/" + mes2 + "/" + anio2;
      
      if (nombre == null && fecha == null) {

      document.getElementById('nombre_responsable').value = "No Impreso";
        
      } else {

      document.getElementById('nombre_responsable').value = nombre;
      document.getElementById('fecha_responsable').value = fechaFormateada;
      document.getElementById('hora_responsable').value = horaFormateada;
      document.getElementById('fecha_solicitud').value = fechaFormateada2;
      document.getElementById('hora_solicitud').value = horaFormateada2;


      }


      document.getElementById('serial').value = id;
      document.getElementById('num_auto').value = radicado;

      const a = radicado.slice(-8);
      const b = radicado.slice(0, -8);
      const url = "https://genesis.cajacopieps.com/views/autorizaciones/formatoautorizacionPrint_ips.php?numero=" + a + "&ubicacion=" + b;

      const iframe_auto = document.getElementById("myIframe");
      const iframe_formu = document.getElementById("myIframe2");

      iframe_auto.src = url;

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "text/plain");
      myHeaders.append("Cookie", "PHPSESSID=tupmb6mo9amo6sathg5q47536i");

      const base_raw = "{\r\n\"function\": \"p_mostrar_autorizacion\",\r\n\"serial\": \"0000000000000\",\r\n\"nit\": \"900073223\"\r\n}";

      const objeto = JSON.parse(base_raw);

      objeto.serial = radicado;

      const raw = JSON.stringify(objeto);

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch("https://genesis.cajacopieps.com/api/api_qr.php", requestOptions)
        .then(response => response.json())
        .then(data => {
          const nombreArchivo = data["ARCHIVO"];

          // Aquí puedes utilizar la variable 'nombreArchivo' como desees
          iframe_formu.src = nombreArchivo;

        })
        .catch(error => console.log('error', error));

      // Aquí puedes manipular los datos recibidos y hacer lo que desees con ellos
      
    })
    .catch(error => {
      console.error('Error:', error);
    });
}, 1000);


/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */


document.getElementById('imprimir_auto').addEventListener('click', impri);

function impri(){
  
  const auto = document.getElementById('num_auto').value;
  document.getElementById('id_cedu').value = "";



  if (auto > 10000000 && auto < 10000000000000) {

    const modal = document.getElementById('conten_registro');
  const sect = document.getElementById('section');
  const inputfocus = document.getElementById('id_cedu');

  modal.style.display = 'flex';
  sect.style.opacity = '0.4';
  inputfocus.focus();

  document.getElementById('btn_aceptar').addEventListener('click', aceptar);

  const inputcode = document.getElementById('id_cedu');

  function inputHandler() {
    const valor = inputcode.value;
    if (/^\d{3}$/.test(valor)) {
      aceptar();
      inputcode.removeEventListener('input', inputHandler);
    }
  }
  
  inputcode.addEventListener('input', inputHandler);
  
let impreso = false;

function aceptar() {
  const id_cedula = document.getElementById('id_cedu').value;
  const auto = document.getElementById('num_auto').value;

  fetch(`/validacion?id_cedula=${id_cedula}`)
    .then(response => response.json())
    .then(data => {
      const modal = document.getElementById('conten_registro');
      const sect = document.getElementById('section');
      const text_error = document.getElementById('text_error');
      const text = document.getElementById('text');

      const id_cedu = data.id_cedu;
      const nombre = data.nombre;

      if (id_cedula == id_cedu) {
        modal.style.display = 'none';
        sect.style.opacity = '1';

        fetch(`/update?nombre=${nombre}&auto=${auto}`)
          .then(response => response.json());

        if (!impreso) {
          window.onafterprint = () => {
            impreso = true;
            window.onafterprint = null; // Limpiar el evento de impresión después de su ejecución
          };
          window.print();
        }
      } else {
        text.style.display = 'none';
        text_error.style.display = 'block';
        id_cedu.value = "";
      }
    });
}


  document.getElementById('btn_cancelar').addEventListener('click', cancelar);

  function cancelar(){

      const modal = document.getElementById('conten_registro');
      const sect = document.getElementById('section');
      const id_cedu = document.getElementById('id_cedu');


        modal.style.display = 'none';
        sect.style.opacity = '1';
        id_cedu.value = "";

  };

    
  } else {

    console.log('numero de autorizacion no valido');
    
  }

  
};


/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

document.addEventListener('keydown', function(event){
  if (event.keyCode == 39) {
    buscar_siguiente();
  }
})

function buscar_siguiente() {

  const id_serie = document.getElementById('serial').value;

  numero_solicitudes()
  numero_solicitudes_diarias()

  // Realizar la solicitud POST al servidor
  fetch(`/consulta?id_serie=${id_serie}`)
  .then(response => response.json())
  .then(data => {
    // Hacer algo con los datos recibidos
    const id = data.id;
    const radicado = data.numero_radicado;
    const nombre = data.alistado_por; 
    const fecha = data.alistamiento;
    const por_alistaer = data.datetime;

    document.getElementById('serial').value = id;
    document.getElementById('num_auto').value = radicado;

      const fechaHora = new Date(fecha);

      const hora = fechaHora.getHours();
      const minutos = fechaHora.getMinutes();
      const segundos = fechaHora.getSeconds();
      const horaFormateada = hora + ":" + minutos + ":" + segundos;
      const dia = fechaHora.getDate();
      const mes = fechaHora.getMonth() + 1;
      const anio = fechaHora.getFullYear();
      const fechaFormateada = dia + "/" + mes + "/" + anio;

      const fechaHora2 = new Date(por_alistaer);
      const hora2 = fechaHora2.getHours();
      const minutos2 = fechaHora2.getMinutes();
      const segundos2 = fechaHora2.getSeconds();
      const horaFormateada2 = hora2 + ":" + minutos2 + ":" + segundos2;
      const dia2 = fechaHora2.getDate();
      const mes2 = fechaHora2.getMonth() + 1;
      const anio2 = fechaHora2.getFullYear();
      const fechaFormateada2 = dia2 + "/" + mes2 + "/" + anio2;

      if (nombre == null && fecha == null) {

        document.getElementById('nombre_responsable').value = "No Impreso";
      document.getElementById('fecha_responsable').value = "";
      document.getElementById('hora_responsable').value = "";
        
      } else {

      document.getElementById('nombre_responsable').value = nombre;
      document.getElementById('fecha_responsable').value = fechaFormateada;
      document.getElementById('hora_responsable').value = horaFormateada;
      document.getElementById('fecha_solicitud').value = fechaFormateada2;
      document.getElementById('hora_solicitud').value = horaFormateada2;
      }

    const a = radicado.slice(-8);
    const b = radicado.slice(0, -8);
    const url = "https://genesis.cajacopieps.com/views/autorizaciones/formatoautorizacionPrint_ips.php?numero=" + a + "&ubicacion=" + b;
  
    const iframe_auto = document.getElementById("myIframe");
    const iframe_formu = document.getElementById("myIframe2");

    iframe_auto.src = url;

    console.log(url);

const myHeaders = new Headers();
myHeaders.append("Content-Type", "text/plain");
myHeaders.append("Cookie", "PHPSESSID=tupmb6mo9amo6sathg5q47536i");

const base_raw = "{\r\n\"function\": \"p_mostrar_autorizacion\",\r\n\"serial\": \"0000000000000\",\r\n\"nit\": \"900073223\"\r\n}";

const objeto = JSON.parse(base_raw);

objeto.serial = radicado;

const raw = JSON.stringify(objeto);


const requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://genesis.cajacopieps.com/api/api_qr.php", requestOptions)
  .then(response => response.json())  // Parsear la respuesta como JSON
  .then(data => {
    const nombreArchivo = data["ARCHIVO"];
    
    // Aquí puedes utilizar la variable 'nombreArchivo' como desees
    iframe_formu.src = nombreArchivo;

  })
  .catch(error => console.log('error', error));

    // Aquí puedes manipular los datos recibidos y hacer lo que desees con ellos
    
  })
  .catch(error => {
    console.error('Error:', error);
    // Manejar el error
  });


};


/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */


document.addEventListener('keydown', function(event){
  if (event.keyCode == 37) {
    buscar_atras();
  }
})

function buscar_atras() {

  const id_serie = document.getElementById('serial').value;

  numero_solicitudes()
  numero_solicitudes_diarias()

  // Realizar la solicitud POST al servidor
  fetch(`/consulta_atras?id_serie=${id_serie}`)
  .then(response => response.json())
  .then(data => {
    // Hacer algo con los datos recibidos
    const id = data.id;
    const radicado = data.numero_radicado;
    const nombre = data.alistado_por; 
    const fecha = data.alistamiento;
    const por_alistaer = data.datetime;

    document.getElementById('serial').value = id;
    document.getElementById('num_auto').value = radicado;

    const fechaHora = new Date(fecha);

      const hora = fechaHora.getHours();
      const minutos = fechaHora.getMinutes();
      const segundos = fechaHora.getSeconds();
      const horaFormateada = hora + ":" + minutos + ":" + segundos;
      const dia = fechaHora.getDate();
      const mes = fechaHora.getMonth() + 1;
      const anio = fechaHora.getFullYear();
      const fechaFormateada = dia + "/" + mes + "/" + anio;

      const fechaHora2 = new Date(por_alistaer);
      const hora2 = fechaHora2.getHours();
      const minutos2 = fechaHora2.getMinutes();
      const segundos2 = fechaHora2.getSeconds();
      const horaFormateada2 = hora2 + ":" + minutos2 + ":" + segundos2;
      const dia2 = fechaHora2.getDate();
      const mes2 = fechaHora2.getMonth() + 1;
      const anio2 = fechaHora2.getFullYear();
      const fechaFormateada2 = dia2 + "/" + mes2 + "/" + anio2;

      if (nombre == null && fecha == null) {

        document.getElementById('nombre_responsable').value = "No Impreso";
      document.getElementById('fecha_responsable').value = "";
      document.getElementById('hora_responsable').value = "";
        
      } else {

      document.getElementById('nombre_responsable').value = nombre;
      document.getElementById('fecha_responsable').value = fechaFormateada;
      document.getElementById('hora_responsable').value = horaFormateada;
      document.getElementById('fecha_solicitud').value = fechaFormateada2;
      document.getElementById('hora_solicitud').value = horaFormateada2;
      }

    const a = radicado.slice(-8);
    const b = radicado.slice(0, -8);
    const url = "https://genesis.cajacopieps.com/views/autorizaciones/formatoautorizacionPrint_ips.php?numero=" + a + "&ubicacion=" + b;
  
    const iframe_auto = document.getElementById("myIframe");
    const iframe_formu = document.getElementById("myIframe2");

    iframe_auto.src = url;

const myHeaders = new Headers();
myHeaders.append("Content-Type", "text/plain");
myHeaders.append("Cookie", "PHPSESSID=tupmb6mo9amo6sathg5q47536i");

const base_raw = "{\r\n\"function\": \"p_mostrar_autorizacion\",\r\n\"serial\": \"0000000000000\",\r\n\"nit\": \"900073223\"\r\n}";

const objeto = JSON.parse(base_raw);

objeto.serial = radicado;

const raw = JSON.stringify(objeto);


const requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://genesis.cajacopieps.com/api/api_qr.php", requestOptions)
  .then(response => response.json())  // Parsear la respuesta como JSON
  .then(data => {
    const nombreArchivo = data["ARCHIVO"];
    
    // Aquí puedes utilizar la variable 'nombreArchivo' como desees
    iframe_formu.src = nombreArchivo;

  })
  .catch(error => console.log('error', error));

    // Aquí puedes manipular los datos recibidos y hacer lo que desees con ellos
    
  })
  .catch(error => {
    console.error('Error:', error);
    // Manejar el error
  });


};


/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */


function buscar_ultimo() {

  const id_serie = document.getElementById('serial').value;

  numero_solicitudes()
  numero_solicitudes_diarias()

  // Realizar la solicitud POST al servidor
  fetch(`/consulta_ultima?id_serie=${id_serie}`)
  .then(response => response.json())
  .then(data => {
    // Hacer algo con los datos recibidos
    const id = data.id;
    const radicado = data.numero_radicado;
    const nombre = data.alistado_por; 
    const fecha = data.alistamiento;
    const por_alistaer = data.datetime;

    document.getElementById('serial').value = id;
    document.getElementById('num_auto').value = radicado;

    const fechaHora = new Date(fecha);

      const hora = fechaHora.getHours();
      const minutos = fechaHora.getMinutes();
      const segundos = fechaHora.getSeconds();
      const horaFormateada = hora + ":" + minutos + ":" + segundos;
      const dia = fechaHora.getDate();
      const mes = fechaHora.getMonth() + 1;
      const anio = fechaHora.getFullYear();
      const fechaFormateada = dia + "/" + mes + "/" + anio;

      const fechaHora2 = new Date(por_alistaer);
      const hora2 = fechaHora2.getHours();
      const minutos2 = fechaHora2.getMinutes();
      const segundos2 = fechaHora2.getSeconds();
      const horaFormateada2 = hora2 + ":" + minutos2 + ":" + segundos2;
      const dia2 = fechaHora2.getDate();
      const mes2 = fechaHora2.getMonth() + 1;
      const anio2 = fechaHora2.getFullYear();
      const fechaFormateada2 = dia2 + "/" + mes2 + "/" + anio2;

      if (nombre == null && fecha == null) {

        document.getElementById('nombre_responsable').value = "No Impreso";
      document.getElementById('fecha_responsable').value = "";
      document.getElementById('hora_responsable').value = "";
        
      } else {

      document.getElementById('nombre_responsable').value = nombre;
      document.getElementById('fecha_responsable').value = fechaFormateada;
      document.getElementById('hora_responsable').value = horaFormateada;
      document.getElementById('fecha_solicitud').value = fechaFormateada2;
      document.getElementById('hora_solicitud').value = horaFormateada2;
      }

    const a = radicado.slice(-8);
    const b = radicado.slice(0, -8);
    const url = "https://genesis.cajacopieps.com/views/autorizaciones/formatoautorizacionPrint_ips.php?numero=" + a + "&ubicacion=" + b;
  
    const iframe_auto = document.getElementById("myIframe");
    const iframe_formu = document.getElementById("myIframe2");

    iframe_auto.src = url;

const myHeaders = new Headers();
myHeaders.append("Content-Type", "text/plain");
myHeaders.append("Cookie", "PHPSESSID=tupmb6mo9amo6sathg5q47536i");

const base_raw = "{\r\n\"function\": \"p_mostrar_autorizacion\",\r\n\"serial\": \"0000000000000\",\r\n\"nit\": \"900073223\"\r\n}";

const objeto = JSON.parse(base_raw);

objeto.serial = radicado;

const raw = JSON.stringify(objeto);


const requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://genesis.cajacopieps.com/api/api_qr.php", requestOptions)
  .then(response => response.json())  // Parsear la respuesta como JSON
  .then(data => {
    const nombreArchivo = data["ARCHIVO"];
    
    // Aquí puedes utilizar la variable 'nombreArchivo' como desees
    iframe_formu.src = nombreArchivo;

  })
  .catch(error => console.log('error', error));

    // Aquí puedes manipular los datos recibidos y hacer lo que desees con ellos
    
  })
  .catch(error => {
    console.error('Error:', error);
    // Manejar el error
  });


};


/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */


function numero_solicitudes() {
  fetch('/por_alistar')
  .then(response => response.json())
  .then(data => {

    const alistado = data.count;

    document.getElementById('alistado_total').value = alistado;

  })
}

setInterval(numero_solicitudes, 20000);

function numero_solicitudes_diarias() {
  fetch('/por_alistar_dia')
  .then(response => response.json())
  .then(data => {

    const alistado = data.count;

    document.getElementById('alistado_dia').value = alistado;

  })
}

setInterval(numero_solicitudes_diarias, 20000);
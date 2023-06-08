function generarURL() {

      document.getElementById('nombre_responsable').value = "";
      document.getElementById('fecha_responsable').value = "";
      document.getElementById('hora_responsable').value = "";
      document.getElementById('fecha_solicitud').value = "";
      document.getElementById('hora_solicitud').value = "";

  const auto = document.getElementById('num_auto').value;

  if (auto > 10000000 && auto < 10000000000000) {

    fetch(`/consulta_api?auto=${auto}`)
    .then(response => response.json())
    .then(data => {

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
      document.getElementById('fecha_solicitud').value = fechaFormateada2;
      document.getElementById('hora_solicitud').value = horaFormateada2;
        
      } else {

      document.getElementById('nombre_responsable').value = nombre;
      document.getElementById('fecha_responsable').value = fechaFormateada;
      document.getElementById('hora_responsable').value = horaFormateada;
      document.getElementById('fecha_solicitud').value = fechaFormateada2;
      document.getElementById('hora_solicitud').value = horaFormateada2;


      }

    })

    const numero = document.getElementById("num_auto").value;
    const a = numero.slice(-8);
    const b = numero.slice(0, -8);
    const url = "https://genesis.cajacopieps.com/views/autorizaciones/formatoautorizacionPrint_ips.php?numero=" + a + "&ubicacion=" + b;
  
    const iframe_auto = document.getElementById("myIframe");
    const iframe_formu = document.getElementById("myIframe2");

    iframe_auto.src = url;

const myHeaders = new Headers();
myHeaders.append("Content-Type", "text/plain");
myHeaders.append("Cookie", "PHPSESSID=tupmb6mo9amo6sathg5q47536i");

const base_raw = "{\r\n\"function\": \"p_mostrar_autorizacion\",\r\n\"serial\": \"0000000000000\",\r\n\"nit\": \"900073223\"\r\n}";

const objeto = JSON.parse(base_raw);

objeto.serial = numero;

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
  
  }else {

    console.log('no se puede');

    }

};
function generarURL() {

      document.getElementById('nombre_responsable').value = "";
      document.getElementById('fecha_responsable').value = "";
      document.getElementById('hora_responsable').value = "";

  const auto = document.getElementById('num_auto').value;

  if (auto > 10000000 && auto < 10000000000000) {

    const numero = document.getElementById("num_auto").value;
    const a = numero.slice(-8);
    const b = numero.slice(0, -8);
    const url = "https://genesis.cajacopieps.com/views/autorizaciones/formatoautorizacionPrint_ips.php?numero=" + a + "&ubicacion=" + b;
  
    const iframe_auto = document.getElementById("myIframe");
    const iframe_formu = document.getElementById("myIframe2");

    iframe_auto.src = url;
    console.log(a);
    console.log(b);

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
    console.log(nombreArchivo);
    // Aquí puedes utilizar la variable 'nombreArchivo' como desees
    iframe_formu.src = nombreArchivo;
  })
  .catch(error => console.log('error', error));
  
  }else {

    console.log('no se puede');

    }

};
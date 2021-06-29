
import { Anuncio_Auto } from "./anuncio_auto.js";

const elementoContenedor = document.getElementById("divLista");

//const select=document.getElementsByTagName('select')[0];
const select = document.getElementById('selectTransaccion');

const delay = 1000;
let anuncios = [];
let boton = null;
let checkboxElements = new Array();


window.addEventListener("DOMContentLoaded", () => {

  getAnuncios();

  document.forms[0].addEventListener("submit", HandlerSubmit);

  //PROBLEMA: no pude hacer funcionar bien el select con otro evento
  select.addEventListener("click", HandlerChange);

  document.addEventListener("click", HandlerClick);

  let elementosInput = document.getElementsByTagName('input');

  for (let i = 0; i < elementosInput.length; i++) {

    if (elementosInput[i].type == 'checkbox') {
      checkboxElements.push(elementosInput[i]);
    }
  }
});

function HandlerChange(e) {

  let seleccion = select.value;

  if (seleccion !== "Todos") {
    const filter = anuncios.filter(e => e.transaccion === seleccion);
    console.log(filter);

    agregarSpinner();

    setTimeout(() => {
      HandlerLoadList(filter);
      eliminarSpinner();
    }, delay);

    document.getElementById("promedio").value = CalculoPromedio(filter);
  } else {
    getAnuncios();
    let aux = document.getElementById("promedio").value = CalculoPromedio(anuncios);
  }
}

function CalculoPromedio(obj) {

  let divisor = obj.length

  const mapeadoPrecio = obj.map(e => e.precio);

  const reduce = mapeadoPrecio.reduce((prev, next) => Number(prev) + Number(next));

  return reduce / divisor;
}

function HandlerSubmit(e) {

  e.preventDefault();

  const frm = e.target;

  if (frm.id.value) {
    const modificoAnuncio = new Anuncio_Auto(
      parseInt(frm.id.value), frm.titulo.value, frm.transaccion.value,
      frm.descripcion.value, frm.precio.value, frm.puertas.value, frm.km.value, frm.potencia.value);

    agregarSpinner();

    setTimeout(() => {
      updateAnuncio(modificoAnuncio);
      eliminarSpinner();
    }, delay
    );

    frm.id.value = "";
  } else {
    const nuevoAnuncio = new Anuncio_Auto(Date.now(), frm.titulo.value, frm.transaccion.value,
      frm.descripcion.value, frm.precio.value, frm.puertas.value, frm.km.value, frm.potencia.value);

    agregarSpinner();
    setTimeout(() => {
      altaAnuncioCar(nuevoAnuncio);
      eliminarSpinner();
    }, delay
    );
  }
  limpiarForm(frm);
}


  // function mapeoMostrar(nameCol) {
  //   arrTd.map((e) => {
  //     if (e.id === nameCol) {
  //       e.hidden = false;
  //     }
  //   });
  // }

function filtrarColumnas(checkBoxSel) {
// falto armar el map en una funcion
  let thAll = document.querySelectorAll('th');
  let tdAll = document.querySelectorAll('td');

  let arrTd = [...tdAll];
  let arrTh = [, ...thAll];

  arrTd.map((e) => { e.hidden = true });
  arrTh.map((e) => { e.hidden = true });

  for (let i = 0; i < checkBoxSel.length; i++) {
    //console.log(checkBoxSel.length)

    switch (checkBoxSel[i]) {

      case "Titulo":
        document.getElementById("titulo").hidden = false; // lo traigo asi por el th
        arrTd.map((e) => {
          if (e.id === "titulo") {
            e.hidden = false;
          }
        });
        break;

      case "Transaccion":
        document.getElementById("transaccion").hidden = false;
        arrTd.map((e) => {
          if (e.id === "transaccion") {
            e.hidden = false;
          }
        });
        break;

      case "Descripcion":
        document.getElementById("descripcion").hidden = false;
        arrTd.map((e) => {
          if (e.id === "descripcion") {
            e.hidden = false;
          }
        });
        break;

      case "Precio":
        document.getElementById("precio").hidden = false;
        arrTd.map((e) => {
          if (e.id === "precio") {
            e.hidden = false;
          }
        });
        break;

      case "Puertas":
        document.getElementById("puertas").hidden = false;
        arrTd.map((e) => {
          if (e.id === "puertas") {
            e.hidden = false;
          }
        });
        break;

      case "Km":
        document.getElementById("km").hidden = false;
        arrTd.map((e) => {
          if (e.id === "km") {
            e.hidden = false;
          }
        });
        break;

      case "Potencia":
        document.getElementById("potencia").hidden = false;
        arrTd.map((e) => {
          if (e.id === "potencia") {
            e.hidden = false;
          }
        });
        break;
    }
  }
}

function HandlerClick(e) {

  if (e.target.matches("select")) {

    //console.log(e.target.value);
  }

  if (e.target.matches("#box")) {
    let checkBoxSel = new Array();

    for (let i = 0; i < checkboxElements.length; i++) {

      if (checkboxElements[i].checked == true) {
        checkBoxSel.push(checkboxElements[i].name);
      }
    }
    filtrarColumnas(checkBoxSel);
  }

  if (e.target.matches("td")) {

    let id = e.target.parentNode.dataset.id;
    CargarForm(id);
  } else if (e.target.matches("#btnDelete")) {
    let id = parseInt(parseInt(document.forms[0].id.value));

    console.log(id);

    if (confirm("¿Desea borrar este anuncio?")) {

      // anuncios.splice(anuncios.findIndex((elemento) => elemento.id == id), 1);

      deleteAnuncio(id);

      agregarSpinner();

      setTimeout(() => {
        HandlerLoadList();
        eliminarSpinner();
      }, delay);
    }

    limpiarForm(document.forms[0]);

    document.getElementById("btnSubmit").value = "Guardar";

    document.getElementById("btnDelete").classList.add("oculto");
  }
}

function CargarForm(id) {

  let Anuncio = null;

  const { titulo, transaccion, descripcion, precio, puertas, km, potencia } = anuncios.filter(p => p.id === parseInt(id))[0];

  const myFrm = document.forms[0];
  myFrm.titulo.value = titulo;
  myFrm.transaccion.value = transaccion;
  myFrm.descripcion.value = descripcion;
  myFrm.precio.value = precio;
  myFrm.puertas.value = puertas;
  myFrm.km.value = km;
  myFrm.potencia.value = potencia;
  myFrm.id.value = id;

  const btn = document.getElementById("btnSubmit").value = "Modificar";

  document.getElementById("btnDelete").classList.remove("oculto");
}

function limpiarForm(frm) {
  frm.reset();
}

function agregarSpinner() {
  let spinner = document.createElement("img");
  spinner.setAttribute("src", "./assets/sp.gif");
  spinner.setAttribute("alt", "imagen spinner");

  document.getElementById("spinner-container").appendChild(spinner);
}

function eliminarSpinner() {
  document.getElementById("spinner-container").innerHTML = "";
}

function HandlerLoadList(e) {

  renderizarLista(CrearTabla(e), elementoContenedor);
  // const emisor = e.target;
  // emisor.textContent = "eliminar lista";
  //  emisor.removeEventListener("click", HandlerLoadList);
  //  emisor.addEventListener("click",HandlerDeleteList);
}

function CrearTabla(items, contenedor) {
  const tabla = document.createElement("table");
  tabla.appendChild(crearTHead(items[0]));
  tabla.appendChild(crearTBody(items));
  return tabla;
}

function crearTHead(item) {

  const thead = document.createElement("thead");

  const tr = document.createElement("tr");

  for (const key in item) {
    if (key != "id") {

      const th = document.createElement("th");

      // no llegué a armar el switch
      if (key == "titulo") {
        th.setAttribute("id", key);
      } else if (key == "transaccion") {
        th.setAttribute("id", key);
      } else if (key == "descripcion") {
        th.setAttribute("id", key);
      } else if (key == "precio") {
        th.setAttribute("id", key);
      } else if (key == "puertas") {
        th.setAttribute("id", key);
      } else if (key == "km") {
        th.setAttribute("id", key);
      } else if (key == "potencia") {
        th.setAttribute("id", key);
      }
      th.textContent = key;

      tr.appendChild(th);

    }

  }

  thead.appendChild(tr);
  return thead;
}

function crearTBody(items) {
  const tbody = document.createElement("tbody");

  items.forEach(items => {
    const tr = document.createElement("tr");
    for (const key in items) {
      if (key === "id") {
        tr.setAttribute("data-id", items[key]);
      } else {
        const td = document.createElement("td");

        // idem
        if (key == "titulo") {
          td.setAttribute("id", key);
        } else if (key == "transaccion") {
          td.setAttribute("id", key);
        } else if (key == "descripcion") {
          td.setAttribute("id", key);
        } else if (key == "precio") {
          td.setAttribute("id", key);
        } else if (key == "puertas") {
          td.setAttribute("id", key);
        } else if (key == "km") {
          td.setAttribute("id", key);
        } else if (key == "potencia") {
          td.setAttribute("id", key);
        }
        //   td.addEventListener("click", handlerSelector);
        td.textContent = items[key];
        tr.appendChild(td);

      }
    }

    tbody.appendChild(tr);

  });
  return tbody;
}

function renderizarLista(lista, contenedor) {

  while (contenedor.hasChildNodes()) {

    contenedor.removeChild(contenedor.firstChild);
  }

  if (lista) {
    contenedor.appendChild(lista);
  }
}

/////////// funciones AJAX ///////////////////////////////////////////////

const getAnuncios = () => {

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {

    if (xhr.readyState == 4) {

      if (xhr.status >= 200 && xhr.status < 299) {
        anuncios = JSON.parse(xhr.responseText);
        console.log(anuncios);
        HandlerLoadList(anuncios);
      } else {
        const statusText = xhr.statusText || "Ocurrio un error";
        console.log(`Error: ${xhr.status} : ${statusText}`);
      }
    } else {
    }
  };

  xhr.open("GET", "http://localhost:3000/anuncios/");
  xhr.send();
};

const altaAnuncioCar = (obj) => {

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {

    if (xhr.readyState == 4) {

      if (xhr.status >= 200 && xhr.status < 299) {
        obj = JSON.parse(xhr.responseText);

      } else {
        const statusText = xhr.statusText || "Ocurrio un error";
        console.log(`Error: ${xhr.status} : ${statusText}`);
      }
      // document.querySelector(".spinner").innerHTML = "";
    } else {


    }
  };
  xhr.open("POST", "http://localhost:3000/anuncios/");
  //seteo cabecera 
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8")
  xhr.send(JSON.stringify(obj));
};


const updateAnuncio = (obj) => {

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {

    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 299) {

      } else {
        const statusText = xhr.statusText || "Ocurrio un error";
        console.log(`Error: ${xhr.status} : ${statusText}`);
      }
      //document.querySelector(".spinner").innerHTML = "";
    } else {

      // document.querySelector(".spinner").appendChild(createSpinner());
    }
  };
  xhr.open("PUT", "http://localhost:3000/anuncios/" + obj.id);
  //seteo cabecera MIME types
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8")
  xhr.send(JSON.stringify(obj));
};


const deleteAnuncio = (id) => {

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {

    if (xhr.readyState == 4) {

      if (xhr.status >= 200 && xhr.status < 299) {
        // data = JSON.parse(xhr.responseText);

      } else {
        const statusText = xhr.statusText || "Ocurrio un error";
        console.log(`Error: ${xhr.status} : ${statusText}`);
      }
    } else {

    }
  };
  xhr.open("DELETE", "http://localhost:3000/anuncios/" + id);
  //seteo cabecera MIME types
  //xhr.setRequestHeader("Content-Type","application/json;charset=utf-8")
  xhr.send();
};
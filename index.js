const url =
  "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

const atraparJson = fetch(url).then((res) => res.json());

//Punto A

const punto1 = async () => {
  const x = await atraparJson;
  return x;
};

punto1().then((json) => {
  const cuerpotabla = document.getElementById("cuerpoTabla1");

  for (let i = 0; i < json.length; i++) {
    const fila = document.createElement("tr");
    if (json[i].squirrel == true) {
      fila.className = "table-danger";
    }
    cuerpotabla.appendChild(fila);
    const num = document.createElement("th");
    num.textContent = i + 1;
    fila.appendChild(num);

    const eventos = document.createElement("td");
    let eventosTxt = "";
    for (let j = 0; j < json[i].events.length; j++) {
      if (j == 0) {
        eventosTxt += json[i].events[j];
      } else {
        eventosTxt += ", " + json[i].events[j];
      }
    }
    eventos.textContent = eventosTxt;

    fila.appendChild(eventos);

    const squirrel = document.createElement("td");
    squirrel.textContent = json[i].squirrel;
    fila.appendChild(squirrel);
  }
});

//Punto B

const punto2 = async () => {
  const x = await atraparJson;
  return x;
};

punto2().then((json) => {
  let contadorArdilla = 0,
    contadorNoArdilla = 0,
    tp = 0,
    fp = 0,
    fn = 0,
    tn = 0;

  let mapContadorEventos = new Map();

  let diccionario = [];

  for (let i = 0; i < json.length; i++) {
    let dia = json[i];

    for (let j = 0; j < dia.events.length; j++) {
      let evento = dia.events[j];

      if (diccionario.includes(evento) == false) {
        diccionario.push(evento);
      }

      let keyEventosSi = evento + 1;
      let keyEventoNo = evento + 0;

      if (dia.squirrel == true) {
        if (mapContadorEventos.has(keyEventosSi)) {
          mapContadorEventos.set(
            keyEventosSi,
            mapContadorEventos.get(keyEventosSi) + 1
          );
        } else {
          mapContadorEventos.set(keyEventosSi, 1);
        }

        if (!mapContadorEventos.has(keyEventoNo)) {
          mapContadorEventos.set(keyEventoNo, 0);
        }
      } else {
        if (mapContadorEventos.has(keyEventoNo)) {
          mapContadorEventos.set(
            keyEventoNo,
            mapContadorEventos.get(keyEventoNo) + 1
          );
        } else {
          mapContadorEventos.set(keyEventoNo, 1);
        }

        if (!mapContadorEventos.has(keyEventosSi)) {
          mapContadorEventos.set(keyEventosSi, 0);
        }
      }
    }

    if (dia.squirrel == true) {
      contadorArdilla += 1;
    } else {
      contadorNoArdilla += 1;
    }
  }

  const cuerpotabla = document.getElementById("cuerpoTabla2");

  for (let i = 0; i < diccionario.length; i++) {
    evento = diccionario[i];

    tp = parseFloat(mapContadorEventos.get(evento + 1));
    fn = parseFloat(mapContadorEventos.get(evento + 0));
    fp = contadorArdilla - tp;
    tn = contadorNoArdilla - fn;

    let mcc =
      (tp * tn - fp * fn) /
      Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn));

    const fila = document.createElement("tr");
    cuerpotabla.appendChild(fila);

    const num = document.createElement("th");
    num.textContent = i + 1;
    fila.appendChild(num);

    const eventos = document.createElement("td");
    eventos.textContent = evento;
    fila.appendChild(eventos);

    const correlation = document.createElement("td");
    correlation.textContent = mcc;
    fila.appendChild(correlation);
  }

  sortTablaPorCorrelacion();
});

function sortTablaPorCorrelacion() {
  let tabla = document.getElementById("cuerpoTabla2");
  let cambio = true;
  let filas;
  let x;
  let y;
  let i;
  let deberiaCambiar;
  while (cambio) {
    cambio = false;
    filas = tabla.rows;
    for (i = 0; i < filas.length - 1; i++) {
      deberiaCambiar = false;
      x = filas[i].getElementsByTagName("td")[1];
      y = filas[i + 1].getElementsByTagName("td")[1];
      if (Number(x.innerHTML) < Number(y.innerHTML)) {
        deberiaCambiar = true;
        break;
      }
    }
    if (deberiaCambiar) {
      filas[i].parentNode.insertBefore(filas[i + 1], filas[i]);
      cambio = true;
    }
  }
}

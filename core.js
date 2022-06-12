/*
  utils section
*/

function pickColor(group) {
  bgColor = "";
  switch (group) {
    case "alkali metal":
      bgColor = "#f2c416";
      break;
    case "alkaline earth metal":
      bgColor = "#e77e27";
      break;
    case "transition metal":
      bgColor = "#2281bc";
      break;
    case "metal":
      bgColor = "#2d3f52";
      break;
    case "post-transition metal":
      bgColor = "#2d3f52";
      break;
    case "metalloid":
      bgColor = "#808d8f";
      break;
    case "nonmetal":
      bgColor = "#d91b5c";
      break;
    case "halogen":
      bgColor = "#4ca5cf";
      break;
    case "noble gas":
      bgColor = "#965ba5";
      break;
    case "lanthanoid":
      bgColor = "#ea4c3c";
      break;
    case "actinoid":
      bgColor = "#50b849";
      break;
  }

  return bgColor;
}

function converObjectToString(obj) {
  return JSON.stringify(obj);
}

/*
  element draw section
*/

function drawSecondaryTable(arr) {
  const container = document.querySelector("#root");
  const div = document.createElement("div");
  div.className = "secondaryTable";
  let content = "";
  arr.forEach((data, i) => {
    content += `<div data-value='${converObjectToString(
      data
    )}' onClick='drawModal(this)' onmouseover="mouseOverElement(this)" style='${
      data.style
        ? `${data.style} background-color : ${pickColor(data.groupBlock)}`
        : `background-color : ${pickColor(data.groupBlock)}`
    }' class='element'>${drawElement(data)}</div>`;
  });
  div.innerHTML = content;
  container.appendChild(div);
}

function drawElement(obj) {
  const { density } = obj;
  return `
  <div class="atomicNumber">${obj.atomicNumber}</div>
  <div class="info">
  <span class="symbol">${obj.symbol}</span>
  <span class="name">${obj.name ? obj.name : ""}</span>
  <span class="atomicMass">${obj.atomicMass ? obj.atomicMass : ""}</span>
  </div>
    `;
}

function legendElements() {
  return `
  <div>
  <span><div style="background-color:#f2c416"></div>Alkali Metal</span>
  <span><div style="background-color:#e77e27"></div>Alkaline earth metal</span>
  <span><div style="background-color:#2281bc"></div>Transition metal</span>
  <span><div style="background-color:#2d3f52"></div>Metal</span>
  <span><div style="background-color:#2d3f52"></div>Post-transition metal</span>
  </div>
  <div>
  <span><div style="background-color:#808d8f"></div>Metalloid</span>
  <span><div style="background-color:#d91b5c"></div>Nonmetal</span>
  <span><div style="background-color:#4ca5cf"></div>Halogen</span>
  <span><div style="background-color:#965ba5"></div>Noble gas</span>
  <span><div style="background-color:#ea4c3c"></div>Lanthanoid</span>
  <span><div style="background-color:#50b849"></div>Actinoid</span>
</div>
  
  `;
}

function drawMainTable(arr) {
  const container = document.querySelector("#root");
  const elementView = document.createElement("div");
  const div = document.createElement("div");
  const legends = document.createElement("div");

  legends.className = "legends";
  legends.style.gridArea = "1 / 9 / span 2 / span 3";
  legends.style.flexDirection = "row";

  legends.innerHTML = legendElements();

  elementView.id = "elementView";
  elementView.style.display = "none";
  div.className = "mainTable";
  div.id = "mainTable";

  let content = "";

  arr.forEach((data) => {
    data.forEach((data, i) => {
      content += `<div data-value='${converObjectToString(
        data
      )}' onClick='drawModal(this)' onmouseover="mouseOverElement(this)"  style='${
        data.style
          ? `${data.style} background-color : ${pickColor(data.groupBlock)}`
          : `background-color : ${pickColor(data.groupBlock)}`
      }' class='element'>${drawElement(data)} ${
        data.class ? `<h5 class="classElements">${data.class}</h5>` : ""
      }</div>`;
    });
  });

  div.innerHTML = content;
  div.appendChild(legends);
  div.appendChild(elementView);
  container.appendChild(div);
}

function drawHoveredElement(obj) {
  return `
  <div >
  <span class.atomNumber>${obj.atomicNumber}<h5 style="position: absolute; top: 0; left: -15ch; color: white;">Nomor Atom &rarr;</h5> </span>
  <span class="atomicMass">${obj.atomicMass}<h5 style="position: absolute; top: 0; right: -15ch; color: white;"> &larr; Massa Atom</h5> </span>
  </div> 
  <div class="info">
   <span class="oxidationStates">${obj.oxidationStates}<h5 style="position: absolute; top:  0; right: -19ch; color: white;"> &larr; Tingkat oksidasi</h5> </span>
    <div class="main-info">
      <div>
      <span class="boilingPoint">${obj.boilingPoint}<h5 style="position: absolute; top: 0;left: -15ch; color: white;">Titik didih (C) &rarr;</h5> </span></span>
      <span class="meltingPoint">${obj.meltingPoint}<h5 style="position: absolute; top: 0; left: -15ch; color: white;">Titik leleh (C) &rarr;</h5> </span></span>
      <span class="density">${obj.density}<h5 style="position: absolute; top: 0; left: -15ch; color: white;">Massa Jenis  &rarr;</h5> </span></span>
      </div>
      <span class="symbol">${obj.symbol}</span>
      <h5  style="font-size: 0.9em; position: absolute; top: 50%; right: -11ch; color: white;">&larr; Symbol</h5>
    </div>
     <span class="electronConfiguration">${obj.electronicConfiguration}<h5 style="position: absolute; top: 0; right: -19ch; color: white;"> &larr; Struktur elektron</h5> </span>
  <span class="name">${obj.name}<h5 style="position: absolute; top: 0; right: -15ch; color: white;"> &larr; Nama unsur;</h5></span>
  </div>
    `;
}

/*
  modal section
*/

function drawModal(element) {
  const modal = document.querySelector("#modal");
  const data = JSON.parse(element.getAttribute("data-value"));
  const info = document.querySelector(".info-wrap");
  const image = document.querySelector(".image-wrap");

  document.body.style.overflow = "hidden";
  document.querySelector("#root").style.filter = "blur(4px)";

  modal.style.display = "block";
  let content = "";
  for (const key in data) {
    content += `<h3>${key} : ${data[key]}</h3>`;
  }
  info.innerHTML = content;
}

function closeModal() {
  const modal = document.querySelector("#modal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
  document.querySelector("#root").style.filter = "none";
}

/*
  event listener section
*/

function convertToPDF(element) {
  const { jsPDF } = window.jspdf;
  window.html2canvas = html2canvas;
  element.innerText = "LOADING...";
  html2canvas(document.querySelector("#root"), {
    background: "#1b2430",
    scale: 4,
  }).then((canvas) => {
    const img = canvas.toDataURL("image/png");
    const doc = new jsPDF({
      orientation: "l",
      unit: "px",
      format: [3150, 2160],
    });
    doc.setFillColor(27, 36, 48);
    doc.rect(0, 0, 3150, 2160, "F");
    doc.setFontSize(100);
    doc.setFont("arial", "bold", 700);
    doc.setTextColor(255, 255, 255);
    doc.text("TABEL PERIODIK", 80, 100);
    doc.addImage(img, "PNG", 40, 150);
    doc.setFontSize(40);
    doc.setFont("arial", "normal", 400);
    doc.text("Created by @nishly", 80, 2140);
    doc.save("Table_Periodik_by_@nishly.pdf");
    element.innerText = "SAVE AS PDF";
  });
}

function mouseOverElement(element) {
  const container = document.querySelector("#elementView");
  const data = JSON.parse(element.getAttribute("data-value"));
  const parsed = drawHoveredElement(data);
  container.style.backgroundColor = `${element.style.backgroundColor}`;
  container.style.display = "flex";
  container.innerHTML = parsed;
}

document.addEventListener("scroll", () => {
  const mainTable = document.querySelector("#mainTable");
  const container = document.querySelector("#elementView");
  const rect = mainTable.getBoundingClientRect();

  if (rect.y < -110) {
    container.classList.add("scrolled");
  }

  if (rect.y > -100) {
    container.classList.remove("scrolled");
  }

  if (rect.y < -300) {
    container.classList.remove("scrolled");
  }
});

/*
  main thread section
*/

async function get() {
  document.title = "Table Periodik";
  const res = await fetch("./db.json");
  const data = await res.json();
  drawMainTable(data.mainTable);
  drawSecondaryTable(data.secondaryTable);
}

get();

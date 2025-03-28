/*
  utils section
*/

import type AtomicElement from "./data";

function pickColor(group: string) {
  let bgColor = "";
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

function converObjectToString(obj: AtomicElement) {
  return JSON.stringify(obj);
}

function mouseOverElement(element: HTMLDivElement) {
  const container = document.querySelector("#elementView") as HTMLDivElement;
  const rawJson = element.getAttribute("data-value");
  if (!container || !rawJson) return;

  const data = JSON.parse(rawJson);
  const parsed = drawHoveredElement(data);
  container.style.backgroundColor = `${element.style.backgroundColor}`;
  container.style.display = "flex";
  container.innerHTML = "";
  container.appendChild(parsed);
}

/*
  element draw section
*/

function drawSecondaryTable(arr: AtomicElement[]) {
  const container = document.querySelector("#root");
  if (!container) {
    return;
  }
  const div = document.createElement("div");
  div.className = "secondaryTable";
  let contents: HTMLDivElement[] = [];

  arr.forEach((data) => {
    const elementDiv = document.createElement("div");
    elementDiv.className = "element";
    elementDiv.setAttribute("data-value", converObjectToString(data));
    elementDiv.style.cssText = data.style
      ? `${data.style} background-color: ${pickColor(data.groupBlock)}`
      : `background-color: ${pickColor(data.groupBlock)}`;
    elementDiv.innerHTML = drawElement(data);
    elementDiv.addEventListener("click", () => drawModal(elementDiv));
    elementDiv.addEventListener("mouseover", () =>
      mouseOverElement(elementDiv)
    );
    contents.push(elementDiv);
  });

  div.append(...contents);
  container.appendChild(div);
}

function drawElement(element: AtomicElement) {
  return `
  <div class="atomicNumber">${element.atomicNumber}</div>
  <div class="info">
  <span class="symbol">${element.symbol}</span>
  <span class="name">${element.name ? element.name : ""}</span>
  <span class="atomicMass">${
    element.atomicMass ? element.atomicMass : ""
  }</span>
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

function drawMainTable(arr: AtomicElement[][]) {
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

  let contents: HTMLDivElement[] = [];

  arr.forEach((data) => {
    data.forEach((data, i) => {
      const elementDiv = document.createElement("div");
      elementDiv.setAttribute("data-value", converObjectToString(data));
      elementDiv.addEventListener("click", () => drawModal(elementDiv));
      elementDiv.addEventListener("mouseover", () =>
        mouseOverElement(elementDiv)
      );
      elementDiv.className = "element";
      elementDiv.style.cssText = data.style
        ? `${data.style} background-color: ${pickColor(data.groupBlock)}`
        : `background-color: ${pickColor(data.groupBlock)}`;
      elementDiv.innerHTML = drawElement(data);

      if (data.class) {
        const classLabel = document.createElement("h5");
        classLabel.className = "classElements";
        classLabel.textContent = data.class;
        elementDiv.appendChild(classLabel);
      }

      contents.push(elementDiv);
    });
  });

  div.append(...contents);
  div.appendChild(legends);
  div.appendChild(elementView);
  container?.appendChild(div);
}

function drawHoveredElement(element: AtomicElement) {
  const container = document.createElement("div");

  return container;
}

/*
  modal section
*/

function drawModal(element: HTMLDivElement) {
  const data = JSON.parse(element.getAttribute("data-value") as string);
  const info = document.querySelector(".info-wrap") as HTMLDivElement;
  const modal = document.querySelector("#modal") as HTMLDivElement;
  const root = document.querySelector("#root") as HTMLDivElement;

  if (!modal || !info || !root) return;

  modal.style.display = "block";
  root.style.filter = "blur(4px)";
  document.body.style.overflow = "hidden";

  let content = "";
  for (const key in data) {
    content += `<h3>${key} : ${data[key]}</h3>`;
  }

  info.innerHTML = content;
}

function closeModal() {
  const modal = document.querySelector("#modal") as HTMLDivElement;
  const root = document.querySelector("#root") as HTMLDivElement;
  if (!modal || !root) return;

  modal.style.display = "none";
  root.style.filter = "none";
  document.body.style.overflow = "auto";
}

/*
  event listener section
*/

// function convertToPDF(element) {
//   const { jsPDF } = window.jspdf;
//   window.html2canvas = html2canvas;
//   element.innerText = "LOADING...";
//   html2canvas(document.querySelector("#root"), {
//     background: "#1b2430",
//     scale: 4,
//   }).then((canvas) => {
//     const img = canvas.toDataURL("image/png");
//     const doc = new jsPDF({
//       orientation: "l",
//       unit: "px",
//       format: [3150, 2160],
//     });
//     doc.setFillColor(27, 36, 48);
//     doc.rect(0, 0, 3150, 2160, "F");
//     doc.setFontSize(100);
//     doc.setFont("arial", "bold", 700);
//     doc.setTextColor(255, 255, 255);
//     doc.text("TABEL PERIODIK", 80, 100);
//     doc.addImage(img, "PNG", 40, 150);
//     doc.setFontSize(40);
//     doc.setFont("arial", "normal", 400);
//     doc.text("Created by @nishly", 80, 2140);
//     doc.save("Table_Periodik_by_@nishly.pdf");
//     element.innerText = "SAVE AS PDF";
//   });
// }

document.body.addEventListener("scroll", () => {
  const mainTable = document.querySelector("#mainTable");
  const container = document.querySelector("#elementView");

  if (!mainTable || !container) return;

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

  try {
    const res = await fetch("./db.json");

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = (await res.json()) as {
      mainTable: AtomicElement[][];
      secondaryTable: AtomicElement[];
    };

    drawMainTable(data.mainTable);
    drawSecondaryTable(data.secondaryTable);

    document
      .querySelector("#closeModal")
      ?.addEventListener("click", closeModal);
  } catch (error) {
    console.error("Failed to load periodic table data:", error);
    // You might want to show an error message to the user here
  }
}

window.onload = get;

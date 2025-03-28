// src/main.ts
function pickColor(group) {
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
function converObjectToString(obj) {
  return JSON.stringify(obj);
}
function mouseOverElement(element) {
  const container = document.querySelector("#elementView");
  const rawJson = element.getAttribute("data-value");
  if (!container || !rawJson)
    return;
  const data = JSON.parse(rawJson);
  const parsed = drawHoveredElement(data);
  container.style.backgroundColor = `${element.style.backgroundColor}`;
  container.style.display = "flex";
  container.innerHTML = "";
  container.appendChild(parsed);
}
function drawSecondaryTable(arr) {
  const container = document.querySelector("#root");
  if (!container) {
    return;
  }
  const div = document.createElement("div");
  div.className = "secondaryTable";
  let contents = [];
  arr.forEach((data) => {
    const elementDiv = document.createElement("div");
    elementDiv.className = "element";
    elementDiv.setAttribute("data-value", converObjectToString(data));
    elementDiv.style.cssText = data.style ? `${data.style} background-color: ${pickColor(data.groupBlock)}` : `background-color: ${pickColor(data.groupBlock)}`;
    elementDiv.innerHTML = drawElement(data);
    elementDiv.addEventListener("click", () => drawModal(elementDiv));
    elementDiv.addEventListener("mouseover", () => mouseOverElement(elementDiv));
    contents.push(elementDiv);
  });
  div.append(...contents);
  container.appendChild(div);
}
function drawElement(element) {
  return `
  <div class="atomicNumber">${element.atomicNumber}</div>
  <div class="info">
  <span class="symbol">${element.symbol}</span>
  <span class="name">${element.name ? element.name : ""}</span>
  <span class="atomicMass">${element.atomicMass ? element.atomicMass : ""}</span>
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
  let contents = [];
  arr.forEach((data) => {
    data.forEach((data2, i) => {
      const elementDiv = document.createElement("div");
      elementDiv.setAttribute("data-value", converObjectToString(data2));
      elementDiv.addEventListener("click", () => drawModal(elementDiv));
      elementDiv.addEventListener("mouseover", () => mouseOverElement(elementDiv));
      elementDiv.className = "element";
      elementDiv.style.cssText = data2.style ? `${data2.style} background-color: ${pickColor(data2.groupBlock)}` : `background-color: ${pickColor(data2.groupBlock)}`;
      elementDiv.innerHTML = drawElement(data2);
      if (data2.class) {
        const classLabel = document.createElement("h5");
        classLabel.className = "classElements";
        classLabel.textContent = data2.class;
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
function drawHoveredElement(element) {
  const container = document.createElement("div");
  const topDiv = document.createElement("div");
  const atomNumberSpan = createLabeledSpan(element.atomicNumber.toString(), "atomNumber", "Nomor Atom →", "left");
  const atomicMassSpan = createLabeledSpan(element.atomicMass?.toString() || "", "atomicMass", "← Massa Atom", "right");
  topDiv.append(atomNumberSpan, atomicMassSpan);
  const infoDiv = document.createElement("div");
  infoDiv.className = "info";
  const oxidationStatesSpan = createLabeledSpan(element.oxidationStates?.toString() || "", "oxidationStates", "← Tingkat oksidasi", "right");
  const mainInfoDiv = document.createElement("div");
  mainInfoDiv.className = "main-info";
  const propertiesDiv = document.createElement("div");
  propertiesDiv.append(createLabeledSpan(element.boilingPoint?.toString() || "", "boilingPoint", "Titik didih (C) →", "left"), createLabeledSpan(element.meltingPoint?.toString() || "", "meltingPoint", "Titik leleh (C) →", "left"), createLabeledSpan(element.density?.toString() || "", "density", "Massa Jenis →", "left"));
  const symbolSpan = createLabeledSpan(element.symbol, "symbol", "← Symbol", "right");
  mainInfoDiv.append(propertiesDiv, symbolSpan);
  const electronConfigSpan = createLabeledSpan(element.electronicConfiguration || "", "electronConfiguration", "← Struktur elektron", "right");
  const nameSpan = createLabeledSpan(element.name || "", "name", "← Nama unsur", "right");
  infoDiv.append(oxidationStatesSpan, mainInfoDiv, electronConfigSpan, nameSpan);
  container.append(topDiv, infoDiv);
  return container;
}
function createLabeledSpan(text, className, labelText, position) {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = text;
  const label = document.createElement("h5");
  label.style.position = "absolute";
  label.style.top = "0";
  label.style.color = "white";
  if (position === "left") {
    label.style.left = "-15ch";
  } else {
    label.style.right = "-15ch";
  }
  label.textContent = labelText;
  span.appendChild(label);
  return span;
}
function drawModal(element) {
  const data = JSON.parse(element.getAttribute("data-value"));
  const info = document.querySelector(".info-wrap");
  const modal = document.querySelector("#modal");
  const root = document.querySelector("#root");
  if (!modal || !info || !root)
    return;
  modal.style.display = "block";
  root.style.filter = "blur(4px)";
  document.body.style.overflow = "hidden";
  let content = "";
  for (const key in data) {
    content += `<h3>${key} : ${data[key]}</h3>`;
  }
  info.innerHTML = content;
}
document.body.addEventListener("scroll", () => {
  const mainTable = document.querySelector("#mainTable");
  const container = document.querySelector("#elementView");
  if (!mainTable || !container)
    return;
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
async function get() {
  document.title = "Table Periodik";
  try {
    const res = await fetch("./db.json");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    drawMainTable(data.mainTable);
    drawSecondaryTable(data.secondaryTable);
  } catch (error) {
    console.error("Failed to load periodic table data:", error);
  }
}
window.onload = get;

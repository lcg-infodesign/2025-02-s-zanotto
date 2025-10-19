let table;

function preload() {
  table = loadTable("./dataset.csv", "csv", "header");
}

function setup() {
  let outerPadding = 20;
  let padding = 10;
  let itemSize = 80;

  let cols = floor((windowWidth - outerPadding * 2) / (itemSize + padding));
  let rows = ceil(table.getRowCount() / cols);
  let totalHeight = outerPadding * 2 + rows * itemSize + (rows - 1) * padding;

  createCanvas(windowWidth, totalHeight);
  background(245);

  let colCount = 0;
  let rowCount = 0;

  for (let rowNumber = 0; rowNumber < table.getRowCount(); rowNumber++) {
    let data = table.getRow(rowNumber).obj;

    // Estrai valori per le trasformazioni
    let val0 = parseFloat(data["column0"]); // scala
    let val1 = parseFloat(data["column1"]); // rotazione
    let val2 = parseFloat(data["column2"]); // colore
    let val3 = parseFloat(data["column3"]); // proporzione interna
    let val4 = parseFloat(data["column4"]); // densità/complessità

    // Normalizza i valori
    let allValues0 = table.getColumn("column0").map(v => parseFloat(v));
    let allValues1 = table.getColumn("column1").map(v => parseFloat(v));
    let allValues2 = table.getColumn("column2").map(v => parseFloat(v));
    let allValues3 = table.getColumn("column3").map(v => parseFloat(v));
    let allValues4 = table.getColumn("column4").map(v => parseFloat(v));

    let scaledVal0 = map(val0, min(allValues0), max(allValues0), 0.4, 1.2);
    let scaledVal1 = map(val1, min(allValues1), max(allValues1), 0, TWO_PI);
    let scaledVal2 = map(val2, min(allValues2), max(allValues2), 0, 1);
    let scaledVal3 = map(val3, min(allValues3), max(allValues3), 0.3, 0.8);
    let scaledVal4 = map(val4, min(allValues4), max(allValues4), 0, 1);

    // colore: gradiente coerente
    let c1 = color(255, 100, 150); // rosa
    let c2 = color(100, 150, 255); // blu
    let glyphColor = lerpColor(c1, c2, scaledVal2);

    // posizione
    let xPos = outerPadding + colCount * (itemSize + padding);
    let yPos = outerPadding + rowCount * (itemSize + padding);

    // disegna il glifo
    push();
    translate(xPos + itemSize / 2, yPos + itemSize / 2);
    drawGlyph(scaledVal0, scaledVal1, glyphColor, scaledVal3, scaledVal4);
    pop();

    colCount++;
    if (colCount == cols) {
      colCount = 0;
      rowCount++;
    }
  }
}

function drawGlyph(scale, rotation, glyphColor, proportion, complexity) {
  // famiglia di glifi: forma base + variazioni coerenti
  
  let baseSize = 30;
  let size = baseSize * scale;
  
  // elementi invarianti: tratto coerente
  strokeWeight(2);
  stroke(glyphColor);
  fill(255, 255, 255, 200);
  
  // FORMA BASE: cerchio con dettagli interni
  push();
  rotate(rotation);
  
  // cerchio esterno (invariante della famiglia)
  noFill();
  strokeWeight(2);
  circle(0, 0, size);
  
  // elementi interni variano con i dati
  fill(glyphColor);
  
  // proporzione controlla la dimensione del nucleo interno
  let innerSize = size * proportion;
  circle(0, 0, innerSize);
  
  // complessità controlla i dettagli radiali
  let rays = round(map(complexity, 0, 1, 3, 12));
  strokeWeight(1.5);
  stroke(glyphColor);
  for (let i = 0; i < rays; i++) {
    let angle = TWO_PI / rays * i;
    let x1 = cos(angle) * (size * 0.45);
    let y1 = sin(angle) * (size * 0.45);
    let x2 = cos(angle) * (size * 0.25);
    let y2 = sin(angle) * (size * 0.25);
    line(x1, y1, x2, y2);
  }
  
  pop();
  
  // elemento decorativo esterno (invariante)
  strokeWeight(1);
  noFill();
  stroke(glyphColor);
  let decorSize = size * 1.15;
  push();
  rotate(rotation + PI / 4);
  rect(-decorSize / 2, -decorSize / 2, decorSize, decorSize);
  pop();
}


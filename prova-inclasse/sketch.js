let table;


function preload() {
  // put preload code here
  table = loadTable("dataset.csv", "csv", "header");
}

function setup() {
  console.log(table); // scrivi sulla console del browser

  let outerPadding = 20; // per stabilire padding esterno
  let padding = 10; // padding tra gli elementi
  let itemSize = 30; // grandezza elementi 

  // calcolare quante colonne ci stanno
  let cols = floor((windowWidth - outerPadding * 2) / (itemSize + padding));

  let row = ceil(table.getRowCount() / cols);

  let totalHeight = outerPadding * 2 + rows * itemSize + (rows - 1) * padding;

  // creo il cavas
  createCanvas(windowWidth, totalHeight);
  background("coral");

  console.log("cols:", cols, "rows:", rows);

  let colCount = 0;
  let rowCount = 0;


  for(let rowNumber = 0; rowNumber < table.getRowCount(); rowNumber ++){
    let data = table.getRow(rowNumber).obj;
    console.log(data);

    let xPos = outerPadding + colCount * (itemSize + padding);
    let yPos = outerPadding + rowCount * (itemSize + padding);

    rect(xPos, yPos, itemSize, itemSize);

   colCount ++;
  }


}

function draw() {
  // put drawing code here
}

function getTriangleArea(p1, p2, p3){
    console.log(`Getting triangle area from {p1}, {p2}, {p3}`)
}

const ROW_SIZE = 200;
const COLUMN_SIZE = 320;

const matrix = document.getElementById('pixelMatrix');
// This class will be used to draw on the 320x200 grid
// Via a 2d array of drawable objects
class displayGrid{
    constructor(){
        // 320 x 200 (200 rows, 320 colums)
        // Filled with RGB Values {r: red, g:green, b:blue} (black by default)
        // this.displayMatrix = Array.from({ length: ROW_SIZE }, () => Array(COLUMN_SIZE).fill({r: 0, g: 0, b:0}));
        this.displayMatrix = Array.from({ length: ROW_SIZE }, () => 
            Array.from({ length: COLUMN_SIZE }, () => ({ r: 0, g: 0, b: 0, element: null }))
        );
        this.initializeDOMGrid();
        console.log(this.displayMatrix[199][319]); // Test for value in 'last' pixel

        // But! we also need the pixels to represent a small area on our display. 
    }

    initializeDOMGrid(){
        const fragment = document.createDocumentFragment();

        for (let r = 0; r < ROW_SIZE; r++) {
            for (let c = 0; c < COLUMN_SIZE; c++) {
                // Make a div for the pixel
                const cell = document.createElement('div');
                cell.className = 'pixel';
                // Color (Like 'off' color for gameboy)
                cell.style.backgroundColor = "#9bbc0f";
                
                // 2. Add to matrix
                this.displayMatrix[r][c].element = cell;

                // 3. Append to our off-screen fragment
                fragment.appendChild(cell);
            }
        }
        matrix.appendChild(fragment);
    }

    colorPixel(x, y){
        // Dont mess it up!!!!!
        if(x < 0 || x >= COLUMN_SIZE || y < 0 || y >= ROW_SIZE){
            console.log("Pixel was outside of drawable range, skipping");
            return;
        }

        const pixel = this.displayMatrix[ROW_SIZE-1 - y][x];
        // Draw for the on state of gameboy
        pixel.element.style.backgroundColor = "#0f380f";
    }

};

function makePixelatedLine(x1, y1, x2, y2){

    let slope = .000000000001;
    if(x2-x1 != 0){
        slope = (y2-y1) / (x2 - x1); 
    }
  // Step 1: Find the slop of the line
//   const slope = (Math.max(y2, y1) - Math.min(y1, y2)) / (Math.max(x2, x1) - Math.min(x1, x2)); 

  // Step 2a: Find which point to start at
  let xStart = Math.min(x1, x2);
  let xEnd = Math.max(x1, x2);
  // Step 2b: Itterate through the x points of the line
  for(let i = xStart; i < xEnd; i++){
//   for(let i = x1; i < x2; i++){
    // console.log(`Drawing line for (${i}, ${y1 + slope * i})`);
    // Step 3: Draw pixel for the found pixel location.
    display.colorPixel(i, Math.round(y1 + slope*i));
  }
}


function drawTriangle(p1x, p1y, p2x, p2y, p3x, p3y){
    // Step 1: Get the bounding Box
    xMin = Math.min(x1, x2, x3);
    yMin = Math.min(y1, y2, y3);
    xMax = Math.max(x1, x2, x3);
    yMax = Math.max(y1, y2, y3);

    // Step 2: Start Itterating over the bounding box
    for(let x = xMin; x < xMax; x++){
        for(let y = yMin; y < yMax; y++){
            console.log(`Checking Triangle Bounding Box (${x}, ${y})`)
        }
    }


    // Step 3: For each pixel, determine if it is in bounds with Barycentric Coordiantes
}

function findBarycentricCoordinates(p1x, p1y, p2x, p2y, p3x, p3y){
    // Step 1: Find the area of the whole triangle

    // Find a

    // Find b

    // Find c
}

const display = new displayGrid();
function main(){
    display.colorPixel(0, 0);
    makePixelatedLine(0, 0, 319, 199);
    // makePixelatedLine(0, 199, 319, 0);
    makePixelatedLine(319, 0, 0, 199);
}


// run the code
main();
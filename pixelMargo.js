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

        // Since we are dealing w performance, may need to
        // Add the colored pixels to a set so they can reset faster.
        coloredSet.add(pixel); 
    }

};

function makePixelatedLine(x1, y1, x2, y2){
    
    // Step 1: Find the slop of the line
    let slope = .000000000001;
    if(x2-x1 != 0){
        slope = (y2-y1) / (x2 - x1); 
    }

    // Step 2a: Find which point to start at
    let xStart = Math.min(x1, x2);
    let xEnd = Math.max(x1, x2);
    // Step 2b: Itterate through the x points of the line
    for(let i = xStart; i < xEnd; i++){
        // console.log(`Drawing line for (${i}, ${y1 + slope * i})`);
        // Step 3: Draw pixel for the found pixel location.
        display.colorPixel(i, Math.round(y1 + slope*i));
    }
}


function drawTriangle(px1, py1, px2, py2, px3, py3){
    // Step 1: Get the bounding Box
    xMin = Math.min(px1, px2, px3);
    yMin = Math.min(py1, py2, py3);
    xMax = Math.max(px1, px2, px3);
    yMax = Math.max(py1, py2, py3);

    // Step 2: Start Itterating over the bounding box
    var barycentricHold = 0;
    const wholeArea = Math.abs(getTriangleArea(px1, py1, px2, py2, px3, py3));
    for(let x = xMin; x < xMax; x++){
        for(let y = yMin; y < yMax; y++){
            console.log(`Checking Triangle Bounding Box (${x}, ${y})`);

            barycentricHold = findBarycentricCoordinates(px1, py1, px2, py2, px3, py3, x, y, wholeArea);
            console.log(barycentricHold);
            // Step 3: For each pixel, determine if it is in bounds with Barycentric Coordiantes
            if(barycentricHold.a < 0 || barycentricHold.b < 0 || barycentricHold.c < 0){
                // (Skip) Do not draw pixels with a negative barycentric coord. 
            }
            else{
                // all positive, Draw
                display.colorPixel(x, y);
            }

        }
    }

}

// THIS ALSO NEEDS TO BE CLOCKWISE //ax,  ay,  bx,  by,  cx,  cy,  vx, vy
function findBarycentricCoordinates(p1x, p1y, p2x, p2y, p3x, p3y, vx, vy, wholeArea){
    // Step 1: Find the area of the whole triangle
    if(wholeArea == null){
        wholeArea = Math.abs(getTriangleArea(p1x, p1y, p2x, p2y, p3x, p3y)); // needed?
    }
    console.log(`Whole area: ${wholeArea}`)

    // Find a p2 -> V -> p3
    const aArea = getTriangleArea(p2x, p2y, vx, vy, p3x, p3y);
    console.log(`aArea: ${aArea}`);

    // Find b p1 -> p3 -> V
    const bArea = getTriangleArea(p1x, p1y, p3x, p3y, vx, vy);
    console.log(`bArea: ${bArea}`);

    // Find c P1 -> V -> p2 
    const cArea = getTriangleArea(p1x, p1y, vx, vy, p2x, p2y);
    console.log(`cArea: ${cArea}`);

    console.log(`Sum of areas: ${aArea + bArea + cArea} / ${wholeArea}`);

    return {a: aArea/wholeArea, b: bArea/wholeArea, c: cArea/wholeArea};
}

// https://jtsorlinis.github.io/rendering-tutorial/#:~:text=Area%20of%20a%20triangle%20(aka%20maths)
// CLOCKWISE ONLY (Way to turn these into clockwise no matter what?)
function getTriangleArea(px1, py1, px2, py2, px3, py3){
    return (((px2-px1)*(py3-py1))-((py2-py1)*(px3-px1))) / 2;
}

function clearDisplay(){
    coloredSet.forEach(value => {value.element.style.backgroundColor = "#9bbc0f";})
}

// Gonna see if this works any better later I think
function colorPixelSet(){
    coloredSet.forEach(value => {value.element.style.backgroundColor = "#0f380f";})
}

// I want to make this global so that I can access anywhere easily. 
const display = new displayGrid();
const coloredSet = new Set(); // This may be needed for performance idk

// Game logic should happen here
function update(){

}

// Draw all of the triangles
function draw(){
    clearDisplay();

    // Call draw functions on objects
}

// I got this off github which is apparently the best way to run a game
function gameLoop(){
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function main(){
    display.colorPixel(10, 10);
    makePixelatedLine(0, 0, 319, 199);
    drawTriangle(50, 50, 100, 100, 150, 50);
}

main();
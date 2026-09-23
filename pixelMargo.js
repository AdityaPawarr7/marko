const ROW_SIZE = 200;
const COLUMN_SIZE = 320;

const matrix = document.getElementById('pixelMatrix');
const camera = {x: 0, y: 0, z: 0};
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
        // console.log(this.displayMatrix[199][319]); // Test for value in 'last' pixel
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

// https://jtsorlinis.github.io/rendering-tutorial/#:~:text=Area%20of%20a%20triangle%20(aka%20maths)
// CLOCKWISE ONLY (Way to turn these into clockwise no matter what?)
function getTriangleArea(px1, py1, px2, py2, px3, py3){
    return (((px2-px1)*(py3-py1))-((py2-py1)*(px3-px1))) / 2;
}

class Triangle{
    // Member varibles for 2d coordinates
    u1; u2; u3; v1; v2; v3;
    constructor(x1, y1, z1, x2, y2, z2, x3, y3, z3){
        // 3d Coordinates
        this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;
        this.x2 = x2;
        this.y2 = y2;
        this.z2 = z2;
        this.x3 = x3;
        this.y3 = y3;
        this.z3 = z3;
    }

    // https://jtsorlinis.github.io/rendering-tutorial/#:~:text=Area%20of%20a%20triangle%20(aka%20maths)
    // CLOCKWISE ONLY (Way to turn these into clockwise no matter what?)
    getArea(){
        return (((this.x2-this.x1)*(this.y3-this.y1))-((this.y2-this.y1)*(this.x3-this.x1))) / 2;
    }

    // Only works when coords are correctly clockwise
    getBarycentricCoordinates(u, v){
        // Step 1: Find the area of the whole triangle
        let wholeArea = Math.abs(this.getArea());

        // Find a p2 -> V -> p3 (Need to call general Triangle Area Formula bc using the verticies Coords)
        const aArea = getTriangleArea(this.u2, this.v2, u, v, this.u3, this.v3);

        // Find b p1 -> p3 -> V
        const bArea = getTriangleArea(this.u1, this.v1, this.u3, this.v3, u, v);

        // Find c P1 -> V -> p2 
        const cArea = getTriangleArea(this.u1, this.v1, u, v, this.u2, this.v2);

        // console.log(`a:${aArea}, b:${bArea}, c:${cArea} / ${wholeArea}`);

        // Not gonna port this to a class sorreeee
        return {a: aArea/wholeArea, b: bArea/wholeArea, c: cArea/wholeArea};
    }

    translate3dCoordinates(){
        // Translate 3d Coordinates to 2D relative to the camera
        this.u1 = (this.x1 - camera.x) / (this.z1 - camera.z);
        this.v1 = (this.y1 - camera.y) / (this.z1 - camera.z);
        this.u2 = (this.x2 - camera.x) / (this.z2 - camera.z);
        this.v2 = (this.y2 - camera.y) / (this.z2 - camera.z);
        this.u3 = (this.x3 - camera.x) / (this.z3 - camera.z);
        this.v3 = (this.y3 - camera.y) / (this.z3 - camera.z);
    }

    draw(){
        // Translate the coordinates.
        this.translate3dCoordinates();

        // Setup The bounding box
        let uMin = Math.floor(Math.min(this.u1, this.u2, this.u3));
        let vMin = Math.floor(Math.min(this.v1, this.v2, this.v3));
        let uMax = Math.ceil(Math.max(this.u1, this.u2, this.u3));
        let vMax = Math.ceil(Math.max(this.v1, this.v2, this.v3));

        console.log(`uMin: ${uMin}, yMin: ${vMin}, uMax: ${uMax}, vMax: ${vMax}`);
        // Step 2: Start Itterating over the bounding box
        var barycentricHold = 0;
        for(let u = uMin; u <= uMax; u++){
            for(let v = vMin; v <= vMax; v++){
                // console.log(`Drawing Pixel (${u}, ${v})`);
                barycentricHold = this.getBarycentricCoordinates(u, v);
                // Step 3: For each pixel, determine if it is in bounds with Barycentric Coordiantes
                if(barycentricHold.a < 0 || barycentricHold.b < 0 || barycentricHold.c < 0){
                    // (Skip) Do not draw pixels with a negative barycentric coord. 
                }
                else{
                    // all positive, Draw :)
                    display.colorPixel(u, v);
                }
            }
        }

    }

    // Translations should happen in the update part of game loop, so should apply to 3d
    scale(scalar){
        console.log(`first x1: ${this.x3}`);
        this.x1 *= scalar;
        this.y1 *= scalar;
        this.z1 *= scalar;
        this.x2 *= scalar;
        this.y2 *= scalar;
        this.z2 *= scalar;
        this.x3 *= scalar;
        this.y3 *= scalar;
        this.z3 *= scalar;
        console.log(`sec x1: ${this.x3}`);
    }

    vectorScale(scalingVector){
        this.x1 *= scalingVector.x;
        this.y1 *= scalingVector.y;
        this.z1 *= scalingVector.z;
        this.x2 *= scalingVector.x;
        this.y2 *= scalingVector.y;
        this.z2 *= scalingVector.z;
        this.x3 *= scalingVector.x;
        this.y3 *= scalingVector.y;
        this.z3 *= scalingVector.z;
    }

    vectorTranslate(translationVector){
        this.x1 = this.x1 + translationVector.x;
        this.y1 = this.y1 + translationVector.y;
        this.z1 = this.z1 + translationVector.z;
        this.x2 = this.x2 + translationVector.x;
        this.y2 = this.y2 + translationVector.y;
        this.z2 = this.z2 + translationVector.z;
        this.x3 = this.x3 + translationVector.x;
        this.y3 = this.y3 + translationVector.y;
        this.z3 = this.z3 + translationVector.z;
    }
}

// This is the simplest 3d shape. It has 4 triangles. We can make it regular (equal edge lengths)
// class Tetrahedron{
//     constructor(x, y, z, edgeLength = 1){
//         this.triangles = [];
//         // Setup the basic coordinates
//         let topCoordiante = {x: .5, y: 1, z: .5};
//         let d1 = {x: 0, y: 0, z: 0};
//         let d2 = {x: .5, y: 0, z: 1};
//         let d3 = {x: 1, y: 0, z: 0};
//         // Now add all of these as triangles. (Do they need to be a copy)
//         // Note that this may cause some problems since the Verticies are reference objects
//         this.triangles.push({}); // Bottom of triangle
//         this.triangles.push();
//         this.triangles.push();
//         this.triangles.push();
//     }

//     draw(){
//         // Translate all of the coordinates
//     }

// }

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
    // display.colorPixel(10, 10);
    // makePixelatedLine(0, 0, 319, 199);
    const testDepth = 1;
    let test = new Triangle(0, 0, testDepth, 50, 100, testDepth, 100, 0, testDepth);
    test.vectorScale({x: 2, y: .5, z: 1});
    test.vectorTranslate({x: -50, y: 0, z: 0});
    test.draw();
    // gameLoop();
}

main();
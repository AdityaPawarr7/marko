const ROW_SIZE = 200;
const COLUMN_SIZE = 320;

const DISTANCE_CLOSE = 50;
const DISTANCE_MEDIUM = 150;
const DISTANCE_FAR = 300;

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
            Array.from({ length: COLUMN_SIZE }, () => ({ depth: Infinity, element: null }))
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

    colorPixel(x, y, depth, color = "#0f380f"){
        // Dont mess it up!!!!!
        if(x < 0 || x >= COLUMN_SIZE || y < 0 || y >= ROW_SIZE){
            console.log("Pixel was outside of drawable range, skipping");
            return;
        }

        const pixel = this.displayMatrix[ROW_SIZE-1 - y][x];
        // Draw for the on state of gameboy
        pixel.element.style.backgroundColor = color;
        pixel.depth = depth;

        // Since we are dealing w performance, may need to
        // Add the colored pixels to a set so they can reset faster.
        coloredSet.add(pixel); 
    }

    getPixelDepth(x, y){
        if(x < 0 || x >= COLUMN_SIZE || y < 0 || y >= ROW_SIZE){
            console.log("Pixel was outside of drawable range, way outside");
            return -99999;
        }
        const pixel = this.displayMatrix[ROW_SIZE-1 - y][x];
        // Get any possible pixel color or just make it mad far away
        if(pixel == null || pixel.depth == null){
            return -99999;
        }
        console.log(`got pixel dpeth: ${pixel.depth}`);

        return pixel.depth;
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

    printVerticies(){
        console.log(`x1: ${parseInt(this.x1)}, y1: ${parseInt(this.y1)}, z1: ${parseInt(this.z1)}\nx2: ${parseInt(this.x2)}, y2: ${parseInt(this.y2)}, z2: ${parseInt(this.z2)}\nx3: ${parseInt(this.x3)}, y3: ${parseInt(this.y3)}, z3: ${parseInt(this.z3)}`);
    }

    // FULLY GPT GENERATED (Have been struggling with ordering so wanted to try to potentially avoid)
    makeClockwise() {
        // Signed 2D area / cross product of the projected triangle
        const cross =
            (this.u2 - this.u1) * (this.v3 - this.v1) -
            (this.v2 - this.v1) * (this.u3 - this.u1);

        // Positive = counter-clockwise
        // Negative = clockwise
        if (cross > 0) {
            // Swap vertex 2 and vertex 3
            [this.x2, this.x3] = [this.x3, this.x2];
            [this.y2, this.y3] = [this.y3, this.y2];
            [this.z2, this.z3] = [this.z3, this.z2];

            [this.u2, this.u3] = [this.u3, this.u2];
            [this.v2, this.v3] = [this.v3, this.v2];
        }
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

        // console.log(`a:${aArea}\nb:${bArea}\nc:${cArea} / ${wholeArea}`);
        // console.log(`${aArea + bArea + cArea} / ${wholeArea}`)

        // Not gonna port this to a class sorreeee
        return {a: aArea/wholeArea, b: bArea/wholeArea, c: cArea/wholeArea};
    }

    translate3dCoordinates(printResults = false){
        // Translate 3d Coordinates to 2D relative to the camera
        if(this.z1 - camera.z <= 0 || this.z2 - camera.z <= 0 || this.z3 - camera.z <= 0)
            return false;

        let PROJECTION_SCALE = 300;
        this.u1 = (this.x1 - camera.x) / (this.z1 - camera.z) * PROJECTION_SCALE;
        this.v1 = (this.y1 - camera.y) / (this.z1 - camera.z) * PROJECTION_SCALE;
        this.u2 = (this.x2 - camera.x) / (this.z2 - camera.z) * PROJECTION_SCALE;
        this.v2 = (this.y2 - camera.y) / (this.z2 - camera.z) * PROJECTION_SCALE;
        this.u3 = (this.x3 - camera.x) / (this.z3 - camera.z) * PROJECTION_SCALE;
        this.v3 = (this.y3 - camera.y) / (this.z3 - camera.z) * PROJECTION_SCALE;

        if(printResults){
            console.log(`u1: ${this.u1}, v1: ${this.v1}\nu2: ${this.u2}, v2: ${this.v2}\nu3: ${this.u3}, v3: ${this.v3}`);
        }
        return true;
    }

    draw(color = "#0f380f"){
        this.printVerticies();
        // Translate the coordinates.
        let good3dCoordinates = this.translate3dCoordinates();
        
        if(!good3dCoordinates){
            // Skip drawing this son (Behind camera)
            console.log(`Not Drawing Triangle bc z-clipped`);
            return;
        }

        this.makeClockwise(); // Do this after translating the vectors

        // Setup The bounding box (CHECK IF I CAN REMOVE COMENTS FOR PERFORMANCE)
        let uMin = Math.floor(Math.min(this.u1, this.u2, this.u3));
        // uMin = Math.max(uMin, 0);
        let vMin = Math.floor(Math.min(this.v1, this.v2, this.v3));
        // vMin = Math.max(vMin, 0);
        let uMax = Math.ceil(Math.max(this.u1, this.u2, this.u3));
        // uMax = Math.min(uMax, ROW_SIZE);
        let vMax = Math.ceil(Math.max(this.v1, this.v2, this.v3));
        // vMax = Math.min(vMax, COLUMN_SIZE);

        console.log(`uMin: ${uMin}, vMin: ${vMin}, uMax: ${uMax}, vMax: ${vMax}`);
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
                    // display.colorPixel(u, v, color);
                    
                    // We need to apply the depth as barycentric coordiantes to get a depth value. 
                    // If a new depth value is > current, draw over. 
                    let newDepth = barycentricHold.a * this.z1 + barycentricHold.b * this.z2 + barycentricHold.c * this.z3;
                    let oldDepth = display.getPixelDepth(u, v);
                    console.log(`new: ${newDepth} < old: ${oldDepth}`);
                    if(newDepth < oldDepth){ // Hanlde ties? (Low Z mean close)
                        display.colorPixel(u, v, newDepth, color);
                    }
                    else{
                        console.log(`Skipped drawing step bc new: ${newDepth} < old: ${oldDepth}`);
                    }
                }
            }
        }
        console.log(`Done Drawing Triangle`);
    }

    // Translations should happen in the update part of game loop, so should apply to 3d
    scale(scalar){
        this.x1 *= scalar;
        this.y1 *= scalar;
        this.z1 *= scalar;
        this.x2 *= scalar;
        this.y2 *= scalar;
        this.z2 *= scalar;
        this.x3 *= scalar;
        this.y3 *= scalar;
        this.z3 *= scalar;
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
        this.x1 += translationVector.x;
        this.y1 += translationVector.y;
        this.z1 += translationVector.z;
        this.x2 += translationVector.x;
        this.y2 += translationVector.y;
        this.z2 += translationVector.z;
        this.x3 += translationVector.x;
        this.y3 += translationVector.y;
        this.z3 += translationVector.z;
    }

    rotateX(theta){
        // Calculate the weights for all of the rotations in the matrix
        let cos = Math.cos(theta * (Math.PI / 180));
        let sin = Math.sin(theta * (Math.PI / 180));
        // Also set up Y holds bc Y changes during calculation
        let yHold = -999;

        // Operations pre-calculated to app to vector. Apply to all vectors X does not change
        yHold = this.y1
        this.y1 = (this.y1 * cos) + (-1 * sin * this.z1);
        this.z1 = (yHold * sin) + (cos * this.z1);

        yHold = this.y2
        this.y2 = (this.y2 * cos) + (-1 * sin * this.z2);
        this.z2 = (yHold * sin) + (cos * this.z2);
        
        yHold = this.y3
        this.y3 = (this.y3 * cos) + (-1 * sin * this.z3);
        this.z3 = (yHold * sin) + (cos * this.z3);
    }
    rotateY(theta){
        // Calculate the weights for all of the rotations in the matrix
        let cos = Math.cos(theta * (Math.PI / 180));
        let sin = Math.sin(theta * (Math.PI / 180));
        // Also set up Y holds bc Y changes during calculation
        let xHold = -999;
        let zHold = -999; // One of these can be avoided but I lowk cant be bothered

        // Operations pre-calculated to app to vector. Apply to all vectors X does not change
        
        // V1
        xHold = this.x1;
        zHold = this.z1;
        this.x1 = (xHold * cos) + (zHold * sin);
        this.y1 = this.y1;
        this.z1 = (xHold * -1 * sin) + (zHold * cos);
        // V2
        xHold = this.x2;
        zHold = this.z2;
        this.x2 = (xHold * cos) + (zHold * sin);
        this.y2 = this.y2;
        this.z2 = (xHold * -1 * sin) + (zHold * cos);
        // V3
        xHold = this.x3;
        zHold = this.z3;
        this.x3 = (xHold * cos) + (zHold * sin);
        this.y3 = this.y3;
        this.z3 = (xHold * -1 * sin) + (zHold * cos);
    }

}

// We can make it regular (equal edge lengths)
class Pyramid{
    constructor(x, y, z, edgeLength = 1){
        this.triangles = [];
        // Setup the basic coordinates
        let topCoordiante = {x: .5, y: 1, z: .5};
        let v1 = {x: 0, y:0, z:0};
        let v2 = {x: 0, y:0, z:1};
        let v3 = {x: 1, y:0, z:1};
        let v4 = {x: 1, y:0, z:0};
        
        // Now add all of these as triangles
        // Bottom (2 triangles for square)
        this.triangles.push(new Triangle(
            v1.x, v1.y, v1.z,
            v2.x, v2.y, v2.z,
            v3.x, v3.y, v3.z,
        ));
        this.triangles.push(new Triangle(
            v3.x, v3.y, v3.z,
            v4.x, v4.y, v4.z,
            v1.x, v1.y, v1.z,
        ));
        // Sides
        this.triangles.push(new Triangle(
            v1.x, v1.y, v1.z,
            topCoordiante.x, topCoordiante.y, topCoordiante.z,
            v2.x, v2.y, v2.z,
        ));
        this.triangles.push(new Triangle(
            v2.x, v2.y, v2.z,
            topCoordiante.x, topCoordiante.y, topCoordiante.z,
            v3.x, v3.y, v3.z,
        ));
        this.triangles.push(new Triangle(
            v3.x, v3.y, v3.z,
            topCoordiante.x, topCoordiante.y, topCoordiante.z,
            v4.x, v4.y, v4.z,
        ));
        this.triangles.push(new Triangle(
            v4.x, v4.y, v4.z,
            topCoordiante.x, topCoordiante.y, topCoordiante.z,
            v1.x, v1.y, v1.z,
        ));

        // Apply the constructor parameters (SCALE THEN TRANSLATE)
        // this.rotateX(90);
        this.vectorScale({x: edgeLength, y: edgeLength, z: edgeLength});
        this.vectorTranslate({x: x, y: y, z: z});
    }

    vectorTranslate(translationVector){
        // Apparently mapping is slower than itterating
        for(let i = 0; i < this.triangles.length; i++){
            this.triangles[i].vectorTranslate(translationVector);
        }
    }

    vectorScale(scalingVector){
        for(let i = 0; i < this.triangles.length; i++){
            this.triangles[i].vectorScale(scalingVector);
        }
    }

    // Theta (Degrees)
    // This is about the origin so it will not work (in a nice way) after any translation
    rotateX(theta){
        // Each Vector in each triangle should have the rotation applied
        for(let i = 0; i < this.triangles.length; i++){
            this.triangles[i].rotateX(theta);            
        }
    }
    rotateY(theta){
        // Each Vector in each triangle should have the rotation applied
        for(let i = 0; i < this.triangles.length; i++){
            this.triangles[i].rotateY(theta);            
        }
    }

    draw(){
        console.log(`Drawing Pyramid`);
        for(let i = 0; i < this.triangles.length; i++){
            let randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`; // Found online
            this.triangles[i].draw(randomColor);
        }
    }
}

// A shape is any grouping of triangles
class Shape{
    constructor(triangles){
        this.triangles = triangles;
    }

    vectorTranslate(translationVector){
        // Apparently mapping is slower than itterating
        for(let i = 0; i < this.triangles.length; i++){
            this.triangles[i].vectorTranslate(translationVector);
        }
    }

    vectorScale(scalingVector){
        for(let i = 0; i < this.triangles.length; i++){
            this.triangles[i].vectorScale(scalingVector);
        }
    }

    // Theta (Degrees)
    // This is about the origin so it will not work (in a nice way) after any translation
    rotateX(theta){
        // Each Vector in each triangle should have the rotation applied
        for(let i = 0; i < this.triangles.length; i++){
            this.triangles[i].rotateX(theta);            
        }
    }
    rotateY(theta){
        // Each Vector in each triangle should have the rotation applied
        for(let i = 0; i < this.triangles.length; i++){
            this.triangles[i].rotateY(theta);            
        }
    }

    draw(){
        console.log(`Drawing Shape`);
        for(let i = 0; i < this.triangles.length; i++){
            let randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`; // Found online
            this.triangles[i].draw(randomColor);
        }
    }

}

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
        display.colorPixel(i, Math.round(y1 + slope*i), Infinity);
    }
}


function drawTriangle(px1, py1, px2, py2, px3, py3, color = "#0f380f"){
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
                display.colorPixel(x, y, Infinity, color);
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
    coloredSet.forEach(value => {value.element.style.backgroundColor = "#9bbc0f";
        value.depth = Infinity;
    })
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


// let test3D = new Pyramid(0, 0, 0, 1); // 'unit pyramid'
let testShapeTriangles = null;

function main(){
    const testDepth = 1;
    // Define some cube Verticies
    let sq1 = {x: 0, y: 0, z: 0};
    let sq2 = {x: 0, y: 0, z: 1};
    let sq3 = {x: 1, y: 0, z: 1};
    let sq4 = {x: 1, y: 0, z: 0};
    let sq5 = {x: 0, y: 1, z: 0};
    let sq6 = {x: 0, y: 1, z: 1};
    let sq7 = {x: 1, y: 1, z: 1};
    let sq8 = {x: 1, y: 1, z: 0};
    
    // A square has 6 sides, Needs 12 triangles
    testShapeTriangles = new Shape([
        // Bottom
        new Triangle(sq1.x, sq1.y, sq1.z,
            sq2.x, sq2.y, sq2.z,
            sq4.x, sq4.y, sq4.z,
        ), // 1 2 4
        new Triangle(sq2.x, sq2.y, sq2.z,
            sq3.x, sq3.y, sq3.z,
            sq4.x, sq4.y, sq4.z,
        ), // 2 3 4
        // Top
        new Triangle(sq5.x, sq5.y, sq5.z,
            sq6.x, sq6.y, sq6.z,
            sq8.x, sq8.y, sq8.z,
        ), // 5 6 8
        new Triangle(sq6.x, sq6.y, sq6.z,
            sq7.x, sq7.y, sq7.z,
            sq8.x, sq8.y, sq8.z,
        ), // 6 7 8
        // Close Side
        new Triangle(sq1.x, sq1.y, sq1.z,
            sq5.x, sq5.y, sq5.z,
            sq4.x, sq4.y, sq4.z,
        ), // 1 5 4
        new Triangle(sq5.x, sq5.y, sq5.z,
            sq8.x, sq8.y, sq8.z,
            sq4.x, sq4.y, sq4.z,
        ), // 5 8 4
        // Far Side
        new Triangle(sq2.x, sq2.y, sq2.z,
            sq6.x, sq6.y, sq6.z,
            sq7.x, sq7.y, sq7.z,
        ), // 2 6 7
        new Triangle(sq6.x, sq6.y, sq6.z,
            sq7.x, sq7.y, sq7.z,
            sq3.x, sq3.y, sq3.z,
        ), // 6 7 3
        // Left Side
        new Triangle(sq1.x, sq1.y, sq1.z,
            sq5.x, sq5.y, sq5.z,
            sq2.x, sq2.y, sq2.z,
        ), // 1 5 2
        new Triangle(sq5.x, sq5.y, sq5.z,
            sq6.x, sq6.y, sq6.z,
            sq2.x, sq2.y, sq2.z,
        ), // 5 6 2
        // Right Side
        new Triangle(sq3.x, sq3.y, sq3.z,
            sq4.x, sq4.y, sq4.z,
            sq8.x, sq8.y, sq8.z,
        ), // 3 4 8
        new Triangle(sq4.x, sq4.y, sq4.z,
            sq8.x, sq8.y, sq8.z,
            sq7.x, sq7.y, sq7.z,
        ), // 4 8 7
    ]);

    testShapeTriangles.vectorScale({x: 50, y: 50, z:50});
    testShapeTriangles.vectorTranslate({x: 100, y: 100, z: 300});
    testShapeTriangles.draw();

    let unitTriangle = new Triangle(
        0, 0, 1,
        1, 2, 1,
        2, 0, 1,
    );
    unitTriangle.scale(30);
    unitTriangle.vectorTranslate({x: 50, y: 50, z: DISTANCE_MEDIUM});

    
    let backTriangle = new Triangle(
        0, 0, 1,
        1, 2, 1,
        2, 0, 1,
    );
    backTriangle.scale(20);
    backTriangle.vectorTranslate({x: 120, y: 90, z: DISTANCE_FAR});
    
    // backTriangle.draw("#0000FF");
    // unitTriangle.draw("#FF0000");
}

main();
const ROW_SIZE = 200;
const COLUMN_SIZE = 320;

const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
const PIXEL_SIZE = 5;
const BACKGROUND_COLOR = "#9bbc0f";
const ON_COLOR = "#0f380f";

const FONT = {
    'S': [ {x1:0,y1:4,x2:2,y2:4}, {x1:0,y1:4,x2:0,y2:2}, {x1:0,y1:2,x2:2,y2:2}, {x1:2,y1:2,x2:2,y2:0}, {x1:2,y1:0,x2:0,y2:0} ],
    'T': [ {x1:0,y1:4,x2:2,y2:4}, {x1:1,y1:4,x2:1,y2:0} ],
    'A': [ {x1:0,y1:0,x2:1,y2:4}, {x1:2,y1:0,x2:1,y2:4}, {x1:0,y1:2,x2:2,y2:2} ],
    'R': [ {x1:0,y1:0,x2:0,y2:4}, {x1:0,y1:4,x2:2,y2:4}, {x1:2,y1:4,x2:2,y2:2}, {x1:0,y1:2,x2:2,y2:2}, {x1:0,y1:2,x2:2,y2:0} ],
    'E': [ {x1:0,y1:0,x2:0,y2:4}, {x1:0,y1:4,x2:2,y2:4}, {x1:0,y1:2,x2:2,y2:2}, {x1:0,y1:0,x2:2,y2:0} ],
    'L': [ {x1:0,y1:0,x2:0,y2:4}, {x1:0,y1:0,x2:2,y2:0} ],
    'C': [ {x1:2,y1:4,x2:0,y2:4}, {x1:0,y1:4,x2:0,y2:0}, {x1:0,y1:0,x2:2,y2:0} ],
    ' ': []
};
// This class will be used to draw on the 320x200 grid
// Via the 5 pixel by 5 pixel squares on the canvas.

class displayGrid{
    constructor(){
        this.displayMatrix = Array.from({ length: ROW_SIZE }, () =>
            Array.from({ length: COLUMN_SIZE }, () => BACKGROUND_COLOR)
        );
    }

    colorPixel(x, y, color = ON_COLOR){
        if(x < 0 || x >= COLUMN_SIZE || y < 0 || y >= ROW_SIZE){
            console.log("Pixel was outside of drawable range, skipping");
            return;
        }
        this.displayMatrix[ROW_SIZE-1 - y][x] = color;
    }

    render(){
        for(let r = 0; r < ROW_SIZE; r++){
            for(let c = 0; c < COLUMN_SIZE; c++){
                ctx.fillStyle = this.displayMatrix[r][c];
                ctx.fillRect(c*PIXEL_SIZE, r*PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            }
        }
    }
}
function drawChar(char, x, y){
    const glyph = FONT[char];
    if(!glyph) return; // unknown character, just skip it
    for(const seg of glyph){
        makePixelatedLine(x + seg.x1, y + seg.y1, x + seg.x2, y + seg.y2);
    }
}

function drawText(str, x, y){
    const CHAR_WIDTH = 4; // 3-wide glyph + 1 pixel gap
    for(let i = 0; i < str.length; i++){
        drawChar(str[i], x + i*CHAR_WIDTH, y);
    }
}

function drawCursor(x, y){
    makePixelatedLine(x, y+4, x+3, y+2);
    makePixelatedLine(x+3, y+2, x, y);
}
function makePixelatedLine(x1, y1, x2, y2){
    const dx = x2 - x1;
    const dy = y2 - y1;

    if (Math.abs(dx) >= Math.abs(dy)) {
        // horizontal-dominant (or 45°) — walk over x
        const slope = dx !== 0 ? dy / dx : 0;
        const xStart = Math.min(x1, x2);
        const xEnd = Math.max(x1, x2);

        for (let i = xStart; i <= xEnd; i++) {
            const y = y1 + slope * (i - x1);
            display.colorPixel(i, Math.round(y));
        }
    } else {
        // vertical-dominant — walk over y
        const slope = dy !== 0 ? dx / dy : 0;
        const yStart = Math.min(y1, y2);
        const yEnd = Math.max(y1, y2);
        
        for (let i = yStart; i <= yEnd; i++) {
            const x = x1 + slope * (i - y1);
            display.colorPixel(Math.round(x), i);
        }
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
    for(let r = 0; r < ROW_SIZE; r++){
        display.displayMatrix[r].fill(BACKGROUND_COLOR);
    }
}


// I want to make this global so that I can access anywhere easily. 
const display = new displayGrid();
const coloredSet = new Set(); // This may be needed for performance idk

let gameState = "MENU"; // "MENU" | "CHARACTER_SELECT" | "PLAYING"

const menuOptions = [
    { label: "START", x: 100, y: 80 },
    { label: "SELECT CAT", x: 100, y: 100 },
];
let selectedOption = 0;

function handleMenuInput(key){
    if(key === "ArrowUp"){
        selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
        console.log(`Selected option: ${selectedOption}`);
    }
    else if(key === "ArrowDown"){
        selectedOption = (selectedOption + 1) % menuOptions.length;
        console.log(`Selected option: ${selectedOption}`);
    }
    else if(key === "Enter"){
        const chosen = menuOptions[selectedOption].label;
        console.log(`Chose: ${chosen}`);
        if(chosen === "START"){
            gameState = "CHARACTER_SELECT";
        }
        else if(chosen === "SELECT CAT"){
            gameState = "CHARACTER_SELECT";
        }
        console.log(`gameState is now: ${gameState}`);
    }
}

function handleCharacterSelectInput(key){
    // We'll fill this in next step
}

document.addEventListener("keydown", (e) => {
    if(gameState === "MENU"){
        handleMenuInput(e.key);
    }
    else if(gameState === "CHARACTER_SELECT"){
        handleCharacterSelectInput(e.key);
    }
});

// Game logic should happen here
function update(){
    if(gameState === "MENU") updateMenu();
    else if(gameState === "CHARACTER_SELECT") updateCharacterSelect();
    else if(gameState === "PLAYING") updateGame();
}

function updateMenu(){}
function updateCharacterSelect(){}
function updateGame(){}

function draw(){
    clearDisplay();

    if(gameState === "MENU") drawMenu();
    else if(gameState === "CHARACTER_SELECT") drawCharacterSelect();
    else if(gameState === "PLAYING") drawGame();

    display.render();
}

function drawMenu(){
    menuOptions.forEach((option, index) => {
        drawText(option.label, option.x, option.y);
        if(index === selectedOption){
            drawCursor(option.x - 6, option.y);
        }
    });
}
function drawCharacterSelect(){}
function drawGame(){}

// I got this off github which is apparently the best way to run a game
function gameLoop(){
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function main(){
   
    gameLoop();

    //display.colorPixel(10, 10);
    //makePixelatedLine(0, 0, 319, 199);
    //drawTriangle(50, 50, 100, 100, 150, 50);
}

main();
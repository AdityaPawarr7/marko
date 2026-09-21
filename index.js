// NOTE THAT THIS WILL USE THE LEFT HAND RULE FOR X,Y,Z
// Positive Z means it's Depth is away from camera (100 = far, 1 = close )

const CLOSE = 10;
const KINDA_CLOSE = 30;
const KINDA_FAR = 70;
const FAR = 100;
const SUPER_FAR = 1000;
const SCREEN_WIDTH = 320;
const SCREEN_HEIGHT = 200;

function setupCanvas(){
    // our goal is to create a game or interactive art display on mock SCREEN_WIDTHxSCREEN_HEIGHT pixel display (using your computers display).  SCREEN_WIDTHxSCREEN_HEIGHT is an example resolution of computer screens from the early 1980s.  
    ctx.width = SCREEN_WIDTH;
    ctx.height = SCREEN_HEIGHT;
    // Background color for canvas
    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // canvas Line style
    ctx.fillStyle = "white"; // Your choice of hex, RGB, or color name
    ctx.lineWidth = 2;
}

class CatHead{
    // x, y, z coordinates of the bottom of the cat head
    constructor(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
    this.z = KINDA_FAR; // Just make it far for now
    this.vertices = [];
    this.edges = [];
  }

  draw(){
    // Setup the Verticies and Edges
    this.vertices = [
    // Right Head Shape
    { x: 999, y: -999, z: this.z},  // 0 (Dummy bc forgot to index at 0)
    { x: 0, y: 0, z: this.z},  // 1
    { x: 5, y: 2, z: this.z},  // 2
    { x: 6, y: 4, z: this.z},  // 3
    { x: 7, y: 7, z: this.z},  // 4
    { x: 6, y: 10, z: this.z},  // 5
    // Right Ear
    { x: 5, y: 11, z: this.z},  // 6
    { x: 4, y: 12, z: this.z},  // 7
    { x: 6, y: 14, z: this.z},  // 8
    { x: 7, y: 16, z: this.z},  // 9
    // Right end of Head
    { x: 3, y: 13, z: this.z},  // 10
    { x: 0, y: 14, z: this.z},  // 11
    // Right Eye
    { x: 3, y: 8, z: this.z},  // 12
    { x: 2, y: 9, z: this.z},  // 13
    { x: 3, y: 10, z: this.z},  // 14
    { x: 4, y: 9, z: this.z},  // 15
    // Right Mouth
    { x: 0, y: 3, z: this.z},  // 16
    { x: 1, y: 4, z: this.z},  // 17
    { x: 2, y: 3, z: this.z},  // 18
    // Right Whisekrs
    { x: 4, y: 3, z: this.z},  // 19
    { x: 9, y: 1, z: this.z},  // 20
    { x: 4, y: 4, z: this.z},  // 21
    { x: 9, y: 3, z: this.z},  // 22
    { x: 4, y: 5, z: this.z},  // 23
    { x: 9, y: 6, z: this.z},  // 24

    // Left Cat Head
    { x: -0, y: 0, z: this.z},  // 24 + 1 (Actually did a rly cool workflow to automatically make the reflected verticies and the edges. To do so I used multiple cursors so starting again after 24 was best method)
    { x: -5, y: 2, z: this.z},  // 24 + 2
    { x: -6, y: 4, z: this.z},  // 24 + 3
    { x: -7, y: 7, z: this.z},  // 24 + 4
    { x: -6, y: 10, z: this.z},  // 24 + 5
    // Left Ear
    { x: -5, y: 11, z: this.z},  // 24 + 6
    { x: -4, y: 12, z: this.z},  // 24 + 7
    { x: -6, y: 14, z: this.z},  // 24 + 8
    { x: -7, y: 16, z: this.z},  // 24 + 9
    // Left end of Head
    { x: -3, y: 13, z: this.z},  // 24 + 10
    { x: -0, y: 14, z: this.z},  // 24 + 11
    // Left Eye
    { x: -3, y: 8, z: this.z},  // 24 + 12
    { x: -2, y: 9, z: this.z},  // 24 + 13
    { x: -3, y: 10, z: this.z},  // 24 + 14
    { x: -4, y: 9, z: this.z},  // 24 + 15
    // Left Mouth
    { x: -0, y: 3, z: this.z},  // 24 + 16
    { x: -1, y: 4, z: this.z},  // 24 + 17
    { x: -2, y: 3, z: this.z},  // 24 + 18
    // Left Whisekrs
    { x: -4, y: 3, z: this.z},  // 24 + 19
    { x: -9, y: 1, z: this.z},  // 24 + 20
    { x: -4, y: 4, z: this.z},  // 24 + 21
    { x: -9, y: 3, z: this.z},  // 24 + 22
    { x: -4, y: 5, z: this.z},  // 24 + 23
    { x: -9, y: 6, z: this.z},  // 24 + 24
  ];

  this.edges = [
    // Right Head Shape
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    // Right Ear
    [5, 6],
    [6, 8],
    [7, 8],
    [5, 9],
    [9, 10],
    // Right End Of Head
    [10, 11],
    // Right Eye
    [12, 13],
    [13, 14],
    [14, 15],
    [15, 12],
    // Right Mouth
    [16, 17],
    [17, 18],
    // Right Whiskers
    [19, 20],
    [21, 22],
    [23, 24],

    // Left Head Shape
    [24 + 1, 24 + 2],
    [24 + 2, 24 + 3],
    [24 + 3, 24 + 4],
    [24 + 4, 24 + 5],
    // Left Ear
    [24 + 5, 24 + 6],
    [24 + 6, 24 + 8],
    [24 + 7, 24 + 8],
    [24 + 5, 24 + 9],
    [24 + 9, 24 + 10],
    // Left End Of Head
    [24 + 10, 24 + 11],
    // Left Eye
    [24 + 12, 24 + 13],
    [24 + 13, 24 + 14],
    [24 + 14, 24 + 15],
    [24 + 15, 24 + 12],
    // Left Mouth
    [24 + 16, 24 + 17],
    [24 + 17, 24 + 18],
    // Left Whiskers
    [24 + 19, 24 + 20],
    [24 + 21, 24 + 22],
    [24 + 23, 24 + 24],
  ];

    // Translate the verticies to U, V Coords relative to camera (Flip V for Canvas)
    let projectedVertices = []
    for(let i = 0; i < this.vertices.length; i++){

        let relativeCamVert = {
          // Is it vertex - camera?
          // x: this.vertices[i].x - camera.x,
          // y: this.vertices[i].y - camera.y,
          // z: this.vertices[i].z - camera.z,

          // Or is it sub from the camera (I think so)
          x: camera.x - this.vertices[i].x,
          y: camera.y - this.vertices[i].y,
          z: camera.z - this.vertices[i].z,
        }

        // Find the 2d coords
        let newU = relativeCamVert.x / relativeCamVert.z
        let newV = relativeCamVert.y / relativeCamVert.z
        
        // Apply Translation and transformations here (rn from HW)
        newU = newU * 300; // Scale U
        newV = newV * 300; // Scale V

        // Translation happens after scale
        newU += this.x;
        newV += this.y;

        // Add the final verticies
        projectedVertices.push({u: newU, v:newV});
      }
      
    // Now time to draw the edges
    for(let i = 0; i < this.edges.length; i++){
      // Get from the projected, the first edge first component (u)
      let fromU = projectedVertices[this.edges[i][0]].u
      // Same here but make sure to remove from canvas height bc canvas coordinates
      let fromV = canvas.height - projectedVertices[this.edges[i][0]].v
      let toU = projectedVertices[this.edges[i][1]].u
      let toV = canvas.height - projectedVertices[this.edges[i][1]].v

      drawLine(fromU, fromV, toU, toV);
    }
  }
};
class Treat{
    constructor(height, width) {
    this.height = height;
    this.width = width;
  }
};

// Going to keep the camera at origin
const camera = {x: 0, y: 0, z: 0};

// Using Canvas Draw Line Fn for now (Change late g)
function drawLine(x1, y1, x2, y2){
  console.log(`-x1: ${x1}, y1: ${y1}, x2: ${x2}, y2:${y2}`);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function makePixelatedLine(x1, y1, x2, y2){
  // Step 1: Find the slop of the line
  const slope = (y2-y1) / (x2 - x1); 
  // Step 2: Itterate through the x points of the line
  for(let i = x1; i < x2; i++){
    // Step 3: Draw pixel for the found pixel location.
    // x, y, w, l
    let rectX = i;
    let rectY = canvas.height - (y1 + slope * i);
    ctx.strokeStyle = "white";
    ctx.rect(rectX, rectY, 1, 1);
    ctx.stroke();
  }
}

function update(){
  // Game logic

  // Update the position of the Cat head via a cyclic formula (Figure 8 ish)
}

function draw(){
  // margo.draw();
}

// Since this is gonna be a game, found some ppls examples of canvas frame logic
function gameLoop(){
  update();
  draw();
  requestAnimationFrame(gameLoop);
}


// Just doing global for canvas and ctx
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function main(){
  console.log("index main function");
  
  setupCanvas();
  
  margo = new CatHead(canvas.width/2, canvas.height/2, 0);
  // margo.draw();
  // koko = new CatHead();
  makePixelatedLine(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  makePixelatedLine(SCREEN_WIDTH * 1/4, SCREEN_HEIGHT/2, SCREEN_WIDTH * 3/4, SCREEN_HEIGHT/2);

  gameLoop(); // Start game logic // how to pass in components
}

// Actually run main
main();
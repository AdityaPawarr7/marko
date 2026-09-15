// NOTE THAT THIS WILL USE THE LEFT HAND RULE FOR X,Y,Z
// Positive Z means it's Depth is away from camera (100 = far, 1 = close )


function setupCanvas(){
    // our goal is to create a game or interactive art display on mock 320x200 pixel display (using your computers display).  320x200 is an example resolution of computer screens from the early 1980s.  
    ctx.width = 320;
    ctx.height = 200;
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
    this.verticies = [];
    this.edges = [];
  }

  draw(){
    // Setup the Verticies and Edges
    this.vertices = [
    // Right Head Shape
    { x:  0,  y: 0,  z: 1},   // 0 (Dummy bc forgot to index at 0)
    { x:  1,  y: 1,  z: 1},   // 1
    { x:  1,  y: 1,  z: 1},   // 2
    { x:  1,  y: 1,  z: 1},   // 3
    { x:  1,  y: 1,  z: 1},   // 4
    { x:  1,  y: 1,  z: 1},   // 5
    // Right Ear
    { x:  1,  y: 1,  z: 1},   // 6
    { x:  1,  y: 1,  z: 1},   // 7
    { x:  1,  y: 1,  z: 1},   // 8
    { x:  1,  y: 1,  z: 1},   // 9
    { x:  1,  y: 1,  z: 1},   // 10
    // Right end of Head
    { x:  1,  y: 1,  z: 1},   // 11
    // Right Eye
    { x:  1,  y: 1,  z: 1},   // 12
    { x:  1,  y: 1,  z: 1},   // 13
    { x:  1,  y: 1,  z: 1},   // 14
    { x:  1,  y: 1,  z: 1},   // 15
    // Right Mouth
    { x:  1,  y: 1,  z: 1},   // 16
    { x:  1,  y: 1,  z: 1},   // 17
    { x:  1,  y: 1,  z: 1},   // 18
    // Right Whisekrs
    { x:  1,  y: 1,  z: 1},   // 19
    { x:  1,  y: 1,  z: 1},   // 20
    { x:  1,  y: 1,  z: 1},   // 21
    { x:  1,  y: 1,  z: 1},   // 22
    { x:  1,  y: 1,  z: 1},   // 23
    { x:  1,  y: 1,  z: 1},   // 24

    // Left Cat Head
  ];

  let edges = [
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
  ];

    // Translate the verticies to U, V Coords relative to camera (Flip V for Canvas)
    let projectedVertices = []
    for(let i = 0; i < vertices.length; i++){
        newU = vertices[i].y / vertices[i].z
        newZ = vertices[i].x / vertices[i].z
        projectedVertices.push({u: newU, v:newZ});
    }

    // From each point, draw line to edges

    for(let i = 0; i < edges.length; i++){
        
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
  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function main(){
    console.log("index main function");
    
    setupCanvas();
    
    margo = new CatHead();
    // koko = new CatHead();
    
}

// Just doing global for canvas and ctx
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
// Actually run main
main();
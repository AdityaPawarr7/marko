// NOTE THAT THIS WILL USE THE LEFT HAND RULE FOR X,Y,Z
// Positive Z means it's Depth is away from camera


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
  }

  draw(){
    // Setup the Verticies and Edges
    let vertices = [ 
    { x:  1,  y: 1,  z: 1},   // 0
    { x:  1,  y: -1, z:  -1}, // 1
    { x: -1,  y: -1, z: -1}   // 2
  ];

  let edges = [
    [0, 1], // 0->1
    [1, 2], // 1->2
    [2, 0], // 2->0
  ]

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
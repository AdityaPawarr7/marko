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
                // 1. Create the physical HTML box
                const cell = document.createElement('div');
                cell.className = 'pixel';
                
                // 2. Link the HTML element directly into your 2D array matrix
                this.displayMatrix[r][c].element = cell;

                // 3. Append to our off-screen fragment
                fragment.appendChild(cell);
            }
        }
        matrix.appendChild(fragment);
    }

    colorPixel(row, col){
        const pixel = this.displayMatrix[row][col];
        pixel.element.style.backgroundColor = "#FF0000";
    }

};

function main(){
    const display = new displayGrid();
    display.colorPixel(200, 100);
}

// run the code
main();
console.log('Loading Game of Life');

const canvas = document.querySelector('#life');
const ctx = canvas.getContext('2d');
const {height, width} = canvas;

const GRID_COUNT = 42;
const CELL_SIZE = width/GRID_COUNT;

const COLORS = {
  live: 'rgb(0, 0, 0)',
  dead: 'rgb(255, 255, 255)'
};

// Uses function declaration for binding `this`
// to the canvas context.
function _renderBox (isLive, xGrid, yGrid) {
  this.fillStyle = isLive ? COLORS.live : COLORS.dead;
  this.fillRect(xGrid*CELL_SIZE,
                yGrid*CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE);
}

//
const liveAt = _renderBox.bind(ctx, true);
const deadAt = _renderBox.bind(ctx, false);

let x = 0;
let y = 0;
let rafID;

const animate = () => {


  liveAt(x, y);
  x++;
  if (x == 42) {
    x = 0;
    y++
  };

  if (y == 42) {
    cancelAnimationFrame(rafID);
  } else {
    rafID = requestAnimationFrame(animate);    
  }
}

rafID = requestAnimationFrame(animate);

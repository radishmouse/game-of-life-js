console.log('Loading Game of Life');

const canvas = document.querySelector('#life');
const ctx = canvas.getContext('2d');
const {height, width} = canvas;

const CELLS_PER_ROW = 42;

const COLORS = {
  live: 'rgb(0, 0, 0)',
  dead: 'rgb(255, 255, 255)'
};

const CELL_SIZE = width/CELLS_PER_ROW;

function _renderBox (isLive, x, y) {
  this.fillStyle = isLive ? COLORS.live : COLORS.dead;
  this.fillRect(x, y, CELL_SIZE, CELL_SIZE);
}

const renderLive = _renderBox.bind(ctx, true);
const renderDead = _renderBox.bind(ctx, false);

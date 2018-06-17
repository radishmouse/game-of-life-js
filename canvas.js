console.log('Loading Game of Life');

const {
  newBoard,
  neighborCoordinatesForBoard,
  boardAsNumberOfNeighbors,
  isLive,
  isUnderPopulated,
  isOverPopulated,
  willContinue,
  canReproduce,
  SIZE
} = life;

const playPause = document.querySelector('[data-play-pause]');
const reload = document.querySelector('[data-reload]');

const startClass = 'fa-play';
const pauseClass = 'fa-pause';


const canvas = document.querySelector('#life');
const ctx = canvas.getContext('2d');
const {height, width} = canvas;

const UPDATE_FREQUENCY = 30;
const GRID_COUNT = SIZE;
const CELL_SIZE = width/GRID_COUNT;

const COLORS = {
  // live: 'rgba(200, 0, 0, 1)',
  live: 'rgba(40, 169, 255, 0.75)',
  dead: 'rgba(255, 255, 255, 0.5)'
};

// Uses function declaration for binding `this`
// to the canvas context.
function _renderBox (isLive, xGrid, yGrid) {
  this.lineWidth = 0.8;
  this.strokeStyle = isLive ? COLORS.live : COLORS.dead;
  this.strokeRect(xGrid*CELL_SIZE,
                yGrid*CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE);
}

//
const liveAt = _renderBox.bind(ctx, true);
const deadAt = _renderBox.bind(ctx, false);

const numberToIsLive = (number, cell) => {
  if (isLive(cell)) {
    if (isUnderPopulated(number)) {
      // return DEAD;
      return false;
    } else if (isOverPopulated(number)) {
      // return DEAD;
      return false
    } else if (willContinue(number)) {
      // return LIVE;
      return true;
    }
  } else if (canReproduce(number)){
    // return LIVE;
    return true;
  } else {
    // return DEAD;
    return false;
  }
};

// Given rows or boards of cells and neighbor counts, calculate next states.
const numberRowAsLiveDeadCells = (rowOfNumbers, rowOfCells) => rowOfNumbers.map((n, i) => numberToIsLive(n, rowOfCells[i]));
const numberBoardAsLiveDeadCells = (boardOfNumbers, boardOfCells) => boardOfNumbers.map((r, i) => numberRowAsLiveDeadCells(r, boardOfCells[i]));


const renderRow = (r, y) => r.map((c, i) => (c ? liveAt(i, y) : deadAt(i, y)) && c);
const renderBoard = b => b.map(renderRow);


let rafID;
let board = newBoard(true);
const coords = neighborCoordinatesForBoard(board);
let neighbors;         // The game board as number of live neighbors per cell.
let isRunning = false;
const main = () => {

  if (isRunning) {
    // Given a board, calculate all the valid neighbor coordinates.
    neighbors = boardAsNumberOfNeighbors(board, coords);  // Calculate live neighbor counts.
    board = numberBoardAsLiveDeadCells(neighbors, board); // Calculate next state of board.
    renderBoard(board);
    
    setTimeout(() => {
      rafID = requestAnimationFrame(main);    
    }, UPDATE_FREQUENCY);    
  }

}

const togglePlaying = () => {
  if (isRunning) {
    cancelAnimationFrame(rafID);
    playPause.querySelector('i').classList.add(startClass);
    playPause.querySelector('i').classList.remove(pauseClass);        
  } else {
    rafID = requestAnimationFrame(main);
    playPause.querySelector('i').classList.remove(startClass);
    playPause.querySelector('i').classList.add(pauseClass);        
  }
  isRunning = !isRunning;
};

const reloadBoard = () => board = newBoard(true);

playPause.addEventListener('click', togglePlaying);
reload.addEventListener('click', reloadBoard);

document.addEventListener('keydown', (e) => {
  console.log(e.keyCode);
  if (e.getModifierState('Control')) {
    return;
  }
  switch (e.keyCode) {
  case 32:
  case 13:
    e.preventDefault();
    togglePlaying()
    break;
  case 82:
    e.preventDefault();
    reloadBoard();
    break;
  }
})

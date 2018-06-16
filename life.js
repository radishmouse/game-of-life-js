
const SIZE = 42; // Size of (square) board
const INTERVAL = 300; // Frequency of screen updates
const THRESHOLD = 33; // % chance a cell will be seeded with life

// Printable representations of cells
const LIVE = '@';
const DEAD = ' ';

// ---------------------------------------------------------------------
// The rules
/*
-  Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
-  Any live cell with two or three live neighbours lives on to the next generation.
-  Any live cell with more than three live neighbours dies, as if by overpopulation.
-  Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.  
*/

const FEW = 2;
const MANY = 3;
const PLENTY = 3;

const isLive = c => c === LIVE;
const isUnderPopulated = n => n < FEW;
const isOverPopulated = n => n > MANY;
const canReproduce = n => n === PLENTY;
const willContinue = n => !(isUnderPopulated(n)) && !(isOverPopulated(n));

// ---------------------------------------------------------------------

const getRandomInt = (max, min=0) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// New boards are rows of DEAD cells, optionally seeded with LIVE cells.
const newRow = () => Array(SIZE).fill(DEAD);
const newBoard = shouldSeed => {
  let board = newRow().map(newRow);
  if (shouldSeed) {
    board = board.map(row => row.map(_ => getRandomInt(100) < THRESHOLD ? LIVE : DEAD))
  }
  return board;
}

// When counting live neighbors, make sure to stay within array bounds.
const isWithinBounds = v => v >= 0 && v < SIZE;
const areWithinBounds = (x, y) => isWithinBounds(x) && isWithinBounds(y);

// Given a coordinate pair, return an array of valid neighbor coordinate pairs.
const neighborCoordinates = (x, y) => [
  [x-1, y-1], [x, y-1], [x+1, y-1],
  [x-1, y],             [x+1, y],
  [x-1, y+1], [x, y+1], [x+1, y+1],  
].filter(xyArr => areWithinBounds(...xyArr));

// Functions to produce board containing coordinate pairs for each cell.
const coordsForRow = (r, x=0) => r.map((_, y) => [x, y]);
const coordsForBoard = b => b.map(coordsForRow);

// Functions to produce board containing array of valid neighbor coordinate pairs.
const neighborCoordinatesForRow = (r, x=0) => coordsForRow(r, x).map(xyArr => neighborCoordinates(...xyArr));
const neighborCoordinatesForBoard = b => b.map(neighborCoordinatesForRow);

// Retrieve value of cell at specified coordinates.
const cellAtCoorinate = (board, x, y) => board[x][y];

// Given a board and an array of neighbor coordinates, retrieve the neighbor cells.
const neighborCellsForCoordinateArray = (board, arrayOfNeighborCoors) => {
  return arrayOfNeighborCoors.map(neighborCoordsForCell => {
    return neighborCoordsForCell.map(coordsArray => {
      return coordsArray.map(xyArray => cellAtCoorinate(board, ...xyArray))
    })
  })
};

// Given a board and an array of neighbor coordinates, return a board with the live neighbor count
// for each cell.
const boardAsNumberOfNeighbors = (board, arrayOfNeighborCoords) => {
  return neighborCellsForCoordinateArray(board, arrayOfNeighborCoords).map(neighborCellsForRow => {
    return neighborCellsForRow.map(neighborCellsForCell => {
      return neighborCellsForCell
        .filter(isLive)
        .reduce((total, _) => total + 1, 0)
    });
  });
};

// Given a live neighbor count and a cell, calculate the cell's next state.
const numberToLiveDead = (number, cell) => {
  if (isLive(cell)) {
    if (isUnderPopulated(number)) {
      return DEAD;
    } else if (isOverPopulated(number)) {
      return DEAD;
    } else if (willContinue(number)) {
      return LIVE;
    }
  } else if (canReproduce(number)){
    return LIVE;
  } else {
    return DEAD;
  }
};

// Given rows or boards of cells and neighbor counts, calculate next states.
const numberRowAsLiveDeadCells = (rowOfNumbers, rowOfCells) => rowOfNumbers.map((n, i) => numberToLiveDead(n, rowOfCells[i]));
const numberBoardAsLiveDeadCells = (boardOfNumbers, boardOfCells) => boardOfNumbers.map((r, i) => numberRowAsLiveDeadCells(r, boardOfCells[i]));

// Functions for printing to the console.
const printRow = r => r.join(' ');  // A little horizontal space looks better
const printBoard = b => {
  const boardAsString = b.map(printRow).join('\n');
  console.log(boardAsString);
  return boardAsString;
};

// The game loop!
const main = board => {
  // Given a board, calculate all the valid neighbor coordinates.
  const coords = neighborCoordinatesForBoard(board);
  
  let neighbors;         // The game board as number of live neighbors per cell.
  let generation = 0;    // What generation we're on.
  let curr = '';         // Current generation as a string.
  let prev = '';         // For checking if this generation is same as current - 1.
  let prevMinusOne = ''; // For checking if this generation is same as current - 2.
  
  let tick = setInterval(() => {
    neighbors = boardAsNumberOfNeighbors(board, coords);  // Calculate live neighbor counts.
    board = numberBoardAsLiveDeadCells(neighbors, board); // Calculate next state of board.
    console.clear();
    prevMinusOne = prev.slice();  // Copy string representation of current - 2.
    prev = curr.slice();          // Copy string representation of current - 1.
    curr = printBoard(board);     // Print board, saving string representation.
    console.log(`Generation ${generation}`);
    generation++;

    // If the current generation is identical to one of the previous two,
    // then we've reached the end of the simulation.
    if (curr === prev || curr === prevMinusOne) {
      clearInterval(tick);
    }
  }, INTERVAL);
};

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  // This must be node!
  module.exports = () => {
    main(newBoard(true)); // Start game with new board, seeded with some live cells.      
  }
}



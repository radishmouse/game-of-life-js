

/*
The rules:
-  Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
-  Any live cell with two or three live neighbours lives on to the next generation.
-  Any live cell with more than three live neighbours dies, as if by overpopulation.
-  Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  
*/



const SIZE = 42;
const INTERVAL = 333;
const LIVE = '@';
const DEAD = ' ';

const FEW = 2;
const MANY = 3;
const PLENTY = 3;

const isLive = c => c === LIVE;
const isUnderPopulated = n => n < FEW;
const isOverPopulated = n => n > MANY;
const canReproduce = n => n === PLENTY;
const willContinue = n => !(isUnderPopulated(n)) && !(isOverPopulated(n));

const getRandomInt = (max, min=0) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const newRow = () => Array(SIZE).fill(DEAD);
const newBoard = shouldSeed => {
  let board = newRow().map(newRow);
  if (shouldSeed) {
    board = board.map(row => row.map(c => {
      return getRandomInt(100) < 50 ? LIVE : DEAD
    }))
  }

  return board;
}

const cloneRow = r => r.slice();
const cloneBoard = b => b.map(cloneRow);

const isWithinBounds = v => v >= 0 && v < SIZE;
const areWithinBounds = (x, y) => isWithinBounds(x) && isWithinBounds(y);

const neighborCoordinates = (x, y) => [
  [x-1, y-1], [x, y-1], [x+1, y-1],
  [x-1, y],             [x+1, y],
  [x-1, y+1], [x, y+1], [x+1, y+1],  
].filter(xyArr => areWithinBounds(...xyArr));

// console.log(neighborCoordinates(0, 0));

const coordsForRow = (r, x=0) => r.map((v, y) => [x, y]);
const coordsForBoard = b => b.map(coordsForRow);
// console.log(coordsForBoard(newBoard()))

const neighborCoordinatesForRow = (r, x=0) => coordsForRow(r, x).map(xyArr => neighborCoordinates(...xyArr));
const neighborCoordinatesForBoard = b => b.map(neighborCoordinatesForRow);
// console.log(neighborCoordinatesForBoard(newBoard()));

const cellAtCoorinate = (board, x, y) => board[x][y];
const liveAtCoord = (board, x, y) => isLive(cellAtCoorinate(board, x, y));

const neighborCellsForCoordinateArray = (board, arrayOfNeighborCoors) => {
  return arrayOfNeighborCoors.map(neighborCoordsForCell => {
    return neighborCoordsForCell.map(coordsArray => {
      return coordsArray.map(xyArray => cellAtCoorinate(board, ...xyArray))
    })
  })
};
// console.log(neighborCellsForCoordinateArray(newBoard(), neighborCoordinatesForBoard(newBoard())))

const boardAsNumberOfNeighbors = (board, arrayOfNeighborCoords) => {
  return neighborCellsForCoordinateArray(board, arrayOfNeighborCoords).map(neighborCellsForRow => {
    return neighborCellsForRow.map(neighborCellsForCell => {
      return neighborCellsForCell
        .filter(isLive)
        .reduce((total, c) => total + 1, 0)
    })
  })
}
// console.log(boardAsNumberOfNeighbors(newBoard(), neighborCoordinatesForBoard(newBoard())))

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
}
const numberRowAsLiveDeadCells = (rowOfNumbers, rowOfCells) => rowOfNumbers.map((n, i) => numberToLiveDead(n, rowOfCells[i]));
const numberBoardAsLiveDeadCells = (boardOfNumbers, boardOfCells) => boardOfNumbers.map((r, i) => numberRowAsLiveDeadCells(r, boardOfCells[i]));

const printRow = r => r.join(' ');
const printBoard = b => console.log(b.map(printRow).join('\n'));

console.clear();

const mainLoop = (board, coords) => {
  return 
}

const main = (board) => {
  const coords = neighborCoordinatesForBoard(board);
  let neighbors;
  let generation = 0;
  setInterval(() => {
    neighbors = boardAsNumberOfNeighbors(board, coords);
    board = numberBoardAsLiveDeadCells(neighbors, board);
    console.clear();
    printBoard(board);
    console.log(`Generation ${generation}`);
    generation++;
  }, INTERVAL)
}

main(newBoard(true));


// In the game loop, take a board, create a coordinateboard
// calculate numberOfNeighbors
// convert this into live or dead cells in a new board
// pass that into another call to the game loop (or simply return to top of an actual loop)
// each pass, clear the screen and print the board of live/dead cells
// continue until there is no change

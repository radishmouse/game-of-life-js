

/*
The rules:
-  Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
-  Any live cell with two or three live neighbours lives on to the next generation.
-  Any live cell with more than three live neighbours dies, as if by overpopulation.
-  Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  
*/

const SIZE = 42;
const FEW = 2;
const MANY = 3;
const PLENTY = 3;

const LIVE = '@';
const DEAD = ' ';

const isLive = c => c === LIVE;
const isUnderPopulated = n => n < FEW;
const isOverPopulated = n => n > MANY;
const canReproduce = n => n === PLENTY;
const willContinue = n => !(isUnderPopulated(n)) && !(isOverPopulated(n));

const newRow = () => Array(SIZE).fill(DEAD);
const newBoard = () => newRow().map(newRow);

const cloneRow = r => r.slice();
const cloneBoard = b => b.map(cloneRow);

const isWithinBounds = v => v >= 0 && v < (SIZE - 1);
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
const liveAtCoord = (board, x, y) => isLive(cellAtCoorinate);

const neighborCellsForCoordinateArray = (board, arrayOfNeighborCoors) => {
  return arrayOfNeighborCoors.map(neighborCoordsForCell => {
    return neighborCoordsForCell.map(coordsArray => {
      return coordsArray.map(xyArray => cellAtCoorinate(board, ...xyArray))
    })
  })
};

// console.log(neighborCellsForCoordinateArray(newBoard(), neighborCoordinatesForBoard(newBoard())))

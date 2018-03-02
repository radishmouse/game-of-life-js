

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

const LIVE = '@';
const DEAD = ' ';

const isLive = c => c === LIVE;
const isUnderPopulated = n => n < FEW;
const isOverPopulated = n => n > MANY;
const canReproduce = n => n === MANY;
const willContinue = n => !(isUnderPopulated(n)) && !(isOverPopulated(n));

const newRow = () => Array(SIZE).fill(DEAD);
const newBoard = () => newRow().map(newRow);


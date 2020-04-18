/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for (let i = 0; i < HEIGHT; i++) {
    board.push(Array.from({ length: WIDTH }));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector("#board");
  // TODO: add comment for this code

  // create the top row of table (top row of board)
  const top = document.createElement("tr");
  // set the top row id='column-top'
  top.setAttribute("id", "column-top");
  // add a Listener to the top row that calls the handleClick function
  top.addEventListener("click", handleClick);

  // create 7 td elements, set each td's id='x' and append the td to the top row
  for (let x = 0; x < WIDTH; x++) {
    // create 'td' element
    const headCell = document.createElement("td");
    // set id='x'
    headCell.setAttribute("id", x);
    // append 'td' to to top row
    top.append(headCell);
  }

  // append the top row to the htmlBoard
  htmlBoard.append(top);

  // TODO: add comment for this code
  // create and append 6 board rows, each having 7 td's with id's = 'y-x'
  for (let y = 0; y < HEIGHT; y++) {
    // create a row element 'tr'
    const row = document.createElement("tr");
    // create 7 'td' elements with id='y-x' and appended to row 'tr'
    for (let x = 0; x < WIDTH; x++) {
      // create 'td' element
      const cell = document.createElement("td");
      // set id='y-x'
      cell.setAttribute("id", `${y}-${x}`);
      // apend 'td' to 'tr'
      row.append(cell);
    }
    // append 'tr' to htmlBoard
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell

  // create gamePiece 'div'
  const gamePiece = document.createElement("div");
  // set gamePiece 'div' class='piece'
  gamePiece.classList.add("piece");
  // set gamePiece div class='p1 or p2'
  gamePiece.classList.add(`p${currPlayer}`);
  // set starting column for gamePiece
  const startPosition = document.getElementById(`${y}-${x}`);
  // append gamePiece to the startPosition
  startPosition.append(gamePiece);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message

  // update classList for hidden win and tie screens
  if (msg === "tie") {
    let tieScreen = document.querySelector("#tie");
    tieScreen.classList.add("tie");
    tieScreen.classList.remove("hidden");
  } else {
    let winScreen = document.querySelector("#win");
    winScreen.children[0].innerText = `P${currPlayer} WINS`;
    winScreen.classList.add("winner");
    winScreen.classList.remove("hidden");
  }
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return setTimeout(function () {
      endGame();
    }, 100);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board.every((row) => row.every((cell) => cell))) {
    return endGame("tie");
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      let diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      let diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

// add listers to the win screen reset buttons
let resetButton1 = document.querySelector("#button1");
resetButton1.addEventListener("click", resetGame);

// add listers to the tie screen reset buttons
let resetButton2 = document.querySelector("#button2");
resetButton2.addEventListener("click", resetGame);

function resetGame() {
  // set variable back to a new game
  currPlayer = 1;
  board = [];

  // remove game peices from the board
  let remove = document.querySelectorAll("td");
  for (let div of remove) {
    if (div.firstChild !== null) {
      div.firstChild.remove();
    }
  }

  // make a new board
  makeBoard();

  // clear the win or tie screen
  let winScreen = document.querySelector("#win");
  let tieScreen = document.querySelector("#tie");

  if (winScreen.classList.contains("winner")) {
    winScreen.classList.add("hidden");
    winScreen.classList.remove("winner");
  }
  if (tieScreen.classList.contains("tie")) {
    tieScreen.classList.add("hidden");
    tieScreen.classList.remove("tie");
  }
}

makeBoard();
makeHtmlBoard();

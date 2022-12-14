var board = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];

var man = -1;
var machine = +1;

function evaluate(state) {
  var score = 0;

  if (gameOver(state, machine)) {
    score = +1;
  } else if (gameOver(state, man)) {
    score = -1;
  } else {
    score = 0;
  }

  return score;
}

function gameOver(state, player) {
  var win_state = [
    [state[0][0], state[0][1], state[0][2]],
    [state[1][0], state[1][1], state[1][2]],
    [state[2][0], state[2][1], state[2][2]],
    [state[0][0], state[1][0], state[2][0]],
    [state[0][1], state[1][1], state[2][1]],
    [state[0][2], state[1][2], state[2][2]],
    [state[0][0], state[1][1], state[2][2]],
    [state[2][0], state[1][1], state[0][2]]
  ];

  for (var i = 0; i < 8; i++) {
    var line = win_state[i];
    var filled = 0;
    for (var j = 0; j < 3; j++) {
      if (line[j] == player) filled++;
    }
    if (filled == 3) return true;
  }

  return false;
}

function gameOverAll(state) {
  return gameOver(state, man) || gameOver(state, machine);
}

function emptyCells(state) {
  var cells = [];

  for (var x = 0; x < 3; x++) {
    for (var y = 0; y < 3; y++) {
      if (state[x][y] == 0) cells.push([x, y]);
    }
  }

  return cells;
}

function validMove(x, y) {
  var empties = emptyCells(board);

  try {
    if (board[x][y] == 0) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

function setMove(x, y, player) {
  if (validMove(x, y)) {
    board[x][y] = player;
    return true;
  } else {
    return false;
  }
}

function minmax(state, depth, player) {
  var best;

  if (player == machine) {
    best = [-1, -1, -1000];
  } else {
    best = [-1, -1, +1000];
  }

  if (depth == 0 || gameOverAll(state)) {
    var score = evaluate(state);
    return [-1, -1, score];
  }

  emptyCells(state).forEach(function (cell) {
    var x = cell[0];
    var y = cell[1];
    state[x][y] = player;
    var score = minmax(state, depth - 1, -player);
    state[x][y] = 0;
    score[0] = x;
    score[1] = y;

    if (player == machine) {
      if (score[2] > best[2]) best = score;
    } else {
      if (score[2] < best[2]) best = score;
    }
  });

  return best;
}

function manVmac() {
  var x, y;
  var move;
  var cell;

  if (emptyCells(board).length == 9) {
    x = parseInt(Math.random() * 3);
    y = parseInt(Math.random() * 3);
  } else {
    move = minmax(board, emptyCells(board).length, machine);
    x = move[0];
    y = move[1];
  }

  if (setMove(x, y, machine)) {
    cell = document.getElementById(String(x) + String(y));
    cell.innerHTML = 'O';
  }
}

function clickedCell(cell) {
  var button = document.getElementById('reset');
  button.disabled = true;
  var conditionToContinue =
    gameOverAll(board) == false && emptyCells(board).length > 0;

  if (conditionToContinue == true) {
    var x = cell.id.split('')[0];
    var y = cell.id.split('')[1];
    var move = setMove(x, y, man);
    if (move == true) {
      cell.innerHTML = 'X';
      if (conditionToContinue) manVmac();
    }
  }

  if (gameOver(board, machine)) {
    var lines;
    var cell;
    var msg;

    if (board[0][0] == 1 && board[0][1] == 1 && board[0][2] == 1)
      lines = [
        [0, 0],
        [0, 1],
        [0, 2]
      ];
    else if (board[1][0] == 1 && board[1][1] == 1 && board[1][2] == 1)
      lines = [
        [1, 0],
        [1, 1],
        [1, 2]
      ];
    else if (board[2][0] == 1 && board[2][1] == 1 && board[2][2] == 1)
      lines = [
        [2, 0],
        [2, 1],
        [2, 2]
      ];
    else if (board[0][0] == 1 && board[1][0] == 1 && board[2][0] == 1)
      lines = [
        [0, 0],
        [1, 0],
        [2, 0]
      ];
    else if (board[0][1] == 1 && board[1][1] == 1 && board[2][1] == 1)
      lines = [
        [0, 1],
        [1, 1],
        [2, 1]
      ];
    else if (board[0][2] == 1 && board[1][2] == 1 && board[2][2] == 1)
      lines = [
        [0, 2],
        [1, 2],
        [2, 2]
      ];
    else if (board[0][0] == 1 && board[1][1] == 1 && board[2][2] == 1)
      lines = [
        [0, 0],
        [1, 1],
        [2, 2]
      ];
    else if (board[2][0] == 1 && board[1][1] == 1 && board[0][2] == 1)
      lines = [
        [2, 0],
        [1, 1],
        [0, 2]
      ];

    for (var i = 0; i < lines.length; i++) {
      cell = document.getElementById(String(lines[i][0]) + String(lines[i][1]));
      cell.style.color = 'green';
    }

    msg = document.getElementById('message');
    msg.innerHTML = 'You lose!';
  }
  if (emptyCells(board).length == 0 && !gameOverAll(board)) {
    var msg = document.getElementById('message');
    msg.innerHTML = 'Draw!';
  }
  if (gameOverAll(board) == true || emptyCells(board).length == 0) {
    button.value = 'Restart';
    button.disabled = false;
  }
}

function restartBtn(button) {
  if (button.value == 'Start Game') {
    manVmac();
    button.disabled = true;
  } else if (button.value == 'Restart') {
    var htmlBoard;
    var msg;

    for (var x = 0; x < 3; x++) {
      for (var y = 0; y < 3; y++) {
        board[x][y] = 0;
        htmlBoard = document.getElementById(String(x) + String(y));
        htmlBoard.style.color = 'white';
        htmlBoard.innerHTML = '';
      }
    }
    button.value = 'Start Game';
    msg = document.getElementById('message');
    msg.innerHTML = '';
  }
}
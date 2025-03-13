// 1. Deposite some money 
// 2. Determine number of lines to bet
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. check if the user won
// 6. give the user the winnings
// 7. play again
const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOLS_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter a deposit amount: ");
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("Invalid deposit amount, try again.");
    } else {
      return numberDepositAmount;
    }
  }
};

const getBet = (balance) => {
  while (true) {
    const bet = prompt("Enter your bet amount: ");
    const numberBet = parseFloat(bet);

    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance) {
      console.log("Invalid bet amount, try again.");
    } else {
      return numberBet;
    }
  }
};

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }

  return reels;
};

const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }

  return rows;
};

const printRows = (rows) => {
  for (const row of rows) {
    console.log(row.join(" | "));
  }
};

const checkWin = (rows) => {
  const winningLines = [];

  // Check horizontal wins
  for (let i = 0; i < ROWS; i++) {
    if (rows[i][0] === rows[i][1] && rows[i][1] === rows[i][2]) {
      winningLines.push(rows[i]);
    }
  }

  // Check vertical wins
  for (let i = 0; i < COLS; i++) {
    if (rows[0][i] === rows[1][i] && rows[1][i] === rows[2][i]) {
      winningLines.push([rows[0][i], rows[1][i], rows[2][i]]);
    }
  }

  // Check diagonal wins
  if (rows[0][0] === rows[1][1] && rows[1][1] === rows[2][2]) {
    winningLines.push([rows[0][0], rows[1][1], rows[2][2]]);
  }
  if (rows[0][2] === rows[1][1] && rows[1][1] === rows[2][0]) {
    winningLines.push([rows[0][2], rows[1][1], rows[2][0]]);
  }

  return winningLines;
};

const getWinnings = (winningLines, bet) => {
  let winnings = 0;

  for (const line of winningLines) {
    winnings += bet * SYMBOLS_VALUES[line[0]];
  }

  return winnings;
};

// Main game logic
let balance = deposit();

while (true) {
  console.log("Your current balance is: $" + balance);
  const bet = getBet(balance);

  balance -= bet;

  const reels = spin();
  const rows = transpose(reels);
  printRows(rows);

  const winningLines = checkWin(rows);
  const winnings = getWinnings(winningLines, bet);
  balance += winnings;

  if (winningLines.length > 0) {
    console.log(`You won: $${winnings}!`);
  } else {
    console.log("No win this time.");
  }

  console.log("New balance: $" + balance);

  if (balance <= 0) {
    console.log("You ran out of money!");
    break;
  }

  const playAgain = prompt("Do you want to play again? (y/n): ");
  if (playAgain.toLowerCase() !== "y") {
    break;
  }
}

console.log("Thanks for playing!");
// 1. Deposite some money
// 2. Determine number of lines to bet
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. check if the user won
// 6. give the user the winnings
// 7. play again

// function deposit() {
//     return
// }

const prompt = require('prompt-sync')();

const deposit = () => {
    while (true) {
     const depositAmount = prompt("Enter a deposit amount: ");
     const numberDepositAmount = parseFloat(depositAmount);

     if (isNaN(numberDepositAmount) ||numberDepositAmount <= 0) {
        console.log("Invalid deposit amount, try again.");
     } else {
        return numberDepositAmount;
     }
    }
};
const depositAmount = deposit();
console.log(depositAmount);

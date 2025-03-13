// 1. Deposite some money 
// 2. Determine number of lines to bet
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. check if the user won
// 6. give the user the winnings
// 7. play again
// Casino Slot Machine Game

// Wait for DOM to fully load before executing
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const balanceEl = document.getElementById('balance');
    const messageEl = document.getElementById('message');
    const depositInput = document.getElementById('deposit');
    const betInput = document.getElementById('bet');
    const depositBtn = document.getElementById('depositBtn');
    const spinBtn = document.getElementById('spinBtn');
    const resetBtn = document.getElementById('resetBtn');
    const slotSymbols = document.querySelectorAll('.slot-symbol');

    // Constants from original project.js
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

    // Game State
    let balance = 0;

    // Event Listeners
    depositBtn.addEventListener('click', handleDeposit);
    spinBtn.addEventListener('click', handleSpin);
    resetBtn.addEventListener('click', resetGame);

    // Initialize
    updateBalance();
    disableSpinButton();

    // Functions
    function handleDeposit() {
        const depositAmount = parseFloat(depositInput.value);
        
        if (isNaN(depositAmount) || depositAmount <= 0) {
            showMessage("Please enter a valid deposit amount.", "lose");
            return;
        }
        
        balance += depositAmount;
        updateBalance();
        showMessage(`Successfully deposited $${depositAmount.toFixed(2)}!`, "win");
        depositInput.value = "";
        enableSpinButton();
    }

    function handleSpin() {
        const bet = parseFloat(betInput.value);
        
        if (isNaN(bet) || bet <= 0 || bet > balance) {
            showMessage("Please enter a valid bet amount.", "lose");
            return;
        }
        
        // Deduct bet
        balance -= bet;
        updateBalance();
        
        // Simulate spinning
        showMessage("Spinning...", "");
        disableSpinButton();
        
        // Animation effect
        let counter = 0;
        const spinAnimation = setInterval(() => {
            const symbols = Object.keys(SYMBOLS_COUNT);
            slotSymbols.forEach(slot => {
                const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                slot.textContent = randomSymbol;
            });
            
            counter++;
            if (counter >= 10) {
                clearInterval(spinAnimation);
                finalizeSpin(bet);
            }
        }, 100);
    }

    function finalizeSpin(bet) {
        const reels = spin();
        const rows = transpose(reels);
        displaySlots(rows);
        
        const winningLines = checkWin(rows);
        const winnings = getWinnings(winningLines, bet);
        
        balance += winnings;
        updateBalance();
        
        if (winningLines.length > 0) {
            showMessage(`You won $${winnings.toFixed(2)}!`, "win");
        } else {
            showMessage("No win this time.", "lose");
        }
        
        if (balance <= 0) {
            showMessage("You ran out of money! Please deposit to continue playing.", "lose");
            disableSpinButton();
        } else {
            enableSpinButton();
        }
    }

    function resetGame() {
        balance = 0;
        updateBalance();
        showMessage("Game reset. Please deposit to play.", "");
        disableSpinButton();
        
        // Reset slot display
        displayDefaultSlots();
    }

    function updateBalance() {
        balanceEl.textContent = balance.toFixed(2);
    }

    function showMessage(text, className) {
        messageEl.textContent = text;
        messageEl.className = "message";
        if (className) {
            messageEl.classList.add(className);
        }
    }

    function enableSpinButton() {
        spinBtn.disabled = false;
        spinBtn.classList.remove("disabled");
    }

    function disableSpinButton() {
        if (balance <= 0) {
            spinBtn.disabled = true;
            spinBtn.classList.add("disabled");
        }
    }

    function displaySlots(rows) {
        const slotRows = document.querySelectorAll('.slot-row');
        
        for (let i = 0; i < ROWS; i++) {
            const symbols = slotRows[i].querySelectorAll('.slot-symbol');
            
            for (let j = 0; j < COLS; j++) {
                symbols[j].textContent = rows[i][j];
                symbols[j].className = "slot-symbol";
                
                // Highlight winning symbols
                const isWinningSymbol = isPartOfWinningLine(i, j, rows);
                if (isWinningSymbol) {
                    symbols[j].classList.add("winning");
                }
            }
        }
    }

    function displayDefaultSlots() {
        const symbols = ["A", "B", "C", "D"];
        const slotRows = document.querySelectorAll('.slot-row');
        
        for (let i = 0; i < ROWS; i++) {
            const rowSymbols = slotRows[i].querySelectorAll('.slot-symbol');
            
            for (let j = 0; j < COLS; j++) {
                const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                rowSymbols[j].textContent = randomSymbol;
                rowSymbols[j].className = "slot-symbol";
            }
        }
    }

    function isPartOfWinningLine(row, col, rows) {
        // Check horizontal
        if (rows[row][0] === rows[row][1] && rows[row][1] === rows[row][2]) {
            return true;
        }
        
        // Check vertical
        if (rows[0][col] === rows[1][col] && rows[1][col] === rows[2][col]) {
            return true;
        }
        
        // Check diagonal (top-left to bottom-right)
        if (row === col && rows[0][0] === rows[1][1] && rows[1][1] === rows[2][2]) {
            return true;
        }
        
        // Check diagonal (top-right to bottom-left)
        if (row + col === 2 && rows[0][2] === rows[1][1] && rows[1][1] === rows[2][0]) {
            return true;
        }
        
        return false;
    }

    // Functions from original project.js
    function spin() {
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
    }

    function transpose(reels) {
        const rows = [];

        for (let i = 0; i < ROWS; i++) {
            rows.push([]);
            for (let j = 0; j < COLS; j++) {
                rows[i].push(reels[j][i]);
            }
        }

        return rows;
    }

    function checkWin(rows) {
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
    }

    function getWinnings(winningLines, bet) {
        let winnings = 0;

        for (const line of winningLines) {
            winnings += bet * SYMBOLS_VALUES[line[0]];
        }

        return winnings;
    }
});
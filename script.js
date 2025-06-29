let string = "";
let history = [];
const maxHistoryItems = 5;

const display = document.getElementById('display');
const buttons = document.querySelectorAll('.button');

buttons.forEach(button => {
  button.addEventListener('click', (e) => {
    const btnText = e.target.innerText;

    if (btnText === '=') {
      calculate();
    } else if (btnText === 'C') {
      clearDisplay();
    } else if (btnText === '⌫') {
      backspace();
    } else if (e.target.closest('.history-btn')) {
      showHistory();
    } else if (btnText === '%') {
      addToExpression('%');
    } else if (['+', '-', '*', '/'].includes(btnText)) {
      addOperator(btnText);
    } else {
      addToExpression(btnText);
    }
  });
});

function addToExpression(value) {
  // Prevent multiple dots in the current number
  if (value === '.') {
    const parts = string.split(/[\+\-\*\/%]/);
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes('.')) {
      return;
    }
  }
  string += value;
  updateDisplay();
}

function addOperator(op) {
  if (string === "") return;
  // Avoid two operators in a row
  if (/[+\-*/%]$/.test(string)) {
    string = string.slice(0, -1) + op;
  } else {
    string += op;
  }
  updateDisplay();
}

function calculate() {
  if (string === "") return;

  try {
    // Replace % with /100
    let exp = string.replace(/%/g, '/100');
    let result = eval(exp);

    // Limit to max 8 decimals
    if (typeof result === 'number') {
      result = parseFloat(result.toFixed(8));
    }

    // Add to history (queue limit 5)
    addToHistory(string, result);

    string = result.toString();
    updateDisplay();
  } catch (e) {
    display.value = "Error";
    string = "";
  }
}

function clearDisplay() {
  string = "";
  updateDisplay();
}

function backspace() {
  if (string.length > 0) {
    string = string.slice(0, -1);
    updateDisplay();
  }
}

function updateDisplay() {
  display.value = string;
}

function addToHistory(calc, result) {
  history.push({ calculation: calc, result: result, timestamp: new Date().toLocaleString() });
  if (history.length > maxHistoryItems) {
    history.shift(); // Remove oldest
  }
}

function showHistory() {
  const historyContainer = document.getElementById('history-container');
  const historyList = document.getElementById('history-list');

  historyList.innerHTML = '';

  if (history.length === 0) {
    historyList.innerHTML = '<p class="no-history">No calculations yet</p>';
  } else {
    history.slice().reverse().forEach(entry => {
      const div = document.createElement('div');
      div.className = 'history-item';
      div.textContent = `${entry.calculation} = ${entry.result}`;
      div.title = entry.timestamp;

      div.addEventListener('click', () => {
        string = entry.result.toString();
        updateDisplay();
        hideHistory();
      });

      historyList.appendChild(div);
    });
  }

  historyContainer.classList.remove('hidden');
}

function hideHistory() {
  document.getElementById('history-container').classList.add('hidden');
}

// Close history modal
document.getElementById('close-history').addEventListener('click', hideHistory);
document.getElementById('history-container').addEventListener('click', (e) => {
  if (e.target.id === 'history-container') {
    hideHistory();
  }
});

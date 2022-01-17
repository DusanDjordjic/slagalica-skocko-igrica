class Game {
  rows = [];
  domRows = [];
  inputRowsWrapperId = "";
  guessesRowsWrapperId = "";
  buttonsWrapperId = "";
  buttons = [];
  guesses = [];
  domGuesses = [];
  constructor(maxMoves = 10) {
    this.currentMove = 0;
    this.maxMoves = 10;
    this.currentSymbolId = 1;
  }

  start() {
    this.rows.push(this.generateNewRow());
    this.domRows.push(this.generateNewDomRow(this.currentMove));
    this.solutionRow = this.generateSolution();
    console.log("SOLUTION", this.solutionRow);
  }

  nextMove() {
    if (this.currentMove == 0) {
      this.start();
      this.currentMove++;
      this.displayInputRows();
    } else {
      // Proveriti da li je validan prethodni red
      const currentRow = this.rows[this.currentMove - 1];
      if (!isRowValid(currentRow)) {
        console.log("Nevalidan red");
        return;
      }
      const { onPoint, exists } = this.validateSolution(currentRow);

      this.addGuess(onPoint, exists);
      console.log(this.guesses);
      console.log(this.domGuesses);
      this.displayGuesses();

      if (onPoint == symbols.length) {
        console.log("BRAVOOOO");
        return;
      }
      this.rows.push(this.generateNewRow());
      this.domRows.push(this.generateNewDomRow(this.currentMove));
      this.currentMove++;
      this.displayInputRows();
    }
  }
  validateSolution(currentRow) {
    const solutionCopy = [];
    const currentRowCopy = [];

    let onPoint = 0;
    let exists = 0;
    console.log("GUESS", currentRow);
    currentRow.forEach((field, i) => {
      console.log({ field, solution: this.solutionRow[i] });
      if (field == this.solutionRow[i]) {
        onPoint++;
        console.log("ONPOINT", i);
      } else {
        currentRowCopy.push(field);
        solutionCopy.push(this.solutionRow[i]);
      }
    });

    console.log({ solutionCopy, currentRowCopy });
    currentRowCopy.forEach((field, i) => {
      if (solutionCopy.includes(field)) {
        const indexToRemove = solutionCopy.findIndex((value) => value == field);
        solutionCopy.splice(indexToRemove, 1);
        exists++;
      }
    });
    // console.log({ solutionCopy, onPoint, exists });

    // console.log({ onPoint, exists });
    return { onPoint, exists };
  }
  generateSolution() {
    const emptyRow = this.generateNewRow();
    const solutionRow = emptyRow.map((field, i, row) => {
      return Math.floor(Math.random() * row.length + 1);
    });
    return solutionRow;
  }

  generateButtons() {
    const buttons = [];
    symbols.forEach((symbol) => {
      buttons.push(buttonFactory.createButton(symbol, "assets/"));
    });
    document.getElementById(this.buttonsWrapperId).append(...buttons);
    this.buttons = buttons;
    this.updateButtonClass();
  }

  generateNewDomRow(currentRow) {
    const row = gameFactory.createRow();
    for (let i = 0; i < symbols.length; i++) {
      const field = gameFactory.createField();
      field.dataset.row = currentRow;
      field.dataset.col = i;
      row.appendChild(field);
    }
    return row;
  }

  generateNewRow() {
    return new Array(symbols.length).fill(null);
  }

  displayInputRows() {
    document
      .getElementById(this.inputRowsWrapperId)
      .replaceChildren(...this.domRows);
  }

  updateField(row, col) {
    if (row != this.rows.length - 1) return;
    this.rows[row][col] = this.currentSymbolId;
    const symbol = symbols.find((symbol) => symbol.id === this.currentSymbolId);
    if (!symbol) return;
    const img = document.createElement("img");
    img.setAttribute("src", "assets/" + symbol.name);
    this.domRows[row].childNodes[col].replaceChildren(img);
  }
  changeCurrentSymbol(newSymbolId) {
    this.currentSymbolId = newSymbolId;
    this.updateButtonClass();
  }
  updateButtonClass() {
    this.buttons.forEach((button) => {
      button.classList.remove("active");
      if (button.dataset.id == this.currentSymbolId) {
        button.classList.add("active");
      }
    });
  }

  addGuess(onPoint, exists) {
    this.guesses.push({ onPoint, exists });
    this.addDomGuess(onPoint, exists);
  }
  addDomGuess(onPoint, exists) {
    const numberOfFields = symbols.length;
    const row = gameFactory.createRow();
    for (let i = 0; i < numberOfFields; i++) {
      if (onPoint > 0) {
        row.appendChild(gameFactory.createGuessField(1));
        onPoint--;
      } else {
        if (exists > 0) {
          row.appendChild(gameFactory.createGuessField(2));
          exists--;
        } else {
          row.appendChild(gameFactory.createGuessField(0));
        }
      }
    }
    this.domGuesses.push(row);
  }
  displayGuesses() {
    document
      .getElementById(this.guessesRowsWrapperId)
      .replaceChildren(...this.domGuesses);
  }
}

function fieldClick() {
  const row = Number(this.dataset.row);
  const col = Number(this.dataset.col);
  game.updateField(row, col);
}
function changeCurrentSymbol() {
  game.changeCurrentSymbol(Number(this.dataset.id));
}

const game = new Game();

function isRowValid(row) {
  let valid = true;
  row.forEach((field) => {
    if (!field) valid = false;
  });
  return valid;
}

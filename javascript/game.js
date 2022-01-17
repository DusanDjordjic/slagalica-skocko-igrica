class Game {
  inputRowsWrapperId = "";
  guessesRowsWrapperId = "";
  movesWrapperId = "";
  buttonsWrapperId = "";
  nextButtonId = "";
  startButtonId = "";
  resetButtonId = "";
  buttons = [];
  constructor(maxMoves = 10, numberOfFields = 5) {
    // Osnovni podaci o igrici

    this.numberOfFields = numberOfFields;
    this.maxMoves = maxMoves;
    this.currentSymbolId = 1;

    // Postvi sve na pocetne vrednosti
    this.setupGame();
  }
  wireEvents() {
    document.getElementById(this.nextButtonId).addEventListener("click", () => {
      this.nextMove();
    });
    document
      .getElementById(this.resetButtonId)
      .addEventListener("click", () => {
        this.setupGame();
        this.start();
        document.getElementById(this.resetButtonId).style.display = "none";

        // Da bi smo resetovali pogadjanja na UI
        this.displayGuesses();
      });
  }
  setupGame() {
    this.rows = [];
    this.domRows = [];
    this.guesses = [];
    this.domGuesses = [];
    this.domMoves = [];
    this.currentMove = 0;
  }
  start() {
    if (this.currentMove != 0) return;
    // Generisi resenje
    this.solutionRow = this.generateSolution();

    // Generisi dugmice
    this.generateButtons();

    // Napravi red, dodaj ga i prikazi ga
    this.rows.push(this.generateNewRow());
    this.domRows.push(this.generateNewDomRow(this.currentMove));
    this.displayInputRows();

    // Povecaj potez za 1 i prikazi ga
    this.currentMove++;
    this.addCurrentMove();
    this.displayMoves();

    // Prikazi "next" dugme i dodaj mu event listener
    document.getElementById(this.nextButtonId).style.display = "block";

    console.log("SOLUTION", this.solutionRow);
  }

  nextMove() {
    // Proveriti da li je validan trenutni red

    const currentRow = this.rows[this.currentMove - 1];
    if (!isRowValid(currentRow)) {
      console.log("Nevalidan red");
      return;
    }
    // Rezultati gadjanja
    const { onPoint, exists } = this.validateSolution(currentRow);

    // Dodajemo pokusaj
    this.addGuess(onPoint, exists);
    // Prikazujemo sve pokusaje do sada
    this.displayGuesses();

    // Ako "na mestu" ih ima toliko i polja znaci da su svi na mestu
    // Tj da je igrac pogodio sve
    if (onPoint == this.numberOfFields) {
      console.log("BRAVOOOO");
      this.endGame();
      return;
    }

    // Ako je sledeci potez veci od maksimalnog broja poteza znaci da je kraj igre
    // I da igrac nije uspeo da pogodi sve

    if (this.currentMove == this.maxMoves) {
      this.endGame();
    } else {
      // Dodajemo sledeci red i prikazujemo ga
      // Bitno je da dodamo red pre povecanja poteza
      // Zato sto nam row i col u dataset-u krecu od 0 a ne od 1 kao currentMove
      this.rows.push(this.generateNewRow());
      this.domRows.push(this.generateNewDomRow(this.currentMove));
      // Povecavamo potez za 1
      this.currentMove++;
      // Ako jos nije kraj igre,
      // dodajemo sledeci potez i prikazujemo ga
      this.addCurrentMove();
      this.displayMoves();

      this.displayInputRows();
    }
  }
  endGame() {
    // Pripremiti sve za kraj igre
    document.getElementById(this.nextButtonId).style.display = "none";
    document.getElementById(this.resetButtonId).style.display = "block";
  }
  validateSolution(currentRow) {
    // Cuvamo one koji nisu pronadjeni da su "na mestu"
    const solutionCopy = [];
    const currentRowCopy = [];

    let onPoint = 0;
    let exists = 0;
    // Proveravamo koliko ih ima "na mestu"
    // console.log("GUESS", currentRow);
    currentRow.forEach((field, i) => {
      console.log({ field, solution: this.solutionRow[i] });
      if (field == this.solutionRow[i]) {
        onPoint++;
        // console.log("ONPOINT", i);
      } else {
        currentRowCopy.push(field);
        solutionCopy.push(this.solutionRow[i]);
      }
    });

    // console.log({ solutionCopy, currentRowCopy });

    // Proveravamo koliko ih jos ima da postoje, a da nisu na mestu
    currentRowCopy.forEach((field) => {
      if (solutionCopy.includes(field)) {
        const indexToRemove = solutionCopy.findIndex((value) => value == field);
        solutionCopy.splice(indexToRemove, 1);
        exists++;
      }
    });
    return { onPoint, exists };
  }

  generateSolution() {
    const emptyRow = this.generateNewRow();
    const solutionRow = emptyRow.map((field, i, row) => {
      return Math.floor(Math.random() * symbols.length + 1);
    });
    return solutionRow;
  }

  generateButtons() {
    const buttons = [];
    symbols.forEach((symbol) => {
      buttons.push(buttonFactory.createButton(symbol, "assets/"));
    });
    document.getElementById(this.buttonsWrapperId).replaceChildren(...buttons);
    this.buttons = buttons;
    this.updateButtonClass();
  }

  generateNewDomRow(currentRow) {
    const row = gameFactory.createRow();
    for (let i = 0; i < this.numberOfFields; i++) {
      const field = gameFactory.createField();
      field.dataset.row = currentRow;
      field.dataset.col = i;
      row.appendChild(field);
    }
    return row;
  }

  generateNewRow() {
    return new Array(this.numberOfFields).fill(null);
  }

  displayInputRows() {
    document
      .getElementById(this.inputRowsWrapperId)
      .replaceChildren(...this.domRows);
  }

  updateField(row, col) {
    // Za odredjeno polje updatujemo slicicu

    // Ne dozvoljavamo da se promeni slicica od polja koje se ne nalazi u poslednjem redu
    console.log(row, this.rows.length - 1);
    if (row != this.rows.length - 1) return;

    // menjamo vrednost tj slicicu
    this.rows[row][col] = this.currentSymbolId;
    // Pronalazimo slicicu sa istim id-jem
    const symbol = symbols.find((symbol) => symbol.id === this.currentSymbolId);
    // Ako ne postoji vratimo
    if (!symbol) return;
    const img = document.createElement("img");
    img.setAttribute("src", "assets/" + symbol.name);
    // Polju dodajemo slicicu
    this.domRows[row].childNodes[col].replaceChildren(img);
  }

  // Menjamo trenutno selektovani simbol
  changeCurrentSymbol(newSymbolId) {
    this.currentSymbolId = newSymbolId;
    this.updateButtonClass();
  }
  // Menjamo klase dugmicima
  updateButtonClass() {
    this.buttons.forEach((button) => {
      button.classList.remove("active");
      if (button.dataset.id == this.currentSymbolId) {
        button.classList.add("active");
      }
    });
  }

  // Dodajemo pokusaj
  addGuess(onPoint, exists) {
    this.guesses.push({ onPoint, exists });
    this.addDomGuess(onPoint, exists);
  }

  addDomGuess(onPoint, exists) {
    const row = gameFactory.createRow();
    /// Dodajemo onoliko polja koliko ima svih vrsta pogodaka
    // "na mestu" = 1
    // "postoji" = 2
    // "ne postoji" = 0

    for (let i = 0; i < this.numberOfFields; i++) {
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
  addCurrentMove() {
    this.domMoves.push(
      gameFactory.createMoveField(this.currentMove, this.maxMoves)
    );
  }
  displayMoves() {
    document
      .getElementById(this.movesWrapperId)
      .replaceChildren(...this.domMoves);
  }
}

// Kada se klikne na polje
function fieldClick() {
  const row = Number(this.dataset.row);
  const col = Number(this.dataset.col);
  game.updateField(row, col);
}
function changeCurrentSymbol() {
  game.changeCurrentSymbol(Number(this.dataset.id));
}

// Provera da li je red validan
function isRowValid(row) {
  let valid = true;
  row.forEach((field) => {
    if (!field) valid = false;
  });
  return valid;
}

const game = new Game(7, 5);

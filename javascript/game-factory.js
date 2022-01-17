class GameFactory {
  createDiv() {
    return document.createElement("div");
  }
  createRow() {
    const row = this.createDiv();
    row.classList.add("row");
    return row;
  }
  createSimpleField() {
    const field = this.createDiv();
    field.classList.add("field");
    return field;
  }
  createField() {
    const field = this.createSimpleField();
    field.addEventListener("click", fieldClick.bind(field));
    return field;
  }

  createGuessField(type) {
    const field = this.createSimpleField();
    field.classList.add("locked");
    switch (type) {
      case 1:
        field.classList.add("on-point");
        break;
      case 2:
        field.classList.add("exists");
        break;
    }
    return field;
  }

  createMoveField(text, max) {
    const field = this.createSimpleField();
    field.textContent = `${text}/${max}`;
    return field;
  }
}

const gameFactory = new GameFactory();

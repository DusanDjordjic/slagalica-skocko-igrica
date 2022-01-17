class GameFactory {
  createDiv() {
    return document.createElement("div");
  }
  createRow() {
    const row = this.createDiv();
    row.classList.add("row");
    return row;
  }
  createField() {
    const field = this.createDiv();
    field.classList.add("field");
    field.addEventListener("click", fieldClick.bind(field));
    return field;
  }
  createGuessField(type) {
    const field = this.createDiv();
    field.classList.add("field");
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
}

const gameFactory = new GameFactory();

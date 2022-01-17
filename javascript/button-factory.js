class ButtonFactory {
  createButton(symbol, path) {
    const button = document.createElement("button");
    const img = document.createElement("img");
    img.setAttribute("src", path + symbol.name);
    button.dataset.id = symbol.id;
    button.classList.add("field");
    button.classList.add("icon-btn");
    button.addEventListener("click", changeCurrentSymbol.bind(button));
    button.appendChild(img);
    return button;
  }
}
const buttonFactory = new ButtonFactory();

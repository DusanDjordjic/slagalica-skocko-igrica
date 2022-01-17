// Generisati dugmice

game.inputRowsWrapperId = "input-rows-wrapper";
game.buttonsWrapperId = "btn-wrapper";
game.guessesRowsWrapperId = "guesses-rows-wrapper";
game.generateButtons();
// Poceti sa igricom

document.getElementById("next-btn").addEventListener("click", () => {
  game.nextMove();
});

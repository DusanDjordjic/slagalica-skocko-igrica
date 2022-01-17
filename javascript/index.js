// Poceti sa igricom
document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("start-btn").style.display = "none";
  game.inputRowsWrapperId = "input-rows-wrapper";
  game.nextButtonId = "next-btn";
  game.startButtonId = "start-btn";
  game.resetButtonId = "reset-btn";
  game.buttonsWrapperId = "btn-wrapper";
  game.movesWrapperId = "move-rows-wrapper";
  game.guessesRowsWrapperId = "guesses-rows-wrapper";
  game.wireEvents();
  game.start();
});

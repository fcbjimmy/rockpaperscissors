function determineWinner(player1Choice, player2Choice) {
  if (player1Choice.choice === player2Choice.choice) {
    return "draw";
  } else if (
    (player1Choice.choice === "rock" && player2Choice.choice === "scissors") ||
    (player1Choice.choice === "paper" && player2Choice.choice === "rock") ||
    (player1Choice.choice === "scissors" && player2Choice.choice === "paper")
  ) {
    return player1Choice.id; // Player 1 wins
  } else {
    return player2Choice.id; // Player 2 wins
  }
}

module.exports = { determineWinner };

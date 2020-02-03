const Graph = require("./EntanglementGraph");

export class GameHelper {
  constructor(controller) {
    this.g = new Graph();
    this.state = {
      classicSquares: Array(9).fill(null),
      quantumSquares: Array(9).fill(null),
      turnNumEachPlayer: 1,
      playerTurnNumEachPlayer: 0,
      squaresInCycle: null,
      marksInCycle: null,
      squaresInCollapse: null,
      gameOver: false,
      xScore: 0,
      oScore: 0
    };
  }

  playersTurn() {
    const { playerTurnNumEachPlayer } = this.state;
    return playerTurnNumEachPlayer < 2 ? "X" : "O";
  }

  isSamePlayerSecondSign() {
    const { playerTurnNumEachPlayer } = this.state;
    return playerTurnNumEachPlayer === 1 || playerTurnNumEachPlayer === 3;
  }

  notPlayersTurn() {
    const { playerTurnNumEachPlayer } = this.state;
    return playerTurnNumEachPlayer < 2 ? "O" : "X";
  }

  otherPlayer(p) {
    return p === "X" ? "O" : "X";
  }

  setState(obj) {
    Object.assign(this.state, obj);
  }

  // dispatches click to appropriate handler based on state
  manageSquareClick(i) {
    const { gameOver, squaresInCycle, classicSquares, lastMove } = this.state;
    const turn = this.playersTurn();
    if (gameOver) {
      return "X : O : Game over, start a new one(:";
    } else if (squaresInCycle) {
      return this.manageCyclicEntanglement(i);
    } else if (classicSquares[i]) {
      return {
        [turn]: `${turn} : This square has classical mark, choose another one plaese`
      };
    } else if (this.isSamePlayerSecondSign() && lastMove === i) {
      return {
        [turn]: `${turn}: Can't play twice in the same square, choose other square`
      };
    } else {
      return this.manageNormalMove(i);
    }
  }

  // adds quantum mark to square that was clicked on then checks if that created a cycle
  manageNormalMove(i) {
    const { playerTurnNumEachPlayer, turnNumEachPlayer, lastMove } = this.state;
    let quantumSquares = this.state.quantumSquares;
    const turn = this.playersTurn();
    let marker = turn + turnNumEachPlayer;

    if (quantumSquares[i]) {
      quantumSquares[i].push(marker);
    } else {
      quantumSquares[i] = [marker];
    }

    if (!this.g.hasNode(i)) {
      this.g.addNode(i);
    }
    if (this.isSamePlayerSecondSign()) {
      this.g.addEdge(lastMove, i, marker);
    }

    let squaresInCycle, marksInCycle, whoDecidesCollapse, status;

    if (this.g.isCyclic(i)) {
      [squaresInCycle, marksInCycle] = this.g.getCycle(i);

      whoDecidesCollapse = this.notPlayersTurn(); // otherPlayer of who made cycle
      status = `A loop of entanglement has occured! Player ${whoDecidesCollapse} will decide which of the possible states the board will collapse into.`;
    }

    const whoseTurn =
      playerTurnNumEachPlayer + 1 === 4
        ? turnNumEachPlayer + 1
        : turnNumEachPlayer;

    this.setState({
      quantumSquares,
      squaresInCycle,
      marksInCycle,
      turnNumEachPlayer: whoseTurn,
      playerTurnNumEachPlayer: (this.state.playerTurnNumEachPlayer + 1) % 4,
      lastMove: i
    });

    if (whoDecidesCollapse !== undefined) {
      return {
        [whoDecidesCollapse]:
          status + "Choose one of the squares involved in the cycle.",
        [this.otherPlayer(whoDecidesCollapse)]: status
      };
    } else if (this.isSamePlayerSecondSign()) {
      return {
        [this.playersTurn()]: `${this.playersTurn()} : Now play a second quantum move. This move is entangled with your previous move.`,
        [this.notPlayersTurn()]: `Player ${this.playersTurn()}'s move.`
      };
    } else {
      return {
        [turn]:
          "Your turn! Put down a quantum move (these are the small marks).",
        [this.notPlayersTurn()]: `Now it's ${this.playersTurn()}'s turn.`
      };
    }
  }

  // selects square to be collapse point
  manageCyclicEntanglement(i) {
    const { squaresInCycle } = this.state;
    const turn = this.playersTurn();
    if (!squaresInCycle.includes(i)) {
      return {
        [turn]:
          "Pick one of the squares involved in cyclic entanglement, the one's in blue"
      };
    }

    this.setState({
      squaresInCollapse: i
    });
    return {
      [turn]:
        "Now, choose which one of the marks you want in this square."
    };
  }

  // collapes square and propogates changes outward
  manageCollapse(mark) {
    const { squaresInCollapse, classicSquares } = this.state;
    const turn = this.playersTurn();
    let i = squaresInCollapse;
    let visited = new Set([mark]);

    this._manageCollapseHelper(mark, i, visited);

    let scores = calculateScores(classicSquares);
    let status;
    if (scores) {
      // if someone won
      status = {
        X: getWinnerMsg(scores),
        O: getWinnerMsg(scores)
      };

      this.setState({
        status,
        gameOver: true,
        xScore: this.state.xScore + scores["X"],
        oScore: this.state.oScore + scores["Y"],
        squaresInCycle: null,
        marksInCycle: null,
        squaresInCollapse: null
      });
    } else {
      status = {
        X: `${turn} next!`,
        O: `${turn} next!`
      };

      this.setState({
        squaresInCycle: null,
        marksInCycle: null,
        squaresInCollapse: null
      });
    }

    return status;
  }

  _manageCollapseHelper(mark, i, visited) {
    let classicSquares = this.state.classicSquares;
    let quantumSquares = this.state.quantumSquares;
    classicSquares[i] = mark;
    quantumSquares[i] = null;

    this.setState({
      classicSquares,
      quantumSquares
    });

    for (let edge of this.g.getNode(i).edges) {
      if (!visited.has(edge.key)) {
        visited.add(edge.key);
        this._manageCollapseHelper(edge.key, edge.end.id, visited);
      }
    }
  }

  setStatus(msg) {
    this.setState({ status: msg });
  }
}

// pure functions to help with game logic in index.js
function getWinnerMsg(scores) {
  let msg;
  let winner = scores["X"] > scores["O"] ? "X" : "O";
  let loser = winner === "X" ? "O" : "X";

  if (scores["X"] + scores["O"] === 1) {
    msg = `${winner} wins!!! \n ${winner} gets 1 point \n ${loser} gets 0 points`;
  } else if (scores["X"] === 1.5 || scores["O"] === 1.5) {
    msg = `${winner} wins with a double three-in-a-row!!! \n ${winner} gets 1.5 points \n ${loser} gets 0 points`;
  } else if (scores["X"] + scores["O"] === 1.5) {
    msg = `Both players got three in a row, but ${winner} got it first! (The mark placed in${winner}'s three-in-a-row has a smaller subscript than ${loser} \n ${winner} gets 1 point \n ${loser} gets 0.5 points`;
  }

  return msg;
}

function calculateWinners(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  let winners = [];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[b] &&
      squares[c] &&
      squares[a][0] === squares[b][0] &&
      squares[a][0] === squares[c][0]
    ) {
      let subscripts = [squares[a][1], squares[b][1], squares[c][1]].map(
        Number
      );

      winners.push([Math.max(...subscripts), squares[a][0], lines[i]]);
    }
  }

  return winners;
}

function calculateScores(squares) {
  let winners = calculateWinners(squares);
  if (winners.length === 0) {
    return null;
  }

  winners.sort();
  let scores = { X: 0, O: 0 };

  if (winners.length >= 1) {
    scores[winners[0][1]] += 1;
  } else if (winners.length >= 2) {
    scores[winners[1][1]] += 0.5;
  } else if (winners.length === 3) {
    scores[winners[2][1]] += 0.5;
  }
  return scores;
}

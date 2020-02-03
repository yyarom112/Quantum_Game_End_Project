import React from "react";
import { Board } from "./Board.js";
import { GameHelper } from "./GameHelper";
import { StatusBar } from "./StatusBar";
import '../style/GameApp.scss';

export class GameApp extends React.Component {
  constructor() {
    super();
    this.game = new GameHelper();
    this.state = Object.assign({ status: "Player X's turn!" }, this.game.state);
  }

  manageSquareClick(i) {
    const turn = this.game.playersTurn();
    let statuses = this.game.manageSquareClick(i);
    let status = statuses[turn];

    this.setState(this.game.state);
    this.setState({ status });
  }

  manageCyclicEntanglement(i) {
    const turn = this.game.playersTurn();
    let statuses = this.game.manageCyclicEntanglement(i);
    let status = statuses[turn];

    this.setState(this.game.state);
    this.setState({ status });
  }

  manageCollapse(mark) {
    const turn = this.game.playersTurn();
    let statuses = this.game.manageCollapse(mark);
    let status = statuses[turn];

    this.setState(this.game.state);
    this.setState({ status });
  }

  render() {
    const {
      squaresInCollapse,
      quantumSquares,
      marksInCycle,
      status,
      classicSquares,
      squaresInCycle,
      xScore,
      oScore
    } = this.state;
    let cycleMarks;

    if (squaresInCollapse != null) {
      //if we have a cycle that need to resolve
      cycleMarks = quantumSquares[squaresInCollapse].filter(mark =>
        marksInCycle.includes(mark)
      );
    }

    return (
      <div>
        <h1> Quantum Tic Tac Toe </h1>{" "}
        <div className="game">
          <div className="explanation">Game: <br></br>
          מטרת המשחק הינה להסביר את חוקי הקוונטים בצורה קלה יותר כדי שמוח האדם יצליח להבין בצורה טובה ופשוטה יותר את תורת הקוונטים על ידי משחק.
          <br></br>
          על פי המחקר שקראנו, תודעת האדם בנויה על אלמנטים של חוקי הקוונטים אך אנו לא מסוגלים עדיין להבין זאת ולכן לא בטוחים שזאת המציאות, לכן כותבי המאמר ממליצים על משחקים שהם מוכרים ופשוטים אך כעת מנוהלים עם חוקי תורת הקוונטים וכך בני האדם יוכלו להבין את תורה זו בצורה יותר טובה ולהיחשף ליכולות וכך להבין את הנושא בצורה טובה יותר.
          <br></br>
          לכן מטרתנו הייתה להדגים את יכולות תורת הקוונטים על ידיד יצירת משחק של איקס עיגול קוונטי. ובכך המשחק מציג את המושגים הבסיסיים שלא נחשפנו אליהם לפני, וחוקי המשחק והניצחון בו משתנים בהתאם לכך. כלומר אנו משחקים כעת בצורה קוונטית ולא בצורה הרגילה, אך בסוף הניצחון נקבע לפי החוקים הקלאסיים של המשחק.
           </div>
          <div className="game-board">
            <Board
              classicSquares={classicSquares}
              quantumSquares={quantumSquares}
              squaresInCycle={squaresInCycle}
              marksInCycle={marksInCycle}
              squaresInCollapse={squaresInCollapse}
              onSquareClick={i => this.manageSquareClick(i)}
            />

            <div className="xScore"> X: {xScore} </div>
            <div className="oScore"> O: {oScore} </div>
          </div>

          <StatusBar
            status={status}
            cycleMarks={cycleMarks}
            onMarksClick={mark => this.manageCollapse(mark)}
          />
        </div>
      </div>
    );
  }
}

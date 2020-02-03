import React, { Component } from "react";
import { Square } from "./Square.js";
import '../style/Board.scss';

export class Board extends Component {
  renderSquare(i) {
    const {
      classicSquares,
      quantumSquares,
      onSquareClick,
      squaresInCycle,
      squaresInCollapse,
      marksInCycle
    } = this.props;
    const hasCycle = squaresInCycle && squaresInCycle.includes(i);
    return (
      <Square
        classicMark={classicSquares[i]}
        quantumMark={quantumSquares[i]}
        onClick={() => onSquareClick(i)}
        isInCycle={hasCycle}
        isBeingCollapsed={squaresInCollapse === i}
        marksInCycle={marksInCycle}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

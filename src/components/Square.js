import React from "react";
import classNames from "classnames";
import { QuantumMarks } from './QuantumMarks';
import '../style/Square.scss';

export class Square extends React.Component {
  
  classicMarkSquare(dashHelper) {
    const { onClick, classicMark } = this.props;
    return (
      <div className={"square classical"} onClick={onClick}>
        {dashHelper}
        <div className="marks adjustCenter">
          {classicMark[0]}
          <sub>{classicMark[1]}</sub>
        </div>
      </div>
    );
  }

  quantumMarkSquare(dashHelper) {
    const {
      isInCycle,
      isBeingCollapsed,
      onClick,
      quantumMark,
      marksInCycle
    } = this.props;
    let cls = classNames(
      "square",
      { "rotating-dashed": isInCycle },
      { "selected": isBeingCollapsed }
    );

    return (
      <div className={cls} onClick={onClick}>
        {dashHelper}
        <div className="marks">
          <QuantumMarks
            isInCycle={isInCycle}
            isBeingCollapsed={isBeingCollapsed}
            quantumMark={quantumMark}
            marksInCycle={marksInCycle}
          />
        </div>
      </div>
    );
  }

  render() {
    const { classicMark } = this.props;
    const dashHelper = (
      <div>
        <span className="dashing">
          <i></i>
        </span>
        <span className="dashing">
          <i></i>
        </span>
        <span className="dashing">
          <i></i>
        </span>
        <span className="dashing">
          <i></i>
        </span>
      </div>
    );
    if (classicMark != null) {
      return this.classicMarkSquare(dashHelper);
    } else {
      return this.quantumMarkSquare(dashHelper);
    }
  }
}



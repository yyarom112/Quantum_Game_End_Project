import React from "react";
import classNames from "classnames";
// import "../style/rotation.css";
import '../style/QuantumMarks.scss';

export class QuantumMarks extends React.Component {

    render() {
      const { quantumMark, isInCycle, marksInCycle, isBeingCollapsed } = this.props;
      let spans;
      if (quantumMark != null) {
        let marks = Array.from(quantumMark.filter(x => x != null));
    
        if (marks.length >= 1) {
          spans = Array.from(
            marks.slice(0, -1).map(m => {
              let markCls = classNames(
                "white",
                { "green": isInCycle && marksInCycle.includes(m) },
                { "red": isBeingCollapsed && marksInCycle.includes(m) }
              );
    
              return (
                <span className={markCls} key={m}>
                  {m[0]}
                  <sub>{m[1]}</sub>,{" "}
                </span>
              );
            })
          );
    
          let lastMark = marks[marks.length - 1];
          let markCls = classNames(
            "white",
            { "green": isInCycle && marksInCycle.includes(lastMark) },
            { "red": isBeingCollapsed && marksInCycle.includes(lastMark) }
          );
    
          spans.push(
            <span className={markCls} key={lastMark}>
              {lastMark[0]}
              <sub>{lastMark[1]}</sub>
            </span>
          );
        }
      }
      return <div> {spans} </div>;
    }
    
  }
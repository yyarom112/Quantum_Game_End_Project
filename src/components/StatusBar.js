import React from "react";
import '../style/StatusBar.scss';

export class StatusBar extends React.Component {
  render() {
    let cycleMarksToPresent;
    const { cycleMarks, status, onMarksClick } = this.props;
    if (cycleMarks != null) {
      cycleMarksToPresent = cycleMarks.map(mark => {
        return (
          <div
            className="collapseChoice"
            onClick={() => onMarksClick(mark)}
            key={mark}
          >
            {mark}
          </div>
        );
      });
    }
    return (
      <div className="game-info">
        <div className="status">{status}</div>
        {cycleMarksToPresent}
      </div>
    );
  }
}

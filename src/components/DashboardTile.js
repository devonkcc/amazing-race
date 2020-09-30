import React from "react";
import { NUM_CLUES } from "../helpers/constants";
import ProgressBar from "react-bootstrap/ProgressBar"

class DashboardTile extends React.Component {
  render() {
    var names_string = this.props.team.teammates[0] + ", " + this.props.team.teammates[1];
    if (this.props.team.teammates[2]) {
      names_string = names_string + ", " + this.props.team.teammates[2];
    }
    return (
      <div className="dashboard-tile">
        <h4 className="mt-3 mb-0 pb-0"><span className="light-text-override">@</span>{this.props.team.username}</h4>
        <p>{names_string}</p>
        <ProgressBar animated now={Math.min(4+100*(this.props.team.clue_num / (NUM_CLUES+1)),100)} label={<span>{this.props.team.clue_num == 13 ? "Done!" : this.props.team.clue_num == 0 ? "" : "#" + this.props.team.clue_num}</span>} />
      </div>
    );
  }
}

export default DashboardTile;
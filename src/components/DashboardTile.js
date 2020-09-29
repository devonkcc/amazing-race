import React from "react";
import Container from "react-bootstrap/Container"
import { NUM_CLUES } from "../helpers/constants";
import ProgressBar from "react-bootstrap/ProgressBar"

class DashboardTile extends React.Component {
  render() {
    var names_string = this.props.team.teammates[0] + ", " + this.props.team.teammates[1];
    if (this.props.team.teammates[2]) {
      names_string = names_string + ", " + this.props.team.teammates[2];
    }
    return (
      <Container>
        <h4>{this.props.team.username}</h4>
        <p>{names_string}</p>
        <ProgressBar now={Math.min(4+100*(this.props.team.clue_num / (NUM_CLUES+1)),100)} label={`#${this.props.team.clue_num}`} />
      </Container>
    );
  }
}

export default DashboardTile;
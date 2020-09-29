import React from "react";
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import InputGroup from "react-bootstrap/InputGroup"
import Countdown from "react-countdown"
import barcode_example from '../assets/barcode_example.png'
import snickers from '../assets/snickers.png'
import gatorade from '../assets/gatorade.png'
import {VALID_SNICKERS_UPC, VALID_GATORADE_UPC} from '../helpers/constants'
import {db} from '../services/firebase';

class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countdown_complete: false,
      show_clue: false,
      username: "",
      snickers_upc: "",
      gatorade_upc: "",
      snickers_upc_valid: false,
      gatorade_upc_valid: false,
      username_invalid_flag: false
    };
  }

  renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      this.setState({ countdown_complete: true }); 
    }
  return <span>{days}:{hours}:{minutes}:{seconds}</span>
  };

  handleChange = (event) => {
    var temp_username_invalid_flag = this.state.username_invalid_flag; 
    if ((event.target.name) === "username") {
      temp_username_invalid_flag = false; 
    }
    this.setState({
      [event.target.name]: event.target.value, 
      username_invalid_flag: temp_username_invalid_flag, 
      snickers_upc_valid: VALID_SNICKERS_UPC.includes(this.state.snickers_upc),
      gatorade_upc_valid: VALID_GATORADE_UPC.includes(this.state.gatorade_upc)
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({loading: true});
    if (this.state.snickers_upc_valid && this.state.gatorade_upc_valid) {
      var query_result = await db.collection("teams").where("username", "==", this.state.username).limit(1).get()
      if(query_result.docs.length > 0){
        var temp_clue_log = query_result.docs[0].data().clue_log;
        temp_clue_log[1] = new Date();
        await db.collection("teams").doc(query_result.docs[0].id).update({
          clue_log: temp_clue_log
        });
        this.setState({ 
          show_clue: true
        });
      }
      else {
        this.setState({ 
          loading: false,
          username_invalid_flag: true, 
        });
      }
    }
  }

  render() {
    return (
      <Container>
        {!this.state.countdown_complete ? 
          <div>
            <h1>Ready, Set, Go</h1>
            <h2>Race starts in:</h2>
            <Countdown
              date={Date.now() + 5000}
              //date={"2020-10-03T10:30:00-0700"}
              renderer={this.renderer}
            />
          </div>
        :
          <div>
            {!this.state.show_clue ? 
              <div>
                <h3>Winning the amazing race will require proper nutrition and hydration. Head to the closest grocery / convenience store and buy these items.</h3>
                <h3>Take a selfie with the groceries and enter the barcode on the back to unlock the first clue…</h3>
                <div className="">
                  <img  
                    className=""
                    src={barcode_example}
                  ></img>
                </div>
                <hr />
                <Form onSubmit={this.handleSubmit}>
                  <h4>Regular sized snickers bar (peanut alert!):</h4>
                  <div className="">
                    <img  
                      className=""
                      src={snickers}
                    ></img>
                  </div>
                  <Form.Control
                    className=""
                    type="text"
                    name="snickers_upc"
                    placeholder="############"
                    onChange={this.handleChange}
                    value={this.state.snickers_upc}
                    required
                  />
                  <h4>Yellow gatorade:</h4>
                  <div className="">
                    <img  
                      className=""
                      src={gatorade}
                    ></img>
                  </div>
                  <Form.Control
                    className=""
                    type="text"
                    name="gatorade_upc"
                    placeholder="############"
                    onChange={this.handleChange}
                    value={this.state.gatorade_upc}
                  />
                  <hr />
                  <h4>Enter your team's username:</h4>
                  <InputGroup className="sign-in__form__input">
                    <InputGroup.Prepend className="remove-radius--right">
                      <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      className={this.state.username_invalid_flag ? "remove-radius--left is-invalid" : "remove-radius--left"}
                      type="text"
                      name="username"
                      placeholder="username"
                      onChange={this.handleChange}
                      value={this.state.username}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Oops! This username isn't valid.
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Button className="" type="submit">Reveal Clue</Button>
                </Form>
              </div>
            :
              <div>
                <h2>Nice work! You’ve unlocked the fist clue!</h2>
                <hr />
                <h1>Clue #1</h1>
                <p>Clue that leads to Patricia’s Green…</p>
              </div>
            }
          </div>
        }
      </Container>
    );
  }
}

export default Start;
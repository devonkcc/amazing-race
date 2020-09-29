import React from "react";
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import InputGroup from "react-bootstrap/InputGroup"
import FullPageLoader from "./FullPageLoader";
import {db} from '../services/firebase';
import {NUM_CLUES} from '../helpers/constants'

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      teammate_1: "",
      teammate_2: "",
      teammate_3: "",
      loading: false,
      username_invalid_flag: false
    };
  }

  handleChange = (event) => {
    var temp_username_invalid_flag = this.state.username_invalid_flag; 
    if ((event.target.name) === "username") {
      temp_username_invalid_flag = false; 
    }
    this.setState({
      [event.target.name]: event.target.value, 
      username_invalid_flag: temp_username_invalid_flag
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({loading: true});
    var query_result = await db.collection("teams").where("username", "==", this.state.username).limit(1).get()
    if(query_result.docs.length > 0){
      this.setState({ 
        loading: false,
        username_invalid_flag: true, 
      });
    }
    else {
      let blank_clue_log = [];
      for (var i = 0; i < (NUM_CLUES+2); i++) {
        blank_clue_log.push(null)
      }
      await db.collection("teams").add({
        teammates: [this.state.teammate_1,this.state.teammate_2,this.state.teammate_3],
        username: this.state.username,
        clue_log: blank_clue_log
      });
      this.props.history.push("/welcome");
    }
  }

  render() {
    return (
      <Container>
        {this.state.loading ? 
          <FullPageLoader />
        :
          <div>
            <h1>Welcome to the Amazing Race SF!</h1>
            <h2>Enter your team's info below to register:</h2>
            <Form onSubmit={this.handleSubmit}>
              <p>Your team username (memorize the exact spelling, you’ll need this later):</p>
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
                  Oops! This username already exists.
                </Form.Control.Feedback>
              </InputGroup>
              <p>Teammate 1:</p>
              <Form.Control
                className=""
                type="text"
                name="teammate_1"
                placeholder="teammate name"
                onChange={this.handleChange}
                value={this.state.teammate_1}
                required
              />
              <p>Teammate 2:</p>
              <Form.Control
                className=""
                type="text"
                name="teammate_2"
                placeholder="teammate name"
                onChange={this.handleChange}
                value={this.state.teammate_2}
                required
              />
              <p>Teammate 3 (if applicable):</p>
              <Form.Control
                className=""
                type="text"
                name="teammate_3"
                placeholder="teammate name"
                onChange={this.handleChange}
                value={this.state.teammate_3}
              />
              <Button className="" type="submit">Register</Button>
            </Form>
          </div>
        }
      </Container>
    );
  }
}

export default Registration;
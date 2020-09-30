import React from "react";
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
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
      <Container className="px-5">
        <Row>
          <Col md={{ span: 8, offset: 2 }}>
            {this.state.loading ? 
              <FullPageLoader />
            :
              <div>
                <h2 className="mt-5">Welcome to the Amazing Race SF!</h2>
                <h3>Enter your team's info below to register:</h3>
                <hr></hr>
                <Form onSubmit={this.handleSubmit}>
                  <h4 className="mt-3 mb-1">Your team username <span className="light-text-override">(memorize the exact spelling, you’ll need this later)</span>:</h4>
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
                  <h4 className="mt-3 mb-1">Teammate 1:</h4>
                  <Form.Control
                    className=""
                    type="text"
                    name="teammate_1"
                    placeholder="name"
                    onChange={this.handleChange}
                    value={this.state.teammate_1}
                    required
                  />
                  <h4 className="mt-3 mb-1">Teammate 2:</h4>
                  <Form.Control
                    className=""
                    type="text"
                    name="teammate_2"
                    placeholder="name"
                    onChange={this.handleChange}
                    value={this.state.teammate_2}
                    required
                  />
                  <h4 className="mt-3 mb-1">Teammate 3 <span className="light-text-override">(if applicable)</span>:</h4>
                  <Form.Control
                    className=""
                    type="text"
                    name="teammate_3"
                    placeholder="name"
                    onChange={this.handleChange}
                    value={this.state.teammate_3}
                  />
                  <Button className="mt-3 mb-5 px-4" type="submit">Register</Button>
                </Form>
              </div>
            }
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Registration;
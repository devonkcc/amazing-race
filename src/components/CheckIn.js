import React from "react";
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Button from "react-bootstrap/Button"
import InputGroup from "react-bootstrap/InputGroup"
import FullPageLoader from "./FullPageLoader";
import {db} from '../services/firebase';

class CheckIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clue_id: this.props.match.params.id,
      clue_name: "",
      clue_subheading: "",
      clue_num: null,
      clue_valid: false,
      username: "",
      loading: false,
      username_invalid_flag: false
    };
  }

  componentDidMount() {
    db.collection("clues").doc(this.state.clue_id).get().then((result) => {
      if (result.exists) {
        var clue_data = result.data();
        this.setState({
          clue_name: clue_data.clue_name,
          clue_subheading: clue_data.clue_subheading,
          clue_num: clue_data.clue_num,
          clue_valid: true,
          loading: false,
        });
      }
      else {
        this.setState({
          clue_name: "Opps, something went wrong...",
          clue_subheading: "The clue ID seems to be invalid. Try scanning the clue code again.",
          loading: false,
        }); 
      }
    });
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
      var temp_clue_log = query_result.docs[0].data().clue_log;
      temp_clue_log[this.state.clue_num] = new Date();
      await db.collection("teams").doc(query_result.docs[0].id).update({
        clue_log: temp_clue_log
      });
      this.props.history.push("/dashboard");
    }
    else {
      this.setState({ 
        loading: false,
        username_invalid_flag: true, 
      });
    }
  }

  render() {
    return (
      <Container>
        {this.state.loading ? 
          <FullPageLoader />
        :
          <div>
            <h1>{this.state.clue_name}</h1>
            <h2>{this.state.clue_subheading}</h2>
            {this.state.clue_valid && 
            <Form onSubmit={this.handleSubmit}>
              <p>Enter your team's username:</p>
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
              <Button className="" type="submit">Check In</Button>
            </Form>}
          </div>
        }
      </Container>
    );
  }
}

export default CheckIn;
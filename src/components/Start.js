import React from "react";
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import InputGroup from "react-bootstrap/InputGroup"
import Countdown from "react-countdown"
import barcode_example from '../assets/barcode_example.png'
import snickers from '../assets/snickers.png'
import gatorade from '../assets/gatorade.png'
import statue from '../assets/statue.png'
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
      username_invalid_flag: false,
      start_time: 1601922600000
    };
  }

  componentDidMount() {
    db.collection('params').doc('sf').get().then((doc) => {
      this.setState({ start_time: doc.data().start_time });
    });
  }

  renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      this.setState({ countdown_complete: true }); 
    }
  return <span>
    <Row className="mx-2 start__countdown__general justify-content-center">
      <Col sm={1}></Col>
      <Col>
        <Row className="start__countdown__value justify-content-center">
          {days}
        </Row>
        <Row className="start__countdown__subheading justify-content-center">
          DAYS
        </Row>
      </Col>
      <Col className="px-1 start__countdown__colon">:</Col>
      <Col>
        <Row className="start__countdown__value justify-content-center">
          {hours}
        </Row>
        <Row className="start__countdown__subheading justify-content-center">
          HOURS
        </Row>
      </Col>
      <Col className="px-1 start__countdown__colon">:</Col> 
      <Col>
        <Row className="start__countdown__value justify-content-center">
          {minutes}
        </Row>
        <Row className="start__countdown__subheading justify-content-center">
          MINUTES
        </Row>
      </Col>
      <Col className="px-1 start__countdown__colon">:</Col>
      <Col>
        <Row className="start__countdown__value justify-content-center">
          {seconds}
        </Row>
        <Row className="start__countdown__subheading justify-content-center">
          SECONDS
        </Row>
      </Col>
      <Col sm={1}></Col>
    </Row>
    </span>
  };

  handleChange = (event) => {
    var temp_username_invalid_flag = this.state.username_invalid_flag; 
    if ((event.target.name) === "username") {
      temp_username_invalid_flag = false; 
    }
    this.setState({
      [event.target.name]: event.target.value, 
      username_invalid_flag: temp_username_invalid_flag
    },
    () => {
      this.setState({
        snickers_upc_valid: VALID_SNICKERS_UPC.includes(this.state.snickers_upc),
        gatorade_upc_valid: VALID_GATORADE_UPC.includes(this.state.gatorade_upc) 
      });
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
    else {
      alert("Nope! Incorrect UPC code 😢")
    }
  }

  render() {
    return (
      <Container className="px-4">
        <Row>
          <Col md={{ span: 8, offset: 2 }}>
            {!this.state.countdown_complete ? 
              <div className="start__countdown" >
                <h1 className="pb-2">READY, SET, GO</h1>
                <hr></hr>
                <h2 className="pt-2">The Amazing Race starts in:</h2>
                <Countdown
                  //date={Date.now() + 10000}
                  date={this.state.start_time}
                  renderer={this.renderer}
                />
              </div>
            :
              <div>
                {!this.state.show_clue ? 
                  <div>
                    <h2 className="mt-3">Grocery Challenge:</h2>
                    <h3>Winning the amazing race will require proper nutrition and hydration. Head to the closest grocery / convenience store and buy the two items below.</h3>
                    <h3>Take a selfie with the groceries and enter the barcode on the back to unlock the first clue…</h3>
                    <div className="">
                      <img  
                        className="start__grocery-list-img"
                        src={barcode_example}
                      ></img>
                    </div>
                    <hr />
                    <Form onSubmit={this.handleSubmit}>
                      <div className="start__grocery-list">
                        <h4>Snickers Bar <span className="light-text-override">(🥜 ALERT!)</span>:</h4>
                        <div className="">
                          <img  
                            className="start__grocery-list-img"
                            src={snickers}
                          ></img>
                        </div>
                        <Form.Control
                          className={"start__grocery-list__form " + (this.state.snickers_upc.length >= 12 ? this.state.snickers_upc_valid ? "is-valid" : "is-invalid" : "")}
                          type="text"
                          name="snickers_upc"
                          placeholder="############"
                          onChange={this.handleChange}
                          value={this.state.snickers_upc}
                          required
                        />
                        <hr></hr>
                        <h4>Yellow gatorade:</h4>
                        <div className="">
                          <img  
                            className="start__grocery-list-img"
                            src={gatorade}
                          ></img>
                        </div>
                        <Form.Control
                          className={"start__grocery-list__form " + (this.state.gatorade_upc.length >= 12 ? this.state.gatorade_upc_valid ? "is-valid" : "is-invalid" : "")}
                          type="text"
                          name="gatorade_upc"
                          placeholder="############"
                          onChange={this.handleChange}
                          value={this.state.gatorade_upc}
                        />
                      </div>
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
                      <Button className="mt-3 mb-5 px-4" type="submit">Reveal Clue</Button>
                    </Form>
                  </div>
                :
                  <div>
                    <h2 className="mt-5">Nice work! You’ve unlocked the first clue!</h2>
                    <hr />
                    <h1 className="mb-2">Clue #1</h1>
                    <div className="start__annagrams start__grocery-list mx-0 py-4">
                      <h4 className="">Anagrams:</h4>
                      <Row>
                        <Col className="pl-0 pr-2 text-right" >Parasitic →</Col>
                        <Col className="pl-0 text-left" >_ _ _ _ _ _ _ _ ' _</Col>
                      </Row>
                      <Row>
                        <Col className="pl-0 pr-2 text-right" >Genre →</Col>
                        <Col className="pl-0 text-left" >_ _ _ _ _</Col>
                      </Row>
                      <Row>
                        <Col className="pl-0 pr-2 text-right" >ni →</Col>
                        <Col className="pl-0 text-left" >_ _</Col>
                      </Row>
                      <Row>
                        <Col className="pl-0 pr-2 text-right" >yeaHs →</Col>
                        <Col className="pl-0 text-left" >_ _ _ _ _</Col>
                      </Row>
                      <Row className="mb-3">
                        <Col className="pl-0 pr-2 text-right" >laVley →</Col>
                        <Col className="pl-0 text-left" >_ _ _ _ _ _</Col>
                      </Row>
                        <div className="">
                          <img  
                            className="start__grocery-list-img"
                            src={statue}
                          ></img>
                        </div>
                    </div>
                  </div>
                }
              </div>
              }
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Start;
import React from "react";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Countdown from "react-countdown"
import golden_gate from '../assets/golden_gate.png'

class Home extends React.Component {

  renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      this.props.history.push("/start");
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


  render() {
    return (
      <Container className="px-5">
        <Row>
          <Col md={{ span: 8, offset: 2 }}>
            <div className="home__countdown" >
              <div className="">
                <img  
                  className="start__grocery-list-img"
                  src={golden_gate}
                ></img>
              </div>
              <h1 className="pb-2">READY, SET, GO</h1>
              <hr></hr>
              <h2 className="pt-2">The Amazing Race starts in:</h2>
              <Countdown
                //date={Date.now() + 10000}
                date={"2020-10-03T10:30-0700"}
                renderer={this.renderer}
              />
            </div>
            <hr></hr>
            <i class="py-3 fa fa-map-marker fa-3" aria-hidden="true"></i>
            <p className="light-text-override">Dolores Park, SF</p>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Home;
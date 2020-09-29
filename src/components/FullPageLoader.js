import React from "react";
import Container from "react-bootstrap/Container";

class FullPageLoader extends React.Component {
  render() {
    return (
      <Container>
        <div className="d-flex justify-content-center">
          <div className="spinner-border full_page_loader" role="status">
          </div>
        </div>
      </Container>
    );
  }
}

export default FullPageLoader;

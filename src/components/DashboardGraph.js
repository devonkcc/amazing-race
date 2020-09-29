import React from 'react'
import { Chart } from 'react-charts'
import Container from "react-bootstrap/Container"

class DashboardGraph extends React.Component {
  render() {
    const series = {
      showPoints: false
    }
    const axes = [
      { primary: true, type: 'time', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ]
    return (
      <div style={{ width: '60vw', height: '30vh' }} >
        <Chart data={this.props.data} series={series} axes={axes} tooltip />
      </div>
    );
  }
}

export default DashboardGraph;
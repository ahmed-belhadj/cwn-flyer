require('styles/vender/bootstrap.min.css');
require('styles/vender/font-awesome.min.css');
require('styles/vender/Raleway.css');
require('styles/App.css');
require('es6-promise').polyfill();
require('isomorphic-fetch');

import React from 'react'

import TimeSlot from 'components/TimeSlot.js'
import Jumbotron from 'components/Jumbotron.js'

class BirminghamScheduleComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      slottedEvents: [],
      loading: true
    }
  }

  componentWillMount() {
    var that = this;
      fetch('/api/bhm/cwnEvents/current')
      .then((resp) => {
          return resp.json();
      }).then((response) => {
        var slottedEvents = {};
        response.forEach(function(event) {
          var time = event.start_time;
          if (slottedEvents[time] == undefined)
            slottedEvents[time] = [];
          slottedEvents[time].push(event);
        });
        that.setState({ slottedEvents: slottedEvents, loading: false });
      });
  }

  render() {
    if (this.state.loading)
      return (<div></div>);
    const slottedEvents = this.state.slottedEvents;
    var times = Object.keys(slottedEvents);
    times.sort();
    const slottedList = times.map((time, index) =>
     <TimeSlot key={index} events={slottedEvents[time]} time={time}/>
    );
    
    return (
      <div>
        <Jumbotron isBhm={true} cwnDate={times[0] != undefined ? slottedEvents[times[0]][0].date : ''} cwnNumber={times[0] != undefined ? slottedEvents[times[0]][0].cwn : ''}/>
        <div className="container my-2 cwn-schedule">
          {slottedList}
        </div>
        <div className="footer-spacer"></div>

        <footer className="footer fixed-bottom text-center">
          <div className="container">
            <p className="schedule-url">
              <a href="https://coworkingnight.org/schedule">coworkingnight.org/schedule</a>
            </p>
            <p className="cwn-sponsors">
              Sponsored by <a href="https://innovationdepot.org" target="_blank">Innovation Depot</a>. Presented by <a href="https://www.urbanengine.org" target="_blank">Urban Engine</a>.
            </p>
          </div>
        </footer>
      </div>
    );
  }
}

BirminghamScheduleComponent.defaultProps = {
};

export default BirminghamScheduleComponent;

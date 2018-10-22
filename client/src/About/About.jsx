import React, { Component } from 'react';
import Jumbotron from '../components/Jumbotron/';
import './About.css';

class About extends Component {
  render() {
    return (
      <div className="About">
        <Jumbotron cx="sixVH" header="About us" subheader="you’re busy,  we have you covered" />

        <h4>
          Nobody wants to choose between work and their dog. Fetch was created to give you a place
          to finish your tasks guilt free, as your dog frolics with their playmates.
        </h4>

        <div />
      </div>
    );
  }
}

export default About;

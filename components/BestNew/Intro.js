import React from 'react';

const BestNewIntro = (props) => (
  <section key="intro-section" className="best-new-wrap">
    <a onClick={props.hideIntro} href="#"><h1>Best New <br />Albums <br />&rarr;</h1></a>
  </section>
);

export default BestNewIntro;


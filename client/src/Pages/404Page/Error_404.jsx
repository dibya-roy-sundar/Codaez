import React from "react";
import "./Error_404.scss";

const Error_404 = () => {
  return (
    <div className="error-404">
      <h1>404</h1>
      <div className="cloak__wrapper">
        <div className="cloak__container">
          <div className="cloak"></div>
        </div>
      </div>
      <div className="info">
        <h2>We can not find that page</h2>
        <p>We are fairly sure that page used to be here, but seems to have gone missing. We do apologise for this</p>


      </div>
    </div>
  );
};

export default Error_404;

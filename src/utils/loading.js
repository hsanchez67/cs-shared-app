import React from "react";
import PropTypes from "prop-types";
import logo from "../images/good-white-orange-ada-tm.png";

const Loading = ({ active }) => {
  if (!active) return null;
  return (
    <div className="loading-smiley-container">
      <img className="loading-smiley" src={logo} alt="GoodLeap" />
    </div>
  );
};

Loading.propTypes = {
  active: PropTypes.any, // just looking for truthy values
};
Loading.defaultProps = {
  active: true,
};

export default Loading;

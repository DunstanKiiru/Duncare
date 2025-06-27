import React from "react";

const Error = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center m-auto text-center px-4">
      <h1 className="display-4 w-100 text-center">OOOPS!!! Umepotea Mzee</h1>
      <p>The page doesn't exist check again</p>
      <a href="/" className="btn btn-primary mt-3">
        Back to Home
      </a>
    </div>
  );
};

export default Error;

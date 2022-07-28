import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import { BrowserRouter as Router } from "react-router-dom";
import ThemeProvider, { GoodLeap } from "@loanpal/lumos__theme";
Amplify.configure(awsExports);

const Main = ({ children }) => {
  return (
    <React.StrictMode>
      <ThemeProvider theme={GoodLeap}>{children}</ThemeProvider>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Main>
        <App />
      </Main>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

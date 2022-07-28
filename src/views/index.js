import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { default as Admin } from "./admin";
import { default as Home } from "./home";

const Router = () => {
  let location = useLocation();
  console.log(location);
  return (
    <>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
};

export default Router;

import React from "react";
import { Routes, Route } from "react-router-dom";
import { default as Admin } from "./admin";
import { default as Home } from "./home";
import { default as Apply } from "./apply";

const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/apply/:id" exact element={<Apply />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
};

export default Router;

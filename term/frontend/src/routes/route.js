// src/routes/Route.js
import React from "react";
import { Routes, Route } from "react-router-dom";


import Register from "../components/auth/register";
import Login from "../components/auth/login";
import Album from "../components/album/album";


const PageRoutes = ()=> {
  return (
    <>
    <Routes>
    <Route path="/" exact element={<Login/>}></Route>
      <Route path="/register" element={<Register/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/album" element={<Album/>}></Route>
    </Routes>
    </>
  );
};

export default PageRoutes;
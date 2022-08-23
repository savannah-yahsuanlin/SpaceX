import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Listing from "./Listing";
import Next from "./Next";
import Nav from './Nav'


function App() {
  return (
  <>
    <Router>
      <Nav/>
      <Routes>
        <Route path='/' element={<Listing/>}/>
        <Route path='/next' element={<Next/>}/>
      </Routes>
    </Router>
  </>
  );
}

export default App;

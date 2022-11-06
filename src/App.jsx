import React from "react";
import { Route, Routes } from "react-router-dom";
import DataDetail from "./pages/DataDetail";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/detail/:id" element={<DataDetail />} />
    </Routes>
  );
}

export default App;

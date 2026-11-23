import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
  import Header from './Components/Layout/Header';

function Routess() {
  return (
    <BrowserRouter>
      <Routes>
        <Header />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Routess;
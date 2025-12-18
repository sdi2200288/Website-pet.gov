import React from "react";
import Menu from "./components/Menu/Menu";
import HomePage from "./pages/HomePage/HomePage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Menu />
      <main className="main-content">
        <HomePage />
      </main>
    </div>
  );
}

export default App;

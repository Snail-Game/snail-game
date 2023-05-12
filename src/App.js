import "./App.css";
import TestLevel from "./components/TestLevel";
import Canvas from "./components/Canvas";
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div id="app">
      <Routes>
        <Route path='/' element={<TestLevel />} />
        <Route path='/leveleditor' element={<Canvas />} />
      </Routes>
    </div>
  );
}

export default App;

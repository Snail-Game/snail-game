import './App.css';
import { useState } from 'react';
import Canvas from './Canvas';

function App() {
  const [tileRows, setTileRows] = useState([[1,1,1,1,1],[1,0,0,0,1],[1,0,0,1,1],[1,0,1,0,1],[1,1,1,1,1]]);

  return (
    <div className="mother">
        <Canvas tileRows={tileRows} />
    </div>
  );
}

export default App;

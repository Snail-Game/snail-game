import './App.css';
import { useState } from 'react';
import Canvas from './Canvas';

function App() {
  const [tileColumns, setTileColumns] = useState([[1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,1],[1,0,0,0,0,0,1,1],[1,0,0,0,0,0,1,1],[1,0,0,0,0,0,1,1],[1,0,1,0,1,0,0,1],[1,1,1,1,1,1,1,1]]);

  return (
    <div className="mother">
        <Canvas tileColumns={tileColumns} />
    </div>
  );
}

export default App;

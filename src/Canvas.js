import { useEffect, useState, useRef } from 'react';

export default function Canvas() {
  const canvasRef = useRef(null);
  const [tileColumns, setTileColumns] = useState([[1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,1],[1,0,0,0,0,0,1,1],[1,0,0,0,0,0,1,1],[1,0,0,0,0,0,1,1],[1,0,1,0,1,0,0,1],[1,1,1,1,1,1,1,1]]);
  const [padding, setPadding] = useState(2);
  const [cellSize, setCellSize] = useState(30);
  const [numRows, setNumRows] = useState(8);
  const [numColumns, setNumColumns] = useState(7); 
  
  useEffect(() => {
    const draw = ctx => {
      tileColumns.forEach((column, i) => {
        column.forEach((tile, j) => {
          if (tile > 0) {
            ctx.fillStyle = 'green';
            ctx.fillRect(i * (cellSize + padding), j * (cellSize + padding), cellSize, cellSize);
          } else if (tile === 0) {
            ctx.fillStyle = 'blue';
            ctx.fillRect(i * (cellSize + padding), j * (cellSize + padding), cellSize, cellSize);
          }
        })
      });
      return ctx;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    draw(ctx);
    },[tileColumns, cellSize, padding])

    useEffect(() => {
      if (tileColumns.length < numColumns) {
        let newColumn = [];
        for (let i = 0; i < numRows; i++) {
          newColumn = [...newColumn, 1];
        }
        setTileColumns([...tileColumns, newColumn]);        
      } else if (tileColumns[0].length < numRows) {
        let newArray = [...tileColumns];
        console.log(newArray);
        for (let i = 0; i< newArray.length; i++) {
          newArray[i] = [...newArray[i], 1];
        }
        setTileColumns(newArray);
      }
    },[numRows, numColumns])

  return (
    <div>
      <canvas ref={canvasRef} id='canvas' width='600' height='600'>
      </canvas>
      <form id='form'>
        <label>Cell size: </label>
        <input type={'number'} value={cellSize} onChange={e => setCellSize(parseInt(e.target.value))}></input>
        <label>Padding: </label>
        <input type={'number'} value={padding} onChange={e => setPadding(parseInt(e.target.value))}></input>
      </form>
      <button onClick={() => setNumColumns(numColumns + 1)}>Add column</button>
      <button onClick={() => setNumRows(numRows + 1)}>Add row</button>
        
    </div>
  );
}
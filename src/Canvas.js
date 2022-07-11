import { useEffect, useState, useRef } from 'react';

export default function Canvas() {
  const canvasRef = useRef(null);
  const [tileColumns, setTileColumns] = useState(
    [
      [1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,1,1],
      [1,0,0,0,0,0,1,1],
      [1,0,0,0,0,0,1,1],
      [1,0,1,0,1,0,0,1],
      [1,0,1,0,1,0,0,1],
      [1,1,1,1,1,1,1,1]]);
  const [padding, setPadding] = useState(2);
  const [cellSize, setCellSize] = useState(50);
  const [numRows, setNumRows] = useState(8);
  const [numColumns, setNumColumns] = useState(8); 
  const [canvasWidth, setCanvasWidth] = useState(414); //i.v. manually calculated
  const [canvasHeight, setCanvasHeight] = useState(414); 
  const [wallColor, setWallColor] = useState('#506F91');
  const [spaceColor, setSpaceColor] = useState('#A0DAB6');
  
  useEffect(() => {
    if (tileColumns.length < numColumns) {
      setCanvasWidth(numColumns*(cellSize + padding) - padding);
      setCanvasHeight(numRows*(cellSize + padding) - padding);
      let newColumn = [];
      for (let i = 0; i < numRows; i++) {
        newColumn = [...newColumn, 1];
      }
      setTileColumns([...tileColumns, newColumn]);        
    } else if (tileColumns[0].length < numRows) {
      setCanvasWidth(numColumns*(cellSize + padding) - padding);
      setCanvasHeight(numRows*(cellSize + padding) - padding);
      let newArray = [...tileColumns];
      for (let i = 0; i < newArray.length; i++) {
        newArray[i] = [...newArray[i], 1];
        }
        setTileColumns(newArray);
    } else if (tileColumns.length > numColumns) {
      let newArray=[];
      for (let i = 0; i < numColumns; i++) {
        newArray[i] = [...tileColumns[i]];
      }
      setTileColumns(newArray);
      setCanvasWidth(numColumns*(cellSize + padding) - padding);
      setCanvasHeight(numRows*(cellSize + padding) - padding);
    } else if (tileColumns[0].length > numRows) {
      let newArray = [];
      for (let i = 0; i < numColumns; i++) {
        let newCol = [];
        for (let j = 0; j < numRows; j++) {
          newCol[j] = tileColumns[i][j];
        }
        newArray[i] = newCol;
      }
      setTileColumns(newArray);
      setCanvasWidth(numColumns*(cellSize + padding) - padding);
      setCanvasHeight(numRows*(cellSize + padding) - padding);
    }
    
    const draw = ctx => {
      tileColumns.forEach((column, i) => {
        column.forEach((tile, j) => {
          if (tile > 0) {
            ctx.fillStyle = wallColor;
            ctx.fillRect(i * (cellSize + padding), j * (cellSize + padding), cellSize, cellSize);
          } else if (tile === 0) {
            ctx.fillStyle = spaceColor;
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
  }, [tileColumns, numRows, numColumns, cellSize, padding])

  const handleCellChange = (e) => {
    if (parseInt(e.target.value) > cellSize) {
    setCanvasWidth(numColumns*(parseInt(e.target.value) + padding) - padding);
    setCanvasHeight(numRows*(parseInt(e.target.value) + padding) - padding);
    setCellSize(parseInt(e.target.value));
    } else {
      setCellSize(parseInt(e.target.value));
      setCanvasWidth(numColumns*(parseInt(e.target.value) + padding) - padding);
      setCanvasHeight(numRows*(parseInt(e.target.value) + padding) - padding);
    }
  }

  const handlePaddingChange = (e) => {
    if (parseInt(e.target.value) > cellSize) {
    setCanvasWidth(numColumns*(parseInt(e.target.value) + cellSize) - padding);
    setCanvasHeight(numRows*(parseInt(e.target.value) + cellSize) - padding);
    setPadding(parseInt(e.target.value))
    } else {
      setPadding(parseInt(e.target.value))
      setCanvasWidth(numColumns*(parseInt(e.target.value) + cellSize) - padding);
      setCanvasHeight(numRows*(parseInt(e.target.value) + cellSize) - padding);
    }
  }

  const handleWallChange = (e) => {
    setWallColor(e.target.value);
    setTileColumns([...tileColumns]);
  }
  
  const handleSpaceChange = (e) => {
    setSpaceColor(e.target.value);
    setTileColumns([...tileColumns]);
  }
  
  return (
    <div id='main'>
      <h1>Snail game map editor</h1>
      <form id='form'>
        <label>Cell size:</label>
        <input type={'number'} value={cellSize} onChange={e => handleCellChange(e)}></input>
        <label>Wall color:</label>
        <input type={'color'} value={wallColor} onChange={e => handleWallChange(e)}></input>
        <br></br>
        <label>Padding:</label>
        <input type={'number'} value={padding} onChange={e => handlePaddingChange(e)}></input>
        <label>Empty space color:</label>
        <input type={'color'} value={spaceColor} onChange={e => handleSpaceChange(e)}></input>
      </form>
      <div id='button-div'>
        <button onClick={() => setNumColumns(numColumns + 1)}>Add column</button>
        <button onClick={() => setNumRows(numRows + 1)}>Add row</button>
        <button onClick={() => setNumColumns(numColumns - 1)}>Delete column</button>
        <button onClick={() => setNumRows(numRows - 1)}>Delete row</button>
      </div>
      <canvas ref={canvasRef} id='canvas' width={`${canvasWidth}`} height={`${canvasHeight}`}>
      </canvas>
        
    </div>
  );
}
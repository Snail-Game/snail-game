import { useEffect, useState, useRef } from 'react';

export default function Canvas() {
  const canvasRef = useRef(null);
  const charRef = useRef(null);
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
  const [canvasWidth, setCanvasWidth] = useState(() => {return numColumns*(cellSize + padding) - padding});
  const [canvasHeight, setCanvasHeight] = useState(() => {return numRows*(cellSize + padding) - padding}); 
  const [wallColor, setWallColor] = useState('#506F91');
  const [spaceColor, setSpaceColor] = useState('#A0DAB6');
  const [coordinates, setCoordinates] = useState({});
  const [playerCoordinates, setPlayerCoordinates] = useState({});
  const [moveColor, setUseColor] = useState('#FFD700');

  useEffect(() => {
    const tileXIndex = Math.floor((coordinates.x - canvasRef.current.offsetLeft - canvasRef.current.scrollLeft - 10 + padding) / (cellSize + padding));
    const tileYIndex = Math.floor((coordinates.y - canvasRef.current.offsetTop - canvasRef.current.scrollTop - 10 + padding) / (cellSize + padding));
    let newArray = [];
    for (let i = 0; i < tileColumns.length; i++) {
      let newCol = [];
      if (i === tileXIndex) {
        for (let j = 0; j < tileColumns[0].length; j++) {
          if (j === tileYIndex) {
            if (tileColumns[i][j] === 0) {
              newCol[j] = 1;
            } else {
              newCol[j] = 0;
            }
          } else {
            newCol[j] = tileColumns[i][j];
          }
        }
        newArray[i] = newCol;
      } else {
       newArray[i] = tileColumns[i];
      }
    }
    setTileColumns(newArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates, cellSize, padding])
  
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
    ///////////////// draw logic ////////////////////////
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
  }, [tileColumns, numRows, numColumns, cellSize, padding, spaceColor, wallColor])

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
  
  const handleCanvasClick = (e) => {
    setCoordinates(
      {
        x: e.clientX,
        y: e.clientY
      }
    );
  }

  const charHandleClick = (e) => {
    console.log(e.clientX);
    setPlayerCoordinates(
      {
        x: e.clientX,
        y: e.clientY
      }
    );
  }
   
  useEffect(() => {
    let moveArray = [];
    let moveXIndices = [];
    let moveYIndices = [];
    for (let i = 0; i < 4; i++) {
      moveXIndices[i] = Math.floor((playerCoordinates.x - canvasRef.current.offsetLeft - canvasRef.current.scrollLeft - 10 + padding) / (cellSize + padding)) - i;
      moveXIndices[i + 4] = Math.floor((playerCoordinates.x - canvasRef.current.offsetLeft - canvasRef.current.scrollLeft - 10 + padding) / (cellSize + padding)) + i;
    }
    for (let i = 0; i < 4; i++) {
      moveYIndices[i] = Math.floor((playerCoordinates.y - canvasRef.current.offsetTop - canvasRef.current.scrollTop - 10 + padding) / (cellSize + padding)) - i;
      moveYIndices[i + 4] = Math.floor((playerCoordinates.y - canvasRef.current.offsetTop - canvasRef.current.scrollTop - 10 + padding) / (cellSize + padding)) + i;
    }
    moveArray = [moveXIndices, moveYIndices];
    console.log(moveArray[0]);
    // console.log(tileColumns[moveArray[0][1]][moveArray[1][1]]);
    // const draw = ctx => {
    //   moveArray.forEach((column, i) => {
    //     column.forEach((tile, j) => {
    //       if (tileColumns[moveArray[0][j]][moveArray[1][j]] > 0) {
    //         ctx.fillStyle = wallColor;
    //         ctx.fillRect(moveArray[0][j] * (cellSize + padding), moveArray[1][j] * (cellSize + padding), cellSize, cellSize);
    //       } else if (tile === 0) {
    //         ctx.fillStyle = moveColor;
    //         ctx.fillRect(moveArray[0][j] * (cellSize + padding), moveArray[1][j] * (cellSize + padding), cellSize, cellSize);
    //       }
    //     })
    //   });
    //   return ctx;
    // }
    // const canvas = canvasRef.current;
    // const ctx = canvas.getContext('2d');
    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    // draw(ctx);
  }, [playerCoordinates])


  // const handleMouseMove = (e) => {
  //   const tileXIndex = Math.floor((e.clientX - canvasRef.current.offsetLeft - canvasRef.current.scrollLeft + padding) / (cellSize + padding));
  //   const tileYIndex = Math.floor((e.clientY - canvasRef.current.offsetTop - canvasRef.current.scrollTop + padding) / (cellSize + padding));
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext('2d');

  //   setTimeout(() => {
  //     for (let i = 0; i < tileColumns.length; i++) {
  //       if (i === tileXIndex) {
  //         for (let j = 0; j < tileColumns[i].length; j++) {
  //           if (j === tileYIndex) {
  //             ctx.shadowBlur = 5;
  //             ctx.shadowOffsetX = 5;
  //             ctx.shadowOffsetY = 5;
  //             ctx.shadowColor = 'black';
  //             if (tileColumns[tileXIndex][tileYIndex] > 0) {
  //               ctx.fillStyle = wallColor;
  //               ctx.fillRect(tileXIndex * (cellSize + padding), tileYIndex * (cellSize + padding), cellSize, cellSize);
  //             } else if (tileColumns[tileXIndex][tileYIndex] === 0) {
  //               ctx.fillStyle = spaceColor;
  //               ctx.fillRect(i * (cellSize + padding), j * (cellSize + padding), cellSize, cellSize);
  //             }
  //           }
  //         }
  //       }
  //     }
  //   },0)
  // }

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
      <canvas onClick={(e) => handleCanvasClick(e)} ref={canvasRef} id='canvas' width={`${canvasWidth}`} height={`${canvasHeight}`}>
      </canvas>
      <img onClick={(e) => charHandleClick(e)} ref={charRef} className='snail' src='/dream-gary1.jpg' alt='snail'></img>
        
    </div>
  );
}
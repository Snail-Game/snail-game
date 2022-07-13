import { useEffect, useState, useRef, useMemo, useCallback } from "react";

export default function Canvas() {
  const canvasRef = useRef(null);
  const padding = 2;
  const cellSize = 64;
  const canvasWidth = 526; //i.v. manually calculated
  const canvasHeight = 526;
  const wallColor = "#506F91";
  const spaceColor = "#A0DAB6";
  const moveColor = "#FFD700";
  const [tileColumns, setTileColumns] = useState([
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 9, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ]);
  const [activeTile, setActiveTile] = useState({ x: 0, y: 0 });

  const player = useMemo(() => {return new Image()}, []);
  player.src = "/images/snail.png";

  const draw = useCallback((ctx) => {
    tileColumns.forEach((column, i) => {
      column.forEach((tile, j) => {
        if (tile === 1) {
          ctx.fillStyle = wallColor;
          ctx.fillRect(
            i * (cellSize + padding),
            j * (cellSize + padding),
            cellSize,
            cellSize
          );
        } else if (tile === 0) {
          ctx.fillStyle = spaceColor;
          ctx.fillRect(
            i * (cellSize + padding),
            j * (cellSize + padding),
            cellSize,
            cellSize
          );
        } else if (tile === 9) {
          ctx.fillStyle = spaceColor;
          ctx.fillRect(
            i * (cellSize + padding),
            j * (cellSize + padding),
            cellSize,
            cellSize
          );
          player.onload = function() {
            ctx.drawImage(
              player,
              i * (cellSize + padding),
              j * (cellSize + padding)
            );
          };
        } else if (tile === 2) {
          ctx.fillStyle = spaceColor;
          ctx.fillRect(
            i * (cellSize + padding),
            j * (cellSize + padding),
            cellSize,
            cellSize
            )
            ctx.strokeStyle = moveColor;
            ctx.lineWidth = 3;
            ctx.strokeRect(i * (cellSize + padding), j * (cellSize + padding), cellSize, cellSize);
        }
      });
    });
    console.log(tileColumns);
    return ctx;
  }, [player, tileColumns]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx);
  }, [draw]);
  
  useEffect(() => {                              // click-to-move logic
    const x = activeTile.x;
    const y = activeTile.y;
    if (tileColumns[x][y] === 9) {
      console.log('player is here');
      if (tileColumns[x + 1][y] === 0) {
        const newArray = [...tileColumns];
        newArray[x + 1][y] = 2;
        setTileColumns(newArray);
      }
      if (tileColumns[x - 1][y] === 0) {
        const newArray = [...tileColumns];
        newArray[x - 1][y] = 2;
        setTileColumns(newArray);
      }
      if (tileColumns[x][y + 1] === 0) {
        const newArray = [...tileColumns];
        newArray[x][y + 1] = 2;
        setTileColumns(newArray);
      }
      if (tileColumns[x + 1][y - 1] === 0) {
        const newArray = [...tileColumns];
        newArray[x][y - 1] = 2;
        setTileColumns(newArray);
      }
    } else if (tileColumns[x][y] === 2) {
      const newArray = [...tileColumns];
      newArray.forEach((col, i) => {
        col.forEach((tile, j) => {
          if (newArray[i][j] === 2 || newArray[i][j] === 9) {
            newArray[i][j] = 0;
          }
        })
      })
      newArray[x][y] = 9;
      setTileColumns(newArray);
    } else console.log('no player on this tile');
  }, [activeTile])
  

  const handleCanvasClick = (e) => {
    const mouseCoordinates = {
      x: e.clientX,
      y: e.clientY,
    };
    setActiveTile({
      x: Math.floor(
        (mouseCoordinates.x -
          canvasRef.current.offsetLeft -
          canvasRef.current.scrollLeft +
          padding) /
          (cellSize + padding)
      ),
      y: Math.floor(
        (mouseCoordinates.y -
          canvasRef.current.offsetTop -
          canvasRef.current.scrollTop +
          padding) /
          (cellSize + padding)
      ),
    });
  };

  return (
    <div id="main">
      <h1>Snail game map editor</h1>
      <canvas
        onClick={(e) => handleCanvasClick(e)}
        ref={canvasRef}
        id="canvas"
        width={`${canvasWidth}`}
        height={`${canvasHeight}`}
      ></canvas>
    </div>
  );
}

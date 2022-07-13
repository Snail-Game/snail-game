import { useEffect, useState, useRef, useCallback } from "react";

export default function TestLevel() {
  const canvasRef = useRef(null);
  const padding = 2;
  const cellSize = 64;
  const canvasWidth = 8 * (cellSize + padding) - padding;
  const canvasHeight = 8 * (cellSize + padding) - padding;
  const wallColor = "#506F91";
  const spaceColor = "#A0DAB6";
  const moveColor = "#FFD700";
  const attackColor = "#bb0a1e";
  const [tileColumns, setTileColumns] = useState([
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 8, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 8, 0, 1],
    [1, 0, 9, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ]);
  const [activeTile, setActiveTile] = useState({ x: 0, y: 0 });

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
          const player = new Image();
          player.src = "/images/snail.png";
          player.onload = function() {
            ctx.drawImage(
              player,
              i * (cellSize + padding),
              j * (cellSize + padding)
            );
          };
        } else if (tile === 8) {
          ctx.fillStyle = spaceColor;
          ctx.fillRect(
            i * (cellSize + padding),
            j * (cellSize + padding),
            cellSize,
            cellSize
          );
          const enemy = new Image();
          enemy.src = "/images/squirrel.png";
          enemy.onload = function() {
            ctx.drawImage(
              enemy,
              i * (cellSize + padding),
              j * (cellSize + padding)
            );
          };
        } else if (tile === 3) {
          ctx.fillStyle = spaceColor;
          ctx.fillRect(
            i * (cellSize + padding),
            j * (cellSize + padding),
            cellSize,
            cellSize
          );
          const enemy = new Image();
          enemy.src = "/images/squirrel.png";
          enemy.onload = function() {
            ctx.drawImage(
              enemy,
              i * (cellSize + padding),
              j * (cellSize + padding)
            );
          };
          ctx.strokeStyle = attackColor;
            ctx.lineWidth = 3;
            ctx.strokeRect(i * (cellSize + padding), j * (cellSize + padding), cellSize, cellSize);
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
    return ctx;
  }, [tileColumns]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx);
  }, [draw]);
  
  useEffect(() => {                              // click-to-move logic
    const x = activeTile.x;
    const y = activeTile.y;
    const newArray = [...tileColumns];
    if (tileColumns[x][y] === 9) {
      console.log('player is here');
      if (tileColumns[x + 1][y] === 0) {
        newArray[x + 1][y] = 2;
      } else if (tileColumns[x + 1][y] === 2) {
        newArray[x + 1][y] = 0;
      } else if (tileColumns[x + 1][y] === 8) {
        newArray[x + 1][y] = 3;
      } else if (tileColumns[x + 1][y] === 3) {
        newArray[x + 1][y] = 8;
        }
      if (tileColumns[x - 1][y] === 0) {
        newArray[x - 1][y] = 2;
      } else if (tileColumns[x - 1][y] === 2) {
        newArray[x - 1][y] = 0;
      } else if (tileColumns[x - 1][y] === 8) {
        newArray[x - 1][y] = 3;
      } else if (tileColumns[x - 1][y] === 3) {
        newArray[x - 1][y] = 8;
        }
      if (tileColumns[x][y + 1] === 0) {
        newArray[x][y + 1] = 2;
      } else if (tileColumns[x][y + 1] === 2) {
        newArray[x][y + 1] = 0;
      } else if (tileColumns[x][y + 1] === 8) {
        newArray[x][y + 1] = 3;
      } else if (tileColumns[x][y + 1] === 3) {
        newArray[x][y + 1] = 8;
        }
      if (tileColumns[x][y - 1] === 0) {
        newArray[x][y - 1] = 2;
      } else if (tileColumns[x][y - 1] === 2) {
        newArray[x][y - 1] = 0;
      } else if (tileColumns[x][y - 1] === 8) {
        newArray[x][y - 1] = 3;
      } else if (tileColumns[x][y - 1] === 3) {
        newArray[x][y - 1] = 8;
        }
      setTileColumns(newArray);
    } else if (tileColumns[x][y] === 2) {
      newArray.forEach((col, i) => {
        col.forEach((tile, j) => {
          if (newArray[i][j] === 2 || newArray[i][j] === 9) {
            newArray[i][j] = 0;
          } else if (newArray[i][j] === 3) {
            newArray[i][j] = 8;
          }
        })
      })
      newArray[x][y] = 9;
      setTileColumns(newArray);
      // enemy moves
      newArray.forEach((column, i) => {
        column.forEach((tile, j) => {
          if (tile === 8) {
            console.log(i + " " + j);
            let newArray2 = [...newArray];
            const random = Math.floor(Math.random() * 4 + 1);
            if (random === 1) {
              if (newArray[i][j - 1] === 0) {
                newArray2[i][j - 1] = 8;
                newArray2[i][j] = 0;
              }
            } else if (random === 2) {
              if (newArray[i + 1][j] === 0) {
                newArray2[i + 1][j] = 8;
                newArray2[i][j] = 0;
              }
            } else if (random === 3) {
              if (newArray[i][j + 1] === 0) {
                newArray2[i][j + 1] = 8;
                newArray2[i][j] = 0;
              }
            } else if (random === 4) {
              if (newArray[i - 1][j] === 0) {
                newArray2[i - 1][j] = 8;
                newArray2[i][j] = 0;
              }
            }
          }
        })
      })
    } else console.log('no player on this tile');
  }, [activeTile])
  

  const handleCanvasClick = (e) => {
    const mouseCoordinates = {
      x: e.clientX,
      y: e.clientY,
    };
    if (Math.floor(                  // prevents rare crash from -1
      (mouseCoordinates.x -
        canvasRef.current.offsetLeft +
        window.scrollX - 6) /
        (cellSize + padding)
    ) >= 0 && Math.floor(
      (mouseCoordinates.y -
        canvasRef.current.offsetTop +
        window.scrollY - 6) /
        (cellSize + padding)
    ) >= 0) {
      setActiveTile({
        x: Math.floor(
          (mouseCoordinates.x -
            canvasRef.current.offsetLeft +
            window.scrollX - 6) /    // -8 from the canvas border, +2 from? not padding
            (cellSize + padding)
        ),
        y: Math.floor(
          (mouseCoordinates.y -
            canvasRef.current.offsetTop +
            window.scrollY - 6) /
            (cellSize + padding)
        ),
      });
    }
  };

  return (
    <div id="main">
      <h1>Snail game test level</h1>
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

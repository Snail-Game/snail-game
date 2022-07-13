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
    [{id: 1, hp: 0}, {id: 1, hp: 0}, {id: 1, hp: 0}, {id: 1, hp: 0}, {id: 1, hp: 0}, {id: 1, hp: 0}, {id: 1, hp: 0}, {id: 1, hp: 0}],
    [{id: 1, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 1, hp: 0}],
    [{id: 1, hp: 0}, {id: 0, hp: 0}, {id: 8, hp: 3}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 1, hp: 0}],
    [{id: 1, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 8, hp: 3}, {id: 0, hp: 0}, {id: 1, hp: 0}],
    [{id: 1, hp: 0}, {id: 0, hp: 0}, {id: 9, hp: 10}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 1, hp: 0}],
    [{id: 1, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 1, hp: 0}],
    [{id: 1, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 0, hp: 0}, {id: 1, hp: 0}],
    [{id: 1, hp: 0}, {id: 1, hp: 0}, {id: 1, hp: 0}, {id: 1, hp: 0}, {id: 1, hp: 0}, {id: 1, hp: 0}, {id: 1, hp: 0}, {id: 1, hp: 0}],
  ]);
  const [activeTile, setActiveTile] = useState({ x: 0, y: 0 });

  const draw = useCallback((ctx) => {
    tileColumns.forEach((column, i) => {
      column.forEach((tile, j) => {
        if (tile.id === 1) {
          ctx.fillStyle = wallColor;
          ctx.fillRect(
            i * (cellSize + padding),
            j * (cellSize + padding),
            cellSize,
            cellSize
          );
        } else if (tile.id === 0) {
          ctx.fillStyle = spaceColor;
          ctx.fillRect(
            i * (cellSize + padding),
            j * (cellSize + padding),
            cellSize,
            cellSize
          );
        } else if (tile.id === 9) {
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
        } else if (tile.id === 8) {
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
        } else if (tile.id === 3) {
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
        } else if (tile.id === 2) {
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
    const newArray = [];
    tileColumns.forEach((column, i) => {
      newArray[i] = [];
      column.forEach((tile, j) => {
        newArray[i][j] = {...tileColumns[i][j]}
      })
    })
    if (tileColumns[x][y].id === 9) {
      console.log('player is here');
      if (tileColumns[x + 1][y].id === 0) {
        newArray[x + 1][y].id = 2;
      } else if (tileColumns[x + 1][y].id === 2) {
        newArray[x + 1][y].id = 0;
      } else if (tileColumns[x + 1][y].id === 8) {
        newArray[x + 1][y].id = 3;
      } else if (tileColumns[x + 1][y].id === 3) {
        newArray[x + 1][y].id = 8;
        }
      if (tileColumns[x - 1][y].id === 0) {
        newArray[x - 1][y].id = 2;
      } else if (tileColumns[x - 1][y].id === 2) {
        newArray[x - 1][y].id = 0;
      } else if (tileColumns[x - 1][y].id === 8) {
        newArray[x - 1][y].id = 3;
      } else if (tileColumns[x - 1][y].id === 3) {
        newArray[x - 1][y].id = 8;
        }
      if (tileColumns[x][y + 1].id === 0) {
        newArray[x][y + 1].id = 2;
      } else if (tileColumns[x][y + 1].id === 2) {
        newArray[x][y + 1].id = 0;
      } else if (tileColumns[x][y + 1].id === 8) {
        newArray[x][y + 1].id = 3;
      } else if (tileColumns[x][y + 1].id === 3) {
        newArray[x][y + 1].id = 8;
        }
      if (tileColumns[x][y - 1].id === 0) {
        newArray[x][y - 1].id = 2;
      } else if (tileColumns[x][y - 1].id === 2) {
        newArray[x][y - 1].id = 0;
      } else if (tileColumns[x][y - 1].id === 8) {
        newArray[x][y - 1].id = 3;
      } else if (tileColumns[x][y - 1].id === 3) {
        newArray[x][y - 1].id = 8;
        }
    } else if (tileColumns[x][y].id === 2) {
      tileColumns.forEach((column, i) => {
        column.forEach((tile, j) => {
          if (tileColumns[i][j].id === 2) {
            newArray[i][j].id = 0;
          } else if (tileColumns[i][j].id === 3) {
            newArray[i][j].id = 8;
          } else if (tileColumns[i][j].id === 9) {
            newArray[x][y].hp = tileColumns[i][j].hp;
            newArray[i][j].id = 0;
            newArray[i][j].hp = 0;
          }
        })
      })
      newArray[x][y].id = 9;
      // enemy moves
      newArray.forEach((column, i) => {
        column.forEach((tile, j) => {
          if (tile.id === 8) {
            let newArray2 = [];
            newArray.forEach((column, i) => {
              newArray2[i] = [];
              column.forEach((tile, j) => {
                newArray2[i][j] = {...tile};
              })
            })
            const random = Math.floor(Math.random() * 4 + 1);
            if (random === 1) {
              if (newArray[i][j - 1].id === 0) {
                newArray2[i][j - 1].id = 8;
                newArray2[i][j - 1].hp = newArray[i][j].hp;
                newArray2[i][j].id = 0;
                newArray2[i][j].hp = 0;
              }
            } else if (random === 2) {
              if (newArray[i + 1][j].id === 0) {
                newArray2[i + 1][j].id = 8;
                newArray2[i + 1][j].hp = newArray[i][j].hp;
                newArray2[i][j].id = 0;
                newArray2[i][j].hp = 0;
              }
            } else if (random === 3) {
              if (newArray[i][j + 1].id === 0) {
                newArray2[i][j + 1].id = 8;
                newArray2[i][j + 1].hp = newArray[i][j].hp;
                newArray2[i][j].id = 0;
                newArray2[i][j].hp = 0;
              }
            } else if (random === 4) {
              if (newArray[i - 1][j].id === 0) {
                newArray2[i - 1][j].id = 8;
                newArray2[i - 1][j].hp = newArray[i][j].hp;
                newArray2[i][j].id = 0;
                newArray2[i][j].hp = 0;
              }
            }
            newArray2.forEach((column, i) => {
              column.forEach((tile, j) => {
                newArray[i][j] = {...tile};
              })
            })
          }
        })
      })
    } else console.log('no player on this tile');
    setTileColumns(newArray);
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
  }

  const checkTileColumns = () => {
    console.log(tileColumns);
  }

  return (
    <div id="main">
      <h1>Snail game test level</h1>
      <button onClick={checkTileColumns}>Check tileColumns</button>
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

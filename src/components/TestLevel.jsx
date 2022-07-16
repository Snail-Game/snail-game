import { useEffect, useState, useRef, useCallback, useLayoutEffect } from "react";
import { enemyMoves } from './enemyMoves1';
import Messages from './Messages';
import Avatar from './Avatar';

export default function TestLevel() {
  const messages = useRef(['Don\'t get eaten!', 'Find your way across!']);
  const canvasRef = useRef(null);
  const health = useRef(10);
  
  const waterColor = "#35baf6"
  const wallColor = "#506F91";
  const spaceColor = "#A0DAB6";
  const moveColor = "#FFD700";
  const attackColor = "#bb0a1e";
  const padding = 2;
  const strength = 3;
  const enemyStrength = 3;

  const [enemyTurn, setEnemyTurn] = useState(false);
  const [cellSize, setCellSize] = useState(64);
  let canvasWidth = 8 * (cellSize + padding) - padding;
  let canvasHeight = 8 * (cellSize + padding) - padding;
  const [tileColumns, setTileColumns] = useState([
    [{id: 1, hp: 0, status: 'none'}, {id: 1, hp: 0, status: 'none'}, {id: 1, hp: 0, status: 'none'}, {id: 1, hp: 0, status: 'none'}, {id: 1, hp: 0, status: 'none'}, {id: 1, hp: 0, status: 'none'}, {id: 1, hp: 0, status: 'none'}, {id: 1, hp: 0, status: 'none'}],
    [{id: 1, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 1, hp: 0, status: 'none'}],
    [{id: 1, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 8, hp: 3, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 1, hp: 0, status: 'none'}],
    [{id: 1, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 8, hp: 3, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 1, hp: 0, status: 'none'}],
    [{id: 1, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 9, hp: 10, status: 'none'}, {id: 0, hp: 0, status: 'water'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 1, hp: 0, status: 'none'}],
    [{id: 1, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 1, hp: 0, status: 'none'}],
    [{id: 1, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 0, hp: 0, status: 'none'}, {id: 1, hp: 0, status: 'none'}],
    [{id: 1, hp: 0, status: 'none'}, {id: 1, hp: 0, status: 'none'}, {id: 1, hp: 0, status: 'none'}, {id: 1, hp: 0, status: 'none'}, {id: 1, hp: 0, status: 'none'}, {id: 1, hp: 0, status: 'none'}, {id: 1, hp: 0, status: 'none'}, {id: 1, hp: 0, status: 'none'}],
  ]);
  const [activeTile, setActiveTile] = useState({ x: 0, y: 0 });

  const addMessage = (message) => {
    messages.current.push(message);
  }
  
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
              j * (cellSize + padding),
              cellSize,
              cellSize
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
              j * (cellSize + padding),
              cellSize,
              cellSize
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
              j * (cellSize + padding),
              cellSize,
              cellSize
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
        if (tile.status === 'water') {
          ctx.fillStyle = waterColor;
          ctx.fillRect(
            i * (cellSize + padding) + 3,
            j * (cellSize + padding) + 3,
            cellSize - 6,
            cellSize - 6
            )
        }
      });
    });
    return ctx;
  }, [tileColumns, cellSize]);

  useLayoutEffect(() => {
    if (enemyTurn) {
      setTileColumns(enemyMoves(tileColumns, strength, enemyStrength, addMessage));
      setEnemyTurn(false);
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx);
  }, [draw, enemyTurn, tileColumns]);

  useEffect(() => {               // click-to-move logic
    const x = activeTile.x;
    const y = activeTile.y;
    let newArray = [];
    tileColumns.forEach((column, i) => {
      newArray[i] = [];
      column.forEach((tile, j) => {
        newArray[i][j] = {...tileColumns[i][j]}
      })
    })
    const highlightTiles = () => {
      if (newArray[x + 1][y].id === 0) {
        newArray[x + 1][y].id = 2;
      } else if (newArray[x + 1][y].id === 2) {
        newArray[x + 1][y].id = 0;
      } else if (newArray[x + 1][y].id === 8) {
        newArray[x + 1][y].id = 3;
      } else if (newArray[x + 1][y].id === 3) {
        newArray[x + 1][y].id = 8;
      }
      if (newArray[x - 1][y].id === 0) {
        newArray[x - 1][y].id = 2;
      } else if (newArray[x - 1][y].id === 2) {
        newArray[x - 1][y].id = 0;
      } else if (newArray[x - 1][y].id === 8) {
        newArray[x - 1][y].id = 3;
      } else if (newArray[x - 1][y].id === 3) {
        newArray[x - 1][y].id = 8;
      }
      if (newArray[x][y + 1].id === 0) {
        newArray[x][y + 1].id = 2;
      } else if (newArray[x][y + 1].id === 2) {
        newArray[x][y + 1].id = 0;
      } else if (newArray[x][y + 1].id === 8) {
        newArray[x][y + 1].id = 3;
      } else if (newArray[x][y + 1].id === 3) {
        newArray[x][y + 1].id = 8;
      }
      if (newArray[x][y - 1].id === 0) {
        newArray[x][y - 1].id = 2;
      } else if (newArray[x][y - 1].id === 2) {
        newArray[x][y - 1].id = 0;
      } else if (newArray[x][y - 1].id === 8) {
        newArray[x][y - 1].id = 3;
      } else if (newArray[x][y - 1].id === 3) {
        newArray[x][y - 1].id = 8;
      }
    }
    if (newArray[x][y].id === 9) {      // select/deselect player
      highlightTiles();
    } else if (newArray[x][y].id === 2) {      // move to empty space
      setEnemyTurn(true);
      newArray.forEach((column, i) => {
        column.forEach((tile, j) => {
          if (newArray[i][j].id === 2) {
            newArray[i][j].id = 0;
          } else if (newArray[i][j].id === 3) {
            newArray[i][j].id = 8;
          } 
        })
      })
      loop1:
      for (let i = 0; i < newArray.length; i++) {
        for (let j = 0; j < newArray[i].length; j++) {
          if (newArray[i][j].id === 9) {
            if (newArray[x][y].status === 'water') {
              newArray[i][j].hp += 2;
              newArray[x][y] = {...newArray[i][j]};
              newArray[i][j].id = 0;
              newArray[i][j].hp = 0;
              addMessage('Water! +2 HP');
              addMessage('Keep moving!');
              highlightTiles();
              setEnemyTurn(false);
            } else {
              newArray[x][y] = {...newArray[i][j]};
              newArray[i][j].id = 0;
              newArray[i][j].hp = 0;
            }
            break loop1;
          }
        }
      }
      // enemy moves
    } else if (tileColumns[x][y].id === 3) {     // attack enemy
      setEnemyTurn(true);
      const attack = Math.ceil(Math.random() * strength);
      const enemyAttack = Math.ceil(Math.random() * enemyStrength);
      newArray[x][y].hp -= attack;
      // draw damage animation here
      addMessage('You attack enemy for ' + attack + ' damage!');
      addMessage('You take ' + enemyAttack + ' damage!');
      if (newArray[x][y].hp <= 0) {
        newArray[x][y].id = 0;
        newArray[x][y].hp = 0;
        addMessage('Enemy destroyed!');
      }
      for (let i = 0; i < newArray.length; i++) {
        for (let j = 0; j < newArray[i].length; j++) {
          if (newArray[i][j].id === 2) {
            newArray[i][j].id = 0;
          } else if (newArray[i][j].id === 3) {
            newArray[i][j].id = 8;
          }
        }
      }
      loop1:
      for (let i = 0; i < newArray.length; i++) {
        for (let j = 0; j < newArray[i].length; j++) {
          if (newArray[i][j].id === 9) {
            newArray[i][j].hp -= enemyAttack;
            if (newArray[i][j].hp <= 0) {
              newArray[i][j].id = 0;
              newArray[i][j].hp = 0;
              addMessage('GAME OVER');
              // game over screen here
            } else if (newArray[x][y].id === 0 && newArray[x][y].hp === 0) {
              newArray[x][y] = {...newArray[i][j]};
              newArray[i][j].id = 0;
              newArray[i][j].hp = 0;
              break loop1;
            }
          }
        }
      }
      // enemy moves
    }
  newArray.forEach((column) => {
    column.forEach((tile) => {
      if (tile.id === 9) {
        health.current = tile.hp;
      }
    })
  })
  setTileColumns(newArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const debugTileColumns = () => {
    console.log(tileColumns);
  }

  return (
    <div id="main">
      <h1>Snail game test level</h1>
      <div id={'ui'}>
        <Messages messages={messages.current} />
        <div id={'buttons'}>
            <button onClick={debugTileColumns}>Debug tileColumns</button>
            <button onClick={() => setCellSize(cellSize + 2)}>Increase board size</button>
            <button onClick={() => setCellSize(cellSize - 2)}>Decrease board size</button>
        </div>
        <Avatar health={health.current} />
      </div>
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

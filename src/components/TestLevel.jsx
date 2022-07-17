import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { enemyMoves } from "../utils/enemyMoves";
import Messages from "./Messages";
import Avatar from "./Avatar";

export default function TestLevel() {
  const messages = useRef(["Don't get eaten!", "Find your way across!"]);
  const canvasRef = useRef(null);
  const health = useRef(10);
  const durability = useRef(0);

  const moveColor = "#FFD700";
  const attackColor = "#bb0a1e";
  const padding = 2;
  const strength = 3;
  const enemyStrength = 3;

  const [enemyTurn, setEnemyTurn] = useState(false);
  const [cellSize, setCellSize] = useState(48);
  let canvasWidth = 8 * (cellSize + padding) - padding;
  let canvasHeight = 8 * (cellSize + padding) - padding;
  const [tileColumns, setTileColumns] = useState([
    /* 
      IDs for tiles: 
        0 = floor
        1 = wall
        2 = available to move, highlighted tile
        3 = enemy highlighted to attack
        8 = enemy
        9 = player
        4-7 ... unused
    */
    [
      { id: 1, hp: 0, status: "wall" },
      { id: 1, hp: 0, status: "wall" },
      { id: 1, hp: 0, status: "wall" },
      { id: 1, hp: 0, status: "wall" },
      { id: 1, hp: 0, status: "wall" },
      { id: 1, hp: 0, status: "wall" },
      { id: 1, hp: 0, status: "wall" },
      { id: 1, hp: 0, status: "wall" },
    ],
    [
      { id: 1, hp: 0, status: "wall" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 1, hp: 0, status: "wall" },
    ],
    [
      { id: 1, hp: 0, status: "wall" },
      { id: 0, hp: 0, status: "none" },
      { id: 8, hp: 3, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 1, hp: 0, status: "wall" },
    ],
    [
      { id: 1, hp: 0, status: "wall" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 8, hp: 3, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 1, hp: 0, status: "wall" },
    ],
    [
      { id: 1, hp: 0, status: "wall" },
      { id: 0, hp: 0, status: "none" },
      { id: 9, hp: 10, status: "none" },
      { id: 0, hp: 0, status: "water" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 1, hp: 0, status: "wall" },
    ],
    [
      { id: 1, hp: 0, status: "wall" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "junk" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 1, hp: 0, status: "wall" },
    ],
    [
      { id: 1, hp: 0, status: "wall" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 0, hp: 0, status: "none" },
      { id: 1, hp: 0, status: "wall" },
    ],
    [
      { id: 1, hp: 0, status: "wall" },
      { id: 1, hp: 0, status: "wall" },
      { id: 1, hp: 0, status: "wall" },
      { id: 1, hp: 0, status: "wall" },
      { id: 1, hp: 0, status: "wall" },
      { id: 1, hp: 0, status: "wall" },
      { id: 1, hp: 0, status: "wall" },
      { id: 1, hp: 0, status: "wall" },
    ],
  ]);
  const [activeTile, setActiveTile] = useState({ x: 0, y: 0 });

  const addMessage = (message) => {
    messages.current.push(message);
  };

  const draw = useCallback(
    (ctx) => {
      function renderSprite(src, i, j) {
        const sprite = new Image();
        sprite.src = src;
        sprite.onload = function () {
          ctx.drawImage(
            sprite,
            i * (cellSize + padding),
            j * (cellSize + padding),
            cellSize,
            cellSize
          );
        };
      }
      function renderTile(src, i, j) {
        const tile = new Image();
        tile.src = src;
        tile.onload = function () {
          ctx.drawImage(
            tile,
            i * (cellSize + padding),
            j * (cellSize + padding),
            cellSize,
            cellSize
          );
        };
      }
      function highlightTile(color, i, j) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(
          i * (cellSize + padding),
          j * (cellSize + padding),
          cellSize,
          cellSize
        );
      }

      tileColumns.forEach((column, i) => {
        column.forEach((tile, j) => {
          // render tiles
          if (tile.status === "wall") {
            renderTile("/assets/tiles/wall.png", i, j);
          } else if (tile.status === "water") {
            renderTile("/assets/tiles/water.png", i, j);
          } else if (tile.status === "junk") {
            renderTile("/assets/tiles/junk.png", i, j)
          } else {
            renderTile("/assets/tiles/grass.png", i, j);
          }

          // render sprites, handle logic
          if (tile.id === 9) {
            renderSprite("/assets/player/snail-0.png", i, j);
          } else if (tile.id === 8) {
            renderSprite("/assets/enemies/squirrel-0.png", i, j);
          } else if (tile.id === 3) {
            renderSprite("/assets/enemies/squirrel-0.png", i, j);
            highlightTile(attackColor, i, j);
          } else if (tile.id === 2) {
            highlightTile(moveColor, i, j);
          }
        });
      });
      return ctx;
    },
    [tileColumns, cellSize]
  );

  useLayoutEffect(() => {
    if (enemyTurn) {
      setTileColumns(
        enemyMoves(tileColumns, strength, enemyStrength, addMessage, durability, health)
      );
      setEnemyTurn(false);
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx);
  }, [draw, enemyTurn, tileColumns]);

  useEffect(() => {
    // click-to-move logic
    const x = activeTile.x;
    const y = activeTile.y;
    let newArray = [];
    tileColumns.forEach((column, i) => {
      newArray[i] = [];
      column.forEach((tile, j) => {
        newArray[i][j] = { ...tileColumns[i][j] };
      });
    });
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
    };
    if (newArray[x][y].id === 9) {
      // select/deselect player
      highlightTiles();
    } else if (newArray[x][y].id === 2) {
      // move to empty space
      setEnemyTurn(true);
      newArray.forEach((column, i) => {
        column.forEach((tile, j) => {
          if (newArray[i][j].id === 2) {
            newArray[i][j].id = 0;
          } else if (newArray[i][j].id === 3) {
            newArray[i][j].id = 8;
          }
        });
      });
      loop1: for (let i = 0; i < newArray.length; i++) {
        for (let j = 0; j < newArray[i].length; j++) {
          if (newArray[i][j].id === 9) {
            if (newArray[x][y].status === "water") {
              newArray[i][j].hp += 2;
              newArray[x][y] = { ...newArray[i][j] };
              newArray[i][j].id = 0;
              newArray[i][j].hp = 0;
              addMessage("Water! +2 HP");
              addMessage("Keep moving!");
              highlightTiles();
              setEnemyTurn(false);
            } else if (newArray[x][y].status === "junk") {
              newArray[i][j].hp += 1;
              newArray[x][y] = { ...newArray[i][j] };
              newArray[i][j].id = 0;
              newArray[i][j].hp = 0;
              addMessage("You absorbed some metal and added it to your shell!");
              addMessage("Durability increased!");
              durability.current += 1;
             } else {
              newArray[x][y] = { ...newArray[i][j] };
              newArray[i][j].id = 0;
              newArray[i][j].hp = 0;
            }
            break loop1;
          }
        }
      }
      // enemy moves
    } else if (tileColumns[x][y].id === 3) {
      // attack enemy
      setEnemyTurn(true);
      const attack = Math.ceil(Math.random() * strength);
      const enemyAttack = Math.ceil(Math.random() * enemyStrength);
      newArray[x][y].hp -= attack;
      // draw damage animation here
      addMessage("You attack enemy for " + attack + " damage!");
      addMessage("You take " + enemyAttack + " damage!");
      if (newArray[x][y].hp <= 0) {
        newArray[x][y].id = 0;
        newArray[x][y].hp = 0;
        addMessage("Enemy destroyed!");
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
      loop1: for (let i = 0; i < newArray.length; i++) {
        for (let j = 0; j < newArray[i].length; j++) {
          if (newArray[i][j].id === 9) {
            newArray[i][j].hp -= enemyAttack;
            if (newArray[i][j].hp <= 0) {
              newArray[i][j].id = 0;
              newArray[i][j].hp = 0;
              addMessage("GAME OVER");
              // game over screen here
            } else if (newArray[x][y].id === 0 && newArray[x][y].hp === 0) {
              newArray[x][y] = { ...newArray[i][j] };
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
      });
    });
    setTileColumns(newArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTile]);

  const handleCanvasClick = (e) => {
    const mouseCoordinates = {
      x: e.clientX,
      y: e.clientY,
    };
    if (
      Math.floor(
        // prevents rare crash from -1
        (mouseCoordinates.x -
          canvasRef.current.offsetLeft +
          window.scrollX -
          6) /
          (cellSize + padding)
      ) >= 0 &&
      Math.floor(
        (mouseCoordinates.y -
          canvasRef.current.offsetTop +
          window.scrollY -
          6) /
          (cellSize + padding)
      ) >= 0
    ) {
      setActiveTile({
        x: Math.floor(
          (mouseCoordinates.x -
            canvasRef.current.offsetLeft +
            window.scrollX -
            6) / // -8 from the canvas border, +2 from? not padding
            (cellSize + padding)
        ),
        y: Math.floor(
          (mouseCoordinates.y -
            canvasRef.current.offsetTop +
            window.scrollY -
            6) /
            (cellSize + padding)
        ),
      });
    }
  };

  const debugTileColumns = () => {
    console.log(tileColumns);
  };

  return (
    <div id="main">
      <h1>Snail game test level</h1>
      <div id={"ui"}>
        <Messages messages={messages.current} />
        <div id={"buttons"}>
          <button onClick={debugTileColumns}>Debug tileColumns</button>
          <button onClick={() => setCellSize(cellSize + 2)}>
            Increase board size
          </button>
          <button onClick={() => setCellSize(cellSize - 2)}>
            Decrease board size
          </button>
        </div>
        <Avatar health={health.current} durability={durability.current} />
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

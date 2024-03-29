import {
  useEffect,
  useState,
  useRef,
  useMemo
} from "react";
import { enemyMoves } from "../utils/enemyMoves";
import Messages from "./Messages";
import Avatar from "./Avatar";

export default function TestLevel() {
  const messages = useRef(["Don't get eaten!", "Find your way across!", "(click to move)"]);
  const canvasRef = useRef(null);
  const health = useRef(10);
  const durability = useRef(0);
  const spikes = useRef(0);

  const moveColor = "#FFD700";
  const padding = 2;
  const enemyStrength = 3;

  const imgCount = useRef(0);
  const snailImg = useMemo(() => new Image(), []);
  const squirrelImg = useMemo(() => new Image(), []);
  const grassImg = useMemo(() => new Image(), []);
  const wallImg = useMemo(() => new Image(), []);
  const waterImg = useMemo(() => new Image(), []);
  const junkImg = useMemo(() => new Image(), []);
  const shellImg = useMemo(() => new Image(), []);
  const deadsnailImg = useMemo(() => new Image(), []);
  const totalNumImgs = 8;
  const imageLoad = [snailImg, squirrelImg, grassImg, wallImg, waterImg, junkImg, shellImg, deadsnailImg];
  imageLoad.forEach((image) => {
    image.onload = () => {
      if (imgCount.current < totalNumImgs) {
        imgCount.current++;
      }
      if (imgCount.current === totalNumImgs) {
        setInitRdy(true);
      }
    }
    image.onerror = () => {
      console.log(`Error loading ${image}`);
    };
  })
  
  snailImg.src = "/assets/player/snail.png";
  squirrelImg.src = "/assets/enemies/squirrel.png";
  grassImg.src = "/assets/tiles/grass.png";
  wallImg.src = "/assets/tiles/wall.png";
  waterImg.src = "/assets/tiles/water.png";
  junkImg.src = "/assets/tiles/junk.png";
  shellImg.src = "/assets/player/shell.png";
  deadsnailImg.src = "/assets/player/deadsnail.png";
  
  const [shell, setShell] = useState(false);
  const [enemyTurn, setEnemyTurn] = useState(false);
  const [cellSize, setCellSize] = useState(60);
  let canvasWidth = 8 * (cellSize + padding) - padding;
  let canvasHeight = 8 * (cellSize + padding) - padding;
  const [initRdy, setInitRdy] = useState(false);
  const [tileColumns, setTileColumns] = useState([
    /* 
      IDs for tiles: 
      0 = floor
      1 = wall
      2 = available to move, highlighted tile
      3 = enemy highlighted to attack
      4 = dead snail
      8 = enemy
      9 = player
      5-7 ... unused
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
      { id: 0, hp: 0, status: "junk" },
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
      { id: 0, hp: 0, status: "junk" },
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
  let activeTile = { x: 0, y: 0 };

  const addMessage = (message) => {
    messages.current.push(message);
  };

  if (enemyTurn) {
    setTileColumns(
      enemyMoves(tileColumns, enemyStrength, addMessage, health, spikes, shell, durability)
    );
    setEnemyTurn(false);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");    
    const renderSprite = (src, i, j) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");  
      if (src === "/assets/player/snail.png") {
        ctx.drawImage(
          snailImg,
          i * (cellSize + padding) + cellSize / 4,
          j * (cellSize + padding) + cellSize / 4,
          cellSize / 2,
          cellSize / 2
          );
      } else if (src === "/assets/player/shell.png") {
        ctx.drawImage(
          shellImg,
          i * (cellSize + padding) + cellSize / 4,
          j * (cellSize + padding) + cellSize / 4,
          cellSize / 2,
          cellSize / 2
          );
      } else if (src === "/assets/enemies/squirrel.png") {
        ctx.drawImage(
          squirrelImg,
          i * (cellSize + padding),
          j * (cellSize + padding),
          cellSize,
          cellSize
          )
      } else if (src === "/assets/player/deadsnail.png") {
        ctx.drawImage(
          deadsnailImg,
          i * (cellSize + padding) + cellSize / 4,
          j * (cellSize + padding) + cellSize / 4,
          cellSize / 2,
          cellSize / 2
          )
      }
    };
    const renderTile = (src, i, j) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (src === "/assets/tiles/grass.png") {
        ctx.drawImage(
          grassImg,
          i * (cellSize + padding),
          j * (cellSize + padding),
          cellSize,
          cellSize
        );
      } else if (src === "/assets/tiles/wall.png") {
        ctx.drawImage(
          wallImg,
          i * (cellSize + padding),
          j * (cellSize + padding),
          cellSize,
          cellSize
        );
      } else if (src === "/assets/tiles/water.png") {
        ctx.drawImage(
          waterImg,
          i * (cellSize + padding),
          j * (cellSize + padding),
          cellSize,
          cellSize
        );
      } else if (src === "/assets/tiles/junk.png") {
        ctx.drawImage(
          junkImg,
          i * (cellSize + padding),
          j * (cellSize + padding),
          cellSize,
          cellSize
        );
      }
    };
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
    if (initRdy) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tileColumns.forEach((column, i) => {
        column.forEach((tile, j) => {
          // render tiles
          if (tile.status === "wall") {
            renderTile("/assets/tiles/wall.png", i, j);
          } else if (tile.status === "water") {
            renderTile("/assets/tiles/water.png", i, j);
          } else if (tile.status === "junk") {
            renderTile("/assets/tiles/junk.png", i, j)
          } else if (tile.status === "none") {
            renderTile("/assets/tiles/grass.png", i, j);
          }
          // render sprites
          if (tile.id === 9 && !shell) {
            renderSprite("/assets/player/snail.png", i, j);
          } else if (tile.id === 9 && shell) {
            renderSprite("/assets/player/shell.png", i, j);
          } else if (tile.id === 8) {
            renderSprite("/assets/enemies/squirrel.png", i, j);
          } else if (tile.id === 2) {
            highlightTile(moveColor, i, j);
          } else if (tile.id === 4) {
            renderSprite("/assets/player/deadsnail.png", i, j);
          }
        });
      });
    }
  }, [tileColumns, shell, cellSize, snailImg, shellImg, squirrelImg, grassImg, wallImg, waterImg, junkImg, imgCount, initRdy, deadsnailImg]);

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
      activeTile = {
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
      };
    }
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
      }
      if (newArray[x - 1][y].id === 0) {
        newArray[x - 1][y].id = 2;
      } else if (newArray[x - 1][y].id === 2) {
        newArray[x - 1][y].id = 0;
      }
      if (newArray[x][y + 1].id === 0) {
        newArray[x][y + 1].id = 2;
      } else if (newArray[x][y + 1].id === 2) {
        newArray[x][y + 1].id = 0;
      }
      if (newArray[x][y - 1].id === 0) {
        newArray[x][y - 1].id = 2;
      } else if (newArray[x][y - 1].id === 2) {
        newArray[x][y - 1].id = 0;
      }
    };
    if (newArray[x][y].id === 9) {
      // select/deselect player
      highlightTiles();
    } else if (newArray[x][y].id === 2) {
      // move to empty space
      setShell(false);
      setEnemyTurn(true);
      newArray.forEach((column, i) => {
        column.forEach((tile, j) => {
          if (newArray[i][j].id === 2) {
            newArray[i][j].id = 0;
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
              if (durability.current === 0) {
                newArray[i][j].hp += 1;
                newArray[x][y] = { ...newArray[i][j] };
                newArray[i][j].id = 0;
                newArray[i][j].hp = 0;
                addMessage("You absorbed some metal and added it to your shell!");
                addMessage("Durability increased!");
                durability.current += 1;
                const spikesDiv = document.getElementById('spikes');
                spikesDiv.style.display = 'block';
              } else if (durability.current === 1) {
                newArray[i][j].hp += 1;
                newArray[x][y] = { ...newArray[i][j] };
                newArray[i][j].id = 0;
                newArray[i][j].hp = 0;
                addMessage("You absorbed some metal and added it to your shell!");
                addMessage("Your shell is spiky!");
                spikes.current += 1;
              }
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
    }
    newArray.forEach((column) => {
      column.forEach((tile) => {
        if (tile.id === 9) {
          health.current = tile.hp;
        }
      });
    });
    setTileColumns(newArray);
  };

  const debugTileColumns = () => {
    console.log(tileColumns);
  };

  const toggleShell = () => {
    setShell(true);
    setEnemyTurn(true);
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
          <button onClick={toggleShell}>
            Hide one turn
          </button>
        </div>
        <Avatar health={health.current} durability={durability.current} spikes={spikes.current} />
      </div>
      <canvas
        onClick={handleCanvasClick}
        ref={canvasRef}
        id="canvas"
        width={`${canvasWidth}`}
        height={`${canvasHeight}`}
      ></canvas>
    </div>
  );
}

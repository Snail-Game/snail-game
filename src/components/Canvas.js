import { useEffect,
  useState,
  useRef,
  useCallback,
  useLayoutEffect
} from "react";
import { enemyMoves } from "../utils/enemyMoves";
import { getLevel, saveLevel } from '../utils/fetch-utils';

export default function Canvas() {
  const messages = useRef(["Don't get eaten!", "Find your way across!"]);
  const canvasRef = useRef(null);
  const health = useRef(10);
  const durability = useRef(0);
  const spikes = useRef(0);
  
  const moveColor = "#FFD700";
  const padding = 2;
  const enemyStrength = 3;

  const [enemyTurn, setEnemyTurn] = useState(false);
  const [cellSize, setCellSize] = useState(48);
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
  const [tileColumns, setTileColumns] = useState([
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
          { id: 0, hp: 0, status: "none" },
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
  
  const [saveInput, setSaveInput] = useState('');
  const [getInput, setGetInput] = useState('');
  const [canvasWidth, setCanvasWidth] = useState(8 * (cellSize + padding) - padding);
  const [canvasHeight, setCanvasHeight] = useState(8 * (cellSize + padding) - padding);
  const [numRows, setNumRows] = useState(8);
  const [numColumns, setNumColumns] = useState(8);
  const [mouseCoordinates, setMouseCoordinates] = useState({x: 250, y: 250});

  useEffect(() => {
    const tileXIndex = Math.floor(
      (mouseCoordinates.x -
        canvasRef.current.offsetLeft +
        window.scrollX -
        6) /
        (cellSize + padding)
    );
    const tileYIndex = Math.floor(
      (mouseCoordinates.y -
        canvasRef.current.offsetTop +
        window.scrollY -
        6) /
        (cellSize + padding)
    );
    let newArray = [];
    tileColumns.forEach((column, i) => {
      let newColumn = [];
      column.forEach((tile, j) => {
        newColumn[j] = {...tile};
      })
      newArray[i] = [...newColumn];
    })
    let newArray2 = [];
    for (let i = 0; i < newArray.length; i++) {
      let newCol = [];
      if (i === tileXIndex) {
        for (let j = 0; j < newArray[0].length; j++) {
          if (j === tileYIndex) {
            if (newArray[i][j].status === 'wall') {
              newCol[j] = {};
              newCol[j].id = 0;
              newCol[j].hp = 0;
              newCol[j].status = 'none';
            } else if (newArray[i][j].status === "none") {
              if (newArray[i][j].id === 0) {
                newCol[j] = {};
                newCol[j].id = 0;
                newCol[j].hp = 0;
                newCol[j].status = 'junk';
              } else if (newArray[i][j].id === 8) {
                newCol[j] = {};
                newCol[j].id = 1;
                newCol[j].hp = 0;
                newCol[j].status = 'wall';
              }
            } else if (newArray[i][j].status === "junk") {
              newCol[j] = {};
              newCol[j].id = 0;
              newCol[j].hp = 0;
              newCol[j].status = 'water';
            } else if (newArray[i][j].status === "water") {
              newCol[j] = {};
              newCol[j].id = 8;
              newCol[j].hp = 3;
              newCol[j].status = 'none';
            }
          } else {
            newCol[j] = {};
            newCol[j].id = newArray[i][j].id;
            newCol[j].hp = newArray[i][j].hp;
            newCol[j].status = newArray[i][j].status;
          }
        }
      } else {
        newArray[i].forEach((tile, j) => {
          newCol[j] = {...newArray[i][j]};
        })
      }
      newArray2[i] = [...newCol];
    }
    setTileColumns(newArray2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mouseCoordinates, cellSize, padding]);

  const addMessage = (message) => {
    messages.current.push(message);
  };

  useEffect(() => {
    if (tileColumns.length < numColumns) {   // adding a column
      setCanvasWidth(numColumns * (cellSize + padding) - padding);
      setCanvasHeight(numRows * (cellSize + padding) - padding);
      let newColumn = [];
      for (let i = 0; i < numRows; i++) {
        newColumn = [...newColumn, {...tileColumns[0][0]}];
      }
      setTileColumns([...tileColumns, newColumn]);
    } else if (tileColumns[0].length < numRows) {   // adding a row
      setCanvasWidth(numColumns * (cellSize + padding) - padding);
      setCanvasHeight(numRows * (cellSize + padding) - padding);
      let newArray = [];
      tileColumns.forEach((column, i) => {
        let newCol = [];
        column.forEach((tile, j) => {
          newCol[j] = {...tile};
        })
        newArray[i] = newCol;
      })
      for (let i = 0; i < newArray.length; i++) {
        newArray[i] = [...newArray[i], {...tileColumns[0][0]}];
      }
      setTileColumns(newArray);
    } else if (tileColumns.length > numColumns) {   // delete last column
      let newArray = [];
      for (let i = 0; i < numColumns; i++) {
        newArray[i] = [...tileColumns[i]];
      }
      setTileColumns(newArray);
      setCanvasWidth(numColumns * (cellSize + padding) - padding);
      setCanvasHeight(numRows * (cellSize + padding) - padding);
    } else if (tileColumns[0].length > numRows) {   // delete last row
      let newArray = [];
      for (let i = 0; i < numColumns; i++) {
        let newCol = [];
        for (let j = 0; j < numRows; j++) {
          newCol[j] = tileColumns[i][j];
        }
        newArray[i] = newCol;
      }
      setTileColumns(newArray);
      setCanvasWidth(numColumns * (cellSize + padding) - padding);
      setCanvasHeight(numRows * (cellSize + padding) - padding);
    }
  }, [cellSize, numColumns, numRows, tileColumns])

  const draw = useCallback(
    (ctx) => {
      function renderSprite(src, i, j) {
        const sprite = new Image();
        sprite.src = src;
        sprite.onload = function () {
        if (src === "/assets/player/snail-0.png") {
          ctx.drawImage(
            sprite,
            i * (cellSize + padding) + cellSize / 4,
            j * (cellSize + padding) + cellSize / 4,
            cellSize / 2,
            cellSize / 2
          );
        } else {
          ctx.drawImage(
            sprite,
            i * (cellSize + padding),
            j * (cellSize + padding),
            cellSize,
            cellSize
          );
        };
      }
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
        enemyMoves(tileColumns, enemyStrength, addMessage, durability, health, spikes)
      );
      setEnemyTurn(false);
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx);
  }, [draw, enemyTurn, tileColumns]);

  const handleCellChange = (e) => {
    if (parseInt(e.target.value) > cellSize) {
      setCanvasWidth(
        numColumns * (parseInt(e.target.value) + padding) - padding
      );
      setCanvasHeight(numRows * (parseInt(e.target.value) + padding) - padding);
      setCellSize(parseInt(e.target.value));
    } else {
      setCellSize(parseInt(e.target.value));
      setCanvasWidth(
        numColumns * (parseInt(e.target.value) + padding) - padding
      );
      setCanvasHeight(numRows * (parseInt(e.target.value) + padding) - padding);
    }
  };

  const handleCanvasClick = (e) => {
    setMouseCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleSaveLevel = async (e) => {
    e.preventDefault();
     await saveLevel(saveInput, tileColumns);
    }
  const handleGetLevel = async (e) => {
    e.preventDefault();
    const rawData = await getLevel(getInput);
    let newArray = [];
    rawData.forEach((column, i) => {
      let newCol = [];
      column.forEach((tile, j) => {
        newCol[j] = {...JSON.parse(tile)}
      })
      newArray[i] = [...newCol];
    })
    setNumRows(newArray[0].length + 1);   // hacky way to trigger a new draw but seems ok
    setNumColumns(newArray.length + 1);
    setTileColumns(newArray);
    }

  return (
    <div id="main">
      <h1>Snail game map editor</h1>
      <form id="form">
        <label>Cell size:</label>
        <input
          type={"number"}
          value={cellSize}
          onChange={(e) => handleCellChange(e)}
        ></input>
      </form>
      <form onSubmit={handleSaveLevel}>
        <label>Level name:</label>
        <input value={saveInput} onChange={(e) => setSaveInput(e.target.value)}></input>
        <button>Save level</button>
      </form>
      <form onSubmit={handleGetLevel}>
        <label>Level name:</label>
        <input value={getInput} onChange={(e) => setGetInput(e.target.value)}></input>
        <button>Get level</button>
      </form>
      <button onClick={() => console.log(tileColumns)}>Debug tileColumns</button>
      <div id="button-div">
        <button onClick={() => setNumColumns(numColumns + 1)}>
          Add column
        </button>
        <button onClick={() => setNumRows(numRows + 1)}>Add row</button>
        <button onClick={() => setNumColumns(numColumns - 1)}>
          Delete column
        </button>
        <button onClick={() => setNumRows(numRows - 1)}>Delete row</button>
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

import { useEffect, useState, useRef } from "react";

export default function Canvas() {
  const canvasRef = useRef(null);
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
  const [padding, setPadding] = useState(2);
  const [cellSize, setCellSize] = useState(64);
  const [numRows, setNumRows] = useState(8);
  const [numColumns, setNumColumns] = useState(8);
  const [canvasWidth, setCanvasWidth] = useState(526); //i.v. manually calculated
  const [canvasHeight, setCanvasHeight] = useState(526);
  const [wallColor, setWallColor] = useState("#506F91");
  const [spaceColor, setSpaceColor] = useState("#A0DAB6");
  const [mouseCoordinates, setMouseCoordinates] = useState({});
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [activeTile, setActiveTile] = useState({ x: 0, y: 0 });

  const player = new Image();
  player.src = process.env.PUBLIC_URL + "/images/snail.png";

  if (tileColumns[0][0] === 1) {
    // wall logic
    // player cannot move here
    // enemy cannot move here
  }

  useEffect(() => {
    const draw = (ctx) => {
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
            setPlayerPosition({ x: i, y: j });
            player.onload = function () {
              ctx.drawImage(
                player,
                i * (cellSize + padding),
                j * (cellSize + padding)
              );
            };
          }
        });
      });
      return ctx;
    };
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx);
  }, []);

  useEffect(() => {
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
  }, [mouseCoordinates]);

  const handleCanvasClick = (e) => {
    setMouseCoordinates({
      x: e.clientX,
      y: e.clientY,
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

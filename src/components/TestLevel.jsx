import { useEffect, useState, useRef } from "react";

export default function Canvas() {
  const canvasRef = useRef(null);
  const [tileColumns, setTileColumns] = useState([
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ]);
  const [padding, setPadding] = useState(2);
  const [cellSize, setCellSize] = useState(50);
  const [numRows, setNumRows] = useState(8);
  const [numColumns, setNumColumns] = useState(8);
  const [canvasWidth, setCanvasWidth] = useState(414); //i.v. manually calculated
  const [canvasHeight, setCanvasHeight] = useState(414);
  const [wallColor, setWallColor] = useState("#506F91");
  const [spaceColor, setSpaceColor] = useState("#A0DAB6");
  const [mouseCoordinates, setMouseCoordinates] = useState({});

  useEffect(() => {
    const draw = (ctx) => {
      tileColumns.forEach((column, i) => {
        column.forEach((tile, j) => {
          if (tile > 0) {
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
          }
        });
      });
      return ctx;
    };
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx);
  });

  return (
    <div id="main">
      <h1>Snail game map editor</h1>
      <canvas
        // onClick={(e) => handleCanvasClick(e)}
        ref={canvasRef}
        id="canvas"
        width={`${canvasWidth}`}
        height={`${canvasHeight}`}
      ></canvas>
    </div>
  );
}

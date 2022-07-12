import { useEffect, useState, useRef, useMemo } from "react";

export default function Canvas() {
  const canvasRef = useRef(null);
  const padding = 2;
  const cellSize = 64;
  const canvasWidth = 526; //i.v. manually calculated
  const canvasHeight = 526;
  const wallColor = "#506F91";
  const spaceColor = "#A0DAB6";
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
  player.src = process.env.PUBLIC_URL + "/images/snail.png";

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
          }
        });
      });
      return ctx;
    };
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx);
  }, [player, tileColumns]);
  
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

  useEffect(() => {
    console.log(activeTile);
  }, [activeTile])
  
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

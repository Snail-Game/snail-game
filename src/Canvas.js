import { useEffect, useRef } from 'react';


export default function Canvas({ tileColumns }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const draw = ctx => {
      tileColumns.forEach((col, i) => {
        col.forEach((tile, j) => {
          if (tile > 0) {
            ctx.fillStyle = 'green';
            ctx.fillRect(i * 10, j * 10, 10, 10);
          } else if (tile === 1) {
            ctx.fillStyle = 'blue';
            ctx.fillRect(i * 10, j * 10, 10, 10);
          }
        })
      });
      return ctx;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    draw(ctx);
    },[tileColumns])
  return (
    <canvas ref={canvasRef} id='canvas' width='600' height='600'>
    </canvas>
  );
}
import { useEffect, useRef } from 'react';
import TileRow from './Tile';


export default function Canvas({ tileRows }) {
  const canvasRef = useRef(null);
  const draw = ctx => {
    ctx.fillStyle = 'green';
    ctx.fillRect(20,20,100,100);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    draw(ctx);
    },[draw])
  return (
    <canvas ref={canvasRef} id='canvas' width='600' height='600'>
      {
        tileRows.map((tileRow, i) => <TileRow key={ i } tileRow={ tileRow } />)
      }
    </canvas>
  );
}
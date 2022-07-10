import Tile from './Tile';

export default function TileRow({ tileRow }) {
  return (
    <>
    {
      tileRow.map((tile, i) => <Tile key={i} tile={tile} />)
    }
    </>
  );
}
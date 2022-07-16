export default function Avatar({ health }) {
  return (
    <div id={"avatar"}>
      <img src={"/assets/player/snail-0.png"} alt={"avatar"} />
      <div>HP: {health}</div>
    </div>
  );
}

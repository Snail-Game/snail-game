export default function Avatar({ health, durability, spikes }) {
  return (
    <div id={"avatar"}>
      <img src={"/assets/player/snail.png"} alt={"avatar"} />
      <div>HP: {health}</div>
      <div>Durability: {durability}</div>
      <div id={"spikes"}>Spikes: {spikes}</div>
    </div>
  );
}

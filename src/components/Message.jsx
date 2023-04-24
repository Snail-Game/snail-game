export default function Message({ message, i }) {
  return (
    <div>
      <span id={`message#${i}`}>{i + 1}. {message}</span>
      <br></br>
    </div>
  )
}
export default function Avatar({ health }) {
  return (
    <div id={'avatar'}>
      <img src={'/images/snail.png'} alt={'avatar'} />
      <div>
        HP: {health}
      </div>
    </div>
  )
}
import Message from './Message';

export default function Messages({ messages, addMessage }) {
  return (
    <div id={'messages'}>
      <div>
        {
        messages.map((message, i) => <Message key={message + i} message={message} i={i} />)
        }
      </div>
    </div>
  )
}
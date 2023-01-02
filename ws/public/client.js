const chatStatus = document.querySelector('#chat-status')

function addMessage(msg, className) {
  const message = document.createElement('li')
  message.classList.add(className)
  message.innerText = msg
  document.querySelector('#message-list').appendChild(message)
}

let ws

function connect() {
  ws = new WebSocket('ws://localhost:3000/ws')
  ws.onopen = () => {
    console.log('Connected')
    chatStatus.style.backgroundColor = 'green'
  }
  ws.onclose = () => {
    console.log('Diconnected')
    chatStatus.style.backgroundColor = 'red'
    setTimeout(connect, 1000)
  }
  ws.onerror = (error) => {
    console.log('Error! ', error)
  }
  ws.onmessage = (event) => {
    addMessage(event.data, 'message-received')
  }
}

connect()

document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault()
  const input = document.querySelector('#message-form #msg')
  if (input.value.length === 0) {
    return
  }
  addMessage(input.value, 'message-send')
  ws.send(input.value)
  input.value = ''
})
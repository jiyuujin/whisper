import { createSignal } from 'solid-js'
import logo from './logo.svg'
import './App.css'

const OPENAI_AUDIO_TRANSCRIPTIONS_API = 'https://api.openai.com/v1/audio/transcriptions'
const OPENAI_SECRET = ''

// Model: whisper-1
const OPENAI_MODEL = 'whisper-1'

const LAMBDA_AUDIO_TRANSCRIPTIONS_API = ''

function App() {
  const [formData, setFormData] = createSignal<FormData>()
  const [answer, setAnswer] = createSignal('')

  function onChange(e) {
    const data = new FormData()
    data.append('file', e.target.files[0])
    data.append('model', OPENAI_MODEL)
    setFormData(data)
  }

  async function onTranscribe() {
    const response = await fetch(OPENAI_AUDIO_TRANSCRIPTIONS_API, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${OPENAI_SECRET}`,
      },
      body: formData(),
    })

    const data = await response.json()
    const { text } = data
    setAnswer(text)
  }

  return (
    <div class="App">
      <header class="App-header">
        <img src={logo} class="App-logo" alt="logo" />
        <p>Hello Vite + SolidJS + OpenAI!</p>
        <div>
          <input type="file" name="file1" onChange={onChange}/>
          <button onClick={onTranscribe}>送信する</button>
        </div>
        <p>
          Answer: <code>{answer()}</code>
        </p>
        <p>
          <a
            class="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            class="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  )
}

export default App

import { render } from 'solid-js/web'
import './index.css'
import App from './App'

const container = document.getElementById('root')
if (!container) throw new Error('Failed to find the root element')
render(() => <App />, container)

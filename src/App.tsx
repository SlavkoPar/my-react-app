import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './categories/AutoSuggest.css'
import './categories/AutoSuggestQuestions.css'
//import { Button, Offcanvas } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
// import { protectedResources } from "authConfig";
import Offcanvas from 'react-bootstrap/Offcanvas'
import ChatBotDlg from './ChatBotDlg'

function App() {
  const [count, setCount] = useState(0)

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <Button variant="primary" onClick={handleShow}>
        Launch Offcanvas
      </Button>

      {/* <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas Title</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          This is the content of the Offcanvas.
        </Offcanvas.Body>
      </Offcanvas> */}

      <ChatBotDlg show={true} onHide={handleClose} />
    </>
  )
}

export default App

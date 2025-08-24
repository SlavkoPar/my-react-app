import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './categories/AutoSuggest.css'
import './categories/AutoSuggestQuestions.css'
//import { Button, Offcanvas } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
// import { protectedResources } from "authConfig";
import ChatBotDlg from './ChatBotDlg'
import { InteractionType, type PublicClientApplication } from '@azure/msal-browser'
import { useMsal, useMsalAuthentication } from '@azure/msal-react'

function App({ msalInstance }: { msalInstance: PublicClientApplication }) {


  const request = {
    loginHint: "slindza@slavkoparoutlook.onmicrosoft.com",
    scopes: ['api://91385bcd-f531-4b1c-8b3d-2105439f0a8a/ToDoList.Read']
  }

  const { login, result, error } = useMsalAuthentication(InteractionType.Silent, request);

  useEffect(() => {
    if (error) {
      login(InteractionType.Popup, request);
    }
  }, [login, error, request]);

  const { accounts } = useMsal();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> */}
      <div className="card">
        {/* <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button> */}
        <p>Signed in as: {accounts[0]?.username}</p>
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

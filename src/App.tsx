import { useEffect, useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import './categories/AutoSuggest.css'
import './categories/AutoSuggestQuestions.css'
//import { Button, Offcanvas } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
// import { protectedResources } from "authConfig";
import ChatBotDlg from './ChatBotDlg'
//import { InteractionType, type PublicClientApplication } from '@azure/msal-browser'
// import { useMsal, useMsalAuthentication } from '@azure/msal-react'

import { InteractionRequiredAuthError } from '@azure/msal-browser';
// import { type AccountFilter } from '@azure/msal-common/browser';

//function App({ msalInstance }: { msalInstance: PublicClientApplication }) {
function App() {

  // const accounts: AccountInfo[] = msalInstance.getAllAccounts();
  // const account: AccountInfo = accounts[0];
  // silentRequest.loginHint = account.loginHint;

  /*
  const accountFilter: AccountFilter = {
    //homeAccountId: '60dfd188-9acd-4749-bc9c-7534da2a1ef1',
    environment: 'trialtenant1qgo77ot.ciamlogin.com',
    tenantId: '60dfd188-9acd-4749-bc9c-7534da2a1ef1', //'9678d2de-0c68-47d5-80f3-d1b43b726b0e',
    username: 'stamena@TrialTenant1qGo77oT.onmicrosoft.com',
    localAccountId: '60dfd188-9acd-4749-bc9c-7534da2a1ef1',
    // loginHint?: string;
    //name: 'stamena Parezanin'
  }

  const account: AccountInfo | null = msalInstance.getAccount(accountFilter);
  // const account: AccountInfo = accounts[0];
  // silentRequest.loginHint = account.loginHint;


  // })
  */

  //const { accounts } = useMsal();



  


  //const { login, result, error } = useMsalAuthentication(InteractionType.Silent, silentRequest);

  // const myAccounts: AccountInfo[] = msalInstance.getAllAccounts();


  /*
    msalInstance.acquireTokenSilent(silentRequest).then(tokenResponse => {
      // Do something with the tokenResponse
      console.log(tokenResponse)
    }).catch(async (error) => {
      console.log(">>>>>>>>>> error", account, error)
      if (error instanceof InteractionRequiredAuthError) {
        // fallback to interaction when silent call fails
        return msalInstance.acquireTokenPopup(silentRequest);
      }
  
      // handle other errors
    })
    */

  //const { login, result, error: msalError } = useMsalAuthentication(InteractionType.Silent, silentRequest);

  useEffect(() => {
    (async () => {
      try {
        /*
        const myAccounts: AccountInfo[] = msalInstance.getAllAccounts();
        const loginResponse = await msalInstance.ssoSilent(silentRequest);
        console.log({ loginResponse })
        */
      }
      catch (err) {
        if (err instanceof InteractionRequiredAuthError) {
          /*
          const loginResponse = await msalInstance
            .loginPopup(silentRequest)
            .catch((error: unknown) => {
              console.log(error)
              // handle error
            });
          */
        } else {
          // handle error
        }
      }    //}

    })()
  }, []);


  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  //const { accounts } = useMsal();
  //const myAccount: AccountInfo|null = getAccount(accountFilter): AccountInfo | null;
  //if (accounts.length === 0)
    //if (!myAccount)
    //return "Loading";

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
        BILJA
        {/* <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button> */}
        {/*<p>Signed in as: {accounts[0]?.username}</p>*/}
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

      <ChatBotDlg show={show} onHide={handleClose} />
    </>
  )
}

export default App

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

import { InteractionRequiredAuthError, PublicClientApplication, type SsoSilentRequest } from '@azure/msal-browser';
// import { type AccountFilter } from '@azure/msal-common/browser';

function App({ msalInstance }: { msalInstance: PublicClientApplication }) {

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

  //const account = accounts[0];

  //silentRequest.loginHint = account.loginHint;

  //const { loginRedirect, getAccount } = msalInstance;


  // const account: AccountInfo = {
  //   homeAccountId: '15c1c3ef-90d5-4baa-9d92-4c063a1186bf.9678d2de-0c68-47d5-80f3-d1b43b726b0e',
  //   environment: 'trialtenant1qgo77ot.ciamlogin.com',
  //   tenantId: '9678d2de-0c68-47d5-80f3-d1b43b726b0e',
  //   username: 'stamena@TrialTenant1qGo77oT.onmicrosoft.com',
  //   localAccountId: '60dfd188-9acd-4749-bc9c-7534da2a1ef1',
  //   // loginHint?: string;
  //   name: 'Stamena Parezanin'
  // }

  /*
  {
    "homeAccountId": "60dfd188-9acd-4749-bc9c-7534da2a1ef1.9678d2de-0c68-47d5-80f3-d1b43b726b0e",
      "environment": "trialtenant1qgo77ot.ciamlogin.com",
        "tenantId": "9678d2de-0c68-47d5-80f3-d1b43b726b0e",
          "username": "stamena@TrialTenant1qGo77oT.onmicrosoft.com",
            "localAccountId": "60dfd188-9acd-4749-bc9c-7534da2a1ef1",
              "name": "Stamena Parezanin",
                "authorityType": "MSSTS",
                  "tenantProfiles": { },
    "idTokenClaims": {
      "aud": "f9c4f176-9e7f-424a-b417-86da612252b8",
        "iss": "https://9678d2de-0c68-47d5-80f3-d1b43b726b0e.ciamlogin.com/9678d2de-0c68-47d5-80f3-d1b43b726b0e/v2.0",
          "iat": 1757592994,
            "nbf": 1757592994,
              "exp": 1757596894,
                "name": "Stamena Parezanin",
                  "nonce": "019938b9-2f56-7f45-a650-f4fad166e8e9",
                    "oid": "60dfd188-9acd-4749-bc9c-7534da2a1ef1",
                      "preferred_username": "stamena@TrialTenant1qGo77oT.onmicrosoft.com",
                        "rh": "1.AbMA3tJ4lmgM1UeA89G0O3JrDnbxxPl_nkpCtBeG2mEiUrizAOGzAA.",
                          "sid": "008b09d9-9de8-6d76-b75b-85fcd9d20d1b",
                            "sub": "Cu06M5DXjiUKKWWK4BD8vVQzM74tj26Y6GlO3mTbV-k",
                              "tid": "9678d2de-0c68-47d5-80f3-d1b43b726b0e",
                                "uti": "rBOIuv6wJkyApNrDLnANAA",
                                  "ver": "2.0"
    },
    "idToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Im1VRzZ2WW5SbG9mdUx4Y2lacnU3U3B0ZjZOTSJ9.eyJhdWQiOiJmOWM0ZjE3Ni05ZTdmLTQyNGEtYjQxNy04NmRhNjEyMjUyYjgiLCJpc3MiOiJodHRwczovLzk2NzhkMmRlLTBjNjgtNDdkNS04MGYzLWQxYjQzYjcyNmIwZS5jaWFtbG9naW4uY29tLzk2NzhkMmRlLTBjNjgtNDdkNS04MGYzLWQxYjQzYjcyNmIwZS92Mi4wIiwiaWF0IjoxNzU3NTkyOTk0LCJuYmYiOjE3NTc1OTI5OTQsImV4cCI6MTc1NzU5Njg5NCwibmFtZSI6IlN0YW1lbmEgUGFyZXphbmluIiwibm9uY2UiOiIwMTk5MzhiOS0yZjU2LTdmNDUtYTY1MC1mNGZhZDE2NmU4ZTkiLCJvaWQiOiI2MGRmZDE4OC05YWNkLTQ3NDktYmM5Yy03NTM0ZGEyYTFlZjEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzdGFtZW5hQFRyaWFsVGVuYW50MXFHbzc3b1Qub25taWNyb3NvZnQuY29tIiwicmgiOiIxLkFiTUEzdEo0bG1nTTFVZUE4OUcwTzNKckRuYnh4UGxfbmtwQ3RCZUcybUVpVXJpekFPR3pBQS4iLCJzaWQiOiIwMDhiMDlkOS05ZGU4LTZkNzYtYjc1Yi04NWZjZDlkMjBkMWIiLCJzdWIiOiJDdTA2TTVEWGppVUtLV1dLNEJEOHZWUXpNNzR0ajI2WTZHbE8zbVRiVi1rIiwidGlkIjoiOTY3OGQyZGUtMGM2OC00N2Q1LTgwZjMtZDFiNDNiNzI2YjBlIiwidXRpIjoickJPSXV2NndKa3lBcE5yRExuQU5BQSIsInZlciI6IjIuMCJ9.baptemjN8YMU2UsMvPkhK5hGZ2PbXvtWJF6zkWCymUvkmvqgx62VDWKcPAoB_gQiOhicxu4TuKQVa5vMIB-CwwiBzUMNDxFeK7lUfNN29OlUPJWukB_KWVOOwH_pmPp1mJTfNfPoE30O6-cgJ6qZS7R0CnmG4uWHt-ODCCIpiT2dIpV4Z_pFjkq8VIjnLiwZAHRxsuYpfOyqigRfM2po--dxnWAEkFYrJCE_7MoD-tkm6sk031-56iIL-adjDa5fX-ZAWQnO9_v6GJw1ZJ80c3v1WausMtLYe1xi-jBzXMgEUdpppYPA8FEpyGE5PyNJbsxUPbLKTysUY4Zj72tQOg"
  }
    */


  //const accounts2: AccountInfo[] = msalInstance.getAllAccounts();

  const [silentRequest] = useState<SsoSilentRequest>({
    //loginHint: "9678d2de-0c68-47d5-80f3-d1b43b726b0e",
    //account, //: msalInstance.getAllAccounts()[0],
    loginHint: "slavkopar@outlook.com", //"stamena@TrialTenant1qGo77oT.onmicrosoft.com", //"slavkopar@outlook.com", //
    scopes: ['ToDoList.Read', 'ToDoList.ReadWrite']
  });


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
  }, [silentRequest, msalInstance]);


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

      <ChatBotDlg show={true} onHide={handleClose} />
    </>
  )
}

export default App

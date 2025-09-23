import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.tsx'
//import { PublicClientApplication } from "@azure/msal-browser";
//import { msalConfig } from "./authConfig";

//const msalInstance = new PublicClientApplication(msalConfig);
//await msalInstance.initialize();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <App />
  </StrictMode>
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Store, persistor } from "./store/store/store";
import { SpinnerCustom } from "./components/ui/spinner";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={Store}>
      <PersistGate
        loading={
          <SpinnerCustom className="min-h-screen text-teal-700 [&>svg]:size-9" />
        }
        persistor={persistor}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
)

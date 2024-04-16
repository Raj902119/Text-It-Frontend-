//necessary for creating React components and using JSX syntax.
import React from 'react'
//rendering React components into the DOM.
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
//ensuring consistent styling across different browsers.
import {CssBaseline} from "@mui/material"
//Wraps your application and provides the context for managing document head tags asynchronously.
import {HelmetProvider} from "react-helmet-async"

import {Provider} from "react-redux";
import store from './redux/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store }>
    <HelmetProvider>
    <CssBaseline />
    <div onContextMenu={(e)=> e.preventDefault()}>
    <App />
    </div>
    </HelmetProvider>
    </Provider>
  </React.StrictMode>,
)

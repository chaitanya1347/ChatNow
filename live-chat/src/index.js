import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import {store} from "./features/store"
import ChatProvider from './Context/ChatProvider';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ChatProvider>
        <Provider store={store}>
          <App />
        </Provider>
    </ChatProvider>
  </BrowserRouter>
);


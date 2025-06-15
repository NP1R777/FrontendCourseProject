import React from 'react';
import ReactDOM from 'react-dom/client';
import Root from './Root';
import { Provider } from 'react-redux';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
  < React.StrictMode >
    <Provider store={store}>
      <Root />
    </Provider>
  </React.StrictMode >
);
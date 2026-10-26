
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthLayout from './app/layout/AuthLayout.jsx'
import { store } from './app/store.js';
import { Provider } from 'react-redux';
import Approutes from './app/Routes/AppRoutes.jsx';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Approutes />,
    <ToastContainer/>
  </Provider>,
);

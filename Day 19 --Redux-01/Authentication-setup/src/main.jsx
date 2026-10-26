
import { createRoot } from 'react-dom/client'
import './index.css'
 import { ToastContainer, } from "react-toastify";
import AuthRoutes from './routes/AuthRoutes.jsx'
import { Provider } from 'react-redux'
import { store } from './app/Store.jsx'

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthRoutes />
    <ToastContainer />
  </Provider>,
);

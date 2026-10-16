
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ContextProvider } from './Context/MyContext.jsx';
import { BrowserRouter } from 'react-router';
import { ToastContainer } from 'react-toastify';


createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ContextProvider>
      <App />
      <ToastContainer/>
    </ContextProvider>
  </BrowserRouter>,
);

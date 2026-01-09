import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import axios from "axios";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}

axios.defaults.baseURL = "https://safety-management-system-backend.onrender.com";
axios.defaults.withCredentials = true; 

export default axios;


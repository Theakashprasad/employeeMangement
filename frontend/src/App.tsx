import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import AppRoutes from "./routes";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

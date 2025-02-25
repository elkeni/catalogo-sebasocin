import { Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu";
import Catalogo from "./pages/Catalogo";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/catalogo" element={<Catalogo />} />
    </Routes>
  );
}

export default App;

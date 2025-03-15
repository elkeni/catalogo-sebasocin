import { Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu";
import SobreNosotros from "./pages/sobrenosotros";
import Catalogo from "./pages/Catalogo";
import Destacados from "./pages/Destacados";
import Producto from "./pages/Producto";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/explorar" element={<SobreNosotros />} />    
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/producto/:nombre" element={<Producto />} />
      <Route path="/destacados" element={<Destacados />} />
    </Routes>
  );
}

export default App;

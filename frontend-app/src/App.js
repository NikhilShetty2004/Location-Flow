import MapPage from "./pages/MapPage";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import MyPins from "./pages/MyPins";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
      <Route path="/pins" element={<MyPins />} />
    </Routes>
  );
}

export default App;

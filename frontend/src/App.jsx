import { Routes, Route } from "react-router-dom";
import FloatChat from "./components/FloatChat";

function App() {

  return (
    <>
      <Routes>
          <Route path="/" element={<FloatChat/>} />  
      </Routes>
    </>
  )
}

export default App

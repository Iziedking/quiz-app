import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuizUI from "./components/quizUI";
import Circuit from "./components/circuit"; 

function App() {
  return (
      <Routes>
        <Route path="/" element={<QuizUI />} />
        <Route path="/circuit" element={<Circuit />} />
      </Routes>
  );
}

export default App;

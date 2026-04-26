import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TreePage from "./pages/TreePage";
import DetailPage from "./pages/DetailPage";
import { TreeProvider } from "./context/TreeProvider";

export default function App() {
  return (
    <TreeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tree" element={<TreePage />} />
          <Route path="/tree/:nodePath" element={<DetailPage />} />
        </Routes>
      </BrowserRouter>
    </TreeProvider>
  );
}

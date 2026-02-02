import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { DiffViewer } from "./pages/DiffViewer/DiffViewer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/diff" replace />} />
          <Route path="diff" element={<DiffViewer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

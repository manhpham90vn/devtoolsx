import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { DiffViewer } from "./pages/DiffViewer/DiffViewer";
import { JSONFormatter } from "./pages/JSONFormatter/JSONFormatter";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/diff" replace />} />
          <Route path="diff" element={<DiffViewer />} />
          <Route path="json-formatter" element={<JSONFormatter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

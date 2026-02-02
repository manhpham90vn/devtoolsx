import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { Base64Encoder } from "./pages/Base64Encoder/Base64Encoder";
import { DiffViewer } from "./pages/DiffViewer/DiffViewer";
import { JSONFormatter } from "./pages/JSONFormatter/JSONFormatter";
import { TimestampConverter } from "./pages/TimestampConverter/TimestampConverter";
import { URLEncoder } from "./pages/URLEncoder/URLEncoder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/diff" replace />} />
          <Route path="diff" element={<DiffViewer />} />
          <Route path="json-formatter" element={<JSONFormatter />} />
          <Route path="base64" element={<Base64Encoder />} />
          <Route path="url-encoder" element={<URLEncoder />} />
          <Route path="timestamp" element={<TimestampConverter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

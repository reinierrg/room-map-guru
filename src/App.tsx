import { Routes, Route } from "react-router";
import Layout from "./components/layout";
//import PersonDashboard from "./components/PersonDashboard";
import NotFound from "./components/NotFound";
import HomePage from "./page/HomePage";

export default function App() {
  return (
    <div> 
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage/>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}
import { Routes, Route } from "react-router";
import Layout from "./components/layout";
//import PersonDashboard from "./components/PersonDashboard";
import Reglas from "./components/Reglas";
import NotFound from "./components/NotFound";
import { RoomsDashboard } from "./components/RoomsDashboard";

export default function App() {
  return (
    <div> 
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RoomsDashboard/>} />
          <Route path="reglas" element={<Reglas />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import RoomDashboard from "./pages/RoomDashboard";
import ListPage from "./pages/ListPage";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      {" "}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/join/:joinKey" element={<JoinRoom />} />
        <Route path="/room/:roomId" element={<RoomDashboard />} />
        <Route path="/list/:listId" element={<ListPage />} />{" "}
      </Routes>{" "}
    </BrowserRouter>
  );
}

export default App;

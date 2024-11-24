import { Route, Routes } from "react-router-dom";
import HomeComponent from "./Components/HomeComponent";
import Signin from "./Components/Register/Signin";
import Signup from "./Components/Register/Signup";
import Profile from "./Components/Profile/Profile";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomeComponent />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
      </Routes>
    </div>
  );
}

export default App;

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Favourites from "./pages/Favourites";
import Contact from "./pages/Contact";
import SiteMenu from "./components/SiteMenu";
import LoginLogout from "./pages/LoginLogout.tsx";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import Profile from "./pages/Profile.tsx";
import NavBar from "./components/NavBar.tsx";

function App() {
  return (
    <>
      <AuthContextProvider>
        <Router>
          <NavBar />
          <SiteMenu>
            <Routes>
              <Route>
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path="/user" element={<LoginLogout />} />
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/favourites" element={<Favourites />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </SiteMenu>
        </Router>
      </AuthContextProvider>
    </>
  );
}

export default App;

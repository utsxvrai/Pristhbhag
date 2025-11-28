import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import BlogList from "./pages/BlogList";
import CreateBlog from "./pages/CreateBlog";
import Signup from "./pages/Signup";
import GrindTech from "./pages/GrindTech";
import Navbar from "./components/Navbar";
import { AuthProvider, AuthContext } from "./context/AuthContext";

function AppRoutes() {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/grindtech" element={<GrindTech />} />
        <Route path="/create" element={isLoggedIn ? <CreateBlog /> : <Navigate to="/login" />} />
        <Route path="/" element={isLoggedIn ? <BlogList /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

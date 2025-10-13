import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import BlogList from "./pages/BlogList";
import CreateBlog from "./pages/CreateBlog";

function App() {
  // Simple auth state for demo
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/create" element={isLoggedIn ? <CreateBlog /> : <Navigate to="/login" />} />
        <Route path="/" element={isLoggedIn ? <BlogList /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

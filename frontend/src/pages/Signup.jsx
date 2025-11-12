import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch('/api/v1/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // go to login page
        navigate('/login');
      } else {
        setError(data.error || 'Failed to create account');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-96 border border-slate-100">
        <h2 className="text-2xl font-extrabold mb-6 text-center text-slate-800">Create your account</h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md bg-slate-50"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md bg-slate-50"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md bg-slate-50"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 font-medium">Sign Up</button>

        <div className="mt-4 text-center text-sm text-slate-600">
          Already have an account? <a href="/login" className="text-blue-600 font-medium">Sign in</a>
        </div>
      </form>
    </div>
  );
}

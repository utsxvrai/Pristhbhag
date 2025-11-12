import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call backend to create blog
    (async () => {
      try {
  const token = localStorage.getItem('token');
        const res = await fetch(`/api/v1/blog/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({ title, content }),
        });
        if (res.ok) {
          navigate('/');
        } else {
          const err = await res.json();
          alert(err.error || 'Failed to create blog');
        }
      } catch (err) {
        console.error(err);
        alert('Server error');
      }
    })();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-2/5 border border-slate-100">
        <h2 className="text-2xl font-extrabold mb-6 text-center text-slate-800">Create a new blog post</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md bg-slate-50"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md bg-slate-50"
          rows={8}
          required
        />
        <div className="flex justify-end">
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-medium">Publish</button>
        </div>
      </form>
    </div>
  );
}

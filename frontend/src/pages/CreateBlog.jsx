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
        const res = await fetch(`http://localhost:3000/api/v1/blog/create`, {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Blog</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          rows={6}
          required
        />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
          Create
        </button>
      </form>
    </div>
  );
}

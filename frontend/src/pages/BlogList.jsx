import React from "react";
import { Link } from "react-router-dom";

export default function BlogList() {
  const blogs = JSON.parse(localStorage.getItem("blogs") || "[]");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog List</h1>
        <Link to="/create" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create Blog
        </Link>
      </div>
      <div className="grid gap-6">
        {blogs.length === 0 ? (
          <p className="text-gray-500">No blogs yet.</p>
        ) : (
          blogs.map((blog, idx) => (
            <div key={idx} className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
              <p>{blog.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

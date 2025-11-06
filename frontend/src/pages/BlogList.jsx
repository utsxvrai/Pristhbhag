import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/v1/blog');
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          // backend returns array of blogs
          setBlogs(data);
        } else {
          console.error('Failed to fetch blogs');
        }
      } catch (err) {
        console.error('Error fetching blogs', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog List</h1>
        <Link to="/create" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create Blog
        </Link>
      </div>
      <div className="grid gap-6">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : blogs.length === 0 ? (
          <p className="text-gray-500">No blogs yet.</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
              <p>{blog.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

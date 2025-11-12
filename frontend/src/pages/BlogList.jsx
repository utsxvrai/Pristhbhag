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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Blog List</h1>
        {/* Create button moved to navbar for global access */}
      </div>
      <div className="grid gap-6">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : blogs.length === 0 ? (
          <p className="text-gray-500">No blogs yet.</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2 text-slate-900">{blog.title}</h2>
              <p className="text-slate-600">{blog.content}</p>
              <div className="mt-4 text-sm text-slate-400">By Anonymous</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

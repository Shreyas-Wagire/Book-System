import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    // Simulating fetching data from an API
    const fetchBlogPosts = async () => {
      try {
        // Replace with actual API endpoint
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        setBlogPosts(data.slice(0, 6)); // Limiting to 6 posts for demo
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <div className='my-8 px-4 lg:px-24'>
      <h2 className='text-3xl font-bold text-center mb-8'>Blog</h2>

      <div className='grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'>
        {blogPosts.map((post) => (
          <div key={post.id} className='bg-white shadow-md p-6 rounded-lg border'>
            <h3 className='text-xl font-semibold mb-4'>{post.title}</h3>
            <p className='text-gray-600'>{post.body}</p>
            <Link
              to={`/blog/${post.id}`} // Adjust as per your routing structure
              className='block mt-4 text-blue-600 hover:underline'
            >
              Read more
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;

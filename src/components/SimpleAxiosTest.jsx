import React, { useState, useEffect } from 'react';
import { simpleAPI } from '../utils/simpleAxios';
import * as Icons from 'lucide-react';

const SimpleAxiosTest = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', body: '' });

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await simpleAPI.getPosts();
      setPosts(data.slice(0, 5)); // Only show first 5 posts
      console.log('Posts fetched successfully:', data.length);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPost.title || !newPost.body) {
      alert('Please fill in both title and body');
      return;
    }

    setLoading(true);
    try {
      const created = await simpleAPI.createPost({
        title: newPost.title,
        body: newPost.body,
        userId: 1
      });
      
      // Add to beginning of posts list
      setPosts(prev => [created, ...prev.slice(0, 4)]);
      setNewPost({ title: '', body: '' });
      console.log('Post created successfully:', created);
    } catch (err) {
      setError(err.message);
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id) => {
    setLoading(true);
    try {
      await simpleAPI.deletePost(id);
      setPosts(prev => prev.filter(post => post.id !== id));
      console.log('Post deleted successfully:', id);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Icons.Zap className="mr-3" size={28} />
            Simple Axios Connection Test
          </h1>
          <p className="mt-2 opacity-90">Testing API connections with JSONPlaceholder</p>
        </div>

        {/* Create Post Form */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Icons.Plus className="mr-2" size={20} />
            Create New Post
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Post title..."
              value={newPost.title}
              onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Post body..."
              value={newPost.body}
              onChange={(e) => setNewPost(prev => ({ ...prev, body: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={createPost}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <Icons.Loader2 className="mr-2 animate-spin" size={16} />
              ) : (
                <Icons.Send className="mr-2" size={16} />
              )}
              Create Post
            </button>
            <button
              onClick={fetchPosts}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <Icons.Loader2 className="mr-2 animate-spin" size={16} />
              ) : (
                <Icons.RefreshCw className="mr-2" size={16} />
              )}
              Refresh Posts
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500">
            <div className="flex items-center">
              <Icons.AlertCircle className="text-red-500 mr-2" size={20} />
              <p className="text-red-700 font-medium">Error: {error}</p>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Icons.FileText className="mr-2" size={20} />
            Recent Posts
          </h2>
          
          {loading && posts.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Icons.Loader2 className="animate-spin mr-2" size={24} />
              <span>Loading posts...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm">{post.body}</p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <Icons.User className="mr-1" size={12} />
                        User ID: {post.userId}
                        <span className="mx-2">•</span>
                        <Icons.Hash className="mr-1" size={12} />
                        Post ID: {post.id}
                      </div>
                    </div>
                    <button
                      onClick={() => deletePost(post.id)}
                      disabled={loading}
                      className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete post"
                    >
                      <Icons.Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              
              {posts.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <Icons.Inbox className="mx-auto mb-2" size={48} />
                  <p>No posts available</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Connection Status */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Connected to JSONPlaceholder API</span>
            </div>
            <div className="text-xs text-gray-500">
              Base URL: https://jsonplaceholder.typicode.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAxiosTest;
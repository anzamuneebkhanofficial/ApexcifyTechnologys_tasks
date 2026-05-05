"use client"
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthBox from '@/components/AuthBox';
import PostCard from '@/components/PostCard';

export default function Home() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [posting, setPosting] = useState(false);

    const fetchPosts = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/posts');
            const data = await res.json();
            setPosts(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!content) return;
        setPosting(true);
        try {
            const res = await fetch('http://localhost:5000/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: user._id, content })
            });
            if (res.ok) {
                setContent('');
                fetchPosts();
            }
        } catch (err) {
            console.error(err);
        }
        setPosting(false);
    };

    if (!user) return <AuthBox />;

    return (
        <div className="container">
            <div className="card" style={{ marginBottom: '30px' }}>
                <form onSubmit={handleCreatePost}>
                    <textarea
                        className="input-field textarea-field"
                        placeholder="What's happening?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button type="submit" className="btn" disabled={posting || !content.trim()}>
                            {posting ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>

            {loading ? (
                <div className="loader" style={{ marginTop: '40px' }}></div>
            ) : (
                posts.map(post => (
                    <PostCard key={post._id} post={post} onPostUpdated={fetchPosts} />
                ))
            )}
        </div>
    );
}

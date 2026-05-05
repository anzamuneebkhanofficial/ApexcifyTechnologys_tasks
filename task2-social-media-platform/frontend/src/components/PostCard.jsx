"use client"
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function PostCard({ post, onPostUpdated }) {
    const { user } = useAuth();
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);

    const isLiked = user && post.likes.includes(user._id);

    const handleLike = async () => {
        if (!user) return;
        try {
            const res = await fetch(`http://localhost:5000/api/posts/${post._id}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id })
            });
            if (res.ok) {
                onPostUpdated(); // Refresh feed
            }
        } catch (err) {
            console.error(err);
        }
    };

    const toggleComments = async () => {
        if (!showComments) {
            setLoadingComments(true);
            try {
                const res = await fetch(`http://localhost:5000/api/posts/${post._id}/comments`);
                const data = await res.json();
                setComments(data);
            } catch (err) {
                console.error(err);
            }
            setLoadingComments(false);
        }
        setShowComments(!showComments);
    };

    const submitComment = async (e) => {
        e.preventDefault();
        if(!newComment) return;
        try {
            const res = await fetch(`http://localhost:5000/api/posts/${post._id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: user._id, content: newComment })
            });
            if(res.ok) {
                const added = await res.json();
                setComments([...comments, added]);
                setNewComment('');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="card">
            <div className="post-header">
                <Link href={`/profile/${post.user?._id}`} className="post-author" style={{color: 'var(--text-main)'}}>
                    @{post.user?.username || 'unknown'}
                </Link>
                <div className="post-date">
                    {new Date(post.createdAt).toLocaleDateString()}
                </div>
            </div>
            <div className="post-content">
                {post.content}
            </div>
            <div className="post-actions">
                <button className={`action-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
                    <svg width="20" height="20" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    {post.likes.length}
                </button>
                <button className="action-btn" onClick={toggleComments}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    Comments
                </button>
            </div>

            {showComments && (
                <div className="comments-section">
                    {loadingComments ? <div className="loader"></div> : comments.map(c => (
                        <div key={c._id} className="comment">
                            <div className="comment-author">@{c.user?.username || 'unknown'}</div>
                            <div className="comment-content">{c.content}</div>
                        </div>
                    ))}
                    
                    {user && (
                        <form className="comment-form" onSubmit={submitComment}>
                            <input 
                                type="text" 
                                className="input-field" 
                                placeholder="Write a comment..." 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button type="submit" className="btn">Send</button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}

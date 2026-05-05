"use client"
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import PostCard from '@/components/PostCard';
import { useParams } from 'next/navigation';

export default function Profile() {
    const params = useParams();
    const { user } = useAuth();
    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [followLoading, setFollowLoading] = useState(false);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/users/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setProfileUser(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchPosts = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/posts/user/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (params.id) {
            fetchProfile();
            fetchPosts();
        }
    }, [params.id]);

    const handleFollow = async () => {
        if (!user) return;
        setFollowLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/users/${params.id}/follow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentUserId: user._id })
            });
            if (res.ok) {
                fetchProfile();
            }
        } catch (err) {
            console.error(err);
        }
        setFollowLoading(false);
    };

    if (loading) return <div className="loader" style={{marginTop: '40px'}}></div>;
    if (!profileUser) return <div className="container" style={{textAlign: 'center', marginTop: '40px'}}>User not found</div>;

    const isFollowing = profileUser.followers?.some(f => f._id === user?._id);

    return (
        <div className="container">
            <div className="profile-header">
                <div className="profile-name">@{profileUser.username}</div>
                <div className="profile-stats">
                    <div className="stat">
                        <span className="stat-val">{profileUser.followers?.length || 0}</span>
                        <span className="stat-label">Followers</span>
                    </div>
                    <div className="stat">
                        <span className="stat-val">{profileUser.following?.length || 0}</span>
                        <span className="stat-label">Following</span>
                    </div>
                </div>
                {user && user._id !== profileUser._id && (
                    <button 
                        className={`btn ${isFollowing ? 'btn-secondary' : ''}`} 
                        style={{ marginTop: '20px' }}
                        onClick={handleFollow}
                        disabled={followLoading}
                    >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                )}
            </div>

            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                Posts
            </h3>
            
            {posts.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No posts yet.</div>
            ) : (
                posts.map(post => (
                    <PostCard key={post._id} post={post} onPostUpdated={fetchPosts} />
                ))
            )}
        </div>
    );
}

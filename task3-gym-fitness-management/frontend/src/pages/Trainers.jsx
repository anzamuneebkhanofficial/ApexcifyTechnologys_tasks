import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-hot-toast';
import { ShieldAlert, Trash2, Users } from 'lucide-react';

import { getImageUrl } from '../utils/helpers.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const PageContainer = styled.div`
  padding: 32px;
  margin-left: 260px;
  min-height: 100vh;
  @media (max-width: 768px) { margin-left: 0; padding: 20px; }
`;

const TrainerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

const TrainerCard = styled.div`
  background: var(--bg-card);
  border-radius: 24px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
  transition: all 0.3s;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    border-color: var(--primary);
  }

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-bottom: 16px;
    border: 3px solid var(--primary);
    object-fit: cover;
  }

  h3 { font-size: 1.2rem; margin-bottom: 4px; }
  .email { color: var(--text-muted); font-size: 0.88rem; margin-bottom: 20px; }

  .stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;

    div {
      background: rgba(255,255,255,0.03);
      padding: 12px;
      border-radius: 12px;
      span { display: block; font-size: 0.72rem; color: var(--text-muted); margin-bottom: 4px; }
      b { font-size: 0.95rem; color: var(--primary); }
    }
  }

  .delete-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    color: #f87171;
    background: none;
    border: none;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s;
    &:hover { transform: scale(1.1); }
  }
  &:hover .delete-btn { opacity: 1; }
`;

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const { userData } = useAuth();

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/trainers');
      setTrainers(res.data);
    } catch (err) {
      toast.error('Failed to load trainers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrainers(); }, []);

  const demoteTrainer = async (id) => {
    if (!window.confirm('Demote this trainer to Member?')) return;
    try {
      await api.put(`/users/${id}`, { role: 'Member' });
      toast.success('Trainer demoted to Member');
      fetchTrainers();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const deleteTrainer = async (id) => {
    if (!window.confirm('Delete this trainer permanently?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('Trainer removed');
      fetchTrainers();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <PageContainer>
      <div style={{ marginBottom: 32 }}>
        <h1>Trainer Management</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Overview of gym staff and trainers</p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading trainers…" />
      ) : trainers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <Users size={48} style={{ marginBottom: 16, opacity: 0.4 }} />
          <h3 style={{ color: 'var(--text-main)', marginBottom: 8 }}>No Trainers Yet</h3>
          <p>Promote members to Trainer role from the Members page.</p>
        </div>
      ) : (
        <TrainerGrid>
          {trainers.map(t => (
            <TrainerCard key={t._id} className="glass">
              {userData?.role === 'Admin' && (
                <button className="delete-btn" onClick={() => deleteTrainer(t._id)} title="Delete Trainer">
                  <Trash2 size={18} />
                </button>
              )}
              <img
                src={getImageUrl(t.profileImage) || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name || 'User')}&background=random`}
                alt={t.name}
              />
              <h3>{t.name}</h3>
              <p className="email">{t.email}</p>

              <div className="stats">
                <div>
                  <span>Specialization</span>
                  <b>General</b>
                </div>
                <div>
                  <span>Status</span>
                  <b style={{ color: '#4ade80' }}>Active</b>
                </div>
              </div>

              {userData?.role === 'Admin' && (
                <button
                  className="btn-secondary"
                  style={{ width: '100%', color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.2)' }}
                  onClick={() => demoteTrainer(t._id)}
                >
                  <ShieldAlert size={16} style={{ marginRight: 8 }} /> Demote to Member
                </button>
              )}
            </TrainerCard>
          ))}
        </TrainerGrid>
      )}
    </PageContainer>
  );
};

export default Trainers;

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, MapPin, Users, Plus, Check, Edit, Trash2, Dumbbell } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const PageContainer = styled.div`
  padding: 32px;
  margin-left: 260px;
  @media (max-width: 768px) { margin-left: 0; }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  h1 { font-size: 2rem; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const ClassCard = styled.div`
  background: var(--bg-card);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s;
  position: relative;

  &:hover { transform: translateY(-5px); border-color: var(--primary); }

  .title { font-size: 1.2rem; font-weight: 700; margin-bottom: 12px; }
  .info-row { display: flex; align-items: center; gap: 8px; color: var(--text-muted); margin-bottom: 8px; font-size: 0.9rem; }
  
  .footer {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .price { font-weight: 700; color: var(--primary); }
  }

  .admin-actions {
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    gap: 8px;
    opacity: 0;
    transition: opacity 0.3s;
    
    button {
      padding: 6px;
      border-radius: 8px;
      background: rgba(0,0,0,0.3);
      color: #fff;
      &:hover { background: var(--primary); color: #000; }
    }
  }

  &:hover .admin-actions { opacity: 1; }
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: var(--bg-card);
  width: 100%;
  max-width: 500px;
  border-radius: 24px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  label { font-size: 0.9rem; color: var(--text-muted); }
  input, select, textarea {
    padding: 12px;
    background: rgba(0,0,0,0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #fff;
  }
`;

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { userData } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduleTime: '',
    durationMinutes: 60,
    capacity: 20
  });

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/classes');
      setClasses(res.data);
    } catch (err) {
      toast.error('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleEnroll = async (id) => {
    try {
      await api.post(`/classes/${id}/enroll`);
      toast.success("Enrolled successfully!");
      fetchClasses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/classes/${editingId}`, formData);
        toast.success('Class updated!');
      } else {
        await api.post('/classes', formData);
        toast.success('Class created!');
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ title: '', description: '', scheduleTime: '', durationMinutes: 60, capacity: 20 });
      fetchClasses();
    } catch (err) {
      toast.error('Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/classes/${id}`);
      toast.success("Class deleted");
      fetchClasses();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const openEdit = (c) => {
    setEditingId(c._id);
    setFormData({
      title: c.title,
      description: c.description,
      scheduleTime: c.scheduleTime.split('.')[0].slice(0, 16),
      durationMinutes: c.durationMinutes,
      capacity: c.capacity
    });
    setShowModal(true);
  };

  return (
    <PageContainer>
      <SectionHeader>
        <h1>Gym Classes</h1>
        {(userData?.role === 'Admin' || userData?.role === 'Trainer') && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} /> Create Class
          </button>
        )}
      </SectionHeader>

      {loading ? (
        <LoadingSpinner message="Loading classes…" />
      ) : classes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <Dumbbell size={48} style={{ marginBottom: 16, opacity: 0.4 }} />
          <h3 style={{ color: 'var(--text-main)', marginBottom: 8 }}>No Classes Yet</h3>
          <p>Classes will appear here once created.</p>
        </div>
      ) : (
      <Grid>
        {classes.map(c => (
          <ClassCard key={c._id}>
            {(userData?.role === 'Admin' || (userData?.role === 'Trainer' && c.trainer?._id === userData._id)) && (
              <div className="admin-actions">
                <button onClick={() => openEdit(c)}><Edit size={14}/></button>
                <button onClick={() => handleDelete(c._id)} style={{ color: '#f87171' }}><Trash2 size={14}/></button>
              </div>
            )}
            <div className="title">{c.title}</div>
            <div className="info-row"><Calendar size={16} /> {new Date(c.scheduleTime).toLocaleString()}</div>
            <div className="info-row"><Clock size={16} /> {c.durationMinutes} mins</div>
            <div className="info-row"><Users size={16} /> {c.enrolledMembers.length} / {c.capacity} Enrolled</div>
            <div className="info-row"><MapPin size={16} /> Main Hall</div>
            
            <div className="footer">
              <span className="price">Trainer: {c.trainer?.name}</span>
              {userData?.role === 'Member' && (
                <button 
                  className={c.enrolledMembers.includes(userData._id) ? "btn-secondary" : "btn-primary"}
                  onClick={() => !c.enrolledMembers.includes(userData._id) && handleEnroll(c._id)}
                  disabled={c.enrolledMembers.includes(userData._id)}
                >
                  {c.enrolledMembers.includes(userData._id) ? <><Check size={16}/> Enrolled</> : "Join Class"}
                </button>
              )}
            </div>
          </ClassCard>
        ))}
      </Grid>
      )}

      {showModal && (
        <Modal>
          <ModalContent>
            <h2 style={{ marginBottom: 24 }}>{editingId ? 'Edit Fitness Class' : 'New Fitness Class'}</h2>
            <Form onSubmit={handleSubmit}>
              <label>Title</label>
              <input type="text" value={formData.title} required onChange={e => setFormData({...formData, title: e.target.value})} />
              
              <label>Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              
              <label>Schedule Time</label>
              <input type="datetime-local" value={formData.scheduleTime} required onChange={e => setFormData({...formData, scheduleTime: e.target.value})} />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label>Duration (mins)</label>
                  <input type="number" value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: e.target.value})} />
                </div>
                <div>
                  <label>Capacity</label>
                  <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={submitting}>
                  {submitting ? 'Saving…' : (editingId ? 'Update' : 'Create')}
                </button>
                <button type="button" className="btn-secondary" onClick={() => { setShowModal(false); setEditingId(null); }}>Cancel</button>
              </div>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default Classes;

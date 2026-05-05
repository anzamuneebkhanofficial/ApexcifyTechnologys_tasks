import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-hot-toast';
import { Check, X, QrCode, Search, ClipboardCheck } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const PageContainer = styled.div`
  padding: 32px;
  margin-left: 260px;
  @media (max-width: 768px) { margin-left: 0; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 12px;
  
  th { text-align: left; padding: 0 20px; color: var(--text-muted); font-size: 0.9rem; }
  td { padding: 20px; background: var(--bg-card); }
  tr td:first-child { border-radius: 16px 0 0 16px; border-left: 1px solid rgba(255, 255, 255, 0.05); }
  tr td:last-child { border-radius: 0 16px 16px 0; border-right: 1px solid rgba(255, 255, 255, 0.05); }
`;

const Attendance = () => {
  const { userData } = useAuth();
  const [members, setMembers]     = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [filter, setFilter]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [marking, setMarking]     = useState(null); // holds userId being marked

  const fetchData = async () => {
    setLoading(true);
    try {
      if (userData?.role === 'Admin' || userData?.role === 'Trainer') {
        const [m, a] = await Promise.all([
          api.get('/users/members'),
          api.get('/attendance')
        ]);
        setMembers(m.data);
        setAttendance(a.data);
      } else if (userData?._id) {
        const a = await api.get(`/attendance/user/${userData._id}`);
        setAttendance(a.data);
      }
    } catch (err) {
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userData]);

  const handleMark = async (userId, status) => {
    setMarking(userId + status);
    try {
      await api.post('/attendance', { userId, status, method: 'Manual' });
      toast.success(`Marked as ${status}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to mark attendance');
    } finally {
      setMarking(null);
    }
  };

  return (
    <PageContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1>Attendance Tracking</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
            {userData?.role === 'Member' ? 'Your attendance history' : 'Mark and monitor member attendance'}
          </p>
        </div>
        {(userData?.role === 'Admin' || userData?.role === 'Trainer') && (
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search members…"
              style={{ padding: '10px 10px 10px 40px', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', width: 220 }}
              onChange={e => setFilter(e.target.value)}
            />
          </div>
        )}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading attendance…" />
      ) : (userData?.role === 'Admin' || userData?.role === 'Trainer') ? (
        <Table>
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.filter(m => m.name.toLowerCase().includes(filter.toLowerCase())).map(m => (
              <tr key={m._id}>
                <td style={{ fontWeight: 600 }}>{m.name}</td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{m.email}</td>
                <td>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.8rem', opacity: marking === m._id+'Present' ? 0.6 : 1 }}
                      disabled={marking === m._id+'Present'}
                      onClick={() => handleMark(m._id, 'Present')}
                    >
                      <Check size={14} /> Present
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '0.8rem', color: '#f87171', opacity: marking === m._id+'Absent' ? 0.6 : 1 }}
                      disabled={marking === m._id+'Absent'}
                      onClick={() => handleMark(m._id, 'Absent')}
                    >
                      <X size={14} /> Absent
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {members.filter(m => m.name.toLowerCase().includes(filter.toLowerCase())).length === 0 && (
              <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No members found</td></tr>
            )}
          </tbody>
        </Table>
      ) : (
        <div className="glass" style={{ padding: 40, textAlign: 'center' }}>
          <QrCode size={120} style={{ margin: '0 auto 24px', opacity: 0.8 }} />
          <h2>Your Attendance QR Code</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Show this code at the reception desk</p>
          
          <h3 style={{ textAlign: 'left', marginBottom: 20 }}>Recent History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {attendance.map(a => (
              <div key={a._id} style={{ display: 'flex', justifyContent: 'space-between', padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
                <span>{new Date(a.date).toLocaleDateString()}</span>
                <span style={{ color: a.status === 'Present' ? '#4ade80' : '#f87171' }}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Attendance;

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-hot-toast';
import { User, Shield, ToggleLeft, ToggleRight, Trash2, Users } from 'lucide-react';
import { getImageUrl } from '../utils/helpers.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const PageContainer = styled.div`
  padding: 32px;
  margin-left: 260px;
  min-height: 100vh;
  @media (max-width: 768px) { margin-left: 0; padding: 20px; }
`;

const Header = styled.div`
  margin-bottom: 32px;
  h1 { font-size: 2rem; font-weight: 800; }
  p  { color: var(--text-muted); margin-top: 4px; }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.05);
`;

const MemberTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 620px;

  thead tr {
    background: rgba(0,0,0,0.2);
  }

  th {
    text-align: left;
    padding: 14px 20px;
    color: var(--text-muted);
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  tbody tr {
    border-top: 1px solid rgba(255,255,255,0.04);
    transition: background 0.2s;
    &:hover { background: rgba(255,255,255,0.02); }
  }

  td {
    padding: 16px 20px;
    font-size: 0.9rem;
  }
`;

const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${({ status }) =>
    status === 'active' ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)'};
  color: ${({ status }) =>
    status === 'active' ? '#4ade80' : '#f87171'};
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: all 0.2s;
  color: ${({ color }) => color || 'var(--text-muted)'};
  &:hover { background: rgba(255,255,255,0.08); transform: scale(1.1); }
`;

const TrainerSelect = styled.select`
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  &:focus { outline: none; border-color: var(--primary); }
  option { background: #1e293b; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px;
  color: var(--text-muted);
  svg { margin-bottom: 16px; opacity: 0.4; }
  h3 { margin-bottom: 8px; color: var(--text-main); }
`;

const Members = () => {
  const [members, setMembers]   = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const { userData } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [m, t] = await Promise.all([
        api.get('/users/members'),
        api.get('/users/trainers')
      ]);
      setMembers(m.data);
      setTrainers(t.data);
    } catch (err) {
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdate = async (id, data) => {
    try {
      await api.put(`/users/${id}`, data);
      toast.success('Member updated');
      fetchData();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently remove this member?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('Member removed');
      fetchData();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <PageContainer>
      <Header>
        <h1>Member Management</h1>
        <p>Manage gym members, roles and trainer assignments</p>
      </Header>

      {loading ? (
        <LoadingSpinner message="Loading members…" />
      ) : members.length === 0 ? (
        <EmptyState>
          <Users size={48} />
          <h3>No Members Found</h3>
          <p>Members will appear here once they register.</p>
        </EmptyState>
      ) : (
        <TableWrapper>
          <MemberTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Assigned Trainer</th>
                {userData?.role === 'Admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Avatar
                        src={getImageUrl(m.profileImage) || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || 'User')}&background=random`}
                        alt={m.name}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{m.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.role}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>{m.email}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.phone || '—'}</div>
                  </td>
                  <td>
                    <StatusBadge status={m.subscriptionStatus || 'inactive'}>
                      {(m.subscriptionStatus || 'inactive').toUpperCase()}
                    </StatusBadge>
                  </td>
                  <td>
                    <TrainerSelect
                      value={m.assignedTrainer?._id || ''}
                      disabled={userData?.role !== 'Admin'}
                      onChange={e => handleUpdate(m._id, { assignedTrainer: e.target.value || null })}
                    >
                      <option value="">None</option>
                      {trainers.map(t => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                      ))}
                    </TrainerSelect>
                  </td>
                  {userData?.role === 'Admin' && (
                    <td>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        <ActionBtn
                          color="#00f2fe"
                          title="Promote to Trainer"
                          onClick={() => handleUpdate(m._id, { role: 'Trainer' })}
                        >
                          <Shield size={16} />
                        </ActionBtn>
                        <ActionBtn
                          color={m.isActive !== false ? '#4ade80' : '#f87171'}
                          title="Toggle Active"
                          onClick={() => handleUpdate(m._id, { isActive: !(m.isActive !== false) })}
                        >
                          {m.isActive !== false ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        </ActionBtn>
                        <ActionBtn
                          color="#f87171"
                          title="Delete Member"
                          onClick={() => handleDelete(m._id)}
                        >
                          <Trash2 size={16} />
                        </ActionBtn>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </MemberTable>
        </TableWrapper>
      )}
    </PageContainer>
  );
};

export default Members;

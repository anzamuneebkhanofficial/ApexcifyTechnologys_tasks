import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import {
  Users,
  Calendar,
  TrendingUp,
  CreditCard,
  Bell,
  CheckCircle,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const DashboardContainer = styled.div`
  padding: 32px;
  margin-left: 260px;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;

  .welcome {
    h1 {
      font-size: 2rem;
      font-weight: 800;
    }
    p {
      color: var(--text-muted);
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
`;

const StatCard = styled(motion.div)`
  padding: 24px;
  background: var(--bg-card);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  gap: 20px;

  .icon-wrapper {
    width: 60px;
    height: 60px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 242, 254, 0.1);
    color: var(--primary);
  }

  .info {
    h3 {
      font-size: 1.5rem;
      font-weight: 700;
    }
    p {
      font-size: 0.9rem;
      color: var(--text-muted);
    }
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: var(--bg-card);
  border-radius: 24px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  h2 {
    font-size: 1.25rem;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .item-info {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .text {
      h4 { font-size: 0.95rem; }
      p { font-size: 0.8rem; color: var(--text-muted); }
    }
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.type === 'active' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)'};
  color: ${props => props.type === 'active' ? '#4ade80' : '#f87171'};
`;

const Dashboard = () => {
  const { userData } = useAuth();
  const [stats, setStats] = useState({
    members: 0,
    classes: 0,
    attendance: 0,
    revenue: 0,
    myClasses: [],
    myPlans: [],
    myAttendance: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (userData?.role === 'Admin') {
          const [m, c, p, a] = await Promise.all([
            api.get('/users/members'),
            api.get('/classes'),
            api.get('/payments'),
            api.get('/attendance')
          ]);
          setStats(prev => ({
            ...prev,
            members: m.data.length,
            classes: c.data.length,
            revenue: p.data.filter(pay => pay.status === 'Completed').reduce((acc, curr) => acc + curr.amount, 0),
            attendance: a.data.length > 0 ? Math.round((a.data.filter(x => x.status === 'Present').length / a.data.length) * 100) : 0
          }));
        } else if (userData?.role === 'Trainer') {
          const [m, c, a] = await Promise.all([
            api.get('/users/members'),
            api.get('/classes'),
            api.get('/attendance')
          ]);
          setStats(prev => ({
            ...prev,
            members: m.data.length,
            classes: c.data.length,
            attendance: a.data.length > 0 ? Math.round((a.data.filter(x => x.status === 'Present').length / a.data.length) * 100) : 0
          }));
        } else if (userData?.role === 'Member') {
          const [c, p, a] = await Promise.all([
            api.get('/classes'),
            api.get('/plans'),
            api.get(`/attendance/user/${userData._id}`)
          ]);
          setStats(prev => ({
            ...prev,
            myClasses: c.data.filter(item => item.enrolledMembers.includes(userData._id)),
            myPlans: p.data,
            myAttendance: a.data
          }));
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userData) fetchDashboardData();
  }, [userData]);

  if (loading) return (
    <DashboardContainer>
      <LoadingSpinner message="Loading dashboard…" padding="120px" />
    </DashboardContainer>
  );

  const isAdminOrTrainer = userData?.role === 'Admin' || userData?.role === 'Trainer';

  return (
    <DashboardContainer>
      <Header>
        <div className="welcome">
          <h1>Hello, {userData?.name ? userData.name.split(' ')[0] : 'there'}!</h1>
          <p>{isAdminOrTrainer ? "Here's what's happening at Pak Gym today." : "Keep up the great work on your fitness journey!"}</p>
        </div>
        <StatCard className="glass" style={{ margin: 0, padding: '12px 24px' }}>
          <Bell size={20} />
        </StatCard>
      </Header>

      <StatsGrid>
        {isAdminOrTrainer ? (
          <>
            <StatCard whileHover={{ y: -5 }} className="glass">
              <div className="icon-wrapper"><Users /></div>
              <div className="info">
                <h3>{stats.members}</h3>
                <p>Total Members</p>
              </div>
            </StatCard>
            <StatCard whileHover={{ y: -5 }} className="glass">
              <div className="icon-wrapper" style={{ color: '#f472b6', background: 'rgba(244, 114, 182, 0.1)' }}><Calendar /></div>
              <div className="info">
                <h3>{stats.classes}</h3>
                <p>Active Classes</p>
              </div>
            </StatCard>
            <StatCard whileHover={{ y: -5 }} className="glass">
              <div className="icon-wrapper" style={{ color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)' }}><TrendingUp /></div>
              <div className="info">
                <h3>{stats.attendance}%</h3>
                <p>Avg. Attendance</p>
              </div>
            </StatCard>
            {userData?.role === 'Admin' && (
              <StatCard whileHover={{ y: -5 }} className="glass">
                <div className="icon-wrapper" style={{ color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)' }}><CreditCard /></div>
                <div className="info">
                  <h3>PKR {stats.revenue}</h3>
                  <p>Total Revenue</p>
                </div>
              </StatCard>
            )}
          </>
        ) : (
          <>
            <StatCard whileHover={{ y: -5 }} className="glass">
              <div className="icon-wrapper" style={{ color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)' }}><CheckCircle /></div>
              <div className="info">
                <h3>{userData?.subscriptionStatus?.toUpperCase()}</h3>
                <p>Status</p>
              </div>
            </StatCard>
            <StatCard whileHover={{ y: -5 }} className="glass">
              <div className="icon-wrapper"><Calendar /></div>
              <div className="info">
                <h3>{stats.myClasses.length}</h3>
                <p>Enrolled Classes</p>
              </div>
            </StatCard>
            <StatCard whileHover={{ y: -5 }} className="glass">
              <div className="icon-wrapper" style={{ color: '#f472b6', background: 'rgba(244, 114, 182, 0.1)' }}><TrendingUp /></div>
              <div className="info">
                <h3>{stats.myAttendance.length}</h3>
                <p>Days Attended</p>
              </div>
            </StatCard>
            <StatCard whileHover={{ y: -5 }} className="glass">
              <div className="icon-wrapper" style={{ color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)' }}><Clock /></div>
              <div className="info">
                <h3>{userData?.subscriptionEnd ? new Date(userData.subscriptionEnd).toLocaleDateString() : 'N/A'}</h3>
                <p>Expires On</p>
              </div>
            </StatCard>
          </>
        )}
      </StatsGrid>

      <ContentGrid>
        <Card className="glass">
          <h2><Clock size={20} /> {isAdminOrTrainer ? "Recent Activities" : "Your Next Classes"}</h2>
          <List>
            {isAdminOrTrainer ? (
              <>
                <ListItem>
                  <div className="item-info">
                    <CheckCircle size={20} color="#4ade80" />
                    <div className="text">
                      <h4>System Update</h4>
                      <p>Role-based access implemented</p>
                    </div>
                  </div>
                </ListItem>
                <ListItem>
                  <div className="item-info">
                    <CreditCard size={20} color="#fbbf24" />
                    <div className="text">
                      <h4>Subscription Review</h4>
                      <p>New payments pending verification</p>
                    </div>
                  </div>
                </ListItem>
              </>
            ) : (
              stats.myClasses.length > 0 ? stats.myClasses.map(c => (
                <ListItem key={c._id}>
                  <div className="item-info">
                    <Calendar size={20} color="var(--primary)" />
                    <div className="text">
                      <h4>{c.title}</h4>
                      <p>{new Date(c.scheduleTime).toLocaleString()}</p>
                    </div>
                  </div>
                </ListItem>
              )) : <p>No upcoming classes. Join one today!</p>
            )}
          </List>
        </Card>

        <Card className="glass">
          <h2>{isAdminOrTrainer ? <><Users size={20} /> Staff Quick Links</> : <><CheckCircle size={20} /> Workout Plans</>}</h2>
          <List>
            {isAdminOrTrainer ? (
              <>
                <ListItem>
                  <div className="text">
                    <h4>Add New Class</h4>
                    <p>Schedule a new fitness session</p>
                  </div>
                </ListItem>
                {userData?.role === 'Admin' && (
                  <ListItem>
                    <div className="text">
                      <h4>Review Payments</h4>
                      <p>Verify manual bank transfers</p>
                    </div>
                  </ListItem>
                )}
              </>
            ) : (
              stats.myPlans.length > 0 ? stats.myPlans.map(p => (
                <ListItem key={p._id}>
                  <div className="item-info">
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#4facfe' }} />
                    <div className="text">
                      <h4>{p.title}</h4>
                      <p>{p.type}</p>
                    </div>
                  </div>
                </ListItem>
              )) : <p>No plans assigned yet.</p>
            )}
          </List>
        </Card>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default Dashboard;

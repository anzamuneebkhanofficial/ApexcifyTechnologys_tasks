import React from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Dumbbell, 
  ClipboardCheck, 
  CreditCard, 
  LogOut,
  UserCircle,
  FileText,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getImageUrl } from '../utils/helpers.js';

const SidebarContainer = styled.aside`
  width: 260px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  padding: 24px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-card);
  border-right: 1px solid var(--glass-border);
  z-index: 1000;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${props => props.isOpen ? '20px 0 50px rgba(0,0,0,0.5)' : 'none'};
  }
`;

const Overlay = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 999;
  }
`;

const MobileHeader = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
  }
`;

const Logo = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 40px;
  background: var(--grad-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  
  @media (max-width: 768px) {
    margin-bottom: 0;
    text-align: left;
  }
`;

const NavList = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
  margin-right: -4px;

  /* Thin scrollbar for nav */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.2);
  }
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  color: var(--text-muted);
  font-weight: 600;
  transition: var(--transition);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-main);
    transform: translateX(4px);
  }

  &.active {
    background: var(--grad-primary);
    color: #000;
    box-shadow: 0 8px 20px rgba(0, 242, 254, 0.3);
    
    &:hover {
      transform: none;
    }
  }
`;

const UserSection = styled.div`
  flex-shrink: 0;
  padding-top: 20px;
  margin-top: 16px;
  border-top: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  img {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    object-fit: cover;
    border: 2px solid var(--glass-border);
  }

  .details {
    overflow: hidden;
    h4 {
      font-size: 0.95rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--text-main);
    }
    p {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 500;
    }
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  color: #f87171;
  background: rgba(248, 113, 113, 0.05);
  font-weight: 600;
  width: 100%;
  text-align: left;
  border: 1px solid rgba(248, 113, 113, 0.1);

  &:hover {
    background: rgba(248, 113, 113, 0.15);
    border-color: rgba(248, 113, 113, 0.3);
  }
`;

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['Admin', 'Trainer', 'Member'] },
    { name: 'Members', path: '/members', icon: <Users size={20} />, roles: ['Admin', 'Trainer'] },
    { name: 'Trainers', path: '/trainers', icon: <UserCircle size={20} />, roles: ['Admin'] },
    { name: 'Classes', path: '/classes', icon: <Calendar size={20} />, roles: ['Admin', 'Trainer', 'Member'] },
    { name: 'Workout/Diet', path: '/plans', icon: <Dumbbell size={20} />, roles: ['Admin', 'Trainer', 'Member'] },
    { name: 'Attendance', path: '/attendance', icon: <ClipboardCheck size={20} />, roles: ['Admin', 'Trainer', 'Member'] },
    { name: 'Payments', path: '/payments', icon: <CreditCard size={20} />, roles: ['Admin', 'Member'] },
    { name: 'Tenders', path: '/tenders', icon: <FileText size={20} />, roles: ['Admin'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(userData?.role));

  return (
    <>
      <Overlay isOpen={isOpen} onClick={toggleSidebar} />
      <SidebarContainer isOpen={isOpen}>
        <MobileHeader>
          <Logo>PAK GYM</Logo>
          <button onClick={toggleSidebar} style={{ background: 'none', color: '#fff' }}>
            <X size={24} />
          </button>
        </MobileHeader>
        
        <Logo className="desktop-logo">PAK GYM</Logo>
        
        <NavList>
          {filteredNavItems.map(item => (
            <StyledNavLink key={item.path} to={item.path} onClick={() => window.innerWidth < 768 && toggleSidebar()}>
              {item.icon}
              {item.name}
            </StyledNavLink>
          ))}
        </NavList>
        <UserSection>
          <UserInfo>
            <img src={getImageUrl(userData?.profileImage) || `https://ui-avatars.com/api/?name=${userData?.name || 'User'}&background=random`} alt="Profile" />
            <div className="details">
              <h4>{userData?.name}</h4>
              <p>{userData?.role}</p>
            </div>
          </UserInfo>
          <LogoutButton onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </LogoutButton>
        </UserSection>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;

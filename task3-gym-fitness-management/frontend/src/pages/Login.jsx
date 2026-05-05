import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-hot-toast';
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, ShieldCheck, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: radial-gradient(circle at 20% 30%, rgba(0,242,254,0.06) 0%, transparent 60%),
              radial-gradient(circle at 80% 70%, rgba(79,172,254,0.06) 0%, transparent 60%),
              var(--bg-dark);
`;

const AuthCard = styled(motion.div)`
  width: 100%;
  max-width: 440px;
  padding: 44px;
  background: rgba(30, 41, 59, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
`;

const Brand = styled.div`
  text-align: center;
  margin-bottom: 32px;
  h1 {
    font-size: 2rem;
    font-weight: 900;
    background: var(--grad-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 4px;
  }
  p {
    font-size: 0.9rem;
    color: var(--text-muted);
  }
`;

const TabRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: rgba(0,0,0,0.25);
  border-radius: 14px;
  padding: 4px;
  margin-bottom: 28px;
`;

const Tab = styled.button`
  padding: 10px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.25s;
  color: ${props => props.active ? '#000' : 'var(--text-muted)'};
  background: ${props => props.active ? 'var(--grad-primary)' : 'none'};
  box-shadow: ${props => props.active ? '0 4px 14px rgba(0,242,254,0.3)' : 'none'};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    pointer-events: none;
  }

  input, select {
    width: 100%;
    padding: 14px 16px 14px 48px;
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    color: #fff;
    font-size: 0.95rem;
    transition: all 0.25s;
    appearance: none;

    &:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(0, 242, 254, 0.15);
      outline: none;
      background: rgba(0, 242, 254, 0.03);
    }

    &::placeholder { color: rgba(148,163,184,0.6); }

    option { background: #1e293b; color: #fff; }
  }
`;

const SpinIcon = styled(Loader)`
  animation: ${spin} 0.8s linear infinite;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background: ${props => props.disabled ? 'rgba(0,242,254,0.3)' : 'var(--grad-primary)'};
  color: #000;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 800;
  margin-top: 8px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 242, 254, 0.4);
  }
`;

const ErrorBanner = styled(motion.div)`
  padding: 12px 16px;
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.2);
  border-radius: 10px;
  color: #f87171;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// ─── Component ────────────────────────────────────────────
const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const clearFields = () => { setEmail(''); setPassword(''); setName(''); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        await signup(email, password, name, role);
        toast.success(`Welcome to Pak Gym, ${name}! 🎉`);
      } else {
        await login(email, password);
        toast.success('Welcome back! Redirecting…');
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err?.message || 'Something went wrong. Please try again.';
      // Make Firebase error messages friendlier
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setError('Invalid email or password.');
      } else if (msg.includes('email-already-in-use')) {
        setError('An account with this email already exists.');
      } else if (msg.includes('weak-password')) {
        setError('Password must be at least 6 characters.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <Brand>
          <h1>PAK GYM</h1>
          <p>{isRegister ? 'Create your account' : 'Sign in to your account'}</p>
        </Brand>

        <TabRow>
          <Tab active={!isRegister} onClick={() => { setIsRegister(false); clearFields(); }}>
            Sign In
          </Tab>
          <Tab active={isRegister} onClick={() => { setIsRegister(true); clearFields(); }}>
            Sign Up
          </Tab>
        </TabRow>

        <Form onSubmit={handleSubmit}>
          {isRegister && (
            <InputGroup>
              <UserIcon size={18} />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </InputGroup>
          )}

          {isRegister && (
            <InputGroup>
              <ShieldCheck size={18} />
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="Member">Member</option>
                <option value="Trainer">Trainer</option>
                <option value="Admin">Admin</option>
              </select>
            </InputGroup>
          )}

          <InputGroup>
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </InputGroup>

          <InputGroup>
            <Lock size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              minLength={6}
            />
          </InputGroup>

          {error && (
            <ErrorBanner
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </ErrorBanner>
          )}

          <SubmitButton type="submit" disabled={loading}>
            {loading
              ? <><SpinIcon size={18} /> {isRegister ? 'Creating Account…' : 'Signing In…'}</>
              : isRegister
                ? <><UserPlus size={18} /> Create Account</>
                : <><LogIn size={18} /> Sign In</>
            }
          </SubmitButton>
        </Form>
      </AuthCard>
    </AuthContainer>
  );
};

export default Login;

import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%        { opacity: 0.4; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ── Full-screen variant (used while auth initialises) ── */
const FullScreenOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: var(--bg-dark);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease;
`;

const LogoText = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  background: var(--grad-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const Ring = styled.div`
  width: ${({ size }) => size || '48px'};
  height: ${({ size }) => size || '48px'};
  border: 3px solid rgba(255, 255, 255, 0.08);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
`;

const Message = styled.p`
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 500;
`;

/* ── Inline variant (used inside pages) ── */
const InlineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: ${({ padding }) => padding || '80px 24px'};
  width: 100%;
  animation: ${fadeIn} 0.4s ease;
`;

const InlineRing = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.08);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
`;

/* ── Components ─────────────────────────────────────────── */

/**
 * Full-screen blocking spinner shown while Firebase auth initialises.
 */
export const FullScreenLoader = ({ message = 'Loading Pak Gym…' }) => (
  <FullScreenOverlay>
    <LogoText>PAK GYM</LogoText>
    <Ring size="52px" />
    <Message>{message}</Message>
  </FullScreenOverlay>
);

/**
 * Inline spinner used inside page containers while data is being fetched.
 */
const LoadingSpinner = ({ message = 'Loading…', padding }) => (
  <InlineWrapper padding={padding}>
    <InlineRing />
    <Message>{message}</Message>
  </InlineWrapper>
);

export default LoadingSpinner;

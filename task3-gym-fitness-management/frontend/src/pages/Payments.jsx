import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-hot-toast';
import { CreditCard, Upload, ExternalLink, Info, Trash2 } from 'lucide-react';
import { getImageUrl } from '../utils/helpers.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const PageContainer = styled.div`
  padding: 32px;
  margin-left: 260px;
  min-height: 100vh;
  @media (max-width: 768px) { margin-left: 0; padding: 20px; }
`;

const PaymentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const OptionCard = styled.div`
  background: var(--bg-card);
  border-radius: 24px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 20px;

  h2 { display: flex; align-items: center; gap: 12px; font-size: 1.4rem; }
  .info-box {
    padding: 16px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    font-size: 0.88rem;
    line-height: 1.7;
    color: var(--text-muted);
    border: 1px solid rgba(255,255,255,0.06);
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;

  input, select {
    padding: 12px 14px;
    background: rgba(0,0,0,0.2);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: #fff;
    font-size: 0.9rem;
    width: 100%;
    &:focus { outline: none; border-color: var(--primary); }
  }
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${({ status }) =>
    status === 'Completed' ? 'rgba(74,222,128,0.12)' :
      status === 'Rejected' ? 'rgba(248,113,113,0.12)' :
        'rgba(251,191,36,0.12)'};
  color: ${({ status }) =>
    status === 'Completed' ? '#4ade80' :
      status === 'Rejected' ? '#f87171' :
        '#fbbf24'};
`;

const PaymentRow = styled.div`
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.05);
  transition: border-color 0.2s;
  &:hover { border-color: rgba(255,255,255,0.1); }
`;
const Payments = () => {
  const { userData } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [manualData, setManualData] = useState({
    amount: '', months: 1, transId: '', file: null
  });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const endpoint = userData?.role === 'Admin' ? '/payments' : '/payments/my';
      const res = await api.get(endpoint);
      setPayments(res.data);
    } catch (err) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) fetchPayments();
  }, [userData]);

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualData.file) return toast.error('Please upload a payment screenshot');
    const fd = new FormData();
    fd.append('amount', manualData.amount);
    fd.append('subscriptionMonths', manualData.months);
    fd.append('transactionId', manualData.transId);
    fd.append('screenshot', manualData.file);
    setSubmitting(true);
    try {
      await api.post('/payments/manual', fd);
      toast.success('Payment submitted for verification! ✓');
      setManualData({ amount: '', months: 1, transId: '', file: null });
      fetchPayments();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      await api.put(`/payments/${id}/verify`, { status });
      toast.success(`Payment ${status}`);
      fetchPayments();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this payment record?')) return;
    try {
      await api.delete(`/payments/${id}`);
      toast.success('Record deleted');
      fetchPayments();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <PageContainer>
      <div style={{ marginBottom: 36 }}>
        <h1>Payments &amp; Subscriptions</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
          {userData?.role === 'Admin'
            ? 'Review and verify member payment submissions'
            : 'Manage your gym membership payments'}
        </p>
      </div>


      {userData?.role === 'Member' && (
        <PaymentGrid style={{ marginBottom: 48 }}>

          <OptionCard className="glass">
            <h2><CreditCard color="#00f2fe" /> Stripe / Card</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Pay instantly with your credit or debit card.
            </p>
            <div className="info-box">
              <Info size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>Subscription activates immediately after successful payment.</span>
            </div>
            <button className="btn-primary" style={{ opacity: 0.6, cursor: 'not-allowed' }} disabled>
              Pay with Card (Coming Soon)
            </button>
          </OptionCard>


          <OptionCard className="glass">
            <h2><Upload color="#ff0844" /> Bank / Easypaisa</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Transfer to our account and upload your receipt.
            </p>
            <div className="info-box" style={{ flexDirection: 'column', gap: 4 }}>
              <span><strong style={{ color: '#fff' }}>Bank:</strong> HBL — Account 0123-4567890-01</span>
              <span><strong style={{ color: '#fff' }}>Easypaisa:</strong> 0300-1234567</span>
            </div>
            <Form onSubmit={handleManualSubmit}>
              <input
                type="number"
                placeholder="Amount (PKR)"
                value={manualData.amount}
                required
                min={1}
                onChange={e => setManualData({ ...manualData, amount: e.target.value })}
              />
              <input
                type="text"
                placeholder="Transaction ID / Reference No."
                value={manualData.transId}
                onChange={e => setManualData({ ...manualData, transId: e.target.value })}
              />
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Payment Screenshot *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={e => setManualData({ ...manualData, file: e.target.files[0] })}
                />
              </div>
              <button type="submit" className="btn-secondary" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit for Verification'}
              </button>
            </Form>
          </OptionCard>
        </PaymentGrid>
      )}


      <div>
        <h2 style={{ marginBottom: 20 }}>
          {userData?.role === 'Admin' ? 'All Payment Requests' : 'Your Payment History'}
        </h2>

        {loading ? (
          <LoadingSpinner message="Loading payments…" padding="48px" />
        ) : payments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            <CreditCard size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
            <p>No payment records found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {payments.map(p => (
              <PaymentRow key={p._id}>
                <div>
                  <h4 style={{ color: '#00f2fe', marginBottom: 4 }}>
                    PKR {p.amount?.toLocaleString()} — {p.paymentMethod || 'Manual'}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {userData?.role === 'Admin' && p.user?.name
                      ? `Member: ${p.user.name} · `
                      : ''}
                    {new Date(p.createdAt).toLocaleDateString('en-PK', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <StatusBadge status={p.status}>{p.status}</StatusBadge>

                  {p.screenshotUrl && (
                    <a
                      href={getImageUrl(p.screenshotUrl)}
                      target="_blank"
                      rel="noreferrer"
                      title="View screenshot"
                      style={{ color: 'var(--primary)' }}
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}

                  {userData?.role === 'Admin' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      {p.status === 'Pending' && (
                        <>
                          <button
                            className="btn-primary"
                            style={{ padding: '5px 14px', fontSize: '0.8rem' }}
                            onClick={() => handleVerify(p._id, 'Completed')}
                          >
                            Verify
                          </button>
                          <button
                            className="btn-secondary"
                            style={{ padding: '5px 14px', fontSize: '0.8rem', color: '#f87171' }}
                            onClick={() => handleVerify(p._id, 'Rejected')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(p._id)}
                        style={{ background: 'none', color: '#f87171', padding: '5px', cursor: 'pointer', border: 'none' }}
                        title="Delete record"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </PaymentRow>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Payments;

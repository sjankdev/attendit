import React, { useState } from 'react';
import axios from 'axios';

function RequestPasswordReset() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 
    setSuccess(null); 
    try {
        await axios.post('http://localhost:5000/api/auth/request-password-reset', { email });
      setSuccess('Check your email for a reset link.'); 
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error sending reset link. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      <button type="submit">Send Reset Link</button>
      {error && <p className="error">{error}</p>} 
      {success && <p className="success">{success}</p>} 
    </form>
  );
}

export default RequestPasswordReset;

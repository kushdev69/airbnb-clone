import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFlash } from '../context/FlashContext';

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { addFlash } = useFlash();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Enter a username';
    if (!formData.email.trim()) newErrors.email = 'Enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.password.trim()) newErrors.password = 'Enter a password';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const result = await signup(formData);
      if (result.success) {
        addFlash('success', 'Account created successfully!');
        navigate('/listings');
      } else {
        addFlash('error', result.message);
      }
    } catch {
      addFlash('error', 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-kicker">Start here</p>
        <h1>Sign up</h1>
        <form onSubmit={handleSubmit} className="auth-form needs-validation" noValidate>
          <div className="mb-3">
            <input
              className={`auth-input form-control ${errors.username ? 'is-invalid' : ''} ${formData.username ? 'is-valid' : ''}`}
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
            <div className="invalid-feedback">{errors.username || 'Enter a username'}</div>
            <div className="valid-feedback">Username is available</div>
          </div>
          <div className="mb-3">
            <input
              className={`auth-input form-control ${errors.email ? 'is-invalid' : ''} ${formData.email ? 'is-valid' : ''}`}
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
            <div className="invalid-feedback">{errors.email || 'Enter your email'}</div>
            <div className="valid-feedback">Email looks good</div>
          </div>
          <div className="mb-3">
            <input
              className={`auth-input form-control ${errors.password ? 'is-invalid' : ''} ${formData.password ? 'is-valid' : ''}`}
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <div className="invalid-feedback">{errors.password || 'Enter a password'}</div>
            <div className="valid-feedback">Generate a strong password</div>
          </div>
          <button className="auth-btn btn btn-danger w-100" type="submit" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="auth-foot">Already have an account? <Link to="/users/login">Login</Link></p>
      </div>
    </div>
  );
}

export default Signup;
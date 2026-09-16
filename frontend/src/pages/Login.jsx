import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFlash } from '../context/FlashContext';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addFlash } = useFlash();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Get redirect URL from location state or default to /listings
  const from = location.state?.from?.pathname || '/listings';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Enter your username';
    if (!formData.password.trim()) newErrors.password = 'Enter your password';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const result = await login(formData);
      if (result.success) {
        addFlash('success', 'Welcome back!');
        navigate(from, { replace: true });
      } else {
        addFlash('error', result.message);
      }
    } catch {
      addFlash('error', 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-kicker">Welcome back</p>
        <h1>Login</h1>
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
            <div className="invalid-feedback">{errors.username || 'Enter your username'}</div>
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
              autoComplete="current-password"
            />
            <div className="invalid-feedback">{errors.password || 'Enter your password'}</div>
          </div>
          <button className="auth-btn btn btn-danger w-100" type="submit" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className="auth-foot">New here? <Link to="/users/signup">Create an account</Link></p>
      </div>
    </div>
  );
}

export default Login;
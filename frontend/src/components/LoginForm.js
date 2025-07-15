import { useState } from 'react';
import { login } from '../api';
import { Link, useNavigate } from 'react-router-dom';

function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({ Email: '', Password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await login(formData);
    if (result.token) {
      localStorage.setItem('token', result.token);
      onLogin(result.token);

      // Reindirizza in base al ruolo
      const user = JSON.parse(atob(result.token.split('.')[1]));
      if (user.Ruolo === 'Dipendente') {
        navigate('/mieventi');
      } else if (user.Ruolo === 'Responsabile') {
        navigate('/dashboard');
      }
    } else {
      alert(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input
        name="Email"
        className="form-control mb-2"
        placeholder="Email"
        type="email"
        value={formData.Email}
        onChange={handleChange}
        required
      />
      <input
        name="Password"
        className="form-control mb-2"
        placeholder="Password"
        type="password"
        value={formData.Password}
        onChange={handleChange}
        required
      />
      <button className="btn btn-success w-100 mb-3" type="submit">
        Login
      </button>
      <p className="text-center">
        Non hai un account? <Link to="/register">Registrati qui</Link>
      </p>
    </form>
  );
}

export default LoginForm;
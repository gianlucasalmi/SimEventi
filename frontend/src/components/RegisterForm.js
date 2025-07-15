import { useState } from 'react';
import { register } from '../api';
import { Link } from 'react-router-dom';

function RegisterForm() {
  const [formData, setFormData] = useState({
    Nome: '',
    Cognome: '',
    Email: '',
    Password: '',
    Ruolo: 'Dipendente', // Default role
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await register(formData);
    alert(result.message || result.error);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input
        name="Nome"
        className="form-control mb-2"
        placeholder="Nome"
        value={formData.Nome}
        onChange={handleChange}
        required
      />
      <input
        name="Cognome"
        className="form-control mb-2"
        placeholder="Cognome"
        value={formData.Cognome}
        onChange={handleChange}
        required
      />
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
      <select
        name="Ruolo"
        className="form-select mb-3"
        value={formData.Ruolo}
        onChange={handleChange}
        required
      >
        <option value="Dipendente">Dipendente</option>
        <option value="Responsabile">Responsabile</option>
      </select>
      <button className="btn btn-primary w-100 mb-3" type="submit">
        Registrati
      </button>
      <p className="text-center">
        Hai già un account? <Link to="/login">Accedi qui</Link>
      </p>
    </form>
  );
}

export default RegisterForm;

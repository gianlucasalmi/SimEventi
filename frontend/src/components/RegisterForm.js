import { useState } from 'react';
import { register } from '../api';
import { Link } from 'react-router-dom';

function RegisterForm() {
  const [formData, setFormData] = useState({
    Nome: '',
    Cognome: '',
    Email: '',
    Password: '',
    Ruolo: 'Dipendente'
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
      <input name="Nome" className="form-control mb-2" placeholder="Nome" onChange={handleChange} />
      <input name="Cognome" className="form-control mb-2" placeholder="Cognome" onChange={handleChange} />
      <input name="Email" className="form-control mb-2" placeholder="Email" type="email" onChange={handleChange} />
      <input name="Password" className="form-control mb-2" placeholder="Password" type="password" onChange={handleChange} />
      <select name="Ruolo" className="form-select mb-3" onChange={handleChange}>
        <option value="Dipendente">Dipendente</option>
        <option value="Organizzatore">Organizzatore</option>
      </select>
      <button className="btn btn-primary w-100 mb-3" type="submit">Registrati</button>
      <p className="text-center">Hai già un account? <Link to="/login">Accedi qui</Link></p>
    </form>
  );
}

export default RegisterForm;

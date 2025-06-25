import { useState } from 'react';

function ModalEvento({ show, onClose, onCrea }) {
  const [form, setForm] = useState({ Titolo: '', Data: '', Descrizione: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onCrea(form);
    setForm({ Titolo: '', Data: '', Descrizione: '' });
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title">Crea nuovo evento</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              name="Titolo"
              className="form-control mb-2"
              placeholder="Titolo"
              value={form.Titolo}
              onChange={handleChange}
              required
            />
            <input
              name="Data"
              type="date"
              className="form-control mb-2"
              value={form.Data}
              onChange={handleChange}
              required
            />
            <textarea
              name="Descrizione"
              className="form-control mb-2"
              placeholder="Descrizione"
              value={form.Descrizione}
              onChange={handleChange}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Annulla</button>
            <button type="submit" className="btn btn-primary">Crea</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalEvento;
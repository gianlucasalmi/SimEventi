import { useState } from 'react';

function ModalRichiesta({ show, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    Oggetto: '',
    Quantità: 1,
    CostoUnitario: 0,
    Motivazione: '',
    CategoriaID: '',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
    onClose(); // Chiude il modal dopo l'invio
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Crea Richiesta di Acquisto</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <input
                name="Oggetto"
                className="form-control mb-2"
                placeholder="Nome del materiale"
                value={formData.Oggetto}
                onChange={handleChange}
                required
              />
              <input
                name="Quantità"
                type="number"
                className="form-control mb-2"
                placeholder="Quantità"
                value={formData.Quantità}
                onChange={handleChange}
                required
              />
              <input
                name="CostoUnitario"
                type="number"
                step="0.01"
                className="form-control mb-2"
                placeholder="Costo unitario"
                value={formData.CostoUnitario}
                onChange={handleChange}
                required
              />
              <textarea
                name="Motivazione"
                className="form-control mb-2"
                placeholder="Motivazione"
                value={formData.Motivazione}
                onChange={handleChange}
                required
              />
              <select
                name="CategoriaID"
                className="form-select mb-3"
                value={formData.CategoriaID}
                onChange={handleChange}
                required
              >
                <option value="">Seleziona una categoria</option>
                <option value="1">Hardware</option>
                <option value="2">Software</option>
                <option value="3">Cancelleria</option>
              </select>
              <button className="btn btn-primary w-100" type="submit">
                Invia richiesta
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalRichiesta;
import { useState } from 'react';

function ModalRichiesta({ show, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    Oggetto: '',
    Quantità: 1,
    CostoUnitario: 0,
    Motivazione: '',
    Categoria: '',
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
              <div className="mb-2">
                <label htmlFor="Oggetto" className="form-label">Nome del materiale</label>
                <input
                  id="Oggetto"
                  name="Oggetto"
                  className="form-control"
                  placeholder="Nome del materiale"
                  value={formData.Oggetto}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor="Quantità" className="form-label">Quantità</label>
                <input
                  id="Quantità"
                  name="Quantità"
                  type="number"
                  className="form-control"
                  placeholder="Quantità"
                  value={formData.Quantità}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor="CostoUnitario" className="form-label">Costo unitario</label>
                <input
                  id="CostoUnitario"
                  name="CostoUnitario"
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="Costo unitario"
                  value={formData.CostoUnitario}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor="Motivazione" className="form-label">Motivazione</label>
                <textarea
                  id="Motivazione"
                  name="Motivazione"
                  className="form-control"
                  placeholder="Motivazione"
                  value={formData.Motivazione}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="Categoria" className="form-label">Categoria</label>
                <select
                  id="Categoria"
                  name="Categoria"
                  className="form-select"
                  value={formData.Categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleziona una categoria</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Cancelleria">Cancelleria</option>
                </select>
              </div>
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
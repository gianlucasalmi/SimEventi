import { useEffect, useState } from 'react';

function ModalCheckin({ show, onClose, evento }) {
  const [iscritti, setIscritti] = useState([]);

  useEffect(() => {
    if (show && evento) {
      // Recupera gli iscritti all'evento
      fetch(`http://localhost:3001/api/eventi/${evento.EventoID}/iscritti`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => setIscritti(data));
    }
  }, [show, evento]);

  const handleCheckin = async (iscrizioneId) => {
    const res = await fetch('http://localhost:3001/api/iscrizioni/checkin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ IscrizioneID: iscrizioneId })
    });
    if (res.ok) {
      setIscritti(iscritti =>
        iscritti.map(i =>
          i.IscrizioneID === iscrizioneId ? { ...i, Checkin: true } : i
        )
      );
    } else {
      alert('Errore durante il check-in');
    }
  };

  if (!show || !evento) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Gestione check-in: {evento.Titolo}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <ul className="list-group">
              {iscritti.length === 0 && <li className="list-group-item">Nessun iscritto</li>}
              {iscritti.map(i => (
                <li key={i.UtenteID} className="list-group-item d-flex justify-content-between align-items-center">
                  {i.Nome} {i.Cognome} ({i.Email})
                  {i.Checkin ? (
                    <span className="badge bg-success">Presente</span>
                  ) : (
                    <button className="btn btn-sm btn-primary" onClick={() => handleCheckin(i.IscrizioneID)}>
                      Segna presente
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Chiudi</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalCheckin;
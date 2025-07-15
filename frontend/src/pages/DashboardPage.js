import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import ModalRichiesta from '../components/ModalRichiesta';

function DashboardPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [showRichiestaModal, setShowRichiestaModal] = useState(false);
  const [mieRichieste, setMieRichieste] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo(decoded);
      fetch(`${process.env.REACT_APP_API_URL}/richieste`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          console.log('Risposta richieste:', data); // Log della risposta
          setMieRichieste(Array.isArray(data) ? data : []); // Gestione del caso non array
        })
        .catch(error => console.error('Errore fetch richieste:', error));
    }
  }, [showRichiestaModal]);

  const handleSubmitRichiesta = async formData => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.REACT_APP_API_URL}/richieste`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert('Richiesta inviata con successo!');
    } else {
      alert('Errore durante l\'invio della richiesta');
    }
  };

  return (
    <div className="container mt-5">
      {userInfo && (
        <div className="mb-4">
          <h4>Benvenuto {userInfo.Ruolo}: {userInfo.Nome} {userInfo.Cognome}</h4>
          <h2>{userInfo.Ruolo === 'Dipendente' ? 'Materiali Disponibili' : 'Richieste di Acquisto'}</h2>
        </div>
      )}
      {userInfo?.Ruolo === 'Dipendente' && (
        <>
          <button
            className="btn btn-primary mb-3"
            onClick={() => setShowRichiestaModal(true)}
          >
            Crea Richiesta
          </button>
          <ModalRichiesta
            show={showRichiestaModal}
            onClose={() => setShowRichiestaModal(false)}
            onSubmit={handleSubmitRichiesta}
          />
          {/* Lista richieste personali */}
          <h5 className="mt-4 mb-2">Le tue richieste di acquisto</h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Oggetto</th>
                <th>Quantità</th>
                <th>Costo unitario</th>
                <th>Categoria</th>
                <th>Stato</th>
                <th>Motivazione</th>
                <th>Data richiesta</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(mieRichieste) && mieRichieste.map(r => (
                <tr key={r.RichiestaID}>
                  <td>{r.Oggetto}</td>
                  <td>{r.Quantità}</td>
                  <td>{r.CostoUnitario}</td>
                  <td>{r.CategoriaID}</td>
                  <td>{r.Stato}</td>
                  <td>{r.Motivazione}</td>
                  <td>{new Date(r.DataRichiesta).toLocaleDateString()}</td>
                </tr>
              ))}
              {Array.isArray(mieRichieste) && mieRichieste.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center">Nessuna richiesta inviata</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default DashboardPage;

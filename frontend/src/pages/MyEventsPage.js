import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

function MyEventsPage() {
  const [mieIscrizioni, setMieIscrizioni] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUserInfo(jwtDecode(token));
      fetch(`${process.env.REACT_APP_API_URL}/iscrizioni`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setMieIscrizioni(data));
    }
  }, []);

  return (
    <div className="container mt-5">
      <h3 className="mb-4">I miei eventi</h3>
      <div className="row g-3">
        {mieIscrizioni.map(i => (
          <div key={i.IscrizioneID} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{i.Titolo || i.Evento?.Titolo}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {new Date(i.Data || i.Evento?.Data).toLocaleDateString()}
                </h6>
                <div className="flex-grow-1" />
                {i.CheckinEffettuato ? (
                  <span className="badge bg-success align-self-start mb-2">Check-in effettuato</span>
                ) : (
                  <button
                    className="btn btn-danger btn-sm mt-auto align-self-end"
                    onClick={async () => {
                      const token = localStorage.getItem('token');
                      if (window.confirm('Vuoi annullare l\'iscrizione a questo evento?')) {
                        const res = await fetch(`${process.env.REACT_APP_API_URL}/iscrizioni/${i.IscrizioneID}`, {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        if (res.ok) {
                          fetch(`${process.env.REACT_APP_API_URL}/iscrizioni`, {
                            headers: { Authorization: `Bearer ${token}` }
                          })
                            .then(res => res.json())
                            .then(data => setMieIscrizioni(data));
                        } else {
                          alert('Errore durante la disiscrizione');
                        }
                      }
                    }}
                  >
                    Annulla iscrizione
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {mieIscrizioni.length === 0 && (
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center">
                Nessuna iscrizione
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyEventsPage;
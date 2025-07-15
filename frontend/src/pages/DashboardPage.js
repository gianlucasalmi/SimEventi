import { useEffect, useState } from 'react';
import { getEventi } from '../api';
import { jwtDecode } from 'jwt-decode';
import ModalEvento from '../components/ModalEvento';
import ModalModificaEvento from '../components/ModalModificaEvento';
import ModalCheckin from '../components/ModalCheckin';
import FormRichiesta from '../components/FormRichiesta';
import ModalRichiesta from '../components/ModalRichiesta';

function DashboardPage() {
  const [eventi, setEventi] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [eventoDaModificare, setEventoDaModificare] = useState(null);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [eventoCheckin, setEventoCheckin] = useState(null);
  const [mieIscrizioni, setMieIscrizioni] = useState([]);
  const [showRichiestaModal, setShowRichiestaModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo(decoded);
      getEventi(token).then(data => {
        // Forza sempre un array
        if (Array.isArray(data)) {
          setEventi(data);
        } else if (data && Array.isArray(data.eventi)) {
          setEventi(data.eventi);
        } else {
          setEventi([]);
        }
      });
      // Recupera le iscrizioni dell'utente
      fetch(`${process.env.REACT_APP_API_URL}/iscrizioni`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setMieIscrizioni(data));
    }
  }, []);

  const creaEvento = async (evento) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.REACT_APP_API_URL}/eventi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(evento)
    });
    if (res.ok) {
      // Aggiorna lista eventi dopo creazione
      getEventi(token).then(data => setEventi(data));
    } else {
      alert('Errore nella creazione evento');
    }
  };

  // Funzione per modificare evento
  const modificaEvento = async (evento) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.REACT_APP_API_URL}/eventi/${evento.EventoID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(evento)
    });
    if (res.ok) {
      getEventi(token).then(data => setEventi(data));
    } else {
      alert('Errore nella modifica evento');
    }
  };

  const gestisciCheckin = (evento) => {
    setEventoCheckin(evento);
    setShowCheckinModal(true);
  };

  const iscrivitiEvento = async (eventoId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.REACT_APP_API_URL}/iscrizioni`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ EventoID: eventoId })
    });
    if (res.ok) {
      // Aggiorna le iscrizioni dopo l'iscrizione
      fetch(`${process.env.REACT_APP_API_URL}/iscrizioni`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setMieIscrizioni(data));
    } else {
      alert('Errore durante l\'iscrizione');
    }
  };

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
          <h2>{userInfo.Ruolo === 'Dipendente' ? 'Materiali Disponibili' : 'Richieste di Acquisto'}</h2> {/* Titolo dinamico */}
        </div>
      )}
      {userInfo?.Ruolo === 'Organizzatore' && (
        <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
          Crea nuovo evento
        </button>
      )}
      <ModalEvento
        show={showModal}
        onClose={() => setShowModal(false)}
        onCrea={creaEvento}
      />
      <ModalModificaEvento
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        evento={eventoDaModificare}
        onSalva={modificaEvento}
      />
      <ModalCheckin
        show={showCheckinModal}
        onClose={() => setShowCheckinModal(false)}
        evento={eventoCheckin}
      />
      <ModalRichiesta
        show={showRichiestaModal}
        onClose={() => setShowRichiestaModal(false)}
        onSubmit={handleSubmitRichiesta}
      />

      <h2>Eventi disponibili</h2>
      <div className="row g-3">
        {eventi.map(e => {
          const isIscritto = mieIscrizioni.some(i => i.EventoID === e.EventoID);
          return (
            <div key={e.EventoID} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{e.Titolo}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{new Date(e.Data).toLocaleDateString()}</h6>
                  <p className="card-text flex-grow-1">{e.Descrizione}</p>
                  <div className="mt-auto d-flex flex-wrap gap-2 justify-content-end">
                    {userInfo?.Ruolo === 'Organizzatore' && (
                      <>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => {
                            setEventoDaModificare(e);
                            setShowEditModal(true);
                          }}
                        >
                          Modifica
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={async () => {
                            if (window.confirm('Sei sicuro di voler eliminare questo evento?')) {
                              const token = localStorage.getItem('token');
                              const res = await fetch(`${process.env.REACT_APP_API_URL}/eventi/${e.EventoID}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` }
                              });
                              if (res.ok) {
                                getEventi(token).then(data => setEventi(data));
                              } else {
                                alert('Errore durante l\'eliminazione');
                              }
                            }
                          }}
                        >
                          Elimina
                        </button>
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => gestisciCheckin(e)}
                        >
                          Gestisci check-in
                        </button>
                      </>
                    )}
                    {userInfo?.Ruolo === 'Dipendente' && !isIscritto && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => iscrivitiEvento(e.EventoID)}
                      >
                        Iscriviti
                      </button>
                    )}
                    {userInfo?.Ruolo === 'Dipendente' && isIscritto && (
                        <button className="btn btn-primary btn-sm align-self-center" disabled>
                            Iscritto
                        </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
        </>
      )}
    </div>
  );
}

export default DashboardPage;

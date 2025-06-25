import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function StatistichePage() {
  const [statistiche, setStatistiche] = useState([]);
  const [dal, setDal] = useState('');
  const [al, setAl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const user = jwtDecode(token);
    if (user.Ruolo !== 'Organizzatore') return navigate('/dashboard');

    fetchStatistiche(token);
  }, []);

  const fetchStatistiche = async (token) => {
    let url = 'http://localhost:3001/api/eventi/statistiche';
    if (dal || al) {
      const params = new URLSearchParams();
      if (dal) params.append('dal', dal);
      if (al) params.append('al', al);
      url += `?${params.toString()}`;
    }

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setStatistiche(data);
  };

  const handleFiltra = () => {
    const token = localStorage.getItem('token');
    fetchStatistiche(token);
  };

  return (
    <div className="container mt-5">
      <h2>Statistiche Eventi Passati</h2>
      <div className="row mb-4">
        <div className="col">
          <label>Dal</label>
          <input type="date" className="form-control" value={dal} onChange={e => setDal(e.target.value)} />
        </div>
        <div className="col">
          <label>Al</label>
          <input type="date" className="form-control" value={al} onChange={e => setAl(e.target.value)} />
        </div>
        <div className="col d-flex align-items-end">
          <button className="btn btn-primary w-100" onClick={handleFiltra}>Filtra</button>
        </div>
      </div>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Titolo</th>
            <th>Data</th>
            <th>Iscritti</th>
            <th>Check-in</th>
            <th>Partecipazione</th>
          </tr>
        </thead>
        <tbody>
          {statistiche.map(s => (
            <tr key={s.EventoID}>
              <td>{s.Titolo}</td>
              <td>{new Date(s.Data).toLocaleDateString()}</td>
              <td>{s.Iscritti}</td>
              <td>{s.Checkin}</td>
              <td>{s.Partecipazione}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StatistichePage;

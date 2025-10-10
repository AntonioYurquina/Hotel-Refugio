import React, { useEffect, useState } from 'react';

export default function ApiDemo() {
  const [imgUrl, setImgUrl] = useState('');
  const [repoInfo, setRepoInfo] = useState(null);
  const [ghError, setGhError] = useState(null);

  const loadUnsplash = () => {
    const w = 800, h = 400;
    // añadir timestamp para forzar refresh
    setImgUrl(`https://source.unsplash.com/random/${w}x${h}?hotel,room&${Date.now()}`);
  };

  useEffect(() => {
    loadUnsplash();
  }, []);

  useEffect(() => {
    fetch('https://api.github.com/repos/octocat/Hello-World')
      .then(r => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then(data => setRepoInfo(data))
      .catch(err => setGhError(err.message));
  }, []);

  return (
    <div className="row">
      <div className="col-md-6 mb-3">
        <div className="card">
          <img alt="Unsplash demo" src={imgUrl} className="card-img-top" style={{objectFit:'cover',height:200}}/>
          <div className="card-body">
            <h5 className="card-title">Unsplash (imagen aleatoria)</h5>
            <p className="card-text">Fuente: source.unsplash.com — sin clave.</p>
            <button className="btn btn-sm btn-outline-primary" onClick={loadUnsplash}>
              <i className="fa-solid fa-arrows-rotate"></i> Nueva imagen
            </button>
          </div>
        </div>
      </div>

      <div className="col-md-6 mb-3">
        <div className="card p-3">
          <h5 className="card-title">GitHub API (repo público)</h5>
          {ghError && <p className="text-danger">Error: {ghError}</p>}
          {repoInfo ? (
            <div>
              <strong>{repoInfo.full_name}</strong>
              <p className="mb-0">⭐ {repoInfo.stargazers_count} — Última: {new Date(repoInfo.updated_at).toLocaleString()}</p>
            </div>
          ) : (
            <p>Cargando información del repo...</p>
          )}
          <small className="text-muted d-block mt-2">Ejemplo: api.github.com/repos/octocat/Hello-World</small>
        </div>
      </div>
    </div>
  );
}

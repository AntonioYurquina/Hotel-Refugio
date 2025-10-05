import React, { useState } from "react";
import { Button, Modal, Alert, Spinner } from "react-bootstrap";

export default function FotoPerfil({ user, setUser }) {
  const [showModal, setShowModal] = useState(false);
  const [fotos, setFotos] = useState(user.fotos || []);
  const [principal, setPrincipal] = useState(user.fotoPerfil || "");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const handleSubirFotos = (e) => {
    const archivos = Array.from(e.target.files)
      .filter(file => file.type === "image/jpeg");

    if (archivos.length + fotos.length > 3) {
      setError("Solo puedes subir hasta 3 fotos");
      return;
    }

    const nuevasFotos = archivos.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file
    }));

    setFotos(prev => [...prev, ...nuevasFotos]);
    setError("");
  };

  const handleSeleccionarPrincipal = (foto) => {
    setPrincipal(foto.url);
  };

  const subirFotoAlServidor = async (file) => {
    const formData = new FormData();
    formData.append("foto", file);
    formData.append("id_usuario", user.id_usuario);

    try {
      await fetch("https://robledo.website/uploadFotoPerfil", {
        method: "POST",
        body: formData
      });
      console.log("Foto subida correctamente");
    } catch (err) {
      console.error("Error al subir foto:", err);
    }
  };

  const handleGuardarCambios = async () => {
    if (!principal) {
      setError("Debes seleccionar una foto principal antes de guardar");
      return;
    }

    setGuardando(true);
    setError("");

    try {
      // Subir todas las fotos nuevas
      for (let foto of fotos) {
        if (!foto.subida) {
          await subirFotoAlServidor(foto.file);
          foto.subida = true;
        }
      }

      // Actualizar usuario con foto principal y fotos
      setUser(prev => ({ ...prev, fotoPerfil: principal, fotos }));
      setShowModal(false);
    } catch (err) {
      setError("Error al guardar cambios");
      console.error(err);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="text-center">
      {principal ? (
        <div className="position-relative d-inline-block" style={{ cursor: "pointer" }} onClick={() => setShowModal(true)}>
          <img
            src={principal}
            alt="Foto de perfil"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              border: "3px solid #ff7f32",
              objectFit: "cover",
              transition: "transform 0.2s"
            }}
            className="hover-scale"
          />
          <div style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "#ff7f32",
            color: "white",
            borderRadius: "50%",
            width: "25px",
            height: "25px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "16px",
            fontWeight: "bold"
          }}>✎</div>
        </div>
      ) : (
        <Button onClick={() => setShowModal(true)} style={{ backgroundColor: "#ff7f32", border: "none" }}>
          Agregar foto de perfil
        </Button>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Selecciona tu foto de perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <input type="file" accept="image/jpeg" multiple onChange={handleSubirFotos} />
          <div className="d-flex gap-3 mt-3 flex-wrap justify-content-center">
            {fotos.map((foto, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  cursor: "pointer",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: principal === foto.url ? "3px solid #ff7f32" : "1px solid #ccc",
                  transition: "transform 0.2s, box-shadow 0.2s"
                }}
                onClick={() => handleSeleccionarPrincipal(foto)}
                className="hover-scale"
              >
                <img
                  src={foto.url}
                  alt={foto.name}
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
                {principal === foto.url && (
                  <div style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "#ff7f32",
                    color: "#fff",
                    fontSize: "12px",
                    padding: "2px 6px",
                    borderBottomLeftRadius: "5px"
                  }}>Principal</div>
                )}
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="success" onClick={handleGuardarCambios} disabled={guardando}>
            {guardando ? <Spinner animation="border" size="sm" /> : "Guardar cambios"}
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .hover-scale:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}

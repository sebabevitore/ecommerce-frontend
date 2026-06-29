import React, { useEffect, useState } from 'react';

const MiCuenta = () => {
  const [usuario, setUsuario] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');

    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const usuarioResponse = await fetch('http://localhost:8080/api/usuarios/me', {
          method: 'GET',
          headers: getAuthHeaders()
        });

        const pedidosResponse = await fetch('http://localhost:8080/api/pedidos', {
          method: 'GET',
          headers: getAuthHeaders()
        });

        if (!usuarioResponse.ok || !pedidosResponse.ok) {
          throw new Error('No se pudieron cargar los datos de la cuenta');
        }

        const usuarioData = await usuarioResponse.json();
        const pedidosData = await pedidosResponse.json();

        setUsuario(usuarioData);
        setPedidos(pedidosData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) {
    return <p style={{ padding: '2rem' }}>Cargando datos de usuario...</p>;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <h1>Mi cuenta</h1>
  
        <section style={{ marginBottom: '2rem' }}>
          <h2>Mis datos</h2>
          <p>No se pudieron cargar los datos del usuario.</p>
        </section>
  
        <section>
          <h2>Mis pedidos</h2>
          <p>No se pudieron cargar los pedidos del usuario.</p>
        </section>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Mi cuenta</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Mis datos</h2>

        {usuario ? (
          <div>
            <p><strong>Nombre:</strong> {usuario.nombre}</p>
            <p><strong>Apellido:</strong> {usuario.apellido}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
          </div>
        ) : (
          <p>No se encontraron datos del usuario.</p>
        )}
      </section>

      <section>
        <h2>Mis pedidos</h2>

        {pedidos.length === 0 ? (
          <p>No tenés pedidos realizados.</p>
        ) : (
          pedidos.map(pedido => (
            <div 
              key={pedido.id || pedido.id_pedido}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem'
              }}
            >
              <p><strong>Pedido:</strong> {pedido.id || pedido.id_pedido}</p>
              <p><strong>Fecha:</strong> {pedido.fecha || 'Sin fecha'}</p>
              <p><strong>Total:</strong> ${pedido.total}</p>
              <p><strong>Estado:</strong> {pedido.estado || 'Sin estado'}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default MiCuenta;
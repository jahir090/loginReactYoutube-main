import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Conversor from './Conversor'

function App() {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [usuarioRegistro, setUsuarioRegistro] = useState('')
  const [claveRegistro, setClaveRegistro] = useState('')
  const [logueado, setLogueado] = useState(false)
  const [usuarios, setUsuarios] = useState([])
  const [rol, setRol] = useState('')

  function cambiarUsuarioRegistro(evento) {
    setUsuarioRegistro(evento.target.value)
  }

  function cambiarClaveRegistro(evento) {
    setClaveRegistro(evento.target.value)
  }

  function cambiarUsuario(evento) {
    setUsuario(evento.target.value)
  }

  function cambiarClave(evento) {
    setClave(evento.target.value)
  }

  async function ingresar() {
    const peticion = await fetch('http://localhost:3000/login?usuario=' + usuario + '&clave=' + clave, { credentials: 'include' })
    if (peticion.ok) {
      const datos = await peticion.json();
      if (datos.rol == 'ADMINISTRADOR') {
        setRol('ADMINISTRADOR')
      } else {
        setRol('USUARIO')
      }
      setLogueado(true)
      obtenerUsuarios()
    } else {
      alert('Usuario o clave incorrectos')
    }
  }

  async function registro() {
    const peticion = await fetch('http://localhost:3000/registrar?usuario=' + usuarioRegistro + '&clave=' + claveRegistro, { credentials: 'include' })
    if (peticion.ok) {
      alert('Usuario registrado')
      setLogueado(true)
      obtenerUsuarios()
    } else {
      alert('No se pudo registrar el usuario')
    }
  }

  async function validar() {
    const peticion = await fetch('http://localhost:3000/validar', { credentials: 'include' })
    if (peticion.ok) {
      setLogueado(true)
      obtenerUsuarios()
    }
  }

  async function obtenerUsuarios() {
    const peticion = await fetch('http://localhost:3000/usuarios', { credentials: 'include' })
    if (peticion.ok) {
      setUsuarios((await peticion.json()))
    }
  }

  useEffect(() => {
    validar()
  }, [])

  async function eliminarUsuario(id) {
    const peticion = await fetch('http://localhost:3000/usuarios?id=' + id, { credentials: 'include', method: 'DELETE' })
    if (peticion.ok) {
      alert('Usuario eliminado')
      obtenerUsuarios()
    } else {
      alert('No se pudo eliminar el usuario')
    }
  }

  if (logueado) {

    return (<div>
      {rol == 'ADMINISTRADOR' ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => {
                return (
                  <tr key={usuario.id}>
                    <td>{usuario.usuario}</td>
                    <td>{usuario.nombre}</td>
                    <td>
                      <button onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <h1>Registro</h1>
          <input placeholder='Usuario' type="text" name="usuario" id="usuario" value={usuarioRegistro} onChange={cambiarUsuarioRegistro} />
          <input placeholder='Clave' type="password" name="clave" id="clave" value={claveRegistro} onChange={cambiarClaveRegistro} />
          <button onClick={registro}>Registrar</button>
        </>
      ) : null}
      
      <Conversor />
    </div>)
  }

  return (
    <>
      <h1>Inicio de sesión</h1>
      <input placeholder='Usuario' type="text" name="usuario" id="usuario" value={usuario} onChange={cambiarUsuario} />
      <input placeholder='Clave' type="password" name="clave" id="clave" value={clave} onChange={cambiarClave} />
      <button onClick={ingresar}>Ingresar</button>
    </>
  )
}

export default App

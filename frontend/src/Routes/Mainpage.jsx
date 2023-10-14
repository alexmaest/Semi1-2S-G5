import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Sidebar from "../Components/Sidebar";

const api = import.meta.env.VITE_API;

class MainPage extends Component {

  state = {
    publicaciones: [],
    idioma: 'es',
  };

  componentDidMount() {
    async function getPublicaciones() {
      try {
        const response = await fetch(api + "/publication/friendsPosts/1");
        const data = await response.json();
        this.setState({ publicaciones: data.data });
        console.log('Componente montado');
        console.log(data.data);
      } catch (error) {
        console.error('Error al cargar publicaciones:', error);
      }
    }

    getPublicaciones.call(this);
  }

  handleOptionChange = (event) => {
    this.setState({ idioma: event.target.value });
  };

  translate = async (index, descripcion) => {
    const idioma = this.state.idioma;
    if (idioma) {
      //alert(`Opción seleccionada: ${idioma} ${descripcion}`);
      
      const response = await fetch(api + "/translator/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: descripcion,
          language: idioma,
        }),
      });

      const traduccion = await response.json();

      console.log(traduccion);
      
      const nuevasPublicaciones = [...this.state.publicaciones];
      nuevasPublicaciones[index].descripcion = traduccion.data;
      this.setState({ publicaciones: nuevasPublicaciones });
    } else {
      alert('Por favor, selecciona una opción antes de hacer clic en el botón.');
    }
  };

  render() {
    return (
        <div className="publi-bg container-fluid d-flex">
            <Sidebar />
            <div className="container-fluid d-flex flex-column align-items-center publicacion-container">
              <div className="col-md-6">
                {this.state.publicaciones.map((publicacion, index) => (
                  <div key={index}>
                    <div className="publicacion">
                      <div className="container-fluid d-flex name-details">
                        {publicacion.nombre} {publicacion.apellido}
                      </div>
                      <div className="container-fluid d-flex">
                        <img src={publicacion.imagen} alt="" className="rounded mx-auto d-block img-fluid m-2"/>
                      </div>
                      <div className="container-fluid d-flex">
                        {publicacion.descripcion}
                      </div>
                      <div className="container-fluid d-flex">
                      <button className="traducir" onClick={() => this.translate(index, publicacion.descripcion)}>Traducir</button>
                        <select value={this.state.idioma} onChange={this.handleOptionChange} className="list-idioma">
                          <option value="" className="list-opcion">Selecciona una opción</option>
                          <option value="es" className="list-opcion">español</option>
                          <option value="fr" className="list-opcion">français</option>
                          <option value="en" className="list-opcion">english</option>
                          <option value="ja" className="list-opcion">日本語</option>
                        </select>
                      </div>
                      <div className="container-fluid d-flex text-right date-details">
                        {publicacion.fecha}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
    );
  }
}

export default MainPage;


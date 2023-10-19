import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Sidebar from "../Components/Sidebar";
import Comentarios from "../Components/Comentarios";
import { FaComment } from "react-icons/fa6";

const api = import.meta.env.VITE_API;
const user = '1';

class MainPage extends Component {

  state = {
    publicaciones: [],
    idioma: 'es',
    filtros: [{id: -1, nombre: 'Todo'}],
    filter_search: '',
    comments_window: [],
    label: true
  };

  componentDidMount() {
    async function getPublicaciones() {
      try {
        const response = await fetch(api + "/publication/friendsPosts/" + user + "/");
        const data = await response.json();
        this.setState({ publicaciones: data.data });
        this.setState({ comments_window: [] });
        const arreglo = [];
        for(var i = 0; i < data.data.length; i++) {
          arreglo.push(false);
        }
        this.setState({ comments_window: arreglo });
        console.log('Componente montado');
        console.log(data.data);
      } catch (error) {
        console.error('Error al cargar publicaciones:', error);
      }
    }

    async function getFiltros() {
      try {
        const response = await fetch(api + "/filter/");
        const data = await response.json();
        this.setState({ filtros: [{id: -1, nombre: 'Todo'}] });
        this.setState(prevState => ({
          filtros: [...prevState.filtros, ...data.data],
        }));
      } catch (error) {
        console.error('Error al cargar publicaciones:', error);
      }
    }

    getPublicaciones.call(this);
    getFiltros.call(this);
  }

  handleOptionChange = (event) => {
    this.setState({ idioma: event.target.value });
  };

  handleFilterChange = async (event) => {
    const opcion = event.target.value;
    if (opcion == -1) {
      try {
        const response = await fetch(api + "/publication/friendsPosts/" + user + "/");
        const data = await response.json();
        this.setState({ publicaciones: data.data });
        this.setState({ comments_window: [] });
        const arreglo = [];
        for(var i = 0; i < data.data.length; i++) {
          arreglo.push(false);
        }
        this.setState({ comments_window: arreglo });
      } catch (error) {
        console.error('Error al cargar publicaciones:', error);
      }
    }
    else if (opcion != '') {
      try {
        const response = await fetch(api + "/filter/friendsPosts/" + user + "/" + opcion + "/");
        const data = await response.json();
        this.setState({ publicaciones: data.data });
        this.setState({ comments_window: [] });
        const arreglo = [];
        for(var i = 0; i < data.data.length; i++) {
          arreglo.push(false);
        }
        this.setState({ comments_window: arreglo });
      } catch (error) {
        console.error('Error al cargar publicaciones:', error);
      }
    }
  };

  handleFormChange = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  };

  WordFilter = async () => {
    const palabra = this.state.filter_search
    if (palabra == '') {
      try {
        const response = await fetch(api + "/publication/friendsPosts/" + user + "/");
        const data = await response.json();
        this.setState({ publicaciones: data.data });
        this.setState({label: true});
      } catch (error) {
        console.error('Error al cargar publicaciones:', error);
      }
    }
    else {
      try {
        const response = await fetch(api + "/filter/search/" + palabra + "/");
        const data = await response.json();
        this.setState({ publicaciones: data.data });
        this.setState({label: false});
      } catch (error) {
        console.error('Error al cargar publicaciones:', error);
      }
    }
  };

  translate = async (index, descripcion) => {
    const idioma = this.state.idioma;
    if (descripcion != ''){
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
    }
  };

  showComments = (index) => {
    const arreglo = [...this.state.comments_window];
    arreglo[index] = !arreglo[index];
    this.setState({ comments_window: arreglo });
  }

  render() {
    return (
        <div className="publi-bg container-fluid d-flex">
            <Sidebar />
            <div className="container-fluid d-flex flex-column align-items-center publicacion-container">
              <div className="col-md-6">
                <div className="container-fluid d-flex filtros-container">
                  <input type="text" className="form-control" placeholder="Buscar etiquetas" id="filter_search" onChange={this.handleFormChange}/>
                  <button className="btn btn-primary" style={{ backgroundColor: '#7851A9', color: 'white', border: 'transparent'}} onClick={this.WordFilter}>Buscar</button>
                  <select onChange={this.handleFilterChange} className="list-filter">
                    {this.state.filtros.map((element, index) => (
                      <option key={index} value={element.id} className="list-opcion">
                        {element.nombre}
                      </option>
                    ))}
                  </select>
                </div>
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
                      {this.state.label &&
                        <div>
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
                          <div className="container-fluid d-flex text-right comentario">
                            <button className="ver-comentarios" onClick={() => this.showComments(index)}>
                              ver comentarios {" "} <FaComment />
                            </button>
                          </div>
                          <div className="container-fluid d-flex text-right comentario">
                            {this.state.comments_window[index] && <Comentarios id={publicacion.id} CloseComments={this.showComments} index={index}/>}
                          </div>  
                        </div>
                      }
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


import React, { Component } from "react";

const api = import.meta.env.VITE_API;
const user = '1';

class Comentarios extends Component {

    state = {
        comentarios: [],
        idioma: 'es',
        newComment: ''
      };

    componentDidMount() {
        async function getComentarios() {
            try {
              const response = await fetch(api + "/comment/post/" + this.props.id + "/");
              const data = await response.json();
              this.setState({ comentarios: data.data });
              //console.log('Comentarios obtenidos');
              //console.log(data.data);
            } catch (error) {
              console.error('Error al cargar comentarios:', error);
            }
          }

          getComentarios.call(this);
    }

    handleOptionChange = (event) => {
        this.setState({ idioma: event.target.value });
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
            
            const nuevosCommentarios = [...this.state.comentarios];
            nuevosCommentarios[index].contenido = traduccion.data;
            this.setState({ comentarios: nuevosCommentarios });
          } else {
            alert('Por favor, selecciona una opción antes de hacer clic en el botón.');
          }
        }
    };

    CloseComments = (index) => {
        this.props.CloseComments(index);
    }

    handleCommenthange = (event) => {
      const { id, value } = event.target;
      this.setState({ [id]: value });
    };

    CreateComment = async () => {
      const comment = this.state.newComment;

      if (comment != ''){
        const response = await fetch(api + "/comment/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: comment,
            id_user: user,
            id_post: this.props.id
          }),
        });

        const respuesta = await response.json();

        console.log(respuesta);
        
        try {
          const response = await fetch(api + "/comment/post/" + this.props.id + "/");
          const data = await response.json();
          this.setState({ comentarios: data.data });
        } catch (error) {
          console.error('Error al crear nuevo comentarios:', error);
        }
      }

      this.setState({ newComment: '' });
    };

    render() {
        const { id, CloseComments, index } = this.props;
      return (
        <div className="container-fluid">
            <div className="container-fluid d-flex comments-container">
              <input type="text" className="form-control" id="newComment" placeholder="Escribe un comentario" value={this.state.newComment} onChange={this.handleCommenthange}/>
              <button className="btn btn-primary" style={{ backgroundColor: '#7851A9', color: 'white', border: 'transparent'}} onClick={this.CreateComment}>Publicar</button>
            </div>
            <div className="container-fluid d-flex">
                <button className="ocultar-comentarios" onClick={() => this.CloseComments(index)}>ocultar comentarios</button>
            </div>
            <div className="container-fluid comments-container">
                {this.state.comentarios.map((comentario, index) => (
                    <div key={index}>
                        <div className="cuadro-comentario">
                            <div className="container-fluid d-flex name-details">
                                {comentario.nombre} {comentario.apellido}
                            </div>
                            <div className="container-fluid d-flex">
                                {comentario.contenido}
                            </div>
                            <div className="container-fluid d-flex">
                                <button className="traducir" onClick={() => this.translate(index, comentario.contenido)}>Traducir</button>
                                <select value={this.state.idioma} onChange={this.handleOptionChange} className="list-idioma">
                                    <option value="" className="list-opcion">Selecciona una opción</option>
                                    <option value="es" className="list-opcion">español</option>
                                    <option value="fr" className="list-opcion">français</option>
                                    <option value="en" className="list-opcion">english</option>
                                    <option value="ja" className="list-opcion">日本語</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      );
    }
  }
  
  export default Comentarios;
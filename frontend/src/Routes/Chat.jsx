import React, { Component } from "react";
import Sidebar from "../Components/Sidebar";
import { PiChatTeardropDotsBold } from "react-icons/pi";


const api = import.meta.env.VITE_API;
const user = sessionStorage.getItem('id');
const token = sessionStorage.getItem('token');

class Chat extends Component {

    state = {
        usuarios: []
    };

    componentDidMount() {
        if (token == null || token == '') {
            alert('No has iniciado sesión')
            window.location.href = "/";
        }

        async function getData() {
            //usuarios amigos
            try {
              const response = await fetch(api + "/user/friends/added/" + user);
              const data = await response.json();
              this.setState({ usuarios: data.friends });
            } catch (error) {
              console.error('Error al cargar amigos:', error);
            }

          }

          getData.call(this);
    }

    UpdateData = async () => {
        //usuarios amigos
        try {
            const response = await fetch(api + "/user/friends/added/" + user);
            const data = await response.json();
            this.setState({ usuarios: data.friends });
        } catch (error) {
            console.error('Error al cargar amigos:', error);
        }
    }

    render() {
        return (
            <div className="publi-bg container-fluid d-flex">
                <Sidebar />
                <div className="container-fluid d-flex flex-column publicacion-container">
                    <div className="col-md-6">
                        <div className="container-fluid filtros-container">
                            <div className="titulo-seccion">
                                Amigos
                            </div>
                            {this.state.usuarios && this.state.usuarios.length > 0 ? (
                                <div>
                                    {this.state.usuarios.map((user, index) => (
                                        <div key={index}>
                                            <div className="solicitud d-flex">
                                                <div className="d-flex foto-solicitud">
                                                    <img src={user.profilePhoto} alt="Foto de Perfil" className="rounded d-block img-fluid m-2"/>
                                                </div>
                                                <div className="container-fluid d-flex nombre-solicitud">
                                                    {user.firstname} {user.lastname}
                                                </div>
                                                <div className="d-flex nombre-solicitud">
                                                    <button className="btn btn-primary" style={{ backgroundColor: 'transparent', color: 'white', border: 'transparent', fontSize: 'x-large'}}><PiChatTeardropDotsBold/></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="alter-seccion"> Sin amigos que mostrar...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;
    
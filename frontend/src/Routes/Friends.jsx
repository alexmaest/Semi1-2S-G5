import React, { Component } from "react";
import Sidebar from "../Components/Sidebar";
import { AiOutlineUserAdd, AiOutlineUserDelete, AiFillDelete } from "react-icons/ai";
import { FaCheck } from "react-icons/fa6";


const api = import.meta.env.VITE_API;
const user = '30';

class Friends extends Component {

    state = {
        usuarios: [],
        enviadas: [],
        recibidas: []
    };

    componentDidMount() {
        async function getData() {
            //usuarios no amigos
            try {
              const response = await fetch(api + "/user/friends/notAdded/" + user);
              const data = await response.json();
              this.setState({ usuarios: data.notFriends });
            } catch (error) {
              console.error('Error al cargar no amigos:', error);
            }

            //solicitudes enviadas
            try {
                const ressend = await fetch(api + "/user/requests/sent/" + user);
                const datasend = await ressend.json();
                this.setState({ enviadas: datasend.requests });
            } catch (error) {
                console.error('Error al cargar no amigos:', error);
            }

            //solicitudes recibidas
            try {
                const rereceived = await fetch(api + "/user/requests/received/" + user);
                const datareceived = await rereceived.json();
                this.setState({ recibidas: datareceived.requests });
            } catch (error) {
                console.error('Error al cargar no amigos:', error);
            }

          }

          getData.call(this);
    }

    UpdateData = async () => {
        //usuarios no amigos
        try {
            const response = await fetch(api + "/user/friends/notAdded/" + user);
            const data = await response.json();
            this.setState({ usuarios: data.notFriends });
        } catch (error) {
        console.error('Error al cargar no amigos:', error);
        }

        //solicitudes enviadas
        try {
            const ressend = await fetch(api + "/user/requests/sent/" + user);
            const datasend = await ressend.json();
            this.setState({ enviadas: datasend.requests });
        } catch (error) {
            console.error('Error al cargar no amigos:', error);
        }

        //solicitudes recibidas
        try {
            const rereceived = await fetch(api + "/user/requests/received/" + user);
            const datareceived = await rereceived.json();
            this.setState({ recibidas: datareceived.requests });
        } catch (error) {
            console.error('Error al cargar no amigos:', error);
        }
    }

    SendRequest = async (idamigo) => {
        try {
            const response = await fetch(api + "/user/request/send", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user,
                    friendId: idamigo,
                }),
            });

            const resultado = await response.json();

            alert('Solicitud de amistad enviada');

            this.UpdateData();
        
        } catch (error) {
            alert('Error al enviar la solicitud de amistad:');
            console.error('Error al enviar la solicitud de amistad:', error);
        }
      };

    AcceptRequest = async (idsolicitud) => {
        try {
            const response = await fetch(api + "/user/request/accepted/" + idsolicitud, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                }
            });

            if(response.ok){
                alert('Solicitud de amistad aceptada');
            }
            else{
                alert('Error al aceptar la solicitud de amistad');
            }

            this.UpdateData();
        
        } catch (error) {
            alert('Error al aceptar la solicitud de amistad:');
            console.error('Error al aceptar la solicitud de amistad:', error);
        }
    }

    DenyRequest = async (idsolicitud) => {
        try {
            const response = await fetch(api + "/user/request/denied/" + idsolicitud, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                }
            });

            if(response.ok){
                alert('Solicitud de amistad rechazada');
            }
            else{
                alert('Error al rechazar la solicitud de amistad');
            }

            this.UpdateData();
        
        } catch (error) {
            alert('Error al rechazar la solicitud de amistad:');
            console.error('Error al rechazar la solicitud de amistad:', error);
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
                                Solicitudes de amistad enviadas
                            </div>
                            {this.state.enviadas && this.state.enviadas.length > 0 ? (
                                <div>
                                    {this.state.enviadas.map((user, index) => (
                                        <div key={index}>
                                            <div className="solicitud d-flex">
                                                <div className="d-flex foto-solicitud">
                                                    <img src={user.profilePhoto} alt="Foto de Perfil" className="rounded d-block img-fluid m-2"/>
                                                </div>
                                                <div className="container-fluid d-flex nombre-solicitud">
                                                    {user.firstname} {user.lastname}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="alter-seccion"> Sin solicitudes que mostrar...</div>
                            )}
                            <div className="titulo-seccion">
                                Solicitudes de amistad pendientes
                            </div>
                            {this.state.recibidas && this.state.recibidas.length > 0 ? (
                                <div>
                                    {this.state.recibidas.map((user, index) => (
                                        <div key={index}>
                                            <div className="solicitud d-flex">
                                                <div className="d-flex foto-solicitud">
                                                    <img src={user.profilePhoto} alt="Foto de Perfil" className="rounded d-block img-fluid m-2"/>
                                                </div>
                                                <div className="container-fluid d-flex nombre-solicitud">
                                                    {user.firstname} {user.lastname}
                                                </div>
                                                <div className="d-flex nombre-solicitud">
                                                    <button className="btn btn-primary" style={{ backgroundColor: '#03BB85', color: 'white', border: 'transparent'}} onClick={() => this.AcceptRequest(user.id)} ><FaCheck/></button>
                                                    <button className="btn btn-primary" style={{ backgroundColor: '#800020', color: 'white', border: 'transparent', marginLeft: '15px'}} onClick={() => this.DenyRequest(user.id)}><AiFillDelete/></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="alter-seccion"> Sin solicitudes que mostrar...</div>
                            )}
                            <div className="titulo-seccion">
                                Agregar amigos
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
                                                    <button className="btn btn-primary" style={{ backgroundColor: '#7851A9', color: 'white', border: 'transparent'}} onClick={() => this.SendRequest(user.id)}><AiOutlineUserAdd/></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="alter-seccion"> Sin usuarios que mostrar...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Friends;
    
import React, { Component } from "react";
import Sidebar from "../Components/Sidebar";
import { PiChatTeardropDotsBold } from "react-icons/pi";
import { sendMessage, getMessagesBetweenUsers } from "../Handler/interfaceChat";
import "../Styles/chat.css";

const api = import.meta.env.VITE_API;
const user = sessionStorage.getItem('id');
const token = sessionStorage.getItem('token');

class Chat extends Component {
    state = {
        usuarios: [],
        selectedUser: null,
        message: "", // Estado para almacenar el mensaje
    };

    componentDidMount() {
        if (token == null || token === '') {
            alert('No has iniciado sesión');
            window.location.href = "/";
        }

        this.UpdateData();
    }

    UpdateData = async () => {
        // Usuarios amigos
        try {
            const response = await fetch(api + "/user/friends/added/" + user);
            const data = await response.json();
            this.setState({ usuarios: data.friends });
        } catch (error) {
            console.error('Error al cargar amigos:', error);
        }
    }

    handleChatOpen = (user) => {
        this.setState({ selectedUser: user });
    }

    handleMessageChange = (event) => {
        this.setState({ message: event.target.value });
    }

    sendMessage = () => {
        const { message, selectedUser } = this.state;
        if (message && selectedUser) {
            sendMessage(user, selectedUser.id, message);
            this.setState({ message: "" });
        }
    }

    render() {
        return (
            <div className="publi-bg container-fluid d-flex">
                <Sidebar />
                <div className="container-fluid d-flex flex-column publicacion-container">
                    <div className="col-md-6">
                        <div className="container-fluid filtros-container">
                            <div className="titulo-seccion">Amigos</div>
                            {this.state.usuarios && this.state.usuarios.length > 0 ? (
                                <div>
                                    {this.state.usuarios.map((friend, index) => (
                                        <div key={index}>
                                            <div className="solicitud d-flex">
                                                <div className="d-flex foto-solicitud">
                                                    <img src={friend.profilePhoto} alt="Foto de Perfil" className="rounded d-block img-fluid m-2" />
                                                </div>
                                                <div className="container-fluid d-flex nombre-solicitud">
                                                    {friend.firstname} {friend.lastname}
                                                </div>
                                                <div className="d-flex nombre-solicitud">
                                                    <button className="btn btn-primary" style={{ backgroundColor: 'transparent', color: 'white', border: 'transparent', fontSize: 'x-large' }} onClick={() => this.handleChatOpen(friend)}>
                                                        <PiChatTeardropDotsBold />
                                                    </button>
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

                {this.state.selectedUser && (
                    <div className="chat-container">
                        <div className="chat-header">
                            <strong>{this.state.selectedUser.firstname} {this.state.selectedUser.lastname}</strong>
                        </div>
                        <div className="chat-messages">
                        {getMessagesBetweenUsers(user, this.state.selectedUser.id).map((message, index) => (
                            <div key={index} className={`chat-message ${message.senderId === user ? 'own-message' : 'received-message'}`}>
                                <div className="message-text">
                                    {message.message}
                                </div>
                                <div className="message-timestamp">
                                    {message.timestamp}
                                </div>
                            </div>
                        ))}
                        </div>
                        <div className="chat-input">
                            <input
                                type="text"
                                value={this.state.message}
                                onChange={this.handleMessageChange}
                                placeholder="Escribe un mensaje"
                            />
                            <button onClick={this.sendMessage}>Enviar</button>
                        </div>
                        <button
                            style={{ float: "right", background: "none", border: "none", cursor: "pointer" }}
                            onClick={() => this.setState({ selectedUser: null })}
                        >
                            Cerrar
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default Chat;

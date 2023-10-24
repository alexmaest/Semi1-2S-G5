import React, { Component } from "react";
import Sidebar from "../Components/Sidebar";


const api = import.meta.env.VITE_API;
const user = sessionStorage.getItem('id');
const token = sessionStorage.getItem('token');

class Bot extends Component {

    state = {
        inputMessage: '',
        chatMessages: []
    };

    componentDidMount() {
        if (token == null || token == '') {
            alert('No has iniciado sesión')
            window.location.href = "/";
        }      
    }

    sendMessage = async () => {
        const entrada = this.state.inputMessage;
        const registro = this.state.chatMessages;
        if (entrada !== '') {
            var botresponse = '';
            try {
                const response = await fetch(api + "/user/message", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: entrada
                    }),
                });
                const data = await response.json();
                botresponse = data.response
              } catch (error) {
                console.error('Error al cargar bot:', error);
              }

            this.setState({ chatMessages: [...registro, { text: entrada }, {text: botresponse}] });
        }

        this.setState({ inputMessage: '' });
    }

    renderMessages = () => {
        return this.state.chatMessages.map((message, index) => (
          <div key={index} className={`message ${index % 2 === 0 ? 'bot-solicitud' : 'bot-respuesta'}`}>
            {message.text}
          </div>
        ));
      }

    render() {
        return (
            <div className="publi-bg container-fluid d-flex">
                <Sidebar />
                <div className="container-fluid d-flex flex-column align-items-center">
                    <div className="container-fluid titulo-seccion">
                            ChatBot
                    </div>
                    <div className="container-fluid chat-general-container">
                        <div>
                            <div className="chat-messages">{this.renderMessages()}</div>
                        </div>
                    </div>
                    <div className="container-fluid ask-bar chat-field d-flex">
                        <input type="text" className="form-control" value={this.state.inputMessage} placeholder="Hola, escribe un mensaje" onChange={(e) => this.setState({ inputMessage: e.target.value })}/>
                        <button className="btn btn-primary esquina" style={{ backgroundColor: '#3c0068', color: 'white', border: 'transparent'}} onClick={this.sendMessage}>Enviar</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Bot;
    
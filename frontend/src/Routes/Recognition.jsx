import React, { Component } from "react";
import Brandvar from "../Components/Brandvar";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
import Webcam from "react-webcam";

const api = import.meta.env.VITE_API;

const videoConstraints = {
    width: '85%',
    height: '85%',
    facingMode: "user"
};

class Recognition extends Component {
  state = {
    email: "",
    image: "",
    camera: false
  };

  webcamRef = React.createRef();
  picture = this.capture.bind(this);

  capture() {
    const imageSrc = this.webcamRef.current.getScreenshot();
    this.setState({ image: imageSrc });
    //console.log(imageSrc);
  }

  handleChange = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada
    const { email, image } = this.state;

    try {
      const response = await fetch(api + "/login/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          imageLoggingBase64: image,
        }),
      });

      

      if (response.ok) {

        const data = await response.json();

        alert("Todo OK");
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("id", data.id_User);
        window.location.href = "/inicio";

      } else {
        alert("Error en el inicio de sesión, revisa los campos");
      }

    } catch (error) {
      console.error('Error al logearse con imagen', error);
    }

    console.log("Hola el correo es");
    console.log(email);
    console.log("Hola la imagen es");
    console.log(image);
  };

  ActivarCamara = () => {
    const estado = this.state.camera;
    this.setState({ camera: !estado });
  }

  render() {
    const { image } = this.state;

    return (
      <div className="maincointainer2 bglogin">
        <Brandvar />
        <div className="logincointainer2 container-fluid d-flex align-items-center">
          <div className="col-md-4 offset-md-4 p-5 mainlogin">
            <h2 className="text-center mb-4 tipografia1">Iniciar Sesión</h2>
            <div className="tipografia2">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Correo
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  onChange={this.handleChange}
                />
              </div>
              <div className="mb-3">
                
              {this.state.camera && <div className="webcam-container">
                    <div className="text-center">

                    {image === '' ? (
                        <Webcam
                        audio={false}
                        height={'85%'}
                        ref={this.webcamRef}
                        screenshotFormat="image/jpeg"
                        width={'85%'}
                        videoConstraints={videoConstraints}
                        />
                    ) : (
                        <img src={image} alt="Captured" />
                    )}
                    </div>
                    <div>
                        {image != '' ?
                            <button className="btn btn-primary w-100 morado" style={{ backgroundColor: '#7851A9', color: 'white' }} onClick={(e) => {
                                e.preventDefault();
                                this.setState({ image: '' });
                            }}>
                                Tomar de nuevo</button> :
                            <button className="btn btn-primary w-100 morado" style={{ backgroundColor: '#7851A9', color: 'white' }} onClick={(e) => {
                                e.preventDefault();
                                this.capture();
                            }}>Capturar</button>
                        }
                    </div>
                </div>}
                <button className="btn btn-primary w-100" style={{ backgroundColor: '#7851A9', color: 'white', border: 'transparent', marginTop:'10px'}} onClick={this.ActivarCamara}>Activar Camara</button>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                style={{ background: "#003d7a" }}
                onClick={this.handleSubmit}
              >
                Ingresar
              </button>
            </div>
            <p className="text-center mt-3">
              <Link to={"/login"} style={{ color: "#8E24AA" }}>
                Credenciales
              </Link>
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Recognition;

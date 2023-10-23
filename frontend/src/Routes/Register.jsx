import React, { Component } from "react";
import Brandvar from "../Components/Brandvar";
import Webcam from "react-webcam";

const api = import.meta.env.VITE_API;

const videoConstraints = {
  width: '85%',
  height: '85%',
  facingMode: "user"
};

class Register extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dpi: "",
    profilePhoto: "",
    camara: false,
    mensaje: 'Activar Camara'
  };

  //webcam
  webcamRef = React.createRef();
  picture = this.capture.bind(this);

  capture() {
    const imageSrc = this.webcamRef.current.getScreenshot();
    this.setState({ profilePhoto: imageSrc });
  }

  //Manejar los campos de datos y fecha
  handleChange = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  };

  //Manejar la imagen
  handleImageChange = (event) => {
    const imageFile = event.target.files[0];

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ profilePhoto: e.target.result });
      };
      reader.readAsDataURL(imageFile);
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada

    const { firstName, lastName, email, password, dpi, profilePhoto } = this.state;

    /* console.log("Nombre:", firstName);
    console.log("Apellido:", lastName);
    console.log("Correo:", email);
    console.log("DPI", dpi);
    console.log("Imagen:", profilePhoto); */

    let url = api + "/register";

    const registerdata = {
      firstName,
      lastName,
      email,
      password,
      dpi,
      profilePhoto,
    };

    //Fetch para enviar la información

    try {
      const solicitud = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerdata),
      });
      if (solicitud.ok) {
        try {
          const success = await solicitud.json();
          alert(success.message);
          window.location.href = "/login";
        } catch (error) {
          alert("Error - login correcto");
        }
      } else {
        try {
          const errorresponse = await solicitud.json();
          alert(errorresponse.message);
        } catch (error) {
          alert("Error obtener la respuesta");
        }
      }
    } catch (error) {
      alert("Error en el registro, revisa los campos");
    }
  };

  ActivarCamara = () => {
    const estado = this.state.camara;
    this.setState({ camara: !estado });
    this.setState({ profilePhoto: '' });

    if (!estado) {
      this.setState({ mensaje: 'Subir imagen' });
    }else{
      this.setState({ mensaje: 'Activar Camara' });
    }
  }

  render() {
    const profilePhoto = this.state.profilePhoto;

    return (
      <div className="maincointainer bgregister">
        <Brandvar />
        <div className="registercointainer container-fluid d-flex justify-content-between align-items-center">
          <div className="col-md-4 offset-md-4 p-5 mainlogin">
            <h2 className="text-center mb-4 tipografia1">Registrase</h2>
            <div className="tipografia2">
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  Nombre
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  onChange={this.handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">
                  Apellido
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  onChange={this.handleChange}
                />
              </div>
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
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  onChange={this.handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="dpi" className="form-label">
                  DPI
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="dpi"
                  onChange={this.handleChange}
                />
              </div>
              <div className="mb-3">
                <div className="form-label">
                  Foto de Perfil
                </div>
                <button className="btn btn-primary w-100" style={{ backgroundColor: '#7851A9', color: 'white', border: 'transparent', marginBottom:'10px'}} onClick={this.ActivarCamara}>{this.state.mensaje}</button>
                
                {!this.state.camara && <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={this.handleImageChange}
                />}

                {this.state.camara && <div className="webcam-container">
                    <div className="text-center">

                    {profilePhoto === '' ? (
                        <Webcam
                        audio={false}
                        height={'85%'}
                        ref={this.webcamRef}
                        screenshotFormat="image/jpeg"
                        width={'85%'}
                        videoConstraints={videoConstraints}
                        />
                    ) : (
                        <img src={profilePhoto} alt="Captured" />
                    )}
                    </div>
                    <div>
                        {profilePhoto != '' ?
                            <button className="btn btn-primary w-100 morado" style={{ backgroundColor: '#7851A9', color: 'white' }} onClick={(e) => {
                                e.preventDefault();
                                this.setState({ profilePhoto: '' });
                            }}>
                                Tomar de nuevo</button> :
                            <button className="btn btn-primary w-100 morado" style={{ backgroundColor: '#7851A9', color: 'white' }} onClick={(e) => {
                                e.preventDefault();
                                this.capture();
                            }}>Capturar</button>
                        }
                    </div>
                </div>}

              </div>
              {(this.state.profilePhoto && !this.state.camara) && <div className="mb-3 center-img">
                <img
                  src={this.state.profilePhoto}
                  alt="Vista previa de la imagen"
                  style={{ maxWidth: '100%', maxHeight: '200px'}}
                />
              </div>}
              <button type="submit" className="btn btn-primary w-100" style={{ background: "#8E24AA" }} onClick={this.handleSubmit}> Registrarse </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;

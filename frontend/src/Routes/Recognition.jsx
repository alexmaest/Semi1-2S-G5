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
    password: "",
    image: "",
  };

  webcamRef = React.createRef();
  picture = this.capture.bind(this);

  capture() {
    const imageSrc = this.webcamRef.current.getScreenshot();
    this.setState({ image: imageSrc });
    console.log(imageSrc);
  }

  handleSubmit = async (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada
    console.log("Hola la imagen es");
    console.log(this.state.image);
  };

  render() {
    const { image } = this.state;

    return (
      <div className="maincointainer bglogin">
        <Brandvar />
        <div className="logincointainer container-fluid d-flex justify-content-between align-items-center">
          <div className="col-md-4 offset-md-4 p-5 mainlogin">
            <h2 className="text-center mb-4 tipografia1">Iniciar Sesión</h2>
            <form className="tipografia2" onSubmit={this.handleSubmit}>
              <div className="mb-3">
                
              <div className="webcam-container">
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
                </div>


              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                style={{ background: "#003d7a" }}
              >
                Ingresar
              </button>
            </form>
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

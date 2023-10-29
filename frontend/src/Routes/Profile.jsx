import React, { Component } from "react";
import Sidebar from "../Components/Sidebar";
import { AiFillSetting } from "react-icons/ai";


const api = import.meta.env.VITE_API;
const user = sessionStorage.getItem('id');
const token = sessionStorage.getItem('token');

class Profile extends Component {

    state = {
        usuario: [],
        edit: false,
        newImage: '',
        newName: '',
        newLastname: '',
        newDPI: '',
        newEmail: '',
        newPassword: '',
        checkPassword: ''
    };

    componentDidMount() {
        if (token == null || token == '') {
            alert('No has iniciado sesión')
            window.location.href = "/";
        }

        async function getData() {
            //perfil
            try {
              const response = await fetch(api + "/user/id/" + user);
              const data = await response.json();
              this.setState({ usuario: data.user });
              console.log(this.state.usuario);
            } catch (error) {
              console.error('Error al cargar perfil:', error);
            }

          }

          getData.call(this);
    }

    UpdateData = async () => {
        //perfil
        try {
            const response = await fetch(api + "/user/id/" + user);
            const data = await response.json();
            this.setState({ usuario: data.user });
          } catch (error) {
            console.error('Error al cargar perfil:', error);
          }
    }

    EnableEdit = () => {
        const contario = !this.state.edit;
        this.setState({ edit: contario });
        this.setState({ newImage: '' });
        this.setState({ newName: '' });
        this.setState({ newLastname: '' });
        this.setState({ newDPI: '' });
        this.setState({ newEmail: '' });
        this.setState({ newPassword: '' });
        this.setState({ checkPassword: '' });
    }

    handleImageChange = (event) => {
        const imageFile = event.target.files[0];
    
        if (imageFile) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.setState({ newImage: e.target.result });
          };
          reader.readAsDataURL(imageFile);
        }
    };

    handleFormChange = (event) => {
        const { id, value } = event.target;
        this.setState({ [id]: value });
    };

    UpdateProfile = async () => {
        const antigua = this.state.usuario.psw;
        const revisar = this.state.checkPassword;
        const nombre_antiguo = this.state.usuario.nombre;
        const apellido_antiguo = this.state.usuario.apellido;
        const dpi_antiguo = this.state.usuario.dpi;
        const correo_antiguo = this.state.usuario.correo;
        const foto_antigua = this.state.usuario.foto;

        try {
            const solicitud = await fetch(api + "/login/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                email: correo_antiguo,
                password: revisar,
              }),
            });
      
            if (solicitud.ok) {
              //revisar que el nuevo valor no este vacio de lo contrario usar el anterior
            var nombre = '';
            var apellido = '';
            var dpi = '';
            var correo = '';
            var newpassword = '';
            var foto = '';
            
            if(this.state.newName == ''){
                nombre = nombre_antiguo;
            }else{
                nombre = this.state.newName;
            }

            if(this.state.newLastname == ''){
                apellido = apellido_antiguo;
            }else{
                apellido = this.state.newLastname;
            }

            if(this.state.newDPI == ''){
                dpi = dpi_antiguo;
            }else{
                dpi = this.state.newDPI;
            }

            if(this.state.newEmail == ''){
                correo = correo_antiguo;
            }else{
                correo = this.state.newEmail;
            }

            if(this.state.newPassword == ''){
                newpassword = antigua;
            }else{
                newpassword = this.state.newPassword;
            }

            if(this.state.newImage == ''){
                foto = foto_antigua;
            }else{
                foto = this.state.newImage;
            }

            console.log('nuevo');
            console.log(nombre);
            console.log(apellido);
            console.log(dpi);
            console.log(correo);
            console.log(newpassword);
            console.log(foto);
      
            } else {
              alert("Error en modificar perfil, revisa los campos");
            }
          } catch (error) {
            alert("Error en modificar perfil, revisa los campos");
          }
    }

    render() {
        return (
            <div className="publi-bg container-fluid d-flex">
                <Sidebar />
                <div className="container-fluid d-flex flex-column align-items-center profile-container">
                    <div className="col-md-6">
                        <div className="container-fluid">
                            <div>
                                {this.state.usuario ? (
                                    <div className="profile">
                                        <div>
                                            <button className="btn btn-primary esquina" style={{ backgroundColor: '#000000', color: 'white', border: 'transparent'}} onClick={this.EnableEdit}><AiFillSetting/></button>
                                        </div>
                                        <div className="container-fluid profile-foto">
                                            <img src={this.state.usuario.foto} alt="Foto de Perfil" className="rounded d-block img-fluid"/>
                                            {this.state.edit && <div style={{marginTop: '10px'}}>
                                                <input
                                                type="file"
                                                className="form-control"
                                                id="newImage"
                                                accept="image/*"
                                                onChange={this.handleImageChange}
                                                />
                                            </div>
                                            }{
                                            this.state.newImage && <div className="mb-3 center-img" style={{marginTop: '10px'}}>
                                                <img
                                                src={this.state.newImage}
                                                alt="Vista previa de la imagen"
                                                style={{ maxWidth: '100%', maxHeight: '200px'}}
                                                />
                                            </div>
                                            }
                                        </div>
                                        <div className="container-fluid d-flex nombre-solicitud">
                                            {this.state.usuario.nombre} {this.state.usuario.apellido}
                                        </div>
                                        {this.state.edit && <div className="form-field d-flex">
                                            <input type="text" className="form-control" id="newName" placeholder="Nuevo nombre" onChange={this.handleFormChange}/>
                                            <input type="text" className="form-control" id="newLastname" placeholder="Nuevo apellido" onChange={this.handleFormChange}/>
                                        </div>}
                                        <div className="container-fluid d-flex nombre-solicitud">
                                            {this.state.usuario.dpi}
                                        </div>
                                        {this.state.edit && <div className="form-field">
                                            <input type="text" className="form-control" id="newDPI" placeholder="Editar DPI" onChange={this.handleFormChange}/>
                                        </div>}
                                        <div className="container-fluid d-flex nombre-solicitud">
                                            {this.state.usuario.correo}
                                        </div>
                                        {this.state.edit && <div className="form-field">
                                            <input type="password" className="form-control" id="checkPassword" placeholder="Contraseña anterior" style={{marginTop: '10px'}} onChange={this.handleFormChange}/>
                                            <div className="center-img" style={{marginTop: '10px'}}>
                                                <button className="btn btn-primary esquina" style={{ backgroundColor: '#3c0068', color: 'white', border: 'transparent'}} onClick={this.UpdateProfile}>Actualizar</button>
                                                <button className="btn btn-primary" style={{ backgroundColor: '#800020', color: 'white', border: 'transparent'}} onClick={this.EnableEdit}>Cancelar</button>
                                            </div>
                                        </div>}
                                        
                                        
                                    </div>
                                ) : (
                                    <div className="alter-seccion"> Yo no debería de aparecer F</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;
    
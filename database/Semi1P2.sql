drop database if exists Semi1;
create database Semi1;
use Semi1;

create table USUARIO(
id int primary key auto_increment,
nombre varchar(50),
apellido varchar(50),
dpi varchar(100),
correo varchar(100),
psw varchar(100),
foto varchar(100),
UNIQUE (Correo)
);

create table AMIGO(
id int primary key auto_increment,
id_usuario int,
id_amigo int,
foreign key (id_usuario) references USUARIO(id),
foreign key (id_amigo) references USUARIO(id)
);

create table SOLICITUD(
id int primary key auto_increment,
id_usuario int,
id_amigo int,
foreign key (id_usuario) references USUARIO(id),
foreign key (id_amigo) references USUARIO(id)
);

create table PUBLICACION(
id int primary key auto_increment,
descripcion varchar(250),
imagen varchar(100),
fecha varchar(100),
id_usuario int,
foreign key (id_usuario) references USUARIO(id)
);

create table COMENTARIO(
id int primary key auto_increment,
contenido varchar(250),
id_usuario int,
id_publicacion int,
foreign key (id_publicacion) references PUBLICACION(id),
foreign key (id_usuario) references USUARIO(id)
);

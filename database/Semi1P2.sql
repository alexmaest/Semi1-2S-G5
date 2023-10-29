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
fecha datetime,
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

create table FILTRO(
id int primary key auto_increment,
nombre varchar(50) unique
);

create table PUBLICACION_FILTRO(
id int primary key auto_increment,
id_publicacion int, 
id_filtro int,
foreign key (id_publicacion) references PUBLICACION(id),
foreign key (id_filtro) references FILTRO(id)
);

DROP FUNCTION IF EXISTS InsertarPublicacion;

DELIMITER //
CREATE FUNCTION InsertarPublicacion (descripcion varchar(250), imagen varchar(100), fecha varchar(100), id_usuario int) RETURNS INT DETERMINISTIC
BEGIN
    -- Inserta la publicacion
    INSERT INTO PUBLICACION (descripcion, imagen, fecha, id_usuario) VALUES (descripcion, imagen, fecha, id_usuario);
    RETURN LAST_INSERT_ID();
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS InsertarFiltro;

DELIMITER //
CREATE PROCEDURE InsertarFiltro (nombre_param VARCHAR(50), id_param INT) 
BEGIN
    DECLARE filtro_id INT;
    
    -- Buscar si el filtro ya existe
    SELECT id INTO filtro_id FROM FILTRO WHERE nombre = nombre_param;
    
    -- Si no existe, insertar el nuevo filtro
    IF filtro_id IS NULL THEN
        INSERT INTO FILTRO (nombre) VALUES (nombre_param);
        SET filtro_id = LAST_INSERT_ID();
    END IF;
    
    INSERT INTO PUBLICACION_FILTRO (id_publicacion, id_filtro) VALUES (id_param, filtro_id);	
END //
DELIMITER ;
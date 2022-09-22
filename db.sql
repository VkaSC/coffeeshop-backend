drop database if exists db_IESCoffeShop; 
create database  if not exists db_IESCoffeShop;
use db_IESCoffeShop;

create table if not exists user(
    id int unsigned primary key auto_increment,
    name varchar(100) not null,
    lastName varchar (150) not null,
    type enum("Admin", "Cliente") not null,
    email varchar (150) unique not null,
    active boolean default false,
    password varchar(150) not null
) character set = 'utf8';

create table if not exists auth(
    id int unsigned primary key auto_increment,
    token varchar(255) not null,
    userId int unsigned not null,
    active boolean default true,
    remember boolean default false
) character set = 'utf8';

create table if not exists product(
    id int unsigned primary key auto_increment,
    name varchar(100) not null,
    type enum("Grupo 1","Grupo 2", "Grupo 3" ) not null,
    category enum("Cafe", "Desayunos", "Refrescos", "Bocadillos") not null,
    details varchar(255),
    price decimal(6,2)
) character set = 'utf8';

create table if not exists app(
    id int unsigned primary key auto_increment,
    name varchar(100) not null,
    token varchar(255) unique,
    secret varchar(100) unique,
    scope enum("ReadOnly", "FullAccess"),
    active boolean not null default false,
    blocked boolean not null default false

) character set = 'utf8';

create table if not exists request(
    id int unsigned primary key auto_increment,
    device varchar(100),
    date bigint not null,
    userId int unsigned,
    total int unsigned,
    foreign key (userId) references user (id) on update cascade on delete restrict
) character set = 'utf8';

create table if not exists allergen(
    id int unsigned primary key auto_increment,
    name varchar(100) not null,
    icon varchar(255),
    details varchar(255)
) character set = 'utf8';

create table if not exists product_allergens(
    id int unsigned primary key auto_increment,
    productId int unsigned not null,
    allergenId int unsigned not null,
    foreign key (productId) references product (id) on update cascade on delete restrict,
    foreign key (allergenId) references allergen (id) on update cascade on delete restrict    
)character set = 'utf8';

create table if not exists request_line(
    id int unsigned primary key auto_increment,
    productId int unsigned not null,
    requestId int unsigned not null,
    quantity int unsigned not null,
    total int unsigned,
    foreign key (productId) references product (id) on update cascade on delete restrict,
    foreign key (requestId) references request (id) on update cascade on delete restrict    
)character set = 'utf8';

insert into app (name, scope, token) values ('SUSI', 'FullAccess', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYXBwLXRva2VuIiwiaWF0IjoxNjYzMzYzNzc0LCJleHAiOjE2NjM0NTAxNzR9.fBQ0DZca6y107WLWJgHQgxrmgA7iu_D535pNjkd5zi0');

insert into product (name, type, category, details, price) values ('Café Solo', 'Grupo 1', 'Cafe', 'Café en vaso de 180ml', 1.0 );
insert into product (name, type, category, details, price) values ('Infusión en Agua', 'Grupo 1', 'Cafe', 'Infusión en vaso de 180ml', 1.0 );

insert into product (name, type, category, details, price) values ('Media Tostada de Aceite', 'Grupo 1', 'Desayunos', 'Media tostada con aceite de oliva', 1.0 );
insert into product (name, type, category, details, price) values ('Tostada de Aceite', 'Grupo 1', 'Desayunos', 'Tostada entera con acente de oliva', 1.0 );

insert into product (name, type, category, details, price) values ('Coca Cola', 'Grupo 2', 'Refrescos', 'Lata de Coca Cola de 33cl', 1.0 );
insert into product (name, type, category, details, price) values ('Nestea', 'Grupo 2', 'Refrescos', 'Lata de Nestea de 33cl', 1.0 );

insert into product (name, type, category, details, price) values ('Jamon', 'Grupo 3', 'Bocadillos', 'Pan de barra con jamón serrano', 1.0 );
insert into product (name, type, category, details, price) values ('Mixto', 'Grupo 3', 'Bocadillos', 'Pan de molde con jamón y queso', 1.0 );
insert into product (name, type, category, details, price) values ('Pollo', 'Grupo 3', 'Bocadillos', 'Pan de barra con pechuga de pavo, lechuga y mayonesa', 1.50 );

insert into user (name, lastName, type, email, active, password) values ('Juan José', 'Longoria López', 'Admin', 'juanjoselongoria@gmail.com', true, '$2a$10$fcec.2o2ifrkszLchrPeF.ES/DtQ012A3hxRy9EWdwbRJI.hCz132');
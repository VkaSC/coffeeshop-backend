drop database if exists db_IESCoffeShop; 
create database  if not exists db_IESCoffeShop;
use db_IESCoffeShop;
create table if not exists product(
    id int unsigned primary key auto_increment,
    name varchar(100) not null,
    type enum("Grupo 1","Grupo 2", "Grupo 3" ) not null,
    category enum("Cafe", "Desayunos", "Refrescos", "Bocadillos") not null,
    details varchar(255),
    price decimal(6,2)
) character set = 'utf8';

create table if not exists user(
    id int unsigned primary key auto_increment,
    name varchar(100) not null,
    lastName varchar (150) not null,
    type enum("Admin", "Cliente") not null,
    email varchar (150) unique not null,
    password varchar(150) not null
) character set = 'utf8';

create table if not exists request(
    id int unsigned primary key auto_increment,
    device varchar(100),
    requestDay date,
    requestHour time,
    user_id int unsigned not null,
    foreign key (user_id) references user (id) on update cascade on delete restrict
) character set = 'utf8';

create table if not exists allergen(
    id int unsigned primary key auto_increment,
    name varchar(100) not null,
    icon varchar(255),
    details varchar(255)
) character set = 'utf8';

create table if not exists product_allergen_relationship(
    id int unsigned primary key auto_increment,
    product_id int unsigned not null,
    allergen_id int unsigned not null,
    foreign key (product_id) references product (id) on update cascade on delete restrict,
    foreign key (allergen_id) references allergen (id) on update cascade on delete restrict    
)character set = 'utf8';

create table if not exists product_request_relationship(
    id int unsigned primary key auto_increment,
    product_id int unsigned not null,
    request_id int unsigned not null,
    quantity int unsigned not null,
    foreign key (product_id) references product (id) on update cascade on delete restrict,
    foreign key (request_id) references request (id) on update cascade on delete restrict    
)character set = 'utf8';

insert into product (name, type, category, details, price) values ('Jamon', 'Grupo 1', 'Bocadillos', 'Pan de barra con jamón serrano', 1.0 );
insert into product (name, type, category, details, price) values ('Mixto', 'Grupo 1', 'Bocadillos', 'Pan de molde con jamón y queso', 1.0 );
insert into product (name, type, category, details, price) values ('Pollo', 'Grupo 1', 'Bocadillos', 'Pan de barra con pechuga de pavo, lechuga y mayonesa', 1.50 );
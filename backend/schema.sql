drop table finder;
drop table user;

create table user(user_id int primary key,name varchar(50),DOB date,email varchar(100) not null unique,occupation varchar(50),password varchar(100));
create table finder(finder_id int primary key,foreign key(finder_id)references user(user_id));
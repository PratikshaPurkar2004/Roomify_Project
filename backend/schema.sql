use roomify;

create table IF NOT EXISTS users(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    DOB DATE,
    email VARCHAR(100) UNIQUE NOT NULL,
    occupation VARCHAR(50),
    password VARCHAR(100) NOT NULL,
    user_type ENUM('Host','Finder')NOT NULL,
    age_group INT,
    city VARCHAR(100),
    gender VARCHAR (10),
    budget INT,
    preferences VARCHAR(100));

create table IF NOT EXISTS rooms(
    room_id INT PRIMARY KEY AUTO_INCREMENT,
    host_id INT NOT NULL,
    location VARCHAR(100) NOT NULL,
    rent FLOAT NOT NULL,
    availability ENUM('available','booked')DEFAULT 'available',
    FOREIGN KEY(host_id)REFERENCES users(user_id));

create table IF NOT EXISTS connect(
    connect_id INT PRIMARY KEY AUTO_INCREMENT,
    finder_id INT NOT NULL,
    host_id INT NOT NULL,
    connect_date DATE DEFAULT (CURRENT_DATE),
    status ENUM('pending','accepted','rejected') DEFAULT 'pending',
    FOREIGN KEY(finder_id)REFERENCES users(user_id),
    FOREIGN KEY(host_id)REFERENCES users(user_id));

create table IF NOT EXISTS review(
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    connect_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    review_date DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY(connect_id) REFERENCES connect(connect_id));

create table IF NOT EXISTS plans(
    plan_id INT PRIMARY KEY AUTO_INCREMENT,
    plan_name VARCHAR(30) NOT NULL,
    type VARCHAR(30),
    duration INT, 
    status ENUM('active','inactive') DEFAULT 'active');

create table IF NOT EXISTS payment(
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    method VARCHAR(30),
    amount INT,
    status ENUM('success','failed','pending'),
    payment_date DATE,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(plan_id) REFERENCES plans(plan_id));





INSERT INTO department (name)
VALUES 
("Sales"),
("Engineering"),
("Finance"),
("Legal"),
("Information Technology");

INSERT INTO role (title, salary, department_id)
VALUES 
("Sales Lead", 110000, 1),
("Lead Engineer", 170000, 2),
("Software Engineer", 125000, 2),
("Accountant", 100000, 3),
("Network Admin", 250000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Anthony", "Davis", 1, 3),
("Alex", "Caruso", 2, 1),
("Dennis", "Schroder", 3, 2),
("LeBron", "James", 4, 3),
("Nadia", "Peterson", 4, 1),
("Betty", "Green", 2, NULL),
("Carolyn", "Agin", 4, 3),
("Michael", "Weimer", 1, NULL);
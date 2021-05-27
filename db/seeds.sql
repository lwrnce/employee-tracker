USE employees_db;

INSERT INTO department (name)
VALUES
('Information Systems and Technology'),
('Sales'),
('Legal'),
('Finance');

INSERT INTO role (title, salary, department_id)
VALUES
('Accountant', '55000', 1),
('Intern', '30000', 2),
('Lawyer', '80000', 3),
('Lead Engineer', '130000', 4),
('Legal Team Lead', '120000', 5),
('Marketing Specialist', '100000', 6),
('Sales Lead', '70000', 7),
('Sales Person', '40000', 8),
('Software Engineer', '90000', 9);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Aaron', 'Au', 1, 123),
('Brian', 'Byrd', 2, 234),
('Carmen', 'Caulfield', 3, 345),
('David', 'Dang', 4, 456),
('Ethan', 'Everett', 5, 567),
('Fernando', 'Flores', 6, 678),
('Greg', 'Gregory', 7, 789),
('Harold', 'Holdem', 8, 890),
('Ivan', 'Ingleside', 9, 901);
USE employees_db;

INSERT INTO departments (id, name)
VALUES
(1, 'Information Systems and Technology'),
(2, 'Sales'),
(3, 'Legal'),
(4, 'Finance');

INSERT INTO roles (id, title, salary, department_id)
VALUES
(1, 'Accountant', '55000', 4),
(2, 'Intern', '30000', 1),
(3, 'Lawyer', '80000', 3),
(4, 'Lead Engineer', '130000', 1),
(5, 'Legal Team Lead', '120000', 3),
(6, 'Marketing Specialist', '100000', 2),
(7, 'Sales Lead', '70000', 2),
(8, 'Sales Person', '40000', 2),
(9, 'Software Engineer', '90000', 1);


INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES
(1, 'Aaron', 'Au', 1, ),
(2, 'Brian', 'Byrd', 2, ),
(3, 'Carmen', 'Caulfield', 3, ),
(4, 'David', 'Dang', 4, ),
(5, 'Ethan', 'Everett', 5, 567),
(6, 'Fernando', 'Flores', 6, 678),
(7, 'Greg', 'Gregory', 7, 789),
(8, 'Harold', 'Holdem', 8, 890),
(9, 'Ivan', 'Ingleside', 9, 901);
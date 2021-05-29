INSERT INTO departments (department_id, name)
VALUES
    (1, 'Information Systems and Technology'),
    (2, 'Sales'),
    (3, 'Legal'),
    (4, 'Finance');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Accountant', '55000', 4),
    ('Intern', '30000', 1),
    ('Lawyer', '80000', 3),
    ('Lead Engineer', '130000', 1),
    ('Legal Team Lead', '120000', 3),
    ('Marketing Specialist', '100000', 2),
    ('Sales Lead', '70000', 2),
    ('Sales Person', '40000', 2),
    ('Software Engineer', '90000', 1);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Aaron', 'Au', 1, 1),
    ('Brian', 'Byrd', 2, 1),
    ('Carmen', 'Caulfield', 3, 2),
    ('David', 'Dang', 4, 2),
    ('Ethan', 'Everett', 5, 3),
    ('Fernando', 'Flores', 6, 3),
    ('Greg', 'Gregory', 7, 4),
    ('Harold', 'Holdem', 8, 4),
    ('Ivan', 'Ingleside', 9, 4);
INSERT INTO departments (name, department_name, id, department_id)
VALUES
    ('Human Resources', 'Human Resources', 1, 1),
    ('IT', 'IT', 2, 2),
    ('Sales', 'Sales', 3, 3),
    ('Legal', 'Legal', 4, 4),
    ('Finance', 'Finance', 5, 5);

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Accountant', '55000', 5),
    ('Intern', '30000', 2),
    ('Lawyer', '80000', 4),
    ('Lead Engineer', '130000', 2),
    ('Legal Team Lead', '120000', 4),
    ('Marketing Specialist', '100000', 3),
    ('Sales Lead', '70000', 3),
    ('Sales Person', '40000', 3),
    ('Software Engineer', '90000', 2);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Aaron', 'Au', 1, 7),
    ('Brian', 'Byrd', 2, 4),
    ('Carmen', 'Caulfield', 3, 5),
    ('David', 'Dang', 4, 4),
    ('Ethan', 'Everett', 5, 5),
    ('Fernando', 'Flores', 6, 6),
    ('Greg', 'Gregory', 7, 7),
    ('Harold', 'Holdem', 8, 7),
    ('Ivan', 'Ingleside', 9, 4);
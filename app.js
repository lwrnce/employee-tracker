const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');
const figlet = require('figlet');
 
function mainMenu() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'Employee Manager: What would you like to do?',
        choices: [
            'View All Employees',
            'View All Departments',
            'View All Roles',
            'Add Department',
            'Add Employee',
            'Add Role',
            'Update Employee Role',
            'EXIT'
        ]
    }).then(function(answer) {
        switch (answer.action) {
            case 'View All Employees':
                viewAll();
                break;
            case 'View All Departments':
                viewDept();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'Add Department':
                addDept();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Update Employee Role':
                updateRole();
                break;
            case 'EXIT':
                exitApp();
                break;
            default:
                console.log('break')
        }
    })
};

function validateInput(value) {
    if(value) {
        return true;
    }
    console.log('Please enter a value!');
    return false;
};

function viewAll() {
    const query = `SELECT
                    employees.id,
                    CONCAT (employees.first_name, ' ', employees.last_name) AS 'Name',
                    roles.title AS 'Title',
                    departments.name AS 'Department Name',
                    roles.salary AS 'Salary',
                    CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager'
                    FROM employees
                    LEFT JOIN roles on employees.role_id=roles.id
                    LEFT JOIN departments on roles.department_id=departments.id
                    LEFT JOIN employees manager on manager.id = employees.manager_id;`
    db.query(query, (err, rows) => {
        if(err) throw err;
        console.table(rows);
        mainMenu();
    });
};

function viewDept() {
    const query = `SELECT 
                    id AS Department_ID,
                    departments.name AS Department_Name
                    FROM departments;`;
    db.query(query, (err, rows) => {
      if(err) throw err;
      console.table(rows);
        mainMenu();
    })
};

function viewRoles() {
    const query = `SELECT
                    title AS Title,
                    roles.id AS Role_Id,
                    departments.name AS Department_Name,
                    salary AS Salary
                    FROM roles
                    LEFT JOIN departments ON roles.department_id = departments.id;`

  db.query(query, (err, rows) => {
    if(err) throw err;
    console.table(rows);
    mainMenu();
  });
};

function addEmployee() {
    const roleList = [];
    const managerList = [];

    const roleQuery = `SELECT title FROM roles;`;
    const employeeQuery = `SELECT CONCAT (employees.first_name, ' ', employees.last_name) AS name FROM employees;`;

  db.query(roleQuery, (err, rows) => {
    for (let i = 0; i < rows.length; i++) {
      if (roleQuery.indexOf(rows[i].title) === -1) {
        roleQuery.push(rows[i].title);
      }
    }
  });

  db.query(employeeQuery, (err, rows) => {
    for (let i = 0; i < rows.length; i++) {
      if (employeeQuery.indexOf(rows[i].name) === -1) {
        employeeQuery.push(rows[i].name);
      }
    }
  });

  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: "What's the first name of your new employee?",
      validate: validateInput,
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'What is his or her last name?',
      validate: validateInput,
    },
    {
      type: 'list',
      name: 'role',
      message: "What is your employee's role?",
      choices: roleList

    },
    {
      type: 'list',
      name: 'manager',
      message: "Who's the employee's manager?",
      choices: managerList
    }
  ])
  .then(responses => {
    const roleIdQuery = `SELECT id FROM roles WHERE title = '${responses.role}';`
    let role_id;

    db.query(roleIdQuery, (err, rows) => {
      role_id = rows[0].id;

      const managerName = `${responses.manager}`;
      const managerArray = managerName.split(' ');
      let employee_id;

      const managerQuery =  `SELECT id FROM employees WHERE first_name = '${managerArray[0]}' AND last_name = '${managerArray[1]}';`;

      db.query(managerQuery, (err, rows) => {
        employee_id = rows[0].id;
        console.log(employee_id);

        const query = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`
        const params = [`${responses.firstName}`, `${responses.lastName}`, role_id, employee_id];

        db.query(query, params, (err, rows) => {
          console.log(rows);
          console.log(`${responses.firstName} ${responses.lastName} has been added to the employee database.`);
          mainMenu();
        });
      });
    })
  })
};

function addDept() {
    inquirer
        .prompt([
            {
                name: 'new_department', 
                type: 'input', 
                message: 'What is the name of the new department that you want do add?',
                validate: validateInput,
            }
            ]).then(answer => {
                const sql = `INSERT INTO departments (name) VALUES (?);`
                const newDepartment = answer.new_department;
            
                db.query(sql, newDepartment, (err, res) => {
                    console.log(`${newDepartment} has been added to the database!`);
                    mainMenu();
                })
            })
};

function addRole() {
    db.query(`SELECT name * FROM departments;`, function(err, rows) {
        if (err) throw err;
    
        inquirer 
        .prompt([
            {
                name: 'new_role',
                type: 'input', 
                message: "What new role would you like to add?",
                validate: validateInput,
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of this role? (Enter a number)',
                validate: validateInput,
            },
            {
                name: 'Department',
                type: 'list',
                choices: function() {
                    let deptArray = [];
                    for (let i = 0; i < rows.length; i++) {
                    deptArray.push(rows[i].name);
                    }
                    return deptArray;
                },
            }
        ]).then(function (answer) {
            let department_id;
            for (let a = 0; a < rows.length; a++) {
                if (rows[a].name == answer.Department) {
                    department_id = rows[a].id;
                }
            }
    
            db.query(
                'INSERT INTO roles SET ?;',
                {
                    title: answer.new_role,
                    salary: answer.salary,
                    department_id: department_id
                },
                function (err, rows) {
                    if(err)throw err;
                    console.log('Your new role has been added!');
                    console.table('All Roles:', rows);
                    mainMenu();
                })
        })
    })
};

function updateRole() {
    const employeeQuery = `SELECT CONCAT (employees.first_name, ' ', employees.last_name) AS name FROM employees;`;
    const roleQuery = `SELECT title FROM roles;`;
  
    db.query(employeeQuery, (err, rows) => {
      let employeeList = [];
  
      for (let i = 0; i < rows.length; i++) {
        if (employeeList.indexOf(rows[i].name) === -1) {
          employeeList.push(rows[i].name);
        }
      }
  
    db.query(roleQuery, (err, rows) => {
    let roleList = [];

    for (let i = 0; i < rows.length; i++) {
        if (roleList.indexOf(rows[i].title) === -1) {
        roleList.push(rows[i].title);
        }
    }
  
        inquirer.prompt([
          {
            type: 'list',
            name: 'employees',
            message: "Which employee's role do you want to update?",
            choices: employeeList
          },
          {
            type: 'list',
            name: 'roles',
            message: "What is the employee's updated role?",
            choices: roleList
          }
        ])
        .then(responses => {
          const roleIdQuery = `SELECT id FROM roles WHERE title = '${responses.roles}';`
          let role_id;
  
          db.query(roleIdQuery, (err, rows) => {
            role_id = rows[0].id;
  
            const employeeName = `${responses.employees}`;
            const employeeArray = employeeName.split(' ');
            let employee_id;
  
            const employeeQuery =  `SELECT id FROM employees WHERE first_name = '${employeeArray[0]}' AND last_name = '${employeeArray[1]}';`;
  
            db.query(employeeQuery, (err, rows) => {
              employee_id = rows[0].id;
              console.log(employee_id);
  
              const query = `UPDATE employees SET role_id = ? WHERE id = ?;`
              const params = [role_id, employee_id];
  
              db.query(query, params, (err, rows) => {
                console.log(rows);
                console.log(`${responses.employees}'s role has been updated.`);
                mainMenu();
              });
            });
          });
        })
      })
    })
  };

function exitApp() {
    db.end();
};

function initApp() {
    figlet('Employee Tracker', function(err, data) {
        if (err) {
          console.log('Something went wrong...');
          console.dir(err);
          return;
        }
        console.log(data);
        mainMenu();
      });
};

initApp();
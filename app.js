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
                    departments.department_name AS 'Department Name',
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
  const query = `SELECT id AS Department_ID, name AS Department_NAME FROM departments;`;

  db.query(query, (err, rows) => {
    if(err) throw err;
    console.table(rows);
    mainMenu();
  });
};

function viewRoles() {
    const query = `SELECT
                    title AS Title,
                    roles.id AS Role_Id,
                    departments.department_name AS Department_Name,
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
      if (roleList.indexOf(rows[i].title) === -1) {
        roleList.push(rows[i].title);
      }
    }
  });

  db.query(employeeQuery, (err, rows) => {
    for (let i = 0; i < rows.length; i++) {
      if (managerList.indexOf(rows[i].name) === -1) {
        managerList.push(rows[i].name);
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
  .then(answer => {
    const roleIdQuery = `SELECT id FROM roles WHERE title = '${answer.role}';`
    let role_id;

    db.query(roleIdQuery, (err, rows) => {
      role_id = rows[0].id;

      const managerName = `${answer.manager}`;
      const managerArray = managerName.split(' ');
      let employee_id;

      const managerQuery =  `SELECT id FROM employees WHERE first_name = '${managerArray[0]}' AND last_name = '${managerArray[1]}';`;

      db.query(managerQuery, (err, rows) => {
        employee_id = rows[0].id;

        const employeeQuery = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`
        const params = [`${answer.firstName}`, `${answer.lastName}`, role_id, employee_id];

        db.query(employeeQuery, params, (err, rows) => {
          console.log(`${answer.firstName} ${answer.lastName} has been added to the employee database.`);
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
                type: 'input',
                name: 'deptName', 
                message: 'What is the name of the new department that you want do add?',
                validate: validateInput
            }
            ]).then(answer => {
                const query = `INSERT INTO departments (name) VALUES (?);`
                const newDepartment = answer.deptName;
            
                db.query(query, newDepartment, (err, res) => {
                    console.log(`${newDepartment} has been added to the database!`);
                    mainMenu();
                })
            })
};

function addRole() {
  const deptArray = [];

  db.query(`SELECT name FROM departments;`, (err, rows) => {
    for (let i = 0; i < rows.length; i++) {
      if (deptArray.indexOf(rows[i].name) === -1) {
        deptArray.push(rows[i].name);
      }
    }
  });

  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: "What is the title of this role?",
      validate: validateInput
    },
    {
      type: 'number',
      name: 'salary',
      message: 'What is the salary for this particular role?',
      validate: validateInput
    },
    {
      type: 'list',
      name: 'department',
      message: 'Which department does this role belong to?',
      choices: deptArray
    }
  ])
  .then(responses => {
    const deptIDQuery = `SELECT id FROM departments WHERE name = '${responses.department}';`
    let department_id;

    db.query(deptIDQuery, (err, rows) => {
      department_id = rows[0].id;

      const params = [`${responses.title}`, responses.salary, department_id];

      db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?,?,?);`, params, (err, rows) => {
        console.log(`${responses.title} has been added.`);
        mainMenu();
      })
    });
  });
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
                // console.log(rows);
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
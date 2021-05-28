const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');
 
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
                viewAll();
                break;
            case 'Update Employee Role':
                addRole();
                break;
            case 'EXIT':
                exitApp();
                break;
            default:
                break;
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
    const query = `SELECT * FROM employees;`;
    db.query(query, function(err, rows) {
        if (err) throw err;
        console.log(rows.length + ' employees found!');
        console.table('All Employees:', rows); 
        mainMenu();
    })
};

function viewDept() {
    const query = `SELECT id AS Department_ID, name AS Department FROM departments;`;
    db.query(query, function(err, rows) {
        if(err)throw err;
        console.table('All Departments:', rows);
        mainMenu();
    })
};

function viewRoles() {
    const query = `SELECT * FROM roles;`;
    db.query(query, function(err, rows){
        if (err) throw err;
        console.table('All Roles:', rows);
        mainMenu();
    })
};

function addEmployee() {
    db.query('SELECT * FROM roles;', function (err, rows) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'first_name',
                    type: 'input', 
                    message: "What is your new employee's first name? ",
                    validate: validateInput,
                },
                {
                    name: 'last_name',
                    type: 'input', 
                    message: "What is his or her last name? ",
                    validate: validateInput,
                },
                {
                    name: 'manager_id',
                    type: 'input', 
                    message: "What is the employee's manager's ID?",
                    validate: validateInput,
                },
                {
                    name: 'role', 
                    type: 'list',
                    message: "What is this employee's role? ",
                    choices: function() {
                    let roleArr = [];
                    for (let i = 0; i < rows.length; i++) {
                        roleArr.push(rows[i].title);
                    }
                    return roleArr;
                    }
                }
                ]).then(function (answer) {
                    let role_id;
                    for (let a = 0; a < rows.length; a++) {
                        if (rows[a].title == answer.role) {
                            role_id = rows[a].id;
                            console.log(role_id)
                        }                  
                    }  
                    db.query(
                    'INSERT INTO employees SET ?;',
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        manager_id: answer.manager_id,
                        role_id: role_id,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log('New employee added.');
                        mainMenu();
                    })
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
    db.query('SELECT name * FROM departments;', function(err, rows) {
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

// function updateRole() {

// };

// function exitApp() {
//     db.end();
// };

mainMenu();

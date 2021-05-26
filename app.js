const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'MomsBday931962',
  database: 'employees_db'
});
 
// simple query
connection.connect(function(err) {
    if(err) throw err;
    mainMenu();
});

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


function viewAll() {
    const query = 'SELECT * FROM employee';
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log(res.length + ' employees found!');
        console.table('All Employees:', res); 
        mainMenu();
    })
};

function viewDept() {
    var query = 'SELECT * FROM department';
    connection.query(query, function(err, res) {
        if(err)throw err;
        console.table('All Departments:', res);
        mainMenu();
    })
};

function viewRoles() {
    var query = 'SELECT * FROM role';
    connection.query(query, function(err, res){
        if (err) throw err;
        console.table('All Roles:', res);
        mainMenu();
    })
};

function addEmployee() {
    connection.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'first_name',
                    type: 'input', 
                    message: "What is your new employee's first name? ",
                },
                {
                    name: 'last_name',
                    type: 'input', 
                    message: "What is his or her last name? "
                },
                {
                    name: 'manager_id',
                    type: 'input', 
                    message: "What is the employee's manager's ID? "
                },
                {
                    name: 'role', 
                    type: 'list',
                    message: "What is this employee's role? ",
                    choices: function() {
                    let roleArr = [];
                    for (let i = 0; i < res.length; i++) {
                        roleArr.push(res[i].title);
                    }
                    return roleArr;
                    }
                }
                ]).then(function (answer) {
                    let role_id;
                    for (let a = 0; a < res.length; a++) {
                        if (res[a].title == answer.role) {
                            role_id = res[a].id;
                            console.log(role_id)
                        }                  
                    }  
                    connection.query(
                    'INSERT INTO employee SET ?',
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
                message: 'What is the name of the new department that you want do add?'
            }
            ]).then(function (answer) {
                connection.query(
                    'INSERT INTO department SET ?',
                    {
                        name: answer.new_department
                    });
                var query = 'SELECT * FROM department';
                connection.query(query, function(err, res) {
                if(err)throw err;
                console.log('New department added!');
                console.table('All Departments:', res);
                mainMenu();
                })
            })
};

function addRole() {
    connection.query('SELECT * FROM department', function(err, res) {
        if (err) throw err;
    
        inquirer 
        .prompt([
            {
                name: 'new_role',
                type: 'input', 
                message: "What new role would you like to add?"
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of this role? (Enter a number)'
            },
            {
                name: 'Department',
                type: 'list',
                choices: function() {
                    var deptArry = [];
                    for (let i = 0; i < res.length; i++) {
                    deptArry.push(res[i].name);
                    }
                    return deptArry;
                },
            }
        ]).then(function (answer) {
            let department_id;
            for (let a = 0; a < res.length; a++) {
                if (res[a].name == answer.Department) {
                    department_id = res[a].id;
                }
            }
    
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.new_role,
                    salary: answer.salary,
                    department_id: department_id
                },
                function (err, res) {
                    if(err)throw err;
                    console.log('Your new role has been added!');
                    console.table('All Roles:', res);
                    mainMenu();
                })
        })
    })
};

// function updateRole() {

// };

function exitApp() {
    connection.end();
};

const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3001,
  password: 'MyNewPassword123!',
  database: 'employees_db'
});
 
// simple query
connection.connect(function(err) {
    if(err) throw err;
    initApp();
});

function initApp() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'Employee Manager: What would you like to do?',
        choices: [
            'View All Employees',
            'View All Employees by Department',
            'View All Employees by Manager',
            'Add Employee',
            'Remove Employee',
            'Update Employee Role',
            'Update Employee Manager',
            'EXIT'
        ]
    }).then(function(answer) {
        switch (answer.action) {
            case 'View All Employees':
                viewAll();
                break;
            case 'View All Employees by Department':
                viewAll();
                break;
            case 'View All Employees by Manager':
                viewAll();
                break;
            case 'Add Employee':
                viewAll();
                break;
            case 'Remove Employee':
                viewAll();
                break;
            case 'Update Employee Role':
                viewAll();
                break;
            case 'Update Employee Manager':
                viewAll();
                break;
            case 'EXIT':
                exitApp();
                break;
            default:
                break;
        }
    })
};

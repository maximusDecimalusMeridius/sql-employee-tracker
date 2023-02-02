//hook in dependencies
const mysql = require("mysql2");
const inquirer = require("inquirer");
const util = require("util");

//Initial Greeting
console.log("Hello!");

//hook in mysql database 'company_db'
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'company_db'
    }
)

//query db for all department records and return in a table format
const viewAllDepartments = () => {
    db.query(`SELECT * FROM department`, (error, data) => {
        if(error){
            throw(error);
        } else {
            console.table(data);
        }
    })

    
}

//query db for all role records and return in a table format
const viewAllRoles = () => {
    db.query(`SELECT * FROM role`, (error, data) => {
        if(error){
            throw(error);
        } else {
            console.table(data);
        }
    })
}

//query db for all employee records and return in a table format
const viewAllEmployees = () => {
    db.query(`SELECT * FROM employee`, (error, data) => {
        if(error){
            throw(error);
        } else {
            console.table(data);
        }
    })
}

const addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the department you would like to add",
            name: "departmentName"
        }
    ])
    .then( answer => {
        const add = () =>{
            return new Promise((resolve, reject)=>{
                db.query('INSERT INTO department VALUES (null, ?)', answer.departmentName, (error, results) => {
                    if(error){
                        return reject(error);
                    }
                    return resolve(results);
                });
            });
        };
        add()
        .then(console.log("Department Added!"))
        .then(delayedRunIt());
    })
}

const addRole = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the title of the role you would like to add",
            name: "title"
        },
        {
            type: "input",
            message: "Please enter the salary for this role",
            name: "salary"
        },
        {
            type: "input",
            message: "Please enter the department for the role",
            name: "department"
        }
    ])
    .then( answers => {
        const add = () =>{
            return new Promise((resolve, reject)=>{
                db.query('INSERT INTO role VALUES (null, ?, ?, ?)', [answers.title, answers.salary, answers.department], (error, results) => {
                    if(error){
                        return reject(error);
                    }
                    return resolve(results);
                });
            });
        };
        add()
        .then(console.log("Role Added!"))
        .then(viewAllRoles())
        .then(delayedRunIt());
    })
}

//Function to delay calling runIt() by 2 seconds (2000 ms)
const delayedRunIt = () => {
    setTimeout(() => {
        runIt();
    }, 3000)
}

//Present user with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
const runIt = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "Please select an option",
            choices: [
                {name: "View All Departments", value: 1},
                {name: "View All Roles", value: 2},
                {name: "View All Employees", value: 3},
                {name: "Add a Department", value: 4},
                {name: "Add a Role", value: 5},
                {name: "Add an Employee", value: 6},
                {name: "Update an Employee", value: 7},
            ],
            name: "listChoice"
        }
    ])
    .then( answer => {
        switch (answer.listChoice){
            case 1:
                viewAllDepartments();
                delayedRunIt();
                break;

            case 2:
                viewAllRoles();
                delayedRunIt();
                break;

            case 3:
                viewAllEmployees();
                delayedRunIt();
                break;

            case 4:
                addDepartment();
                break;

            case 5:
                addRole();
                break;

            case 6:
                break;

            case 7:
                break;

            default:
                console.log("Oops!");
                break;

        }
    })
}

runIt();
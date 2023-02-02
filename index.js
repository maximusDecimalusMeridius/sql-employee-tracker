const db = require("mysql2");
const inquirer = require("inquirer");

console.log("Hello!");

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
                break;

            case 2:
                break;

            case 3:
                break;

            case 4:
                break;

            case 5:
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
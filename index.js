//hook in dependencies
const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");

//Initial Greeting
console.log(`
***************************************************
*                                                 *
*                                                 *
*                                                 *
*       Welcome to MySQL Employee Tracker!        *
*                                                 *
*                                                 *
*                                                 *
***************************************************`);

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

//Add a department to the db that doesn't exist
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
        .then(viewAllDepartments())
        .then(delayedRunIt());
    })
}

const addRole = () => {
    
    let choiceArray = [];

    db.query(`SELECT id, name FROM department`, (error, data) => {
        if(error){
            throw(error);
        } else {
            for(let i = 0; i < data.length; i++){
                choiceArray.push({name: `${data[i].name}`, value: `${data[i].id}`});
            }
        }
    })

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
            type: "list",
            message: "Please enter the department for the role",
            choices: choiceArray,
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

const addEmployee = () => {
    
    let roleChoiceArray = [];
    let managerChoiceArray = [{name: "None", value: null}];

    db.query(`SELECT id, title FROM role`, (error, data) => {
        if(error){
            throw(error);
        } else {
            for(let i = 0; i < data.length; i++){
                roleChoiceArray.push({name: `${data[i].title}`, value: `${data[i].id}`});
            }
        }
    })

    db.query(`SELECT id, first_name, last_name FROM employee`, (error, data) => {
        if(error){
            throw(error);
        } else {
            for(let i = 0; i < data.length; i++){
                managerChoiceArray.push({name: `${data[i].first_name} ${data[i].last_name}`, value: `${data[i].id}`});
            }
        }
    })

    inquirer.prompt([
        {
            type: "input",
            message: "Please enter employee's first name: ",
            name: "firstName"
        },
        {
            type: "input",
            message: "Please enter employee's last name: ",
            name: "lastName"
        },
        {
            type: "list",
            message: "Please select employee's role: ",
            choices: roleChoiceArray,
            name: "role"
        },
        {
            type: "list",
            message: "Please select employee's manager: ",
            choices: managerChoiceArray,
            name: "managerID"
        }
    ])
    .then( answers => {
        const add = () =>{
            return new Promise((resolve, reject)=>{
                db.query('INSERT INTO employee VALUES (null, ?, ?, ?, ?)', [answers.firstName, answers.lastName, answers.role, answers.managerID], (error, results) => {
                    if(error){
                        return reject(error);
                    }
                    return resolve(results);
                });
            });
        };
        add()
        .then( () => {
            console.log("Employee Added!");
            viewAllEmployees();
            delayedRunIt();
        })
    })
}

const updateEmployee = () => {
    
    let employeeChoiceArray = [];
    let roleChoiceArray = [];

    db.query(`SELECT id, title FROM role`, (error, data) => {
        if(error){
            throw(error);
        } else {
            for(let i = 0; i < data.length; i++){
                roleChoiceArray.push({name: `${data[i].title}`, value: `${data[i].id}`});
            }
        }
    })

    const load = () =>{
        return new Promise((resolve, reject)=>{
            db.query(`SELECT id, first_name, last_name FROM employee`, (error, data) => {
                if(error){
                    throw(error);
                } else {
                    for(let i = 0; i < data.length; i++){
                        employeeChoiceArray.push({name: `${data[i].first_name} ${data[i].last_name}`, value: `${data[i].id}`});
                        console.log(employeeChoiceArray);
                    }
                    return resolve(employeeChoiceArray);
                }
            })
        });
    };

    load()
    .then( employeeChoiceArray => {
        inquirer.prompt([
            {
                type: "list",
                message: "Please enter employee name: ",
                choices: employeeChoiceArray,
                name: "name"
            },
            {
                type: "list",
                message: "Please enter the employee's new role: ",
                choices: roleChoiceArray,
                name: "role"
            },

        ])
        .then( answer => {
            db.query(`UPDATE employee SET role_id=? WHERE id=?`, [answer.role, answer.name], (error) => {
                if(error){
                    throw(error);
                } else {
                    console.log("Employee file updated!");
                    delayedRunIt();
                }
            })
        })
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
                new inquirer.Separator(" "),
                {name: "1. View All Departments", value: 1},
                {name: "2. View All Roles", value: 2},
                {name: "3. View All Employees", value: 3},
                new inquirer.Separator(),
                {name: "4. Add a Department", value: 4},
                {name: "5. Add a Role", value: 5},
                {name: "6. Add an Employee", value: 6},
                new inquirer.Separator(),
                {name: "7. Update an Employee", value: 7},
                new inquirer.Separator(),
                {name: "8. Quit", value: 8},
                new inquirer.Separator(" ")
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
                addEmployee();
                break;

            case 7:
                updateEmployee();
                break;

            case 8:
                console.log("Goodbye!");
                db.close();
                process.exit();

            default:
                console.log("Oops!");
                break;

        }

    })

}

runIt();
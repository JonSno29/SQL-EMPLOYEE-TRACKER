// Modules needed
const inquirer = require('inquirer');
const mysql = require('mysql2');
const figlet = require('figlet');
const cTable = require('console.table');
require('dotenv').config();

// Connection to SQL database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB
});

db.connect(function(err) {
    if (err) throw err
    console.log("MySQL Connected")
    startPrompt();
});

// Figlet to show "EMPLOYEE TRACKER" in new format
figlet("EMPLOYEE  TRACKER", function(err, res) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(res)
});

// startPrompt function that starts question prompt + switch statements
const startPrompt = () => {
    return inquirer.prompt([{
        name: 'action',
        type: 'list',
        message: 'WHAT WOULD YOU LIKE TO DO?',
        choices: ["View All Departments", "View All Roles", "View All Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role"]
    }]).then(function(val) {
        switch (val.action) {
            case "View All Departments":
                console.log(val.action);
                viewAllDepartments();
                break;

            case "View All Roles":
                viewAllRoles();
                break;

            case "View All Employees":
                viewAllEmployees();
                break;

            case "Add Department":
                addDepartment();
                break;

            case "Add Role":
                addRole();
                break;

            case "Add Employee":
                addEmployee();
                break;

            case "Update Employee Role":
                updateEmployee();
                break;
                
        }       
    });
}

// viewAllDepartments function
const viewAllDepartments = () => {
    figlet("ALL  DEPARTMENTS", function(err, res) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(res)
    })
    const query = `SELECT * FROM departments`;
    db.query(query,
        function(err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
};

// viewAllRoles function
const viewAllRoles = () => {
    figlet("ALL  ROLES", function(err, res) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(res)
    })
    const query = `SELECT * FROM roles`;
    db.query(query,
        function(err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
};

// viewAllEmployees function
const viewAllEmployees = () => {
    figlet("ALL  EMPLOYEES", function(err, res) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(res)
    })
    const query = `SELECT employees.id, employees.first_name, employees.last_name, departments.name, roles.title, roles.salary, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employees INNER JOIN roles on roles.id = employees.role_id INNER JOIN departments on departments.id = roles.department_id left join employees e on employees.manager_id = e.id;`;
    db.query(query,
        function(err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
};

// addDepartment function
const addDepartment = () => {
    figlet("ADD  DEPARTMENT", function(err, res) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(res)
    })
    inquirer.prompt([{
        name: "Name",
        type: "input",
        message: "WHAT DEPARTMENT WOULD YOU LIKE TO ADD?"
    }]).then(function(res) {
        const query = "INSERT INTO departments SET ?";
        db.query(
            query, {
                name: res.Name
            },
            function(err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )
    })
};

// selectRole function used in add/update employee prompt 
let roleArr = [];
const selectRole = () => {
    const query = "SELECT * FROM roles";
    db.query(query, function(err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }
    })
    return roleArr;
};

// selectManager function for addEmployee prompt
let managersArr = [];
const selectManager = () => {
    const query = `SELECT first_name, last_name FROM employees WHERE manager_id IS NULL`;
    db.query(query, function(err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            managersArr.push(res[i].first_name);
        }
    })
    return managersArr;
};

// addRole function
const addRole = () => {
    figlet("ADD ROLE", function(err, res) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(res)
    })
    const query = `SELECT roles.title, roles.salary FROM roles`;
    db.query(query, function(err, res) {
        inquirer.prompt([{
                name: "Title",
                type: "input",
                message: "What is the roles Title?"
            },
            {
                name: "Salary",
                type: "input",
                message: "WHAT IS THE SALARY?"
            }
        ]).then(function(res) {
            db.query(
                "INSERT INTO roles SET ?", {
                    title: res.Title,
                    salary: res.Salary,
                },
                function(err) {
                    if (err) throw err
                    console.table(res);
                    startPrompt();
                }
            )
        });
    });
};

// addEmployee function
const addEmployee = () => {
    figlet("ADD EMPLOYEE", function(err, res) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(res)
    })
    inquirer.prompt([{
            name: "first_name",
            type: "input",
            message: "PLEASE ENTER THE EMPLOYEE FIRST NAME"
        },
        {
            name: "last_name",
            type: "input",
            message: "PLEASE ENTER THE EMPLOYEE LAST NAME"
        },
        {
            name: "role",
            type: "list",
            message: "WHAT IS THIS EMPLOYEES ROLE?",
            choices: selectRole()
        },
        {
            name: "managerId",
            type: "list",
            message: "WHO IS THIS EMPLOYEES MANAGER?",
            choices: selectManager()
        }
    ]).then(function(val) {
        const roleId = selectRole().indexOf(val.role) + 1;
        const managerId = selectManager().indexOf(val.choice) + 1;
        db.query("INSERT INTO employees SET ?", {
            first_name: val.first_name,
            last_name: val.last_name,
            manager_id: managerId,
            role_id: roleId
        }, function(err) {
            if (err) throw err
            console.table(val)
            startPrompt()
        })
    })
};

// updateEmployee function
const updateEmployee = () => {
    figlet("UPDATE  EMPLOYEE", function(err, res) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(res)
    })
    db.query(`SELECT * FROM employees`, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employees
            }
        ])
            .then(empChoice => {
                const employee = empChoice.name;
                const params = [];
                params.push(employee);

                const roleSql = `SELECT * FROM roles`;

                db.query(roleSql, (err, data) => {
                    if (err) throw err;

                    const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: "What is the employee's new role?",
                            choices: roles
                        }
                    ])
                        .then(roleChoice => {
                            const role = roleChoice.role;
                            params.push(role);

                            let employee = params[0]
                            params[0] = role
                            params[1] = employee

                            const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;

                            db.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log("Employee has been updated!");

                                startPrompt();
                            });
                        });
                });
            });
    });
};

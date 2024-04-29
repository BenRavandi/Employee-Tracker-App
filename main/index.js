// Variables for npm packages
const inquirer = require('inquirer');
const db = require('./db/connection.js');
const logo = require("asciiart-logo");

// Display the logo
const logoText = logo({ name: "Employee Manager" }).render();
console.log(logoText);

// Calling initial start menu
initMenu();

// Initial question with menu options
function initMenu() {
    inquirer.prompt([
        {
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add Department',
                'Remove Department',
                'Add Role',
                'Remove Role',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'View Total Utilized Budget for Each Department',
                'Exit'
            ],
            name: 'menu'
        }
    ]).then(ans => {
        switch (ans.menu) {
            case 'View All Departments':
                viewDepartments();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'View All Employees':
                viewEmployees();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Remove Department':
                removeDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Remove Role':
                deleteRole();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Remove Employee':
                deleteEmployee();
                break;
            case 'Update Employee Role':
                updateEmployee();
                break;
            case 'View Total Utilized Budget for Each Department':
                ViewTotalUtilizedBudgetByDepartment();
                break;
            case 'Exit':
                console.log("Goodbye!");
                process.exit();
            default:
                console.log('Invalid option selected. Please try again.');
                initMenu(); // Restart the menu
                break;
        }
    })
}

// Function to view all departments
const viewDepartments = () => {
    const command = 'SELECT department.id AS ID, department.name AS Department FROM department';
    db.query(command, function (err, results) {
        if (err) {
            throw err;
        } else {
            console.table(results);
            initMenu();
        }
    })
}
// Function to view all roles
const viewRoles = () => {
    const command = 'SELECT role.id AS ID, role.title AS Title, department.name AS Department, role.salary AS Salary FROM role JOIN department ON role.department_id = department.id ORDER BY role.id'
    db.query(command, function (err, results) {
        if (err) {
            throw err;
        } else {
            console.table(results);
            initMenu();
        }
    })
}
// Function to view all employees
const viewEmployees = () => {
    const command = 'SELECT a.id AS ID, CONCAT(a.first_name, " ", a.last_name) AS Employee, role.title AS Title, department.name AS Department, role.salary AS Salary, IFNULL(CONCAT(b.first_name, " ", b.last_name),"[None]") AS Manager FROM employee a LEFT JOIN employee b ON b.id = a.manager_id JOIN role ON a.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY a.id'
    db.query(command, function (err, results) {
        if (err) {
            throw err;
        } else {
            console.table(results);
            initMenu();
        }
    })
}
// Function to add a department
const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the new department?',
            name: 'newDepartment',
        }
    ]).then(ans => {
        const input = ans.newDepartment;
        db.query('INSERT INTO department (name) VALUES (?)', input, (err, data) => {
            if (err) {
                throw err;
            }
            console.log("New department successfully added.");
            initMenu();
        })
    })
}

// ========= Remove department ==========
const removeDepartment = () => {
    // Prompt user to select department to remove
    db.query("SELECT name FROM department", (err, data) => {
        if (err) {
            console.log('Error fetching department names:', err);
            return;
        }

        const departments = data.map((item) => item.name);

        inquirer.prompt([
            {
                type: "list",
                name: "departmentToDelete",
                message: "Select a department you want to remove:",
                choices: departments,
            },
        ]).then((ans) => {
            const departmentName = ans.departmentToDelete;

            db.query('DELETE FROM department WHERE name = ?', departmentName, (err, data) => {
                if (err) {
                    console.log('Error deleting department:', err);
                } else {
                    console.log('Department successfully deleted.');
                }
                initMenu();
            });
        });
    });
};


// Promise to list departments for inquirer prompt
const listDepartments = () => {
    return new Promise((resolve, reject) => {
        var departmentArr = [];
        db.query('SELECT * FROM department', (err, data) => {
            if (err) reject(err);
            for (let i = 0; i < data.length; i++) {
                departmentArr.push(data[i].name);
            }
            resolve(departmentArr);
        })
    })
}

// Promise to list role titles for inquirer prompt
const listRoles = () => {
    return new Promise((resolve, reject) => {
        var roleArr = [];
        db.query('SELECT * FROM role', (err, data) => {
            if (err) reject(err);
            for (let i = 0; i < data.length; i++) {
                roleArr.push(data[i].title);
            }
            resolve(roleArr);
        })
    })
}

// Promise to list possible managers for inquirer prompt
const listEmployees = () => {
    return new Promise((resolve, reject) => {
        var employeeArr = [];
        db.query('SELECT * FROM employee', (err, data) => {
            if (err) reject(err);
            for (let i = 0; i < data.length; i++) {
                employeeArr.push(data[i].first_name + ' ' + data[i].last_name);
            }
            resolve(employeeArr);
        })
    })
}

// Promise to find department ID from name chosen
const getDepartmentId = (input) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT id FROM department WHERE name = (?)', [input], (err, ans) => {
            if (err) reject(err);
            const newDeptId = ans[0].id;
            resolve(newDeptId);
        })
    })
}

// Promise to find role id from title chosen
const getRoleId = (input) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT id FROM role WHERE title = (?)', [input], (err, ans) => {
            if (err) reject(err);
            const newRoleId = ans[0].id;
            resolve(newRoleId);
        })
    })
}

// Promise to find employee id from manager chosen
const getEmployeeId = (input) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT id FROM employee WHERE first_name = (?) AND last_name = (?)', [input.split(" ")[0], input.split(" ")[1]], (err, ans) => {
            if (err) reject(err);
            const newEmployeeId = ans[0].id;
            resolve(newEmployeeId);
        })
    })
}

// Function to add a role
async function addRole() {
    try {
        const deptList = await listDepartments();
        const data = await inquirer.prompt([
            {
                type: 'input',
                message: 'What is the name of the new role?',
                name: 'newRoleName',
            }, {
                type: 'input',
                message: 'What is the salary?',
                name: 'newRoleSalary'
            }, {
                type: 'rawlist',
                message: 'What department is it in?',
                choices: deptList,
                name: 'newRoleDepart',
            }
        ])
        const newDeptId = await getDepartmentId(data.newRoleDepart);
        db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [data.newRoleName, data.newRoleSalary, newDeptId], (err, ans) => {
            if (err) throw err;
            console.log("New role successfully added.");
            initMenu();
        })
    }
    catch (err) {
        console.log(err);
        initMenu();
    }
}

// Function to delete a role
async function deleteRole() {
    try {
        const rolesList = await listRoles(); // Implement a function to list all roles

        const data = await inquirer.prompt([
            {
                type: 'list',
                message: 'Select the role to delete:',
                choices: rolesList,
                name: 'roleToDelete',
            }
        ]);

        const roleId = await getRoleId(data.roleToDelete); // Implement a function to get the role id

        db.query('DELETE FROM role WHERE id = ?', [roleId], (err, ans) => {
            if (err) throw err;
            console.log("Role successfully deleted.");
            initMenu();
        });
    } catch (err) {
        console.log(err);
        initMenu();
    }
}

// Function to add an employee
async function addEmployee() {
    try {
        const roleList = await listRoles();
        const employeeList = await listEmployees();
        const data = await inquirer.prompt([
            {
                type: 'input',
                message: 'What is the new employees first name?',
                name: 'newEmpFirst',
            }, {
                type: 'input',
                message: 'What is the new employees last name?',
                name: 'newEmpLast',
            }, {
                type: 'rawlist',
                message: 'What is their role?',
                choices: roleList,
                name: 'newEmpRole',
            }, {
                type: 'rawlist',
                message: 'Who is their manager?',
                choices: employeeList,
                name: 'newEmpManager',
            }
        ])
        const newRoleId = await getRoleId(data.newEmpRole);
        const newManagerId = await getEmployeeId(data.newEmpManager);
        db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [data.newEmpFirst, data.newEmpLast, newRoleId, newManagerId], (err, ans) => {
            if (err) throw err;
            console.log("New employee successfully added.");
            initMenu();
        })
    }
    catch (err) {
        console.log(err);
        initMenu();
    }
}

// Function to delete an employee
async function deleteEmployee() {
    try {
        const employeeList = await listEmployees();

        const data = await inquirer.prompt([
            {
                type: 'rawlist',
                message: 'Select the employee to delete:',
                choices: employeeList,
                name: 'employeeToDelete',
            }
        ]);

        const employeeId = await getEmployeeId(data.employeeToDelete);

        db.query('DELETE FROM employee WHERE id = ?', [employeeId], (err, ans) => {
            if (err) throw err;
            console.log('Employee successfully deleted.');
            initMenu();
        });
    } catch (err) {
        console.log(err);
        initMenu();
    }
}

// Function to update an employees role
async function updateEmployee() {
    try {
        const employeeList = await listEmployees();
        const roleList = await listRoles();
        const data = await inquirer.prompt([
            {
                type: 'rawlist',
                message: 'Which employees role would you like to update?',
                choices: employeeList,
                name: 'chosenEmployee'
            }, {
                type: 'rawlist',
                message: 'What is their new role?',
                choices: roleList,
                name: 'newRole'
            }
        ])
        const empId = await getEmployeeId(data.chosenEmployee);
        const newRole = await getRoleId(data.newRole);
        db.query('UPDATE employee SET role_id = (?) WHERE id = (?)', [newRole, empId], (err, ans) => {
            if (err) throw err;
            console.log("Employee role successfully updated.");
            initMenu();
        })
    }
    catch (err) {
        console.log(err);
        initMenu();
    }
}

// ============ total utilized budget of a department ===========
function ViewTotalUtilizedBudgetByDepartment() {
    // total budget: department, sum of salaries
    const query = `SELECT department.name AS department, 
   SUM(role.salary) AS utilized_budget FROM employee 
   LEFT JOIN role ON employee.role_id = role.id 
   LEFT JOIN department ON role.department_id = department.id 
   GROUP BY department.name;`;
    db.query(query, (err, data) => {
        if (err) throw err;
        console.table(data);
        initMenu();
    });
}
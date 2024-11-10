import inquirer from 'inquirer';
import { pool, connectToDb } from './connections.js';
await connectToDb();
// Create tables
async function createTables() {
    pool.query(`
        CREATE TABLE IF NOT EXISTS departments (
            id SERIAL PRIMARY KEY,
            name VARCHAR(30) UNIQUE NOT NULL
        );
    `);
    pool.query(`
        CREATE TABLE IF NOT EXISTS roles (
            id SERIAL PRIMARY KEY,
            title VARCHAR(30) UNIQUE NOT NULL,
            salary DECIMAL NOT NULL,
            department_id INTEGER NOT NULL REFERENCES departments(id)
        );
    `);
    pool.query(`
        CREATE TABLE IF NOT EXISTS employees (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(30) NOT NULL,
            last_name VARCHAR(30) NOT NULL,
            role_id INTEGER NOT NULL REFERENCES roles(id),
            manager_id INTEGER REFERENCES employees(id)
        );
    `);
}
async function seeds() {
    pool.query(`
        INSERT INTO departments (name) VALUES ('Engineering');
        INSERT INTO departments (name) VALUES ('Human Resources');
        INSERT INTO departments (name) VALUES ('Sales');
        INSERT INTO departments (name) VALUES ('Marketing');
        INSERT INTO departments (name) VALUES ('Finance');

        INSERT INTO roles (title, salary, department_id) VALUES ('Software Engineer', 80000, 1);
        INSERT INTO roles (title, salary, department_id) VALUES ('Engineering Manager', 120000, 1);
        INSERT INTO roles (title, salary, department_id) VALUES ('HR Specialist', 60000, 2);
        INSERT INTO roles (title, salary, department_id) VALUES ('Sales Associate', 50000, 3);
        INSERT INTO roles (title, salary, department_id) VALUES ('Sales Manager', 110000, 3);
        INSERT INTO roles (title, salary, department_id) VALUES ('Marketing Specialist', 55000, 4);
        INSERT INTO roles (title, salary, department_id) VALUES ('Finance Analyst', 65000, 5);
        INSERT INTO roles (title, salary, department_id) VALUES ('Product Manager', 95000, 1);
        INSERT INTO roles (title, salary, department_id) VALUES ('HR Manager', 100000, 2);

        INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Alice', 'Johnson', 2, NULL);
        INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Eve', 'Adams', 1, 1);
        INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Frank', 'Castle', 1, 1); 
        INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Grace', 'Hopper', 8, 1);

        INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Bob', 'Smith', 9, NULL); 
        INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Carol', 'White', 3, 5);

        INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Charlie', 'Brown', 5, NULL); 
        INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('David', 'Lee', 4, 7); 
        INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Emma', 'Jones', 4, 7);

        INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Diana', 'Prince', 6, NULL); 

        INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Hank', 'Pym', 7, NULL); 

        INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Ivy', 'Green', 4, 7); 
        INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Jack', 'Black', 6, 1); 
        INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Liam', 'Smith', 7, 1);
`);
}
// Functions to display data
function viewDepartments() {
    pool.query(`SELECT * FROM departments`, (err, result) => {
        if (err) {
            console.log(`${err}`);
        }
        else {
            let post = (result.rows.length > 0) ? result.rows : null;
            console.table(post);
        }
    });
}
function viewRoles() {
    pool.query(`SELECT roles.id, title, salary, departments.name 
        FROM roles 
        JOIN departments ON roles.department_id = departments.id;`, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            let post = (result.rows.length > 0) ? result.rows : null;
            console.table(post);
        }
    });
}
function viewEmployees() {
    pool.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, 
        managers.first_name || ' ' || managers.last_name AS manager
        FROM employees 
        LEFT JOIN roles ON employees.role_id = roles.id 
        LEFT JOIN departments ON roles.department_id = departments.id 
        LEFT JOIN employees AS managers ON employees.manager_id = managers.id;`, (err, result) => {
        if (err) {
            console.log(`${err}`);
        }
        else {
            let post = (result.rows.length > 0) ? result.rows : null;
            console.table(post);
        }
    });
}
// Functions to add data
async function addDepartment() {
    const { name } = await inquirer.prompt([{ type: 'input', name: 'name', message: 'Enter the name of the department:' }]);
    pool.query("INSERT INTO departments (name) VALUES ($1)", [name]);
    console.log("Department added.");
}
async function addRole() {
    const { title, salary, department_id } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Enter the role title:' },
        { type: 'input', name: 'salary', message: 'Enter the salary:' },
        { type: 'input', name: 'department_id', message: 'Enter the department ID:' },
    ]);
    await pool.query("INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)", [title, salary, department_id]);
    console.log("Role added.");
}
async function addEmployee() {
    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        { type: 'input', name: 'first_name', message: "Enter the employee's first name:" },
        { type: 'input', name: 'last_name', message: "Enter the employee's last name:" },
        { type: 'input', name: 'role_id', message: 'Enter the role ID:' },
        { type: 'input', name: 'manager_id', message: 'Enter the manager ID (press Enter if none):', default: null },
    ]);
    await pool.query("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)", [first_name, last_name, role_id, manager_id ? manager_id : null]);
    console.log("Employee added.");
}
async function updateEmployeeRole() {
    const { employee_id, new_role_id } = await inquirer.prompt([
        { type: 'input', name: 'employee_id', message: 'Enter the employee ID to update:' },
        { type: 'input', name: 'new_role_id', message: 'Enter the new role ID:' },
    ]);
    await pool.query("UPDATE employees SET role_id = $1 WHERE id = $2", [new_role_id, employee_id]);
    console.log("Employee role updated.");
}
async function init() {
    await createTables();
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'Enter Seeded Data?',
            choices: ['Yes', 'No'],
        },
    ])
        .then(async (answers) => {
        switch (answers.choice) {
            case 'Yes':
                await seeds();
                console.log("Database Seeded Successfully");
                main();
                break;
            case 'No':
                console.log("Seeded Data not entered.");
                main();
                break;
        }
    });
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Main application loop
function main() {
    let keepGoing = true;
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit'],
        },
    ]).then(async (answers) => {
        if (answers.choice === 'View all departments') {
            viewDepartments();
        }
        else if (answers.choice === 'View all roles') {
            viewRoles();
        }
        else if (answers.choice === 'View all employees') {
            viewEmployees();
        }
        else if (answers.choice === 'Add a department') {
            await addDepartment();
        }
        else if (answers.choice === 'Add a role') {
            await addRole();
        }
        else if (answers.choice === 'Add an employee') {
            await addEmployee();
        }
        else if (answers.choice === 'Update an employee role') {
            await updateEmployeeRole();
        }
        else if (answers.choice === 'Exit') {
            console.log("Goodbye!");
            keepGoing = false;
        }
        else {
            console.log("Invalid option, please try again.");
        }
        if (keepGoing) {
            await delay(10);
            main();
        }
    });
}
init();

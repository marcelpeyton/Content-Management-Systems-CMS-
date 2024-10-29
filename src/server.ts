import inquirer from 'inquirer';
import express from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';

await connectToDb();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
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
// Functions to display data
function viewDepartments() {
    pool.query(
        `SELECT * FROM departments`,
        (err: Error, result: QueryResult) => {
        if (err) {
        console.log(err);
        } 
        });
}

function viewRoles() {
    pool.query(
        `SELECT roles.id, title, salary, departments.name 
        FROM roles 
        JOIN departments ON roles.department_id = departments.id;`,
        (err: Error, result: QueryResult) => {
        if (err) {
        console.log(err);
        } 
        });
}

function viewEmployees() {
    pool.query(
        `SELECT employees.id, first_name, last_name, roles.title, departments.name, roles.salary, 
        managers.first_name || ' ' || managers.last_name AS manager
        FROM employees 
        LEFT JOIN roles ON employees.role_id = roles.id 
        LEFT JOIN departments ON roles.department_id = departments.id 
        LEFT JOIN employees AS managers ON employees.manager_id = managers.id;`,
        (err: Error, result: QueryResult) => {
        if (err) {
            console.log(err);
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

// Main application loop
async function main() {
    await createTables();
    while (true) {
        console.log("\nOptions:");
        console.log("1. View all departments");
        console.log("2. View all roles");
        console.log("3. View all employees");
        console.log("4. Add a department");
        console.log("5. Add a role");
        console.log("6. Add an employee");
        console.log("7. Update an employee role");
        console.log("8. Exit");
        
        const { choice } = await inquirer.prompt([{ type: 'input', name: 'choice', message: 'Choose an option:' }]);

        switch (choice) {
            case '1':
                await viewDepartments();
                break;
            case '2':
                await viewRoles();
                break;
            case '3':
                await viewEmployees();
                break;
            case '4':
                await addDepartment();
                break;
            case '5':
                await addRole();
                break;
            case '6':
                await addEmployee();
                break;
            case '7':
                await updateEmployeeRole();
                break;
            case '8':
                process.exit();
            default:
                console.log("Invalid option, please try again.");
        }
    }
}

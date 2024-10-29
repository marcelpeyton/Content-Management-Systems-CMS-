-- Insert example departments
INSERT INTO departments (name) VALUES ('Engineering');
INSERT INTO departments (name) VALUES ('Human Resources');
INSERT INTO departments (name) VALUES ('Sales');
INSERT INTO departments (name) VALUES ('Marketing');
INSERT INTO departments (name) VALUES ('Finance');

-- Insert example roles with department references
INSERT INTO roles (title, salary, department_id) VALUES ('Software Engineer', 80000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ('Engineering Manager', 120000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ('HR Specialist', 60000, 2);
INSERT INTO roles (title, salary, department_id) VALUES ('Sales Associate', 50000, 3);
INSERT INTO roles (title, salary, department_id) VALUES ('Sales Manager', 110000, 3);
INSERT INTO roles (title, salary, department_id) VALUES ('Marketing Specialist', 55000, 4);
INSERT INTO roles (title, salary, department_id) VALUES ('Finance Analyst', 65000, 5);
INSERT INTO roles (title, salary, department_id) VALUES ('Product Manager', 95000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ('HR Manager', 100000, 2);

-- Insert example employees with role and manager references
-- Engineering Department
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Alice', 'Johnson', 2, NULL); -- Engineering Manager (no manager)
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Eve', 'Adams', 1, 1); -- Software Engineer reporting to Alice
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Frank', 'Castle', 1, 1); -- Software Engineer reporting to Alice
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Grace', 'Hopper', 8, 1); -- Product Manager reporting to Alice

-- Human Resources Department
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Bob', 'Smith', 9, NULL); -- HR Manager (no manager)
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Carol', 'White', 3, 5); -- HR Specialist reporting to Bob

-- Sales Department
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Charlie', 'Brown', 5, NULL); -- Sales Manager (no manager)
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('David', 'Lee', 4, 7); -- Sales Associate reporting to Charlie
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Emma', 'Jones', 4, 7); -- Sales Associate reporting to Charlie

-- Marketing Department
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Diana', 'Prince', 6, NULL); -- Marketing Specialist (no manager)

-- Finance Department
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Hank', 'Pym', 7, NULL); -- Finance Analyst (no manager)

-- Cross-Department Reporting Structure
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Ivy', 'Green', 4, 7); -- Sales Associate under Sales Manager Charlie
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Jack', 'Black', 6, 1); -- Marketing Specialist reporting to Engineering Manager Alice
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Liam', 'Smith', 7, 1); -- Finance Analyst reporting to Engineering Manager Alice

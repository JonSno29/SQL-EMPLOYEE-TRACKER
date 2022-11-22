-- DEPARTMENT SEEDS
INSERT INTO departments (id, name)
VALUES (1, "Sales"),
       (2, "Engineering"),
       (3, "Finance"),
       (4, "Legal");

-- ROLES
INSERT INTO roles (department_id, title, salary)
VALUES (1, "Sales Lead", 40000),
       (1, "Salesperson", 40000),
       (2, "Lead Engineer", 50000),
       (2, "Software Engineer", 40000),
       (3, "Accountant Manager", 46000),
       (3, "Accountant", 60000),
       (4, "Legal Team Lead", 90000),
       (4, "Lawyer", 80000);

-- EMPLOYEES
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Jon", "Snover", 1, 1),
       ("John", "Doenut", 2, 1),
       ("Bill", "Gates", 3, 2),
       ("Issac", "Newton", 4, 2),
       ("Kimbo", "Slice", 5, 3), 
       ("Don", "Keedic", 6, 3),
       ("Milania", "Stump", 7, 4),
       ("Wayne", "Kerr", 8, 4);
       
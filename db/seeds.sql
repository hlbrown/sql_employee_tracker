USE employee_db;

DELETE FROM department;

INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

DELETE FROM role;

INSERT INTO role (title, salary, department_id)
    VALUES ("Salesperson", 80000, 1),
           ("Lead Engineer", 150000, 2),
           ("Software Engineer", 120000, 2),
           ("Account Manager", 160000, 3),
           ("Accountant", 125000, 3),
           ("Legal Team Lead", 250000, 4),
           ("Lawyer", 190000, 4),
           ("Lawyer", 175000, 4);

DELETE FROM employee;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ("Mary", "Jane", 1, NULL),
           ("Mike", "Chan", 2, NULL),
           ("Ashley", "Rodriguez", 3, 1),
           ("Kevin", "Tupik", 4, 2),
           ("Kunal", "Singh", 5, NULL),
           ("Malia", "Brown", 6, 7),
           ("Sarah", "Lourd", 7, NULL),
           ("Tom", "Allen", 8, 4);

# sql_employee_tracker

## Walk through video link

https://youtu.be/Q3FuihD61f4

## GitHub Repo
https://github.com/hlbrown/sql_employee_tracker



## How to start
 The first thing you'll need to do is run npm i to get all of the correct files needed to run the application. After that step is complete you'll need to run ' node server.js '. the application should begin asking you questions and await your input. Once your input is given the database will show the given tables depending on the request the user sends. 
 
## Expected Behavior
GIVEN a command-line application that accepts user input

✅✅ WHEN I start the application
THEN I am presented with the following options: 
✔ view all departments, 
✔ view all roles, 
✔ view all employees, 
✔ add a department, 
✔ add a role, 
✔ add an employee, 
✔ and update an employee role

✅✅WHEN I choose to view all departments
THEN I am presented with a formatted table showing department 
✔ names 
✔ and department ids

✅✅WHEN I choose to view all roles
THEN I am presented with the 
✔ job title, 
✔ role id, 
✔ the department 
✔ that role belongs to, 
✔ and the salary for that role

✅✅WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including
✔ employee ids,
✔ first names, 
✔ last names, 
✔ job titles, 
✔ departments, 
✔ salaries, 
✔ and managers that the employees report to

✅✅ WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database

✅✅WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

✅✅WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

✅✅WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

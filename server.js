const mysql = require('mysql2');
const inquirer = require('inquirer');


let managers = [];
let roles = [];
let depts = [];
let empFN = [];
let mgrId = [];
let roleID = [];
//const promiseSQL = require("promise-mysql");

const role = require('./lib/Role');
//const department = require('./lib/Department');
const employee = require('./lib/Employee');


//Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //MYSQL username
        user: 'root',
        //MYSQL password mine is blank
        password: '',
        //Database to connect to
        database: 'employee_db'
    },
   

);
db.connect(()=>{
    console.log(`Connected to the employee_db database`);
    startingPrompt();
});


function startingPrompt(){
    inquirer.prompt([
        {
            type: "list",
            message:"What would you like to do?",
            choices:["view all departments", "view all employees","view all roles", "add a department", "add a role", "add an employee", "update an employee role"],
            name: "userSelection"
        }
    ])
        .then(data => {
            switch (data.userSelection){
                case "view all departments":
                    viewAllDepartments();
                    break;
                case "view all employees":
                    viewAllEmployees();
                    break;
                case "view all roles":
                    viewAllRoles();
                    break;
                case "add a department":
                    addDepartment();
                    break;
                case "add an employee":
                    addEmployee();
                    break;
                case "add a role":
                    addRole();
                    break;
                case "update an employee role":
                   updateRole();
                   break;
            }   
        });
}

//create managers array
function manager(){
    const query = `SELECT m.id, CONCAT(m.first_name, " ", m.last_name) AS manager_name FROM employee e INNER JOIN employee m ON e.manager_id = m.id;`;
        db.query(query, function(err, res) {
            if(err) throw err;
           for (let i = 0; i < res.length; i++){
               managers.push(res[i].manager_name);
           }
           managers.push('null');//ensuring null is allowed for the employees that do not report to a manger
        });
}

function makeDepartments(){
    const query = `SELECT id, name FROM department`;

    db.query(query, function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++){
            depts.push(res[i].name);
        }
    })
}
function makeRoles(){
  const query = `SELECT id, title FROM role;`;

    db.query(query, function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++){
            roles.push(res[i].title);
         
        }
    });
}
function createRoleID(){
    const query = `SELECT id, title FROM role;`;

    db.query(query, function (err, res) {
        if (err) throw err;
        for (let i = 0; i< res.length; i++){
            roleID.push(res[i]);
        }

    })

}

function managerIdArray(){
    const query = `SELECT DISTINCT CONCAT(a.first_name, " ", a.last_name) AS "manager_name", a.id AS "manager_id" FROM employee e LEFT JOIN employee a ON e.manager_id = a.id;`;

    db.query(query, function (err, res){
        if (err) throw err;
        for(let i = 0; i < res.length; i++){
            mgrId.push(res[i]);
        }
    })
}

function getempFN(){
    const query = `SELECT first_name FROM employee`;

    db.query(query, (err, res) => {
        if (err) throw err;
        for(let i = 0;i < res.length; i++ ){
            empFN.push(res[i].first_name);
        }
    })
}
////////////////// FUNCTIONS FOR VIEWING PORTIONS OF THE DATABASE ////////////////

//View all the departments
function viewAllDepartments(){
    const query = "SELECT id, name FROM department;";  
    db.query(query, function (err, table) {
        if (err){
            console.log(err);
        }
        console.table(table)
        startingPrompt();
         
    
        });
}

//view all employees
function viewAllEmployees(){
    const query = `SELECT e.id AS "ID", e.first_name AS "First Name", e.last_name AS "Last Name", d.name AS "Department Name", r.title AS "Role Title", r.salary AS "Salary", CONCAT(x.first_name, " ", x.last_name) AS "Manager Name"
    FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON d.id = r.department_id LEFT JOIN employee x ON e.manager_id = x.id`;

    db.query(query, function (err, results) {
        if(err) throw err;
        console.table(results);
        startingPrompt();       
               
    });
}

//View all roles
function viewAllRoles(){
    const query = `SELECT r.title AS "Title", r.id AS "Role ID", d.name AS "Department Name", r.salary AS "Salary" FROM role r LEFT JOIN department d ON d.id = r.department_id`;

    db.query(query, (err, results) => {
        if(err) throw err;
        console.table(results);
        startingPrompt();
    })
}

/////////////////////////// FUNCTIONS FOR ADDING TO THE DATABASE /////////////////

//add department
function addDepartment() {
    inquirer.prompt({
        name: "departmentName",
        type: "input",
        message: "Enter the name of the new department:",
    })
    .then(data => {
        db.query(`INSERT INTO department (name) VALUES ("${data.departmentName}");`,
        (err, res) => {
            if(err) {
                console.log(err);
            }
            viewAllDepartments();
            startingPrompt();
        });
    });
}
//Add employee

function addEmployee(){


    inquirer.prompt([
        {
            type: 'input',
            message: "Enter employee's first name:",
            name: "first_name",
            validate: function (validEntry) {
                letters = /^[A-Za-z]+$/.test(validEntry); //RegExp to test the user is entering letters for the name
                if(letters){
                    return true;
                } else {
                    console.log(`Invalid Submission. Please choose a valid letter from A-Z or a-z!`);
                    return false;
                }
            }
        },
        {
            type: "input",
            message: "Enter employee's last name:",
            name: "last_name",
            validate: function (valid) {
                letters = /^[A-Za-z]+$/.test(valid);
                if (letters) {
                    return true;
                } else {
                    console.log(`Invalid entry try again`);
                }
                return false;
            }
        },
        {
            name: 'role',
            type: "list",
            message: "Choose the employees role:",
            choices: roles,
        },
        {
            name: "manager",
            type: "list",
            message: "Enter manger's name:",
            choices: managers,
        },
    ])
    .then(data => {
        let empployeeFirstName = data.first_name;
        let employeeLastName = data.last_name;

        function getRoleID(){
            for (let p = 0; p < roleID.length; p++){
                if(roleID[p].title === data.role){
                    return roleID[p].id;
                }
            }
        }

        function getManagerID(){
            for (let q = 0; q < mgrId.length; q++){
                if(mgrId[q].manager_name === data.manager){
                    return mgrId[q].manager_id;
                }
            }
        }
       
        let employeeRole = getRoleID();
        let employeeManager = getManagerID();

        let addNewEmp = new employee(empployeeFirstName, employeeLastName, employeeRole, employeeManager);

    

        db.query('INSERT INTO employee SET ?', addNewEmp, err => {
            if (err) throw err;
            viewAllEmployees();
        });
        startingPrompt();
})
}
//add roles
function addRole(){
    
    inquirer.prompt([
        {
            name: "newRole",
            type: "input",
            message: "What is the role of this position?",
        },
        {
            name: "salary",
            type: "number",
            message: "Enter Salary",
        },       
        
    ])
    .then(data => {
        //initializing the data to add to the database
        let newRoleName = data.newRole; 
        let newRoleSalary = data.salary;
        let newRoleId = roles.length + 1;

        let addNewRole = new role(newRoleName, newRoleSalary, newRoleId);
        db.query(`INSERT INTO role SET ?`, addNewRole, function (err, res) {//adding the role to the database
                if (err) throw err;
                viewAllRoles();//showing the updated list of roles
        });
        startingPrompt();
    });
}

/////Function to update employee role

function updateRole(){
    inquirer.prompt([
        {
            name: 'first_name',
            type: 'list',
            message: 'Choose employees role to update',
            choices: empFN,

        },
    ])
    .then(data => {
        const query = `SELECT last_name FROM employee WHERE first_name = ?`;

        db.query(query, [data.first_name], (err, res) => {
            let firstNameRoleUpdate = data.first_name;
            inquirer.prompt([{
                name: 'last_name',
                type: 'list',
                message: 'Enter the last name of the employees role you want to update',
                choices: function () {
                    let lastNameArray = [];
                    for (let i = 0; i < res.length; i++){
                        lastNameArray.push(res[i].last_name);
                    }
                    return lastNameArray;
                },
            },
        ])
        .then(data => {
            let lastNameRoleUpdate = data.last_name;
            const query = `SELECT id FROM employee WHERE first_name = ? AND last_name = ?`;

            db.query(query, [firstNameRoleUpdate, lastNameRoleUpdate], (err, res) => {
                inquirer.prompt([
                    {
                        name: 'id',
                        type: 'list',
                        message: 'Enter the ID of the employee to update their role.',
                        choices: function(){
                            let empID = [];
                            for (let m =0; m < res.length; m++){
                                empID.push(res[m].id);
                            }
                            return empID;
                        },
                    },
                ])
                .then(data =>{
                    let roleUpdateByID = data.id;
                    inquirer.prompt([
                        {
                            name:'role_title',
                            type: 'list',
                            message: 'Enter a new role for the employee:',
                            choices: roles,
                        },
                    ])
                    .then(data => {
                        let newRole = data.role_title;

                        function getNewRoleID(){
                            for (let q = 0; q < roleID.length; q++){
                                if(roleID[q].title === data.role_title){
                                    return roleID[q].id;
                                }
                            }
                        }
                        let updateRoleID = getNewRoleID();
                        inquirer.prompt([
                            {
                                name: 'removed',
                                type: 'list',
                                message: 'Confirm Update:',
                                choices: ['YES', 'NO'],
                            },
                        ])
                        .then(data => {
                            if (data.removed === 'YES'){
                                db.query('UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ? AND id =?', [updateRoleID, firstNameRoleUpdate, lastNameRoleUpdate, roleUpdateByID], (err, res) => {
                                    if (err) throw err;
                                })
                                startingPrompt();
                            }
                        });
                    });
                });
            });
        });
        });
    })
}

db.connect(function (err) {
    if (err) throw err;
    makeRoles();
    makeDepartments();
    createRoleID();
    manager();
    getempFN();
    managerIdArray();
})
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require('console.table');


const connection = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: 'D0lph1ns1399$',
        database: 'employeeDB'
    },
    console.log('Connected to the Employee Database.'),
    );

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    console.table(`
 =================================================== 
 ╔═══╗     ╔╗               ╔═╗╔═╗
 ║╔══╝     ║║               ║║╚╝║║
 ║╚══╦╗╔╦══╣║╔══╦╗ ╔╦══╦══╗ ║╔╗╔╗╠══╦═╗╔══╦══╦══╦═╗
 ║╔══╣╚╝║╔╗║║║╔╗║║ ║║║═╣║═╣ ║║║║║║╔╗║╔╗╣╔╗║╔╗║║═╣╔╝
 ║╚══╣║║║╚╝║╚╣╚╝║╚═╝║║═╣║═╣ ║║║║║║╔╗║║║║╔╗║╚╝║║═╣║
 ╚═══╩╩╩╣╔═╩═╩══╩═╗╔╩══╩══╝ ╚╝╚╝╚╩╝╚╩╝╚╩╝╚╩═╗╠══╩╝
        ║║      ╔═╝║                     ╔═╝║
        ╚╝      ╚══╝                     ╚══╝
 ===================================================  
   `)
 mainMenu();
});
        
const mainMenu = () => {
    inquirer
    .prompt ([
        {
        type:"list",
        name:"options",
        message:"What would you like to do?",
        choices: [
            "View all departments",
            "View all roles",
            "view all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee's role",
            "Update a Manager",
            "Quit"]      
    }])
.then (answer => {
    const {options} = answer;

    if(options === "View all departments"){
        viewDepartments();
    }
    if(options === "View all roles"){
        viewRoles();
    }
    if(options === "View all employees"){
        viewEmployees();
    }
    if(options === "Add a department"){
      addDepartment();
    }
    if(options === "Add a role"){
      addRole();
    }
    if(options === "Add an employee"){
      addEmployee();
    }
    if(options === "Update an employee's role"){
      updateEmployee();
    }
    if (options === "Update a Manager"){
        updateManager();
    }
    if(options === "Quit"){
        connection.end();
      }
    });
  };
//-------------View current departments----------------------
const viewDepartments = () => {
        return new Promise((res, reject) => {
            console.log("Viewing all department\n");

        const sqlQuery = `SELECT department.id AS ID, department.name AS Department FROM department`;

            connection.query(sqlQuery, (err,rows)=>{
                if(err){
                    return reject(err);
                } 
                console.table(rows);
                mainMenu();
        });    
    });
};   
//-------------View current roles----------------------
const viewRoles = () => {
    return new Promise((res, reject)=>{
        console.log("Viewing all roles\n");

    const sqlQuery = `SELECT role.id, role.title, department.name AS Department FROM role
            INNER JOIN department ON role.department_id = department.id`;  

            connection.query(sqlQuery, (err,rows)=>{
                if(err){
                    return reject(err);
                } 
                console.table(rows);
                mainMenu();
        });    
    });
};
//-------------View current employee's----------------------
const viewEmployees = () => {
    return new Promise((res, reject)=>{
    console.log("Viewing all employees\n");

    const sqlQuery = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS Department, role.salary,
                        CONCAT (manager.first_name, " ", manager.last_name) AS Manager
                        FROM employee
                        LEFT JOIN role ON employee.role_id = role.id
                        LEFT JOIN department ON role.department_id = department.id 
                        LEFT JOIN employee manager ON employee.manager_id = manager.id`;

            connection.query(sqlQuery, (err,rows)=>{
                if(err){
                    return reject(err);
                } 
                console.table(rows);
                mainMenu();
        });    
    });
};
//-------------Add a department ----------------------   
const addDepartment = () => {
    return new Promise((res, reject)=>{
        inquirer.prompt([
            {
              type: 'input', 
              name: 'addDept',
              message: "What department do you want to add?",
              validate: addDept => {
                if (addDept) {
                    return true;
                } else {
                    console.log('Please enter a department');
                    return false;
                }
              }
            }
          ])
          .then(answer => {
              sqlQuery = `INSERT INTO department (name) VALUES ("${answer.addDept}")`;

              connection.query(sqlQuery, (err,rows)=>{
                if(err){
                    return reject(err);
                }
                console.log('Added ' + answer.addDept + " to departments!");
                viewDepartments(); 
            });
        });
    });
}
//-------------Add a role----------------------
const addRole = () => {
    return new Promise((res, reject)=>{
        inquirer.prompt([
            {
                type: 'input', 
                name: 'role',
                message: "What role do you want to add?",
                validate: addRole => {
                  if (addRole) {
                      return true;
                  } else {
                      console.log('Please enter a role');
                      return false;
                  }
                }
              },
              {
                type: 'input', 
                name: 'salary',
                message: "What is the salary of this role?",    
            }
        ])
            .then(answer => {
                const params = [answer.role, answer.salary];

                const roleQuery = `SELECT name, id FROM department`;

                connection.query(roleQuery, (err,data)=>{
                    if(err){
                        return reject(err);
                    }

                    const dept = data.map(({ name, id }) => ({ name: name, value: id }));

                    inquirer.prompt([
                {
                  type: 'list', 
                  name: 'dept',
                  message: "What department is this role in?",
                  choices: dept
                }
                ])
                .then(deptChoice => {
                    const dept = deptChoice.dept;
                    params.push(dept);

                    const sqlQuery =  `INSERT INTO role (title, salary, department_id)
                    VALUES (?, ?, ?)`;

                    connection.query(sqlQuery, params, (err,rows)=>{
                        if(err){
                            return reject(err);
                        }
                        console.log('Added' + answer.role + " to roles!");
                        viewRoles();
                    });
                });
            });
        });
    });
};
//-------------Add an employee ----------------------
const addEmployee = () => {
    return new Promise((res, reject)=>{
        inquirer.prompt([
            {
              type: 'input',
              name: 'fistName',
              message: "What is the employee's first name?",
              validate: addFirst => {
                if (addFirst) {
                    return true;
                } else {
                    console.log('Please enter a first name');
                    return false;
                }
              }
            },
            {
              type: 'input',
              name: 'lastName',
              message: "What is the employee's last name?",
              validate: addLast => {
                if (addLast) {
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }
              }
            }
          ])
          .then(answer =>{
              const params = [answer.fistName, answer.lastName]
              const roleQuery = `SELECT role.id, role.title FROM role`;
              
              connection.query(roleQuery, (err,data)=>{
                if(err){
                    return reject(err);
                }
                const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                      type: 'list',
                      name: 'role',
                      message: "What is the employee's role?",
                      choices: roles
                    }
                  ])
                  .then(roleChoice => {
                      const role = roleChoice.role;
                      params.push(role);

                    const managerSQL = `SELECT * FROM employee`;

                    connection.query(managerSQL, (err,data)=>{
                        if(err){
                            return reject(err);
                        }
                        const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

                        inquirer.prompt([
                            {
                              type: 'list',
                              name: 'manager',
                              message: "Who is the employee's manager?",
                              choices: managers
                            }
                          ])
                          .then(managerChoice =>{
                              const manager = managerChoice.manager;
                              params.push(manager);

                              const sqlQuery = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

                              connection.query(sqlQuery, params, (err,result) =>{
                                if(err){
                                    return reject(err);
                                }
                                console.log("Employee added successfully!")
                                viewEmployees();
                            });
                        });
                    });
                });
            });
        });
    });
}
//-------------Update an employee ----------------------
const updateEmployee = () => {
    return new Promise((res, reject)=>{
        const employeeQuery = `SELECT * FROM employee`;

        connection.query(employeeQuery, (err,data)=>{
            if(err){
                return reject(err);
            }
            const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

            inquirer.prompt([
                {
                  type: 'list',
                  name: 'name',
                  message: "Which employee would you like to update?",
                  choices: employees
                }
              ])
              .then(empChoice =>{
                  const employee = empChoice.name;
                  const params = [];
                  params.push(employee);

                  const roleQuery = `SELECT * FROM role`;
                  connection.query(roleQuery, (err,data)=>{
                    if(err){
                        return reject(err);
                    }
                    const roles = data.map(({ id, title }) => ({ name: title, value: id }));
                    inquirer.prompt([
                        {
                          type: 'list',
                          name: 'role',
                          message: "What is the employee's new role?",
                          choices: roles
                        }
                      ])
                      .then(roleChoice =>{
                          const role = roleChoice.role;
                          params.push(role);

                    let employee = params[0]
                    params[0] = role
                    params[1] = employee

                    const sqlQuery = `UPDATE employee SET role_id = ? WHERE id = ?`;
                    connection.query(sqlQuery, params, (err,results)=> {
                        if(err){
                            return reject(err);
                        }
                        console.log("Employee has been updated!");
                        viewEmployees();
                    });
                });
              });
            });
        });
    });
};
//-------------Update Manager ------------------

const updateManager = () => {
    return new Promise((res, reject)=>{
        const employeeQuery = `SELECT * FROM employee`;

        connection.query(employeeQuery, (err,data)=>{
            if(err){
                return reject(err);
            }
            const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

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

                const managerQuery = `SELECT * FROM employee`;
                connection.query(employeeQuery, (err,data)=>{
                    if(err){
                        return reject(err);
                    }
                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

                    inquirer.prompt([
                        {
                          type: 'list',
                          name: 'manager',
                          message: "Who is the employee's manager?",
                          choices: managers
                        }
                      ])
                          .then(managerChoice => {
                            const manager = managerChoice.manager;
                            params.push(manager); 
                            
                            let employee = params[0]
                            params[0] = manager
                            params[1] = employee

                            const sqlQuery = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                            connection.query(sqlQuery, params, (err,data)=>{
                                if(err){
                                    return reject(err);
                                }
                                console.log("Employee has been updated!");
                                viewEmployees();
                            });
                        });
                      });
                    });
                });
            });
        };
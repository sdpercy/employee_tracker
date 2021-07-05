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
      addDepartmentInput();
    }
    if(options === "Add a role"){
      addRoleInput();
    }
    if(options === "Add an employee"){
      addEmployeeInput();
    }
    if(options === "Update an employee's role"){
      updateRoleInput();
    }
    if(options === "Quit"){
      quit();
      }
    });
  };

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

const viewEmployees = () => {
    return new Promise((res, reject)=>{
    console.log("Viewing all employees\n");

    const sqlQuery = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS Department, role.salary, employee.
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
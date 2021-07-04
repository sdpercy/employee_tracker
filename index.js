const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
const consoleTable = require('console.table');

async function connect() {
        const con = await mysql.createConnection({
                host: 'localhost',
                // Your MySQL username,
                user: 'root',
                // Your MySQL password
                password: 'D0lph1ns1399$',
                database: 'employeeDB'
        });
        
        con.connect(function (err, con) {
            if (err) throw err;
            console.log('Connected to the employeeDB database.');
        })

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
    }
    

const mainMenu = async () => {
    try {
        let result = await inquirer.prompt({
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
        });
        switch (result.options) {
            case "View all departments":
                viewDepartments();
                break;

            case "View all roles":
                viewRoles();
                break;

            case "View all employees":
                viewEmployees();
                break;

            case "Add a department":
                addDepartmentInput();
                break;

            case "Add a role":
                addRoleInput();
                break;

            case "Add an employee":
                addEmployeeInput();
                break;

            case "Update an employee's role":
                updateRoleInput();
                break;
            
            case "Quit":
                quit();
                break;  
        };
    }
    catch (err) {
        console.log(err);
        mainMenu(); 
    };
}

connect();
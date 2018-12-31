/* Goothereum Example by SweetPalma, 2018. All rights reserved. */
const {Wallet, Account, Blockchain} = require('../goothereum');

const Bob = new Account ("Bob", 500);
console.log("Name: " + Bob.getName() + "  Balance: " + Bob.getBalance());
console.log(Bob.getName() + ": withdraw (200)");
Bob.withdraw(200);
console.log("Name: " + Bob.getName() + "  Balance: " + Bob.getBalance());
console.log(Bob.getName() + ": deposit (800)");
Bob.deposit(800);
console.log("Name: " + Bob.getName() + "  Balance: " + Bob.getBalance());
console.log();
const Alice = new Account ("Alice", 100);
console.log("Name: " + Alice.getName() + "  Balance: " + Alice.getBalance());
console.log(Alice.getName() + ": withdraw (200)");
Alice.withdraw(200);
console.log("Name: " + Alice.getName() + "  Balance: " + Alice.getBalance());
console.log(Alice.getName() + ": deposit (800)");
Alice.deposit(800);
console.log("Name: " + Alice.getName() + "  Balance: " + Alice.getBalance());
// var GingerAccount = new account ("Ginger", 70000000);
// var OreoAccount = new account ("Oreo", 900000000);


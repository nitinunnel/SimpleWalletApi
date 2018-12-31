/* Goothereum Example by SweetPalma, 2018. All rights reserved. */
const { Wallet, Transaction, Blockchain, Account } = require('../goothereum');
const { XLM } = require('../run/XLM');
const { DB } = require('../run/index');

const d = new DB();

// Create wallets:
const walletA = Wallet.create();
const walletB = Wallet.create();

// Create blockchain and mine first empty reward block:
const chain = new Blockchain();
chain.mine(walletA.publicKey);
var xlm = new XLM();

console.log(' (1) Create simple wallet api for transfer cryptocurrency between user A to user B.');
console.log();
//console.log("(A) ", walletA.publicKey, " (B) ", walletB.publicKey);
console.log('WalletA is balance is: 100');
console.log('WalletA is Attempting to send funds (15) to WalletB...');

// Mine new block with transaction to B: 
chain.mine(walletA.publicKey, [
    new Transaction({
        from: walletA.publicKey,
        to: walletB.publicKey,
        value: 15,
        nonce: 0,
    }).sign(walletA.privateKey),
]);

// Check balance again (must be A: 85 and B: 15):
console.log('WalletA:', chain.baln(walletA.publicKey));
console.log('WalletB:', chain.baln(walletB.publicKey));

console.log("===========================================");
console.log(' (2) Admin can increase and decrease user cryptocurrency balance.');
console.log();

const a = new Account("WalletA", chain.baln(walletA.publicKey));
console.log("Name: " + a.getName() + "  Balance: " + a.getBalance());
console.log(a.getName() + ": withdraw (50)");
a.withdraw(50);
console.log("Name: " + a.getName() + "  Balance: " + a.getBalance());
console.log(a.getName() + ": deposit (100)");
a.deposit(100);
console.log("Name: " + a.getName() + "  Balance: " + a.getBalance());
console.log();

d.db(a.getName(),a.getBalance());

const b = new Account("WalletB", chain.baln(walletB.publicKey));
console.log("Name: " + b.getName() + "  Balance: " + b.getBalance());
console.log(b.getName() + ": withdraw (20)");
b.withdraw(20);
console.log("Name: " + b.getName() + "  Balance: " + b.getBalance());
console.log(b.getName() + ": deposit (40)");
b.deposit(40);
console.log("Name: " + b.getName() + "  Balance: " + b.getBalance());

d.db(b.getName(),b.getBalance());

console.log("===========================================");
console.log(' (3) Admin can see all total balance of all cryptocurrency.');
console.log();
console.log("Total balance: ", (a.getBalance() + b.getBalance()));

console.log("===========================================");
console.log(' (4) Admin can add other cryptocurrency such XRP, EOS, XLM to wallet.');
console.log();
console.log('add XLM to wallet -> XLM.js');
xlm.createAccount();
setTimeout(test, 15000);

function test() {
    console.log("===========================================");
    console.log(' (5) Admin can manage exchange rate between cryptocurrency.');
    console.log();
    console.log('EX: 1000 ETH , exchange rate equal to 0.05');
    console.log('Results: ' + a.getExchangeRate(1000, 0.05));

    console.log("===========================================");
    console.log(' (6) User can transfer cryptocurrency to other.');
    console.log();
    xlm.transac("20", 'XLM', '');

    setTimeout(test2, 10000);
}

function test2() {
    console.log("===========================================");
    console.log(' (7) User can transfer cryptocurrency to other with difference currency such XLM to BTC with exchange rate.');
    console.log();
    console.log('-> Transfer 1000 XLM with exchange rate XLM/BTC equal to 0.03');
    var exchangeRate = b.getExchangeRate(1000, 0.03);
    //console.log(exchangeRate);
    xlm.transac(exchangeRate.toString(), 'XLM', 'BTC');
    //xlm.ReceivePayments(b.getExchangeRate(1000, 0.05), 'lumens');
}

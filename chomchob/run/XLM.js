
var StellarSdk = require('stellar-sdk');
var rp = require('request-promise');
var express = require('express');
var router = express.Router();
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
StellarSdk.Network.useTestNetwork();
var transaction;

var pair = StellarSdk.Keypair.random();
var pairB = StellarSdk.Keypair.random();
var str;
// pair.secret();
// SAV76USXIJOBMEQXPANUOQM6F5LIOTLPDIDVRJBFFE2MDJXG24TAPUU7
// console.log(pair.secret());
// pair.publicKey();
// GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4YH5O5JT3YZXCYPAFBJZB
// console.log(pair.publicKey());

var sourceKeys = StellarSdk.Keypair.fromSecret('SCZANGBA5YHTNYVVV4C3U252E2B6P6F5T3U6MM63WBSBZATAQI3EBTQ4');
var destinationId = 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGSPIUKSLRB6Q723BM2OARMDUYEJ5';

const XLM = exports.XLM = class XLM {

    //Admin can add other cryptocurrency such XRP, EOS, XLM to wallet.
    createAccount() {

        console.log("creating account");
        var options = {
            method: 'GET',
            uri: 'https://friendbot.stellar.org',
            qs: { addr: pair.publicKey() },
            json: true

        };
        rp(options)
            .then(function (parsedBody) {
                // POST succeeded...
                server.loadAccount(pair.publicKey())
                    .then(function (accountA) {
                        console.log('Balances for account: ' + pair.publicKey());
                        accountA.balances.forEach(function (balance) {
                            console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
                        });
                    });
            })
            .catch(function (err) {
                // POST failed...
                console.log(err);

            })

        console.log("creating account");
        var options = {
            method: 'GET',
            uri: 'https://friendbot.stellar.org',
            qs: { addr: pairB.publicKey() },
            json: true

        };
        rp(options)
            .then(function (parsedBody) {
                // POST succeeded...
                server.loadAccount(pairB.publicKey())
                    .then(function (accountB) {
                        console.log('Balances for account: ' + pairB.publicKey());
                        accountB.balances.forEach(function (balance) {
                            console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
                        });
                    });
            })
            .catch(function (err) {
                // POST failed...
                // console.log(err);

            })
    }


    //User can transfer cryptocurrency to other
    transac(amount, asset, assetNew) {

        // // Transaction will hold a built transaction we can resubmit if the result is unknown.

        // First, check to make sure that the destination account exists.
        // You could skip this, but if the account does not exist, you will be charged
        // the transaction fee when the transaction fails.
        server.loadAccount(pair.publicKey())
            .then(function (accountA) {
                accountA.balances.forEach(function (balance) {
                    if (balance.asset_type === 'native') {
                        //console.log('WalletA is balance is:', balance.balance, asset);
                    }
                });
            })
            // If the account is not found, surface a nicer error message for logging.
            .catch(StellarSdk.NotFoundError, function (error) {
                throw new Error('The destination account does not exist!');
            })
            // If there was no error, load up-to-date information on your account.
            .then(function () {
                return server.loadAccount(pair.publicKey());
            })
            .then(function (sourceAccount) {
                // Start building the transaction.
                transaction = new StellarSdk.TransactionBuilder(sourceAccount)
                    .addOperation(StellarSdk.Operation.payment({
                        destination: pairB.publicKey(),
                        // Because Stellar allows transaction in many currencies, you must
                        // specify the asset type. The special "native" asset represents Lumens.
                        asset: StellarSdk.Asset.native(),
                        amount: amount
                    }))
                    // A memo allows you to add your own metadata to a transaction. It's
                    // optional and does not affect how Stellar treats the transaction.
                    .addMemo(StellarSdk.Memo.text('Test Transaction'))
                    .build();
                // Sign the transaction to prove you are actually the person sending it.
                transaction.sign(pair);
                // And finally, send it off to Stellar!
                return server.submitTransaction(transaction);
            })
            .then(function (result) {
                // console.log('Success! Results:', result);
                return server.loadAccount(pairB.publicKey());

            }).then(function (account) {
                account.balances.forEach(function (balance) {
                    if (balance.asset_type === 'native') {
                        if (assetNew === '') {
                            console.log('WalletA is Attempting to send funds (' + amount + ' ' + asset + ') to WalletB...');
                            console.log('WalletB is balance is:', balance.balance);
                        }
                        else {
                            console.log('WalletB is balance is:', balance.balance, assetNew);
                        }

                    }
                });

            })
            .catch(function (error) {
                // console.error('Something went wrong!', error);
                // If the result is unknown (no response body, timeout etc.) we simply resubmit
                // already built transaction:
                // server.submitTransaction(transaction);
            });
    }


    ReceivePayments(balance, asset) {

        // Create an API call to query payments involving the account.
        var payments = server.payments().forAccount(destinationId);

        // If some payments have already been handled, start the results from the
        // last seen payment. (See below in `handlePayment` where it gets saved.)
        var lastToken = loadLastPagingToken();
        if (lastToken) {
            payments.cursor(lastToken);
        }

        // `stream` will send each recorded payment, one by one, then keep the
        // connection open and continue to send you new payments as they occur.
        payments.stream({
            onmessage: function (payment) {
                // Record the paging token so we can start from here next time.
                savePagingToken(payment.paging_token);
                //payment.amount = balance;
                // The payments stream includes both sent and received payments. We only
                // want to process received payments here.
                if (payment.to !== destinationId) {
                    return;
                }

                // In Stellar’s API, Lumens are referred to as the “native” type. Other
                // asset types have more detailed information.
                //var asset;
                if (payment.asset_type === 'native') {
                    asset = asset;
                }
                else {
                    asset = payment.asset_code + ':' + payment.asset_issuer;
                }
                console.log(payment.amount + ' ' + asset + ' from ' + payment.from);
            },

            onerror: function (error) {
                //console.error('Error in payment stream');
            }
        });
        function savePagingToken(token) {
            // In most cases, you should save this to a local database or file so that
            // you can load it next time you stream new payments.
        }

        function loadLastPagingToken() {
            // Get the last paging token from a local database or file
        }
    }
}
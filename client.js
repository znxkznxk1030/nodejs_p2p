var BlockChain = require('./block-chain.js');

let ysCoin = new BlockChain();

ysCoin.minePendingTransactions('ys');
ysCoin.minePendingTransactions('ys');

ysCoin.showAllTransactions();



console.log('ys\'s balance is ' + ysCoin.getBalanceOfAddress('ys'));


const Block = require('./block.js');
const Transaction = require('./transaction.js');
const merkleRoot = require('./utility.js').merkleRoot;

const SHA256 = require('crypto-js/sha256');


class BlockChain{
	constructor(){
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 2;
		this.pendingTransactions = [];
		this.miningReward = 100;
	}

	createGenesisBlock() {
		return new Block("01/01/2018", [new Transaction('genesis', 'genesis', 0)] , "0");
	}

	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock){
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
	}

	minePendingTransactions(miningRewardAddress){
		let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
		block.mineBlock(this.difficulty);

		console.log('block successfully mined!');

		this.chain.push(block);

		this.pendingTransactions = [
			new Transaction(null, miningRewardAddress, this.miningReward)
		];
	}

	createTransaction(transaction){
		this.pendingTransactions.push(transaction);
	}

	getBalanceOfAddress(address){
		let balance = 0;

		for (const block of this.chain) {
			for (const trans of block.transactions) {
				if (trans.fromAddress === address) { 
					balance -= trans.amount;
				}

				if(trans.toAddress === address) {
					balance += trans.amount;
				}
			}
		}
		
		return balance;
	}

	isChainValid(){
		for(let i = 1; i < this.chain.length - 1; i++){
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

			if(currentBlock.hash !== currentBlock.calculateHash()){
				return false;
			}

			if(currentBlock.previousHash !== previousBlock.hash){
				return false;
			}

			return true;
		}
	}

	showAllTransactions(){

		console.log('-----start tracking transactions-----\n');


		for (const block of this.chain) {
			console.log('block : ' + block.hash);
			for(const trans of block.transactions) {
				merkleRoot(block.transactions);
				console.log(JSON.stringify(trans));
			}
		}

		console.log('\n-----finish tracking transactions-----');
	}

}

module.exports = BlockChain;


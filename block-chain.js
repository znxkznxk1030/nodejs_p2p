const SHA256 = require('crypto-js/sha256');

class Block{
	constructor(index, timestamp, data, previousHash = ''){
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash(){
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();		
	}

	mineBlock(difficulty){
		while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
			this.nonce++;
			this.hash = this.calculateHash();
			console.log("hash" + this.hash);
		}

		console.log("Block mined! : " + this.hash);
	}
}

class BlockChain{
	constructor(){
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 2;
	}

	createGenesisBlock() {
		return new Block(0, "01/01/2018", "Genesis block", "0");
	}

	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock){
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
	}

	isChainValid(){

		for(let i = 1; i < this.length - 1; i++){
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

}

let ysCoin = new BlockChain();

ysCoin.addBlock(new Block(1, "10/07/2018", { amount: 4 }));
ysCoin.addBlock(new Block(2, "30/10/2018", { amount: 6 }));

console.log(JSON.stringify(ysCoin, null, 4));


















const SHA256 = require('crypto-js/sha256');
const Block = require('./block.js');
const Transaction = require('./transaction.js');

function blockMerkleRoot (transactions) { 
	function merkleRoot (hashes) {
		console.log(hashes);

		if (hashes.length === 1) {
			return hashes[0];
		}

		const nextHashes = [];
		for (let i = 0; i < hashes.length / 2; i++) {
			nextHashes.push(SHA256(hashes[i].concat(hashes[hashes.length - i])).toString());
		}

		if (hashes.length % 2 === 1) {
			nextHashes.push(hashes[hashes.length / 2 + 1]);
		}

		return merkleRoot(nextHashes);	
	}

	return merkleRoot(transactions.map(transaction => SHA256(transaction).toString()));
}

module.exports = {
	merkleRoot : blockMerkleRoot
}

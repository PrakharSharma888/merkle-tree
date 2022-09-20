// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Whitelist {

    bytes32 public merkleRoot;

    constructor(bytes32 _merkleRoot) {
        merkleRoot = _merkleRoot;
    }

    function checkInWhiteList(bytes32[] calldata proof, uint64 maxAllowenceToMint) view public returns(bool){ // masAllowence - no. of nft one can mint

        bytes32 leaf = keccak256(abi.encode(msg.sender, maxAllowenceToMint));
        bool verified = MerkleProof.verify(proof, merkleRoot, leaf);

        return verified;
    }
}
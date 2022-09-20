const { expect } = require('chai')
const { ethers } = require('hardhat')
const keccak256 = require('keccak256')
const { MerkleTree } = require('merkletreejs')

function encodeLeaf(address, spots){ // Same as `abi.encodePacked` in Solidity
    return ethers.utils.defaultAbiCoder.encode(
        ['address','uint64'],
        [address ,spots]
    )
}

describe("Check if merkle root is working", function(){
    it("It should check if the address is in whitelist or not", async function(){

        const [owner, add1, add2, add3, add4, add5, add6] = await ethers.getSigners()

        const list = [
            encodeLeaf(owner.address, 2),
            encodeLeaf(add1.address, 2),
            encodeLeaf(add2.address, 2),
            encodeLeaf(add3.address, 2),
            encodeLeaf(add4.address, 2),
            encodeLeaf(add5.address, 2),
        ]

        const merkleTree = new MerkleTree(list, keccak256, { // Make sure to sort the tree so that it can be produced deterministically regardless
                                                             // of the order of the input list
            sortPairs: true,
            hashLeaves: true
        })

        const root = merkleTree.getHexRoot()
        
        const whitelist = await ethers.getContractFactory("Whitelist")
        const Whitelist = await whitelist.deploy(root)
        await Whitelist.deployed()

        const leaf = keccak256(list[0])
        const proof = merkleTree.getHexProof(leaf)

        let verified = await Whitelist.checkInWhiteList(proof,2);
        expect(verified).is.equal(true)

        let verified2 = await Whitelist.checkInWhiteList([],2);
        expect(verified2).is.equal(false)
    })
})

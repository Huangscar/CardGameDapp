pragma solidity ^0.4.24;

import "./CardFactory.sol";

contract CharacterFactory is CardFactory {
    
    

    struct Charactor {
        uint32 level;
        uint8 cardType;
        uint8 starNum;
        uint8 charactorType;
    }

    event AddCharactor(uint charactorId, uint charactorType, uint cardType, uint starNum);
    event UseStone(uint num);
    //event AddStone(uint num);

    Charactor[] public charactors;
    //uint[2**20] charactors;
    mapping (uint=>address) public charactorsToOwner;
    mapping (address=>uint) public ownerCharactorsCount;
    mapping(address=>uint) public balances;
    uint countCharactor;

    uint randNonce = 0;
    
    function CharacterFactor() public {
        ownerCharactorsCount[msg.sender] = 0;
        charactorsToOwner[0] = 0;
        countCharactor = 0;
        //charactors = new Charactor[](2**20);
    }

    function getCharactor(uint8 poolType, uint8 balancesNum) public{
        require(balances[msg.sender] >= balancesNum);
        balances[msg.sender] -= balancesNum;
        emit UseStone(balancesNum);
        uint8 nonce = 0;
        uint8 randCardType = uint8(keccak256(abi.encodePacked(now, msg.sender, nonce))) % 3;
        nonce++;
        uint8 randCharactorType = uint8(keccak256(abi.encodePacked(now, msg.sender, nonce))) % 6;
        nonce++;
        uint8 randomNum = uint8(keccak256(abi.encodePacked(now, msg.sender, nonce))) % 100;
        uint8 starNum = 0;
        if (poolType == 0) {
            if (randomNum < 60) {
                starNum = 1;
            } else if (randomNum < 80) {
                starNum = 2;
            } else if (randomNum < 90) {
                starNum = 3;
            } else if (randomNum < 98) {
                starNum = 4;
            } else {
                starNum = 5;
            }
        } else if (poolType == 1) {
            if (randomNum < 80) {
                starNum = 1;
            } else if (randomNum < 95) {
                starNum = 2;
            } else {
                starNum = 3;
            }
        }

        charactors.push(Charactor(1, randCardType, starNum, randCharactorType));
        charactorsToOwner[countCharactor] = msg.sender;
        ownerCharactorsCount[msg.sender] = ownerCharactorsCount[msg.sender] + 1;
        emit AddCharactor(countCharactor, randCharactorType, randCardType, starNum);
        countCharactor++;
        
    }
    
    
    function() payable public{}

}
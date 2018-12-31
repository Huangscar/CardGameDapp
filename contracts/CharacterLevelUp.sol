pragma solidity ^0.4.24;

import "./AddMoney.sol";
contract CharacterLevelUp is AddMoney {
    mapping(address=>uint) public levelUpBalance;
    event UseFood(uint num);
    uint foodCost = 1;
    function addFoodWithMoney() public payable {
        require(msg.value > foodCost);
        levelUpBalance[msg.sender] += 10*msg.value/foodCost;
    }
    function addFoodWithWin(uint num) public {
        levelUpBalance[msg.sender] += num;
    }
    function levelUp(uint characterId, uint8 levelNum) public {
        uint needFood = 0;
        uint level = charactors[characterId].level;
        for(uint i = 0; i < levelNum; i++) {
            needFood += level*10;
            level++;
        }
        require(levelUpBalance[msg.sender] >= needFood);
        charactors[characterId].level += levelNum;
        levelUpBalance[msg.sender] -= needFood;
        emit UseFood(needFood);
    }
    function getLevelCanUp(uint characterId) view public returns(uint) {
        uint needFood = 0;
        uint level = charactors[characterId].level;
        for(uint i = 0; i < level; i++) {
            needFood += level*10;
            if(needFood >= levelUpBalance[msg.sender]) {
                return level;
            }
            level++;
        }
    }
}
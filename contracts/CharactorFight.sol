pragma solidity ^0.4.24;

import "./CharacterFactory.sol";
contract CharactorFight is CharacterFactory {
    uint[] public blood;
    uint[] public anger;
    mapping(address=>uint) public recentID;
    mapping(address=>uint) public recentHurt;
    mapping(address=>uint) public recentStarNum;
    //mapping (uint=>uint) fight;
    
    function getStartBlood(uint charactorId) public returns(uint, uint) {
        uint id = blood.push(1000*charactors[charactorId].level*charactors[charactorId].starNum) - 1;
        anger.push(0);
        recentID[msg.sender] = id;
        return(blood[id], id);
    }
    
    function getHurted(uint bloodId, uint num) public {
        blood[bloodId] -= num;
        if(num > 1000) {
            anger[bloodId] += num/100;
        } else {
            anger[bloodId] += 5;
        }
        
    }
    
    function getHurt(uint charactorId, uint cardNum, uint bloodId, uint bao, uint f) public returns(uint, uint) {
        
        uint8 b;
        uint8 c;
        uint8 d;
        b = cards[cardNum].num;
        c = cards[cardNum].proNum1;
        d = cards[cardNum].proNum2;
        uint addAnger = c*4+charactors[charactorId].level;
        anger[bloodId] += addAnger;
        if(cardNum == 3) {
            anger[bloodId] = 0;
        }
        recentHurt[msg.sender] = (charactors[charactorId].level*10+b*50+charactors[charactorId].starNum*5)/2;
        recentHurt[msg.sender] *= bao*f;
        recentStarNum[msg.sender] =  charactors[charactorId].level+d*3;
        return (recentHurt[msg.sender], charactors[charactorId].level*d);
    }
}
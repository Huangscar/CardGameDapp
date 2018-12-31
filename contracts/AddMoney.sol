pragma solidity ^0.4.24;

import "./CharactorFight.sol";
contract AddMoney is CharactorFight {
    uint stoneCost = 1;
    
    function addBalance() payable public returns(uint) {
        require(msg.value >= stoneCost);
        uint addStone = msg.value/stoneCost;
        balances[msg.sender] += addStone;
        return addStone;
        //emit AddStone(msg.value/stoneCost);
    }
    
    //function withdraw() public;

    //function() payable public;
}
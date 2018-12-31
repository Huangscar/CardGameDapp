pragma solidity ^0.4.24;

contract CardFactory {
    
    struct Card {
        string cardType;
        uint8 num;
        uint8 proNum1;
        uint8 proNum2;
        bool isFinal;
    }

    Card[] public cards;

    constructor() public {
        cards.push(Card("red", 5, 1, 0, false));
        cards.push(Card("blue", 3, 5, 0, false));
        cards.push(Card("green", 1, 3, 5, false));
        cards.push(Card("red", 15, 0, 0, true));
    }
}








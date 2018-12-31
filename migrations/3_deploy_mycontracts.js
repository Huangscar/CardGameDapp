var CardFactory = artifacts.require('./CardFactory.sol')
var CharacterFactory = artifacts.require('./CharacterFactory.sol')
var CharacterFight = artifacts.require('./CharactorFight.sol')
var AddMoney = artifacts.require('./AddMoney.sol')
var CharacterLevelUp = artifacts.require('./CharacterLevelUp.sol')

module.exports = function (deployer) {
    deployer.deploy(CardFactory)
    deployer.link(CardFactory, CharacterFactory)
    deployer.deploy(CharacterFactory)
    deployer.link(CharacterFactory, CharacterFight)
    deployer.deploy(CharacterFight)
    deployer.link(CharacterFight, AddMoney)
    deployer.deploy(AddMoney)
    deployer.link(AddMoney, CharacterLevelUp)
    deployer.deploy(CharacterLevelUp)
}
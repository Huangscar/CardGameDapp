// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'


// Import our contract artifacts and turn them into usable abstractions.
import metaCoinArtifact from '../../build/contracts/MetaCoin.json'
import cardFactoryJson from '../../build/contracts/CardFactory.json'
import characterFactoryJson from '../../build/contracts/CharacterFactory.json'
import characterFightJson from '../../build/contracts/CharactorFight.json'
import characterLevelUpJson from '../../build/contracts/CharacterLevelUp.json'
import addMoneyJson from '../../build/contracts/AddMoney.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
const MetaCoin = contract(metaCoinArtifact)
const CardFactory = contract(cardFactoryJson)
const CharacterFactory = contract(characterFactoryJson)
const CharacterFight = contract(characterFightJson)
const CharacterLevelUp = contract(characterLevelUpJson)
const AddMoney = contract(addMoneyJson)



// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

var myCharacter = new Array()
let charactersNum
let myNum = 0;
let showCharacterNum = 0;
let maxLevel = 0;
let eBloodNumMax;
let bloodId;
let myBloodNumMax;
let chooseCharacterCardType;
let anger;
let eBloodNow;
let chooseNum;
let balanceNum;
let isRes = 2;
let eClass;
let greenStarNum = 0;
let isBao = false;
let eLevel;

let characterNum;
let num = 0;
const characterNumE = document.getElementById('charactorNum')
const status = document.getElementById('status')
const balance = document.getElementById('balances')
const star1 = document.getElementById('star1')
const blood1 = document.getElementById('bloodBar')
const foodE = document.getElementById('foodNum');
const userE = document.getElementById('user');
var subBtn = document.getElementById('subBtn'); 
var afterLoginE = document.getElementsByClassName('afterLogin');


const App = {


  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider)
    CharacterFactory.setProvider(web3.currentProvider)
    AddMoney.setProvider(web3.currentProvider)
    CharacterLevelUp.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    if(userE === null){
      return self.getAccount();
    }
    else if(afterLoginE.length !== 0){
      return self.hiddenBtn();
    }
    else if(subBtn !== null) {
      return self.getIsLogin();
    }
    //self.getRecentCharacter()
  },

  hiddenBtn: function() {
    console.log("hiddenBtn");
    const self = this
    var cookieString = self.getCookie().length;
    if(cookieString === 0){
      var i = 0;
      for(i = 0; i < afterLoginE.length; i++) {
        afterLoginE[i].setAttribute("style", "display:none;");
        console.log("hiddenBtn");
      }
    }
    else {
      var i = 0;
      for(i = 0; i < afterLoginE.length; i++) {
        afterLoginE[i].removeAttribute("style");
      }
    }
  },

  getIsLogin: function() {
    console.log("getIsLogin");
    const self = this
    var cookieString = self.getCookie().length;
    if(cookieString !== 0){
      console.log("getIsLogin");
      alert("你已经登陆了！如果要退出请关闭浏览器！");
      subBtn.setAttribute("disabled", "disabled");
    }
  },

  getAccount: function() {
    const self = this
    
    var cookieString = self.getCookie().length;
    if(cookieString === 0){
      var changePage = confirm("请先登陆");
      if(changePage){
        window.location.href = "login.html"
      }
    }
    else {
      account = self.getCookie();
      console.log(account);
      return self.initPage();
    }
    
  },

  getCookie: function() {
    var name = "address=";
	  var ca = document.cookie.split(';');
	  for(var i=0; i<ca.length; i++) {
		  var c = ca[i].trim();
		  if (c.indexOf(name)==0) { 
        return c.substring(name.length,c.length); 
      }
	  }
	  return "";
  },

  login: function() {
    var addressString = userE.value.toString().toLowerCase();
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      console.log(accounts[0]);
      console.log(addressString);
      if(accounts.indexOf(addressString) === -1){
        window.alert("该用户不存在");
      }
      else {
        account = addressString;
        document.cookie = "address="+account;
        window.location.href = "/";
      }
      
      
      // self.refreshBalance()
      

    })
  },

  initPage: function() {
    const self = this
    if (characterNumE !== null) {
      self.getCharacterNum()
    }
    //self.getCharacter()
    if (balance !== null) {
      self.getBalance()
    }
    if (foodE !== null) {
      self.getFood()
    }
    
  },

  setStatus: function (message) {

    status.innerHTML = message
  },

  refreshBalance: function () {
    const self = this

    let meta
    MetaCoin.deployed().then(function (instance) {
      meta = instance
      return meta.getBalance.call(account, { from: account })
    }).then(function (value) {
      const balanceElement = document.getElementById('balance')
      balanceElement.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting balance; see log.')
    })
  },

  getCharacterNum: function () {
    const self = this

    let character
    CharacterLevelUp.deployed().then(function (instance) {
      character = instance
      return character.ownerCharactorsCount.call(account, { from: account })
    }).then(function (value) {

      characterNumE.innerHTML = value.valueOf()
      charactersNum = value.valueOf()
      return self.getRecentCharacter()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting character num; see log.')
    })

  },

  addCharacter: function (type) {
    const self = this;

    var cookieString = self.getCookie().length;
    if(cookieString === 0){
      var changePage = confirm("请先登陆");
      if(changePage){
        window.location.href = "login.html"
      }
      return;
    }

    let money;
    if (type === 0) {
      money = 3;
    }
    else {
      money = 1;
    }

    if(balanceNum < money) {
      self.setStatus("you don't have enough stone");
      return;
    }
    this.setStatus('Initiating transaction... (please wait)')

    let character
    CharacterLevelUp.deployed().then(function (instance) {
      character = instance
      //gasNum = web3.eth.getBlock("pending").gasLimit
      return character.getCharactor(parseInt(type), money, { from: account, gas: 3141592 })
    }).then(function () {
      self.setStatus('Transaction complete!')
      self.getCharacterNum()
      self.getBalance()
      //self.getRecentCharacter()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error adding character; see log.')
    })
  },

  getCharacter: function () {
    const self = this

    let character
    CharacterLevelUp.deployed().then(function (instance) {
      character = instance
      return character.charactors(0, { from: account })
    }).then(function (value) {
      const level = document.getElementById('level')
      const cardType = document.getElementById('cardType')
      const starNum = document.getElementById('starNum')
      const charactorType = document.getElementById('charactorType')
      level.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting character; see log.')
    })

  },

  addBalance: function () {
    
    const self = this

    var cookieString = self.getCookie().length;
    if(cookieString === 0){
      var changePage = confirm("请先登陆");
      if(changePage){
        window.location.href = "login.html"
      }
      return;
    }

    this.setStatus('Initiating transaction... (please wait)')
    const amount = parseInt(document.getElementById('moneyNum').value)

    //amount = amount / Math.pow(10,41);

    if (amount > 0) {
      let addMoney
      CharacterLevelUp.deployed().then(function (instance) {
        addMoney = instance
        //gasNum = web3.eth.getBlock("pending").gasLimit
        return addMoney.addBalance({ from: account, gas: 3141592, value: amount })
      }).then(function () {
        self.setStatus('Transaction complete!')
        self.getBalance()
      }).catch(function (e) {
        console.log(e)
        self.setStatus('Error adding balance; see log.')
      })
    }
    else {
      self.setStatus('please input more than 1')
    }
  },

  getBalance: function () {
    const self = this

    let character
    CharacterLevelUp.deployed().then(function (instance) {
      character = instance
      return character.balances(account, { from: account })
    }).then(function (value) {
      balanceNum = parseInt(value.valueOf());
      balance.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting balance; see log.')
    })
  },

  getRecentCharacter: function () {
    const self = this;



    console.log(charactersNum);

    if (myNum < charactersNum) {
      console.log("<")
      return self.getRecentCharacter3()

    }
    else {
      console.log(">")
      if (star1 !== null) {
        return self.showCharacter()
      }
      else if (blood1 !== null) {
        return self.showCharacter()
      }
      else {
        return self.getRecentCharacter2()
      }
    }
  },
  getRecentCharacter3: function () {
    let character;
    const self = this;
    CharacterLevelUp.deployed().then(function (instance) {
      character = instance
      return character.charactorsToOwner(num, { from: account })
    }).then(function (value) {
      if (account == value.valueOf()) {
        myCharacter[myNum] = num;
        myNum = myNum + 1;
        console.log(myNum)
      }
      else if (value.valueOf() === '0x0000000000000000000000000000000000000000') {
        isBreak = true;
        console.log("break")
      }
      else {
        console.log("value")
        console.log(value.valueOf())
        console.log("account")
        console.log(account)
      }
      num++;
      return self.getRecentCharacter()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting charactor; see log.')
      num++;
    })
    //num++;

  },
  getRecentCharacter2: function () {
    const self = this;
    let character
    num = 0;
    console.log(myNum)
    if (myNum > 0) {
      CharacterLevelUp.deployed().then(function (instance) {
        character = instance
        return character.charactors(myNum - 1, { from: account })
      }).then(function (value) {
        const recentCharacterLevel = document.getElementById('recentCharacterLevel');
        const recentCharacterType = document.getElementById('recentCharacterType');
        const recentCharacterStar = document.getElementById('recentCharacterStar');
        recentCharacterLevel.innerHTML = value.valueOf()[0]
        var type
        switch (parseInt(value.valueOf()[3])) {
          case 0:
            type = 'Saber'
            break;

          case 1:
            type = 'Archer'
            break;

          case 2:
            type = 'Lancer'
            break;
          case 3:
            type = 'Caster'
            break;
          case 4:
            type = 'Rider'
            break;
          case 5:
            type = 'Assasin'
            break;

          default:
            type = value.valueOf()[3]
            break;
        }
        recentCharacterType.innerHTML = type
        recentCharacterStar.innerHTML = value.valueOf()[2]
        myNum = 0;
      }).catch(function (e) {
        console.log(e)
        self.setStatus('Error getting charactor; see log.')
        myNum = 0;
      })
    }
  },
  showCharacter: function () {
    const self = this;
    if (showCharacterNum < myNum) {
      console.log(showCharacterNum);
      showCharacterNum++;
      console.log(showCharacterNum);
      if (blood1 !== null) {
        return self.getMaxLevel()
      }
      else {
        return self.getCharacterByNum(0);
      }
    }
    else {
      //showCharacterNum = 0;
      if (blood1 !== null) {
        return self.initFight()
      }
    }
  },
  getCharacterByNum: function (input) {
    const self = this;
    let character;
    CharacterLevelUp.deployed().then(function (instance) {
      character = instance;
      console.log(showCharacterNum);
      console.log(myCharacter[showCharacterNum - 1])
      return character.charactors(myCharacter[showCharacterNum - 1], { from: account })
    }).then(function (value) {
      var star = document.getElementById('star' + showCharacterNum.toString());
      var detail = document.getElementById('detail' + showCharacterNum.toString());
      var starNum = parseInt(value.valueOf()[2]);
      var levelNum = value.valueOf()[0];
      var cardNum = parseInt(value.valueOf()[1]);
      var typeNum = parseInt(value.valueOf()[3]);
      var type
      switch (typeNum) {
        case 0:
          type = 'Saber'
          break;

        case 1:
          type = 'Archer'
          break;

        case 2:
          type = 'Lancer'
          break;
        case 3:
          type = 'Caster'
          break;
        case 4:
          type = 'Rider'
          break;
        case 5:
          type = 'Assasin'
          break;

        default:
          type = value.valueOf()[3]
          break;
      }
      var card
      switch (cardNum) {
        case 0:
          card = '红卡'
          break;

        case 1:
          card = '蓝卡'
          break;

        case 2:
          card = '绿卡'
          break;


        default:
          card = value.valueOf()[3]
          break;
      }
      var starString
      switch (starNum) {
        case 1:
          starString = '一星'
          break;

        case 2:
          starString = '二星'
          break;
        case 3:
          starString = '三星'
          break;
        case 4:
          starString = '四星'
          break;
        case 5:
          starString = '五星'
          break;

        default:
          starString = value.valueOf()[3]
          break;
      }
      console.log(showCharacterNum);
      if (star !== null) {
        star.innerHTML = starString;
        detail.innerHTML = type + ', ' + card + ', ' + levelNum + '级';
      }
      else {
        var showDiv = document.getElementById('showCharacterDiv');
        var rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        var leftDiv = document.createElement('div');
        leftDiv.className = 'col-lg-3';
        rowDiv.appendChild(leftDiv);
        var middleDiv = document.createElement('div');
        middleDiv.className = 'col-lg-2';
        var thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = 'thumbnail';
        var captionDiv = document.createElement('div');
        captionDiv.className = 'caption';
        var starE = document.createElement('h3');
        starE.id = 'star' + showCharacterNum.toString();
        captionDiv.append(starE);
        var detailE = document.createElement('p');
        detailE.id = 'detail' + showCharacterNum.toString();
        captionDiv.append(detailE);
        var buttonP = document.createElement('p');
        var leftA = document.createElement('a');

        leftA.className = 'btn btn-primary';
        leftA.setAttribute("role", "button");
        leftA.setAttribute("onClick", "App.addLevel("+showCharacterNum.toString()+")");
        leftA.innerHTML = "升级";
        buttonP.appendChild(leftA);
        var leftB = document.createElement('a');

        leftB.className = 'btn btn-default';
        leftB.setAttribute("role", "button");
        leftB.innerHTML = "详情";
        buttonP.appendChild(leftB);
        captionDiv.appendChild(buttonP);
        thumbnailDiv.appendChild(captionDiv);
        middleDiv.appendChild(thumbnailDiv);
        rowDiv.appendChild(middleDiv);
        var middleDiv = document.createElement('div');
        middleDiv.className = 'col-lg-2';
        var thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = 'thumbnail';
        var captionDiv = document.createElement('div');
        captionDiv.className = 'caption';
        var starE = document.createElement('h3');
        starE.id = 'star' + (showCharacterNum + 1).toString();
        captionDiv.append(starE);
        var detailE = document.createElement('p');
        detailE.id = 'detail' + (showCharacterNum + 1).toString();
        captionDiv.append(detailE);
        var buttonP = document.createElement('p');
        var leftA = document.createElement('a');

        leftA.className = 'btn btn-primary';
        leftA.setAttribute("role", "button");
        leftA.setAttribute("onClick", "App.addLevel("+(showCharacterNum + 1).toString()+")");
        leftA.innerHTML = "升级";
        
        buttonP.appendChild(leftA);
        var leftB = document.createElement('a');

        leftB.className = 'btn btn-default';
        leftB.setAttribute("role", "button");
        leftB.innerHTML = "详情";
        buttonP.appendChild(leftB);
        captionDiv.appendChild(buttonP);
        thumbnailDiv.appendChild(captionDiv);
        middleDiv.appendChild(thumbnailDiv);
        rowDiv.appendChild(middleDiv);
        var middleDiv = document.createElement('div');
        middleDiv.className = 'col-lg-2';
        var thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = 'thumbnail';
        var captionDiv = document.createElement('div');
        captionDiv.className = 'caption';
        var starE = document.createElement('h3');
        starE.id = 'star' + (showCharacterNum + 2).toString();
        captionDiv.append(starE);
        var detailE = document.createElement('p');
        detailE.id = 'detail' + (showCharacterNum + 2).toString();
        captionDiv.append(detailE);
        var buttonP = document.createElement('p');
        var leftA = document.createElement('a');

        leftA.className = 'btn btn-primary';
        leftA.setAttribute("role", "button");
        leftA.setAttribute("onClick", "App.addLevel("+(showCharacterNum + 2).toString()+")");
        leftA.innerHTML = "升级";
        buttonP.appendChild(leftA);
        var leftB = document.createElement('a');

        leftB.className = 'btn btn-default';
        leftB.setAttribute("role", "button");
        leftB.innerHTML = "详情";
        buttonP.appendChild(leftB);
        captionDiv.appendChild(buttonP);
        thumbnailDiv.appendChild(captionDiv);
        middleDiv.appendChild(thumbnailDiv);
        rowDiv.appendChild(middleDiv);
        var rightDiv = document.createElement('div');
        rightDiv.className = 'col-lg-3';
        rowDiv.appendChild(rightDiv);
        showDiv.appendChild(rowDiv);
        var star = document.getElementById('star' + showCharacterNum.toString());
        var detail = document.getElementById('detail' + showCharacterNum.toString());
        star.innerHTML = starString;
        detail.innerHTML = type + ', ' + card + ', ' + levelNum + '级';
      }

      if(parseInt(input) === 0) {
        return self.showCharacter();
      }
      else {
        return self.getFood();
      }
      
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting charactor; see log.')
      myNum = 0;
      //showCharacterNum = 0;
    })
  },

  initFight: function () {
    console.log(maxLevel);
    eLevel = parseInt(Math.random() * (maxLevel), 10)+1;
    var eType = parseInt(Math.random() * (5 + 1), 10);
    var type;
    switch (eType) {
      case 0:
        type = 'Saber'
        break;

      case 1:
        type = 'Archer'
        break;

      case 2:
        type = 'Lancer'
        break;
      case 3:
        type = 'Caster'
        break;
      case 4:
        type = 'Rider'
        break;
      case 5:
        type = 'Assasin'
        break;

      default:
        type = value.valueOf()[3]
        break;
    }
    eClass = eType;
    const typeE = document.getElementById('type2');
    typeE.innerHTML = type;
    const levelE = document.getElementById('levelNum2');
    levelE.innerHTML = eLevel.toString();
    const bloodNum2 = document.getElementById('bloodNum2')
    bloodNum2.innerHTML = 1000 * eLevel;
    eBloodNumMax = 1000 * eLevel;
    eBloodNow = eBloodNumMax;
  },

  getMaxLevel: function () {
    const self = this;
    let character;
    CharacterLevelUp.deployed().then(function (instance) {
      character = instance;
      console.log(showCharacterNum);
      console.log(myCharacter[showCharacterNum - 1])
      return character.charactors(myCharacter[showCharacterNum - 1], { from: account })
    }).then(function (value) {
      if (parseInt(value.valueOf()[0]) > maxLevel) {
        maxLevel = parseInt(value.valueOf()[0])
      }
      return self.showCharacter()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting charactor; see log.')
      myNum = 0;
      //showCharacterNum = 0;
    })
  },

  chooseCharacter: function () {
    const self = this;
    var cookieString = self.getCookie().length;
    if(cookieString === 0){
      var changePage = confirm("请先登陆");
      if(changePage){
        window.location.href = "login.html"
      }
      return;
    }
    const chooseCharacterNum = parseInt(document.getElementById('characterChooseNum').value);
    var characterChooseBtn = document.getElementById('characterChooseBtn');
    characterChooseBtn.setAttribute("disabled", "disabled");
    const numberE = document.getElementById('number')

    let character;
    anger = 0;
    if (chooseCharacterNum > charactersNum || chooseCharacterNum < 1) {
      self.setStatus('you don\'t have this num of character')
    }
    else {
      numberE.innerHTML = chooseCharacterNum.toString();
      chooseNum = chooseCharacterNum;
      CharacterLevelUp.deployed().then(function (instance) {
        character = instance;
        console.log(myCharacter[chooseCharacterNum - 1])
        return character.charactors(myCharacter[chooseCharacterNum - 1], { from: account })
      }).then(function (value) {
        console.log(value.valueOf());
        const levelNumE = document.getElementById('levelNum');
        levelNumE.innerHTML = value.valueOf()[0]
        const typeE = document.getElementById('type1');
        var myType = parseInt(value.valueOf()[3]);
        var starNum = parseInt(value.valueOf()[2]);
        var type;
        switch (myType) {
          case 0:
            type = 'Saber'
            if(eClass === 1){
              isRes = 1;
            }
            else if(eClass === 2){
              isRes = 4;
            }
            break;

          case 1:
            type = 'Archer'
            if(eClass === 2){
              isRes = 1;
            }
            else if(eClass === 0){
              isRes = 4;
            }
            break;

          case 2:
            type = 'Lancer'
            if(eClass === 0){
              isRes = 1;
            }
            else if(eClass === 1){
              isRes = 4;
            }
            break;
          case 3:
            type = 'Caster'
            if(eClass === 4){
              isRes = 1;
            }
            else if(eClass === 5){
              isRes = 4;
            }
            break;
          case 4:
            type = 'Rider'
            if(eClass === 5){
              isRes = 1;
            }
            else if(eClass === 3){
              isRes = 4;
            }
            break;
          case 5:
            type = 'Assasin'
            if(eClass === 3){
              isRes = 1;
            }
            else if(eClass === 4){
              isRes = 4;
            }
            break;

          default:
            type = value.valueOf()[3]
            break;
        }
        var fightDetail = document.getElementById('fightDetail');
        var thisLine = document.createElement('div');
        thisLine.className = "row";
        var detailP = document.createElement('p');
        var showString;
        if(isRes === 1){
          showString = "你被克制";
        }
        else if(isRes === 2){
          showString = "不存在克制";
        }
        else if(isRes === 4){
          showString = "敌方被克制";
        }
        detailP.innerHTML = showString;
        thisLine.appendChild(detailP);
        fightDetail.appendChild(thisLine);
        typeE.innerHTML = type;
        var starString
        switch (starNum) {
          case 1:
            starString = '一星'
            break;

          case 2:
            starString = '二星'
            break;
          case 3:
            starString = '三星'
            break;
          case 4:
            starString = '四星'
            break;
          case 5:
            starString = '五星'
            break;

          default:
            starString = value.valueOf()[3]
            break;
        }
        
        const myStarE = document.getElementById('myStar');
        myStarE.innerHTML = starString;
        chooseCharacterCardType = parseInt(value.valueOf()[1]);
        return self.initFight2();
      }).catch(function (e) {
        console.log(e)
        self.setStatus('Error getting charactor; see log.')
        //showCharacterNum = 0;
      })

    }
  },

  initFight2: function() {
    const self = this;
    let character;
    const bloodE = document.getElementById('bloodNum');
    CharacterLevelUp.deployed().then(function (instance) {
      character = instance;
      console.log(myCharacter[chooseNum-1]);
      return character.getStartBlood(myCharacter[chooseNum - 1], { from: account, gas: 3141592 })
    }).then(function (value) {
      return self.getBloodID();
      console.log(value.valueOf()[1]);
      bloodId = parseInt(value.valueOf()[1]);
      myBloodNumMax = parseInt(value.valueOf()[0]);
      bloodE.innerHTML = myBloodNumMax;
      console.log(bloodId);
      //return self.initFight3();
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting charactor; see log.')
      //showCharacterNum = 0;
    })
  },

  getBloodID: function() {
    const self = this;
    let character;
    CharacterLevelUp.deployed().then(function (instance) {
      character = instance;
      return character.recentID(account, { from: account })
    }).then(function (value) {
      bloodId = value.valueOf()
      return self.getBlood();
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting charactor; see log.')
      //showCharacterNum = 0;
    })
  },

  getBlood: function() {
    const self = this;
    let character;
    const bloodE = document.getElementById('bloodNum');
    CharacterLevelUp.deployed().then(function (instance) {
      character = instance;
      console.log(bloodId);
      return character.blood(bloodId, { from: account })
    }).then(function (value) {
      myBloodNumMax = parseInt(value.valueOf());
      console.log(myBloodNumMax);
      bloodE.innerHTML = myBloodNumMax;
      return self.initFight3();
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting charactor; see log.')
      //showCharacterNum = 0;
    })
  },

  initFight3: function(){
    var allCard = new Array();
    allCard[0] = 0;
    allCard[1] = 1;
    allCard[2] = 2;
    allCard[3] = chooseCharacterCardType;
    allCard[4] = chooseCharacterCardType;
    var randomCard = new Array();
    for(var i = 0; i < 5; i++) {
      randomCard[i] = i;
    }
    randomCard.sort(function(){ return 0.5 - Math.random(); });
    var cardBtn1 = document.getElementById('card1');
    var cardBtn2 = document.getElementById('card2');
    var cardBtn3 = document.getElementById('card3');
    var cardName;
    if(allCard[randomCard[0]] === 0) {
      cardName = "红";
    }
    else if(allCard[randomCard[0]] === 1) {
      cardName = "蓝";
    }
    else if(allCard[randomCard[0]] === 2) {
      cardName = "绿";
    }
    cardBtn1.innerHTML = cardName;
    cardBtn1.setAttribute("onClick", "App.fightWithCard("+allCard[randomCard[0]].toString()+")");
    cardBtn1.removeAttribute("disabled")
    var cardName;
    if(allCard[randomCard[1]] === 0) {
      cardName = "红";
    }
    else if(allCard[randomCard[1]] === 1) {
      cardName = "蓝";
    }
    else if(allCard[randomCard[1]] === 2) {
      cardName = "绿";
    }
    cardBtn2.innerHTML = cardName;
    cardBtn2.setAttribute("onClick", "App.fightWithCard("+allCard[randomCard[1]].toString()+")");
    cardBtn2.removeAttribute("disabled")
    var cardName;
    if(allCard[randomCard[2]] === 0) {
      cardName = "红";
    }
    else if(allCard[randomCard[2]] === 1) {
      cardName = "蓝";
    }
    else if(allCard[randomCard[2]] === 2) {
      cardName = "绿";
    }
    cardBtn3.innerHTML = cardName;
    cardBtn3.setAttribute("onClick", "App.fightWithCard("+allCard[randomCard[2]].toString()+")");
    cardBtn3.removeAttribute("disabled")
    if(anger >= 100) {
      var bigBtn = document.getElementById('card4');
      bigBtn.removeAttribute("disabled");
      bigBtn.setAttribute("onClick", "App.fightWithCard(3)");
    }
  },
  fightWithCard: function(cardNumInput) {
    console.log(cardNumInput);
    var cardBtn1 = document.getElementById('card1');
    var cardBtn2 = document.getElementById('card2');
    var cardBtn3 = document.getElementById('card3');
    var bigBtn = document.getElementById('card4');
    cardBtn1.setAttribute("disabled", "disabled");
    cardBtn2.setAttribute("disabled", "disabled");
    cardBtn3.setAttribute("disabled", "disabled");
    bigBtn.setAttribute("disabled", "disabled");
    const self = this;
    let character;
    var ran = parseInt(Math.random() * (50 + 1), 10);
    var bao = 1
    if (ran < greenStarNum) {
      bao = 2;
      isBao = true;
    }
    else {
      isBao = false;
    }
    
    if(eBloodNow !== 0) {
      CharacterLevelUp.deployed().then(function (instance) {
        character = instance;
        
        return character.getHurt(myCharacter[chooseNum - 1], parseInt(cardNumInput), bloodId, bao, isRes, { from: account, gas: 3141592 })
      }).then(function (value) {
        
        return self.eGetHurted();
      }).catch(function (e) {
        console.log(e)
        self.setStatus('Error getting charactor; see log.')
        //showCharacterNum = 0;
      })
    }
  },

  eGetHurted: function() {
    const self = this;
    let character;
    CharacterLevelUp.deployed().then(function (instance) {
      character = instance;
      
      return character.recentHurt(account, { from: account })
    }).then(function (value) {
      var hurtNum = parseInt(value.valueOf());
      eBloodNow -= hurtNum;
      if(eBloodNow <= 0) {
        eBloodNow = 0;
      }
      var eBloodBarE = document.getElementById('bloodBar2');
      var bloodPro = parseInt(parseFloat(eBloodNow)/eBloodNumMax*100);
      eBloodBarE.setAttribute("style", "width: "+bloodPro.toString()+"%;");
      var eBloodE = document.getElementById('bloodNum2');
      eBloodE.innerHTML = eBloodNow.toString();
      var fightDetail = document.getElementById('fightDetail');
      var thisLine = document.createElement('div');
      thisLine.className = "row";
      var detailP = document.createElement('p');
      var detailString = "";
      if(isBao) {
        detailString = "敌人被暴击，"
      }
      detailP.innerHTML = detailString+"敌人被攻击"+hurtNum.toString()+"点血";
      thisLine.appendChild(detailP);
      fightDetail.appendChild(thisLine);
      if(eBloodNow > 0) {
        return self.myGetHurted();
      }
      else {
        return self.youWin();
      }
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting charactor; see log.')
      //showCharacterNum = 0;
    })
  },

  myGetHurted: function() {
    const self = this;
    let character;
    var characterFight = (4*50+3*5+eLevel*10)*2/isRes;
    CharacterLevelUp.deployed().then(function (instance) {
      character = instance;
      return character.getHurted(bloodId, characterFight, { from: account, gas: 3141592 });
    }).then(function (value) {
      return self.showMyDetail1();
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting charactor; see log.')
      //showCharacterNum = 0;
    })
  },

  showMyDetail1: function() {
    const self = this;
    let character;
    CharacterLevelUp.deployed().then(function (instance) {
      character = instance;
      return character.anger(bloodId, { from: account });
    }).then(function (value) {
      var angerNum = value.valueOf();
      anger = angerNum;
      var myAngerBarE = document.getElementById('angerBar');
      var myAngerE = document.getElementById('angerNum');
      myAngerBarE.setAttribute("style", "width: "+anger.toString()+"%;");
      var angerAdd = anger-parseInt(myAngerE.innerHTML.toString());
      myAngerE.innerHTML = anger.toString();
      var fightDetail = document.getElementById('fightDetail');
      var thisLine = document.createElement('div');
      thisLine.className = "row";
      var detailP = document.createElement('p');
      detailP.innerHTML = "本回合你增加"+angerAdd.toString()+"点怒气值";
      thisLine.appendChild(detailP);
      fightDetail.appendChild(thisLine);
      return self.getBlood2();
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting charactor; see log.')
      //showCharacterNum = 0;
    })
  },
  getBlood2: function() {
    const self = this;
    let character;
    const bloodE = document.getElementById('bloodNum');
    CharacterLevelUp.deployed().then(function (instance) {
      character = instance;
      console.log(bloodId);
      return character.blood(bloodId, { from: account })
    }).then(function (value) {
      var bloodNow = parseInt(value.valueOf());
      var myBloodBarE = document.getElementById('bloodBar');
      var bloodPro = parseInt(parseFloat(bloodNow)/myBloodNumMax*100);
      myBloodBarE.setAttribute("style", "width: "+bloodPro.toString()+"%;")
      if(bloodNow === 1) {
        bloodNow = 0;
      }
      var bloodMin = parseInt(bloodE.innerHTML.toString())-bloodNow;
      bloodE.innerHTML = bloodNow.toString();
      var fightDetail = document.getElementById('fightDetail');
      var thisLine = document.createElement('div');
      thisLine.className = "row";
      var detailP = document.createElement('p');
      detailP.innerHTML = "本回合你减少"+bloodMin.toString()+"点血";
      thisLine.appendChild(detailP);
      fightDetail.appendChild(thisLine);
      if(bloodNow > 0) {
        return self.getGreenStarNum();
      }
      else {
        self.youLost();
      }
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting charactor; see log.')
      //showCharacterNum = 0;
    })
  },

  youLost: function() {
    const self = this;
    self.setStatus("you lose!")
  },

  youWin: function() {
    const self = this;
    let character;
    var addNum = 10;
    CharacterLevelUp.deployed().then(function (instance) {
      character = instance;
      return character.addFoodWithWin(addNum, { from: account, gas: 3141592 });
    }).then(function (value) {
      self.setStatus("you win!");
      return self.getFood();
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting charactor; see log.')
      //showCharacterNum = 0;
    })
  },

  getFood: function() {
    const self = this;
    let character;
    CharacterLevelUp.deployed().then(function (instance) {
      character = instance;
      return character.levelUpBalance(account, { from: account });
    }).then(function (value) {
      foodE.innerHTML = value.valueOf();
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting charactor; see log.')
      //showCharacterNum = 0;
    })
  },

  addLevel: function(id) {
    const self = this;
    var cookieString = self.getCookie().length;
    if(cookieString === 0){
      var changePage = confirm("请先登陆");
      if(changePage){
        window.location.href = "login.html"
      }
      return;
    }
    let character;
    if (id > charactersNum){
      self.setStatus('you don\'t have this character');
      return;
    }
    CharacterLevelUp.deployed().then(function (instance) {
      character = instance;
      return character.levelUp(myCharacter[id-1], 1, { from: account });
    }).then(function (value) {
      //self.getFood();
      showCharacterNum = id;
      self.setStatus('succeed!')
      return self.getCharacterByNum(1);
    }).catch(function (e) {
      console.log(e)
      self.setStatus('you don\'t have enough food')
      //showCharacterNum = 0;
    })
  },

  addFood: function() {
    const self = this
    var cookieString = self.getCookie().length;
    if(cookieString === 0){
      var changePage = confirm("请先登陆");
      if(changePage){
        window.location.href = "login.html"
      }
      return;
    }

    this.setStatus('Initiating transaction... (please wait)')
    const amount = parseInt(document.getElementById('moneyNum2').value)

    //amount = amount / Math.pow(10,41);

    if (amount > 0) {
      let addMoney
      CharacterLevelUp.deployed().then(function (instance) {
        addMoney = instance
        //gasNum = web3.eth.getBlock("pending").gasLimit
        return addMoney.addFoodWithMoney({ from: account, gas: 3141592, value: amount })
      }).then(function () {
        self.setStatus('Transaction complete!')
        self.getFood()
      }).catch(function (e) {
        console.log(e)
        self.setStatus('Error adding balance; see log.')
      })
    }
    else {
      self.setStatus('please input more than 1')
    }
  },

  getGreenStarNum: function() {
    const self = this;
    let character;
    CharacterLevelUp.deployed().then(function (instance) {
      character = instance;
      return character.recentStarNum(account, { from: account });
    }).then(function (value) {
      //self.getFood();
      greenStarNum = parseInt(value.valueOf());
      var fightDetail = document.getElementById('fightDetail');
      var thisLine = document.createElement('div');
      thisLine.className = "row";
      var detailP = document.createElement('p');
      detailP.innerHTML = "本回合你收获"+value.valueOf().toString()+"个暴击星";
      thisLine.appendChild(detailP);
      fightDetail.appendChild(thisLine);
      return self.initFight3();
    }).catch(function (e) {
      console.log(e)
      self.setStatus('you don\'t have enough food')
      //showCharacterNum = 0;
    })
  }


  /*sendCoin: function () {
    const self = this

    const amount = parseInt(document.getElementById('amount').value)
    const receiver = document.getElementById('receiver').value

    this.setStatus('Initiating transaction... (please wait)')

    let meta
    MetaCoin.deployed().then(function (instance) {
      meta = instance
      return meta.sendCoin(receiver, amount, { from: account })
    }).then(function () {
      self.setStatus('Transaction complete!')
      self.refreshBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error sending coin; see log.')
    })
  }*/
}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:8545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))
  }

  App.start()
})

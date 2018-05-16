const { Plugin } = require('elements')

module.exports = class FakeConnections extends Plugin {
  preload () {
    const r = (this.react = this.manager.get('react'));
    this.mBind = this.check.bind(this);
    this.react.on('mutation', this.mBind);
    this.html = `<div class="fake-connection-box connection-1fbD7X elevationLow-2lY09M marginBottom8-AtZOdT" style="border-color: rgb(54, 57, 63);background-color: rgb(54, 57, 63);"><div class="connectionHeader-2MDqhu marginBottom20-32qID7"><img class="connectionIcon-2ElzVe noUserDrag-5Mb43F" src="//discordinjections.xyz/img/logo-alt-nobg.svg"><div><div class="default-3nhoK- formText-3fs7AJ connectionAccountValue-3VdBGs modeDefault-3a2Ph1 primary-jw0I4K">Fake Connections Plugin</div><div class="description-3_Ncsb formText-3fs7AJ connectionAccountLabel-1DiK0A modeDefault-3a2Ph1 primary-jw0I4K" style="color: rgb(255, 255, 255);">CLICK TO EXPAND</div></div></div><div class="connectionOptionsWrapper-3KIj1Z"><div class="connectionOptions-YE9FAM"><div class="connectedAccounts-2-XP1G margin-bottom-20"><div class="battlenet wrapper-3JPufy accountBtn-2Nozo3"><button class="inner-2Y6JuD accountBtnInner-sj5jLs" type="button" style="background-image: url(&quot;/assets/8c289d499232cd8e9582b4a5639d9d1d.png&quot;);"></button></div><div class="skype wrapper-3JPufy accountBtn-2Nozo3"><button class="inner-2Y6JuD accountBtnInner-sj5jLs" type="button" style="background-image: url(&quot;/assets/5be6cc17e596c02e7506f2776cfb1622.png&quot;);"></button></div><div class="leagueoflegends wrapper-3JPufy accountBtn-2Nozo3 fc-selected"><button class="inner-2Y6JuD accountBtnInner-sj5jLs" type="button" style="background-image: url(&quot;/assets/806953fe1cc616477175cbcdf90d5cd3.png&quot;);"></button></div></div><div class="option-section"><h2 class="h2-2gWE-o title-3sZWYQ size16-14cGz5 height20-mO2eIN weightSemiBold-NJexzi defaultColor-1_ajX0 defaultMarginh2-2LTaUL">Name</h2><div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO margin-bottom-20"><input type="text" class="inputDefault-_djjkz input-cIJ7To size16-14cGz5 flexChild-faoVW3 inputDefault-Y_U37D input-2YozMi size16-3IvaX_ flexChild-1KGW5q" placeholder="Cool Guy" style="flex: 1 1 auto; display: inline-block;"></div></div><div class="option-section"><h2 class="h2-2gWE-o title-3sZWYQ size16-14cGz5 height20-mO2eIN weightSemiBold-NJexzi defaultColor-1_ajX0 defaultMarginh2-2LTaUL">ID<small>(optional)</small></h2><div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO margin-bottom-20"><input type="text" class="inputDefault-_djjkz input-cIJ7To size16-14cGz5 flexChild-faoVW3 inputDefault-Y_U37D input-2YozMi size16-3IvaX_ flexChild-1KGW5q" placeholder="Having this blank will generate an ID." value="" style="flex: 1 1 auto; display: inline-block;"></div></div><div class="submit-section"><div class="connectionDelete-2Odoln flexCenter-3_1bcw flex-1O1GKY justifyCenter-3D2jYp alignCenter-1dQNNs"><span>Disconnect</span></div><h3 class="titleDefault-1CWM9y title-3i-5G_ marginReset-3hwONl weightMedium-13x9Y8 size16-3IvaX_ height24-2pMcnc flexChild-1KGW5q status-message" style="flex: 1 1 auto;"></h3></div></div></div></div>`;
    this.connectionListClass = ".accountList-33MS45 + .flex-1xMQg5 + div";
    this.connectionCheckClass = ".accountList-33MS45";
  }

  load () { }

  unload () {
    this.react.removeListener('mutation', this.mBind);
    if(document.querySelector(".fake-connection-box")) document.querySelector(this.connectionListClass).removeChild(document.querySelector(".fake-connection-box"));
  }

  get color() {
    return '7A78BD';
  }

  check(){
    if(!document.querySelector(".fake-connection-box") && document.querySelector(this.connectionCheckClass)){
      let html = document.createRange().createContextualFragment(this.html);
      let box = html.childNodes[0];
      box._selectedAccount = "leagueoflegends";
      let self = this;
      box.querySelector('[class*="connectionHeader-"]').onclick = () => {
        if(box.classList.contains("show")) box.classList.remove("show"); else box.classList.add("show");
      }
      box.querySelector('[class*="connectionDelete-"]').onclick = () => {
        let [name, id] = box.querySelectorAll("input");
        id = id.value === "" ? Date.now().toString(36) : id.value;
        name = name.value;
        if(name === "") return self.sendStatusMessage("fail", "No name provided");
        self.log("Adding connection", id, name, box._selectedAccount);
        this.post(box._selectedAccount, id, { name, visibility: 1 })
          .then(b => self.sendStatusMessage("success", "Success"))
          .catch(e => self.sendStatusMessage("fail", "Request failed, check console"));
      }
      let conF = function(){
        document.querySelector(`.${box._selectedAccount}`).classList.remove("fc-selected");
        box._selectedAccount = this.parentNode.classList[0];
        this.parentNode.classList.add("fc-selected");
      }
      box.querySelectorAll('[class*="connectedAccounts-2-"] button').forEach(b => b.onclick = conF);
      if(document.querySelector(this.connectionListClass).childNodes.length === 0) document.querySelector(this.connectionListClass).appendChild(box); else document.querySelector(this.connectionListClass).insertBefore(box, document.querySelector(this.connectionListClass).childNodes[0]);
    }
  }

  sendStatusMessage(s,m){
    if(document.querySelector(".fake-connection-box")){
      this.resetStatusMessage();
      document.querySelector(".fake-connection-box .status-message").classList.add(s);
      document.querySelector(".fake-connection-box .status-message").innerHTML = m;
      this.to = setTimeout(this.resetStatusMessage.bind(this), 5000);
    }
  }

  resetStatusMessage(){
    if(document.querySelector(".fake-connection-box")){
      document.querySelector(".fake-connection-box .status-message").classList.remove("fail");
      document.querySelector(".fake-connection-box .status-message").classList.remove("success");
      document.querySelector(".fake-connection-box .status-message").innerHTML = "";
      clearTimeout(this.to);
    }
  }

  post(type, id, data){
    return fetch(`https://canary.discordapp.com/api/v6/users/@me/connections/${type}/${id}`, {
      body: JSON.stringify(data),
      cache: 'no-cache',
      headers: {
        'content-type': 'application/json',
        'authorization': JSON.parse(this.DI.localStorage.token)
      },
      method: 'PUT',
      mode: 'cors'
    }).then(r => r.json())
  }
}

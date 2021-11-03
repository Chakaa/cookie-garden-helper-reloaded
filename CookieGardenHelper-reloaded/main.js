//Steam version of https://github.com/yannprada/cookie-garden-helper
Game.registerMod("cookiegardenhelperreloaded",{
	init:function(){
		this.name = 'Cookie Garden Helper - Reloaded';
		this.modid = 'cookiegardenhelperreloaded';
		this.version = '1.4.9';
		this.GameVersion = '2.042';
		
		this.config = this.defaultConfig();
		this.doc = {
			elId: document.getElementById.bind(document),
			qSel: document.querySelector.bind(document),
			qSelAll: document.querySelectorAll.bind(document),
		};
		
		this.build();
		this.start();
		
		if (Game.prefs.popups) Game.Popup(this.name + ' v' + this.version + ' loaded!');
		else Game.Notify(this.name + ' v' + this.version + ' loaded!', '', '', 1, 1);
	},
	//Main
	start:function() {
		this.timerId = window.setInterval(
			() => this.run(),
			this.config.timerInterval
		);
	},
	stop:function() { window.clearInterval(this.timerId); },
	restart:function() { this.stop();this.start(); },
	handleSeedClick:function(seedId) {
		if(!this.parentsUnlocked(seedId))return;
		this.config.savedPlot=this.buildMutationPlotData(seedId);
	},
	handleChange:function(key, value) {
		if (this.config[key].value !== undefined) {
			this.config[key].value = value;
		} else {
			this.config[key] = value;
		}
		this.save();
	},
	toggleSeedList:function(key) {
		var x = this.doc.elId("cghrSeedListDiv");
		if (x.style.display === "none") {
			x.style.display = "block";
			this.doc.elId('cookiegardenhelperreloadedToggleSeedList').innerHTML='-';
		} else {
			x.style.display = "none";
			this.doc.elId('cookiegardenhelperreloadedToggleSeedList').innerHTML='+';
		}
	},
	handleToggle:function(key) {
		this.config[key] = !this.config[key];
		this.save();
		this.toggleButton(key);
	},
	handleClick:function(key) {
		if (key == 'fillGardenWithSelectedSeed') {
			this.fillGardenWithSelectedSeed();
		} else if (key == 'savePlot') {
			this.config['savedPlot'] = this.clonePlot();
			this.labelToggleState('plotIsSaved', true);
		}
		this.save();
	},
	handleMouseoutPlotIsSaved:function(element) { Game.tooltip.shouldHide=1; },
	handleMouseoverPlotIsSaved:function(element) {
		if (this.config.savedPlot.length > 0) {
			let content = this.buildSavedPlot();
			Game.tooltip.draw(element, window.escape(content));
		}
	},
	handleMouseoutSeedList:function(element) { Game.tooltip.shouldHide=1; },
	handleMouseoverSeedList:function(element,seedId) {
		let content = this.buildMutationPlot(seedId);
		Game.tooltip.draw(element, window.escape(content));
	},
	
	//Menu Stuff
	makeId:function(id) { return this.modid + this.capitalize(id); },
	css:function() {
    return `
		#game.onMenu #cookieGardenHelperReloaded {
		  display: none;
		}
		#cookieGardenHelperReloaded {
		  background: #000 url(img/darkNoise.jpg);
		  display: none;
		  padding: 1em;
		  position: inherit;
		}
		#cookieGardenHelperReloaded.visible {
		  display: block;
		}
		#cookieGardenHelperReloadedTools:after {
		  content: "";
		  display: table;
		  clear: both;
		}
		.cookieGardenHelperReloadedSmallSubPanel {
		  float: left;
		  width: 20%;
		}
		.cookieGardenHelperReloadedPanel {
		  float: left;
		  width: 25%;
		}
		.cookieGardenHelperReloadedSmallPanel {
		  float: left;
		  width: 18%;
		}
		.cookieGardenHelperReloadedSubPanel {
		  float: left;
		  width: 50%;
		}
		.cookieGardenHelperReloadedSeedPanel {
		  float: left;
		  width: 100%;
		}
		.cookieGardenHelperReloadedBigPanel {
		  float: left;
		  width: 50%;
		}
		#autoHarvestPanel { color: wheat; }
		#autoHarvestPanel a { color: wheat; }
		#autoPlantPanel { color: lightgreen; }
		#autoPlantPanel a { color: lightgreen; }
		#autoHarvestPanel a:hover,
		#autoPlantPanel a:hover { color: white; }
		#cookieGardenHelperReloadedTitle {
		  color: grey;
		  font-size: 2em;
		  font-style: italic;
		  margin-bottom: 0.5em;
		  margin-top: -0.5em;
		  text-align: center;
		}
		#cookieGardenHelperReloaded h2 {
		  font-size: 1.5em;
		  line-height: 2em;
		}
		#cookieGardenHelperReloaded h3 {
		  color: lightgrey;
		  font-style: italic;
		  line-height: 2em;
		}
		#cookieGardenHelperReloaded p {
		  text-indent: 0;
		}
		#cookieGardenHelperReloaded input[type=number] {
		  width: 3em;
		}
		#cookieGardenHelperReloaded a.toggleBtn:not(.off) .toggleBtnOff,
		#cookieGardenHelperReloaded a.toggleBtn.off .toggleBtnOn {
		  display: none;
		}
		#cookieGardenHelperReloaded span.labelWithState:not(.active) .labelStateActive,
		#cookieGardenHelperReloaded span.labelWithState.active .labelStateNotActive {
		  display: none;
		}
		#cookieGardenHelperReloadedTooltip {
		  width: 300px;
		}
		#cookieGardenHelperReloadedTooltip .gardenTileRow {
		  height: 48px;
		}
		#cookieGardenHelperReloadedTooltip .tile {
		  border: 1px inset dimgrey;
		  display: inline-block;
		  height: 48px;
		  width: 48px;
		}
		#cookieGardenHelperReloadedTooltip .gardenTileIcon {
		  position: inherit;
		}
		#cookieGardenHelperReloadedTooltip .gardenTileIcon.off {
		  opacity: 20%;
		}
		#cookieGardenHelperReloaded .warning {
			padding: 1em;
			font-size: 1.5em;
			background-color: orange;
			color: white;
		}
		#cookieGardenHelperReloaded .warning .closeWarning {
			font-weight: bold;
			float: right;
			font-size: 2em;
			line-height: 0.25em;
			cursor: pointer;
			transition: 0.3s;
		}
		#cookieGardenHelperReloaded .warning .closeWarning:hover {
			color: black;
		}
		.cookieGardenHelperReloadedGardenSeed {
		    pointer-events: none;
			transform: translate(0,0);
			display: inline-block;
			/* position: absolute; */
			left: -4px;
			top: -4px;
			width: 48px;
			height: 48px;
			background: url(img/gardenPlants.png?v=2.042);
			vertical-align: middle;
		}
		`;
	},
	numberInput:function(name, text, title, options) {
		let id = this.makeId(name);
		return `
			<input type="number" name="${name}" id="${id}" value="${options.value}" step=0.5
			  ${options.min !== undefined ? `min="${options.min}"` : ''}
			  ${options.max !== undefined ? `max="${options.max}"` : ''} />
			<label for="${id}" title="${title}">${text}</label>`;
	},
	button:function(name, text, title, toggle, active) {
		if (toggle) {
		  return `<a class="toggleBtn option ${active ? '' : 'off'}" name="${name}" id="${this.makeId(name)}" title="${title}">
			${text}
			<span class="toggleBtnOn">ON</span>
			<span class="toggleBtnOff">OFF</span>
		  </a>`;
		}
		return `<a class="btn option" name="${name}" id="${this.makeId(name)}" title="${title}">${text}</a>`;
	},
	customButton:function(name, text, title, active) {
		return `<a class="toggleBtn option ${active ? '' : 'off'}" name="${name}" id="${this.makeId(name)}" title="${title}">${text}</a>`;
	},
	toggleButton:function(name) {
		if(name=="autoPlantRotateSoilComboName"){
			this.setNextCombo();
			let btn = this.doc.qSel(`#cookieGardenHelperReloaded a.toggleBtn[name=${name}]`);
			btn.innerHTML=this.getSoilRotationCombo()[0];
		}else{
			let btn = this.doc.qSel(`#cookieGardenHelperReloaded a.toggleBtn[name=${name}]`);
			btn.classList.toggle('off');
			if(name=="autoPlantRotateSoil"){
				let name2 = "autoPlantRotateSoilComboName"
				let btn2 = this.doc.qSel(`#cookieGardenHelperReloaded a.toggleBtn[name=${name2}]`);
				btn2.classList.toggle('off');
			}
		}
	},
	labelWithState:function(name, text, textActive, active) {
		return `<span name="${name}" id="${this.makeId(name)}" class="labelWithState ${active ? 'active' : ''}"">
		  <span class="labelStateActive">${textActive}</span>
		  <span class="labelStateNotActive">${text}</span>
		</span>`;
	},
	labelToggleState:function(name, active) {
		let label = this.doc.qSel(`#cookieGardenHelperReloaded span.labelWithState[name=${name}]`);
		label.classList.toggle('active', active);
	},
	createWarning:function(msg) {
		this.doc.elId('row2').insertAdjacentHTML('beforebegin', `
			<div id="cookieGardenHelperReloaded">
			<style>${this.css()}</style>
			<div class="warning">
			<span class="closeWarning">&times;</span>
			${msg}
			</div>
			</div>`
		);
		this.doc.qSel('#cookieGardenHelperReloaded .closeWarning').onclick = (event) => {
			this.doc.elId('cookieGardenHelperReloaded').remove();
		};
	},
	readmeLink:function() { return 'https://github.com/Chakaa/cookie-garden-helper-reloaded/blob/master/README.md#how-it-works'; },
	
	build:function() {
		if(	l("cookieGardenHelperReloadedProductButton") )
			l("cookieGardenHelperReloadedProductButton").remove();
		if(	l("cookieGardenHelperReloaded") )
			l("cookieGardenHelperReloaded").remove();
		
		
		this.doc.qSel('#row2 .productButtons').insertAdjacentHTML('beforeend', `
			<div id="cookieGardenHelperReloadedProductButton" class="productButton">CGHR</div>`);
		this.doc.elId('row2').insertAdjacentHTML('beforeend', `
			<div id="cookieGardenHelperReloaded">
			  <style>${this.css()}</style>
			  <a href="${this.readmeLink()}" target="new">how it works</a>
			  <div id="cookieGardenHelperReloadedTitle" class="title">Cookie Garden Helper Reloaded</div>
			  <div id="cookieGardenHelperReloadedTools">
				<div class="cookieGardenHelperReloadedBigPanel" id="autoHarvestPanel">
				  <h2>
					Auto-harvest
					${this.button('autoHarvest', '', '', true, this.config.autoHarvest)}
				  </h2>
				  <div class="cookieGardenHelperReloadedSubPanel">
					<h3>immortal</h3>
					<p>
					  ${this.button(
						'autoHarvestAvoidImmortals', 'Avoid immortals',
						'Do not harvest immortal plants', true,
						this.config.autoHarvestAvoidImmortals
					  )}
					</p>
					<h3>mature</h3>
					<p>
					  ${this.button(
						'autoHarvestNewSeeds', 'New seeds',
						'Harvest new seeds as soon as they are mature', true,
						this.config.autoHarvestNewSeeds
					  )}
					</p>
					<p>
					  ${this.button(
						'autoHarvestMatured', 'Matured seeds',
						'Harvest matured seeds as soon as they are mature', true,
						this.config.autoHarvestMatured
					  )}
					</p>
					<p>
					  ${this.button(
						'autoHarvestCheckCpSMult', 'Check CpS mult',
						'Check the CpS multiplier before harvesting (see below)', true,
						this.config.autoHarvestCheckCpSMult
					  )}
					</p>
					<p>
					  ${this.numberInput(
						'autoHarvestMiniCpSMult', 'Mini CpS multiplier',
						'Minimum CpS multiplier for the auto-harvest to happen',
						this.config.autoHarvestMiniCpSMult
					  )}
					</p>
				  </div>
				  <div class="cookieGardenHelperReloadedSubPanel">
					<h3>young</h3>
					<p>
					  ${this.button(
						'autoHarvestWeeds', 'Remove weeds',
						'Remove weeds as soon as they appear', true,
						this.config.autoHarvestWeeds
					  )}
					</p>
					<p>
					  ${this.button(
						'autoHarvestCleanGarden', 'Clean Garden',
						'Only allow saved and new seeds', true,
						this.config.autoHarvestCleanGarden
					  )}
					</p>
					<h3>dying</h3>
					<p>
					  ${this.button(
						'autoHarvestDying', 'Dying plants',
						`Harvest dying plants, ${this.config.autoHarvestDyingSeconds}s before `
						+ `the new tick occurs`, true,
						this.config.autoHarvestDying
					  )}
					</p>
					<p>
					  ${this.button(
						'autoHarvestCheckCpSMultDying', 'Check CpS mult',
						'Check the CpS multiplier before harvesting (see below)', true,
						this.config.autoHarvestCheckCpSMultDying
					  )}
					</p>
					<p>
					  ${this.numberInput(
						'autoHarvestMiniCpSMultDying', 'Mini CpS multiplier',
						'Minimum CpS multiplier for the auto-harvest to happen',
						this.config.autoHarvestMiniCpSMultDying
					  )}
					</p>
				  </div>
				</div>
				<div class="cookieGardenHelperReloadedPanel" id="autoPlantPanel">
				  <h2>
					Auto-plant
					${this.button('autoPlant', '', '', true, this.config.autoPlant)}
				  </h2>
				  <p>
					${this.button(
					  'autoPlantAvoidBuffs', 'Avoid Buffs',
					  'Make sure there is no buffs before planting (saving cookies)', true,
					  this.config.autoPlantAvoidBuffs
					)}
				  </p>
				  <p>
					${this.button(
					  'autoPlantRotateSoil', 'Rotate Soil',
					  'Rotate soil based on mature/young counts', true,
					  this.config.autoPlantRotateSoil
					)}
					${this.customButton(
					  'autoPlantRotateSoilComboName', this.getSoilRotationCombo()[0],
					  'Cycle on possible soil rotation combos', this.config.autoPlantRotateSoil
					)}
				  </p>
				  <p>
					${this.button(
					  'autoPlantCheckCpSMult', 'Check CpS mult',
					  'Check the CpS multiplier before planting (see below)', true,
					  this.config.autoPlantCheckCpSMult
					)}
				  </p>
				  <p>
					${this.numberInput(
					  'autoPlantMaxiCpSMult', 'Maxi CpS multiplier',
					  'Maximum CpS multiplier for the auto-plant to happen',
					  this.config.autoPlantMaxiCpSMult
					)}
				  </p>
				  <p>
					${this.button('savePlot', 'Save plot',
					  'Save the current plot; these seeds will be replanted later')}
					${this.labelWithState('plotIsSaved', 'No saved plot', 'Plot saved',
					  Boolean(this.config.savedPlot.length))}
				  </p>
				  <!--
				  <p>
					${this.button(
					  'autoForceTicks', 'Force ticks',
					  'Force grow ticks to happen frequently', true,
					  this.config.autoForceTicks
					)}
				  </p>
				  -->
				</div>
				<div class="cookieGardenHelperReloadedPanel" id="manualToolsPanel">
				  <h2>Manual tools</h2>
				  <p>
					${this.button('fillGardenWithSelectedSeed', 'Plant selected seed',
					'Plant the selected seed on all empty tiles')}
				  </p>
				</div>
				<div class="cookieGardenHelperReloadedPanel" id="gardenUpgradesPanel">
				  <h2>Garden upgrades</h2>
				  <p id="cghrUpgradeListDiv" style=""></p>
				</div>
				<div class="cookieGardenHelperReloadedSeedPanel" id="seedList">
				  <h2>Seed List ${this.button('ToggleSeedList', '+', 
					'Display or hide seed list. In orange, what could be unlocked. In red, what cannot.')}</h2>
				  <p id="cghrSeedListDiv" style="display:none"></p>
				</div>
			  </div>
			</div>`);

		this.doc.elId('cookieGardenHelperReloadedProductButton').onclick = (event) => {
		  this.doc.elId('cookieGardenHelperReloaded').classList.toggle('visible');
		};

		this.doc.qSelAll('#cookieGardenHelperReloaded input').forEach((input) => {
		  input.onchange = (event) => {
			if (input.type == 'number') {
			  let min = this.config[input.name].min;
			  let max = this.config[input.name].max;
			  if (min !== undefined && input.value < min) { input.value = min; }
			  if (max !== undefined && input.value > max) { input.value = max; }
			  this.handleChange(input.name, input.value);
			}
		  };
		});

		this.doc.qSelAll('#cookieGardenHelperReloaded a.toggleBtn').forEach((a) => {
		  a.onclick = (event) => {
			this.handleToggle(a.name);
		  };
		});

		this.doc.qSelAll('#cookieGardenHelperReloaded a.btn').forEach((a) => {
		  a.onclick = (event) => {
			this.handleClick(a.name);
		  };
		});

		this.doc.elId('cookiegardenhelperreloadedPlotIsSaved').onmouseout = (event) => {
			this.handleMouseoutPlotIsSaved(this);
		}
		this.doc.elId('cookiegardenhelperreloadedPlotIsSaved').onmouseover = (event) => {
			this.handleMouseoverPlotIsSaved(this);
		}
		this.doc.elId('cookiegardenhelperreloadedToggleSeedList').onclick = (event) => {
			this.toggleSeedList(this);
		}
	},
	getUpgradeListDisplay:function() {
		str = "";
		if(this.isActive()){
			for(let i=470;i<=476;i++){
				var ic = Game.UpgradesById[i].icon;
				str += `
				<div class="crate upgrade${Game.UpgradesById[i].bought==1?' enabled':''}" onmouseout="Game.tooltip.shouldHide=1;" onmouseover="Game.tooltip.dynamic=1;Game.tooltip.draw(this,function(){return Game.crateTooltip(Game.UpgradesById[${i}],'store');},'top');Game.tooltip.wobble();" id="upg-${i}" style="${Game.UpgradesById[i].unlocked==0?'opacity:.3;':''}width:48px;height:48px;background-image: url(img/icons.png);background-position: ${-1*ic[0]*48}px ${-1*ic[1]*48}px;"></div>`;
			}
		}
		return str;
	},
	getSeedListDisplay:function() {
		str = "";
		if(this.isActive()){
			for (let i = 1; i <= this.minigame().plantsById.length; i++){
				var p = this.getPlant(i)
				str += `<div class="cookieGardenHelperReloadedSmallSubPanel seedListItem" id="plant-${i}">
					<div id="gardenSeedIcon-${i}" class="cookieGardenHelperReloadedGardenSeed shadowFilter" style="background-position:0px ${this.getSeedIconY(i)}px;"></div>
					<div style="display:inline-block;${p.unlocked==1?'':(!this.parentsUnlocked(i)?'color:red;':'color:orange;')}">${i} - ${p.name}</div>
				</div>`;
			}
		}
		
		return str;
	},
	setSeedListTooltips:function() {
		this.doc.qSelAll('.seedListItem').forEach((d) => {
		  d.onclick = (event) => {
			this.handleSeedClick(parseInt(d.id.split('-')[1]));
		  };

		  d.onmouseout = (event) => {
		  	this.handleMouseoutSeedList(this);
		  }
		  d.onmouseover = (event) => {
		  	this.handleMouseoverSeedList(this, parseInt(d.id.split('-')[1]));
		  }
		});
	},
	isMutationPlace:function(parents,x,y){
		if(this.isActive()){
			var l = Game.Objects['Farm'].level
			
			//Level 1
			if(l==1 && parents==1){
				if(x==2 && (y==2||y==3)){ return 0 }
			}
			else if(l==1 && parents==2){
				if(x==2 && y==2){ return 0 }
				else if(x==2 && y==3){ return 1 }
			}
			//Level 2
			else if(l==2 && parents==1){
				if(x==3 && (y==2||y==3)){ return 0 }
			}
			else if(l==2 && parents==2){
				if(x==3 && y==2){ return 0 }
				else if(x==3 && y==3){ return 1 }
			}
			//Level 3
			else if(l==3 && parents==1){
				if(y==3 && (x==2||x==3||x==4)){ return 0 }
			}
			else if(l==3 && parents==2){
				if(y==3 && (x==2||x==4)){ return 0 }
				else if(y==3 && x==3){ return 1 }
			}
			//Level 4
			else if(l==4 && parents==1){
				if(y==3 && (x==1||x==2||x==3||x==4)){ return 0 }
			}
			else if(l==4 && parents==2){
				if(y==3 && (x==2||x==3)){ return 0 }
				else if(y==3 && (x==1||x==4)){ return 1 }
			}
			//Level 5
			else if(l==5 && parents==1){
				if((x==1 && y==1) || (x==1 && y==4) || (x==4 && y==1) || (x==4 && y==4) || (x==3 && y==2) || (x==2 && y==3)){ return 0 }
			}
			else if(l==5 && parents==2){
				if((x==1 && y==1) || (x==1 && y==4) || (x==4 && y==1) || (x==4 && y==4)){ return 0 }
				else if((x==3 && y==2) || (x==2 && y==3)){ return 1 }
			}
			//Level 6
			else if(l==6 && parents==1){
				if((x==1 && y==1) || (x==1 && y==4) || (x==2 && y==2) || (x==3 && y==4) || (x==4 && y==2) || (x==5 && y==1) || (x==5 && y==4)){ return 0 }
			}
			else if(l==6 && parents==2){
				if((x==2 && y==3) || (x==3 && y==1) || (x==5 && y==3)){ return 0 }
				else if((x==1 && y==1) || (x==1 && y==3) || (x==4 && y==3) || (x==5 && y==1)){ return 1 }
			}
			//Level 7
			else if(l==7 && parents==1){
				if((x==2 || x==5) && (y==1 || y==2 || y==4 || y==5)){ return 0 }
			}
			else if(l==7 && parents==2){
				if((x==2 || x==5) && (y==2 || y==5)){ return 0 }
				else if((x==1 || x==4) && (y==2 || y==5)){ return 1 }
			}
			//Level 8
			else if(l==8 && parents==1){
				if((x==1 || x==4) && (y==1 || y==2 || y==4 || y==5)){ return 0 }
			}
			else if(l==8 && parents==2){
				if((x==1 || x==4) && (y==1 || y==4)){ return 0 }
				else if((x==1 || x==4) && (y==2 || y==5)){ return 1 }
			}
			//Level 9+
			else if(l>=9 && parents==1){
				if((x==1 || x==4) && (y==0 || y==1 || y==2 || y==4 || y==5)){ return 0 }
			}
			else if(l>=9 && parents==2){
				if((x==1 || x==4) && (y==0 || y==5)){ return 0 }
				else if((x==4 && y==2) || (x==1 && y==3)){ return 0 }
				else if((x==1 || x==4) && (y==1 || y==4)){ return 1 }
			}
		}
		return -1;
	},
	getSeedIconY:function(seedId) { return this.getPlant(seedId).icon * -48; },
	buildSavedPlot:function() {
		return `<div id="cookieGardenHelperReloadedTooltip">
		  ${this.config.savedPlot.map((row) => `<div class="gardenTileRow">
			${row.map((tile) => `<div class="tile">
			  ${(tile[0] - 1) < 0 ? '' : `<div class="gardenTileIcon"
				style="background-position: 0 ${this.getSeedIconY(tile[0])}px;">
			  </div>`}
			</div>`).join('')}
		  </div>`).join('')}
		</div>`;
	},
	buildMutationPlot:function(seedId) {
		//console.log(seedId+"-"+this.isSeedUnlocked(seedId))
		return `<div id="cookieGardenHelperReloadedTooltip">
		  ${this.buildMutationPlotData(seedId).map((row) => `<div class="gardenTileRow">
			${row.map((tile) => `<div class="tile">
			  ${(tile[0] - 1) < 0 ? '' : `<div class="gardenTileIcon ${this.isSeedUnlocked(tile[0])?'on':'off'}"
				style="background-position: 0 ${this.getSeedIconY(tile[0])}px;">
			  </div>`}
			</div>`).join('')}
		  </div>`).join('')}
		</div>`;
	},
	emptyPlot:function() {
		return [[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]];
	},
	horizontalPlots:function(parents) {
		var l = Game.Objects['Farm'].level
		var p1 = parents[0]+1
		var p2 = (parents.length>1?parents[1]:parents[0])+1;
		if(l>=8){
			return [
				[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
				[[p1,0],[p1,0],[p1,0],[p1,0],[p1,0],[p1,0]],
				[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
				[[p2,0],[p2,0],[p2,0],[p2,0],[p2,0],[p2,0]],
				[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
				[[p1,0],[p1,0],[p1,0],[p1,0],[p1,0],[p1,0]]
			];
		}else if(l>=7){
			return [
				[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
				[[0,0],[p1,0],[p1,0],[p1,0],[p1,0],[p1,0]],
				[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
				[[0,0],[p2,0],[p2,0],[p2,0],[p2,0],[p2,0]],
				[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
				[[0,0],[p1,0],[p1,0],[p1,0],[p1,0],[p1,0]]
			];
		}else if(l>=6){
			return [
				[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
				[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
				[[0,0],[p2,0],[p2,0],[p2,0],[p2,0],[p2,0]],
				[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
				[[0,0],[p1,0],[p1,0],[p1,0],[p1,0],[p1,0]],
				[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]
			];
		}else if(l>=4){
			return [
				[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
				[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
				[[0,0],[p2,0],[p2,0],[p2,0],[p2,0],[0,0]],
				[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
				[[0,0],[p1,0],[p1,0],[p1,0],[p1,0],[0,0]],
				[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]
			];
		}else if(l>=3){
			return [
				[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
				[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
				[[0,0],[0,0],[p2,0],[p2,0],[p2,0],[0,0]],
				[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
				[[0,0],[0,0],[p1,0],[p1,0],[p1,0],[0,0]],
				[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]
			];
		}
		return this.emptyPlot();
	},
	parentsUnlocked:function(seedId) {
		var parents = this.getPlantParents(seedId);
		if(parents.length<=0){ return true; }
		var p1 = parents[0]
		var p2 = (parents.length>1?parents[1]:parents[0]);
		
		return this.isSeedUnlocked(p1+1) && this.isSeedUnlocked(p2+1)
	},
	buildMutationPlotData:function(seedId) {
		var m = this.getPlantParents(seedId);
		
		var l = Game.Objects['Farm'].level
		//Juicy queenbeet
		if(seedId==22){
			if(l>=7){
				var Q = [21,0]
				var X = [0,0]
				return [ 
					[X,X,X,X,X,X],
					[X,Q,Q,Q,Q,Q],
					[X,Q,X,Q,X,Q],
					[X,Q,Q,Q,Q,Q],
					[X,Q,X,Q,X,Q],
					[X,Q,Q,Q,Q,Q]
				];
			}
			if(l>=3){
				return [	
					[X,X,X,X,X,X],
					[X,X,X,X,X,X],
					[X,X,X,X,X,X],
					[X,X,X,Q,Q,Q],
					[X,X,X,Q,X,Q],
					[X,X,X,Q,Q,Q]
				];
			}
			return this.emptyPlot();
		}
		//Golden clover
		if(seedId==6){
			if(l>=9){
				return [[[5,0],[5,0],[0,0],[5,0],[0,0],[5,0]],[[0,0],[5,0],[0,0],[5,0],[0,0],[5,0]],[[5,0],[0,0],[0,0],[5,0],[0,0],[5,0]],[[5,0],[0,0],[5,0],[0,0],[0,0],[5,0]],[[5,0],[0,0],[5,0],[0,0],[5,0],[0,0]],[[5,0],[0,0],[5,0],[0,0],[5,0],[5,0]]];
			}
			else if(l>=8){
				return [[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[5,0],[0,0],[5,0],[0,0],[0,0],[5,0]],[[5,0],[0,0],[5,0],[5,0],[5,0],[5,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[5,0],[0,0],[5,0],[5,0],[5,0],[5,0]],[[5,0],[0,0],[5,0],[0,0],[0,0],[5,0]]];
			}
			else if(l>=7){
				return [[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[5,0],[0,0],[5,0],[0,0],[5,0]],[[0,0],[5,0],[0,0],[5,0],[0,0],[5,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[5,0],[0,0],[5,0],[0,0],[5,0]],[[0,0],[5,0],[0,0],[5,0],[0,0],[5,0]]];
			}
			else if(l>=6){
				return [[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[5,0],[5,0],[0,0],[5,0],[5,0]],[[0,0],[0,0],[5,0],[0,0],[5,0],[0,0]],[[0,0],[0,0],[5,0],[0,0],[5,0],[0,0]],[[0,0],[5,0],[5,0],[0,0],[5,0],[5,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]];
			}
			else if(l>=5){
				return [[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[5,0],[0,0],[5,0],[5,0],[0,0]],[[0,0],[5,0],[0,0],[5,0],[0,0],[0,0]],[[0,0],[5,0],[0,0],[5,0],[0,0],[0,0]],[[0,0],[5,0],[0,0],[5,0],[5,0],[0,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]];
			}
			else if(l>=4){
				return [[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[5,0],[0,0],[5,0],[5,0],[0,0]],[[0,0],[5,0],[0,0],[5,0],[0,0],[0,0]],[[0,0],[5,0],[0,0],[5,0],[0,0],[0,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]];
			}
			else if(l>=3){
				return [[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[0,0],[5,0],[0,0],[5,0],[0,0]],[[0,0],[0,0],[5,0],[0,0],[5,0],[0,0]],[[0,0],[0,0],[5,0],[0,0],[5,0],[0,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]];
			}
			else if(l>=2){
				return [[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[0,0],[5,0],[0,0],[5,0],[0,0]],[[0,0],[0,0],[5,0],[0,0],[5,0],[0,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]];
			}
			else if(l>=1){
				return [[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[0,0],[5,0],[0,0],[0,0],[0,0]],[[0,0],[0,0],[5,0],[0,0],[0,0],[0,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]];
			}
			return this.emptyPlot();
		}
		//Shriekbulb && Everdaisy : Horizontal Lines
		if((seedId==31 && l>=3) || seedId==33){
			return this.horizontalPlots(m);
		}
		//Alternative parents
		//Shriekbulb for level 1-2
		if(seedId==31 && l<=2){
			m=[29,8];
		}
		
		let plot = this.clone(this.minigame().plot);
		for (let x=0; x<6; x++) {
		  for (let y=0; y<6; y++) {
			var mid = this.isMutationPlace(m.length,y,x);
			plot[x][y] = [(mid>=0?m[mid]+1:0), 0];
		  }
		}
		return plot;
	},
	isSeedUnlocked:function(seedId) { return this.getPlant(seedId).unlocked==1; },
	getPlantParents:function(seedId) {
		var mutations = [[0],[0],[0,1],[1,2],[0,3],[4],[4,3],[2,6],[0],[0,12],[9,11],[12],[13],[],[6,10],[6,14],[14],[9,19],[2,11],[29,12],[8,9],[20],[20],[13],[23],[23,1],[23,6],[24,29],[23,12],[11,4],[7],[0,10],[31,7],[7,23]];
		return mutations[seedId-1];
	},
	
	//Garden functions
	minigame:function(){ return Game.Objects['Farm'].minigame; },
	isActive:function(){ return this.minigame() !== undefined; },
	templace:function(){
		return 1
	},
	getSoilRotationCombo:function(){
		//return array with
		//	0 : current combo label
		//	1 : most young soil
		//	2 : most mature soil
		//	3 : next soil combo id
		switch (this.config.autoPlantRotateSoilCombo) {
			case 0:
				return ['Fertilizer/Clay',1,2,1];
			case 1:
				return ['Fertilizer/WoodChips',1,4,0];
			default:
				return ['Fertilizer/Clay Def',1,2,1];
		}
	},
	setNextCombo:function(){
		this.config.autoPlantRotateSoilCombo=this.getSoilRotationCombo()[3]
	},
	setCorrectSoil:function(){
		var M = this.minigame();
		if(!M.freeze){
			var young = 0;
			var matur = 0;
			for (let x=0; x<6; x++) {
				for (let y=0; y<6; y++) {
					if(!this.tileIsEmpty(x, y)){
						let tile = this.getTile(x, y);
						let stage = this.getPlantStage(tile);
						if(stage=='young'){
							young++;
						}else{
							matur++;
						}
					}
				}
			}
			
			var soilCombo = this.getSoilRotationCombo();
			var targetSoil = young>matur?soilCombo[1]:soilCombo[2];
			
			if( M.soil!=targetSoil && M.parent.amount>=M.soilsById[targetSoil].req && M.nextSoil<Date.now() ){
				M.nextSoil=Date.now()+(Game.Has('Turbo-charged soil')?1:(1000*60*10));
				M.toCompute=true;
				M.soil=targetSoil;
				M.computeStepT();
				for (var i in M.soils){var it=M.soils[i];if (it.id==M.soil){l('gardenSoil-'+it.id).classList.add('on');}else{l('gardenSoil-'+it.id).classList.remove('on');}}
			}
		}
	},
	CpSMult:function(){
		var res = 1
		for (let key in Game.buffs) {
			if (typeof Game.buffs[key].multCpS != 'undefined') {
				res *= Game.buffs[key].multCpS;
			}
		}
		return res;
	},
	secondsBeforeNextTick:function(){ return (this.minigame().nextStep-Date.now()) / 1000; },
	selectedSeed:function(){ return this.minigame().seedSelected; },
	selectSeed:function(seedId){ this.minigame().seedSelected = seedId; },
	clonePlot:function(){
		let plot = this.clone(this.minigame().plot);
		for (let x=0; x<6; x++) {
		  for (let y=0; y<6; y++) {
			let [seedId, age] = plot[x][y];
			let plant = this.getPlant(seedId);
			if (plant != undefined && !plant.plantable) {
			  plot[x][y] = [0, 0];
			}
		  }
		}
		return plot;
	},
	getPlant:function(id){ return this.minigame().plantsById[id - 1]; },
	getTile:function(x, y){
		let tile = this.minigame().getTile(x, y);
		return { seedId: tile[0], age: tile[1] };
	},
	getPlantStage:function(tile){
		let plant = this.getPlant(tile.seedId);
		if (tile.age < plant.mature) {
		  return 'young';
		} else {
		  if ((tile.age + Math.ceil(plant.ageTick + plant.ageTickR)) < 100) {
			return 'mature';
		  } else {
			return 'dying';
		  }
		}
	},
	tileIsEmpty:function(x, y){ return this.getTile(x, y).seedId == 0; },
	plantSeed:function(seedId, x, y){
		let plant = this.getPlant(seedId + 1);
		if (plant.plantable) {
		  this.minigame().useTool(seedId, x, y);
		}
	},
	forEachTile:function(callback){
		for (let x=0; x<6; x++) {
		  for (let y=0; y<6; y++) {
			if (this.minigame().isTileUnlocked(x, y)) {
			  callback(x, y);
			}
		  }
		}
	},
	harvest:function(x, y){ this.minigame().harvest(x, y, 1); },
	fillGardenWithSelectedSeed:function(){
		if (this.selectedSeed() > -1) {
		  this.forEachTile((x, y) => {
			if (this.tileIsEmpty(x, y)) {
			  this.plantSeed(this.selectedSeed(), x, y);
			}
		  });
		}
	},
	handleYoung:function(plant, x, y){
		if (plant.weed && this.config.autoHarvestWeeds) {
			this.harvest(x, y);
			return
		}
		if(this.config.savedPlot.length>0){
			let [seedId, age] = this.config.savedPlot[y][x];
			seedId--;
			if ( this.config.autoHarvestCleanGarden && ((plant.unlocked && seedId == -1) || (seedId > -1 && seedId != plant.id)) ) {
				this.harvest(x, y);
			}
		}
	},
	handleMature:function(plant, x, y){
		if (!plant.unlocked && this.config.autoHarvestNewSeeds) {
		  this.harvest(x, y);
		} else if (this.isCpsBonus(plant) && this.config.autoHarvestCheckCpSMult && this.CpSMult() >= this.config.autoHarvestMiniCpSMult.value) {
		  this.harvest(x, y);
		}else if(this.config.autoHarvestMatured){
		  this.harvest(x, y);
		}
	},
	handleDying:function(plant, x, y){
		if(!this.isExplodable(plant)){
			if (this.isCpsBonus(plant) && this.config.autoHarvestCheckCpSMultDying && this.CpSMult() >= this.config.autoHarvestMiniCpSMultDying.value) {
			this.harvest(x, y);
			} else if (this.config.autoHarvestDying && this.secondsBeforeNextTick() <= this.config.autoHarvestDyingSeconds) {
			this.harvest(x, y);
			}
		}
	},
	isExplodable:function(plant){
		//These plants are meant to let explode, rather than harvested.
		var expl = ["crumbspore","doughshroom"];
		return expl.includes(plant.key);
	},
	isCpsBonus:function(plant){
		//These plants give bonus CpS when harvested.
		var cpsbonus = ["bakeberry","chocoroot","whiteChocoroot","queenbeet","duketater"];
		return cpsbonus.includes(plant.key);
	},
	getBuffMultCps:function(){
		var mult = 1;
		for (var b in Game.buffs){if(Game.buffs[b].hasOwnProperty('multCpS')){mult*=Game.buffs[b].multCpS;}}
		return mult;
	},
	run:function() {
		if(this.isActive()){
			//Display Seed List
			this.doc.elId('cghrSeedListDiv').textContent = '';
			this.doc.elId('cghrSeedListDiv').innerHTML = this.getSeedListDisplay();
			this.setSeedListTooltips();

			//Display Upgrades
			this.doc.elId('cghrUpgradeListDiv').textContent = '';
			this.doc.elId('cghrUpgradeListDiv').innerHTML = this.getUpgradeListDisplay();
			
			// sacrifice garden
			if(!this.oldConvert){
				this.oldConvert = this.minigame().convert;
				this.minigame().convert = () => {
				  this.config.savedPlot = [];
				  this.labelToggleState('plotIsSaved', false);
				  this.handleToggle('autoHarvest');
				  this.handleToggle('autoPlant');
				  this.save();
				  this.oldConvert();
				}
			}
			
			this.forEachTile((x, y) => {
			  if (this.config.autoHarvest && !this.tileIsEmpty(x, y)) {
				let tile = this.getTile(x, y);
				let plant = this.getPlant(tile.seedId);

				if (plant.immortal && this.config.autoHarvestAvoidImmortals) {
				  // do nothing
				} else {
				  let stage = this.getPlantStage(tile);
				  switch (stage) {
					case 'young':
					  this.handleYoung(plant, x, y);
					  break;
					case 'mature':
					  this.handleMature(plant, x, y);
					  break;
					case 'dying':
					  this.handleDying(plant, x, y);
					  break;
					default:
					  console.log(`Unexpected plant stage: ${stage}`);
				  }
				}
			  }

			  if (this.config.autoPlant &&
					(!this.config.autoPlantCheckCpSMult || this.CpSMult() <= this.config.autoPlantMaxiCpSMult.value) &&
					(!this.config.autoPlantAvoidBuffs || this.getBuffMultCps()<=1) &&
				  	this.tileIsEmpty(x, y) &&
				  	this.config.savedPlot.length > 0
				) {
				let [seedId, age] = this.config.savedPlot[y][x];
				if (seedId > 0) {
					this.plantSeed(seedId - 1, x, y);
				}
			  }
			});

			if (this.config.autoPlantRotateSoil){
				this.setCorrectSoil();
			}
			if (this.config.autoForceTicks){
				if(this.minigame().nextStep>Date.now()){
					this.minigame().nextStep=Date.now()
				}
			}
		}
	},
	//Overall functions
	capitalize:function(word){ return word.charAt(0).toUpperCase() + word.slice(1); },
	uncapitalize:function(word){ return word.charAt(0).toLowerCase() + word.slice(1); },
	clone:function(x){ return JSON.parse(JSON.stringify(x)); },
	//Mod Data functions
	defaultConfig:function(){
		var data = {
			timerInterval: 1000,
			autoHarvest: false,
			autoHarvestNewSeeds: true,
			autoHarvestMatured: false,
			autoHarvestAvoidImmortals: true,
			autoHarvestWeeds: true,
			autoHarvestCleanGarden: false,
			autoHarvestCheckCpSMult: false,
			autoHarvestMiniCpSMult: { value: 1, min: 0 },
			autoHarvestDying: true,
			autoHarvestDyingSeconds: 5,
			autoHarvestCheckCpSMultDying: false,
			autoHarvestMiniCpSMultDying: { value: 1, min: 0 },
			autoPlant: false,
			autoPlantAvoidBuffs: true,
			autoPlantRotateSoil: false,
			autoPlantRotateSoilCombo: 0,
			autoPlantCheckCpSMult: false,
			autoPlantMaxiCpSMult: { value: 0, min: 0 },
			autoForceTicks: false,
			savedPlot: [],
		}
		return data;
	},
	save:function(){ return JSON.stringify(this.config); },
	load:function(str){
		var obj = {}
		if(str){
			obj = JSON.parse(str)
		}
		
		this.config = {
		  ...this.defaultConfig(),
		  ...obj,
		};
		this.build();
	},
});

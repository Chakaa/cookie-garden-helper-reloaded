//Steam version of https://github.com/yannprada/cookie-garden-helper
Game.registerMod("cookiegardenhelperreloaded",{
	init:function(){
		this.name = 'Cookie Garden Helper - Reloaded';
		this.modid = 'cookiegardenhelperreloaded';
		this.version = '1.0';
		this.GameVersion = '2.042';
		
		
		this.config = this.defaultConfig();
		this.doc = {
			elId: document.getElementById.bind(document),
			qSel: document.querySelector.bind(document),
			qSelAll: document.querySelectorAll.bind(document),
		};
		
		if(!Game.modSaveData[this.modid]){
			this.build();
		}
		this.start();
		
		if (Game.prefs.popups) Game.Popup(this.name + ' loaded!');
		else Game.Notify(this.name + ' loaded!', '', '', 1, 1);
	},
	//Main
	start:function() {
		this.timerId = window.setInterval(
			() => this.run(),
			this.config.timerInterval
		);
	},
	stop:function() { window.clearInterval(this.timerId); },
	handleChange:function(key, value) {
		if (this.config[key].value !== undefined) {
			this.config[key].value = value;
		} else {
			this.config[key] = value;
		}
		this.save();
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
		.cookieGardenHelperReloadedPanel {
		  float: left;
		  width: 25%;
		}
		.cookieGardenHelperReloadedBigPanel {
		  float: left;
		  width: 50%;
		}
		.cookieGardenHelperReloadedSubPanel {
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
	toggleButton:function(name) {
		let btn = this.doc.qSel(`#cookieGardenHelperReloaded a.toggleBtn[name=${name}]`);
		btn.classList.toggle('off');
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
	readmeLink:function() { return 'https://github.com/yannprada/cookie-garden-helper/blob/master/README.md#how-it-works'; },
	
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
						'Only allow saved and unlocked seeds', true,
						this.config.autoHarvestCleanGarden
					  )}
					</p>
				  </div>
				  <div class="cookieGardenHelperReloadedSubPanel">
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
				</div>
				<div class="cookieGardenHelperReloadedPanel" id="manualToolsPanel">
				  <h2>Manual tools</h2>
				  <p>
					${this.button('fillGardenWithSelectedSeed', 'Plant selected seed',
					'Plant the selected seed on all empty tiles')}
				  </p>
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
	
	//Garden functions
	minigame:function(){ return Game.Objects['Farm'].minigame; },
	isActive:function(){ return this.minigame() !== undefined; },
	templace:function(){
		return 1
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
	selectedSeed:function(seedId){ this.minigame().seedSelected = seedId; },
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
	harvest:function(x, y){ this.minigame.harvest(x, y); },
	fillGardenWithSelectedSeed:function(seedId, x, y){
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
		} else if (this.config.autoHarvestCheckCpSMult && this.CpSMult() >= this.config.autoHarvestMiniCpSMult.value) {
		  this.harvest(x, y);
		}
	},
	handleDying:function(plant, x, y){
		if (this.config.autoHarvestCheckCpSMultDying && this.CpSMult() >= this.config.autoHarvestMiniCpSMultDying.value) {
		  this.harvest(x, y);
		} else if (this.config.autoHarvestDying && this.secondsBeforeNextTick <= this.config.autoHarvestDyingSeconds) {
		  this.harvest(x, y);
		}
	},
	run:function() {
		if(this.isActive()){
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
				  (!this.config.autoPlantCheckCpSMult ||
				  this.CpSMult() <= this.config.autoPlantMaxiCpSMult.value) &&
				  this.tileIsEmpty(x, y) &&
				  this.config.savedPlot.length > 0
				) {
				let [seedId, age] = this.config.savedPlot[y][x];
				if (seedId > 0) {
					this.plantSeed(seedId - 1, x, y);
				}
			  }
			});
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
			autoPlantCheckCpSMult: false,
			autoPlantMaxiCpSMult: { value: 0, min: 0 },
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
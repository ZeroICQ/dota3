"use strict"
console.log('engine loaded');

var Engine = function (){
	
    this.turn = function(fromX, fromY, toX, toY){
        gameLevel.swapElements(fromX, fromY, toX, toY);
        playingField = gameLevel.getMap();
		if (!this.canAnnihilate()){
			gameLevel.swapElements(fromX, fromY, toX, toY);
			playingField = gameLevel.getMap();
			return false;
		}
        return this.annihilate();
    }

	function annihilateAll(){
		while (true){
			if (!(this.annihilate())){return;}
		}
	}

	this.getPlayingField = function(){
		return playingField;
	}
	
	this.getScore = function(){
		return score;
	}

	this.annihilate = function(){
		let beg;
		let ans = [];
		for (let i = 0; i < playingField.length; i++){
			beg = 0;
			for (let j = 0; j < playingField[0].length; j++){
				if ((playingField[i][j] !== playingField[i][beg]) || (j === playingField[0].length - 1)){
					if (playingField[i][j] === playingField[i][beg]){j++;}
					if (j - beg > 2){
						for (let h = beg; h < j; h++){
							ans.push([i, h, playingField[i][h]]);
						}
					}
					beg = j;
				}
			}
		}
		for (let i = 0; i < playingField[0].length; i++){
			beg = 0;
			for (let j = 0; j < playingField.length; j++){
				if ((playingField[j][i] !== playingField[beg][i]) || (j === playingField.length - 1) || (playingField[j][i] === -1)){
					if (playingField[j][i] === playingField[beg][i]){j++;}
					if (j - beg > 2){
						for (let h = beg; h < j; h++){
							ans.push([h, i, playingField[h][i]]);
						}
					}
					beg = j;
				}
			}
		}
		for (let i = 0; i < ans.length; i++){
			playingField[ans[i][0]][ans[i][1]] = -1;
		}
		if (ans.length > 0){
			updateScore(ans);
			updateCollectedGems(ans);
			dropGems(ans);
			doGen();
			return ans;
		}
		else{
			return false;
		}
	}
	
	function updateScore(arr){
		if (gameStatus === 0){return;}
		for (let i = 0; i < arr.length; i++){
			score += Math.floor(5 * (1 + Math.floor((arr[i][2] / gems.length) + 1) / 10));
		}
	}

	this.canAnnihilate = function(){
		let beg;
		for (let i = 0; i < playingField.length; i++){
			beg = 0;
			for (let j = 0; j < playingField[0].length; j++){
				if ((playingField[i][j] !== playingField[i][beg]) || (j === playingField[0].length - 1)){
					if (playingField[i][j] === playingField[i][beg]){j++;}
					if (j - beg > 2){
						return true;
					}
					else{
						beg = j;
					}
				}
			}
		}
		for (let i = 0; i < playingField[0].length; i++){
			beg = 0;
			for (let j = 0; j < playingField.length; j++){
				if ((playingField[j][i] !== playingField[beg][i]) || (j === playingField.length - 1)){
					if (playingField[j][i] === playingField[beg][i]){j++;}
					if (j - beg > 2){
						return true;
					}
					else{
						beg = j;
					}
				}
			}
		}
		return false;
	}

	function dropGems(line){
		let buff;
		for (let i = 0; i < line.length; i++){
			let h = line[i][0];
			let k = line[i][1];
			while ((h > 0) && (playingField[h - 1][k] !== -1)){
				buff = playingField[h - 1][k];
				playingField[h - 1][k] = playingField[h][k];
				playingField[h][k] = buff;
				h--;
			}
		}
	}

	function doGen(){		
		gameLevel.replaceWithGenerated(-1);
        playingField = gameLevel.getMap();
	}
	
	function replaceUpgradedGem(gem){
		for (let i = 0; i < playingField.length; i++){
			for (let j = 0; j < playingField[0].length; j++){
				if (playingField[i][j] === gem){
					playingField[i][j] += gems.length;
				}
			}
		}
	}
	
	function updateCollectedGems(arr){
		if (gameStatus === 0){return;}
		for (let i = 0; i < arr.length; i++){
			gemsCount[arr[i][2] % gems.length]++;
		}
		upgradeGems();
	}
	
	function upgradeGems(){
		for (let i = 0; i < gemsCount.length; i++){
			if ((gemsCount[i] >= gemsTasks[i]) && (Math.floor(gems[i] / gems.length) < 4)){
				replaceUpgradedGem(gems[i]);
				gems[i] += gems.length;
				gemsCount[i] = 0;
			}
		}
	}
	
	this.getGemsStatus = function(){
		let ans = [];
		for (let i = 0; i < gems.length; i++){
			let buff = gemsTasks[i] - gemsCount[i];
			if ((buff < 0) || Math.floor(gems[i] / gems.length) === 4){
				buff = "max"
			}
			ans.push([gems[i], buff]);
		}
		return ans;
	}
	
	this.getTimeTask = function(){
		return timeTask;
	}
	
	this.getScoreTask = function(){
		return scoreTask;
	}
	
	this.levelPassed = function(){
		if (score >= scoreTask){
			return true;	
		}
		else{
			return false;
		}
	}
	
	this.getLevelNumber = function(){
		return levelNumber;
	}
	
	this.generateLevel = function(){
		levelNumber++;
		gameStatus = 0;
		score = 0;
		gems = [0, 1, 2, 3, 4];
		gemsCount = [0, 0, 0, 0, 0]; 
		gameLevel = new GameLevel(gems, 8, 8, levelNumber);
		gameLevel.generateLevel();
		playingField = gameLevel.getMap();
		gemsTasks = gameLevel.getUpgradeConditions();
		timeTask = gameLevel.getPassTime();
		scoreTask = gameLevel.getPassScore();
		annihilateAll.apply(this);
		gameStatus = 1;
	}
	
	var levelNumber = 0;
	var gameStatus;
	var score;
	var gems;
	var gemsCount; 
	var gameLevel;
	var playingField;
	var gemsTasks;
	var timeTask;
	var scoreTask;
	this.generateLevel();
}

var engine = new Engine();
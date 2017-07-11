"use strict"
console.log('engine loaded');

var Engine = function (){
	
	this.turn = function(fromX, fromY, toX, toY){
		myGen.swapElements(fromX, fromY, toX, toY);
		playingField = myGen.getLevel();
		return this.anigilate();
	}

	function check(){
		while (true){
			if (!(this.anigilate())){return;}
		}
	}

	this.getPlayingField = function(){
		return playingField;
	}
	
	this.getScore = function(){
		return score;
	}

	this.anigilate = function(){
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
			updateColletedGems(ans);
			gemFall(ans);
			doGen();
			return ans;
		}
		else{
			return false;
		}
	}
	
	function updateScore(arr){
		for (let i = 0; i < arr.length; i++){
			score += 30 * Math.floor(arr[i][2] / gems.length);
		}
	}

	this.canAnigilate = function(){
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

	function gemFall(line){
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
		let myChanger = new levelChanger(playingField, gems);
		myChanger.replaceWithGenerated(-1);
		playingField = myChanger.getLevel();
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
	
	function updateColletedGems(arr){
		for (let i = 0; i < arr.length; i++){
			gemsCount[arr[i][2]]++;
		}
		upgradeGems();
	}
	
	function upgradeGems(){
		for (let i = 0; i < gemsCount.length; i++){
			if ((gemsCount[i] > 15) && (Math.floor(gems[i] / gems.length) < 1)){
				replaceUpgradedGem(gems[i]);
				gems[i] += gems.length;
				gemsCount[i] = 0;
			}
		}
	}
	
	this.getGemsStatus = function(){
		let ans = [];
		for (let i = 0; i < gems.length; i++){
			ans.push([gems[i], gemsCount[i]]);
		}
		return ans;
	}
	
	var gameStatus = 0;
	var score = 0;
	var gems = [0, 1, 2, 3, 4];
	var gemsCount = [0, 0, 0, 0, 0]; 
	var myGen = new levelGenerator(gems, 8, 8);
	myGen.generateLevel();
	var playingField = myGen.getLevel();
	//var playingField = [[1,2,4,4,4,3], [4,0,3,4,1,2],[4,0,0,4,1,2],[0,2,2,3,0,0],[3,3,2,0,3,0],[4,4,3,4,1,4]];
	check.apply(this);
}

var engine = new Engine();
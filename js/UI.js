"use strict"
$(document).ready(function() {
    console.log('UI loaded')

    const GAME_GRID_WIDTH = 8;
    const GAME_GRID_HEIGHT = 8;
    const CELL_SIZE = 100;

    var Game = function () { 
        //create game grid
        this.gameGrid = $('#game-grid');
        var level = GetPlayingField();

        for (let i = 0; i < GAME_GRID_HEIGHT; ++i) {
            for (let j = 0; j < GAME_GRID_WIDTH; ++j) {
                var id = i + '-' + j;
                this.gameGrid.append('<div id="' + id +'" class="game-cell"><img src="img/diamond-' + level[i][j] + '.png"></div>');

                $('#' + id).click({game: this}, function() {
                    game.userClick($(this));
                });
            }
        }
    };

    Game.prototype.userClick = function(cell){
        cell.addClass('selected-cell');
        var selectedCells = this.gameGrid.children(".selected-cell");
        if (selectedCells.length === 2) {
            this.swapCells(selectedCells.eq(0), selectedCells.eq(1));
            this.gameGrid.children().removeClass('selected-cell');
        }
    };

    Game.prototype.swapCells = function(cell1, cell2) {
        var id1 = cell1.attr('id').split('-');
        var id2 = cell2.attr('id').split('-');


        var cell1Img = cell1.find('img');
        var cell2Img = cell2.find('img');
        
        var cell1ImgPath = cell1Img.attr('src');
        var cell2ImgPath = cell2Img.attr('src');

        cell1Img.animate({
            'top': CELL_SIZE * (id2[0]-id1[0]) + 'px',
            'left': CELL_SIZE * (id2[1]-id1[1]) + 'px'},
            400, function() {
                cell1Img.css({'top': 0, 'left': 0});
                cell1Img.attr('src', cell2ImgPath);
        });

        cell2Img.animate({
            'top': CELL_SIZE * (id1[0]-id2[0]) + 'px',
            'left': CELL_SIZE * (id1[1]-id2[1]) + 'px'},
            400, function() {
                cell2Img.css({'top': 0, 'left': 0});
                cell2Img.attr('src', cell1ImgPath);
        });
    };

    var game = new Game();
});
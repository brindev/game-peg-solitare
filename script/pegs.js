/* pegs js v2.0 */

var firstPegClick = false;
var selectedId;
var targetId;
var middlePegId;
var completedMove = false;
var moves = 0;


$(document).ready(function() {


	function dragHandler(event, ui) {
		cclick($(this).parent().attr('id'));
	}

	$('.peg').draggable({
		start: dragHandler,
		revert : function() {
			return true;
		}
	});	
	
	$('.pegs_board li').droppable({
		drop : function (event, ui) {
			if (cclick($(this).attr('id')) && validateMove()) {
				$(this).html(ui.draggable);
				$(ui.draggable).css({position:"absolute", top:"0px", left:"0px"});
				$(this).toggleClass('o x');
				$(ui.draggable).draggable({start: dragHandler, revert: true});
			}	
		}
	});

	function cclick(id) {
		if (!firstPegClick) {
			firstPegClick = true;
			selectedId = parseInt(id);
			return false;
		}
		else {
			targetId = parseInt(id);
			return true;
		}
	}

	function validateMove() {
		
		var selectedClass = $('#' + selectedId).hasClass('x') ? true : false;
		var targetClass = $('#' + targetId).hasClass('o') ? true : false;
		firstPegClick = false;
		
		if (selectedClass === true && targetClass === true) {
		
			var diff = selectedId - targetId;
			
			switch (diff) {
				case 2:
					// horizontal move left
					var middlePegValue = $('#' + (selectedId - 1)).hasClass('o') ? true : false;
					if (middlePegValue !== true) { 
						processMove('-', 1); 
					}
					else { 
						sendMessage('Invalid move', false);
						completedMove = false;
						return false;						
					}
					break;
				case -2:
					// horizontal move right
					var middlePegValue = $('#' + (selectedId + 1)).hasClass('o') ? true : false;
					if (middlePegValue !== true) { 
						processMove('+', 1); 
					}
					else { 
						sendMessage('Invalid move', false);
						completedMove = false;
						return false;
					}
					break;
				case 20:
					// vertical move up
					var middlePegValue = $('#' + (selectedId - 10)).hasClass('o') ? true : false;
					if (middlePegValue !== true) { 
						processMove('-', 10); 
					}
					else { 
						sendMessage('Invalid move', false);
						completedMove = false;
						return false;
					}
					break;
				case -20:
					// vertical move down
					var middlePegValue = $('#' + (selectedId + 10)).hasClass('o') ? true : false;
					if (middlePegValue !== true) { 
						processMove('+', 10); 
					}
					else { 
						sendMessage('Invalid move', false);
						completedMove = false;
						return false;
					}
					break;
				default:
					sendMessage('Invalid move', false);
					return false;
			}
			return true;	
		} 
		else { 
			sendMessage('Invalid move', false);
			return false;
		}
	}

	function processMove(operator, direction) {
		if (operator == '-') { 
			middlePegId = selectedId - direction; 
		}
		else { 
			middlePegId = selectedId + direction; 
		}
		$('#' + middlePegId).html('').toggleClass('x o');
		$('#' + selectedId).html('').toggleClass('x o');
		completedMove = true;
		updateTries();
		checkEndOfGame();
	}

	$('.pegs_undo').click(function() {
		if (completedMove) {
			$('#'+ selectedId).html('<img class="peg" src="res/peg.png" />').toggleClass('o x');
			$('#'+ selectedId + ' > .peg').draggable({start: dragHandler, revert: true});
			$('#'+ middlePegId).html('<img class="peg" src="res/peg.png" />').toggleClass('o x');
			$('#'+ middlePegId + ' > .peg').draggable({start: dragHandler, revert: true});
			$('#'+ targetId).html('').toggleClass('x o');
			completedMove = false;
		}
	});

	function sendMessage(msg,isWin) {
		$('.pegs_message').text(msg).fadeIn(800, "linear");
		$('.pegs_message').text(msg).fadeOut(1000, "linear");
	}
	
	function checkEndOfGame() {
		if ($('.x').length === 0) {
			$('.pegs_undo').css('display','none');
			$('.pegs_help').css('display', 'none');
			$('.pegs_completion').html('<p>Congratulations!</p><p>You have mastered</p><p>Peg Solitaire!</p>').fadeIn(700, "linear");
		}
	}

	function updateTries() {
		moves++;
		$('.pegs_moves span').text(moves);
	}

	function reset() {
		moves = 0;
		completedMove = false;
		$('.pegs_moves span').html('0');
		$('.pegs_help').css('display', 'block');
		$('.pegs_board li').each(function() {
			$(this).html('<img class="peg ui-draggable" src="res/peg.png" />');
			$(this).removeClass('o');
			$(this).addClass('x');
			$('.peg').draggable({start: dragHandler, revert: true });
		});
		$('li#44').html('').toggleClass('x o');
		$('.pegs_message').css({'display':'none','color':'#F47C7C'});
		$('.pegs_undo').css('display','block');
	}

	function startReset() {
		$('.pegs_completion').css('display','none');
		$('.pegs_board').fadeOut(500, "linear");
		reset();
		$('.pegs_board').fadeIn(3000, "linear");
	}

	$('.pegs_start_over').click( function () {
		startReset();
	});
	
	$('.pegs_help').click(function() {
		if ($('.pegs_help').text() == '?') {
			$('.pegs_help').text('Close');
			$('.pegs_undo').css('display', 'none');
			$('.pegs_start_over').css('display', 'none');
		}
		else {	
			$('.pegs_help').text('?');
			$('.pegs_undo').css('display', 'block');
			$('.pegs_start_over').css('display', 'block');
		}	
		$('.pegs_help_popup').slideToggle("slow");
	});

	$('a.pegs_lnk_howtoplay').click(function() {
		$('a.pegs_lnk_history').removeClass('selected');
		$(this).addClass('selected');
		$('.pegs_help_history').fadeOut(500, "linear");
		$('.pegs_help_howtoplay').css({'position':'absolute','top':'45px','left':'0px'}).fadeIn(1000, "linear");
	});
	
	$('a.pegs_lnk_history').click(function() {
		$('a.pegs_lnk_howtoplay').removeClass('selected');
		$(this).addClass('selected');
		$('.pegs_help_howtoplay').fadeOut(500, "linear");
		$('.pegs_help_history').css({'position':'absolute','top':'45px','left':'0px'}).fadeIn(1000, "linear");
	});
});
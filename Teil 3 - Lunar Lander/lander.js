// Hallo, ich bin ein Script
(function () {

	var framecount = 0;
	var gameState = 0; 		//	0: game is running, 1: paused, 2: lost, 3: won

	var lander = new Lander();
	var gravity = 1.5;
	var safeLanding = 0.1;

	var keyboard = {
		left: false,
		up: false,
		right: false
	}

	function reset(){
		//	if paused unpause
		gameState = 0;
		lander = new Lander();
	}

	function togglePause(){
		if( gameState === 0 ){
			gameState = 1;
			$('#game-title').html("Lunar Lander ||");
		}
		else{
			gameState = 0;
			$('#game-title').html("Lunar Lander &#9654;");
		}
	}

	function lose(){
		gameState = 2;
	}

	function win(){
		gameState = 3;
	}

	function updateKeyBoard(){

		if(keyboard.left === true){
			lander.rotateLeft();
		}
		if(keyboard.right === true){
			lander.rotateRight();
		}
		if(keyboard.up === true){
			if( lander.fuel > 0 ){
				lander.accelerate();
			}
		}

	}

	function Lander(){

		this.x = 100;			//	absolute position on screen
		this.y = 100;
		this.speed = 0.0;
		this.speed_x = 0;
		this.speed_y = 0;
		this.acceleration = 0.05;
		this.turnspeed = 3;
		this.rateOfConsumption = 2;

		this.rotation = 0;
		this.fuel = 500;

		this.rotateLeft = function (){
			this.rotation -= this.turnspeed;
		};

		this.rotateRight = function (){
			this.rotation += this.turnspeed;
		};

		this.accelerate = function(){
			this.fuel -= this.rateOfConsumption;
			this.speed += this.acceleration;
		};

		this.update = function(){

			this.vec_x = Math.sin( ((2*Math.PI)/360) * this.rotation );
			this.vec_y = Math.cos( ((2*Math.PI)/360) * this.rotation )*-1;

			this.speed *= 0.8;
			this.speed_x += (this.speed * this.vec_x);
			this.speed_y += (this.speed * this.vec_y) + 0.05;

			this.x += this.speed_x;
			this.y += this.speed_y;

			//	check if ship is still on screen
			if(
				this.x >= 960 || this.x <= 0 ||
				this.y <= 0 || this.y >= 522
			 ){
				lose();
			}
				console.log(this.speed);

			//	check if winning condition is fullfilled
			if( 	this.y <= 502 && this.y >= 496 &&
				this.x <= 960 && this.x >= 760
			){
				if( this.speed <= safeLanding ){
					win();
				}
				else{
					lose();
				}
			}

			//	update position
			$('#lander').css({
				left: this.x+"px",
				top: this.y+"px",
				transform: "rotate(" + this.rotation + "deg)"
			});

		};

	}


	window.setInterval(function(){

		updateKeyBoard();

		if( gameState === 0 ){
			//	update and render the lander
			lander.update();
			//	update the hud
			$('#hud').html("fuel: " + lander.fuel);
		}

		//	manage gamestates
		if( gameState === 2 ){
			$('#game-messages').html(":( - r zum neustarten");
			$('#game-messages').css({
				display: "block"
			});
		}else if( gameState === 3 ){
			$('#game-messages').html(":) - r zum neustarten");
			$('#game-messages').css({
				display: "block"
			});
		}else{
			$('#game-messages').html("");
			$('#game-messages').css({
				display: "none"
			});
		}


	}, 16,66666666);


	//	here we translate input on keyboard to movement
	document.addEventListener('keydown', function(event) {

		//	turn left
		if(event.keyCode === 37){
			keyboard.left = true;
		}

		//	accelerate
		if(event.keyCode === 38){
			keyboard.up = true;
		}

		//	turn right
		if(event.keyCode === 39){
			keyboard.right = true;
		}

		//	reset
		if(event.keyCode === 82){
			reset();
		}

		//	pause
		if(event.keyCode === 80){
			togglePause();
		}

	});

	document.addEventListener('keyup', function(event){

		//	turn left
		if(event.keyCode === 37){
			keyboard.left = false;
		}

		//	accelerate
		if(event.keyCode === 38){
			keyboard.up = false;
		}

		//	turn right
		if(event.keyCode === 39){
			keyboard.right = false;
		}


	});


}());

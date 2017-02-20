$(document).ready(function() {
	var refereeNames = ['Totoro', 'Mickey Mouse', 'Pikachu', 'Garfield'];
	var foods = ['Duner', 'Sushi', 'Cake', 'Chinise', 'Pancake'];
	var roundInterval;

	function Referee(name){
		this.name = name;

		var $resultContainer = $('#result');

		//introduces fighters before the start of the match
		this.introduceFighters = function(hero, villain){
			$resultContainer.append('<span class="info"> Hello from the arena! My name is ' + this.name + ' and today we\'ll withess the fight between ' + hero.name + ' and ' + villain.name + '.!</span>');			
		}

		this.startFight = function(){
			$resultContainer.append('<br><span class="info"> And the fight is now starting!</span>');
			appendLineAndScroll()
		}

		//prints info about the current round
		this.summarizeRound = function(roundNumber, hero, villain, heroHit, damage) {
			if(heroHit)
				$resultContainer.append('<span class="blue-team"> That was all from round <strong>' + roundNumber + '</strong>. <i>' + hero.name + '</i> hit <i>' + villain.name +'</i> and inflicted <strong>' + damage + '</strong> damage. <i>' + hero.name + '</i> has ' + hero.healthPoints +' health points left and <i>' + villain.name + '</i> has ' + villain.healthPoints +' health points left.</span>');
			else
				$resultContainer.append('<span class="red-team"> That was all from round <strong>' + roundNumber + '</strong>. <i>' + villain.name + '</i> hit <i>' + hero.name +'</i> and inflicted <strong>' + damage + '</strong> damage. <i>' + hero.name + '</i> has ' + hero.healthPoints +' health points left and <i>' + villain.name + '</i> has ' + villain.healthPoints +' health points left.</span>');	
			
			appendLineAndScroll()
		}

		this.checkIfCharacterAte = function(character, points){
			$resultContainer.append('<span class="info">' + character.name + ' managed to eat some '+ foods[Math.floor(Math.random()*4)+1] +'. He gains ' + points + ' health points.</span>');
			appendLineAndScroll()
		}

		//checks for winner, returns true if there is a winner
		this.checkForWinner = function(hero, villain) {
			if(!hero.isAlive()){
				declareWinner(villain);
				return true;
			}
			else if(!villain.isAlive()){
				declareWinner(hero);
				return true;
			}
			else {
				return false;
			}
		}

		//private function to print the winner
		function declareWinner(character) {
			$resultContainer.append('<br><span class="info"> The fight is over! The winner is ' + character.name + ' with ' + character.healthPoints + ' health points remaining!</span>');
		}

		function appendLineAndScroll(){
			$resultContainer.append('<hr>');
			$resultContainer.scrollTop($resultContainer[0].scrollHeight);
		}
	}

	function Character(name){
		this.name = name;
		this.healthPoints = 1000;

		//character attacks, function chooses wether the character should perform special or normal attack
		this.attack = function(){
			var randomNum = Math.floor((Math.random() * 10) + 1);

			if(randomNum == 3)
				return specialAttack();
			else
				return normalAttack();
		};

		//performs a normal attack that can inflict 0-100 damage
		function normalAttack(){
			return Math.floor((Math.random() * 100) + 1);
		}

		//performs a special attack that can inflict 200-300 damage
		function specialAttack(){
			return Math.floor((Math.random() * 300) + 1);
		}

		//refils health with a random value and returns the value for console output
		this.eat = function() {
			var health = Math.floor((Math.random() * 50) + 1);
			this.healthPoints += health;

			return health;
		};

		//returns true if character is still alive
		this.isAlive = function(){
			return this.healthPoints > 0;
		}
	}

	function Hero(name){
		Character.call(this,name);
	}

	function Villain(name){
		Character.call(this,name);
	}	

	//hero and villain inherit character
	Hero.prototype = Object.create(Character.prototype);
	Hero.prototype.constructor = Hero;

	Villain.prototype = Object.create(Character.prototype);
	Villain.prototype.constructor = Villain;

	function fight(hero, villain){
		var hasWinner = false;
		var referee = new Referee(refereeNames[Math.floor((Math.random() * 3) + 1)]); //creates a referee with a random name
		var roundNumber = 1;
		var inflictedDamage = 0;

		referee.introduceFighters(hero, villain);
		referee.startFight();

			roundInterval = setInterval(function(){
				var whoShouldHit = Math.floor((Math.random() * 40) + 1); 
				
				if(whoShouldHit > 20){
					inflictedDamage = hero.attack();
					villain.healthPoints -= inflictedDamage;//hero hits villain
					referee.summarizeRound(roundNumber, hero, villain, true, inflictedDamage);				
				}
				else{
					inflictedDamage = villain.attack();				
					hero.healthPoints -= inflictedDamage; //villain hits hero
					referee.summarizeRound(roundNumber, hero, villain, false, inflictedDamage);
				}

				var canEat = Math.floor((Math.random() * 30) + 1); //generates a random num 0-30
				if(canEat == 17){
					var health = hero.eat();
					referee.checkIfCharacterAte(hero, health);
				}
				else if(canEat == 23) {
					var health = villain.eat();
					referee.checkIfCharacterAte(villain, health);
				}
				
				hasWinner = referee.checkForWinner(hero, villain);
				
				if(hasWinner){
					clearInterval(roundInterval);
				}
				
				roundNumber++;
			},1000);
	}

	function createFighters() {
		$("#result").empty();

		var heroName = $('#hero-name').val();
		var villainName = $('#villain-name').val();

		if(heroName.trim() == "") {
			$("#result").append("Place a name for the hero!");
		}
		else if(villainName.trim() == ""){
			$("#result").append("Place a name for the villain!");
		}
		else {
			var hero = new Hero(heroName);
			var villain = new Villain(villainName);

			fight(hero, villain);
		}
		
	};

	$('#startButton').on('click', function(){
		createFighters();
	});

	$("#resetButton").on('click', function(){
		$("#result").empty();
		$("#result").append('<p>In order to start the game, write the names of the Hero and the Villain and press start. You\'ll see the game log on your screen.</p>')
		clearInterval(roundInterval);
	})

});
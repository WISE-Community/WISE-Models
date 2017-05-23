// Global variables

// the SVG.js draw object
var draw = null;

//answers - true: correct, false: incorrect
var correct1 = false;
var correct2 = false;
var correct3 = false;

//boxes
var box1;
var box2;
var box3;

//elements currently in the boxes, respectively
var element1;
var element2;
var element3;

//elements
var lightEnergy;
var carbonDioxide;
var water;
var sugar;
var oxygen;
var soil;
var heatEnergy;

//number of tries
var tries = 0;

//create Element class
class Element {
	constructor(x, y, image, text, textY) {
		//original position
		this.origX = x;
		this.origY = y;

		//current position
		this.x = x;
		this.y = y;

		//draw element
		this.image = draw.image(image, 140, 140);
		this.text = draw.text(text).x(70).y(textY).font({size: 24, family: 'Roboto', anchor: 'middle', weight: 'bold'});
		this.red = draw.image('./red.svg', 140, 140);
		this.red.front().hide();

		//create group
		this.group = draw.group();
		this.group.add(this.image);
		this.group.add(this.text);
		this.group.add(this.red);
		this.group.x(x);
		this.group.y(y);

		//drag n drop functionality
		var self = this;
		self.group.draggable(function(x, y) {
			this.front();
			return { x: x < 1060 && x > 0, y: y < 760 && y > 0}
		}).on("dragend", function() {

			//source -> target swapping and snapping
			if (this.x() > (box1.x - 70)  && this.x() < (box1.x + 70)  && this.y() > (box1.y - 70) && this.y() < (box1.y + 70)) {
				this.move(box1.x, box1.y);
				if (element1 && element1 != self) {
					element1.group.front().animate(100, '-', 0).move(element1.origX, element1.origY);
				}
				element1 = self;
			} else if (this.x() > (box2.x - 70)  && this.x() < (box2.x + 70)  && this.y() > (box2.y - 70) && this.y() < (box2.y + 70)) {
				this.move(box2.x, box2.y);
				if (element2 && element2 != self) {
					element2.group.front().animate(120, '-', 0).move(element2.origX, element2.origY);
				}
				element2 = self;
			} else if (this.x() > (box3.x - 70)  && this.x() < (box3.x + 70)  && this.y() > (box3.y - 70) && this.y() < (box3.y + 70)) {
				this.move(box3.x, box3.y);
				if (element3 && element3 != self) {
					element3.group.front().animate(140, '-', 0).move(element3.origX, element3.origY);
				}
				element3 = self;
			} else {
				this.move(self.origX, self.origY);
			}
			//update current x and y position
			self.x = this.x();
			self.y = this.y();

		}).on("dragstart", function() {
			//set boxes to null if an element is removed
			if (self == element1) {
				element1 = null;
			} else if (self == element2) {
				element2 = null;
			} else if (self == element3) {
				element3 = null;
			}
		});
	}
}

//create Box class
class Box {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.image = draw.image('./box.svg', 140, 140).attr({
				'x': x,
				'y': y,
		});
	}
}

//makes red outline appear when cursor is over element
function red(element) {
	element.group.mouseover(function() {
		element.red.show();
	});
	element.group.mouseout(function() {
		element.red.hide();
	});
}

//create the background
function createBackground() {
	background = draw.image('./bg.svg', 1200, 900);
}

//create the tree
function createTree() {
	tree = draw.image('./tree.svg', 530, 470).attr({
		'x': 450,
		'y': 295,
	});
}

//create the dinosaur
function createDino() {
	dino = draw.image('./dino.svg', 375, 375).attr({
		'x': 820,
		'y': 450,
	});
}

//create the roots
function createRoots() {
	roots = draw.image('./roots.svg', 460, 520).attr({
		'x': 385,
		'y': 370,
	});
}

//create the instructions text
function createInstructions() {
	instructions = draw.text('Click and drag the 3 necessary ingredients into the gray boxes below \n When you are ready to see if your answer is right, click the \"check\" button.').x(20).y(20).font({size: 28, family: 'Chewy'});
}

//create the check button and its functionality
function createCheck() {
	//draw check button
	checkGroup = draw.nested();
	shadow = checkGroup.image('./shadow.svg', 270, 120).attr({
		'x': 888,
		'y': 8,
	});
	check = checkGroup.image('./check.svg', 230, 80).attr({
		'x': 900,
		'y': 15,
	});
	check2 = checkGroup.image('./check2.svg', 230, 80).attr({
		'x': 900,
		'y': 15,
	});
	check2.hide();
	checkText = checkGroup.text('Check!').x(935).y(15).font({size: 48, family: 'Raleway', fill: '#FF9900'});
	checkGroup.addClass('pointer');

	//hover effect for check button
	checkGroup.mouseover(function() {
		check2.show();
		checkText.font({fill: '#009999'});
	})

	//when check button is clicked
	checkGroup.click(function() {
		tries++;
		checkCorrect();

		//successful attempt
		if (correct1 && correct2 && correct3) {
			instructions.clear();
			instructions.text = draw.text(function(add) {
				add.tspan('Great job! Plants need ')
				add.tspan('light energy').fill('#ffb23f')
				add.tspan(', ')
				add.tspan('carbon dioxide').fill('#f06')
				add.tspan(' and ')
				add.tspan('water').fill('#4fd0ff')
				add.tspan(' to make their own food (a type of ')
				add.tspan('sugar)')
				add.tspan('.')
				add.tspan('Let\'s go to the next step and explore how plants get these elements!').newLine()
			}).x(20).y(20).font({size: 28, family: 'Chewy'});
			createFullTree();

			//sound effect
			var audio = new Audio('./kid.mp3');
			audio.play();

			//animate dinosaur
			dino.animate(500, '<', 10).move(810, 415);
			dino.animate(400, '-', 0).move(750, 420);
			dino.animate(200, '-', 10).move(750, 430);
			dino.animate(600, '<', 0).move(710, 450);

			//hide all other images
			background.hide();
			shadow.hide();
			check.hide();
			check2.hide();
			checkText.hide();
			oxygen.group.hide();
			sugar.group.hide();
			soil.group.hide();
			heatEnergy.group.hide();

			//make correct answers undraggable
			carbonDioxide.group.draggable(false);
			lightEnergy.group.draggable(false);
			water.group.draggable(false);

		//unsuccessful attempt
		} else if (tries < 3){
			reset();
			if (tries == 1) {
				instructions.text('Try again. You have 2 more chances.');
			}
			if (tries == 2) {
				instructions.text('Try again. You have 1 more chance.');
			}

		//unsuccessful attempts and out of tries
		} else {
			instructions.text('Nice try, but that is not correct. This was your last chance. \n Click the \"Try Again\" button to restart the quiz!');
			shadow.hide();
			check.hide();
			check2.hide();
			checkText.hide();
			createTryButton();
		}
	})

	//hover effect for check button
	checkGroup.mouseout(function() {
		check2.hide();
		checkText.font({fill: '#FF9900'})
	})
}

//create the try again button and its functionality
function createTryButton() {
	tryGroup = draw.nested();
	tryButton = tryGroup.image('./try.svg', 160, 70).attr({
		'x': 1020,
		'y': 20,
	});
	tryText = tryGroup.text('Try Again').x(1037).y(33).font({size: 30, family: 'Raleway'});
	tryGroup.click(function() {
		location.reload();
	})
	tryGroup.addClass('pointer');
}

//create the tree that appears when the student is successful
function createFullTree() {
	fullTree = draw.image('./fulltree.svg', 1200, 900).back();
}

//reset incorrect ones
function reset() {
	if (!correct1) {
		element1.group.move(element1.origX, element1.origY);
	}
	if (!correct2) {
		element2.group.move(element2.origX, element2.origY);
	}
	if (!correct3) {
		element3.group.move(element3.origX, element3.origY);
	}
}

//checks if the answers are correct
function checkCorrect() {
	if (element1 == lightEnergy || element1 == carbonDioxide) {
		correct1 = true;
	}
	if (element2 == lightEnergy || element2 == carbonDioxide) {
		correct2 = true;
	}
	if (element3 == water) {
		correct3 = true;
	}
}

function init() {
	// create the SVG.js draw object
	draw = SVG('model');

	//draw images
	createBackground();
	createRoots();
	createTree();
	createDino();

	//create grey boxes
	box1 = new Box(270, 350);
	box2 = new Box(270, 515);
	box3 = new Box(345, 750);

	//instructions text
	createInstructions();

	//create Check button
	createCheck();

	//create elements
	lightEnergy = new Element(20, 135, './lightenergy.svg', 'Light \n Energy', 70);
	carbonDioxide = new Element(165, 135, './carbonDioxide.svg', 'Carbon \n Dioxide', 70);
 	water = new Element(310, 135, './water.svg', 'Water', 90);
	sugar = new Element(455, 135, './sugar.svg', 'Sugar', 100);
	oxygen = new Element(600, 135, './oxygen.svg', 'Oxygen', 90);
	soil = new Element(745, 135, './soil.svg', 'Soil', 90);
	heatEnergy = new Element(890, 135, './heatenergy.svg', 'Heat \n Energy', 70);

	var elements = [lightEnergy, carbonDioxide, water, sugar, oxygen, soil, heatEnergy];

	//apply red function to all elements -- see above
	for (var i = 0; i < 8; i++) {
    	red(elements[i]);
	}
}

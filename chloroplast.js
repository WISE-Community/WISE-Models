// Global variables

// the SVG.js draw object
var draw = null;

//answers - true: correct, false: incorrect
var correct1 = false;
var correct2 = false;
var correct3 = false;
var correct4 = false;
var correct5 = false;
var correct6 = false;

//gray box
var box1;
var box2;
var box3;
var box4;
var box5;
var box6;

//element currently in the boxes, respectively
var element1;
var element2;
var element3;
var element4;
var element5;
var element6;

//elements
var lightEnergy;
var carbonDioxide;
var oxygen;
var glucose;
var water;
var soil;
var chemicalEnergy;

//number of tries
var tries = 0;

class Element {
    constructor(x, y, image, text, textY) {
        //original position
        this.origX = x;
        this.origY = y;

        //current position
        this.x = x;
        this.y = y;

        //draw element
        this.image = draw.image(image, 120, 120);
        this.text = draw.text(text).x(60).y(textY).font({size: 22, family: 'Roboto', anchor: 'middle', weight: 'bold'});
        this.red = draw.image('./red.svg', 120, 120);
        this.red.front().hide();

        //create group
        this.group = draw.group();
        this.group.add(this.image);
        this.group.add(this.text);
        this.group.add(this.red);
        this.group.x(x);
        this.group.y(y);
        this.group.addClass('pointer');

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
            } else if (this.x() > (box4.x - 70)  && this.x() < (box4.x + 70)  && this.y() > (box4.y - 70) && this.y() < (box4.y + 70)) {
                this.move(box4.x, box4.y);
                if (element4 && element4 != self) {
                    element4.group.front().animate(100, '-', 0).move(element4.origX, element4.origY);
                }
                element4 = self;
            } else if (this.x() > (box5.x - 70)  && this.x() < (box5.x + 70)  && this.y() > (box5.y - 70) && this.y() < (box5.y + 70)) {
                this.move(box5.x, box5.y);
                if (element5 && element5 != self) {
                    element5.group.front().animate(120, '-', 0).move(element5.origX, element5.origY);
                }
                element5 = self;
            } else if (this.x() > (box6.x - 70)  && this.x() < (box6.x + 70)  && this.y() > (box6.y - 70) && this.y() < (box6.y + 70)) {
                this.move(box6.x, box6.y);
                if (element6 && element6 != self) {
                    element6.group.front().animate(140, '-', 0).move(element6.origX, element6.origY);
                }
                element6 = self;
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
        this.image = draw.image('./box.svg', 120, 120).attr({
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

function createInstructions() {
    instructions = draw.text(function(add) {
        add.tspan('Click and drag boxes into the gray boxes below to complete ')
        add.tspan('a cycle of photosynthesis ').font({weight: 'bold'})
        add.tspan('and cellular respiration.').font({weight: 'bold'}).newLine();
        add.tspan('When you are ready to see if your answer is right, ')
        add.tspan('click the \"check\" button.').newLine();
    }).x(20).y(20).font({size: 21});
}

function createMitochondria() {
    mitochondria = draw.image('./mitochondria.svg', 450, 350).attr({
        'x': 550,
        'y': 370,
    });
}

function createChloroplast() {
    chloroplast = draw.image('./chloroplast.svg', 380, 380).attr({
        'x': 80,
        'y': 340,
    });
}

function createArrows() {
    arrows = draw.image('./arrows.svg', 850, 300).attr({
        'x': 160,
        'y': 390,
    });
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
		if (correct1 && correct2 && correct3 && correct4 && correct5 && correct6) {
			instructions.clear();
			instructions.text = draw.text(function(add) {
				add.tspan('Good job! ')
				add.tspan('Photosynthesis ').font({weight: 'bold'})
				add.tspan('stores chemical energy ').fill('#0ace00').font({weight: 'bold'})
				add.tspan('in glucose. ')
				add.tspan('Cellular respiration ').font({weight: 'bold'})
				add.tspan('releases the stored chemical ').fill('#0000FF').font({weight: 'bold'})
				add.tspan('energy from glucose. ').fill('#0000FF').font({weight: 'bold'}).newLine();
				add.tspan('Notice that one chemical reaction creates the materials needed for the other.')
				add.tspan('It\'s like a cycle!').newLine();
			}).x(20).y(20).font({size: 21});

			//sound effect
			var audio = new Audio('./kid.mp3');
			audio.play();

			//hide all other images
			shadow.hide();
			check.hide();
			check2.hide();
			checkText.hide();
			soil.group.hide();

			//make correct answers undraggable
			carbonDioxide.group.draggable(false);
			water.group.draggable(false);
            oxygen.group.draggable(false);
            water.group.draggable(false);
            glucose.group.draggable(false);
            chemicalEnergy.group.draggable(false);

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

//checks if the answers are correct
function checkCorrect() {
	if (element1 == lightEnergy) {
		correct1 = true;
	}
    if (element2 == glucose || element2 == oxygen) {
		correct2 = true;
	}
	if (element3 == glucose || element3 == oxygen) {
		correct3 = true;
	}
    if (element4 == water || element4 == carbonDioxide) {
        correct4 = true;
    }
    if (element5 == water || element5 == carbonDioxide) {
        correct5 = true;
    }
    if (element6 == chemicalEnergy) {
        correct6 = true;
    }
}
//reset incorrect ones
function reset() {
	if (!correct1 && element1 != null) {
		element1.group.move(element1.origX, element1.origY);
	}
	if (!correct2 && element2 != null) {
		element2.group.move(element2.origX, element2.origY);
	}
	if (!correct3 && element3 != null) {
		element3.group.move(element3.origX, element3.origY);
	}
    if (!correct4 && element4 != null) {
		element4.group.move(element4.origX, element4.origY);
	}
    if (!correct5 && element5 != null) {
		element5.group.move(element5.origX, element5.origY);
	}
    if (!correct6 && element6 != null) {
		element6.group.move(element6.origX, element6.origY);
	}
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

function init() {
    // create the SVG.js draw object
    draw = SVG('model');

    //draw images
    createMitochondria();
    createChloroplast();
    createArrows();

    //create grey boxes
    box1 = new Box(30, 320);
    box2 = new Box(420, 320);
    box3 = new Box(595, 320);
    box4 = new Box(420, 640);
    box5 = new Box(600, 640);
    box6 = new Box(960, 660);

    // //instructions text
    createInstructions();

    //create Check button
    createCheck();

    //create elements
    lightEnergy = new Element(20, 135, './lightenergy.svg', 'Light \n Energy', 60);
    carbonDioxide = new Element(165, 135, './carbonDioxide.svg', 'Carbon \n Dioxide', 60);
    oxygen = new Element(310, 135, './oxygen.svg', 'Oxygen', 80);
    glucose = new Element(455, 135, './glucose.svg', 'Glucose', 85);
    water = new Element(600, 135, './water.svg', 'Water', 80);
    soil = new Element(745, 135, './soil.svg', 'Soil', 80);
    chemicalEnergy = new Element(890, 135, './chemicalEnergy.svg', 'Usable \n Chemical \n Energy', 25);

    var elements = [lightEnergy, carbonDioxide, oxygen, glucose, water, soil, chemicalEnergy];

    //apply red function to all elements -- see above
    for (var i = 0; i < 8; i++) {
        red(elements[i]);
    }
}

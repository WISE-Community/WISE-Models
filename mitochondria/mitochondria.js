// Global variables

// the SVG.js draw object
var draw = null;

//answers - true: correct, false: incorrect
var correct = false;

//grat box
var box;

//element currently in the boxes, respectively
var element;

//elements
var glucose;
var lightEnergy;
var carbonDioxide;
var heatEnergy;
var water;
var oxygen;
var chemicalEnergy;

var mitochondrion;

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
        this.image = draw.image(image, 140, 140);
        this.txt = text;
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
        this.group.addClass('pointer');

        //drag n drop functionality
        var self = this;
        self.group.draggable(function(x, y) {
            this.front();
            return { x: x < 1060 && x > 0, y: y < 760 && y > 0}
        }).on("dragend", function() {

            //source -> target swapping and snapping
            if (this.x() > (box.x - 70)  && this.x() < (box.x + 70)  && this.y() > (box.y - 70) && this.y() < (box.y + 70)) {
                this.move(box.x, box.y);
                if (element && element != self) {
                    element.group.front().animate(100, '-', 0).move(element.origX, element.origY);
                }
                element = self;
            } else {
                this.move(self.origX, self.origY);
            }
            //update current x and y position
            self.x = this.x();
            self.y = this.y();
        }).on("dragstart", function() {
            //set boxes to null if an element is removed
            if (self == element) {
                element = null;
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

//create the instructions text
function createInstructions() {
    info = draw.text(function(add) {
        add.tspan('Mitochondria take in glucose transported from the chloroplast to ')
        add.tspan('release ').font({weight: 'bold'})
        add.tspan('chemical energy ').fill('#0ace00').font({weight: 'bold'})
        add.tspan('from the ').newLine().font({weight: 'bold'})
        add.tspan('glucose').fill('#0ace00').font({weight: 'bold'})
        add.tspan(', so plants can use the energy to grow and live. But mitochondria need')
        add.tspan('one more element to start this process (cellular respiration).').newLine()
    }).x(20).y(20).font({size: 22});

    instructions = draw.text('Drag the one you think will help mitochondria start cellular respiration into the gray box and check your answer.').x(20).y(130).font({size: 22});
}

function createCheck() {
    //draw check button
    checkGroup = draw.nested();
    shadow = checkGroup.image('./shadow.svg', 190, 86).attr({
        'x': 927,
        'y': 32,
    });
    check = checkGroup.image('./check.svg', 170, 60).attr({
        'x': 930,
        'y': 40,
    });
    check2 = checkGroup.image('./check2.svg', 170, 60).attr({
        'x': 930,
        'y': 40,
    });
    check2.hide();
    checkText = checkGroup.text('Check!').x(947).y(38).font({size: 40, family: 'Raleway', fill: '#FF9900'});
    checkGroup.addClass('pointer');

    //hover effect for check button
    checkGroup.mouseover(function() {
        check2.show();
        checkText.font({fill: '#009999'});
    })

    //when check button is clicked
    checkGroup.click(function() {
        info.clear();
        tries++;
        //successful attempt
        if (element == oxygen) {
            instructions.clear();
            instructions.text = draw.text(function(add) {
                add.tspan('Good job! Cellular respiration can\'t happen without ')
                add.tspan('oxygen').font({weight: 'bold'})
                add.tspan('.');
            }).x(20).y(20).font({size: 22});

            //sound effect
            var audio = new Audio('./kid.mp3');
            audio.play();

            //hide all other images
            shadow.hide();
            check.hide();
            check2.hide();
            checkText.hide();
            carbonDioxide.group.hide();
            chemicalEnergy.group.hide();
            water.group.hide();
            heatEnergy.group.hide();
            lightEnergy.group.hide();
            glucose.group.hide();
            oxygen.group.hide();
            box.image.hide();
            arrows.hide();

            //animation
            mitochondrion.x(-20);
            mitochondrion.y(-150);
            console.log('here');

            //unsuccessful attempt
        } else if (tries < 3) {
            reset();
            checkCorrect();
            //unsuccessful attempts and out of tries
        } else {
            instructions.text('Nice try, but that is not correct. This was your last chance. \n Click the \"Try Again\" button to restart the quiz!').x(20).y(20).font({size: 22});
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

//create the mitochondria
function createMitochondria() {
    mitochondria = draw.image('./mitochondria.svg', 530, 310).attr({
        'x': 290,
        'y': 390,
    });
    bar = draw.image('./bar.svg', 175, 350).attr({
        'x': 695,
        'y': 530,
    });
    text = draw.text('Mitochondrion').x(785).y(695).fill('#0000FF').font({size: 18, family: 'Roboto', anchor: 'middle', weight: 'bold'});
    mitochondrion = draw.group();
    mitochondrion.add(mitochondria);
    mitochondrion.add(bar);
    mitochondrion.add(text);
}

//create the roots
function createArrows() {
    arrows = draw.image('./arrows.svg', 100, 240).attr({
        'x': 190,
        'y': 390,
    });
}

//reset incorrect ones
function reset() {
    if (!correct && element != null) {
        element.group.move(element.origX, element.origY);
    }
}

//checks if the answers are correct
function checkCorrect() {
    switch (element) {
        case lightEnergy:
        instructions.text(function(add) {
            add.tspan('Nice try, but ')
            add.tspan('light energy ').fill('#ffc721').font({weight: 'bold'})
            add.tspan('is needed for ')
            add.tspan('photosynthesis').font({weight: 'bold'})
            add.tspan(', not cellular respiration.')
            add.tspan('Try Again!').newLine();
        }).x(20).y(20).font({size: 22})
        break;
        case carbonDioxide:
        instructions.text(function(add) {
            add.tspan('Nice try, but ')
            add.tspan('carbon dioxide ').fill('#ff0000').font({weight: 'bold'})
            add.tspan('is needed for ')
            add.tspan('photosynthesis').font({weight: 'bold'})
            add.tspan(', not cellular respiration.')
            add.tspan('Try Again!').newLine()
        }).x(20).y(20).font({size: 22});
        break;
        case water:
        instructions.text(function(add) {
            add.tspan('Nice try, but ')
            add.tspan('water ').fill('#0000ff').font({weight: 'bold'})
            add.tspan('is needed for ')
            add.tspan('photosynthesis').font({weight: 'bold'})
            add.tspan(', not cellular respiration.')
            add.tspan('Try Again!').newLine()
        }).x(20).y(20).font({size: 22});
        break;
        case heatEnergy:
        instructions.text('Nice try, but plants don\'t need heat energy for cellular respiration!').x(20).y(20).font({size: 22});
        break;
        case chemicalEnergy:
        instructions.text(function(add) {
            add.tspan('Nice try, but ')
            add.tspan('plants release ')
            add.tspan('usable chemical energy ').fill('#0ace00').font({weight: 'bold'})
            add.tspan('during cellular respiration.')
        }).x(20).y(20).font({size: 22});
    }
}

//create the try again button and its functionality
function createTryButton() {
    tryGroup = draw.nested();
    tryButton = tryGroup.image('./try.svg', 170, 100).attr({
        'x': 933,
        'y': 5,
    });
    tryText = tryGroup.text('Try Again').x(950).y(33).font({size: 30, family: 'Raleway'});
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
    createArrows();

    //create grey boxes
    box = new Box(60, 550);

    //instructions text
    createInstructions();

    //create Check button
    createCheck();

    //create elements
    glucose = new Element(60, 350, './glucose.svg', 'Glucose', 100);
    glucose.group.draggable(false);
    lightEnergy = new Element(80, 170, './lightenergy.svg', 'Light \n Energy', 70);
    carbonDioxide = new Element(225, 170, './carbonDioxide.svg', 'Carbon \n Dioxide', 70);
    heatEnergy = new Element(370, 170, './heatenergy.svg', 'Heat \n Energy', 70);
    water = new Element(515, 170, './water.svg', 'Water', 90);
    oxygen = new Element(660, 170, './oxygen.svg', 'Oxygen', 90);
    chemicalEnergy = new Element(805, 170, './chemicalenergy.svg', 'Usable \n Chemical \n Energy', 30);

    var elements = [lightEnergy, carbonDioxide, heatEnergy, water, oxygen, chemicalEnergy];

    //apply red function to all elements -- see above
    for (var i = 0; i < 8; i++) {
        red(elements[i]);
    }
}

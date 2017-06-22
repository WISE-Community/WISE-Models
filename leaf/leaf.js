// Global variables

// the SVG.js draw object
var draw = null;

var msleaf1;
var msleaf2;
//number of tries
var tries = 0;

class Clickable {
    constructor(image, hover, func) {
        this.image = image;
        this.hover = hover;

        this.group = draw.group();
        this.group.add(this.image);
        this.group.add(this.hover);
        this.func = func;

        var self = this;

        this.group.mouseover(function() {
            self.image.hide();
            self.hover.show();
        });

        this.group.mouseout(function() {
            self.image.show();
            self.hover.hide();
        });

        this.group.click(func);
        this.group.addClass('pointer');
    }
}

//create the background
function createBackground() {
    background = draw.image('./bg.svg', 1200, 900);
}

function createMicroscope() {
    microscope = draw.image('./microscope.svg', 450, 550).attr({
        'x': 220,
        'y': 230,
    });
}

function createPlant() {
    plant = draw.group();
    pot1shadow = plant.image('./pot1shadow.svg', 130, 130).attr({
        'x': 830,
        'y': 500,
    });
    pot1 = plant.image('./pot1.svg', 125, 125).attr({
        'x': 825,
        'y': 500,
    });
    pot2shadow = plant.image('./pot2shadow.svg', 180, 140).attr({
        'x': 810,
        'y': 455,
    });
    pot2 = plant.image('./pot2.svg', 145, 90).attr({
        'x': 817,
        'y': 460,
    });
    stem = plant.image('./stem.svg', 20, 80).attr({
        'x': 885,
        'y': 405,
    });

    leaf1 = draw.image('./leaf1.svg', 90, 60).attr({
        'x': 805,
        'y': 365,
    });
    leaf1hover = draw.image('./leaf1hover.svg', 70, 70).attr({
        'x': 830,
        'y': 355,
    }).hide();
    leaf2 = draw.image('./leaf2.svg', 80, 60).attr({
        'x': 900,
        'y': 380,
    });
    leaf2hover = draw.image('./leaf2hover.svg', 60, 70).attr({
        'x': 897,
        'y': 380,
    }).hide();
}

function createBigLeaf() {
    bigleaf = draw.group();
    leafzoom = bigleaf.image('./leafzoom.svg', 70, 120).attr({
        'x': 430,
        'y': 495,
    }).opacity(0);
    leaflines = bigleaf.image('./leaflines.svg', 200, 330).attr({
        'x': 435,
        'y': 350,
    }).opacity(0);
    bigleaf.addClass('pointer');
}

function createCell() {
    celllines = draw.image('./celllines.svg', 95, 250).attr({
        'x': 200,
        'y': 410,
    }).opacity(0);
    cell = draw.image('./cell.svg', 200, 200).attr({
        'x': 250,
        'y': 500,
    }).opacity(0);
    redBox = draw.image('./redBox.svg', 84, 55).attr({
        'x': 985,
        'y': 514,
    }).hide();
    yellowBox = draw.image('./yellowBox.svg', 84, 55).attr({
        'x': 985,
        'y': 514,
    }).hide();
    cellText = draw.text('Cells').x(900).y(230).fill('#F00').font({size: 30}).hide();
}

function createPlantCell() {
    plantCellLines = draw.image('./plantcelllines.svg', 95, 220).attr({
        'x': 200,
        'y': 410,
    }).opacity(0);
    plantCell = draw.image('./plantcell.svg', 200, 170).attr({
        'x': 200,
        'y': 410,
    }).opacity(0);
}

function createMitochondria() {
    mitochondria1 = draw.image('./mitochondria.svg', 80, 180).attr({
        'x': 630,
        'y': 420,
    }).rotate(-10);
    mitochondria2 = draw.image('./mitochondria.svg', 60, 130).attr({
        'x': 800,
        'y': 260,
    }).rotate(15);
}

function createChloroplast() {
    chloroplast1 = draw.image('./chloroplast.svg', 80, 170).attr({
        'x': 660,
        'y': 477,
    });
    chlorplast2 = draw.image('./chloroplast.svg', 100, 225).attr({
        'x': 600,
        'y': 280,
    }).rotate(320);
    chlorplast3 = draw.image('./chloroplast.svg', 80, 170).attr({
        'x': 865,
        'y': 260,
    });
}

function createInstructions() {
    textbox = draw.image('./textbox.svg', 1180, 200).attr({
        'x': 10,
        'y': 0,
    });
    instructions = draw.text(function(add) {
        add.tspan('We know that cellular respiration happens in ')
        add.tspan('every cell.').font({weight: 'bold'})
        add.tspan('Let\'s explore exactly where it is occuring. Click on a leaf.').newLine()
    }).x(50).y(50).font({size: 30});
}

function animateLeaf1() {
    leaf1click.image.show();
    leaf1click.hover.hide();
    leaf1click.group.off('mouseover');
    leaf1.animate(1500, '-', 0).move(410, 525).size(110).queue(function(){
        microscope.hide();
        msleaf1 = draw.image('./msleaf1.svg', 450, 550).attr({
            'x': 220,
            'y': 230,
        })
        this.dequeue();
    }).delay(100).queue(function() {
        plant.hide();
        leaf1.hide();
        leaf2.hide();
        this.dequeue();
    }).queue(zoomLeaf);
}

function animateLeaf2() {
    leaf2click.image.show();
    leaf2click.hover.hide();
    leaf2click.group.off('mouseover');
    leaf2.animate(1500, '-', 0).move(420, 520).queue(function(){
        microscope.hide();
        msleaf2 = draw.image('./msleaf2.svg', 450, 550).attr({
            'x': 220,
            'y': 230,
        })
        this.dequeue();
    }).delay(100).queue(function() {
        plant.hide();
        leaf1.hide();
        leaf2.hide();
        this.dequeue();
    }).queue(zoomLeaf);
}

function zoomLeaf() {
    leafzoom.animate(1500, '>', 0).move(800, 330).size(210).opacity(1);
    leaflines.animate(1500, '>', 0).size(440, 330).opacity(1);
    instructions.text(function(add) {
        add.tspan('With a microscope you can see what is happening inside the leaf.')
        add.tspan('Click the box below.').newLine()
    }).x(50).y(50).font({size: 30});
    bigleaf.click(leafCell);
}

function leafCell() {
    leaflines.hide();
    if (msleaf1 != null) {
        msleaf1.hide();
    }
    if (msleaf2 != null) {
        msleaf2.hide();
    }
    smallMS = draw.image('./msleaf1.svg', 80, 100).attr({
        'x': 100,
        'y': 210,
    })
    instructions.text(function(add) {
        add.tspan('This is inside the leaf. There are many cells inside the leaf.')
        add.tspan('Click the red box below to find where cellular respiration is happening.').newLine()
    }).x(50).y(50).font({size: 30});
    leafzoom.animate(1000, '>', 0).move(140, 465).size(160, 260).delay(200).queue(function() {
        celllines.animate(1900, '-', 0).move(200, 310).size(230, 470).opacity(1);
        cell.animate(2000, '>', 0).move(420, 200).size(670).opacity(1);
        this.dequeue();
    }).delay(1950).queue(function() {
        redBox.show();
        cellText.show();
        this.dequeue();
    });5
}

function animatePlantCell() {
    cellClick.group.off('mouseover');
    cellClick.group.off('mouseout');
    leafzoom.animate(1000, '-', 0).move(190, 200).size(70);
    celllines.hide();
    yellowBox.hide();
    redBox.hide();
    cell.animate(1000, '-', 0).move(-90, 420).size(600, 300);
    cellText.animate(1000, '-', 0).move(280, 390).size(20, 10).delay(200).queue(function() {
        plantCell.animate(1000, '-', 0).move(532, 230).size(632).opacity(1);
        plantCellLines.animate(1000, '-', 0).move(343, 90).size(350, 800).opacity(1);
    });
    instructions.text(function(add) {
        add.tspan('This is inside the plant cell. Where do you think plants release energy from glucose?')
        add.tspan('Find an organelle that makes cellular respiration possible.').newLine()
    }).x(50).y(50).font({size: 30});
}

function init() {
    // create the SVG.js draw object
    draw = SVG('model');

    //draw images
    createBackground();
    createInstructions();
    createMicroscope();
    createPlant();
    createBigLeaf();
    createCell();
    createPlantCell();
    createMitochondria();
    createChloroplast();

    leaf1click = new Clickable(leaf1, leaf1hover, animateLeaf1);
    leaf2click = new Clickable(leaf2, leaf2hover, animateLeaf2);
    cellClick = new Clickable(redBox, yellowBox, animatePlantCell)
}

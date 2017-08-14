// create two canvases with id model and controls, respectively

// make the model canvas background color light blue
var canvasModel = new fabric.Canvas('model', {
	backgroundColor: 'rgb(173,216,230)'
});

// make the model canvas background color light gray
var canvasControls = new fabric.Canvas('controls', {
	backgroundColor: 'rgb(200,200,200)'
});

// Elements on Model Canvas

// make chloroplast image and object in fabric
// modify the image, set dimensions and remove the white background
// add modified image to the canvas

var chloroplast = null;
fabric.Image.fromURL('./chloroplast.png', function(img){
	img.scale(8);
	img.setWidth(265);
	img.setHeight(150);
	img.setLeft(-160);
	img.setTop(17);
	img.set('selectable', false);
	//img.filters.push(new fabric.Image.filters.RemoveWhite({threshold: 25, distance: 150}));
	//img.applyFilters(canvasModel.renderAll.bind(canvasModel));
	chloroplast = img;
	canvasModel.add(img);
	canvasModel.moveTo(img,0);
})

var membraneChannel = null;
fabric.Image.fromURL('./membraneChannel.png', function(img){
	img.scale(0.5);
	img.setWidth(600);
	img.setHeight(235);
	img.setAngle(-18);
	img.setLeft(230);
	img.setTop(128);
	membraneChannel = img;
	canvasModel.add(img)
});

var glucoseMachine = null;
fabric.Image.fromURL('./GlucoseMachine.png', function(img){
	img.scale(0.4);
	img.setLeft(621);
	img.setTop(187);
	glucoseMachine = img;
	canvasModel.add(img)
});

var energyWheel = null;
fabric.Image.fromURL('./energyWheel.png', function(img){
	img.scale(0.25);
	img.setLeft(747);
	img.setTop(473);
	img.set({originX: 'center'});
	img.set({originY: 'center'});
	energyWheel = img;
	canvasModel.add(img)
});

var chlorophyll1 = null;
fabric.Image.fromURL('./chlorophyllNet.png', function(img){
	img.scale(0.3);
	img.setAngle(-38);
	img.setLeft(204);
	img.setTop(505);
	chlorophyll1 = img;
	canvasModel.add(img)
});

var chlorophyll2 = null;
fabric.Image.fromURL('./chlorophyllNet.png', function(img){
	img.scale(0.3);
	img.setAngle(-17);
	img.setLeft(412);
	img.setTop(435);
	chlorophyll2 = img;
	canvasModel.add(img)
});

var energyCarrierEMPTY1 = null;
fabric.Image.fromURL('./energyCarrierEmpty.png', function(img){
	img.scale(0.15);
	img.setAngle(153);
	img.setLeft(834);
	img.setTop(460);
	energyCarrierEMPTY1 = img;
	canvasModel.add(img)
});

var releasedGasText = new fabric.Text('Released Gas', {
	fontSize: 16,
	fontWeight: 'bold',
	left: 5,
	top: 83
	});


// Elements on Controls Canvas

//Adds dividing line between panels

canvasControls.add(new fabric.Line([0, 0, 0, 300], {
        left: 400,
        top: -5,
        stroke: 'black',
        strokeWidth: 6
    }));
/*
canvasControls.add(new fabric.Line([0, 0, 0, 300], {
        left: 660,
        top: -5,
        stroke: 'black',
        strokeWidth: 6
    }));
*/
var hereChloroplast = null;
fabric.Image.fromURL('./hereChloroplast.png', function(img){
	img.scale(0.33);
	img.setLeft(2);
	//img.setTop(8);
	img.setWidth(1150);
	img.setHeight(860);
	hereChloroplast = img;
	canvasControls.add(img)
});
/*
var inputsLabel = new fabric.Text('Click Icons to Add', {
	fontSize: 24,
	fontFamily: 'calibri',
	fontWeight: 'bold',
	left: 435,
	top: 5,
	textDecoration: 'underline'
	});
canvasControls.add(inputsLabel)

var inputTotalLabel = new fabric.Text('Totals', {
	fontSize: 20,
	fontFamily: 'calibri',
	fontWeight: 'bold',
	left: 590,
	top: 37
	});
canvasControls.add(inputTotalLabel)

var carbDioxLabel = new fabric.Text('Carbon Dioxide (CO2)', {
	fontSize: 16,
	fontFamily: 'calibri',
	fontWeight: 'bold',
	left: 405,
	top: 190
	});
canvasControls.add(carbDioxLabel)

var carbDioxControl = null;
fabric.Image.fromURL('./carbonDioxide.png', function(img){
	img.scale(0.45);
	img.setAngle(22);
	img.setLeft(430);
	img.setTop(210);
	carbDioxControl = img;
	canvasControls.add(img)
});

var hydroAtomLabel = new fabric.Text('Hydrogen Atom', {
	fontSize: 16,
	fontFamily: 'calibri',
	fontWeight: 'bold',
	left: 405,
	top: 40
	});
canvasControls.add(hydroAtomLabel)

var hydroAtomControl = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.scale(0.45);
	img.setAngle(22);
	img.setLeft(440);
	img.setTop(65);
	carbDioxControl = img;
	canvasControls.add(img)
});
*/
var iconLegend = null;
fabric.Image.fromURL('./iconLegend.png', function(img){
	img.scale(0.33);
	img.setLeft(450);
	//img.setTop(8);
	img.setWidth(1500);
	img.setHeight(860);
	iconLegend = img;
	canvasControls.add(img)
	img.on('selected', animationStart)
});

//Phase 1 of the reaction
// Creates arrays for all the objects that have been initialized
var carbonDioxide = {};
var water = {};
var photon = {};

var carbDioxCounter = 0;

//  Function to instantiates all the objects in the array and defines which characteristics they will have
function makeCO2(id, scale, left, top, angle, opacity) {
	fabric.Image.fromURL('./carbonDioxide.png', function(img) {
		img.scale(scale);
		img.setLeft(left);
		img.setTop(top);
		img.setAngle(angle);
		img.setOpacity(opacity);
		carbonDioxide[id] = img;
	});
}

function makeH2O(id, scale, left, top, opacity) {
	fabric.Image.fromURL('./water.png', function(img) {
		img.scale(scale);
		img.setLeft(left);
		img.setTop(top);
		img.setOpacity(opacity);
		water[id] = img;
	});
}

function makePhoton(id, scale, left, top, angle) {
	fabric.Image.fromURL('./photon.png', function(img) {
		img.scale(scale);
		img.setLeft(left);
		img.setTop(top);
		img.setAngle(angle);
		photon[id] = img;
	});
}
// Function to set all the objects in the array with their starting/initial values
function initializeCO2() {
	makeCO2(1, 0.6, 325, 20, 40, 1);
	makeCO2(2, 0.6, 287, 29, 40, 1);
	makeCO2(3, 0.6, 298, 77, 40, 1);
	makeCO2(4, 0.6, 345, 77, 40, 1);
	makeCO2(5, 0.6, 387, 85, 40, 1);
	makeCO2(6, 0.6, 386, 55, 40, 1);
	makeCO2(7, 0.6, 305, 20, 40, 1);
	makeCO2(8, 0.6, 267, 29, 40, 1);
	makeCO2(9, 0.6, 278, 77, 40, 1);
	makeCO2(10, 0.6, 325, 77, 40, 1);
	makeCO2(11, 0.6, 367, 85, 40, 1);
	makeCO2(12, 0.6, 366, 55, 40, 1);
}

function initializeH2O() {
	makeH2O(1, 0.6, 340, 25, 1);
	makeH2O(2, 0.6, 383, 35, 1);
}

function initializePhoton() {
	makePhoton(1, 0.35, 32, 29, 140);
	makePhoton(2, 0.35, 32, 29, 140);
}

// Function to retrieve a specific object in the array
function getCO2(id) {
	return carbonDioxide[id];
}

function getH2O(id) {
	return water[id];
}

function getPhoton(id) {
	return photon[id];
}

// Function to simultaneously set ALL the objects on the canvas with their starting/initial values
function initializePhase1Objects() {
	initializeCO2();
	initializeH2O();
	initializePhoton();
}

// Calls the function to initialize ALL the objects
initializePhase1Objects();

// Student prompted to "Add the type and amount of inputs to make a glucose molecule and keep the plant alive."
// "num___" variable values should correspond to the student's input
// After input selections, students presented with a confirmation prompt and chemical formula: "Based on your selections, the following chemical reaction will attempt to run."
// Student prompted to "Click the 'Run Chemical Reaction' button or the 'Make Changes' button to change your input selections."
// Objects load onto screen based on student inputs
// If correct inputs are added then the reaction runs
// Potential run errors:
// 		No correct inputs: "The chloroplast cannot use these starting materials to make glucose. Please select different inputs."
//		Insufficient amount of inputs: "There are not enough starting materials to make glucose. Make sure that the atoms in your starting materials match the atoms in glucose and/or that you have enough energy."
//		Deadly leftovers: "The amounts of starting materials used created chemical leftovers that will destroy the plant cell. Adjust the starting amounts to prevent deadly leftovers."
//		Toxic input (Hydrogen atom): "Extra hydrogen atoms will make the plant cell die. Remove the extra hydrogen atoms to keep the plant alive."
//		Toxic input (Oxygen atom): "Single oxygen atoms will make the plant cell die. Remove the extra oxygen atoms to keep the plant alive."
//		Incorrect input (Oxygen gas): "Since oxygen gas is a waste product for the plant cell, it cannot be used by the chloroplast to make glucose. Remove the oxygen gas from your starting materials."
//		Incorrect input (Glucose): "Since the goal is to make glucose, the chloroplast cannot use glucose as a starting material. Please remove glucose from your starting materials. "
// If all the correct inputs and amounts have been added a Success message will be triggered: "Congratulations, you've provided the chloroplast with the energy and matter it needed to make glucose!"
// If more than 6 CO2 are added as inputs then the entire reaction will run twice.  On the second loop, the "Success" and the "Insufficient amount of inputs" messages will be generated.

//var numCO2 = carbDioxCounter;
//var carbDioxCounter = 0;

//var numCO2 = carbDioxCounter;
var waterCounter = 0;

var numH2O = 2;
var numPhoton = 12;
var numHatom = 0;
var numOatom = 0;
var numGlucose = 0;
var numOxyGas = 0;

var remainingNumCO2;
var remainingNumH2O;
var remainingNumPhoton;
var remainingNumHatom;
var remainingNumOatom;
var remainingNumGlucose;
var remainingNumOxyGas;


var startButton = document.getElementById("start");
var addCO2Button = document.getElementById("+CO2");
var subtractCO2Button = document.getElementById("-CO2");
var resetCO2Button = document.getElementById("resetCO2");
var addH2OButton = document.getElementById("+H2O");
var subtractH2OButton = document.getElementById("-H2O");
var resetH2OButton = document.getElementById("resetH2O");


var resetInputsButton = document.getElementById("resetInputs");
var resetAnimationButton = document.getElementById("resetAnimation");
var resetAnimationButton = document.getElementById("pauseAnimation");

startButton.onclick = function() {
	document.getElementById("equation").innerHTML = carbDioxCounter + " CO2 + " +  waterCounter + " H2O + light = __________";
	animationStart();
}

addCO2Button.onclick = function() {
	carbDioxCounter += 1;
	if (carbDioxCounter > 12) {
		carbDioxCounter = 12;
	} else {
	document.getElementById("totalCO2").innerHTML = "Total CO2 = " + carbDioxCounter;
	}
}

subtractCO2Button.onclick = function() {
	carbDioxCounter -= 1;
	if (carbDioxCounter < 0) {
		carbDioxCounter = 0;
	} else {
	document.getElementById("totalCO2").innerHTML = "Total CO2 = " + carbDioxCounter;
	}
}

resetCO2Button.onclick = function() {
	carbDioxCounter = 0;
	document.getElementById("totalCO2").innerHTML = "Total CO2 = " + carbDioxCounter;
}

addH2OButton.onclick = function() {
	waterCounter += 1;
	if (waterCounter > 12) {
		waterCounter = 12;
	} else {
	document.getElementById("totalH2O").innerHTML = "Total H2O = " + waterCounter;
	}
}

subtractH2OButton.onclick = function() {
	waterCounter -= 1;
	if (waterCounter < 0) {
		waterCounter = 0;
	} else {
	document.getElementById("totalH2O").innerHTML = "Total H2O = " + waterCounter;
	}
}

resetH2OButton.onclick = function() {
	waterCounter = 0;
	document.getElementById("totalH2O").innerHTML = "Total H2O = " + waterCounter;
}

resetInputsButton.onclick = function() {
	carbDioxCounter = 0;
	waterCounter = 0;
	document.getElementById("totalCO2").innerHTML = "Total CO2 = " + carbDioxCounter;
	document.getElementById("totalH2O").innerHTML = "Total H2O = " + waterCounter;
}

resetAnimationButton.onclick = function() {
	initializeObjects;
}

/*pauseAnimationButton.onclick = function() {

}*/

function animationStart() {
	//remainingNumCO2 = numCO2;
	remainingNumH2O = waterCounter;
	remainingNumPhoton = numPhoton;
	remainingNumHatom = numHatom;
	remainingNumOatom = numOatom;
	remainingNumGlucose = numGlucose;
	remainingNumOxyGas = numOxyGas;
	if (carbDioxCounter == 0 && waterCounter == 0) {
		alert("You must add starting materials to make glucose, because matter must be created from something.");
	} else {
		addCarbonDioxide();
		addWater();
	}
}

// loop Tester: document.getElementById("test").innerHTML = "loop test = " + i;
function addCarbonDioxide() {
	var i;
	for (i=1; carbDioxCounter>=i; i++) {
		if (i == 1) {
			var carbonDioxide1 = getCO2(i);
			canvasModel.add(carbonDioxide1);
			carbonDioxide1.animate({left: 470, top: 186, angle: 0}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel)
			});
		} else if (i == 2) {
			var carbonDioxide2 = getCO2(i);
			canvasModel.add(carbonDioxide2);
			carbonDioxide2.animate({left: 470, top: 206, angle: 0}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel)
			});
		} else if (i == 3) {
			var carbonDioxide3 = getCO2(i);
			canvasModel.add(carbonDioxide3);
			carbonDioxide3.animate({left: 470, top: 226, angle: 0}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel)
			});
		} else if (i == 4) {
			var carbonDioxide4 = getCO2(i);
			canvasModel.add(carbonDioxide4);
			carbonDioxide4.animate({left: 470, top: 246, angle: 0}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel)
			});
		} else if (i == 5) {
			var carbonDioxide5 = getCO2(i);
			canvasModel.add(carbonDioxide5);
			carbonDioxide5.animate({left: 470, top: 266, angle: 0}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel)
			});
		} else if (i == 6) {
			var carbonDioxide6 = getCO2(i);
			canvasModel.add(carbonDioxide6);
			carbonDioxide6.animate({left: 470, top: 286, angle: 0}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel)
			});
		} else if (i == 7) {
			var carbonDioxide7 = getCO2(i);
			canvasModel.add(carbonDioxide7);
			carbonDioxide7.animate({left: 390, top: 186, angle: 0}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel)
			});
		} else if (i == 8) {
			var carbonDioxide8 = getCO2(i);
			canvasModel.add(carbonDioxide8);
			carbonDioxide8.animate({left: 390, top: 206, angle: 0}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel)
			});
		} else if (i == 9) {
			var carbonDioxide9 = getCO2(i);
			canvasModel.add(carbonDioxide9);
			carbonDioxide9.animate({left: 390, top: 226, angle: 0}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel)
			});
		} else if (i == 10) {
			var carbonDioxide10 = getCO2(i);
			canvasModel.add(carbonDioxide10);
			carbonDioxide10.animate({left: 390, top: 246, angle: 0}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel)
			});
		} else if (i == 11) {
			var carbonDioxide11 = getCO2(i);
			canvasModel.add(carbonDioxide11);
			carbonDioxide11.animate({left: 390, top: 266, angle: 0}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel)
			});
		} else if (i == 12) {
			var carbonDioxide12 = getCO2(i);
			canvasModel.add(carbonDioxide12);
			carbonDioxide12.animate({left: 390, top: 286, angle: 0}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel)
			});
		}
	}
}

var waterLoopCounter = 1;

function addWater() {
	document.getElementById("loops").innerHTML = "# of Rounds = " + waterLoopCounter;
	if (remainingNumH2O == 0) {
		addPhotons();
	} else if (remainingNumH2O == 1) {
		moveWater1();
		return;
	} else {
		moveWater1();
		moveWater2();
		return;
	}
	}

function moveWater1() {
	var water1 = getH2O(1);
	canvasModel.add(water1);
	water1.animate({left: 355, top: 340}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function(){
			water1.animate({left: 237, top: 552, angle: -42}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel),
				onComplete: function() {
					addPhotons();
				}
			});
		}
	});
}

function moveWater2() {
	var water2 = getH2O(2);
	canvasModel.add(water2);
	water2.animate({left: 398, top: 350}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function (){
			water2.animate({left: 430, top: 494, angle: -31}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel)
			});
		}
	});
}

// Phase 2 objects
var oxygenAtom = {};
var hydrogenAtom = {};
var oxygenGas = {};

function makeOxyAtom(id, scale, left, top) {
	fabric.Image.fromURL('./oxygenAtom.png', function(img){
		img.scale(scale);
		img.setLeft(left);
		img.setTop(top);
		oxygenAtom[id] = img;
	});
}

function makeHydroAtom(id, scale, left, top) {
	fabric.Image.fromURL('./hydrogen.png', function(img){
		img.scale(scale);
		img.setLeft(left);
		img.setTop(top);
		hydrogenAtom[id] = img;
	});
}

function makeOxyGas(id, scale, left, top, angle) {
	fabric.Image.fromURL('./oxygen.png', function(img){
		img.scale(scale);
		img.setLeft(left);
		img.setTop(top);
		img.setAngle(angle);
		oxygenGas[id] = img;
	});
}

function initializeOxyAtom() {
	makeOxyAtom(1, 0.6, 252, 533);
	makeOxyAtom(2, 0.6, 447, 481);
}

function initializeHydroAtom() {
	makeHydroAtom(1, 0.5, 254, 556);
	makeHydroAtom(2, 0.5, 272, 534);
	makeHydroAtom(3, 0.5, 442, 497);
	makeHydroAtom(4, 0.5, 465, 480);
}

function initializeOxyGas() {
	makeOxyGas(0, 0.55, 341, 503, 190);
	makeOxyGas(1, 0.55, 30, 135, 190);
	makeOxyGas(2, 0.55, 30, 162, 190);
	makeOxyGas(3, 0.55, 30, 189, 190);
	makeOxyGas(4, 0.55, 30, 216, 190);
	makeOxyGas(5, 0.55, 30, 243, 190);
	makeOxyGas(6, 0.55, 30, 270, 190);
}

function getOxyAtom(id) {
	return oxygenAtom[id];
}

function getHydroAtom(id) {
	return hydrogenAtom[id];
}

function getOxyGas(id) {
	return oxygenGas[id];
}

function initializePhase2Objects() {
	initializeOxyAtom();
	initializeHydroAtom();
	initializeOxyGas();
}

initializePhase2Objects();

function addPhotons (){
	if (remainingNumPhoton == 0) {
		alert("No photons! You broke it!!!");
		return;
	} else if (remainingNumPhoton == 1) {

		var photonHasH2O = false;
		if (remainingNumH2O > 0) {
			photonHasH2O = true;
		}
		movePhoton1(photonHasH2O);
		return;
	} else {

		var photon1HasH2O = false;
		if (remainingNumH2O > 0) {
			photon1HasH2O = true;
		}
		movePhoton1(photon1HasH2O);

		var photon2HasH2O = false;
		if (remainingNumH2O > 1) {
			photon2HasH2O = true;
		}
		movePhoton2(photon2HasH2O);
		return;
	}
}

function movePhoton1(hasH20) {
	var photon1 = getPhoton(1);
	canvasModel.add(photon1);
	photon1.animate({left: 238, top: 501}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function (){
			chlorophyll1.animate({left: 224, top: 508}, {
				duration: 500,
				onChange: canvasModel.renderAll.bind(canvasModel),
				easing: fabric.util.ease.easeInElastic,
				onComplete: function (){
					//photon1.setOpacity(0);
					//initializePhoton();
					chlorophyll1.setLeft(204);
					chlorophyll1.setTop(505);
					if (!hasH20) {
						alert("The reaction cannot continue, because there is not a water with the chlorophyll.");
					} else {
						photon1.setOpacity(0);
						initializePhoton();
						var water1 = getH2O(1);
						water1.setOpacity(0);
						initializeH2O();
						var oxygenAtom1 = getOxyAtom(1);
						canvasModel.add(oxygenAtom1);
						oxygenAtom1.animate({left: 340, top: 503}, {
							duration: 1000,
							onChange: canvasModel.renderAll.bind(canvasModel)
						});
						var hydrogenAtom1 = getHydroAtom(1);
						canvasModel.add(hydrogenAtom1);
						hydrogenAtom1.animate({left: 758, top: 522, opacity: 1}, {
							duration: 1000,
							onChange: canvasModel.renderAll.bind(canvasModel)
						});
						var hydrogenAtom2 = getHydroAtom(2);
						canvasModel.add(hydrogenAtom2);
						hydrogenAtom2.animate({left: 716, top: 521, opacity: 1}, {
							duration: 1000,
							onChange: canvasModel.renderAll.bind(canvasModel)
						});
					}
				}
			});
		}
	});
}

function movePhoton2 (hasH20) {
	var photon2 = getPhoton(2);
	canvasModel.add(photon2);
	photon2.animate({left: 438, top: 438}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		//easing: fabric.util.ease.easeOutBounce,
		onComplete: function (){
			chlorophyll2.animate({left: 432, top: 438}, {
				duration: 500,
				onChange: canvasModel.renderAll.bind(canvasModel),
				easing: fabric.util.ease.easeInElastic,
				onComplete: function (){
					//photon2.setOpacity(0);
					chlorophyll2.setLeft(412);
					chlorophyll2.setTop(435);
					if (!hasH20) {
						alert("The reaction cannot continue, because there is not a water with the chlorophyll.");
					} else {
						photon2.setOpacity(0)
						var water2 = getH2O(2);
						water2.setOpacity(0);
						var oxygenAtom2 = getOxyAtom(2);
						canvasModel.add(oxygenAtom2);
						oxygenAtom2.animate({left: 348, top: 505}, {
							duration: 1000,
							onChange: canvasModel.renderAll.bind(canvasModel)
						});
						var hydrogenAtom3 = getHydroAtom(3);
						canvasModel.add(hydrogenAtom3);
						hydrogenAtom3.animate({left: 689, top: 501, opacity: 1}, {
							duration: 1000,
							onChange: canvasModel.renderAll.bind(canvasModel)
						});
						var hydrogenAtom4 = getHydroAtom(4);
						canvasModel.add(hydrogenAtom4);
						hydrogenAtom4.animate({left: 678, top: 469, opacity: 1}, {
							duration: 1000,
							onChange: canvasModel.renderAll.bind(canvasModel),
							onComplete: function () {
								turnEnergyWheel();
								makeOxy();
							}
						});
					}
				}
			});
		}
	});
}

function releaseOxy1 () {
	var oxygenGas1 = getOxyGas(1);
	canvasModel.add(oxygenGas1);
}

function releaseOxy2 () {
	var oxygenGas2 = getOxyGas(2);
	canvasModel.add(oxygenGas2);
}

function releaseOxy3 () {
	var oxygenGas3 = getOxyGas(3);
	canvasModel.add(oxygenGas3);
}

function releaseOxy4 () {
	var oxygenGas4 = getOxyGas(4);
	canvasModel.add(oxygenGas4);
}

function releaseOxy5 () {
	var oxygenGas5 = getOxyGas(5);
	canvasModel.add(oxygenGas5);
}

function releaseOxy6 () {
	var oxygenGas6 = getOxyGas(6);
	canvasModel.add(oxygenGas6);
}

function makeOxy() {
	var oxygenGas0 = getOxyGas(0);
	var oxygenAtom1 = getOxyAtom(1);
	var oxygenAtom2 = getOxyAtom(2);
	canvasModel.add(oxygenGas0);
	oxygenAtom1.setOpacity(0);
	oxygenAtom2.setOpacity(0);
	initializeOxyAtom();
	oxygenGas0.animate ({left: 345, top: 136}, {
		duration: 3000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function (){
			oxygenGas0.animate ({left: 53, top: 159}, {
				duration: 3000,
				onChange: canvasModel.renderAll.bind(canvasModel),
				onComplete: function() {
					canvasModel.add(releasedGasText);
					oxygenGas0.setOpacity(0);
					initializeOxyGas();
					if (waterLoopCounter == 1) {
						releaseOxy1();
					}
					if (waterLoopCounter == 2) {
						releaseOxy1();
						releaseOxy2();
					}
					if (waterLoopCounter == 3) {
						releaseOxy1();
						releaseOxy2();
						releaseOxy3();
					}
					if (waterLoopCounter == 4) {
						releaseOxy1();
						releaseOxy2();
						releaseOxy3();
						releaseOxy4();
					}
					if (waterLoopCounter == 5) {
						releaseOxy1();
						releaseOxy2();
						releaseOxy3();
						releaseOxy4();
						releaseOxy5();
					}
					if (waterLoopCounter == 6) {
						releaseOxy1();
						releaseOxy2();
						releaseOxy3();
						releaseOxy4();
						releaseOxy5();
						releaseOxy6();
					}
				}
			});
		}
	});
}

function turnEnergyWheel() {
	var hydrogenAtom1 = getHydroAtom(1);
	var hydrogenAtom2 = getHydroAtom(2);
	var hydrogenAtom3 = getHydroAtom(3);
	var hydrogenAtom4 = getHydroAtom(4);
	var energyWheelGroup = new fabric.Group([hydrogenAtom1, hydrogenAtom2, hydrogenAtom3, hydrogenAtom4, energyWheel], {originX: 'center', originY: 'center'});
	canvasModel.add(energyWheelGroup);
	canvasModel.remove(energyWheel);
	hydrogenAtom1.setOpacity(0);
	hydrogenAtom2.setOpacity(0);
	hydrogenAtom3.setOpacity(0);
	hydrogenAtom4.setOpacity(0);
	initializeHydroAtom();
	energyWheelGroup.animate({angle: -90}, {
		duration: 1000,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	energyCarrierEMPTY1.animate({left: 767, top: 395, angle: 90}, {
		duration: 1000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function() {
			energyCarrierEMPTY1.setOpacity(0);
			canvasModel.remove(energyWheelGroup);
			if (waterLoopCounter == 1) {
				releaseEnergyLoop1();
			}
			if (waterLoopCounter == 2) {
				releaseEnergyLoop2();
			}
			if (waterLoopCounter == 3) {
				releaseEnergyLoop3();
			}
			if (waterLoopCounter == 4) {
				releaseEnergyLoop4();
			}
			if (waterLoopCounter == 5) {
				releaseEnergyLoop5();
			}
			if (waterLoopCounter == 6) {
				releaseEnergyLoop6();
			}
		}
	});
}

//Phase 3 Objects
var energyCarrierFULL = {};
var hydrogenInputAtom = {};

function makeEnergyCarrierFULL(id, scale, left, top, angle) {
	fabric.Image.fromURL('./energyCarrierFULL.png', function(img){
		img.scale(scale);
		img.setLeft(left);
		img.setTop(top);
		img.setAngle(angle);
		energyCarrierFULL[id] = img;
	});
}

function makeHydrogenInputAtom(id, scale, left, top) {
	fabric.Image.fromURL('./hydrogen.png', function(img){
		img.scale(scale);
		img.setLeft(left);
		img.setTop(top);
		hydrogenInputAtom[id] = img;
	});
}

function initializeEnergyCarrierFULL() {
	makeEnergyCarrierFULL(1, 0.15, 767, 395, 90);
	makeEnergyCarrierFULL(2, 0.15, 767, 395, 90);
	makeEnergyCarrierFULL(3, 0.15, 767, 395, 90);
	makeEnergyCarrierFULL(4, 0.15, 767, 395, 90);
	makeEnergyCarrierFULL(5, 0.15, 767, 395, 90);
	makeEnergyCarrierFULL(6, 0.15, 767, 395, 90);
}

function initializeHydrogenInputAtom() {
	makeHydrogenInputAtom(1, 0.5, 795, 447);
	makeHydrogenInputAtom(2, 0.5, 795, 487);
	makeHydrogenInputAtom(3, 0.5, 773, 515);
	makeHydrogenInputAtom(4, 0.5, 743, 526);
	makeHydrogenInputAtom(5, 0.5, 795, 447);
	makeHydrogenInputAtom(6, 0.5, 795, 487);
	makeHydrogenInputAtom(7, 0.5, 773, 515);
	makeHydrogenInputAtom(8, 0.5, 743, 526);
	makeHydrogenInputAtom(9, 0.5, 795, 447);
	makeHydrogenInputAtom(10, 0.5, 795, 487);
	makeHydrogenInputAtom(11, 0.5, 773, 515);
	makeHydrogenInputAtom(12, 0.5, 743, 526);
	makeHydrogenInputAtom(13, 0.5, 795, 447);
	makeHydrogenInputAtom(14, 0.5, 795, 487);
	makeHydrogenInputAtom(15, 0.5, 773, 515);
	makeHydrogenInputAtom(16, 0.5, 743, 526);
	makeHydrogenInputAtom(17, 0.5, 795, 447);
	makeHydrogenInputAtom(18, 0.5, 795, 487);
	makeHydrogenInputAtom(19, 0.5, 773, 515);
	makeHydrogenInputAtom(20, 0.5, 743, 526);
	makeHydrogenInputAtom(21, 0.5, 795, 447);
	makeHydrogenInputAtom(22, 0.5, 795, 487);
	makeHydrogenInputAtom(23, 0.5, 773, 515);
	makeHydrogenInputAtom(24, 0.5, 743, 526);
}

function getEnergyCarrierFULL(id) {
	return energyCarrierFULL[id];
}

function getHydrogenInputAtom(id) {
	return hydrogenInputAtom[id];
}

function initializePhase3Objects() {
	initializeEnergyCarrierFULL();
	initializeHydrogenInputAtom();
}

initializePhase3Objects();

var numLoops = 6 / 2;
var i;
// Need to loop this based on the number of waters added, n/2 = # of loop, n=waters added
//function releaseEnergyLoop () {
	//document.getElementById("loops").innerHTML = "# Loops = " + numLoops;
//for (i=0; i<=numLoops; i++) {
//	addWater();
	function releaseEnergyLoop1() {
		energyWheel.setLeft(747);
		energyWheel.setTop(473);
		energyWheel.setAngle(-90);
		canvasModel.add(energyWheel);
		var energyCarrierFULL1 = getEnergyCarrierFULL(1);
		canvasModel.add(energyCarrierFULL1);
		energyCarrierFULL1.animate({left: 664, top: 193, angle: 0}, {
			duration: 700,
			onChange: canvasModel.renderAll.bind(canvasModel)
		});
		var hydrogenInputAtom1 = getHydrogenInputAtom(1);
		canvasModel.add(hydrogenInputAtom1);
		hydrogenInputAtom1.animate({left: 555, top: 192}, {
			duration: 2500,
			onChange: canvasModel.renderAll.bind(canvasModel)
		});
		var hydrogenInputAtom2 = getHydrogenInputAtom(2);
		canvasModel.add(hydrogenInputAtom2);
		hydrogenInputAtom2.animate({left: 570, top: 192}, {
			duration: 2500,
			onChange: canvasModel.renderAll.bind(canvasModel)
		});
		var hydrogenInputAtom3 = getHydrogenInputAtom(3);
		canvasModel.add(hydrogenInputAtom3);
		hydrogenInputAtom3.animate({left: 585, top: 192}, {
			duration: 2500,
			onChange: canvasModel.renderAll.bind(canvasModel)
		});
		var hydrogenInputAtom4 = getHydrogenInputAtom(4);
		canvasModel.add(hydrogenInputAtom4);
		hydrogenInputAtom4.animate({left: 600, top: 192}, {
			duration: 2500,
			onChange: canvasModel.renderAll.bind(canvasModel),
			onComplete: function() {
				resetForWaterLoop();
		//		collectMolecules ();
			}
		});
//	}
//}
}
var glucoseMade = false;

function resetForWaterLoop() {
	energyWheel.setLeft(747);
	energyWheel.setTop(473);
	energyWheel.setAngle(0);
	energyCarrierEMPTY1.setLeft(1100);
	energyCarrierEMPTY1.setTop(337);
	energyCarrierEMPTY1.setOpacity(1);
	energyCarrierEMPTY1.setAngle(90);
	energyCarrierEMPTY1.animate({left: 834, top: 460, angle: 153}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function() {
			waterLoopCounter += 1;
			remainingNumH2O -= 2;
			document.getElementById("totalH2O").innerHTML = "Remaining H2O = " + remainingNumH2O;
			var water1 = getH2O(1);
			if (remainingNumH2O > 0) {
				//canvasModel.add(water1);
				addWater();
				document.getElementById("loops").innerHTML = "# of Rounds = " + waterLoopCounter;
			} else if (!glucoseMade) {
				alert("The reaction could not finish, because you do not have all the necessary starting materials. Look at the chemical formula for glucose and make sure that each atom is present in your starting materials.");
				return;
			} else if (glucoseMade && carbDioxCounter > 6) {
				alert("The glucose machine can only use 6 CO2 at a time.");
				collectMolecules();
			} else if (glucoseMade) {
				collectMolecules();
			}
		}
	});
}

function releaseEnergyLoop2() {
	energyWheel.setLeft(747);
	energyWheel.setTop(473);
	energyWheel.setAngle(-90);
	canvasModel.add(energyWheel);
	var energyCarrierFULL2 = getEnergyCarrierFULL(2);
	canvasModel.add(energyCarrierFULL2);
	energyCarrierFULL2.animate({left: 699, top: 193, angle: 0}, {
		duration: 700,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	var hydrogenInputAtom5 = getHydrogenInputAtom(5);
	canvasModel.add(hydrogenInputAtom5);
	hydrogenInputAtom5.animate({left: 555, top: 212}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	var hydrogenInputAtom6 = getHydrogenInputAtom(6);
	canvasModel.add(hydrogenInputAtom6);
	hydrogenInputAtom6.animate({left: 570, top: 212}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	var hydrogenInputAtom7 = getHydrogenInputAtom(7);
	canvasModel.add(hydrogenInputAtom7);
	hydrogenInputAtom7.animate({left: 585, top: 212}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	var hydrogenInputAtom8 = getHydrogenInputAtom(8);
	canvasModel.add(hydrogenInputAtom8);
	hydrogenInputAtom8.animate({left: 600, top: 212}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function() {
			resetForWaterLoop();
	//		collectMolecules ();
		}
	});
}


function releaseEnergyLoop3() {
	energyWheel.setLeft(747);
	energyWheel.setTop(473);
	energyWheel.setAngle(-90);
	canvasModel.add(energyWheel);
	var energyCarrierFULL3 = getEnergyCarrierFULL(3);
	canvasModel.add(energyCarrierFULL3);
	energyCarrierFULL3.animate({left: 734, top: 193, angle: 0}, {
		duration: 700,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	var hydrogenInputAtom9 = getHydrogenInputAtom(9);
	canvasModel.add(hydrogenInputAtom9);
	hydrogenInputAtom9.animate({left: 555, top: 232}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	var hydrogenInputAtom10 = getHydrogenInputAtom(10);
	canvasModel.add(hydrogenInputAtom10);
	hydrogenInputAtom10.animate({left: 570, top: 232}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	var hydrogenInputAtom11 = getHydrogenInputAtom(11);
	canvasModel.add(hydrogenInputAtom11);
	hydrogenInputAtom11.animate({left: 585, top: 232}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	var hydrogenInputAtom12 = getHydrogenInputAtom(12);
	canvasModel.add(hydrogenInputAtom12);
	hydrogenInputAtom12.animate({left: 600, top: 232}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function() {
			resetForWaterLoop();
	//		collectMolecules ();
		}
	});
}


function releaseEnergyLoop4() {
	energyWheel.setLeft(747);
	energyWheel.setTop(473);
	energyWheel.setAngle(-90);
	canvasModel.add(energyWheel);
	var energyCarrierFULL4 = getEnergyCarrierFULL(4);
	canvasModel.add(energyCarrierFULL4);
	energyCarrierFULL4.animate({left: 664, top: 253, angle: 0}, {
		duration: 700,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	var hydrogenInputAtom13 = getHydrogenInputAtom(13);
	canvasModel.add(hydrogenInputAtom13);
	hydrogenInputAtom13.animate({left: 555, top: 252}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	var hydrogenInputAtom14 = getHydrogenInputAtom(14);
	canvasModel.add(hydrogenInputAtom14);
	hydrogenInputAtom14.animate({left: 570, top: 252}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	var hydrogenInputAtom15 = getHydrogenInputAtom(15);
	canvasModel.add(hydrogenInputAtom15);
	hydrogenInputAtom15.animate({left: 585, top: 252}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	var hydrogenInputAtom16 = getHydrogenInputAtom(16);
	canvasModel.add(hydrogenInputAtom16);
	hydrogenInputAtom16.animate({left: 600, top: 252}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function() {
			resetForWaterLoop();
	//		collectMolecules ();
		}
	});
}


function releaseEnergyLoop5() {
	energyWheel.setLeft(747);
	energyWheel.setTop(473);
	energyWheel.setAngle(-90);
	canvasModel.add(energyWheel);
	var energyCarrierFULL5 = getEnergyCarrierFULL(5);
	canvasModel.add(energyCarrierFULL5);
	energyCarrierFULL5.animate({left: 699, top: 253, angle: 0}, {
		duration: 700,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	var hydrogenInputAtom17 = getHydrogenInputAtom(17);
	canvasModel.add(hydrogenInputAtom17);
	hydrogenInputAtom17.animate({left: 555, top: 272}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	var hydrogenInputAtom18 = getHydrogenInputAtom(18);
	canvasModel.add(hydrogenInputAtom18);
	hydrogenInputAtom18.animate({left: 570, top: 272}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	var hydrogenInputAtom19 = getHydrogenInputAtom(19);
	canvasModel.add(hydrogenInputAtom19);
	hydrogenInputAtom19.animate({left: 585, top: 272}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	var hydrogenInputAtom20 = getHydrogenInputAtom(20);
	canvasModel.add(hydrogenInputAtom20);
	hydrogenInputAtom20.animate({left: 600, top: 272}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function() {
			resetForWaterLoop();
	//		collectMolecules ();
		}
	});
}

function releaseEnergyLoop6() {
	energyWheel.setLeft(747);
	energyWheel.setTop(473);
	energyWheel.setAngle(-90);
	canvasModel.add(energyWheel);
	var energyCarrierFULL6 = getEnergyCarrierFULL(6);
	canvasModel.add(energyCarrierFULL6);
	energyCarrierFULL6.animate({left: 734, top: 253, angle: 0}, {
		duration: 700,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	var hydrogenInputAtom21 = getHydrogenInputAtom(21);
	canvasModel.add(hydrogenInputAtom21);
	hydrogenInputAtom21.animate({left: 555, top: 292}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	var hydrogenInputAtom22 = getHydrogenInputAtom(22);
	canvasModel.add(hydrogenInputAtom22);
	hydrogenInputAtom22.animate({left: 570, top: 292}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	var hydrogenInputAtom23 = getHydrogenInputAtom(23);
	canvasModel.add(hydrogenInputAtom23);
	hydrogenInputAtom23.animate({left: 585, top: 292}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	var hydrogenInputAtom24 = getHydrogenInputAtom(24);
	canvasModel.add(hydrogenInputAtom24);
	hydrogenInputAtom24.animate({left: 600, top: 292}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function() {
			resetForWaterLoop();
			glucoseMade = true;
		}
	});
}


function collectMolecules() {
	var carbonDioxide1 = getCO2(1);
	carbonDioxide1.animate({left: 579, top: 186}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function() {
			carbonDioxide1.setOpacity(0);
		}
	});
	var carbonDioxide2 = getCO2(2);
	carbonDioxide2.animate({left: 579, top: 206}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function() {
			carbonDioxide2.setOpacity(0);
		}
	});
	var carbonDioxide3 = getCO2(3);
	carbonDioxide3.animate({left: 579, top: 226}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function() {
			carbonDioxide3.setOpacity(0);
		}
	});
	var carbonDioxide4 = getCO2(4);
	carbonDioxide4.animate({left: 579, top: 246}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function() {
			carbonDioxide4.setOpacity(0);
		}
	});
	var carbonDioxide5 = getCO2(5);
	carbonDioxide5.animate({left: 579, top: 266}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function() {
			carbonDioxide5.setOpacity(0);
		}
	});
	var carbonDioxide6 = getCO2(6);
	carbonDioxide6.animate({left: 579, top: 286}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function() {
			carbonDioxide6.setOpacity(0);
		}
	});
	var hydrogenInputAtom1 = getHydrogenInputAtom(1);
	hydrogenInputAtom1.animate({left: 640, top: 192, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom2 = getHydrogenInputAtom(2);
	hydrogenInputAtom2.animate({left: 640, top: 192, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom3 = getHydrogenInputAtom(3);
	hydrogenInputAtom3.animate({left: 640, top: 192, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom4 = getHydrogenInputAtom(4);
	hydrogenInputAtom4.animate({left: 640, top: 192, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom5 = getHydrogenInputAtom(5);
	hydrogenInputAtom5.animate({left: 640, top: 212, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom6 = getHydrogenInputAtom(6);
	hydrogenInputAtom6.animate({left: 640, top: 212, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom7 = getHydrogenInputAtom(7);
	hydrogenInputAtom7.animate({left: 640, top: 212, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom8 = getHydrogenInputAtom(8);
	hydrogenInputAtom8.animate({left: 640, top: 212, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom9 = getHydrogenInputAtom(9);
	hydrogenInputAtom9.animate({left: 640, top: 232, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom10 = getHydrogenInputAtom(10);
	hydrogenInputAtom10.animate({left: 640, top: 232, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom11 = getHydrogenInputAtom(11);
	hydrogenInputAtom11.animate({left: 640, top: 232, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom12 = getHydrogenInputAtom(12);
	hydrogenInputAtom12.animate({left: 640, top: 232, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom13 = getHydrogenInputAtom(13);
	hydrogenInputAtom13.animate({left: 640, top: 252, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom14 = getHydrogenInputAtom(14);
	hydrogenInputAtom14.animate({left: 640, top: 252, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom15 = getHydrogenInputAtom(15);
	hydrogenInputAtom15.animate({left: 640, top: 252, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom16 = getHydrogenInputAtom(16);
	hydrogenInputAtom16.animate({left: 640, top: 252, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom17 = getHydrogenInputAtom(17);
	hydrogenInputAtom17.animate({left: 640, top: 272, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom18 = getHydrogenInputAtom(18);
	hydrogenInputAtom18.animate({left: 640, top: 272, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom19 = getHydrogenInputAtom(19);
	hydrogenInputAtom19.animate({left: 640, top: 272, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom20 = getHydrogenInputAtom(20);
	hydrogenInputAtom20.animate({left: 640, top: 272, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom21 = getHydrogenInputAtom(21);
	hydrogenInputAtom21.animate({left: 640, top: 292, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom22 = getHydrogenInputAtom(22);
	hydrogenInputAtom22.animate({left: 640, top: 292, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom23 = getHydrogenInputAtom(23);
	hydrogenInputAtom23.animate({left: 640, top: 292, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var hydrogenInputAtom24 = getHydrogenInputAtom(24);
	hydrogenInputAtom24.animate({left: 640, top: 292, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),

		onComplete: function () {
			makeGroup();
		}
	});
}

var moleculesGroup;

function makeGroup() {
	var hydrogenInputAtom1 = getHydrogenInputAtom(1);
	var hydrogenInputAtom2 = getHydrogenInputAtom(2);
	var hydrogenInputAtom3 = getHydrogenInputAtom(3);
	var hydrogenInputAtom4 = getHydrogenInputAtom(4);
	var hydrogenInputAtom5 = getHydrogenInputAtom(5);
	var hydrogenInputAtom6 = getHydrogenInputAtom(6);
	var hydrogenInputAtom7 = getHydrogenInputAtom(7);
	var hydrogenInputAtom8 = getHydrogenInputAtom(8);
	var hydrogenInputAtom9 = getHydrogenInputAtom(9);
	var hydrogenInputAtom10 = getHydrogenInputAtom(10);
	var hydrogenInputAtom11 = getHydrogenInputAtom(11);
	var hydrogenInputAtom12 = getHydrogenInputAtom(12);
	var hydrogenInputAtom13 = getHydrogenInputAtom(13);
	var hydrogenInputAtom14 = getHydrogenInputAtom(14);
	var hydrogenInputAtom15 = getHydrogenInputAtom(15);
	var hydrogenInputAtom16 = getHydrogenInputAtom(16);
	var hydrogenInputAtom17 = getHydrogenInputAtom(17);
	var hydrogenInputAtom18 = getHydrogenInputAtom(18);
	var hydrogenInputAtom19 = getHydrogenInputAtom(19);
	var hydrogenInputAtom20 = getHydrogenInputAtom(20);
	var hydrogenInputAtom21 = getHydrogenInputAtom(21);
	var hydrogenInputAtom22 = getHydrogenInputAtom(22);
	var hydrogenInputAtom23 = getHydrogenInputAtom(23);
	var hydrogenInputAtom24 = getHydrogenInputAtom(24);
	var carbonDioxide1 = getCO2(1);
	var carbonDioxide2 = getCO2(2);
	var carbonDioxide3 = getCO2(3);
	var carbonDioxide4 = getCO2(4);
	var carbonDioxide5 = getCO2(5);
	var carbonDioxide6 = getCO2(6);
	var energyCarrierFULL1 = getEnergyCarrierFULL(1);
	var energyCarrierFULL2 = getEnergyCarrierFULL(2);
	var energyCarrierFULL3 = getEnergyCarrierFULL(3);
	var energyCarrierFULL4 = getEnergyCarrierFULL(4);
	var energyCarrierFULL5 = getEnergyCarrierFULL(5);
	var energyCarrierFULL6 = getEnergyCarrierFULL(6);
	 moleculesGroup = new fabric.Group([hydrogenInputAtom1, hydrogenInputAtom2, hydrogenInputAtom3, hydrogenInputAtom4,
		hydrogenInputAtom5, hydrogenInputAtom6, hydrogenInputAtom7, hydrogenInputAtom8,
		hydrogenInputAtom9, hydrogenInputAtom10, hydrogenInputAtom11, hydrogenInputAtom12,
		hydrogenInputAtom13, hydrogenInputAtom14, hydrogenInputAtom15, hydrogenInputAtom16,
		hydrogenInputAtom17, hydrogenInputAtom18, hydrogenInputAtom19, hydrogenInputAtom20,
		hydrogenInputAtom21, hydrogenInputAtom22, hydrogenInputAtom23, hydrogenInputAtom24,
		carbonDioxide1, carbonDioxide2, carbonDioxide3, carbonDioxide4, carbonDioxide5, carbonDioxide6,
		energyCarrierFULL1, energyCarrierFULL2, energyCarrierFULL3, energyCarrierFULL4,
		energyCarrierFULL5, energyCarrierFULL6
	]);
	canvasModel.add(moleculesGroup);
	canvasModel.remove(hydrogenInputAtom1);
	canvasModel.remove(hydrogenInputAtom2);
	canvasModel.remove(hydrogenInputAtom3);
	canvasModel.remove(hydrogenInputAtom4);
	canvasModel.remove(hydrogenInputAtom5);
	canvasModel.remove(hydrogenInputAtom6);
	canvasModel.remove(hydrogenInputAtom7);
	canvasModel.remove(hydrogenInputAtom8);
	canvasModel.remove(hydrogenInputAtom9);
	canvasModel.remove(hydrogenInputAtom10);
	canvasModel.remove(hydrogenInputAtom11);
	canvasModel.remove(hydrogenInputAtom12);
	canvasModel.remove(hydrogenInputAtom13);
	canvasModel.remove(hydrogenInputAtom14);
	canvasModel.remove(hydrogenInputAtom15);
	canvasModel.remove(hydrogenInputAtom16);
	canvasModel.remove(hydrogenInputAtom17);
	canvasModel.remove(hydrogenInputAtom18);
	canvasModel.remove(hydrogenInputAtom19);
	canvasModel.remove(hydrogenInputAtom20);
	canvasModel.remove(hydrogenInputAtom21);
	canvasModel.remove(hydrogenInputAtom22);
	canvasModel.remove(hydrogenInputAtom23);
	canvasModel.remove(hydrogenInputAtom24);
	canvasModel.remove(carbonDioxide1);
	canvasModel.remove(carbonDioxide2);
	canvasModel.remove(carbonDioxide3);
	canvasModel.remove(carbonDioxide4);
	canvasModel.remove(carbonDioxide5);
	canvasModel.remove(carbonDioxide6);
	canvasModel.remove(energyCarrierFULL1);
	canvasModel.remove(energyCarrierFULL2);
	canvasModel.remove(energyCarrierFULL3);
	canvasModel.remove(energyCarrierFULL4);
	canvasModel.remove(energyCarrierFULL5);
	canvasModel.remove(energyCarrierFULL6);
	if (carbDioxCounter < 6) {
		alert("The reaction could not finish, because you do not have all the necessary starting materials. Look at the chemical formula for glucose and make sure that each atom is present in your starting materials.");
		return;
	} else {
		makeGlucose();
	}
}

// Phase 4 Objects
var glucose = null;
fabric.Image.fromURL('./glucose.png', function(img){
	img.scale(0.15);
	img.setLeft(736);
	img.setTop(165);
	img.setOpacity(0);
	glucose = img;
});

var outputH2O = {};
var emptyOutputEnergyCarrier = {};

function makeOutputH2O(id, scale, left, top, opacity) {
	fabric.Image.fromURL('./water.png', function(img){
		img.scale(scale);
		img.setLeft(left);
		img.setTop(top);
		img.setOpacity(opacity);
		outputH2O[id] = img;
	});
}

function makeEmptyOutputEnergyCarrier(id, scale, left, top) {
	fabric.Image.fromURL('./energyCarrierEmpty.png', function(img){
		img.scale(scale);
		img.setLeft(left);
		img.setTop(top);
		emptyOutputEnergyCarrier[id] = img;
	});
}

 function initializeOutputH2O() {
	 makeOutputH2O(1, 0.6, 760, 230, 0);
	 makeOutputH2O(2, 0.6, 760, 230, 0);
	 makeOutputH2O(3, 0.6, 760, 230, 0);
	 makeOutputH2O(4, 0.6, 760, 230, 0);
	 makeOutputH2O(5, 0.6, 760, 230, 0);
	 makeOutputH2O(6, 0.6, 760, 230, 0);
 }

 function initializeEmptyOutputEnergyCarrier() {
 	makeEmptyOutputEnergyCarrier(1, 0.15, 664, 193);
 	makeEmptyOutputEnergyCarrier(2, 0.15, 699, 193);
 	makeEmptyOutputEnergyCarrier(3, 0.15, 734, 193);
 	makeEmptyOutputEnergyCarrier(4, 0.15, 664, 253);
 	makeEmptyOutputEnergyCarrier(5, 0.15, 699, 253);
 	makeEmptyOutputEnergyCarrier(6, 0.15, 734, 253);
 }

function getOutputH2O(id) {
	return outputH2O[id];
}

function getEmptyOutputEnergyCarrier(id) {
	return emptyOutputEnergyCarrier[id];
}
function initializePhase4Objects () {
	initializeOutputH2O();
	initializeEmptyOutputEnergyCarrier();
}

initializePhase4Objects();

function makeGlucose() {
	canvasModel.remove(moleculesGroup);

	var emptyOutputEnergyCarrier1 = getEmptyOutputEnergyCarrier(1);
	canvasModel.add(emptyOutputEnergyCarrier1);
	var emptyOutputEnergyCarrier2 = getEmptyOutputEnergyCarrier(2);
	canvasModel.add(emptyOutputEnergyCarrier2);
	var emptyOutputEnergyCarrier3 = getEmptyOutputEnergyCarrier(3);
	canvasModel.add(emptyOutputEnergyCarrier3);
	var emptyOutputEnergyCarrier4 = getEmptyOutputEnergyCarrier(4);
	canvasModel.add(emptyOutputEnergyCarrier4);
	var emptyOutputEnergyCarrier5 = getEmptyOutputEnergyCarrier(5);
	canvasModel.add(emptyOutputEnergyCarrier5);
	var emptyOutputEnergyCarrier6 = getEmptyOutputEnergyCarrier(6);
	canvasModel.add(emptyOutputEnergyCarrier6);

	canvasModel.add(glucose);
	glucose.animate({left: 852, top: 165, opacity: 1}, {
		duration: 500,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});

	var outputH2O1 = getOutputH2O(1);
	canvasModel.add(outputH2O1);
	var outputH2O2 = getOutputH2O(2);
	canvasModel.add(outputH2O2);
	var outputH2O3 = getOutputH2O(3);
	canvasModel.add(outputH2O3);
	var outputH2O4 = getOutputH2O(4);
	canvasModel.add(outputH2O4);
	var outputH2O5 = getOutputH2O(5);
	canvasModel.add(outputH2O5);
	var outputH2O6 = getOutputH2O(6);
	canvasModel.add(outputH2O6);
	outputH2O1.animate({left: 790, top: 180, opacity: 1}, {
		duration: 500,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	outputH2O2.animate({left: 790, top: 205, opacity: 1}, {
		duration: 500,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	outputH2O3.animate({left: 790, top: 230, opacity: 1}, {
		duration: 500,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	outputH2O4.animate({left: 790, top: 255, opacity: 1}, {
		duration: 500,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	outputH2O5.animate({left: 790, top: 280, opacity: 1}, {
		duration: 500,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	outputH2O6.animate({left: 790, top: 305, opacity: 1}, {
		duration: 500,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function() {
			if (carbDioxCounter > 6) {
				alert("Although you successfully made a glucose molecule, there are extra CO2. Try to make glucose using the exact amount of starting materials.");
			} else {
				alert("CONGRATULATIONS! You made a glucose molecule using the exact amount of starting materials. Fill the blank in the equation with all the products that you made. Then, write the completed chemical formula in your notebook.");
				return;
			}
		}
	});
}

// *** Non-canvas Controls ***//

//	var i;
//	for (i=1; i<=3; i++) {
//		addWater ();
		//var addWaterTimer = setTimeOut(addWater, 5000);
	//if (i= 4) {
	//releaseEnergyLoop4 ();
	//resetForWaterLoop ();
	//}
	//if (i= 5) {
	//releaseEnergyLoop5 ();
	//resetForWaterLoop ();
	//}
	//if (i= 6) {
	//releaseEnergyLoop6 ();
	//resetForWaterLoop ();
	//collectMolecules ();
	//}
//	}
//	clearInterval(addWaterTimer);


//var stop = false;
//var stopBtn = document.getElementById('stop');
//var startBtn = document.getElementById("start");

//startBtn.onclick = function () {
//	addWater ()
//};

//	stopBtn.disabled = false;
//  	startBtn.disabled = true;

//abort: function () {
//					if (stop) {
  //   		  		 	startBtn.disabled = false;
	//					stopBtn.disabled = true;
	//				}
     //	  			return stop;
		//  		},

//function carbDioxCounter(val) {
  //  var CarbDioxCount = canvas.getActiveObject().id=OCO;
  //  var newCarbDioxCount = parseInt(CarbDioxCount,10) + val;

  //  if (newOCO < 0) {
  //      newOCO = 0;
  //  }
	//canvas.getActiveObject().value = newOCO;
    //return newOCO;


//function addCarbonDioxide() {draw.rect(150,30).x(430).y(150).radius(10).fill('yellow').stroke({width:2}).opacity(1).attr({
  //      'fill-opacity': 0
    //}).click(function() {
    //	fabric.Image.fromURL('./carbonDioxide.png', function(img){
	//		img.scale(0.6);
	//		img.setLeft(130);
	//		img.setTop(24);
	//		canvas.add(img)
      //  });
  //  });
//}


// code to log the specifications of an object in the Inspector Console as the object is moved/selected real-time
function logSpecifications(ctx){
      console.log('Left: ' + ctx.target.getLeft() + ' Top: ' + ctx.target.getTop() + ' Angle: ' + ctx.target.getAngle());
  }
canvasModel.on ({
      'object:selected': logSpecifications
  });
canvasControls.on ({
      'object:selected': logSpecifications
  });
// another way to set the canvas background image
//canvas.setBackgroundImage('./chloroplast.jpg', canvas.renderAll.bind(canvas));


// scale/zoom entire canvas
//canvas.setZoom();


//var path = new fabric.Path('M 0 0 L 200 100 L 170 110 z');
//path.set({ fill: 'red', stroke: 'green', opacity: 0.5 });
//canvasModel.add(path);

/*
	var makeshiftWaterLoopSeries1 = setTimeout(addWater, 2000);
	var addOxyCount1 = setTimeout (releaseOxy1, 15850);
	var makeshiftReleaseLoopSeries1 = setTimeout(releaseEnergyLoop1, 10700);
	var makeshiftRestLoopSeries1 = setTimeout(resetForWaterLoop, 16000);

	var makeshiftWaterLoopSeries2 = setTimeout(addWater, 19000);
	var addOxyCount2 = setTimeout (releaseOxy2, 32850);
	var makeshiftReleaseLoopSeries2 = setTimeout(releaseEnergyLoop2, 27700);
	var makeshiftResetLoopSeries = setTimeout(resetForWaterLoop, 33000);

	var makeshiftWaterLoopSeries3 = setTimeout(addWater, 36000);
	var addOxyCount3 = setTimeout (releaseOxy3, 49850);
	var makeshiftReleaseLoopSeries3 = setTimeout(releaseEnergyLoop3, 44700);
	var makeshiftResetLoopSeries3 = setTimeout(resetForWaterLoop, 50000);

	var makeshiftWaterLoopSeries4 = setTimeout(addWater, 53000);
	var addOxyCount4 = setTimeout (releaseOxy4, 66850);
	var makeshiftReleaseLoopSeries4 = setTimeout(releaseEnergyLoop4, 61700);
	var makeshiftResetLoopSeries4 = setTimeout(resetForWaterLoop, 67000);

	var makeshiftWaterLoopSeries5 = setTimeout(addWater, 70000);
	var addOxyCount5 = setTimeout (releaseOxy5, 83850);
	var makeshiftReleaseLoopSeries5 = setTimeout(releaseEnergyLoop5, 78700);
	var makeshiftResetLoopSeries5 = setTimeout(resetForWaterLoop, 84000);

	var makeshiftWaterLoopSeries6 = setTimeout(addWater, 87000);
	var addOxyCount6 = setTimeout (releaseOxy6, 100850);
	var makeshiftReleaseLoopSeries6 = setTimeout(releaseEnergyLoop6, 95700);

	var makeshiftMakeGlucose = setTimeout(makeGlucose, 100900); */

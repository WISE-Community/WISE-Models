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
	canvasModel.sendToBack(img);
	canvasModel.add(img);
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

canvasControls.add(new fabric.Line([0, 0, 0, 300], {
        left: 400,
        top: -5,
        stroke: 'black',
        strokeWidth: 6
    }));

//canvasControls.add(new fabric.Line([0, 0, 0, 300], {
//        left: 610,
//        top: -5,
//        stroke: 'black',
//        strokeWidth: 6
//    }));

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

var startButton = new fabric.Text('Click to Start', {
	fontSize: 32,
	fontFamily: 'calibri',
	fontWeight: 'bold',
	left: 710, 
	top: 5,
	textDecoration: 'underline'
	});
//canvasControls.add(startButton)

var carbDioxControl = null;
fabric.Image.fromURL('./carbonDioxide.png', function(img){
	img.scale(0.6);
	img.setAngle(22);
	img.setLeft(680);
	img.setTop(62);
	carbDioxControl = img;
	//canvasControls.add(img)
});


var carbonDioxide1 = null;
fabric.Image.fromURL('./carbonDioxide.png', function(img){
	img.scale(0.6);
	img.setLeft(325);
	img.setTop(20);
	img.setAngle(40);
	carbonDioxide1 = img;
	//canvasModel.add(carbonDioxide1);
});

var carbonDioxide2 = null;
fabric.Image.fromURL('./carbonDioxide.png', function(img){
	img.scale(0.6);
	img.setLeft(287);
	img.setTop(29);
	img.setAngle(40);
	carbonDioxide2 = img;
	//canvasModel.add(carbonDioxide2);
});

var carbonDioxide3 = null;
fabric.Image.fromURL('./carbonDioxide.png', function(img){
	img.scale(0.6);
	img.setLeft(298);
	img.setTop(77);
	img.setAngle(40);
	carbonDioxide3 = img;
});

var carbonDioxide4 = null;
fabric.Image.fromURL('./carbonDioxide.png', function(img){
	img.scale(0.6);
	img.setLeft(345);
	img.setTop(77);
	img.setAngle(40);
	carbonDioxide4 = img;
});

var carbonDioxide5 = null;
fabric.Image.fromURL('./carbonDioxide.png', function(img){
	img.scale(0.6);
	img.setLeft(387);
	img.setTop(85);
	img.setAngle(40);
	carbonDioxide5 = img;
});				
	
var carbonDioxide6 = null;
fabric.Image.fromURL('./carbonDioxide.png', function(img){
	img.scale(0.6);
	img.setLeft(386);
	img.setTop(55);
	img.setAngle(40);
	carbonDioxide6 = img;
});			

var startBtn = document.getElementById("start");

startBtn.onclick = function () {
	animationStart ();
};									

function animationStart () {

	addCarbonDioxide ();

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

	var makeshiftMakeGlucose = setTimeout(makeGlucose, 100900);
}


function addCarbonDioxide (){
	var carbDioxGroup = new fabric.Group([carbonDioxide1, carbonDioxide2, carbonDioxide3, carbonDioxide4, carbonDioxide5, carbonDioxide6]);
	canvasModel.add(carbDioxGroup);
	carbDioxGroup.animate({left: 355, top: 200, opacity: 0.5}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function (){
			canvasModel.remove(carbDioxGroup);
			carbonDioxide1.setLeft(405);
			carbonDioxide1.setTop(206);
			canvasModel.add(carbonDioxide1);
			carbonDioxide1.animate({left: 470, top: 186, angle: 0}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel)
				});		
			carbonDioxide2.setLeft(366);
			carbonDioxide2.setTop(214);
			canvasModel.add(carbonDioxide2);
			carbonDioxide2.animate({left: 470, top: 206, angle: 0}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel)
			});		
			carbonDioxide3.setLeft(378);
			carbonDioxide3.setTop(262);
			canvasModel.add(carbonDioxide3);
			carbonDioxide3.animate({left: 470, top: 226, angle: 0}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel),
			});		
			carbonDioxide4.setLeft(424);
			carbonDioxide4.setTop(262);
			canvasModel.add(carbonDioxide4);
			carbonDioxide4.animate({left: 470, top: 246, angle: 0}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel),
			});		
			carbonDioxide5.setLeft(467);
			carbonDioxide5.setTop(270);
			canvasModel.add(carbonDioxide5);
			carbonDioxide5.animate({left: 470, top: 266, angle: 0}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel),
			});		
			carbonDioxide6.setLeft(465);
			carbonDioxide6.setTop(234);
			canvasModel.add(carbonDioxide6);
			carbonDioxide6.animate({left: 470, top: 286, angle: 0}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel),
//				onComplete: function () {
//					addWater ();
//				}
			});				
		}		
	});
}
  	

var water1 = null;
fabric.Image.fromURL('./water.png', function(img){
	img.scale(0.6);
	//img.setLeft(340);
	//img.setTop(25);
	//img.setOpacity(0.5);
	water1 = img;
});

var water2 = null;
fabric.Image.fromURL('./water.png', function(img){
	img.scale(0.6);
	//img.setLeft(383);
	//img.setTop(35);
	//img.setOpacity(0.5);
	water2 = img;		
});	

function addWater (){
	water1.setLeft(340);
	water1.setTop(25);
	water1.setOpacity(1);
	water2.setLeft(383);
	water2.setTop(35);
	water2.setOpacity(1);
	var waterGroup = new fabric.Group([water1, water2]);
	canvasModel.add(waterGroup);
	canvasModel.remove(water1);
	canvasModel.remove(water2);
	waterGroup.animate({left: 355, top: 340}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function (){
			canvasModel.remove(waterGroup);
			water1.setLeft(355);
			water1.setTop(340);
			canvasModel.add(water1);
			water1.animate({left: 237, top: 552, angle: -42}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel)
			});	
			water2.setLeft(398);
			water2.setTop(350);
			canvasModel.add(water2);
			water2.animate({left: 430, top: 494, angle: -31}, {
				duration: 2000,
				onChange: canvasModel.renderAll.bind(canvasModel),
				onComplete: function () {
					addPhotons ();
				}
			});			
		}
	});	
}

var photon1 = null;
fabric.Image.fromURL('./photon.png', function(img){
	img.scale(0.35);
	img.setAngle(140);
	img.setLeft(32);
	img.setTop(29);
	photon1 = img;
});	

var photon2 = null;
fabric.Image.fromURL('./photon.png', function(img){
	img.scale(0.35);
	img.setAngle(140);
	img.setLeft(32);
	img.setTop(29);
	photon2 = img;
});

var oxygenAtom1 = null;
fabric.Image.fromURL('./oxygenAtom.png', function(img){
	img.scale(0.6);
	img.setLeft(252);
	img.setTop(533);
	oxygenAtom1 = img;
});

var hydrogenAtom1 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.scale(0.5);
	img.setLeft(254);
	img.setTop(556);
	hydrogenAtom1 = img;
	//canvasModel.add(hydrogenAtom1);
});

var hydrogenAtom2 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.scale(0.5);
	img.setLeft(272);
	img.setTop(534);
	hydrogenAtom2 = img;
});

var oxygenAtom2 = null;
fabric.Image.fromURL('./oxygenAtom.png', function(img){
	img.scale(0.6);
	img.setLeft(447);
	img.setTop(481);		
	oxygenAtom2 = img;
});

var hydrogenAtom3 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.scale(0.5);
	img.setLeft(442);
	img.setTop(497);
	hydrogenAtom3 = img;
});

var hydrogenAtom4 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.scale(0.5);
	img.setLeft(465);
	img.setTop(480);
	hydrogenAtom4 = img;
});

function addPhotons (){
	photon1.setLeft(32);
	photon1.setTop(29);
	photon1.setOpacity(1);
	canvasModel.add(photon1);
	photon1.animate({left: 238, top: 501}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		//easing: fabric.util.ease.easeInQuart,
		onComplete: function (){
			chlorophyll1.animate({left: 224, top: 508}, {
				duration: 500,
				onChange: canvasModel.renderAll.bind(canvasModel),
				easing: fabric.util.ease.easeInElastic,
				onComplete: function (){
					photon1.setOpacity(0);
					chlorophyll1.setLeft(204);
					chlorophyll1.setTop(505);
					water1.setOpacity(0);
					oxygenAtom1.setLeft(252);
					oxygenAtom1.setTop(533);
					oxygenAtom1.setOpacity(1);
					canvasModel.add(oxygenAtom1);
					oxygenAtom1.animate({left: 340, top: 503}, {
						duration: 1000,
						onChange: canvasModel.renderAll.bind(canvasModel)
					});
					hydrogenAtom1.setLeft(254);
					hydrogenAtom1.setTop(556);
					hydrogenAtom1.setOpacity(1);
					canvasModel.add(hydrogenAtom1);
					hydrogenAtom1.animate({left: 758, top: 522, opacity: 1}, {
						duration: 1000,
						onChange: canvasModel.renderAll.bind(canvasModel)
					});		
					hydrogenAtom2.setLeft(272);
					hydrogenAtom2.setTop(534);
					hydrogenAtom2.setOpacity(1);
					canvasModel.add(hydrogenAtom2);
					hydrogenAtom2.animate({left: 716, top: 521, opacity: 1}, {
						duration: 1000,
						onChange: canvasModel.renderAll.bind(canvasModel),
						onComplete: function (){
							water1.setLeft(340);
							water1.setTop(25);
						}
					});
				}
			});
		}	
	});
	photon2.setLeft(32);
	photon2.setTop(29);
	photon2.setOpacity(1);
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
					photon2.setOpacity(0);
					chlorophyll2.setLeft(412);
					chlorophyll2.setTop(435);
					water2.setOpacity(0);
					oxygenAtom2.setLeft(447);
					oxygenAtom2.setTop(481);
					oxygenAtom2.setOpacity(1);
					canvasModel.add(oxygenAtom2);
					oxygenAtom2.animate({left: 348, top: 505}, {
						duration: 1000,
						onChange: canvasModel.renderAll.bind(canvasModel)
					});
					hydrogenAtom3.setLeft(442);
					hydrogenAtom3.setTop(497);
					hydrogenAtom3.setOpacity(1);
					canvasModel.add(hydrogenAtom3);
					hydrogenAtom3.animate({left: 689, top: 501, opacity: 1}, {
						duration: 1000,
						onChange: canvasModel.renderAll.bind(canvasModel)
					});
					hydrogenAtom4.setLeft(465);
					hydrogenAtom4.setTop(480);
					hydrogenAtom4.setOpacity(1);
					canvasModel.add(hydrogenAtom4);
					hydrogenAtom4.animate({left: 678, top: 469, opacity: 1}, {
						duration: 1000,
						onChange: canvasModel.renderAll.bind(canvasModel),
						onComplete: function () {
							turnEnergyWheel ();
							makeOxy ();
						}
					});
				}	
			});
		}
	});
}					

var oxygenMolecule = null;
fabric.Image.fromURL('./oxygen.png', function(img){
	img.scale(0.55);
	img.setAngle(190);
	img.setLeft(363);
	img.setTop(528);
	oxygenMolecule = img;
});

var oxygenMolecule1 = null;
fabric.Image.fromURL('./oxygen.png', function(img){
	img.scale(0.55);
	img.setAngle(190);
	img.setLeft(30);
	img.setTop(135);
	oxygenMolecule1 = img;
});

function releaseOxy1 () {
	canvasModel.add(oxygenMolecule1);
}

var oxygenMolecule2 = null;
fabric.Image.fromURL('./oxygen.png', function(img){
	img.scale(0.55);
	img.setAngle(190);
	img.setLeft(30);
	img.setTop(162);
	oxygenMolecule2 = img;
});

function releaseOxy2 () {
	canvasModel.add(oxygenMolecule2);
}

var oxygenMolecule3 = null;
fabric.Image.fromURL('./oxygen.png', function(img){
	img.scale(0.55);
	img.setAngle(190);
	img.setLeft(30);
	img.setTop(189);
	oxygenMolecule3 = img;
});

function releaseOxy3 () {
	canvasModel.add(oxygenMolecule3);
}

var oxygenMolecule4 = null;
fabric.Image.fromURL('./oxygen.png', function(img){
	img.scale(0.55);
	img.setAngle(190);
	img.setLeft(30);
	img.setTop(216);
	oxygenMolecule4 = img;
});

function releaseOxy4 () {
	canvasModel.add(oxygenMolecule4);
}

var oxygenMolecule5 = null;
fabric.Image.fromURL('./oxygen.png', function(img){
	img.scale(0.55);
	img.setAngle(190);
	img.setLeft(30);
	img.setTop(243);
	oxygenMolecule5 = img;
});

function releaseOxy5 () {
	canvasModel.add(oxygenMolecule5);
}

var oxygenMolecule6 = null;
fabric.Image.fromURL('./oxygen.png', function(img){
	img.scale(0.55);
	img.setAngle(190);
	img.setLeft(30);
	img.setTop(270);
	oxygenMolecule6 = img;
});

function releaseOxy6 () {
	canvasModel.add(oxygenMolecule6);
}


function makeOxy () {
	water2.setLeft(383);
	water2.setTop(35);
	oxygenMolecule.setLeft(363);
	oxygenMolecule.setTop(528);
	oxygenMolecule.setOpacity(1);
	canvasModel.add(oxygenMolecule);
	canvasModel.remove(oxygenAtom1);
	canvasModel.remove(oxygenAtom2);
	oxygenMolecule.animate ({left: 345, top: 136}, {
		duration: 3000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function (){
			oxygenMolecule.animate ({left: 30, top: 135}, {
				duration: 3000,
				onChange: canvasModel.renderAll.bind(canvasModel),
				onComplete: function (){
					canvasModel.add(releasedGasText)
					oxygenMolecule.setOpacity(0);
				}
			});
		}
	});
}			

function turnEnergyWheel () {
	var energyWheelGroup = new fabric.Group([hydrogenAtom1, hydrogenAtom2, hydrogenAtom3, hydrogenAtom4, energyWheel], {originX: 'center', originY: 'center'});
	canvasModel.add(energyWheelGroup);
	canvasModel.remove(energyWheel);
	canvasModel.remove(hydrogenAtom1);
	canvasModel.remove(hydrogenAtom2);
	canvasModel.remove(hydrogenAtom3);
	canvasModel.remove(hydrogenAtom4);
	energyWheelGroup.animate({angle: -90}, {
		duration: 1000,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	energyCarrierEMPTY1.animate({left: 767, top: 395, angle: 90}, {
		duration: 1000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function (){
			energyCarrierEMPTY1.setOpacity(0);
			canvasModel.remove(energyWheelGroup);
		}
	});
}

var energyCarrierFULL1 = null;
fabric.Image.fromURL('./energyCarrierFULL.png', function(img){
	img.scale(0.15);
	img.setLeft(767);
	img.setTop(395);
	img.setAngle(90);
	energyCarrierFULL1 = img;
});	

var hydrogenAtom5 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(795);
	img.setTop(447);
	hydrogenAtom5 = img;
});

var hydrogenAtom6 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(795);
	img.setTop(487);
	hydrogenAtom6 = img;
});

var hydrogenAtom7 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(773);
	img.setTop(515);
	hydrogenAtom7 = img;
});
	
var hydrogenAtom8 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(743);
	img.setTop(526);
	hydrogenAtom8 = img;
});

	
// the hydrogens after the turn need to be hydrogrens 5-28; hydrogens 1-4 need to be reset
// the releaseEnergy function needs 6 versions one for each pair of waters 1-5678 2-9101112 3-12131415 4-16171819 5-2021222324 6-25262728
function releaseEnergyLoop1 () {
	energyWheel.setLeft(747);
	energyWheel.setTop(473);
	energyWheel.setAngle(-90);
	canvasModel.add(energyWheel);
	energyCarrierFULL1.setLeft(767);
	energyCarrierFULL1.setTop(395);
	canvasModel.add(energyCarrierFULL1);
	energyCarrierFULL1.animate({left: 664, top: 193, angle: 0}, {
		duration: 700,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	hydrogenAtom5.setLeft(795);
	hydrogenAtom5.setTop(447);
	canvasModel.add(hydrogenAtom5);
	hydrogenAtom5.animate({left: 555, top: 192}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	hydrogenAtom6.setLeft(795);
	hydrogenAtom6.setTop(487);
	canvasModel.add(hydrogenAtom6);
	hydrogenAtom6.animate({left: 570, top: 192}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	hydrogenAtom7.setLeft(773);
	hydrogenAtom7.setTop(515);
	canvasModel.add(hydrogenAtom7);
	hydrogenAtom7.animate({left: 585, top: 192}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	hydrogenAtom8.setLeft(743);
	hydrogenAtom8.setTop(526);
	canvasModel.add(hydrogenAtom8);
	hydrogenAtom8.animate({left: 600, top: 192}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel),
//		onComplete: function (){
//			resetForWaterLoop ();
	//		collectMolecules ();
//		}
	});	
}

var energyCarrierFULL2 = null;
fabric.Image.fromURL('./energyCarrierFULL.png', function(img){
	img.scale(0.15);
	img.setLeft(767);
	img.setTop(395);
	img.setAngle(90);
	energyCarrierFULL2 = img;
});	

var hydrogenAtom9 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(795);
	img.setTop(447);
	hydrogenAtom9 = img;
});

var hydrogenAtom10 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(795);
	img.setTop(487);
	hydrogenAtom10 = img;
});

var hydrogenAtom11 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(773);
	img.setTop(515);
	hydrogenAtom11 = img;
});
	
var hydrogenAtom12 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(743);
	img.setTop(526);
	hydrogenAtom12 = img;
});

function releaseEnergyLoop2 () {
	energyWheel.setLeft(747);
	energyWheel.setTop(473);
	energyWheel.setAngle(-90);
	canvasModel.add(energyWheel);
	energyCarrierFULL2.setLeft(767);
	energyCarrierFULL2.setTop(395);
	canvasModel.add(energyCarrierFULL2);
	energyCarrierFULL2.animate({left: 699, top: 193, angle: 0}, {
		duration: 700,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	canvasModel.add(hydrogenAtom9);
	hydrogenAtom9.animate({left: 555, top: 212}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	canvasModel.add(hydrogenAtom10);
	hydrogenAtom10.animate({left: 570, top: 212}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	canvasModel.add(hydrogenAtom11);
	hydrogenAtom11.animate({left: 585, top: 212}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	canvasModel.add(hydrogenAtom12);
	hydrogenAtom12.animate({left: 600, top: 212}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel),
	//	onComplete: function (){
	//		resetForWaterLoop ();
	//		collectMolecules ();
	//	}
	});	
}

var energyCarrierFULL3 = null;
fabric.Image.fromURL('./energyCarrierFULL.png', function(img){
	img.scale(0.15);
	img.setLeft(767);
	img.setTop(395);
	img.setAngle(90);
	energyCarrierFULL3 = img;
});	

var hydrogenAtom13 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(795);
	img.setTop(447);
	hydrogenAtom13 = img;
});

var hydrogenAtom14 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(795);
	img.setTop(487);
	hydrogenAtom14 = img;
});

var hydrogenAtom15 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(773);
	img.setTop(515);
	hydrogenAtom15 = img;
});
	
var hydrogenAtom16 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(743);
	img.setTop(526);
	hydrogenAtom16 = img;
});

function releaseEnergyLoop3 () {
	energyWheel.setLeft(747);
	energyWheel.setTop(473);
	energyWheel.setAngle(-90);
	canvasModel.add(energyWheel);
	energyCarrierFULL3.setLeft(767);
	energyCarrierFULL3.setTop(395);
	canvasModel.add(energyCarrierFULL3);
	energyCarrierFULL3.animate({left: 734, top: 193, angle: 0}, {
		duration: 700,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	canvasModel.add(hydrogenAtom13);
	hydrogenAtom13.animate({left: 555, top: 232}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	canvasModel.add(hydrogenAtom14);
	hydrogenAtom14.animate({left: 570, top: 232}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	canvasModel.add(hydrogenAtom15);
	hydrogenAtom15.animate({left: 585, top: 232}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	canvasModel.add(hydrogenAtom16);
	hydrogenAtom16.animate({left: 600, top: 232}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel),
	//	onComplete: function (){
	//		resetForWaterLoop ();
	//		collectMolecules ();
	//	}
	});	
}

// position the remaining hydrogens and full energy carriers

var energyCarrierFULL4 = null;
fabric.Image.fromURL('./energyCarrierFULL.png', function(img){
	img.scale(0.15);
	img.setLeft(767);
	img.setTop(395);
	img.setAngle(90);
	energyCarrierFULL4 = img;
});	

var hydrogenAtom17 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(795);
	img.setTop(447);
	hydrogenAtom17 = img;
});

var hydrogenAtom18 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(795);
	img.setTop(487);
	hydrogenAtom18 = img;
});

var hydrogenAtom19 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(773);
	img.setTop(515);
	hydrogenAtom19 = img;
});
	
var hydrogenAtom20 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(743);
	img.setTop(526);
	hydrogenAtom20 = img;
});

function releaseEnergyLoop4 () {
	energyWheel.setLeft(747);
	energyWheel.setTop(473);
	energyWheel.setAngle(-90);
	canvasModel.add(energyWheel);
	energyCarrierFULL4.setLeft(767);
	energyCarrierFULL4.setTop(395);
	canvasModel.add(energyCarrierFULL4);
	energyCarrierFULL4.animate({left: 664, top: 253, angle: 0}, {
		duration: 700,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	canvasModel.add(hydrogenAtom17);
	hydrogenAtom17.animate({left: 555, top: 252}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	canvasModel.add(hydrogenAtom18);
	hydrogenAtom18.animate({left: 570, top: 252}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	canvasModel.add(hydrogenAtom19);
	hydrogenAtom19.animate({left: 585, top: 252}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	canvasModel.add(hydrogenAtom20);
	hydrogenAtom20.animate({left: 600, top: 252}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel),
	//	onComplete: function (){
	//		resetForWaterLoop ();
	//		collectMolecules ();
	//	}
	});	
}

var energyCarrierFULL5 = null;
fabric.Image.fromURL('./energyCarrierFULL.png', function(img){
	img.scale(0.15);
	img.setLeft(767);
	img.setTop(395);
	img.setAngle(90);
	energyCarrierFULL5 = img;
});	

var hydrogenAtom21 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(795);
	img.setTop(447);
	hydrogenAtom21 = img;
});

var hydrogenAtom22 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(795);
	img.setTop(487);
	hydrogenAtom22 = img;
});

var hydrogenAtom23 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(773);
	img.setTop(515);
	hydrogenAtom23 = img;
});
	
var hydrogenAtom24 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(743);
	img.setTop(526);
	hydrogenAtom24 = img;
});

function releaseEnergyLoop5 () {
	energyWheel.setLeft(747);
	energyWheel.setTop(473);
	energyWheel.setAngle(-90);
	canvasModel.add(energyWheel);
	energyCarrierFULL5.setLeft(767);
	energyCarrierFULL5.setTop(395);
	canvasModel.add(energyCarrierFULL5);
	energyCarrierFULL5.animate({left: 699, top: 253, angle: 0}, {
		duration: 700,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	canvasModel.add(hydrogenAtom21);
	hydrogenAtom21.animate({left: 555, top: 272}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	canvasModel.add(hydrogenAtom22);
	hydrogenAtom22.animate({left: 570, top: 272}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	canvasModel.add(hydrogenAtom23);
	hydrogenAtom23.animate({left: 585, top: 272}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	canvasModel.add(hydrogenAtom24);
	hydrogenAtom24.animate({left: 600, top: 272}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel),
	//	onComplete: function (){
	//		resetForWaterLoop ();
	//		collectMolecules ();
	//	}
	});	
}

var energyCarrierFULL6 = null;
fabric.Image.fromURL('./energyCarrierFULL.png', function(img){
	img.scale(0.15);
	img.setLeft(767);
	img.setTop(395);
	img.setAngle(90);
	energyCarrierFULL6 = img;
});	

var hydrogenAtom25 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(795);
	img.setTop(447);
	hydrogenAtom25 = img;
});

var hydrogenAtom26 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(795);
	img.setTop(487);
	hydrogenAtom26 = img;
});

var hydrogenAtom27 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(773);
	img.setTop(515);
	hydrogenAtom27 = img;
});
	
var hydrogenAtom28 = null;
fabric.Image.fromURL('./hydrogen.png', function(img){
	img.setOpacity(1);
	img.scale(0.5);
	img.setLeft(743);
	img.setTop(526);
	hydrogenAtom28 = img;
});

function releaseEnergyLoop6 () {
	energyWheel.setLeft(747);
	energyWheel.setTop(473);
	energyWheel.setAngle(-90);
	canvasModel.add(energyWheel);
	energyCarrierFULL6.setLeft(767);
	energyCarrierFULL6.setTop(395);
	canvasModel.add(energyCarrierFULL6);
	energyCarrierFULL6.animate({left: 734, top: 253, angle: 0}, {
		duration: 700,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	canvasModel.add(hydrogenAtom25);
	hydrogenAtom25.animate({left: 555, top: 292}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	canvasModel.add(hydrogenAtom26);
	hydrogenAtom26.animate({left: 570, top: 292}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	canvasModel.add(hydrogenAtom27);
	hydrogenAtom27.animate({left: 585, top: 292}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	canvasModel.add(hydrogenAtom28);
	hydrogenAtom28.animate({left: 600, top: 292}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function (){
	//		resetForWaterLoop ();
			collectMolecules ();
		}
	});	
}

function resetForWaterLoop () {
	energyWheel.setLeft(747);
	energyWheel.setTop(473);
	energyWheel.setAngle(0);
	energyCarrierEMPTY1.setLeft(1100);
	energyCarrierEMPTY1.setTop(337);
	energyCarrierEMPTY1.setOpacity(1);
	energyCarrierEMPTY1.setAngle(90);
	energyCarrierEMPTY1.animate({left: 834, top: 460, angle: 153}, {
		duration: 2500,
		onChange: canvasModel.renderAll.bind(canvasModel)
	}); 
}
//	energyCarrierEMPTY2.setLeft(915);
//	energyCarrierEMPTY2.setTop(337);
//	energyCarrierEMPTY2.setOpacity(1);
//	energyCarrierEMPTY2.animate({left: 705, top: 378, angle: 2}, {
//		duration: 2500,
//		onChange: canvasModel.renderAll.bind(canvasModel),
//		onComplete: function (){
//			canvasModel.setActiveObject(membraneChannel);
//		}
//	});
//	water1.setLeft(340);
//	water1.setTop(25);
//	water2.setLeft(383);
//	water2.setTop(35);
//	photon1.setLeft(32);
//	photon1.setTop(29);
//	photon2.setLeft(32);
//	photon2.setTop(29);
//	hydrogenAtom1.setLeft(254);
//	hydrogenAtom1.setTop(556);
//	hydrogenAtom1.setOpacity(0);
//	hydrogenAtom2.setLeft(272);
//	hydrogenAtom2.setTop(534);
//	hydrogenAtom2.setOpacity(0);
//	hydrogenAtom3.setLeft(442);
//	hydrogenAtom3.setTop(497);
//	hydrogenAtom3.setOpacity(0);
//	hydrogenAtom4.setLeft(465);
//	hydrogenAtom4.setTop(480);
//	hydrogenAtom4.setOpacity(0);
//	oxygenAtom1.setLeft(252);
//	oxygenAtom1.setTop(533);
//	oxygenAtom1.setOpacity(0);
//	oxygenAtom2.setLeft(447);
//	oxygenAtom2.setTop(481);
//	oxygenAtom2.setOpacity(0);
	//reset original position of all remaining icons
	
//	membraneChannel.on('selected', collectMolecules)  
//}

// add remaining molecules to group

function collectMolecules () {
	carbonDioxide1.animate({left: 579, top: 186}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function () {
			carbonDioxide1.setOpacity(0);	
		}
	});
	
	carbonDioxide2.animate({left: 579, top: 206}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function () {
			carbonDioxide2.setOpacity(0);	
		}
	});
	
	carbonDioxide3.animate({left: 579, top: 226}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function () {
			carbonDioxide3.setOpacity(0);	
		}
	});
	
	carbonDioxide4.animate({left: 579, top: 246}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function () {
			carbonDioxide4.setOpacity(0);	
		}
	});
	
	carbonDioxide5.animate({left: 579, top: 266}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function () {
			carbonDioxide5.setOpacity(0);	
		}
	});
	
	carbonDioxide6.animate({left: 579, top: 286}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function () {
			carbonDioxide6.setOpacity(0);	
		}
	});
	
	hydrogenAtom5.animate({left: 640, top: 192, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom6.animate({left: 640, top: 192, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom7.animate({left: 640, top: 192, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom8.animate({left: 640, top: 192, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom9.animate({left: 640, top: 212, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom10.animate({left: 640, top: 212, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom11.animate({left: 640, top: 212, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom12.animate({left: 640, top: 212, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom13.animate({left: 640, top: 232, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom14.animate({left: 640, top: 232, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom15.animate({left: 640, top: 232, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom16.animate({left: 640, top: 232, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom17.animate({left: 640, top: 252, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom18.animate({left: 640, top: 252, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom19.animate({left: 640, top: 252, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom20.animate({left: 640, top: 252, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom21.animate({left: 640, top: 272, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom22.animate({left: 640, top: 272, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom23.animate({left: 640, top: 272, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom24.animate({left: 640, top: 272, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom25.animate({left: 640, top: 292, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom26.animate({left: 640, top: 292, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom27.animate({left: 640, top: 292, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	
	hydrogenAtom28.animate({left: 640, top: 292, opacity: 0}, {
		duration: 2000,
		onChange: canvasModel.renderAll.bind(canvasModel),
	
		onComplete: function () {
			makeGroup();
		}
	});
}

var moleculesGroup;

function makeGroup() {
	 moleculesGroup = new fabric.Group([hydrogenAtom5, hydrogenAtom6, hydrogenAtom7, hydrogenAtom8,
		hydrogenAtom9, hydrogenAtom10, hydrogenAtom11, hydrogenAtom12,
		hydrogenAtom13, hydrogenAtom14, hydrogenAtom15, hydrogenAtom16,
		hydrogenAtom17, hydrogenAtom18, hydrogenAtom19, hydrogenAtom20,
		hydrogenAtom21, hydrogenAtom22, hydrogenAtom23, hydrogenAtom24,
		hydrogenAtom25, hydrogenAtom26, hydrogenAtom27, hydrogenAtom28,
		carbonDioxide1, carbonDioxide2, carbonDioxide3, carbonDioxide4, carbonDioxide5, carbonDioxide6,
		energyCarrierFULL1, energyCarrierFULL2, energyCarrierFULL3, energyCarrierFULL4, 
		energyCarrierFULL5, energyCarrierFULL6
	]);
	canvasModel.add(moleculesGroup);
	canvasModel.remove(hydrogenAtom5);
	canvasModel.remove(hydrogenAtom6);
	canvasModel.remove(hydrogenAtom7);
	canvasModel.remove(hydrogenAtom8);
	canvasModel.remove(hydrogenAtom9);
	canvasModel.remove(hydrogenAtom10);
	canvasModel.remove(hydrogenAtom11);
	canvasModel.remove(hydrogenAtom12);
	canvasModel.remove(hydrogenAtom13);
	canvasModel.remove(hydrogenAtom14);
	canvasModel.remove(hydrogenAtom15);
	canvasModel.remove(hydrogenAtom16);
	canvasModel.remove(hydrogenAtom17);
	canvasModel.remove(hydrogenAtom18);
	canvasModel.remove(hydrogenAtom19);
	canvasModel.remove(hydrogenAtom20);
	canvasModel.remove(hydrogenAtom21);
	canvasModel.remove(hydrogenAtom22);
	canvasModel.remove(hydrogenAtom23);
	canvasModel.remove(hydrogenAtom24);
	canvasModel.remove(hydrogenAtom25);
	canvasModel.remove(hydrogenAtom26);
	canvasModel.remove(hydrogenAtom27);
	canvasModel.remove(hydrogenAtom28);
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
}
	
var glucose = null;
fabric.Image.fromURL('./glucose.png', function(img){
	img.scale(0.15);
	img.setLeft(736);
	img.setTop(165);
	img.setOpacity(0);
	glucose = img;
});

var water7 = null;
fabric.Image.fromURL('./water.png', function(img){
	img.scale(0.6);
	img.setLeft(760);
	img.setTop(230);
	img.setOpacity(0);
	water7 = img;	
		
});	

var water8 = null;
fabric.Image.fromURL('./water.png', function(img){
	img.scale(0.6);
	img.setLeft(760);
	img.setTop(230);
	img.setOpacity(0);
	water8 = img;
			
});	

var water9 = null;
fabric.Image.fromURL('./water.png', function(img){
	img.scale(0.6);
	img.setLeft(760);
	img.setTop(230);
	img.setOpacity(0);
	water9 = img;		
});

var water10 = null;
fabric.Image.fromURL('./water.png', function(img){
	img.scale(0.6);
	img.setLeft(760);
	img.setTop(230);
	img.setOpacity(0);
	water10 = img;		
});

var water11 = null;
fabric.Image.fromURL('./water.png', function(img){
	img.scale(0.6);
	img.setLeft(760);
	img.setTop(230);
	img.setOpacity(0);
	water11 = img;		
});

var water12 = null;
fabric.Image.fromURL('./water.png', function(img){
	img.scale(0.6);
	img.setLeft(760);
	img.setTop(230);
	img.setOpacity(0);
	water12 = img;		
});

var energyCarrierEMPTY7 = null;
fabric.Image.fromURL('./energyCarrierEmpty.png', function(img){
	img.scale(0.15);
	img.setLeft(664);
	img.setTop(193);
	energyCarrierEMPTY7 = img;
});

var energyCarrierEMPTY8 = null;
fabric.Image.fromURL('./energyCarrierEmpty.png', function(img){
	img.scale(0.15);
	img.setLeft(699);
	img.setTop(193);
	energyCarrierEMPTY8 = img;
});

var energyCarrierEMPTY9 = null;
fabric.Image.fromURL('./energyCarrierEmpty.png', function(img){
	img.scale(0.15);
	img.setLeft(734);
	img.setTop(193);
	energyCarrierEMPTY9 = img;
});

var energyCarrierEMPTY10 = null;
fabric.Image.fromURL('./energyCarrierEmpty.png', function(img){
	img.scale(0.15);
	img.setLeft(664);
	img.setTop(253);
	energyCarrierEMPTY10 = img;
});

var energyCarrierEMPTY11 = null;
fabric.Image.fromURL('./energyCarrierEmpty.png', function(img){
	img.scale(0.15);
	img.setLeft(699);
	img.setTop(253);
	energyCarrierEMPTY11 = img;
});

var energyCarrierEMPTY12 = null;
fabric.Image.fromURL('./energyCarrierEmpty.png', function(img){
	img.scale(0.15);
	img.setLeft(734);
	img.setTop(253);
	energyCarrierEMPTY12 = img;
});

function makeGlucose () {
	canvasModel.remove(moleculesGroup);
	canvasModel.add(energyCarrierEMPTY7);
	canvasModel.add(energyCarrierEMPTY8);
	canvasModel.add(energyCarrierEMPTY9);
	canvasModel.add(energyCarrierEMPTY10);
	canvasModel.add(energyCarrierEMPTY11);
	canvasModel.add(energyCarrierEMPTY12);

	canvasModel.add(glucose);
	glucose.animate({left: 852, top: 165, opacity: 1}, {
		duration: 500,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	canvasModel.add(water7);
	canvasModel.add(water8);
	canvasModel.add(water9);
	canvasModel.add(water10);
	canvasModel.add(water11);
	canvasModel.add(water12);
	water7.animate({left: 790, top: 180, opacity: 1}, {
		duration: 500,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	water8.animate({left: 790, top: 205, opacity: 1}, {
		duration: 500,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	water9.animate({left: 790, top: 230, opacity: 1}, {
		duration: 500,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	water10.animate({left: 790, top: 255, opacity: 1}, {
		duration: 500,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	water11.animate({left: 790, top: 280, opacity: 1}, {
		duration: 500,
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	water12.animate({left: 790, top: 305, opacity: 1}, {
		duration: 500,
		onChange: canvasModel.renderAll.bind(canvasModel),
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

// another way to set the canvas background image
//canvas.setBackgroundImage('./chloroplast.jpg', canvas.renderAll.bind(canvas));


// scale/zoom entire canvas
//canvas.setZoom();


//var path = new fabric.Path('M 0 0 L 200 100 L 170 110 z');
//path.set({ fill: 'red', stroke: 'green', opacity: 0.5 });
//canvasModel.add(path);
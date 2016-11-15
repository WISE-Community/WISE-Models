
// Global variables

// the SVG.js draw object
var draw = null;

// the start/pause/resume button elements
var startButtonRect = null;
var startButtonText = null;

// the turn light on button elements
var lightOnButtonRect = null;
var lightOnButtonText = null;

// the turn light off button elements
var lightOffButtonRect = null;
var lightOffButtonText = null;

// the reset button elements
var resetButtonRect = null;
var resetButtonText = null;

// the plant died message elements
var plantDiedRect = null;
var plantDiedText = null;

//What feedback policy to use - options are defined experiments (currently, 2a and 2b)
/// default, or none (null works here too, indicating none).
var feedbackPolicy = "experiment2a";

//elements for displaying a feedback message
var feedbackRect = null;
var feedbackText = [];
var feedbackShowing = false;
var feedbackInstructions = ["Click start again to start your new trial."];
var feedbackMessageNeverTurnsLightOff = ["You've never run the simulation with the","light off. Try experimenting with turning ", "the light off during a simulation to see", "what happens."];
var feedbackMessageOnlyShortTrials = ["All of your trials have been very short.", "Try letting the simulation run", "for more time."];
var feedbackMessagePlantNeverDied = ["You've run several trials, but never","seen what makes the plant die.", "See if you can make a simulation", "where the plant dies."];
var feedbackMessageLongTrialRunningTime = ["You've been running simulations for a","long time. Are you still gaining information", "as you run more trials?"];
var feedbackMessageMoveOnOrAsk = ["You've already collected enough information","from the simulation. Keep working through","the questions and other steps. If","you're stuck, ask your teacher for help."];
var feedbackMessageDoFourWeeksOnTrial = ["Now that you've experimented with the ", "simulation a bit, try turning the light on for ", "four weeks and then turning it off. Watch ", "what happens to the plant and to the","glucose levels."];

//Tracking variables for whether the trial is an appropriate one to consider feedback
var minTrialsBeforeFeedback = 2;
var intervalBetweenFeedbackTrials = 2;
var lastFeedbackTrial = -1;

//Variables relevant for what feedback to give - these
//could be recalculated by going through trials, but it seemed
//reasonable to cache as we go
var trialWithLightOffOccurred = false;
var longestTrial = 0;
var totalWeeksRun = 0;//How many weeks of trial data have been recorded across all simulations
var plantHasEverDied = false;
var shortTrialCutoff = 2000;
var weeksRunCutoff = 60;//After the student has run the simulation for at least this number of weeks, the feedback message prompts her to consider whether she's still learning.

//Tried to do this all with maps but got error on construction or error when actually setting key-values, so went back to objects
var policySpecificFeedbackInfo = {templateMatches: {}}; //object for storing information for feedback that may be relevant only to a single feedback policy
//Templates we care about - trials that are matches will be stored in policySpecificFeedbackInfo under templateMatches
var templatesByFeedbackPolicy ={experiment2b: [[-1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]}
var templateNamesByFeedbackPolicy ={experiment2b:["fourWeeksOn"]};

// the simulation ended message elements
var simulationEndedRect = null;
var simulationEndedText = null;

// whether the simulation is currently running or not
var running = false;

// whether the light is on
var lightOn = true;

// array that holds the photon image objects
var photons = [];

/*
 * array that holds the leaf groups (a leaf group consists of a leaf image,
 * and two glucose images)
 */
var leafGroups = [];

// array that holds the carrot image objects
var carrots = [];

// the image of the light bulb on (yellow)
var lightBulbOn = null;

// the image of the light bulb off (grey)
var lightBulbOff = null;

// whether to turn the light on when the start or resume button is clicked
var turnLightOnWhenStart = true;

// whether the photons should be displayed
var photonsEnabled = false;

/*
* the id of the set interval function. this is used to turn off the set 
* interval function.
*/
var intervalId = null;

// the current week number
var weekNumber = 0;

// the max number of weeks
var maxWeeks = 20;

/*
* the glucose index used to determine how many leaves to display and what stage
* of the carrot to display. whenever the light is turned on for a week, the
* glucose index will increment by 1. whenever the ligth is turned off for a 
* week, the glucose index will decrement by 1.
*/
var glucoseIndex = 0;

// the maximum amount of glucose the plant can make
var maxGlucose = 200;

// the current amount of glucose
var glucoseCreated = 0;
var glucoseUsed = 0;
var glucoseStored = 0;

// the starting glucose amounts
var initialGlucoseCreated = 10;
var initialGlucoseUsed = 2;
var initialGlucoseStored = 8;

// the amount of glucose to add or subtract each week
var glucoseCreatedIncrement = 10;
var glucoseUsedIncrement = 5;

// the data points for the glucose lines
var glucoseCreatedData = [];
var glucoseUsedData = [];
var glucoseStoredData = [];

// whether the buttons are currently enabled
var startButtonEnabled = true;
var turnLightOffButtonEnabled = true;
var turnLightOnButtonEnabled = false;
var resetButtonEnabled = false;

// the trial data consisting of the events and data points for the 3 lines
var trialData = null;

/*
* whether the trial data is a new trial so we can determine whether we need
* add the trial data to the trials array or not.
*/
var isNewTrial = true;

// an array of trial data objects
var trials = [];

// the WISE API object used for saving data to WISE4
var wiseAPI = null;

// the WISE webapp object in WISE4
var wiseWebAppObj = null;

// flag for whether we are using the model in WISE4
var wise4 = false;

// flag for whether we are using the model in WISE5
var wise5 = false;

/*
 * flag for whether the simulation has ended. the simulation ends when the plant
 * dies or the time ends.
 */
var simulationEnded = false;

// work from other components in this node
var studentWorkFromThisNode = null;

// work from other components
var studentWorkFromOtherComponents = null;

/**
 * Initialize the model
 */
function init() {
    
    // check if the model is being used in WISE4
    if (window.parent != null && window.parent.wiseAPI != null) {
        /*
         * the wiseAPI object is in the parent which means this model is being
         * used in WISE4
         */
        wise4 = true;
        
        // obtain the WISE API and webApp object
        wiseAPI = window.parent.wiseAPI();
        wiseWebAppObj = window.parent.webApp;
    }
    
    // check if the model is being used in WISE5
    if (window.frameElement != null) {
        var iframeId = window.frameElement.getAttribute('id');
    
        if (iframeId != null && iframeId.indexOf('componentApp') != -1) {
            /*
             * the iframe id is something like 'componentApp_kcb5ikb3wl' which means
             * this model is being used in WISE5
             */
            wise5 = true;
        }
    }
    
    if (wise5) {
        getStudentWork();
    }
    
    // initialize the trial data
    initializeTrialData();
    
    // initialize the graph
    initializeGraph();
    
    if (parent != null && parent.node != null) {
        /*
         * set the trials array into the parent node if it exists. this is
         * used for saving student data when the model is used in WISE4
         * where the external script is used for saving.
         */
        parent.node.trials = trials;
    }
    
    // initialize the glucose values
    glucoseCreated = initialGlucoseCreated;
    glucoseUsed = initialGlucoseUsed;
    glucoseStored = initialGlucoseStored;
    
    // create the SVG.js draw object
    draw = SVG('model');
    
    // create the background
    createBackground();
    
    // create the darkness overlay that displays when the light is turned off
    createDarknessOverlay();
    
    // create the light bulbs
    createLightBulbs();
    
    // create the leaves
    createLeaves();
    
    // create the carrots
    createCarrots();

    // create the buttons
    createButtons();

    // create the plant died message
    createPlantDiedMessage();
    
    // create the feedback box - message gets set when feedback is triggered
    createFeedbackRectangle();
    
    // create the simulation ended message
    createSimulationEndedMessage();
}

/**
 * Create the background
 */
function createBackground() {
    background = draw.image('./bg.png', 600, 800);
}

/**
 * Create the darkness overlay that displays when the light is turned off
 */
function createDarknessOverlay() {
    
    /*
     * draw the darkness overlay and move it back in z position so that it is
     * behind the plant and carrot
     */
    darknessOverlay = draw.rect(600, 800).attr({
        'fill-opacity': 0
    }).back();
}

/**
 * Create the light on and off light bulbs
 */
function createLightBulbs() {
    // the light bulb on
    lightBulbOn = draw.image('./lightbulb20001.png', 40, 70);
    lightBulbOn.rotate(150);
    
    // the light bulb off
    lightBulbOff = draw.image('./lightbulb20002.png', 40, 70);
    lightBulbOff.rotate(150);
    lightBulbOff.hide();
}

/**
 * Create the leaves
 */
function createLeaves() {
    
    var leaf1 = draw.image('./leaf1_0.png').attr({
        'x': 150,
        'y': 270,
        'opacity': 0
    });
    
    var leaf1Glucose1 = draw.image('./glucose.png', 20, 20).attr({
        'x': 250,
        'y': 335,
        'opacity': 0
    });
    
    var leaf1Glucose2 = draw.image('./glucose.png', 20, 20).attr({
        'x': 260,
        'y': 290,
        'opacity': 0
    });
    
    var leafGroup1 = {
        leaf: leaf1,
        glucose1: leaf1Glucose1,
        glucose2: leaf1Glucose2
    };
    
    var leaf2 = draw.image('./leaf2_0.png').attr({
        'x': 310,
        'y': 285,
        'opacity': 1
    });
    
    var leaf2Glucose1 = draw.image('./glucose.png', 20, 20).attr({
        'x': 350,
        'y': 310,
        'opacity': 1
    });
    
    var leaf2Glucose2 = draw.image('./glucose.png', 20, 20).attr({
        'x': 380,
        'y': 340,
        'opacity': 0
    });
    
    var leafGroup2 = {
        leaf: leaf2,
        glucose1: leaf2Glucose1,
        glucose2: leaf2Glucose2
    };
    
    var leaf10 = draw.image('./leaf10_0.png', 150).attr({
        'x': 170,
        'y': 200,
        'opacity': 0
    });
    
    var leaf10Glucose1 = draw.image('./glucose.png', 20, 20).attr({
        'x': 220,
        'y': 300,
        'opacity': 0
    });
    
    var leaf10Glucose2 = draw.image('./glucose.png', 20, 20).attr({
        'x': 250,
        'y': 280,
        'opacity': 0
    });
    
    var leafGroup10 = {
        leaf: leaf10,
        glucose1: leaf10Glucose1,
        glucose2: leaf10Glucose2
    };
    
    var leaf3 = draw.image('./leaf3_0.png').attr({
        'x': 155,
        'y': 200,
        'opacity': 0
    });
    
    var leaf3Glucose1 = draw.image('./glucose.png', 20, 20).attr({
        'x': 240,
        'y': 260,
        'opacity': 0
    });
    
    var leaf3Glucose2 = draw.image('./glucose.png', 20, 20).attr({
        'x': 280,
        'y': 220,
        'opacity': 0
    });
    
    var leafGroup3 = {
        leaf: leaf3,
        glucose1: leaf3Glucose1,
        glucose2: leaf3Glucose2
    };
    
    var leaf4 = draw.image('./leaf4_0.png').attr({
        'x': 310,
        'y': 235,
        'opacity': 0
    });
    
    var leaf4Glucose1 = draw.image('./glucose.png', 20, 20).attr({
        'x': 360,
        'y': 280,
        'opacity': 0
    });
    
    var leaf4Glucose2 = draw.image('./glucose.png', 20, 20).attr({
        'x': 380,
        'y': 240,
        'opacity': 0
    });
    
    var leafGroup4 = {
        leaf: leaf4,
        glucose1: leaf4Glucose1,
        glucose2: leaf4Glucose2
    };
    
    var leaf5 = draw.image('./leaf5_0.png').attr({
        'x': 180,
        'y': 130,
        'opacity': 0
    });
    
    var leaf5Glucose1 = draw.image('./glucose.png', 20, 20).attr({
        'x': 250,
        'y': 210,
        'opacity': 0
    });
    
    var leaf5Glucose2 = draw.image('./glucose.png', 20, 20).attr({
        'x': 260,
        'y': 170,
        'opacity': 0
    });
    
    var leafGroup5 = {
        leaf: leaf5,
        glucose1: leaf5Glucose1,
        glucose2: leaf5Glucose2
    };
    
    var leaf6 = draw.image('./leaf6_0.png').attr({
        'x': 300,
        'y': 200,
        'opacity': 0
    });
    
    var leaf6Glucose1 = draw.image('./glucose.png', 20, 20).attr({
        'x': 330,
        'y': 250,
        'opacity': 0
    });
    
    var leaf6Glucose2 = draw.image('./glucose.png', 20, 20).attr({
        'x': 340,
        'y': 210,
        'opacity': 0
    });
    
    var leafGroup6 = {
        leaf: leaf6,
        glucose1: leaf6Glucose1,
        glucose2: leaf6Glucose2
    };
    
    var leaf8 = draw.image('./leaf8_0.png', 170).attr({
        'x': 260,
        'y': 110,
        'opacity': 0
    });
    
    var leaf8Glucose1 = draw.image('./glucose.png', 20, 20).attr({
        'x': 320,
        'y': 200,
        'opacity': 0
    });
    
    var leaf8Glucose2 = draw.image('./glucose.png', 20, 20).attr({
        'x': 370,
        'y': 200,
        'opacity': 0
    });
    
    var leafGroup8 = {
        leaf: leaf8,
        glucose1: leaf8Glucose1,
        glucose2: leaf8Glucose2
    };
    
    // var leaf7 = draw.image('./leaf7.png').attr({
    //   'x': 200,
    //   'y': 80
    // });
    
    var leaf9 = draw.image('./leaf9_0.png', 250).attr({
        'x': 210,
        'y': 30,
        'opacity': 0
    });
    
    var leaf9Glucose1 = draw.image('./glucose.png', 20, 20).attr({
        'x': 300,
        'y': 130,
        'opacity': 0
    });
    
    var leaf9Glucose2 = draw.image('./glucose.png', 20, 20).attr({
        'x': 340,
        'y': 110,
        'opacity': 0
    });
    
    var leafGroup9 = {
        leaf: leaf9,
        glucose1: leaf9Glucose1,
        glucose2: leaf9Glucose2
    };
    
    // an array of leaf groups. each group contains a leaf and two glucose.
    leafGroups = [
        leafGroup2,
        leafGroup1,
        leafGroup3,
        leafGroup4,
        leafGroup6,
        leafGroup5,
        leafGroup9,
        leafGroup8,
        leafGroup10
    ];
    
    // show the first leaf with one glucose
    initializeLeaves();
}

/**
 * Remove all the leaves and glucose
 */
function removeLeaves() {
    
    // loop through all the leaf groups
    for (var l = 0; l < leafGroups.length; l++) {
        var leafGroup = leafGroups[l];
        
        if (leafGroup != null) {
            var leaf = leafGroup.leaf;
            var glucose1 = leafGroup.glucose1;
            var glucose2 = leafGroup.glucose2;
            
            // remove the leaf and two glucose
            leaf.remove();
            glucose1.remove();
            glucose2.remove();
        }
    }
}

/**
 * Initialize the leaves by only showing the first leaf and its first glucose
 */
function initializeLeaves() {
    
    // loop through all the leaf groups
    for (var l = 0; l < leafGroups.length; l++) {
        var leafGroup = leafGroups[l];
        
        if (leafGroup != null) {
            var leaf = leafGroup.leaf;
            var glucose1 = leafGroup.glucose1;
            var glucose2 = leafGroup.glucose2;
            
            if (l == 0) {
                // show the first leaf
                leaf.attr({
                    'opacity': 1
                });
                
                // show the first glucose of the first leaf
                glucose1.attr({
                    'opacity': 1
                });
                
                // hide the second glucose of the first leaf
                glucose2.attr({
                    'opacity': 0
                });
            } else {
                // hide the leaf and two glucose of all other leaves
                
                leaf.animate().attr({
                    'opacity': 0
                });
                
                glucose1.animate().attr({
                    'opacity': 0
                });
                
                glucose2.animate().attr({
                    'opacity': 0
                });
            }
        }
    }
}

/**
 * Create the carrot images. The images show the stages of the carrot growth
 * from tiny root to full carrot.
 */
function createCarrots() {
    
    var carrot1 = draw.image('./carrot1.png').attr({
        'x': 160,
        'y': 335,
        'opacity': 0
    });

    var carrot2 = draw.image('./carrot2.png').attr({
        'x': 155,
        'y': 335,
        'opacity': 0
    });

    var carrot3 = draw.image('./carrot3.png').attr({
        'x': 155,
        'y': 335,
        'opacity': 0
    });

    var carrot4 = draw.image('./carrot4.png').attr({
        'x': 150,
        'y': 335,
        'opacity': 0
    });

    var carrot5 = draw.image('./carrot5.png').attr({
        'x': 150,
        'y': 335,
        'opacity': 0
    });

    var carrot6 = draw.image('./carrot6.png').attr({
        'x': 150,
        'y': 335,
        'opacity': 0
    });

    carrots = [carrot1, carrot2, carrot3, carrot4, carrot5, carrot6];
    
    // show the first carrot image
    showCarrot(1);
}

/**
 * Create the plant died message
 */
function createPlantDiedMessage() {
    
    // create the message rectangle
    plantDiedRect = draw.rect(500, 100).x(50).y(200).fill('red').stroke({width:2}).opacity(1).attr({
        'fill-opacity': 1
    });

    // create the message text
    plantDiedText = draw.text('The plant has died').x(100).y(210).font({size: 48});

    // hide the elements until we want to show them
    plantDiedRect.hide();
    plantDiedText.hide();
}

/**
 * Create the feedback rectangle; showFeedback should be called with a message to show
 * the feedback with a particular message.
 */
function createFeedbackRectangle() {

    // create the message rectangle
    feedbackRect = draw.rect(500, 300).x(50).y(200).fill('LightYellow ').stroke({width:2}).opacity(1).attr({
        'fill-opacity': 1
    });

    // create the message text
    feedbackText = [];

    // hide the elements until we want to show them
    feedbackRect.hide();
}


/**
 * Create the simulation ended message
 */
function createSimulationEndedMessage() {
    
    // create the message rectangle
    simulationEndedRect = draw.rect(500, 100).x(50).y(200).fill('lightblue').stroke({width:2}).opacity(1).attr({
        'fill-opacity': 1
    });

    // create the message text
    simulationEndedText = draw.text('Simulation ended').x(115).y(210).font({size: 48});

    // hide the elements until we want to show them
    simulationEndedRect.hide();
    simulationEndedText.hide();
}

/**
 * Enable or disable the start button
 * @param enable whether to enable or disable the start button
 */
function enableStartButton(enable) {
    
    if (enable) {
        // enable the start button
        startButtonRect.attr({'fill-opacity': 1});
    } else {
        // disable the start button
        startButtonRect.attr({'fill-opacity': 0});
    }

    startButtonEnabled = enable;
}

/**
 * Enable or disable the turn light on button
 * @param enable whether to enable or disable the turn light on button
 */
function enableTurnLightOnButton(enable) {
    
    if (enable) {
        // enable the turn light on button
        lightOnButtonRect.attr({'fill-opacity': 1});
    } else {
        // disable the turn light on button
        lightOnButtonRect.attr({'fill-opacity': 0});
    }

    turnLightOnButtonEnabled = enable;
}

/**
 * Enable or disable the turn light off button
 * @param enable whether to enable or disable the turn light off button
 */
function enableTurnLightOffButton(enable) {
    
    if (enable) {
        // enable the turn light off button
        lightOffButtonRect.attr({'fill-opacity': 1});
    } else {
        // disable the turn light off button
        lightOffButtonRect.attr({'fill-opacity': 0});
    }

    turnLightOffButtonEnabled = enable;
}

/**
 * Enable or disable the reset button
 * @param enable whether to enable or disable the reset button
 */
function enableResetButton(enable) {
    
    if (enable) {
        // enable the reset button
        resetButtonRect.attr({'fill-opacity': 1});
    } else {
        // disable the reset button
        resetButtonRect.attr({'fill-opacity': 0});
    }

    resetButtonEnabled = enable;
}

/**
 * Create the buttons
 */
function createButtons() {
    
    // the start button rectangle
    startButtonRect = draw.rect(150,30).x(430).y(30).radius(10).fill('yellow').stroke({width:2}).opacity(1).attr({
        'fill-opacity': 1
    }).click(function() {
        if (startButtonEnabled) {
            // the start button is enabled
            
            // get the text of the start button which can be Start/Pause/Resume
            var text = startButtonText.text();
            
            if (text == 'Start') {
                addEvent('startButtonClicked');
                start();
            } else if (text == 'Pause') {
                addEvent('pauseButtonClicked');
                pause();
            } else if (text == 'Resume') {
                addEvent('resumeButtonClicked');
                resume();
            }
        }
    });
    
    // the start button text
    startButtonText = draw.text('Start').x(485).y(35).font({size: 18}).click(function() {
        if (startButtonEnabled) {
            // the start button is enabled
            
            // get the text of the start button which can be Start/Pause/Resume
            var text = startButtonText.text();
            
            if (text == 'Start') {
                addEvent('startButtonClicked');
                start();
            } else if (text == 'Pause') {
                addEvent('pauseButtonClicked');
                pause();
            } else if (text == 'Resume') {
                addEvent('resumeButtonClicked');
                resume();
            }
        }
    });

    // the turn light on button rectangle
    lightOnButtonRect = draw.rect(150,30).x(430).y(70).radius(10).fill('yellow').stroke({width:2}).opacity(1).attr({
        'fill-opacity': 0
    }).click(function() {
        if (turnLightOnButtonEnabled) {
            // the turn light on button is enabled
            addEvent('turnLightOnButtonClicked');
            turnLightOn();
        }
    });
    
    // the turn light on button text
    lightOnButtonText = draw.text('Turn Light ON').x(451).y(75).font({size: 18}).click(function() {
        if (turnLightOnButtonEnabled) {
            // the turn light on button is enabled
            addEvent('turnLightOnButtonClicked');
            turnLightOn();
        }
    });

    // the turn light off button rectangle
    lightOffButtonRect = draw.rect(150,30).x(430).y(110).radius(10).fill('yellow').stroke({width:2}).opacity(1).attr({
        'fill-opacity': 0
    }).click(function() {
        if (turnLightOffButtonEnabled) {
            // the turn light off button is enabled
            addEvent('turnLightOffButtonClicked');
            turnLightOff();
        }
    });
    
    // the turn light off button text
    lightOffButtonText = draw.text('Turn Light OFF').x(445).y(115).font({size: 18}).click(function() {
        if (turnLightOffButtonEnabled) {
            // the turn light off button is enabled
            addEvent('turnLightOffButtonClicked');
            turnLightOff();
        }
    });

    // the reset button rectangle
    resetButtonRect = draw.rect(150,30).x(430).y(150).radius(10).fill('yellow').stroke({width:2}).opacity(1).attr({
        'fill-opacity': 0
    }).click(function() {
        if (resetButtonEnabled) {
            addEvent('resetButtonClicked');
            reset();
        }
    });
    
    // the reset button text
    resetButtonText = draw.text('Reset').x(480).y(155).font({size: 18}).click(function() {
        if (resetButtonEnabled) {
            addEvent('resetButtonClicked');
            reset();
        }
    });
    
    // disable the light on button
    enableTurnLightOnButton(false);
    
    // enable the light off button
    enableTurnLightOffButton(true);
}

/**
 * Start the simulation
 */
function start() {
    
    if (trialData == null) {
        // initialize the trial data
        initializeTrialData();
    }
    
    //Show feedback if it's a new trial, we aren't already showing feedback, and there's a
    //feedback message available
    if(!feedbackShowing && isNewTrial)  {
        var feedbackMessage = getFeedbackMessage();
        if(feedbackMessage != "") {
            showFeedback(feedbackMessage);
            // Make dummy data arrays - feedback is a "trial" but no simulation for it
            trialData.glucoseCreatedData = glucoseCreatedData;
            trialData.glucoseUsedData = glucoseUsedData;
            trialData.glucoseStoredData = glucoseStoredData;
            trials.push(trialData);
            //Save to WISE
            save();
            feedbackShowing = true;
            return;
        }
    } else if(feedbackShowing) {
        // hide the 'Feedback' message
        feedbackRect.hide();
        hideFeedbackText();
        feedbackShowing = false;
    }
    
    if (!resetButtonEnabled) {
        // enable the reset button
        enableResetButton(true);
    }
    
    // run the simulation
    resume();
    
    if (isNewTrial) {
        // we are starting a new trial
        
        // set the data arrays into the trial
        trialData.glucoseCreatedData = glucoseCreatedData;
        trialData.glucoseUsedData = glucoseUsedData;
        trialData.glucoseStoredData = glucoseStoredData;
        
        // add the new trial to the array of trials
        trials.push(trialData);
        
        isNewTrial = false;
    }
}




/**
 * Resume the simulation
 */
function resume() {
    
    if (!running) {
        /*
         * we are not currently running the simulation so we will start running 
         * the simulation
         */
        
        // we are not currently running so we will now run
        running = true;
        
        // change the button text to display 'Pause'
        startButtonText.text('Pause').x(480).y(35);
        
        if (turnLightOnWhenStart) {
            // we need to turn the photons on now that the simulation is running
            startPhotons();
        }
        
        if (intervalId == null) {
            // timer for animation, calls plantAnimation every 2 seconds
            intervalId = window.setInterval(plantAnimation, 2000);
        }
    }
}

/**
 * Pause the simulation
 */
function pause() {
    
    if (running) {
        /*
         * we are currently running the simulation so we will now pause the 
         * simulation
         */
        
        // we are currently running so we will now pause
        running = false;
         
        // change the button text to display 'Resume'
        startButtonText.text('Resume').x(472).y(35);
        
        // stop the photons
        stopPhotons();
        
        // stop the set interval function call to plantAnimation()
        clearInterval(intervalId);
        intervalId = null;
    }
}

/**
 * Reset the simulation
 */
function reset() {
    
    // end the current trial
    endTrial();
    
    if (running) {
        /*
         * if we are currently running the simulation, we will now pause the
         * simulation
         */
        pause();
    }
    
    // change the button text to display 'Start'
    startButtonText.text('Start').x(485).y(35);
    
    // initialize the variables
    weekNumber = 0;
    glucoseIndex = 0;
    glucoseCreated = initialGlucoseCreated;
    glucoseUsed = initialGlucoseUsed;
    glucoseStored = initialGlucoseStored;
    
    // initialize the trial data
    initializeTrialData();
    
    // initialize the graph
    initializeGraph();
    
    /*
     * remove all the leaves and glucose. we need to remove the leaves and 
     * glucose instead of just hiding them because if we hide the leaves and 
     * glucose, glucose may still show up if there was a delay in showing the 
     * glucose caused by calling.
     * 
     * glucose2.animate({delay: '1s'}).attr({
     *     'opacity': 1
     * });
     */
    removeLeaves();
    
    // create the leaves again since we have just removed all of them
    createLeaves();
    
    /*
     * initialize the leaves so that only the first leaf is displayed with
     * one glucose
     */
    initializeLeaves();
    
    // show the first carrot phase
    showCarrot(1);
    
    // turn the light on
    turnLightOn();
    
    // enable the necessary buttons
    enableStartButton(true);
    enableTurnLightOnButton(false);
    enableTurnLightOffButton(true);
    enableResetButton(false);
    
    // hide the 'Plant Died' message
    plantDiedRect.hide();
    plantDiedText.hide();
    
    // hide the 'Simulation Ended' message
    simulationEndedRect.hide();
    simulationEndedText.hide();
    
    // hide the 'Feedback' message
    feedbackRect.hide();
    hideFeedbackText();
    
    // set this flag back to false because we are going to start a new trial
    simulationEnded = false;
    
    if (wise5) {
        // get the student work from other components
        getStudentWork();
    }
}

/**
 * Looks at what trials have already been done and if relevant,
 * gets a feedback message
 */
function getFeedbackMessage() {
    var numTrials = getTrials();
    //Check if we've done more than the minimum trials required prior to
    //feedback and also whether it's been at least intervalBetweenFeedbackTrials
    //since our last feedback trial. The -1 is because the feedback itself added
    //to the trial count.
    if(feedbackPolicy == null || feedbackPolicy == "none") {
        //Don't show feedback
        return "";
    } else if(feedbackPolicy == "experiment2a") {
        //Try turning the light on and off. Strategy feedback should tell them to try both if they haven't 
        //done that already after 2 runs. Also, if they run the model for more than 60 total weeks, it should 
        //tell them to move on.
        if(getTrials() >= 2) {
            if(!trialWithLightOffOccurred) {
                return feedbackMessageNeverTurnsLightOff;
            } else if(totalWeeksRun > 60) {
                return feedbackMessageMoveOnOrAsk;
            }
            
        }
    } else if(feedbackPolicy == "experiment2b") {
        //Leave the light on for four weeks and then turn it off and let the plant die. 
        //Strategy feedback should just tell the students to do that if they don't do it on 
        //their own after, say, running the model in any configuration for more than 6 weeks. 
        //Plus, after the students do that, maybe let them run the same experiment once more, and 
        //after that if if they're still running it, tell them they don't need to run the model 
        //any more - either move on or ask the teacher for help.
        if(totalWeeksRun >= 6) {
            if("fourWeeksOn" in policySpecificFeedbackInfo.templateMatches) {
                //They've done the requested trial at least once
                //Check if they've had the chance to try it once more (indicated
                //by having done one more trial after the match. If not, let them
                //keep going; if so, then tell them to move on.
                if(getTrials() > policySpecificFeedbackInfo.templateMatches["fourWeeksOn"][0]) {
                    return feedbackMessageMoveOnOrAsk;
                }
            } else {
                //They haven't done the requested trial - tell them to do so
                return feedbackMessageDoFourWeeksOnTrial;
            } 
        } 
    } else {
        if(numTrials >= minTrialsBeforeFeedback &&
                (lastFeedbackTrial < 0 || (numTrials- 1 - lastFeedbackTrial) >= intervalBetweenFeedbackTrials) ) {
            if(!trialWithLightOffOccurred && lightOn) {
                return feedbackMessageNeverTurnsLightOff;
            } else if(longestTrial < shortTrialCutoff) {
                return feedbackMessageOnlyShortTrials;
            } else if(!plantHasEverDied) {
                return feedbackMessagePlantNeverDied;
            } else if(totalWeeksRun > weeksRunCutoff) {
                return feedbackMessageLongTrialRunningTime;
            }
        } 
    }
    return "";

}

/**
 * Checks whether the trial matches the template provided. Templates
 * should be 21 weeks long (max trial length) and should have an integer
 * at each spot in the array. -1 means we don't care about whether the light was
 * on that week (light on, off, or plant dead are all fine). 0 means we care
 * and the light must be off or the plant has died. 1 means we 
 * care and the light must be on. 2 means the plant should be dead (either it just died 
 * or the week doesn't exist in the trial). We are measuring this by transitions,
 * so "week 1 light is on" is measured as whether the glucose created went up from
 * week 0 to week 1. Thus, the value at week 0 in the template is ignored. 
 * 
 * Returns true if the trial matches the template,
 * false otherwise.
 */
function trialMatchesTemplate(trialData, template) {
    for(var i = 1; i < template.length; i++) {
        if(template[i] == 0) {//Want plant dead or light off
            //Check whether this exists in the trial
            //if plant isn't dead and made glucse this week, light is on - doesn't match
            if(trialData.glucoseCreatedData.length > i && trialData.glucoseCreatedData[i][1] - trialData.glucoseCreatedData[i-1][1] > 0) {
                return false;
            }
        } else if(template[i] == 1) {//Want light on, plant can't be dead
            //Check whether this exists in the trial
            //Either plant is already dead or no glucose made this week, so light is off - doesn't match
            if(trialData.glucoseCreatedData.length <= i || trialData.glucoseCreatedData[i][1] - trialData.glucoseCreatedData[i-1][1] <= 0) {
                return false;
            }
        } else if(template[i] == 2) {//Want plant dead
            //Plant either died this week or is already dead
            if(trialData.glucoseStoredData.length > i && trialData.glucoseStoredData[i] >= 0) {
                //Plant is still alive and has glucose - doesn't match
                return false;
            }
        }

    }
    return true;

}


/**
 * Records information for the latest trial in the global variables
 * tracking information that affects what feedback message to give
 */
function recordInfoForFeedback(trialData) {
    //Light off
    var lightOffForTrial = trialIncludesLightOff(trialData);
    trialWithLightOffOccurred = trialWithLightOffOccurred || lightOffForTrial;

    //Timing info
    var timeForTrial = getTrialTime(trialData);
    if(timeForTrial > longestTrial) {
        longestTrial = timeForTrial;
    }

    //Total running time, measured in weeks
    totalWeeksRun += trialData.glucoseCreatedData.length - 1//-1 because 0th week is always stored

    //Plant death occurred
    var plantEverDied = plantDiedInTrial(trialData);
    plantHasEverDied = plantHasEverDied || plantEverDied;

    //Record any policy specific info
    if(feedbackPolicy != null) {
        if(typeof templatesByFeedbackPolicy[feedbackPolicy] != "undefined") {
            var templatesToCheck = templatesByFeedbackPolicy[feedbackPolicy];
            for(var i = 0; i < templatesToCheck.length; i++) {
                if(trialMatchesTemplate(trialData, templatesToCheck[i])) {
                    var templateName = templateNamesByFeedbackPolicy[feedbackPolicy][i];
                    if(!policySpecificFeedbackInfo.templateMatches.hasOwnProperty(templateName)) {
                        policySpecificFeedbackInfo.templateMatches[templateName] = [];
                    }
                    //Template matches are just lists of trial numbers where the trials matched
                    policySpecificFeedbackInfo.templateMatches[templateName].push(getTrials());  
                }
            }
        }
    }
}

/**
 * Check if trial has included time with the simulation running
 * and the light off.
 */
function trialIncludesLightOff(trial) {
    //Iterate through the array of events
    var events = trial.events;
    var running = false;
    var lightTurnedOff = false;
    for(var i = 0; i < events.length; i++) {
        var curEvent = events[i];
        var curName = curEvent.name;
        if(curName === 'startButtonClicked') {
            running = true;
            if(lightTurnedOff) {
                return true;
            }
        } else if(curName === 'turnLightOffButtonClicked') {
            lightTurnedOff = true;
            if(running) {
                return true;
            }
        } else if(curName == 'turnLightOnButtonClicked') {
            lightTurnedOff = false;
        } else if(curName == 'pauseButtonClicked') {
            running = false;
        } else if(curName == 'resumeButtonClicked') {
            running = true;
        }

    }
    return false;

}

/**
 * Return the number of milliseconds taken for the trial
 * Define as amount of time where the simulation is actually
 * running (not paused).
 */
function getTrialTime(trial) {
    //Iterate through the array of events
    var events = trial.events;
    var running = false;
    var startTime = null;
    var totalTime = 0;
    for(var i = 0; i < events.length; i++) {
        var curEvent = events[i];
        var curName = curEvent.name;
        var lastEventTime = curEvent.timestamp;
        if(curName === 'startButtonClicked') {
            running = true;
            startTime = curEvent.timestamp;
        } else if(curName == 'pauseButtonClicked') {
            running = false;
            totalTime += (lastEventTime - startTime);
        } else if(curName == 'resumeButtonClicked') {
            running = true;
            startTime = curEvent.timestamp;
        } else if(curName == 'plantDied') {
            running = false;
            totalTime += (lastEventTime - startTime);
        } else if(curName == 'resetButtonClicked') {
            if(running) {
                totalTime += (lastEventTime - startTime);
            }
        }   
    }
    return totalTime;
}

/**
 * Returns true if the plant died during the trial represented by trialData
 */
function plantDiedInTrial(trialData) {
    var events = trialData.events;
    for(var i = 0; i < events.length; i++) {
        if(events[i].name === 'plantDied') {
            return true;
        }

    }
    return false;

}

/**
 * Get the number of trials
 */
function getTrials() {
    return trials.length;
}

/**
 * Start the photons animation
 */
function startPhotons() {
    
    photonsEnabled = true;
    
    // create the photon image objects
    
    var photon = draw.image('./photon.png', 30, 30);
    
    var photon2 = photon.clone().attr({
        'x': 80,
        'y': 50
    });
    
    var photon3 = photon.clone().attr({
        'x': 30,
        'y': 50
    });
    
    var photon4 = photon.clone().attr({
        'x': 120,
        'y': 90
    });
    
    photons = [photon, photon2, photon3, photon4];
    
    // loop througha all the photons and animate them
    for (var i = 0; i < photons.length; i++) {
        /*
         * animate the photon by making it move from the top left to the middle
         * of the display
         */
        photons[i].animate().move(photons[i].attr('x') + 250, photons[i].attr('y') + 250).loop()
    }
}

/**
 * Stop the photons animation
 */
function stopPhotons() {
    
    photonsEnabled = false;
    
    // loop through all the photons
    for (var i = 0; i < photons.length; i++) {
        
        // stop the photon
        photons[i].animate().stop();
        
        // remove the photon
        photons[i].remove();
    }
}

/**
 * Turn the light on
 */
function turnLightOn() {
    
    lightOn = true;
    
    // disable the turn light on button
    enableTurnLightOnButton(false);
    
    // enable the turn light off button
    enableTurnLightOffButton(true);
    
    /*
     * set this flag for the case when the model is paused and we want to
     * start the photons when the 'Start' or 'Resume' button is clicked
     */
    turnLightOnWhenStart = true;
    
    // hide the grey light bulb
    lightBulbOff.hide();
    
    // show the yellow light bulb
    lightBulbOn.show();
    
    // remove the darkness overlay
    if (typeof darknessOverlay != "undefined") {
        darknessOverlay.stop();
        darknessOverlay.remove();
    }
    
    // re-create the darkness overlay
    darknessOverlay = draw.rect(600, 800).attr({
        'fill-opacity': 0
    }).back();
}

/**
 * Turn the light off
 */
function turnLightOff() {
    
    lightOn = false;
    
    // enable the turn light on button
    enableTurnLightOnButton(true);
    
    // disable the turn light off button
    enableTurnLightOffButton(false);
    
    /*
     * set this flag for the case when the model is paused and we do not want 
     * the photons to start when the 'Start' or 'Resume' button is clicked
     */
    turnLightOnWhenStart = false;
    
    // hide the yellow bulb
    lightBulbOn.hide();
    
    // show the grey bulb
    lightBulbOff.show();
    
    // stop the photons
    stopPhotons();
    
    // display the darkness overlay
    darknessOverlay.animate().attr({
        fill: 'black',
        'fill-opacity': '0.3'
    });
}

/**
 * Run the plant animation
 */
function plantAnimation() {
    
    if (running) {
        // the simulation is currently running
        
        // increment the week number
        weekNumber++;
        
        if (weekNumber > maxWeeks) {
            // we have reached the end of the simulation
            
            // pause the simulation
            pause();
            
            // display the 'Simulation ended' message
            endReached();
            
            // end the trial
            endTrial();
        } else {
            // the simulation has not reached the end yet
            
            if (lightOn) {
                // the light is on
                
                if (!photonsEnabled) {
                    // animate the photons
                    startPhotons();
                }
                
                // increment the glucose index
                glucoseIndex++;
                
                var createGlucose = true;
                
                // update the glucose values
                updateGlucose(createGlucose);
                
                // update the graph
                var glucoseStored = updateGraph(weekNumber);
                
                //var leafNum = Math.floor(glucoseIndex / 3);
                
                // show the appropriate number of leaves
                //showLeaves(glucoseIndex + 1);
                showLeaves(Math.floor((glucoseIndex + 1) / 2));
                
                // show the appropriate stage of the carrot
                var carrotNum = Math.floor(glucoseIndex / 2);
                showCarrot(carrotNum + 1);
                
                /*
                 * make the background of the graph yellow for this week to
                 * represent the light being on
                 */
                var plotBand = {};
                plotBand.from = weekNumber - 1;
                plotBand.to = weekNumber;
                plotBand.color = '#fff9a5';
                chart.xAxis[0].addPlotBand(plotBand);
                
                // show the glucose animation
                glucoseAnimation()
            } else  {
                // the light is off
                
                // decrement the glucose index
                glucoseIndex--;
                
                var createGlucose = false;
                
                // update the glucose values
                updateGlucose(createGlucose);
                
                // update the graph
                var glucoseStored = updateGraph(weekNumber);
                
                //var leafNum = Math.floor(glucoseIndex / 3);
                
                // show the appropriate number of leaves
                //showLeaves(glucoseIndex + 1);
                showLeaves(Math.floor((glucoseIndex + 1) / 2));
                
                /*
                 * make the background of the graph grey for this week to
                 * represent the light being off
                 */
                var plotBand = {};
                plotBand.from = weekNumber - 1;
                plotBand.to = weekNumber;
                plotBand.color = '#dddddd';
                chart.xAxis[0].addPlotBand(plotBand);
                
                if (glucoseStored <= 0) {
                    /*
                     * the amount of glucose stored is 0 or less which means
                     * the plant has died
                     */
                    
                    // pause the simulation
                    pause();
                    
                    // remove all the leaves
                    showLeaves(-1);
                    
                    // show the plant died message
                    plantDied();
                    
                    // end the trial
                    endTrial();
                }
            }
        }
    }
}

/**
 * Animate the glucose
 */
function glucoseAnimation() {
    
    // create the glucose image object
    var glucose = draw.image('./glucose.png', 20, 20).attr({
        'x': 300,
        'y': 370,
        'opacity': 0
    });
    
    // move the glucose image and make it fade away
    glucose.animate().move(300, 450).attr({
        'opacity': 1
    }).after(function() {
        this.animate().move(310, 500).attr({
            'opacity': 0
        }).after(function() {
            this.remove();
        });
    });
}

/**
 * Show the number of leaves up to the leaf number. For example if
 * the leafNumber passed in is 3, it will show leaf1, leaf2, and leaf3.
 * @param numberOfLeaves the number of leaves to show
 */
function showLeaves(numberOfLeaves) {
    
    // loop through all the leaf groups
    for (var l = 0; l < leafGroups.length; l++) {
        
        var leafGroup = leafGroups[l];
        
        if (leafGroup != null) {
            
            // get a leaf and its two glucose
            var leaf = leafGroup.leaf;
            var glucose1 = leafGroup.glucose1;
            var glucose2 = leafGroup.glucose2;
            
            if (l <= (numberOfLeaves - 1)) {
                // show the leaf and its two glucose
                showLeaf(leaf, glucose1, glucose2);
            } else {
                // hide the leaf and its two glucose
                hideLeaf(leaf, glucose1, glucose2);
            }
        }
    }
}

/**
 * Show the leaf and its two glucose
 * @param leaf the leaf
 * @param glucose1 the first glucose on the leaf
 * @param glucose2 the second glucose on the leaf
 */
function showLeaf(leaf, glucose1, glucose2) {
    
    // show the leaf
    leaf.animate().attr({
        'opacity': 1
    });
    
    // show the first glucose
    glucose1.animate().attr({
        'opacity': 1
    }).after(function() {
        
        // show the second glucose 1 second later
        glucose2.animate({delay: '1s'}).attr({
            'opacity': 1
        });
    });
}

/**
 * Hide the leaf and its two glucose
 * @param leaf the leaf
 * @param glucose1 the first glucose on the leaf
 * @param glucose2 the second glucose on the leaf
 */
function hideLeaf(leaf, glucose1, glucose2) {
    
    // hide the second glucose
    glucose2.animate().attr({
        'opacity': 0
    }).after(function() {
        
        // hide the first glucose 1 second later
        glucose1.animate({delay: '1s'}).attr({
            'opacity': 0
        });
        
        // hide the leaf 1 second later
        leaf.animate({delay: '1s'}).attr({
            'opacity': 0
        });
    });
}

/**
 * Show the given carrot
 * @param carrotNumber The number of the carrot. The number of the carrots 
 * span from 1 to 6 with 1 being a tiny root and 6 being the full grown carrot.
 */
function showCarrot(carrotNumber) {
    
    if (carrotNumber > carrots.length) {
        // show the fullest carrot image
        carrotNumber = carrots.length;
    }
    
    // loop through all the carrots
    for (var c = 0; c < carrots.length; c++) {
        
        // get a carrot image
        var carrot = carrots[c];
        
        if (c == (carrotNumber - 1)) {
            // show this carrot
            carrot.animate().attr({
                'opacity': 1
            })
        } else {
            // hide this carrot
            carrot.animate().attr({
                'opacity': 0
            })
        }
    }
}

/**
 * Initialize the graph
 */
function initializeGraph() {
    
    // set the chart options
    chartOptions = {
        chart: {
            renderTo: 'highchartsDiv',
            type: 'line',
            width: '320'
        },
        plotOptions: {
            line: {
                marker: {
                    enabled: false
                }
            }
        },
        title: {
            text: 'Glucose Over Time',
            x: -20 //center
        },
        xAxis: {
            title: {
                text: 'Time (Weeks)'
            },
            min: 0,
            max: 21,
            tickInterval: 1
        },
        yAxis: {
            title: {
                text: 'Amount of Glucose'
            },
            labels: {
                enabled: false
            },
            min: 0,
            max: 220
        },
        tooltip: {
            enabled: false
        },
        series: [
            {
                name: 'Glucose Made',
                color: '#f17d00',
                lineWidth: 3,
                data: glucoseCreatedData
            },
            {
                name: 'Glucose Used',
                color: '#459db6',
                lineWidth: 3,
                data: glucoseUsedData
            },
            {
                name: 'Glucose Stored',
                color: '#72ae2e',
                lineWidth: 3,
                data: glucoseStoredData
            }
        ]
    };
    
    // draw the chart
    chart = new Highcharts.Chart(chartOptions);
}

/**
 * Update the graph
 * @param weekNumber the week number
 * @return the glucose stored
 */
function updateGraph(weekNumber) {
    
    // update the glucose created data array
    var glucoseCreatedDataPoint = [weekNumber, glucoseCreated];
    glucoseCreatedData.push(glucoseCreatedDataPoint);
    
    // update the glucose used data array
    var glucoseUsedDataPoint = [weekNumber, glucoseUsed];
    glucoseUsedData.push(glucoseUsedDataPoint);
    
    // update the glucose stored data array
    var glucoseStoredDataPoint = [weekNumber, glucoseStored];
    glucoseStoredData.push(glucoseStoredDataPoint);
    
    // update the data series for each line in the graph
    chart.series[0].setData(glucoseCreatedData);
    chart.series[1].setData(glucoseUsedData);
    chart.series[2].setData(glucoseStoredData);
    
    return glucoseStored;
}

/**
 * Update the glucose values
 * @parm createGlucose whether to create glucose
 */
function updateGlucose(createGlucose) {
    
    if (createGlucose) {
        // we are creating glucose so we will add to the glucoseCreated
        glucoseCreated += glucoseCreatedIncrement;
    }
    
    // increase the glucose used by the plant
    glucoseUsed += glucoseUsedIncrement;
    
    // update the amount of glucose stored
    glucoseStored = glucoseCreated - glucoseUsed;
}

/**
 * Save the student data to WISE
 */
function save() {
    
    if (wise4) {
        // this model is being used in WISE4
        
        if (wiseAPI != null) {
            // save the trial data to WISE
            wiseAPI.save(trialData);
        }
    } else if (wise5) {
        // this mode is being used in WISE5
        
        // create a component state
        var componentState = {};
        componentState.isAutoSave = false;
        componentState.isSubmit = false;
        componentState.studentData = trialData;
        
        // save the component state to WISE
        saveWISE5State(componentState);
    }
}

/**
 * End the trial
 */
function endTrial() {

    // disable the start button
    enableStartButton(false);
    
    // disable the turn light on button
    enableTurnLightOnButton(false);
    
    // disable the turn light off button
    enableTurnLightOffButton(false);
    
    // enable the reset button
    enableResetButton(true);
    
    // record tracking variables for strategy
    recordInfoForFeedback(trialData);
    
    /* 
     * Check if the simulation has already ended.
     * endTrial() is called when
     * 1. the plant dies
     * 2. the time reaches the end
     * 3. the student clicks reset
     * We want to save student work when these events occur with one exception.
     * If the plant dies or the time reaches the end, we do not want the subsequent
     * reset click to save the work again. This is why we need to check if the
     * simulation has previously ended (and therefore already saved) before saving.
     */
    if (!simulationEnded) {
        // save the student data to WISE
        save();
    }
    
    simulationEnded = true;
}

/**
 * Initialize the trial data
 */
function initializeTrialData() {
    
    // initialize the glucose data lines
    glucoseCreatedData = [[0, initialGlucoseCreated]];
    glucoseUsedData = [[0, initialGlucoseUsed]];
    glucoseStoredData = [[0, initialGlucoseStored]];
    
    // create the trial
    trialData = {};
    trialData.glucoseCreatedData = glucoseCreatedData;
    trialData.glucoseUsedData = glucoseUsedData;
    trialData.glucoseStoredData = glucoseStoredData;
    trialData.events = [];
    
    isNewTrial = true;
}

/**
 * Add an event to the trial
 * @param eventName the name of the event
 */
function addEvent(eventName) {
    
    // get the timestamp
    var timestamp = new Date().getTime();
    
    // create the event object
    var event = {};
    event.name = eventName;
    event.timestamp = timestamp;
    
    // add the event to the array of events in the trial
    trialData.events.push(event);
}

/**
 * Called when the plant has died
 */
function plantDied() {
    // create the plant died event
    addEvent('plantDied');
    
    // move the plant died elements in front of everything
    plantDiedRect.front();
    plantDiedText.front();
    
    // show the plant died message
    plantDiedRect.show();
    plantDiedText.show();
}

/**
 * Called when feedback should be shown
 */
function showFeedback(feedbackMessage) {
    //Record that feedback is being shown this trial
    lastFeedbackTrial = getTrials();
    // create the feedback shown event
    addEvent('Feedback shown: ' + feedbackMessage);

    // move the feedback elements in front of everything
    feedbackRect.front();
    //feedbackText.front();

    // create the message text
    feedbackText = [];
    var startingYValue = 210;
    var totalLines = feedbackMessage.length;
    if(feedbackMessage != feedbackMessageMoveOnOrAsk) {
        totalLines += feedbackInstructions.length;
    }
    for(var i = 0; i < totalLines; i++) {
        var curYValue = startingYValue + i*50;
        var curLine;
        if(i < feedbackMessage.length) {
            curLine = feedbackMessage[i];
        } else {
            curLine = feedbackInstructions[i - feedbackMessage.length];
        }
        var curText = draw.text(curLine).x(80).y(curYValue).font({size: 24});
        feedbackText.push(curText);
    }
    feedbackRect.show();
}

/**
 * Hide all the lines of the feedback text message.
 */
function hideFeedbackText() {
    for(var i = 0; i < feedbackText.length; i++) {
        feedbackText[i].hide();
    }
}

/**
 * Called when the end of the simulation is reached
 */
function endReached() {
    // create the simulation ended event
    addEvent('simulationEnded');
    
    // move the simulation ended elements in front of everything
    simulationEndedRect.front();
    simulationEndedText.front();
    
    // show the simulation ended message
    simulationEndedRect.show();
    simulationEndedText.show();
}

/**
 * Send an event to the parent
 * @param event the event object
 */
function saveWISE5Event(event) {
    event.messageType = 'event';
    sendMessage(event);
}

/**
 * Send a component state to the parent
 * @param componentState the component state
 */
function saveWISE5State(componentState) {
    componentState.messageType = 'studentWork';
    sendMessage(componentState);
}

/**
 * Get student work from other components by asking the parent for the work
 */
function getStudentWork() {
    
    // make a message to request the other student work
    var message = {
        messageType: "getStudentWork"
    };
    
    // send the message to request the other student work
    sendMessage(message);
}

/**
 * Send a message to the parent
 * @param the message to send to the parent
 */
function sendMessage(message) {
    parent.postMessage(message, "*");
}

/**
 * Receive a message from the parent
 * @param message the message from the parent
 */
function receiveMessage(message) {
    
    if (message != null) {
        var messageData = message.data;
        
        if (messageData != null) {
            if (messageData.messageType == 'studentWork') {
                /*
                 * we have received a message that contains student work from
                 * other components
                 */
                this.studentWorkFromThisNode = messageData.studentWorkFromThisNode;
                this.studentWorkFromOtherComponents = messageData.studentWorkFromOtherComponents;
                
            } else if (messageData.messageType == 'nodeSubmitClicked') {
                /*
                 * the student has clicked the submit button and the student
                 * work has been included in the message data
                 */
                this.studentWorkFromThisNode = messageData.studentWorkFromThisNode;
                this.studentWorkFromOtherComponents = messageData.studentWorkFromOtherComponents;
            } else if (messageData.messageType == 'componentStateSaved') {
                var componentState = messageData.componentState;
            }
        }
    }
}

/**
 * Get the student work for a given node id and component id
 * @param nodeId the node id
 * @param componentId the component id
 * @return the component state for the component. if there is no work for
 * the component, an object with a node id field and component id field will
 * be returned.
 */
function getStudentWorkByNodeIdAndComponentId(nodeId, componentId) {
    
    var componentState = null;
    
    if (nodeId != null && componentId != null) {
        if (this.studentWorkFromThisNode != null) {
            
            // loop through the component states from this node
            for (var c = 0; c < this.studentWorkFromThisNode.length; c++) {
                
                // get a component state
                var tempComponentState = this.studentWorkFromThisNode[c];
                
                if (tempComponentState != null) {
                    var tempNodeId = tempComponentState.nodeId;
                    var tempComponentId = tempComponentState.componentId;
                    
                    if (nodeId == tempNodeId && componentId == tempComponentId) {
                        // we have found the component state we are looking for
                        componentState = tempComponentState;
                        break;
                    }
                }
            }
        }
        
        if (studentWork == null && this.studentWorkFromOtherComponents != null) {
            
            // loop through the component states from other nodes
            for (var c = 0; c < this.studentWorkFromOtherComponents.length; c++) {
                
                // get a component state
                var tempComponentState = this.studentWorkFromOtherComponents[c];
                
                if (tempComponentState != null) {
                    if (tempComponentState != null) {
                        var tempNodeId = tempComponentState.nodeId;
                        var tempComponentId = tempComponentState.componentId;
                        
                        if (nodeId == tempNodeId && componentId == tempComponentId) {
                            // we have found the component state we are looking for
                            componentState = tempComponentState;
                            break;
                        }
                    }
                }
            }
        }
    }
    
    return componentState;
}

// listen for messages from the parent
window.addEventListener('message', receiveMessage);


var draw = null;

var buttons = {};

var plantDiedRect = null;
var plantDiedText = null;
var endReachedRect = null;
var endReachedText = null;

var running = false;

var photon = null;
var photon2 = null;
var photon3 = null;
var photon4 = null;

var photonArr = [];

var lightBulbOn = null;
var lightBulbOff = null;

var turnLightOnWhenStart = true;
var photonsEnabled = false;
var intervalId = null;

var maxGlucose = 200;

var weekNumber = 0;
var maxWeeks = 20;

var glucoseCreated = 0;
var glucoseUsed = 0;
var glucoseStored = 0;

var initialGlucoseCreated = 10;
var initialGlucoseUsed = 6;
var initialGlucoseStored = 4;

var glucoseIndex = 0;
var glucoseCreatedData = [];
var glucoseUsedData = [];
var glucoseStoredData = [];

var startButtonEnabled = true;
var turnLightOffButtonEnabled = true;
var turnLightOnButtonEnabled = false;
var resetButtonEnabled = false;

var data = null;
var isNewTrial = true;

var wiseEnabled = false;
var api = null;
var appObj = null;

    function enableStartButton(enable) {
        
        if (enable) {
            buttons.startButton.button.attr({'fill-opacity': 1});
            /*
            buttons.startButton.button.off('click');
            buttons.startButton.button.on('click', function() {
                start();
            });
            buttons.startButton.buttonText.off('click');
            buttons.startButton.buttonText.on('click', function() {
                start();
            });
            */
        } else {
            buttons.startButton.button.attr({'fill-opacity': 0});
            /*
            buttons.startButton.button.off('click');
            buttons.startButton.buttonText.off('click');
            */
        }
        
        startButtonEnabled = enable;
    }

    function enableTurnLightOnButton(enable) {
        
        if (enable) {
            buttons.lightOnButton.button.attr({'fill-opacity': 1});
            /*
            buttons.lightOnButton.button.off('click');
            buttons.lightOnButton.button.on('click', function() {
                turnLightOn();
            });
            buttons.lightOnButton.buttonText.off('click');
            buttons.lightOnButton.buttonText.on('click', function() {
                turnLightOn();
            });
            */
        } else {
            buttons.lightOnButton.button.attr({'fill-opacity': 0});
            /*
            buttons.lightOnButton.button.off('click');
            buttons.lightOnButton.buttonText.off('click');
            */
        }
        
        turnLightOnButtonEnabled = enable;
    }
    
    function enableTurnLightOffButton(enable) {
        if (enable) {
            buttons.lightOffButton.button.attr({'fill-opacity': 1});
            /*
            buttons.lightOffButton.button.off('click');
            buttons.lightOffButton.button.on('click', function() {
                turnLightOff();
            });
            buttons.lightOffButton.buttonText.off('click');
            buttons.lightOffButton.buttonText.on('click', function() {
                turnLightOff();
            });
            */
        } else {
            buttons.lightOffButton.button.attr({'fill-opacity': 0});
            /*
            buttons.lightOffButton.button.off('click');
            buttons.lightOffButton.buttonText.off('click');
            */
        }
        
        turnLightOffButtonEnabled = enable;
    }
    
    function enableResetButton(enable) {
        if (enable) {
            buttons.resetButton.button.attr({'fill-opacity': 1});
            /*
            buttons.resetButton.button.off('click');
            buttons.resetButton.button.on('click', function() {
                reset();
            });
            buttons.resetButton.buttonText.on('click', function() {
                reset();
            });
            */
        } else {
            buttons.resetButton.button.attr({'fill-opacity': 0});
            /*
            buttons.resetButton.button.off('click');
            buttons.resetButton.buttonText.off('click');
            */
        }
        
        resetButtonEnabled = enable;
    }

    function init() {
        initializeData();
        initializeGraph();
        
        glucoseCreated = initialGlucoseCreated;
        glucoseUsed = initialGlucoseUsed;
        glucoseStored = initialGlucoseStored;
        
    draw = SVG('board');

    //document.getElementById("glucoseDisplay").innerHTML = 0;
    
    var background = draw.image('./bg.png', 600, 800);
    lightBulbOn = draw.image('./lightbulb20001.png', 40, 70);
    lightBulbOn.rotate(150);
    //lightBulbOn.hide();
    
    lightBulbOff = draw.image('./lightbulb20002.png', 40, 70);
    lightBulbOff.rotate(150);
    lightBulbOff.hide();
    
    overlay = draw.rect(600, 800).attr({
      'fill-opacity': 0
    }).back();

    /*
    var stem = draw.image('./stem.png').attr({
      'x': 270,
      'y': 360
    })

    var tuber = draw.image('./tuber.png').attr({
      'x': 100,
      'y': 550
    })
    */

    <!------------------ Drawing the start, light on , and light off buttons ------------------- --> 
    buttons = {
      startButton: {
        
        button: draw.rect(150,30).x(430).y(30).radius(10).fill('yellow').stroke({width:2}).opacity(1).attr({
          'fill-opacity': 1
        }).click(function() {
            if (startButtonEnabled) {
                var text = buttons.startButton.buttonText.text();
                
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
        }),
        buttonText: draw.text('Start').x(485).y(35).font({size: 18}).click(function() {
            if (startButtonEnabled) {
                var text = buttons.startButton.buttonText.text();
                
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
                
                start();
            }
        })
      },
      lightOnButton: {
        button: draw.rect(150,30).x(430).y(70).radius(10).fill('yellow').stroke({width:2}).opacity(1).attr({
          'fill-opacity': 0
        }).click(function() {
            //turnOn()
          
            if (turnLightOnButtonEnabled) {
                addEvent('turnLightOnButtonClicked');
                turnLightOn();
            }
        }),
        buttonText: draw.text('Turn Light ON').x(451).y(75).font({size: 18}).click(function() {
            //turnOn()
            if (turnLightOnButtonEnabled) {
                addEvent('turnLightOnButtonClicked');
                turnLightOn();
            }
        })
      },
      lightOffButton: {
        button: draw.rect(150,30).x(430).y(110).radius(10).fill('yellow').stroke({width:2}).opacity(1).attr({
          'fill-opacity': 0
        }).click(function() {
            //turnOff()
            if (turnLightOffButtonEnabled) {
                addEvent('turnLightOffButtonClicked');
                turnLightOff();
            }
        }),
        buttonText: draw.text('Turn Light OFF').x(445).y(115).font({size: 18}).click(function() {
            //turnOff()
            if (turnLightOffButtonEnabled) {
                addEvent('turnLightOffButtonClicked');
                turnLightOff();
            }
        })
      },
      resetButton: {
          button: draw.rect(150,30).x(430).y(150).radius(10).fill('yellow').stroke({width:2}).opacity(1).attr({
            'fill-opacity': 0
          }).click(function() {
              if (resetButtonEnabled) {
                  addEvent('resetButtonClicked');
                  reset();
              }
          }),
          buttonText: draw.text('Reset').x(480).y(155).font({size: 18}).click(function() {
              if (resetButtonEnabled) {
                  addEvent('resetButtonClicked');
                  reset();
              }
          })
      }
    }
    
    enableTurnLightOnButton(false);
    enableTurnLightOffButton(true);
    //enableTurnLightOffButton(true);
    <!------------------------------------------------------------------------------------------ -->

    <!-------------------------------------leaves------------------------------------------------- -->
    var leaf1 = draw.image('./leaf1.png').attr({
      'x': 150,
      'y': 270,
      'opacity': 0
    })
    var leaf2 = draw.image('./leaf2.png').attr({
      'x': 310,
      'y': 285,
      'opacity': 0
    })
    var leaf3 = draw.image('./leaf3.png').attr({
      'x': 155,
      'y': 200,
      'opacity': 0
    })
    var leaf4 = draw.image('./leaf4.png').attr({
      'x': 310,
      'y': 235,
      'opacity': 0
    })
    var leaf5 = draw.image('./leaf5.png').attr({
      'x': 180,
      'y': 130,
      'opacity': 0
    })
    var leaf6 = draw.image('./leaf6.png').attr({
      'x': 300,
      'y': 200,
      'opacity': 0
    })
    // var leaf7 = draw.image('./leaf7.png').attr({
    //   'x': 200,
    //   'y': 80
    // })
    var leaf8 = draw.image('./leaf8.png', 170).attr({
      'x': 260,
      'y': 110,
      'opacity': 0
    })
    var leaf9 = draw.image('./leaf9.png', 250).attr({
      'x': 210,
      'y': 30,
      'opacity': 0
    })

    leafs = [leaf2, leaf1, leaf3, leaf4, leaf6, leaf5, leaf9, leaf8]
    <!------------------------------------------------------------------------------------------ -->
    
    var carrot1 = draw.image('./carrot1.png').attr({
        'x': 160,
        'y': 335,
        'opacity': 0
    })
    
    var carrot2 = draw.image('./carrot2.png').attr({
        'x': 155,
        'y': 335,
        'opacity': 0
    })
    
    var carrot3 = draw.image('./carrot3.png').attr({
        'x': 155,
        'y': 335,
        'opacity': 0
    })
    
    var carrot4 = draw.image('./carrot4.png').attr({
        'x': 150,
        'y': 335,
        'opacity': 0
    })
    
    var carrot5 = draw.image('./carrot5.png').attr({
        'x': 150,
        'y': 335,
        'opacity': 0
    })
    
    var carrot6 = draw.image('./carrot6.png').attr({
        'x': 150,
        'y': 335,
        'opacity': 0
    })
    
    carrots = [carrot1, carrot2, carrot3, carrot4, carrot5, carrot6];
    
    showLeafs(1);
    showCarrot(1);
    
    plantDiedRect = draw.rect(500, 100).x(50).y(200).fill('red').stroke({width:2}).opacity(1).attr({
        'fill-opacity': 1
    });
    
    plantDiedText = draw.text('The plant has died').x(100).y(210).font({size: 48});
    
    plantDiedRect.hide();
    plantDiedText.hide();
    
    endReachedRect = draw.rect(500, 100).x(50).y(200).fill('blue').stroke({width:2}).opacity(1).attr({
        'fill-opacity': 1
    });
    
    endReachedText = draw.text('Simulation ended').x(115).y(210).font({size: 48});
    
    endReachedRect.hide();
    endReachedText.hide();
    
    
        wiseEnabled=!(window.parent==window);
        
        if(wiseEnabled){
            api=window.parent.wiseAPI();
            appObj=window.parent.webApp;
        }
    }
    

    
    function start0() {
        
        if (data == null) {
            initializeData();
        }
        
        if (!resetButtonEnabled) {
            enableResetButton(true);
        }
        
        if (running) {
            buttons.startButton.buttonText.text('Start').x(485).y(35);
            // we are currently running so we will now pause
            running = false;
            
            //stopPhotons();
            stopPhotons();
            
            //turnLightOff();
            clearInterval(intervalId);
            intervalId = null;
        } else {
            buttons.startButton.buttonText.text('Pause').x(480).y(35);
            // we are not currently running so we will now run
            running = true;
            
            //stopPhotons();
            
            if (turnLightOnWhenStart) {
                //turnLightOn();
                startPhotons();
            }
            
            //startLight();
            //lightOn = true;
            
            
            if (intervalId == null) {
                //timer for animation, calls plantAnimation every 3 seconds
                intervalId = window.setInterval(plantAnimation, 1000);
            }
        }
        
        if (isNewTrial) {
            saveNewTrial();
            isNewTrial = false;
        } else {
            saveUpdatedTrial();
        }
    }
    
    function start() {
        
        if (data == null) {
            initializeData();
        }
        
        if (!resetButtonEnabled) {
            enableResetButton(true);
        }
        
        resume();
        
        if (isNewTrial) {
            saveNewTrial();
            isNewTrial = false;
        }
    }
    
    function resume() {
        if (!running) {
            buttons.startButton.buttonText.text('Pause').x(480).y(35);
            // we are not currently running so we will now run
            running = true;
            
            //stopPhotons();
            
            if (turnLightOnWhenStart) {
                //turnLightOn();
                startPhotons();
            }
            
            //startLight();
            //lightOn = true;
            
            
            if (intervalId == null) {
                //timer for animation, calls plantAnimation every 3 seconds
                intervalId = window.setInterval(plantAnimation, 2000);
            }
        }
    }
    
    function pause() {
        if (running) {
            buttons.startButton.buttonText.text('Resume').x(472).y(35);
            // we are currently running so we will now pause
            running = false;
            
            //stopPhotons();
            stopPhotons();
            
            //turnLightOff();
            clearInterval(intervalId);
            intervalId = null;
        }
    }
    
    function reset() {
        
        endTrial();
        
        if (running) {
            pause();
        }
        
        buttons.startButton.buttonText.text('Start').x(485).y(35);
        
        weekNumber = 0;
        glucoseCreated = initialGlucoseCreated;
        glucoseUsed = initialGlucoseUsed;
        glucoseStored = initialGlucoseStored;
        glucoseIndex = 0;
        
        initializeData();
        initializeGraph();
        showLeafs(1);
        showCarrot(1);
        turnLightOn();
        
        enableStartButton(true);
        enableTurnLightOnButton(false);
        enableTurnLightOffButton(true);
        enableResetButton(false);
        
        plantDiedRect.hide();
        plantDiedText.hide();
        
        endReachedRect.hide();
        endReachedText.hide();
    }

    function turnOn() {
      startLight();
      lightOn = true
    }

    function turnOff() {
      stopLight()
      lightOn = false;
    }

    function startLight0() {
      //lightAnimation()
      startPhotons();
      if (typeof overlay != "undefined") {
        overlay.stop()
        overlay.remove()
      }
      overlay = draw.rect(600, 800).attr({
        'fill-opacity': 0
      }).back()
    }
    
    function startPhotons() {
        
        photonsEnabled = true;
        
        photon = draw.image('./photon.png', 30, 30);
        photon2 = photon.clone().attr({
          'x': 80,
          'y': 50
        });
        photon3 = photon.clone().attr({
          'x': 30,
          'y': 50
        });
        photon4 = photon.clone().attr({
          'x': 120,
          'y': 90
        });

        photonArr = [photon, photon2, photon3, photon4];
        
        //animating a group of photons
        for (var i = 0; i < photonArr.length; i++) {
            //photonArr[i].show();
            photonArr[i].animate().move(photonArr[i].attr('x') + 250, photonArr[i].attr('y') + 250).loop()
        }
    }
    
    function stopPhotons() {
        photonsEnabled = false;
        
        for (var i = 0; i < photonArr.length; i++) {
          photonArr[i].animate().stop();
          photonArr[i].remove();
        }
    }
    
    function turnLightOn() {
        //console.log('turnLightOn');
        
        enableTurnLightOnButton(false);
        enableTurnLightOffButton(true);
        
        turnLightOnWhenStart = true;
        
        if (!photonsEnabled) {
            //startPhotons();
        }
        
        lightOn = true;
        lightBulbOff.hide();
        lightBulbOn.show();
        
        if (typeof overlay != "undefined") {
          overlay.stop()
          overlay.remove()
        }
        overlay = draw.rect(600, 800).attr({
          'fill-opacity': 0
        }).back()
        
        //saveUpdatedTrial();
    }
    
    function turnLightOff() {
        //console.log('turnLightOff');
        
        enableTurnLightOnButton(true);
        enableTurnLightOffButton(false);
        
        turnLightOnWhenStart = false;
        
        lightOn = false;
        lightBulbOn.hide();
        lightBulbOff.show();
        stopPhotons();
        overlay.animate().attr({
          fill: 'black',
          'fill-opacity': '0.3'
        })
        
        //saveUpdatedTrial();
    }

    function lightAnimation0() {
      if (lightOn === false) {

          startPhotons();
      }
      
    }
      
    function stopLight() {
        stopPhotons();

      overlay.animate().attr({
        fill: 'black',
        'fill-opacity': '0.3'
      })
      plantAnimation()
    }



    function carrot() {
      this.glucoseMade = 0;
      this.glucoseStored = 0;
      this.glucoseUsed = 0;
      this.alive = true;
      //document.getElementById("glucoseDisplay").innerHTML = this.glucoseStored;

      this.incrementGlucose = function() {
        //console.log('incrementGlucose');
        this.glucoseMade += 20;
        //this.glucoseStored += Math.floor(10 + (this.glucoseStored / 2));
        
        if (this.glucoseStored <= 0) {
            this.glucoseStored = 10;
        } else {
            this.glucoseStored = Math.floor(this.glucoseStored * Math.pow(1.1, 5));
        }
        
        
        this.glucoseUsed += 10;
        
        if (this.glucoseStored > maxGlucose) {
            this.glucoseStored = maxGlucose;
        }
        
        //document.getElementById("glucoseDisplay").innerHTML = this.glucoseStored;
      }

      this.decrementGlucose = function() {
        //console.log('decrementGlucose');
        this.glucoseStored -= 7;
        this.glucoseUsed += 8;
        //document.getElementById("glucoseDisplay").innerHTML = this.glucoseStored;
      }
    }
    
    var mrCarrot = new carrot();

    var lightOn = true;


    function plantAnimation() {
        //console.log('plantAnimation');
        if (running) {
            weekNumber++;
            
            if (weekNumber > maxWeeks) {
                pause();
                //addEvent('endReached');
                endReached();
                endTrial();
            } else {
                if (lightOn) {
                    
                    if (!photonsEnabled) {
                        startPhotons();
                    }
                    
                    incrementGlucose();
                    glucoseIndex++;
                    glucoseStored = drawGraph(weekNumber, glucoseIndex);
                    
                    var leafNum = Math.floor(glucoseIndex / 3);
                    //showLeafs(leafNum + 1);
                    //showLeafs(glucoseStored);
                    //showLeafs(leafNum + 1);
                    showLeafs(glucoseIndex + 1);
                    
                    var carrotNum = Math.floor(glucoseIndex / 2);
                    showCarrot(carrotNum + 1);
                    
                  //rounds down to get index of leaf that should be animated
                  //var leafNum = Math.floor(mrCarrot.glucoseStored / 10);
                  //var leafNum = Math.floor(mrCarrot.glucoseStored / (maxGlucose / leafs.length));
                  
                  //showLeafs(leafNum + 1);
                  
                  /*
                  console.log('leafNum=' + leafNum);
                  var leaf = leafs[leafNum]
                  console.log(leaf)
                  if (leaf != null) {
                      leaf.animate().attr({
                        'opacity': 1
                      })
                  }
                  */
                
                  /*
                  //var carrotNum = Math.floor((mrCarrot.glucoseStored + 10) / 20);
                  var carrotNum = Math.floor(mrCarrot.glucoseStored / (maxGlucose / carrots.length));
                  
                  if (carrotNum >= carrots.length) {
                      carrotNum = carrots.length - 1;
                  }
                  
                  showCarrot(carrotNum + 1);
                  */
                  
                  //mrCarrot.incrementGlucose();
                  glucoseAnimation()
                }
                if (!lightOn) {
                    glucoseIndex--;
                    decrementGlucose();
                    
                    var glucoseStored = drawGraph(weekNumber, glucoseIndex);
                    
                    /*
                    if (glucoseStored <= 0) {
                        start();
                        alert('Your plant has died :(');
                    }
                    */
                    
                    var leafNum = Math.floor(glucoseIndex / 3);
                    //var leafNum = glucoseIndex;
                    //showLeafs(leafNum + 1);
                    showLeafs(glucoseIndex + 1);
                    
                    if (glucoseStored <= 0) {
                        //start();
                        //alert('Your plant has died :(');
                        pause();
                        //alert('Your plant has died :(');
                        showLeafs(-1);
                        //addEvent('plantDied');
                        plantDied();
                        endTrial();
                    }
                    
                    /*
                  if (mrCarrot.glucoseStored < 0) {
                    alert('your plant has died!')
                  }
                  */
                  //var leafNum = Math.floor(mrCarrot.glucoseStored / 10);
                  
                  //showLeafs(leafNum + 1);
                  
                  /*
                  var leaf = leafs[leafNum]
                  console.log(leafNum)
                  console.log(mrCarrot.glucoseStored)
                  if (leaf != null) {
                      leaf.animate().attr({
                        'opacity': 0
                      })
                  }
                  */

                  //mrCarrot.decrementGlucose()
                }
            }
        }
    }

    function glucoseAnimation() {
      //console.log('glucoseAnimation');
      var glucose = draw.image('./glucose.png', 20, 20).attr({
        'x': 300,
        'y': 370,
        'opacity': 0
      })
      glucose.animate().move(300, 450).attr({
        'opacity': 1
      }).after(function() {
        this.animate().move(310, 500).attr({
          'opacity': 0
        })
      })
    }
    
    function showLeafs(leafNumber) {
        
        for (var l = 0; l < leafs.length; l++) {
            var leaf = leafs[l];
            
            if (l <= (leafNumber - 1)) {
                leaf.animate().attr({
                    'opacity': 1
                });
            } else {
                leaf.animate().attr({
                    'opacity': 0
                });
            }
        }
    }
    
    function showCarrot(carrotNumber) {
        //console.log('carrotNumber=' + carrotNumber);
        
        if (carrotNumber > carrots.length) {
            carrotNumber = carrots.length;
        }
        
        for (var c = 0; c < carrots.length; c++) {
            var carrot = carrots[c];
            
            if ((carrotNumber - 1) == c) {
                carrot.animate().attr({
                  'opacity': 1
                })
            } else {
                carrot.animate().attr({
                  'opacity': 0
                })
            }
        }
    }
    
    function initializeGraph() {
        glucoseCreatedData = [[0, initialGlucoseCreated]];
        glucoseUsedData = [[0, initialGlucoseUsed]];
        glucoseStoredData = [[0, initialGlucoseStored]];
        
        chartOptions = {
            chart: {
                renderTo: 'highchartsDiv',
                type: 'line',
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
                max: 20,
                tickInterval: 1
            },
            yAxis: {
                title: {
                    text: 'Amount of Glucose'
                },
                min: 0,
                max: 200
            },
            series: [
                {
                    name: 'Glucose Created',
                    color: 'orange',
                    data: glucoseCreatedData
                },
                {
                    name: 'Glucose Used',
                    color: 'blue',
                    data: glucoseUsedData
                },
                {
                    name: 'Glucose Stored',
                    color: 'green',
                    data: glucoseStoredData
                }
            ]
        };
        
        chart = new Highcharts.Chart(chartOptions);
    }
    
    function calculateGlucoseCreated(glucoseIndex) {
        var glucose = 0;
        
        //glucose = (10 * Math.pow(1.15, glucoseIndex)) - 10;
        
        glucose = 10 * glucoseIndex;
        
        return glucose;
    }
    
    function calculateGlucoseUsed(glucoseIndex) {
        var glucose = 0;
        
        //glucose = (10 * Math.pow(1.10, glucoseIndex)) - 10;
        glucose = 6 * glucoseIndex;
        
        return glucose;
    }
    
    function drawGraph(weekNumber, glucoseIndex) {
        //var data = chart.series[0].data;
        
        /*
        for (var x = 0; x <= weekNumber; x++) {
            var dataPoint = [];
            
            var y = calculateGlucoseCreated(x);
            
            dataPoint.push(x);
            dataPoint.push(y);
            data.push(dataPoint);
        }
        */
        /*
        var glucoseCreated = calculateGlucoseCreated(glucoseIndex);
        var glucoseUsed = calculateGlucoseUsed(weekNumber);
        var glucoseStored = glucoseCreated - glucoseUsed;
        */
        
        
        
        var glucoseCreatedDataPoint = [weekNumber, glucoseCreated];
        glucoseCreatedData.push(glucoseCreatedDataPoint);
        
        var glucoseUsedDataPoint = [weekNumber, glucoseUsed];
        glucoseUsedData.push(glucoseUsedDataPoint);
        
        var glucoseStoredDataPoint = [weekNumber, glucoseStored];
        glucoseStoredData.push(glucoseStoredDataPoint);
        
        chart.series[0].setData(glucoseCreatedData);
        chart.series[1].setData(glucoseUsedData);
        chart.series[2].setData(glucoseStoredData);
        
        
        if (glucoseStored < 0) {
            //pause();
            //alert('Your plant has died :(');
            //console.log('Your plant has died :(');
        }
        
        
        return glucoseStored;
    }
    
    function incrementGlucose() {
        glucoseCreated += 10;
        glucoseUsed += 6;
        glucoseStored = glucoseCreated - glucoseUsed;
    }
    
    function decrementGlucose() {
        glucoseUsed += 6;
        glucoseStored = glucoseCreated - glucoseUsed;
    }
    
    function save0() {
        //this.api.save(saveObj,function(){console.log("after save"); console.log(this.api.getLatestState());}.bind(this),function(){console.log("Save Failed");});
        
        data.glucoseCreatedData = glucoseCreatedData;
        data.glucoseUsedData = glucoseUsedData;
        data.glucoseStoredData = glucoseStoredData;
        
        if (wiseEnabled) {
            this.api.save(data);
        }
    }
    
    function saveNewTrial() {
        data.glucoseCreatedData = glucoseCreatedData;
        data.glucoseUsedData = glucoseUsedData;
        data.glucoseStoredData = glucoseStoredData;
        
        if (wiseEnabled) {
            this.api.save(data);
        }
    }
    
    function saveUpdatedTrial() {
        data.glucoseCreatedData = glucoseCreatedData;
        data.glucoseUsedData = glucoseUsedData;
        data.glucoseStoredData = glucoseStoredData;
        
        if (wiseEnabled) {
            this.api.overwriteLatestState(data);
        }
    }
    
    function startTrial() {
        
    }

    function endTrial() {
        enableStartButton(false);
        enableTurnLightOnButton(false);
        enableTurnLightOffButton(false);
        
        saveUpdatedTrial();
    }
    
    function initializeData() {
        data = {};
        data.glucoseCreatedData = [];
        data.glucoseUsedData = [];
        data.glucoseStoredData = [];
        data.events = [];
        
        isNewTrial = true;
    }
    
    function addEvent(eventName) {
        
        var timestamp = new Date().getTime();
        
        var event = {};
        event.name = eventName;
        event.timestamp = timestamp;
        
        data.events.push(event);
    }
    
    function plantDied() {
        addEvent('plantDied');
        plantDiedRect.show();
        plantDiedText.show();
    }
    
    function endReached() {
        addEvent('endReached');
        endReachedRect.show();
        endReachedText.show();
    }
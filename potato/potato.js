
var buttons = {};

var draw = null;

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
var glucoseIndex = 0;
var glucoseCreatedData = [];
var glucoseUsedData = [];
var glucoseStoredData = [];

var startButtonEnabled = true;
var turnLightOffButtonEnabled = false;
var turnLightOnButtonEnabled = true;
var resetButtonEnabled = false;

    function enableTurnLightOnButton(enable) {
        
        if (enable) {
            buttons.lightOnButton.button.attr({'fill-opacity': 1});
            buttons.lightOnButton.button.off('click');
            buttons.lightOnButton.button.on('click', function() {
                turnLightOn();
            });
        } else {
            buttons.lightOnButton.button.attr({'fill-opacity': 0});
            buttons.lightOnButton.button.off('click');
        }
        
        turnLightOnButtonEnabled = enable;
    }
    
    function enableTurnLightOffButton(enable) {
        if (enable) {
            buttons.lightOffButton.button.attr({'fill-opacity': 1});
            buttons.lightOffButton.button.off('click');
            buttons.lightOffButton.button.on('click', function() {
                turnLightOff();
            });
        } else {
            buttons.lightOffButton.button.attr({'fill-opacity': 0});
            buttons.lightOffButton.button.off('click');
        }
        
        turnLightOffButtonEnabled = enable;
    }
    
    function enableResetButton(enable) {
        if (enable) {
            buttons.resetButton.button.attr({'fill-opacity': 1});
            buttons.resetButton.button.off('click');
            buttons.resetButton.button.on('click', function() {
                reset();
            });
        } else {
            buttons.resetButton.button.attr({'fill-opacity': 0});
            buttons.resetButton.button.off('click');
        }
        
        resetButtonEnabled = enable;
    }

    function init() {
        initializeGraph();
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
        
        button: draw.rect(150,30).x(430).y(30).radius(10).fill('white').stroke({width:2}).opacity(1).attr({
          'fill-opacity': 1
        }).click(function() {
          start()
        }),
        buttonText: draw.text('Start').x(485).y(35).font({size: 18}).click(function() {
          start()
        })
      },
      lightOnButton: {
        button: draw.rect(150,30).x(430).y(70).radius(10).fill('white').stroke({width:2}).opacity(1).attr({
          'fill-opacity': 0
        }).click(function() {
          //turnOn()
          turnLightOn();
        }),
        buttonText: draw.text('Turn Light ON').x(451).y(75).font({size: 18}).click(function() {
          //turnOn()
          turnLightOn();
        })
      },
      lightOffButton: {
        button: draw.rect(150,30).x(430).y(110).radius(10).fill('white').stroke({width:2}).opacity(1).attr({
          'fill-opacity': 0
        }).click(function() {
          //turnOff()
          turnLightOff();
        }),
        buttonText: draw.text('Turn Light OFF').x(445).y(115).font({size: 18}).click(function() {
          //turnOff()
          turnLightOff();
        })
      },
      resetButton: {
          button: draw.rect(150,30).x(430).y(150).radius(10).fill('white').stroke({width:2}).opacity(1).attr({
            'fill-opacity': 0
          }).click(function() {
            reset();
          }),
          buttonText: draw.text('Reset').x(480).y(155).font({size: 18}).click(function() {
            reset();
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
    
    }
    

    
    function start() {
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
    }
    
    function reset() {
        
        if (running) {
            start();
        }
        
        weekNumber = 0;
        glucoseCreated = 0;
        glucoseIndex = 0;
        
        initializeGraph();
        showLeafs(1);
        showCarrot(1);
        turnLightOn();
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
                start();
            } else {
                if (lightOn) {
                    
                    if (!photonsEnabled) {
                        startPhotons();
                    }
                    
                    glucoseIndex++;
                    drawGraph(weekNumber, glucoseIndex);
                    
                    var leafNum = Math.floor(glucoseIndex / 3);
                    showLeafs(leafNum + 1);
                    
                    var carrotNum = Math.floor(glucoseIndex / 4);
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
                    drawGraph(weekNumber, glucoseIndex);
                    
                    var leafNum = Math.floor(glucoseIndex / 3);
                    showLeafs(leafNum + 1);
                    
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
        glucoseCreatedData = [[0, 0]];
        glucoseUsedData = [[0, 0]];
        glucoseStoredData = [[0, 0]];
        
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
                    data: glucoseCreatedData
                },
                {
                    name: 'Glucose Used',
                    data: glucoseUsedData
                },
                {
                    name: 'Glucose Stored',
                    data: glucoseStoredData
                }
            ]
        };
        
        chart = new Highcharts.Chart(chartOptions);
    }
    
    function calculateGlucoseCreated(glucoseIndex) {
        var glucose = 0;
        
        glucose = (10 * Math.pow(1.15, glucoseIndex)) - 10;
        
        return glucose;
    }
    
    function calculateGlucoseUsed(glucoseIndex) {
        var glucose = 0;
        
        glucose = (10 * Math.pow(1.10, glucoseIndex)) - 10;
        
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
        var glucoseCreated = calculateGlucoseCreated(glucoseIndex);
        var glucoseUsed = calculateGlucoseUsed(weekNumber);
        var glucoseStored = glucoseCreated - glucoseUsed;
        
        
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
            start();
            alert('Your plant has died :(');
        }
        
        return glucoseStored;
    }

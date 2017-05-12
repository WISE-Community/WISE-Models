;;GLOBAL CLIMATE CHANGE TRADEOFF MODEL
;; by: Jonathan Vitale
;;
breed [ clouds cloud ]
breed [ SRs SR]
breed [ IRs IR ]
breed [ heats heat ]
breed [ CO2s CO2 ]
breed [ static-labels static-label]
breed [ dynamic-labels dynamic-label]
breed [ circles circle ]
breed [ factories factory ]
breed [ trees tree ]
breed [ volcanoes volcano ]
breed [ windmills windmill ]
breed [ windmill-bases windmill-base]
breed [ cars car ]

clouds-own [ cloud-num ]

factories-own [ emissions-per-tick emissions-store initial-cost cost-per-tick cost-per-tick-sd energy-produced-per-tick tick-count]
windmills-own [ emissions-per-tick emissions-store initial-cost cost-per-tick cost-per-tick-sd energy-produced-per-tick]
cars-own [ electric? engine-type emissions-per-tick emissions-store initial-cost cost-per-tick cost-per-tick-sd energy-produced-per-tick energy-needed-per-tick]
trees-own [ absorption-per-tick absorption-store ]


globals [
  init?
  running?
  trial-num
  my-ticks
  sky-top
  earth-top
  temperature
  num-CO2
  cost
  cost-sum
  energy-produced ;; total energy produced by all power plants, windmills, and combustion cars
  energy-produced-sum
  energy-available ;; how much energy is available after each car uses (cars individually substract from this
  num-clouds
  albedo
  wind
  sun-brightness
  max-Heat
  heat-can-escape
  ir-absorption-percentile
  ir-emmision-percentile
  CO2-emission-period
  CO2-absorption-chance
  plot-ticks
  sunshine-ticks
  CO2-ticks
  tick-scale
  factories-release-Heat-period
  reset?
  Plot-Variable
  plot-interval
  num-cars
  percent-electric
  percent-wind
  percent-biofuel
  trial-name
  ;; output table
  table-headers
  table-vals
  table-output ;; for talking to WISE

  ;; save the values of inputs so that we can check for a change and output
  save-percent-electric
  save-Gas-or-Electric
  save-Gas-Type
  save-Electric-Source
  save-temperature
  save-CO2
  save-cost
  save-energy-produced
]
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; INITIALIZATION ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

to startup
  reset-timer
  set init? 1
  set running? 0
  clear-turtles ;;jv-new-graphing
  clear-all-plots ;;jv-new-graphing
  clear-patches ;;jv-new-graphing
  setup-constants
  setup-world
  setup-labels           ; create hidden static labels and circles (that identify a ray or heat)
  ;set initialized 1 ;;jv-new-graphing
  reset-ticks
end

;;; only needs to run once
to setup-constants
  set reset? false
  set trial-num 1
  set plot-interval 20 ;;; how often (ticks) should we plot
  set num-cars 16
  set albedo .4
  set wind 5
  set sun-brightness 0.2
  set max-Heat 20
  set tick-scale 1 ;; how fast the turtles should move - values > 12ish start breaking things
  set ir-absorption-percentile 90 ;; percent chance that IR/SR gets absorbed by the earth
  set ir-emmision-percentile 80 ;; percent chance that IR gets emmitted by the earth
  set CO2-emission-period 200 ;; ticks between natural emission of C02 from earth
  set CO2-absorption-chance 90 ;; percent chance a CO2 gets "absorbed" into the earth
  set factories-release-Heat-period 12 ;; ticks between releast of heat from factories (?)
  set sky-top (max-pycor - 5)
  set earth-top (2 + min-pycor)

  set Plot-Variable "Temperature"
  ;; setup trial names
  set table-headers ["#  " "% Elec" "Elec Source" "Gas Type" "Temp" "CO2" "Tot $ (Bil)"]
  ;; setup trials
  set table-vals []
  set table-output []
end

to setup-world
  let i 0
  set sunshine-ticks 1
  set plot-ticks 0

  ;; setup saves
  set save-percent-electric percent-electric
  set save-Gas-or-Electric Gas-or-Electric
  set save-Electric-Source Electric-Source
  set save-Gas-Type Gas-Type

  set save-temperature []
  set save-CO2 []
  set save-cost []
  set save-energy-produced []
  set cost 0
  set cost-sum 0
  set energy-produced-sum 0

  ;; inputs
  ask patches [                           ;; set colors of the world
      if (pycor = max-pycor) [ set pcolor black ]
      if (pycor < max-pycor) and (pycor > sky-top) [
        set pcolor 9 - scale-color white pycor sky-top max-pycor   ]
      if ((pycor <= sky-top) and (pycor > earth-top)) [
        set pcolor blue + 2 * (pycor + max-pycor) / max-pycor  ]
      ifelse (pycor = earth-top) [ set pcolor 50 + 9 * albedo ]
      [ifelse (pycor = earth-top - 1)
        [set pcolor 7]
        [if (pycor < earth-top) [ set pcolor red + 3 ]]
      ]
  ]
  create-SRs 5  [
     set heading 160 set color yellow    ; put in some SRs
     setxy min-pxcor + random (max-pxcor - min-pxcor)  earth-top + random max-pycor - earth-top
   ]
  create-IRs 25  [
     set heading random 360 set color magenta    ; put in some SRs
     setxy min-pxcor + random (max-pxcor - min-pxcor)  earth-top + random max-pycor - earth-top
   ]

  create-Heats 25 [ ;; start with some heat energy in the earth
    set heading (random 60 + 20)
    repeat (random 4) [rt 90]
    setxy min-pxcor + random (max-pxcor - min-pxcor) min-pycor + 1 + random (earth-top - min-pycor - 1) ;; scatter throughout earth
    set color 13 + random 2
    set shape "dot"
  ]

  ;; CO2S
   repeat 25 [
     create-CO2s 1 [
       set shape "co2"
       set size 2
       setxy random (2 * max-pxcor) + min-pxcor earth-top + random sky-top - earth-top
       set heading random 360
     ]
    ] ;; heading is used to spin molecule
    set num-CO2 count CO2s

  ;; factories
  let coal-power 0
  let wind-power 0

  set trial-name ""

  ifelse (Gas-or-Electric = "More Gas, Less Electric")[
    set percent-electric 10
    set trial-name word trial-name "Mgas-"
  ][
    ifelse (Gas-or-Electric = "Less Gas, More Electric")[
      set percent-electric 90
      set trial-name word trial-name "Lgas-"
    ][
      set percent-electric 50
      set trial-name word trial-name "Egas-"
    ]

  ]


  ifelse (Electric-Source = "More Coal, Less Wind")[
     set coal-power 9
     set trial-name word trial-name "Mcoal-"
  ][
     ifelse (Electric-Source = "Less Coal, More Wind")[
       set coal-power 1
       set trial-name word trial-name "Lcoal-"
     ][
       set coal-power 5
       set trial-name word trial-name "Ecoal-"
     ]
  ]
  set wind-power 10 - coal-power
  set percent-wind wind-power * 10

  ;if (coal-power > 0 and percent-electric > 0) [
     create-factories 1 [
       setxy 0 earth-top + 3.0
       set shape "powerplant0"
       set color gray
       set size 8
       set emissions-per-tick coal-power / 100 * percent-electric / 100
       set emissions-store 0
       set initial-cost 0
       set cost-per-tick 0.005 * coal-power / 10 * percent-electric / 100
       set cost-per-tick-sd cost-per-tick
       set energy-produced-per-tick coal-power * 2 * percent-electric / 100
       set tick-count 0
     ]
  ;]

  ;; windmills
  let num-windmills round (wind-power * percent-electric / 100)
  if (num-windmills > 0) [
    set i 0
    repeat num-windmills [
      ;; create base
      create-windmill-bases 1 [
        setxy 5.2 + 2 * i earth-top + 1
        set shape "Windmill-base"
        set size 3
      ]
      create-windmills 1 [
        setxy 5.2 + 2 * i earth-top + 3
        set shape "Windmill-wheel"
        set size 3
        set heading random 360
        set emissions-per-tick 0 * percent-electric / 100
        set emissions-store 0
        set initial-cost 1 * percent-electric / 100
        set cost-per-tick 0.0005 * percent-electric / 100
        set cost-per-tick-sd cost-per-tick / 100
        set energy-produced-per-tick 2 * percent-electric / 100
      ]
      set i i + 1
    ]
  ]

  ;; trees
  set i 0
  repeat 10 - num-windmills [
    create-trees 1 [
      setxy max-pxcor - 2 * i - 1.0 earth-top + 1.7
      set shape "tree"
      set color 67
      set size 4
      set absorption-per-tick 0.1
      set absorption-store 0
    ]
    set i i + 1
  ]
  if (false)[
    set i 0
    repeat 4 [
      create-trees 1 [
        setxy min-pxcor + 2 * i + 1.0 earth-top + 1.7
        set shape "tree"
        set color 67
        set size 4
        set absorption-per-tick 0.1
        set absorption-store 0
      ]
      set i i + 1
    ]
  ]

  ;; cars

  repeat round (percent-electric / 100 * num-cars) [
    create-cars 1 [
      setxy (random world-width - world-width / 2) earth-top - 0.5
      set shape "car"
      set size 2
      set heading 90
      set color 53
      set electric? true
      set engine-type "electric"
      set emissions-per-tick 0
      set emissions-store 0
      set initial-cost 0.5
      set cost-per-tick .0001
      set cost-per-tick-sd cost-per-tick / 5
      set energy-produced-per-tick 0
      set energy-needed-per-tick 1
    ]
  ]

  let num-cars-combust round ((100 - percent-electric) / 100 * num-cars)
  let num-cars-gas 0
  let num-cars-bio 0
  ifelse (Gas-Type = "Less Petroleum, More Natural Gas")[
    set num-cars-bio round (num-cars-combust * 0.9)
    set trial-name word trial-name "Lpetrol"
  ][
    ifelse (Gas-Type = "More Petroleum, Less Natural Gas")[
      set num-cars-bio round (num-cars-combust * 0.1)
      set trial-name word trial-name "Mpetrol"
    ][
      set num-cars-bio round (num-cars-combust * 0.5)
      set trial-name word trial-name "Epetrol"
    ]
  ]
  set num-cars-gas num-cars-combust - num-cars-bio

  ifelse (num-cars-combust > 0)[
    set percent-biofuel round (num-cars-bio / num-cars-combust * 100)
  ][
    set percent-biofuel 0
  ]

  show (word "all " num-cars " combust " num-cars-combust " gas " num-cars-gas " bio "num-cars-bio)

  repeat num-cars-gas [
    create-cars 1 [
      setxy (random world-width - world-width / 2) earth-top - 0.5
      set shape "car"
      set size 2
      set heading 90
      set color red
      set electric? false
      set emissions-per-tick 0.009
      set emissions-store 0
      set initial-cost 0
      set cost-per-tick 0.0015
      set cost-per-tick-sd cost-per-tick / 2
      set energy-produced-per-tick 1
      set energy-needed-per-tick 1
    ]
  ]

  repeat num-cars-bio [
    create-cars 1 [
      setxy (random world-width - world-width / 2) earth-top - 0.5
      set shape "car"
      set size 2
      set heading 90
      set color blue
      set electric? false
      set engine-type "biofuel"
      set emissions-per-tick 0.009 / 1.4
      set emissions-store 0
      set initial-cost 0.4
      set cost-per-tick 0.002
      set cost-per-tick-sd cost-per-tick / 2
      set energy-produced-per-tick 1
      set energy-needed-per-tick 1
    ]
  ]


  ;; clouds
  setup-clouds 1

  set temperature count IRs     ; start with a cold earth

  ;set-current-plot-pen Plot-Variable


end

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; LABELS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

to setup-labels
  ; create and place the static labels and create the circles used to label rays and heat
  ; hide them all
  create-static-labels 1 [
    set size 0
    setxy 0 0
    set label "Atmosphere"]
  create-static-labels 1 [
    set size 0
    setxy 0 Earth-top - .4
    set label "Earth Surface"]
  create-static-labels 1 [
    set size 0
    setxy 0 max-pycor - 2
    set label "Space"]
  create-static-labels 1 [
    set size 0
    setxy 0 .8 * min-pycor
    set label "Earth Interior"]
  ;ask static-labels [ht set size 0]

  create-circles 1 [   ; used to draw attention to a heat dot
     set color magenta set label "Infrared ray"]
  create-circles 1 [   ; used to draw attention to a SR
     set color yellow set label "Sun ray"]
  create-circles 1 [   ; used to draw attention to a IR ray
     set color red set label "Heat"]
  ask circles [ ht set size 2 set shape "circle 3" ] ; now the circles exist but are hidden.

end

to hide-all-labels
  ask static-labels [ht]  ; makes the lables invisible
  ask circles [ht]        ; makes the circles and their labels invisible
end

to hide-dynamic-labels
  ask circles [ht]
end

; this shows all the static labels
; and finds a representative SR, heat dot, and IR ray
; and circles each and adds a label
; the representative cannot be too close to another or to the edges of its world
to show-static-labels
  ask static-labels [st]           ; show all the static labels
end

to show-dynamic-labels
  let x 0 let y 0
  if any? SRs [
    ask one-of SRs [set x xcor set y ycor]
    ask circles with [color = yellow] [    ;place a circle on the SR and show the circle and its label
      setxy x y st ]]
  let target one-of IRs
  if not (target = nobody) [
    set x [xcor] of target set y [ycor] of target
    ask circles with [color = magenta][
      setxy x y st]]
  set target one-of heats
  if not (target = nobody) [
    set x [xcor] of target set y [ycor] of target
    ask circles with [color = red][
    setxy x y st]]
end

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; EXECUTION ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
to reset
  clear-turtles
  clear-all-plots
  clear-patches
  reset-ticks
  setup-world
  setup-labels
  set reset? false
end

to go
 ;print timer
 if (timer < 0.2)[
  ifelse (running? = 1)[
    set running? 0
    show-dynamic-labels
   ][
    ;; when presses goal after trial ends restart
    if (ticks > 1000)[
      set reset? true
    ]
    set running? 1
    hide-dynamic-labels
   ]
   ]
end

to execute
  reset-timer
  ifelse ( ; any changes in input values
    reset?
    or Electric-Source != save-Electric-Source
    or Gas-Type != save-Gas-Type
    or Gas-or-Electric != save-Gas-or-Electric
    )
  [
    reset
  ][
   if (running? = 1)[
     set my-ticks ticks
     ifelse (ticks > 1000)[
       trial-end
       set running? 0
     ][
      ;hide-dynamic-labels            ; every cycle all the labels are first hidden and, at the end of the cycle, shown
      set wind 100
      ;set wind wind + random-normal 0 5
      if (wind > 100)[set wind 100]
      if (wind < 0)[set wind 0]
      ;; on each tick we reset cost and energy to re-tally
      set cost 0
      set energy-produced 0
      set energy-available 0

      update-albedo
      run-clouds
      run-SR
      run-IR
      run-Heat
      run-CO2
      run-Windmills
      run-factories
      run-Trees
      ;; must run cars after sources of energy or electric won't run
      run-cars

      set cost-sum cost-sum + cost
      set energy-produced-sum energy-produced-sum + energy-produced

      ;;; graph stuff
      set temperature .99 * temperature + 0.01 * (count IRs)


      ifelse (plot-ticks = plot-interval or plot-ticks = 0)[
        ;; store data
        set save-temperature lput temperature save-temperature
        set save-CO2 lput num-CO2 save-CO2
        set save-cost lput cost-sum save-cost
        set save-energy-produced lput energy-produced save-energy-produced

        let val 0
        if (Plot-Variable = "Temperature")[
          set val last save-temperature
        ]
        if (Plot-Variable = "CO2")[
          set val last save-CO2
        ]
        if (Plot-Variable = "Cost")[
          set val last save-Cost
        ]
        if (Plot-Variable = "Energy Produced")[
          set val last save-energy-produced
        ]

        ;plotxy ticks / 10 val
        clear-output
        output-print "Tick" ;;; this is a flag to tell listeners that we are ready to print

        set plot-ticks 1
      ][
        set plot-ticks plot-ticks + 1
      ]
    ]
    ;show-dynamic-labels             ; if the forever execution loop is stopped, all the labels are on.
    tick
  ]
 ]
end


;;; when a trial is completed the data is saved and reported to output
to trial-end
  ;; add new values to table
  let trial []
  let header-lengths []
  let mod-table-headers []
  foreach table-headers [
    let val ""
    if (? = "Trial #" or ? = "#  " or ? = "Num")[
     set val trial-num
    ]
    if (? = "% Electric" or ? = "% Elec")[
     set val percent-electric
    ]
    if (? = "% Wind")[
     set val percent-wind
    ]
    if (? = "Electric Source" or ? = "Elec Source")[
     ifelse (Electric-Source = "More Coal, Less Wind")[
       set val "Coal > Wind"
     ][
       ifelse (Electric-Source = "Less Coal, More Wind")[
         set val "Coal < Wind"
       ][
         set val "Coal = Wind"
       ]
     ]
    ]
    if (? = "% Biofuel")[
      set val percent-biofuel
    ]
    if (? = "Fuel Type" or ? = "Gas Type")[
      ifelse (Gas-Type = "More Petroleum, Less Natural Gas")[
       set val "Petrol > Nat"
       ][
       ifelse (Gas-Type = "Less Petroleum, More Natural Gas")[
         set val "Petrol < Nat"
       ][
         set val "Petrol = Nat"
       ]
     ]
    ]
    if (? = "Temp" or ? = "Temperature" or ? = "Temp (final)" or ? = "Temperature (final)")[
     set val temperature
    ]
    if (? = "CO2" or ? = "CO2 (final)")[
     set val num-CO2
    ]
    if (? = "Cost" or ? = "Cost (avg)" or ? = "Tot $ (Bil)")[
     set val cost-sum
    ]
    if (? = "Energy" or ? = "Energy (avg)" or ? = "Energy Produced" or ? = "Energy Produced (avg)")[
     set val energy-produced-sum / ticks
    ]
    set trial lput val trial
    let head ?
    ; if not a number then make sure the length of the string is not greater than header
    ifelse (not is-number? val and length ? < length val)[
      ; add more spaces to end of header
      repeat (length val - length ?)[
        set head (word head " ")
      ]
    ][
     ;; if is a number make sure header gives space for three whole numbers, decimal and tenths
     if (is-number? val and length ? < 5)[
      repeat (5 - length ?)[
        set head (word head " ")
       ]
     ]
    ]
    let head-length length head + 2
    set mod-table-headers lput head mod-table-headers
    set header-lengths lput head-length header-lengths
  ]
  print (word "orig: " table-headers)
  print (word "new: " mod-table-headers)
  set table-vals lput trial table-vals

  set table-output fput table-headers table-vals
  output-print "End" ;;; this is a flag to tell listeners that we are ready to print
  clear-output

  ;;; print table headers
  foreach mod-table-headers [
    output-type (word ? "  ")
  ]
  output-print ""

  ;;; print underscores under headers
  foreach header-lengths [
    repeat (? - 2) [
      output-type "-"
    ]
    output-type "  "
  ]
  output-print ""

  ;;; print values row by row
  let i 0
  repeat length table-vals[
    let w item i table-vals
    let j 0
    foreach header-lengths [
      output-type make-string-length (item j w) ?
      set j j + 1
    ]
    output-print ""
    set i i + 1
  ]
  set trial-num trial-num + 1
end

to-report make-string-length [s l]
  ;show (word "value: " s " to reach " l)
  let temp-l 0
  ifelse (is-number? s)[
   set s precision s 1
   let ss s
   let temp-s s
   ; find number of digits
   while [temp-s >= 1][
    set temp-s temp-s / 10
    set temp-l temp-l + 1
   ]
   ;show (word "divided val " temp-s " length " temp-l)
   ;; if this value is does not have non-zero decimal place we need to remove two values
   if (ss - floor ss >= .1)[
     set temp-l temp-l + 2
   ]
  ][
   set temp-l length s
  ]
  if (temp-l < l)[
    let d l - temp-l
    repeat d [
     set s (word s " ")
    ]
  ]
  report s
end

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; AGENT PROCEDURES ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

to add-cloud            ;; erase clouds and then create new ones
  set num-clouds num-clouds + 1
  setup-clouds num-clouds
end

to remove-cloud
  if (num-clouds > 0 ) [
      set num-clouds num-clouds - 1
      setup-clouds num-clouds ]
end

to setup-clouds [ n ]
  ask clouds [ die ]
  let i 0
  repeat n
     [ make-cloud  i n
     set i i + 1]
end

to make-cloud [ k n ]                   ;; makes cloud number k out of n total
  let width sky-top - earth-top
  let mid ( sky-top + earth-top ) / 2
  let y mid + width * ((k / n) - 0.3 ) - 2  ;; the ratio k/n determines its altitude
  if k = 0 [set y 6 ]
  let x 2 * (random max-pxcor ) + min-pxcor
  repeat 3 + random 20 [ create-clouds 1  ;; lots of turtles make up a cloud
    [set cloud-num k
    setxy x + (random 9) - 4 y + random random 5
    set color white
    set size 2 + random 2
    set heading 90
    Set shape "cloud" ]  ]
end

to run-clouds
 ask clouds [ fd .3 * (0.1 + (3 + cloud-num) / 10) ]  ; move clouds along
end

to update-albedo
  ask patches [
    if (pycor = earth-top) [ set pcolor 50 + 9 * albedo ]
  ]
end


to run-SR
  ask SRs [
     fd .3 * tick-scale  ;; move SRs forward
     ifelse (
       ((heading < 90 or heading > 270) and (ycor >= max-pycor - 1)) or
       ((heading > 90 and heading < 270) and (ycor <= min-pycor + 1))
       )[ die ]  ;; kill rays leaving upward
     [
       if (ycor < earth-top and earth-top - ycor < 2)[ ;; if on or near the earth surface
         ifelse (100 * albedo > random 100)[
           reflect
         ][
           ifelse (random 100 > (100 - ir-absorption-percentile))[ ;; base chance of SR being turned into heat
             convert-to-Heat ;; Convert to heat half the time
           ][
             die
           ]
         ]
       ]
       if (count clouds-here > 0)[ reflect]
     ]
  ]
  ;;; jv I replaced mod with a counter
  ;if ticks mod (5 - sun-brightness) < 0
  if (sunshine-ticks = 25) [
    create-SRs tick-scale [ ;; the faster things are happening, the more SRs should be created
      set heading 160
      set color yellow
      setxy min-pxcor + random (max-pxcor - min-pxcor)  max-pycor - (random (20) / 10) ;; start the SRs anywhere along the top
    ]
    set sunshine-ticks 0
  ]
  set sunshine-ticks (sunshine-ticks + 1)
end

to reflect
  set heading 180 - heading
end

to convert-to-Heat
  ;;ifelse (count heats < max-heat)[
    set heading 135 + (random 40 - 20) ;; morph into heat energy
    repeat (random 1) [rt 90]
    set color 13 + random 2
    set breed heats
    set shape "dot"
 ;; ][
 ;;   reflect
;;  ]
end

to convert-to-IR
  set breed IRs
  set heading -50 + random 100 ;; start the IR off in a random upward direction
  set color magenta
  set shape "default"
  fd .1 * tick-scale
end


to run-IR
  ask IRs [
    if (ycor >= max-pycor - 2) [ die ]
    fd .13 * tick-scale
    if (count CO2s-here > 0)[
      set heading random 360
    ]
    if (ycor < earth-top and earth-top - ycor < 2)[
        convert-to-Heat
    ]
] ;; send off in a new direction
end

to add-CO2  ;; adds a CO2 molecules to atmosphere at a certain interval near the surface
  let width sky-top - earth-top
  create-CO2s 1 [
    set shape "co2"
    set size 2
    setxy random-xcor earth-top
    set heading (-290 + random 140)  ;; heading is used to spin molecule
    set CO2-ticks 0
    set num-CO2 count CO2s
  ]
end

to remove-CO2 ;; randomly remove 25 CO2 molecules
  repeat 25 [
    if (count CO2s > 0 ) [
      ask one-of CO2s [ die ]]]
  set num-CO2 count CO2s
end

to run-CO2
  let d 0
  set CO2-ticks (CO2-ticks + 1)
  ask CO2s [
    if (size < 2) [set size size + 0.01]
    ;  set heading heading + (random 51) - 25 ;; turn a bit
    fd (.001 * (5 + random 10)) * tick-scale ;; move forward a bit
    if ((ycor <= earth-top + 1)) [set heading 45 - random 90 ] ;; bounce off earth
    if (ycor >= sky-top) [set heading 135 + random 90]
    ]
end


to run-Heat ;; Heat moves randomly under the surface of the Earth
  ask heats [
     fd .03 * tick-scale
     if (ycor <= 0 + min-pycor )[ reflect ] ;; if heading into the earth's core, bounce
     if (ycor >= earth-top) [ reflect ] ;; if heading into earth's surface, bounce
     if (count heats > max-Heat)[    ;; if the earth is hot enough
        ask heats[
          if (ycor >= earth-top ) [  ;; if heading back into sky
            if (random 100 > (100 - ir-emmision-percentile))[
                convert-to-IR            ;; let them escape as IR with arrowhead shapes
             ;   show "to-IR (from Rule 6)"
             ]
          ]
        ]
     ]
  ]

end


to run-Factories ;; Factories produce greenhouse gases
 ask factories [
   if (emissions-per-tick > 0)[
     ;; animate
     set tick-count tick-count + 1
     if (tick-count >= 10)[
       ifelse (shape = "powerplant0")[
         set shape "powerplant1"
       ][
       ifelse (shape = "powerplant1")[
         set shape "powerplant2"
       ][
       ifelse (shape = "powerplant2")[
         set shape "powerplant3"
       ][
       ifelse (shape = "powerplant3")[
         set shape "powerplant4"
       ][
         set shape "powerplant0"
       ]]]]
       set tick-count 0
     ]
     set emissions-store emissions-store + emissions-per-tick
     set energy-produced energy-produced + energy-produced-per-tick
     set energy-available energy-available + energy-produced-per-tick
     set cost cost + random-normal cost-per-tick cost-per-tick-sd
     if (ticks <= 5)[
       set cost cost + initial-cost / 5
     ]
     if (emissions-store >= 1)[
       hatch-CO2s 1 [
         set xcor xcor - 2.2
         set ycor ycor + 1
         set shape "co2"
         set size 1
         set heading 290 + random 140
         set CO2-ticks 0
         set num-CO2 count CO2s
         fd 0.1 * tick-scale
       ]
      set emissions-store emissions-store - 1
    ]
  ]
 ]
end


to run-Windmills
  ask windmills [
    set emissions-store emissions-store + emissions-per-tick
    set energy-produced energy-produced + energy-produced-per-tick * wind / 100
    set energy-available energy-available + energy-produced-per-tick * wind / 100
    set cost cost + random-normal cost-per-tick cost-per-tick-sd
     if (ticks <= 5)[
       set cost cost + initial-cost / 5
     ]
    if (emissions-store >= 1)[
      hatch-CO2s 1 [
        set shape "co2"
        set size 1
        set heading 290 + random 140
        set CO2-ticks 0
        set num-CO2 count CO2s
        fd 0.1 * tick-scale
      ]
      set emissions-store emissions-store - 1
    ]
    set heading heading + wind / 100
  ]
end

to run-Trees ;; Trees absorb GG
  ask trees [
    set absorption-store absorption-store + absorption-per-tick

    if (absorption-store >= 0)[
      if (count CO2s in-radius 1 > 0)[
        ask one-of CO2s in-radius 1 [die]
        set absorption-store absorption-store - 1
      ]
    ]
  ]
end

to run-Cars
  ;print (word "energy " energy-available " for " count cars " cars")
  ask cars [
    set energy-produced energy-produced + energy-produced-per-tick
    set energy-available energy-available + energy-produced-per-tick
    ifelse (energy-available >= energy-needed-per-tick)[
      ;; was car recently turned off?
      if (color = black)[
        ifelse (electric?)[
          set color green
        ][
          set color red
        ]
      ]
      set energy-available energy-available - 1
      set emissions-store emissions-store + emissions-per-tick
      set cost cost + random-normal cost-per-tick cost-per-tick-sd
      if (ticks <= 50)[
       set cost cost + initial-cost / 50
      ]
      if (emissions-store >= 1)[
        hatch-CO2s 1 [
          set shape "co2"
          set size 1
          set heading 290 + random 140
          set CO2-ticks 0
          set num-CO2 count CO2s
          fd 0.1 * tick-scale
        ]
        set emissions-store emissions-store - 1
      ]
      fd 0.1
    ][
      ;;; does not run
      set color black
    ]
  ]
end
@#$#@#$#@
GRAPHICS-WINDOW
728
25
1296
373
25
14
10.9412
1
11
1
1
1
0
1
0
1
-25
25
-14
14
0
0
0
ticks
30.0

BUTTON
164
10
219
43
Reset
ifelse (init? = 0) [startup][reset]
NIL
1
T
OBSERVER
NIL
NIL
NIL
NIL
1

BUTTON
15
24
70
57
On/Off
execute
T
1
T
OBSERVER
NIL
NIL
NIL
NIL
1

BUTTON
121
85
223
118
Watch a sunray
watch one-of SRs with [ycor > (max-pycor / 2 ) and heading > 90 ]
NIL
1
T
OBSERVER
NIL
NIL
NIL
NIL
1

OUTPUT
710
404
1206
455
10

BUTTON
27
85
112
118
Watch a CO2
watch one-of CO2s
NIL
1
T
OBSERVER
NIL
NIL
NIL
NIL
1

TEXTBOX
399
122
549
140
For Electric Cars:
13
0.0
1

TEXTBOX
217
121
367
139
For Combustion Cars:
13
0.0
1

BUTTON
233
85
345
118
Stop Watching
reset-perspective
NIL
1
T
OBSERVER
NIL
NIL
NIL
NIL
1

CHOOSER
212
155
406
200
Gas-Type
Gas-Type
"More Petroleum, Less Natural Gas" "Equal Petroleum and Natural Gas" "Less Petroleum, More Natural Gas"
0

TEXTBOX
39
119
206
167
What type of cars?
13
0.0
1

CHOOSER
420
153
587
198
Electric-Source
Electric-Source
"More Coal, Less Wind" "Equal Coal and Wind" "Less Coal, More Wind"
2

BUTTON
101
10
156
43
Go
go
NIL
1
T
OBSERVER
NIL
NIL
NIL
NIL
1

TEXTBOX
10
6
160
24
Keep this On!
12
15.0
1

CHOOSER
27
155
202
200
Gas-or-Electric
Gas-or-Electric
"More Gas, Less Electric" "Equal Gas and Electric" "Less Gas, More Electric"
2

@#$#@#$#@
## WHAT IS IT?

This is a model of energy flow in the earth. It shows the earth as rose colored. On the earth surface is a green strip. Above that is a blue atmosphere and black space at the top. Clouds and CO2 molecules can be added to the atmosphere. The CO2 molecules represent greenhouse gasses that block infrared light that the earth emits.

## HOW IT WORKS

Yellow arrowheads stream downward representing sunlight energy. Some of the sunlight reflects off clouds and more can reflect off the earth surface.

If sunlight is absorbed by the earth, it turns into a red dot, representing heat energy. Each dot represents the energy of one yellow sunlight arrowhead. The red dots randomly move around the earth. The temperature of the earth is related to the total number of red dots.

Sometimes the red dots transform into infrared (IR) light that heads toward space, carrying off energy. The probability of a red dot becoming IR light depends on the earth temperature. When the earth is cold, few red dots cause IR light; when it is hot, most do. The IR energy is represented by a magenta arrowhead. Each carries the same energy as a yellow arrowhead and as a red dot. The IR light goes through clouds but can bounce off CO2 molecules.

## HOW TO USE IT

The "sun-brightness" slider controls how much sun energy enters the earth atmosphere. A value of 1.0 corresponds to our sun. Higher values allow you to see what would happen if the earth was closer to the sun, or if the sun got brighter.

The "albedo" slider controls how much of the sun energy hitting the earth is absorbed.
If the albedo is 1.0, the earth reflects all sunlight. This could happen if the earth froze and is indicated by a white surface. If the albedo is zero, the earth absorbs all sunlight. This is indicated as a black surface. The earth's albedo is about 0.6.

You can add and remove clouds with buttons. Clouds block sunlight but not IR.

You can add and remove greenhouse gasses, represented as CO2 molecules. CO2 blocks IR light but not sunlight. The buttons add and subtract molecules in groups of 25 up to 150.

The temperature of the earth is related to the amount of heat in the earth. The more red dots you see, the hotter it is.

## THINGS TO NOTICE

Follow a single sunlight arrowhead. This easier if you slow down the model using the slider at the top of the model.

Here is a better way to follow an arrowhead. Stop the model and control-click on an arrowhead, select the last item "turle" followed by a number. This opens a sub-menu where you can select "watch" followed by a number. Now when you run the model, you will see a circle around that arrowhead.

What happens to the arrowhead when it hits the earth? Describe its later path. Does it escape the earth? What happens then? Do all arrowheads follow similar paths?

## THINGS TO TRY

1. Play with model. Change the albedo and run the model.
Add clouds and CO2 to the model and then watch a single sunlight arrowhead.
What is the highest earth temperature you can produce?

2. Run the model with a bright sun but no clouds and no CO2. What happens to the temperature? It should rise quickly and then settle down around 50 degrees. Why does it stop rising? Why does the temperatuer continue to bounce around? Remember, the temperature reflects the number of red dots in the earth. When the temperature is constant, there about as many incoming yellow arrowheads as outgoing IR ones. Why?

3. Explore the effect of albedo holding everything else constant. Does increasing the albedo increase or decrease the earth temperature? When you experiment, be sure to run the model long enough for the temperature to settle down.

4. Explore the effect of clouds holding everything else constant.

5. Explore the effect of adding 100 CO2 molecules. What is the cause of the change you observe. Follow one sunlight arrowhead now.

## DETAILS ABOUT THE MODEL

There is a relation between the number of red dots in the earth and the temperature of the earth. This is because the earth temperature goes up as the total thermal energy is increased. Thermal energy is added by sunlight that reaches the earth as well as from infrared (IR) light reflected down to the earth. Thermal energy is removed by IR emitted by the earth. The balance of these determines the energy in the earth with is proportional to its temperature.

There are, of course, many simplifications in this model. The earth is not a single temperature, does not have a single albedo, and does not have a single heat capacity. Visible light is somewhat absorbed by CO2 and some IR light does bounce off clouds. No model is completely accurate. What is important, is that a model react in some ways like the system it is supposed to model. This model does that, showing how the greenhouse effect is caused by CO2 and other gases that absorb IR.

## CREDITS AND REFERENCES

Created Nov 19, 2005 by Robert Tinker for the TELS project. Updated Jan 9, 2006.
@#$#@#$#@
default
true
0
Polygon -7500403 true true 150 5 40 250 150 205 260 250

airplane
true
0
Polygon -7500403 true true 150 0 135 15 120 60 120 105 15 165 15 195 120 180 135 240 105 270 120 285 150 270 180 285 210 270 165 240 180 180 285 195 285 165 180 105 180 60 165 15

arrow
true
0
Polygon -7500403 true true 150 0 0 150 105 150 105 293 195 293 195 150 300 150

black ball
true
0
Circle -7500403 true true 45 90 120
Circle -7500403 true true 135 90 120

box
false
0
Polygon -7500403 true true 150 285 285 225 285 75 150 135
Polygon -7500403 true true 150 135 15 75 150 15 285 75
Polygon -7500403 true true 15 75 15 225 150 285 150 135
Line -16777216 false 150 285 150 135
Line -16777216 false 150 135 15 75
Line -16777216 false 150 135 285 75

bug
true
0
Circle -7500403 true true 96 182 108
Circle -7500403 true true 110 127 80
Circle -7500403 true true 110 75 80
Line -7500403 true 150 100 80 30
Line -7500403 true 150 100 220 30

butterfly
true
0
Polygon -7500403 true true 150 165 209 199 225 225 225 255 195 270 165 255 150 240
Polygon -7500403 true true 150 165 89 198 75 225 75 255 105 270 135 255 150 240
Polygon -7500403 true true 139 148 100 105 55 90 25 90 10 105 10 135 25 180 40 195 85 194 139 163
Polygon -7500403 true true 162 150 200 105 245 90 275 90 290 105 290 135 275 180 260 195 215 195 162 165
Polygon -16777216 true false 150 255 135 225 120 150 135 120 150 105 165 120 180 150 165 225
Circle -16777216 true false 135 90 30
Line -16777216 false 150 105 195 60
Line -16777216 false 150 105 105 60

car
false
0
Polygon -7500403 true true 300 180 279 164 261 144 240 135 226 132 213 106 203 84 185 63 159 50 135 50 75 60 0 150 0 165 0 225 300 225 300 180
Circle -16777216 true false 180 180 90
Circle -16777216 true false 30 180 90
Polygon -16777216 true false 162 80 132 78 134 135 209 135 194 105 189 96 180 89
Circle -7500403 true true 47 195 58
Circle -7500403 true true 195 195 58

circle
false
0
Circle -7500403 true true 0 0 300

circle 3
false
0
Circle -7500403 false true 2 2 297
Circle -7500403 false true 12 12 277
Circle -7500403 false true 23 23 255

cloud
false
0
Circle -7500403 true true 13 118 94
Circle -7500403 true true 86 101 127
Circle -7500403 true true 51 51 108
Circle -7500403 true true 118 43 95
Circle -7500403 true true 158 68 134

co2
true
0
Circle -16777216 true false 0 90 120
Circle -16777216 true false 180 90 120
Circle -13345367 true false 75 75 150

cow
false
0
Polygon -7500403 true true 200 193 197 249 179 249 177 196 166 187 140 189 93 191 78 179 72 211 49 209 48 181 37 149 25 120 25 89 45 72 103 84 179 75 198 76 252 64 272 81 293 103 285 121 255 121 242 118 224 167
Polygon -7500403 true true 73 210 86 251 62 249 48 208
Polygon -7500403 true true 25 114 16 195 9 204 23 213 25 200 39 123

cylinder
false
0
Circle -7500403 true true 0 0 300

dot
false
0
Circle -7500403 true true 90 75 120

elecstation
false
3
Rectangle -7500403 true false 15 225 285 270
Rectangle -10899396 true false 30 105 270 120
Rectangle -7500403 true false 60 120 75 225
Rectangle -7500403 true false 225 120 240 225
Rectangle -14835848 true false 120 150 165 225
Rectangle -16777216 true false 165 180 180 210
Line -16777216 false 165 210 135 210
Rectangle -16777216 true false 135 195 150 210
Rectangle -1 true false 45 30 255 90
Rectangle -7500403 true false 135 90 150 105
Polygon -13840069 true false 70 33 52 49 71 67 52 84 82 66 62 49 76 31
Line -16777216 false 116 38 92 38
Line -16777216 false 116 60 92 60
Line -16777216 false 116 83 92 83
Line -16777216 false 93 39 93 83
Line -16777216 false 135 40 135 84
Line -16777216 false 159 83 135 83
Line -16777216 false 196 83 172 83
Line -16777216 false 235 83 211 83
Line -16777216 false 236 40 212 40
Line -16777216 false 196 40 172 40
Line -16777216 false 170 40 170 84
Line -16777216 false 210 40 210 84
Line -16777216 false 194 61 170 61

face happy
false
0
Circle -7500403 true true 8 8 285
Circle -16777216 true false 60 75 60
Circle -16777216 true false 180 75 60
Polygon -16777216 true false 150 255 90 239 62 213 47 191 67 179 90 203 109 218 150 225 192 218 210 203 227 181 251 194 236 217 212 240

face neutral
false
0
Circle -7500403 true true 8 7 285
Circle -16777216 true false 60 75 60
Circle -16777216 true false 180 75 60
Rectangle -16777216 true false 60 195 240 225

face sad
false
0
Circle -7500403 true true 8 8 285
Circle -16777216 true false 60 75 60
Circle -16777216 true false 180 75 60
Polygon -16777216 true false 150 168 90 184 62 210 47 232 67 244 90 220 109 205 150 198 192 205 210 220 227 242 251 229 236 206 212 183

factory0
false
0
Rectangle -7500403 true true 76 194 285 270
Rectangle -7500403 true true 36 95 59 231
Rectangle -16777216 true false 90 210 270 240
Line -7500403 true 90 195 90 255
Line -7500403 true 120 195 120 255
Line -7500403 true 150 195 150 240
Line -7500403 true 180 195 180 255
Line -7500403 true 210 210 210 240
Line -7500403 true 240 210 240 240
Line -7500403 true 90 225 270 225
Rectangle -7500403 true true 14 228 78 270

factory1
false
0
Circle -1 true false 39 54 42
Rectangle -7500403 true true 76 194 285 270
Rectangle -7500403 true true 36 95 59 231
Rectangle -16777216 true false 90 210 270 240
Line -7500403 true 90 195 90 255
Line -7500403 true 120 195 120 255
Line -7500403 true 150 195 150 240
Line -7500403 true 180 195 180 255
Line -7500403 true 210 210 210 240
Line -7500403 true 240 210 240 240
Line -7500403 true 90 225 270 225
Rectangle -7500403 true true 14 228 78 270

factory2
false
0
Circle -1 true false 45 15 60
Rectangle -7500403 true true 76 194 285 270
Rectangle -7500403 true true 36 95 59 231
Rectangle -16777216 true false 90 210 270 240
Line -7500403 true 90 195 90 255
Line -7500403 true 120 195 120 255
Line -7500403 true 150 195 150 240
Line -7500403 true 180 195 180 255
Line -7500403 true 210 210 210 240
Line -7500403 true 240 210 240 240
Line -7500403 true 90 225 270 225
Rectangle -7500403 true true 14 228 78 270
Circle -1 true false 39 54 42

factory3
false
0
Circle -1 true false 53 23 44
Rectangle -7500403 true true 76 194 285 270
Rectangle -7500403 true true 36 95 59 231
Rectangle -16777216 true false 90 210 270 240
Line -7500403 true 90 195 90 255
Line -7500403 true 120 195 120 255
Line -7500403 true 150 195 150 240
Line -7500403 true 180 195 180 255
Line -7500403 true 210 210 210 240
Line -7500403 true 240 210 240 240
Line -7500403 true 90 225 270 225
Rectangle -7500403 true true 14 228 78 270
Circle -1 true false 39 54 42
Circle -1 true false 83 -6 66

factory4
false
0
Circle -1 true false 45 15 60
Rectangle -7500403 true true 76 194 285 270
Rectangle -7500403 true true 36 95 59 231
Rectangle -16777216 true false 90 210 270 240
Line -7500403 true 90 195 90 255
Line -7500403 true 120 195 120 255
Line -7500403 true 150 195 150 240
Line -7500403 true 180 195 180 255
Line -7500403 true 210 210 210 240
Line -7500403 true 240 210 240 240
Line -7500403 true 90 225 270 225
Rectangle -7500403 true true 14 228 78 270
Circle -1 true false 39 54 42
Circle -1 true false 93 4 47
Circle -1 true false 133 -5 50

fish
false
0
Polygon -1 true false 44 131 21 87 15 86 0 120 15 150 0 180 13 214 20 212 45 166
Polygon -1 true false 135 195 119 235 95 218 76 210 46 204 60 165
Polygon -1 true false 75 45 83 77 71 103 86 114 166 78 135 60
Polygon -7500403 true true 30 136 151 77 226 81 280 119 292 146 292 160 287 170 270 195 195 210 151 212 30 166
Circle -16777216 true false 215 106 30

flag
false
0
Rectangle -7500403 true true 60 15 75 300
Polygon -7500403 true true 90 150 270 90 90 30
Line -7500403 true 75 135 90 135
Line -7500403 true 75 45 90 45

flower
false
0
Polygon -10899396 true false 135 120 165 165 180 210 180 240 150 300 165 300 195 240 195 195 165 135
Circle -7500403 true true 85 132 38
Circle -7500403 true true 130 147 38
Circle -7500403 true true 192 85 38
Circle -7500403 true true 85 40 38
Circle -7500403 true true 177 40 38
Circle -7500403 true true 177 132 38
Circle -7500403 true true 70 85 38
Circle -7500403 true true 130 25 38
Circle -7500403 true true 96 51 108
Circle -16777216 true false 113 68 74
Polygon -10899396 true false 189 233 219 188 249 173 279 188 234 218
Polygon -10899396 true false 180 255 150 210 105 210 75 240 135 240

house
false
0
Rectangle -7500403 true true 45 120 255 285
Rectangle -16777216 true false 120 210 180 285
Polygon -7500403 true true 15 120 150 15 285 120
Line -16777216 false 30 120 270 120

leaf
false
0
Polygon -7500403 true true 150 210 135 195 120 210 60 210 30 195 60 180 60 165 15 135 30 120 15 105 40 104 45 90 60 90 90 105 105 120 120 120 105 60 120 60 135 30 150 15 165 30 180 60 195 60 180 120 195 120 210 105 240 90 255 90 263 104 285 105 270 120 285 135 240 165 240 180 270 195 240 210 180 210 165 195
Polygon -7500403 true true 135 195 135 240 120 255 105 255 105 285 135 285 165 240 165 195

line
true
0
Line -7500403 true 150 0 150 300

line half
true
0
Line -7500403 true 150 0 150 150

molecule water
true
0
Circle -1 true false 183 63 84
Circle -16777216 false false 183 63 84
Circle -7500403 true true 75 75 150
Circle -16777216 false false 75 75 150
Circle -1 true false 33 63 84
Circle -16777216 false false 33 63 84

pentagon
false
0
Polygon -7500403 true true 150 15 15 120 60 285 240 285 285 120

person
false
0
Circle -7500403 true true 110 5 80
Polygon -7500403 true true 105 90 120 195 90 285 105 300 135 300 150 225 165 300 195 300 210 285 180 195 195 90
Rectangle -7500403 true true 127 79 172 94
Polygon -7500403 true true 195 90 240 150 225 180 165 105
Polygon -7500403 true true 105 90 60 150 75 180 135 105

plant
false
0
Rectangle -7500403 true true 135 90 165 300
Polygon -7500403 true true 135 255 90 210 45 195 75 255 135 285
Polygon -7500403 true true 165 255 210 210 255 195 225 255 165 285
Polygon -7500403 true true 135 180 90 135 45 120 75 180 135 210
Polygon -7500403 true true 165 180 165 210 225 180 255 120 210 135
Polygon -7500403 true true 135 105 90 60 45 45 75 105 135 135
Polygon -7500403 true true 165 105 165 135 225 105 255 45 210 60
Polygon -7500403 true true 135 90 120 45 150 15 180 45 165 90

powerplant0
false
0
Line -16777216 false 0 255 300 255
Rectangle -7500403 true true 151 194 285 270
Rectangle -16777216 true false 165 210 270 240
Line -7500403 true 240 195 240 255
Line -7500403 true 210 195 210 255
Line -7500403 true 150 195 150 240
Line -7500403 true 180 195 180 255
Line -7500403 true 165 225 270 225
Rectangle -7500403 true true 15 225 165 270
Polygon -7500403 true true 15 225 45 165 30 90 105 90 90 165 120 225
Line -16777216 false 15 225 120 225
Line -16777216 false 30 90 105 90
Line -16777216 false 44 93 91 93

powerplant1
false
0
Line -16777216 false 300 255 -15 255
Rectangle -7500403 true true 151 194 285 270
Rectangle -16777216 true false 165 210 270 240
Line -7500403 true 240 195 240 255
Line -7500403 true 210 195 210 255
Line -7500403 true 150 195 150 240
Line -7500403 true 180 195 180 255
Line -7500403 true 165 225 270 225
Rectangle -7500403 true true 15 225 165 270
Polygon -7500403 true true 15 225 45 165 30 90 105 90 90 165 120 225
Line -16777216 false 15 225 120 225
Line -16777216 false 30 90 105 90
Line -16777216 false 44 93 91 93
Circle -1 true false 46 53 41

powerplant2
false
0
Line -16777216 false 300 255 -15 255
Rectangle -7500403 true true 151 194 285 270
Rectangle -16777216 true false 165 210 270 240
Line -7500403 true 240 195 240 255
Line -7500403 true 210 195 210 255
Line -7500403 true 150 195 150 240
Line -7500403 true 180 195 180 255
Line -7500403 true 165 225 270 225
Rectangle -7500403 true true 15 225 165 270
Polygon -7500403 true true 15 225 45 165 30 90 105 90 90 165 120 225
Line -16777216 false 15 225 120 225
Line -16777216 false 30 90 105 90
Line -16777216 false 44 93 91 93
Circle -1 true false 50 61 32
Circle -1 true false 70 27 54

powerplant3
false
0
Line -16777216 false 300 255 -15 255
Rectangle -7500403 true true 151 194 285 270
Rectangle -16777216 true false 165 210 270 240
Line -7500403 true 240 195 240 255
Line -7500403 true 210 195 210 255
Line -7500403 true 150 195 150 240
Line -7500403 true 180 195 180 255
Line -7500403 true 165 225 270 225
Rectangle -7500403 true true 15 225 165 270
Polygon -7500403 true true 15 225 45 165 30 90 105 90 90 165 120 225
Line -16777216 false 15 225 120 225
Line -16777216 false 30 90 105 90
Line -16777216 false 44 93 91 93
Circle -1 true false 36 50 42
Circle -1 true false 74 35 38
Circle -1 true false 99 10 62

powerplant4
false
0
Line -16777216 false 300 255 -30 255
Rectangle -7500403 true true 151 194 285 270
Rectangle -16777216 true false 165 210 270 240
Line -7500403 true 240 195 240 255
Line -7500403 true 210 195 210 255
Line -7500403 true 150 195 150 240
Line -7500403 true 180 195 180 255
Line -7500403 true 165 225 270 225
Rectangle -7500403 true true 15 225 165 270
Polygon -7500403 true true 15 225 45 165 30 90 105 90 90 165 120 225
Line -16777216 false 15 225 120 225
Line -16777216 false 30 90 105 90
Line -16777216 false 44 93 91 93
Circle -1 true false 38 52 38
Circle -1 true false 64 25 58
Circle -1 true false 107 18 46
Circle -1 true false 133 6 66

square
false
0
Rectangle -7500403 true true 30 30 270 270

square 2
false
0
Rectangle -7500403 true true 30 30 270 270
Rectangle -16777216 true false 60 60 240 240

star
false
0
Polygon -7500403 true true 151 1 185 108 298 108 207 175 242 282 151 216 59 282 94 175 3 108 116 108

target
false
0
Circle -7500403 true true 0 0 300
Circle -16777216 true false 30 30 240
Circle -7500403 true true 60 60 180
Circle -16777216 true false 90 90 120
Circle -7500403 true true 120 120 60

tree
false
0
Circle -7500403 true true 118 3 94
Rectangle -6459832 true false 120 195 180 300
Circle -7500403 true true 65 21 108
Circle -7500403 true true 116 41 127
Circle -7500403 true true 45 90 120
Circle -7500403 true true 104 74 152

triangle
false
0
Polygon -7500403 true true 150 30 15 255 285 255

triangle 2
false
0
Polygon -7500403 true true 150 30 15 255 285 255
Polygon -16777216 true false 151 99 225 223 75 224

truck
false
0
Rectangle -7500403 true true 4 45 195 187
Polygon -7500403 true true 296 193 296 150 259 134 244 104 208 104 207 194
Rectangle -1 true false 195 60 195 105
Polygon -16777216 true false 238 112 252 141 219 141 218 112
Circle -16777216 true false 234 174 42
Rectangle -7500403 true true 181 185 214 194
Circle -16777216 true false 144 174 42
Circle -16777216 true false 24 174 42
Circle -7500403 false true 24 174 42
Circle -7500403 false true 144 174 42
Circle -7500403 false true 234 174 42

turtle
true
0
Polygon -10899396 true false 215 204 240 233 246 254 228 266 215 252 193 210
Polygon -10899396 true false 195 90 225 75 245 75 260 89 269 108 261 124 240 105 225 105 210 105
Polygon -10899396 true false 105 90 75 75 55 75 40 89 31 108 39 124 60 105 75 105 90 105
Polygon -10899396 true false 132 85 134 64 107 51 108 17 150 2 192 18 192 52 169 65 172 87
Polygon -10899396 true false 85 204 60 233 54 254 72 266 85 252 107 210
Polygon -7500403 true true 119 75 179 75 209 101 224 135 220 225 175 261 128 261 81 224 74 135 88 99

volcano
true
0
Polygon -6459832 true false 45 225 255 225 180 120 165 135 150 120 135 135 120 120 45 225
Polygon -1 true false 120 120 135 105 150 120 165 105 180 120 165 135 150 135 135 135

wheel
false
0
Circle -7500403 true true 3 3 294
Circle -16777216 true false 30 30 240
Line -7500403 true 150 285 150 15
Line -7500403 true 15 150 285 150
Circle -7500403 true true 120 120 60
Line -7500403 true 216 40 79 269
Line -7500403 true 40 84 269 221
Line -7500403 true 40 216 269 79
Line -7500403 true 84 40 221 269

windmill-base
false
1
Line -16777216 false 300 229 0 229
Polygon -7500403 true false 120 270 134 0 165 0 180 270

windmill-wheel
true
0
Circle -1 true false 129 129 42
Polygon -1 true false 162 150 191 138 222 132 259 133 284 142 294 150 281 160 261 164 225 164 190 160
Polygon -1 true false 149 158 161 187 167 218 166 255 157 280 149 290 139 277 135 257 135 221 139 186
Polygon -1 true false 151 142 139 113 133 82 134 45 143 20 151 10 161 23 165 43 165 79 161 114
Polygon -1 true false 142 149 113 161 82 167 45 166 20 157 10 149 23 139 43 135 79 135 114 139
Circle -16777216 false false 129 129 42

x
false
0
Polygon -7500403 true true 270 75 225 30 30 225 75 270
Polygon -7500403 true true 30 75 75 30 270 225 225 270

@#$#@#$#@
NetLogo 5.3.1
@#$#@#$#@
@#$#@#$#@
@#$#@#$#@
@#$#@#$#@
@#$#@#$#@
default
0.0
-0.2 0 0.0 1.0
0.0 1 1.0 0.0
0.2 0 0.0 1.0
link direction
true
0
Line -7500403 true 150 150 90 180
Line -7500403 true 150 150 210 180

@#$#@#$#@
0
@#$#@#$#@

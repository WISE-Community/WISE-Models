 ; Thermo software
; Oct 21, 2015
; Bob
; Aug 22, 2016 Hiroki Added chooser for each material, which updates when a choice is selected instead of clicking on the material

; A microworld for creating and exploring materials with various conductivities
; Generates "research-data" text in the following format
; "[New Dataset 30.7 Pause [[[52 14.2 25 Orange: Aluminium/Cork] [52 12 55 Green: Cardboard/Cork] [52 17 0 Experiment 1]] [[2.9 2.8 25] [2.3 2.1 25]....
; A string consisting of a list of multiple datasets each deliminted by "New Dataset"
; After "New Dataset" is the time since start, the button that initiated this save, three list of label information and the data
; The label information contains the u-v location, color, and text of each label.
; The data consists of triplets of time (since starting the current run), the temperature, and the color (of the thermometer that generated this point)

; Every patch has a sprite on top of it.
; The software uses ~10K sprites to show the temperature and to vary its transparency
; When new objects are drawn, their color stays in the patches
;    and all the thermo properties are given to the patch
; Sept 21 corrected scaling of the functions--until now, they remained fixed when the graph was rescaled
;    later removed because of interactions with re-scaling.

Globals [
  one-layer?
  experiment-number
  saved-data               ; a list of experiment data
  next-dataset             ; index into the saved data
  run-pressed?             ; true only if the run button was the last pressed
  research-data            ; saves all data in CSV format

  ; Mouse variables
  old-mouse-up?
  old-mouse-xcor
  old-mouse-ycor
  old-time                 ; used to detect hovering. Possibly useful to log
  nearby                   ; the distance from the mouse to an object that 'feels' like a hit

  ; window variables
  separator                ; the line used separate the model and graph
  v-margin                 ; space at the top and bottom of the model without sprites, where messages can be placed
  buffer                   ; the width of a boundary of the model where the mouse cannot go
  ptch-size
  ratio                    ; the relative size of a patch compared to 3.41, the original size
  current-half-state       ; the state of the left half of the model window as it is being constructed
  half-state-list          ; a list of half-states, each consisting of one or more objects of the form [<d> u0 v0 u1 v1]

  ; variables supporting pull-downs
  temperature
  actions
  model-tools
  graph-tools
  cursor-shows

  material-properties
  model-tool-properties
  action-properties
  old-pull-down
  old-material1
  old-material2
  old-model-tools
  old-graph-tools
  old-actions
  old-temperature-range
  old-temperature-setter
;  temperature                 ; the temperature selected after setting the range and "temperature-setter"
  min-temp max-temp           ; the temperature range selected

  ; thermometer variables
  max-number-of-thermometers  ; if more than six are needed, the following two lists need to be created with more items.
  thermometer-colors          ; list of colors of length >= number-of-thermometers
  thermometers-used?          ; A list that eeps track of the number of thermometers already placed-a list of true and false
  active-thermometer          ; the who of the thermometer being dragged. Zero indicates none.
  T-units                     ; the temperature units shown
  default-temp                ; the temperature of objects when first made
  alpha                       ; the transparancy of the sprites 0-255

  ; model state variables
  half-states                 ; a list of states of half-models--models that fill half the model state
  left-pointer          ; the item in the variable model-states that defines the current left half of the model space
  right-pointer         ; the item for the right hand state
  divider                     ; the centr of the model space

  ; Painting variables
  vacuum-color
  air-color
  ;current-color        ; the color of the material currently being created
  ;current-conductivity ; the conductivity of the material currently being created
  current-background   ; air or vacuum
  brush-size           ; the diameter of the brush that draws
  reporter-who         ; saves the who of the first of six reporters used for reporting values near the mouse
  cursor-who           ; the who of the lower of two cursor agents
  rectangle-who        ; the who to 6 white patchs to write on
  corner-who           ; used to capture the first corner's who when drawing a selection rectangle
  first-corner-u       ; used to save the starting corners of the rectangle used in fill
  first-corner-v

  ; Moving variables
  under-rectangle      ; a description of all the patches under the latest rectangle
  temperature-map      ; used to preserve the temperature of the object as it is moved (not implemented)
  starting-u           ; the u,v coordinates of the mouse at the start of a move
  starting-v

  ; Action variables
  view-temperature?     ; records latest of show temp or show material
  starting-temps        ; the temperatures of the model when run is hit
;  saved-state           ; used to save the state of the model from the Action pull-down
;  erased-state          ; used to save the state of the model before erasing it.
  mode                  ; set to "Ready" "Running" or "Paused"
  view                  ; set to "Temperature" "Material" or "Overlay"
  model-source          ; set to "Starting" "Saved" and "Restored" or blank
  flow-speed            ; controls model speed

  ; heater/cooler variables
  active-h/c           ; the who of the heater/cooler being dragged. Zero indicates none.

  ; Graph variables
  duration              ; default duration of a run, in seconds
  deviation-width       ; the width of the deviation bar at the right of the graph
  wind-umin wind-umax wind-vmin wind-vmax  ; define the graphing window
  mx bx my by           ; transformation coefs: u=mx*x + bx and v=my*y + by (u,v are screen coord; x,y are problem coords)
  grid-umax grid-umin   ; the boundaries of the graphing grid (as opposed to window boundaries)
  grid-vmax grid-vmin
  edge edge+            ; the distance between the window and the grid in screen units
  grid-xmin grid-xmax grid-xlabel
  grid-ymin grid-ymax grid-ylabel
  grid-separation       ; target number of pixels per grid line
  tic-length            ; number of pixels the tic extends beyond the axis
  line-width            ; width of lines in the grid.
  time-zero             ; used to hold the starting time for a run
  time-of-pause         ; used to correct time when paused
  delay                 ; counts the total paused time in a run
  making-graph-selection?      ; used to indicate the user is making a graph selection
  moving-square-zero?   ; set by mouse-down if cursor is near square zero that is used for generating a function
  moving-square-one?    ; ditto for square one
  graph-selection-made? ; indicates that there is a valid grid selection waiting for action (zoom, erase, hide, unhide, select)
  new-mouse-xcor        ; second corners of the graph selection rectangle
  new-mouse-ycor
  square-who            ; the who of the first of two guide squares used to draw functions
  function-name         ; used to store the name of the function to be graphed

   ; graph colors
  grid-back-color       ; the color of the background
  grid-color
  grid-label-color
  graph-color

]

breed [titles title]      ; used for the graph title
breed [sprites sprite]    ; these cover the model and hold temperature and conductivity data
breed [thermometers thermometer]
breed [thermometer-labels thermometer-label]
breed [grid-dots grid-dot]            ; used for drawing the graphing grid.
breed [graph-dots graph-dot]          ; used for graphs
;breed [drawing-dots drawing-dot]      ; used for various tasks.

breed [cursors cursor]                ; used in the graph
breed [reporters reporter]            ; used with hover to show data

patches-own [patch-temp conductivity material-color]
thermometers-own [thermometer-label-who]
graph-dots-own [x-val y-val brightness]  ; brightness can be zero for hidden, 1 for dim and 2 for full size


to setup-experiment
 ; hand code the four options
  setup-one-layer set one-layer? true
;  setup-two-layers set one-layer? false
  set-temp BeverageTemperature set grid-ymax 105
;  set-temp 0  set grid-ymax 20
  make-thermometer -32 0
end

To startup
  ca
  initialize-globals
  initialize-pull-downs
  initialize-patches
  initialize-turtles
  initialize-model
  setup-experiment
;  draw-grid
  initialize-cursor
  reset-timer         ; used for time-stamping user actions
  reset-ticks
end

to onOff
  if mode = "Running" [
    make-heat-flow
    every (.005 * grid-xmax)[
      add-points-to-graph]
  ] ; this slows down point creation as the scale gets larger
  every .05 [
    act-on-mouse-events]                  ; needs to be fast or a click can be missed
  every .2 [
    act-on-pull-down-changes
    act-on-material1-chooser                         ; check for user actions
    act-on-material2-chooser                         ; check for user actions

;    act-on-slider-changes                ; supports only the temperature
    update-thermometer-reading            ; report temperature results
    if view-temperature? [color-sprites]
    ] ; colors patches according to their temperature
end

to initialize-model
  if empty? half-state-list [stop]
  set left-pointer 0
  draw-half-state true (item left-pointer half-state-list)
  set right-pointer 0
  draw-half-state false (item right-pointer half-state-list)
end

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;; Initialize everything ;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

to act-on-material1-chooser
   if old-material1 = "Air (No Jacket)" [stop]  ; don't allow user to switch from air...this is a limitation from the old model.
   if old-material1 != material1 [
   let old-material-color get-property material-properties old-material1 0 2
   let new-color get-property material-properties material1 0 2          ; material is a pull-down that gives a name
   ; read the material at the mouse and give all such material on the same half the material-color of the variable material
   let new-conductivity get-property material-properties material1 0 3
   ;let local-material-color 0
   ;let clicked-in-left? in-left-half? mouse-xcor mouse-ycor  ; logical used to determine which half-model was clicked
   ;ask patch mouse-xcor mouse-ycor [set local-material-color material-color]
   ;let silver-color get-property material-properties "Silver" 0 2
   ;if local-material-color = silver-color [stop]   ; cannot change the 'silver' beverage
   ;if local-material-color = air-color [stop]      ; cannot change the surround
   ; change the material-color of all patches of this type, only on the side clicked
   let maxu -1e8 let minv 1e8
   ask patches with [(material-color = old-material-color)] [
    if in-left-half? pxcor pycor [
      if pxcor > maxu [set maxu pxcor]
      if pycor < minv [set minv pycor]
      set conductivity new-conductivity
      set material-color new-color
      set pcolor new-color]
   ]
   if maxu != -1e8 and minv != 1e8 [
     ask one-of sprites-on patch (maxu - 1) (minv + 1) [
       set label-color black
       set label material1 ]
   ]

   set old-material1 material1

   stop
  ]
end

to act-on-material2-chooser
   if old-material2 = "Air (No Jacket)" [stop]  ; don't allow user to switch from air...this is a limitation from the old model.
   if old-material2 != material2 [
   let old-material-color get-property material-properties old-material2 0 2
   let new-color get-property material-properties material2 0 2          ; material is a pull-down that gives a name
   ; read the material at the mouse and give all such material on the same half the material-color of the variable material
   let new-conductivity get-property material-properties material2 0 3
   ;let local-material-color 0
   ;let clicked-in-left? in-left-half? mouse-xcor mouse-ycor  ; logical used to determine which half-model was clicked
   ;ask patch mouse-xcor mouse-ycor [set local-material-color material-color]
   ;let silver-color get-property material-properties "Silver" 0 2
   ;if local-material-color = silver-color [stop]   ; cannot change the 'silver' beverage
   ;if local-material-color = air-color [stop]      ; cannot change the surround
   ; change the material-color of all patches of this type, only on the side clicked
   let maxu -1e8 let minv 1e8
   ask patches with [(material-color = old-material-color)] [
    if not in-left-half? pxcor pycor [
      if pxcor > maxu [set maxu pxcor]
      if pycor < minv [set minv pycor]
      set conductivity new-conductivity
      set material-color new-color
      set pcolor new-color]
   ]
   if maxu != -1e8 and minv != 1e8 [
     ask one-of sprites-on patch (maxu - 1) (minv + 1) [
       set label-color black
       set label material2 ]
   ]

   set old-material2 material2

   stop
  ]
end

to initialize-globals
  ; the following provide data for the pull-downs. The first item must match one of the options of a pull-down
  ; the second item (item number 1) must be a tip to help the user understand the option
  set material-properties [   ; note: the last number is the relative thermal time constant ("conductivity")
    ["Silver" "" 9.9 400]
    ["Aluminium" "" 9 300]
    ["Teflon" "" 37 25]
    ["Lead" "" 7 100]
    ["Wood" "Draw wood in the model" brown 8]
    ["Granite" "" 127 80]
    ["Glass" "" 88 40]
    ["Cork" "Draw Cork in the model" 29 5]
    ["Cardboard" "" 38 3]
    ["Styrofoam" "" 89 3]
    ["Air" "Make the background air" 79 2.4]
    ["Air (No Jacket)" "" 79 2.4]
    ["Water" "Draw water in the model" sky 30]
    ["Vacuum" "Create a vacuum" grey 0]]

   set half-state-list [[] [[37 -53 -7 -39 7] [9.9 -50 -4 -42 4] ["Thermometer" -46 0 25 0] ] [[37 -53 -7 -39 7] [29 -51 -5 -41 5][9.9 -50 -4 -42 4] ["Thermometer" -46 0 25 0]  ]]
     ; removed ["Thermometer" -47 -12 55 0]["Thermometer" -47 -12 55 0]
   set ratio 120 / max-pxcor       ; the original design had max-pxcor = 120
                                   ; ratio is used to scale drawings
  set run-pressed? false
  set research-data ""              ; this is where all data will be stored
  set experiment-number 1
  set next-dataset 0        ; item number used to retrieve stored data
  set saved-data []
  set max-number-of-thermometers 6
  set thermometer-colors [orange green violet sky cyan magenta]
  set thermometers-used? [false false false false false false]      ; tracks which thermometers are available for use
  set active-thermometer 0                 ; the who of the thermometer being dragged
  set nearby 8 / ratio ; defines a mouse click hit radius  ***
  set old-mouse-up? false
  set old-mouse-xcor 0
  set old-mouse-ycor 0
  set old-time  0     ; used to detect hovering. Possibly useful to log
  set temperature 20
  set min-temp 0 set max-temp 100
  set temperature 20

    ; drawing window variables
  set separator -5
  set divider round (.5 * (separator + min-pxcor))
  set ptch-size 3.41 * ratio      ; the original design had patch-size 3.41
  set default-temp 20
  set T-units "°C"
  set buffer 0                    ; margin around the modeling space
  set view-temperature? false     ; show the material view
  set moving-square-zero? false
  set moving-square-one? false        ; list of half-states--the description of half of the model window
  set current-half-state []       ; fills with object definitions as the author creates a model
  set left-pointer 0        ; pointers into half-states
  set right-pointer 0

  set v-margin 4                ; space at the top and bottom of the world with no sprites
  set mode "Ready"
  set view "Material"
  set flow-speed .0007

  ; various colors
  set grid-back-color 9.5      ; the color of the background
  set grid-color blue + 3
  set grid-label-color blue - 1
  set graph-color green     ; to be removed-
  set air-color get-property material-properties "Air" 0 2
  set vacuum-color get-property material-properties "Vacuum" 0 2

  set graph-selection-made? false      ; true if there is a valid selection rectangle showing, waiting for action
  set making-graph-selection? false    ; true only when the selection rectangle is being made

;  reset-graph

end

to initialize-pull-downs
  set old-pull-down ""         ; used to keep track of which pull-down was previously used
  set material1 "Glass"
  set material2 "Glass"
  set actions "Show Material Only"
  set actions "None"
  set model-tools "None"
  set old-material1 material1
  set old-material2 material2
  set old-model-tools model-tools
  set old-actions actions
  handle-actions-pull-down
  set graph-tools "--------"
end

to initialize-patches
 let con get-property material-properties "Air" 0 3  ; finds the conductivity of air
 ask patches [            ; draw backgrounds
  if pxcor < (separator + 1)  [
    set pcolor air-color
    set material-color air-color
    set patch-temp 20
    set conductivity con]  ; change this if material-properties for air are changed
;  if pxcor > (separator + 1)  [set pcolor grid-back-color]
  if pxcor = max-pxcor or pxcor = min-pxcor or
     pycor = max-pycor or pycor = min-pycor [
       set pcolor black]]
;  ask patches with [pxcor = divider][
;    set pcolor black]
  set current-background "Air"
end

to initialize-turtles

  ; initialize the sprites that show the temperature color
  let i min-pxcor + 1           ; create a sprite on every integer coordinate in the model space
  while [i < separator][
    let j min-pycor + (v-margin + 1 ) / ratio
    while [j < (max-pycor - v-margin / ratio)] [  ; top margin provides space for messages at top of screen
      create-sprites 1 [
        setxy i j
        set size 1.24        ; this just fills the grid of patches
        set shape "Square"
        set heading 0]
      set j j + 1]
    set i i + 1]
  set alpha 0   ; make them transparent
  color-sprites ; color the sprites based on the temperature of the patch they are on

  ; initialize the reporter              ; used for messages and tips
  create-reporters 1 [set size 0 set reporter-who who] ; Need up to six reporters
  create-reporters 6 [set size 0]                      ; these will have successive values of who
  ; the first reporter is used for both sides. The next five are used for values at the cursor
  ; the last is used for the x-axis readout
end

to initialize-cursor ; needs to come after drawing the grid.
  set cursor-who 0       ; saves the who of the lower cursor dot
  create-cursors 1 [
    set cursor-who who
    setxy grid-umin grid-vmin
    set size 0]
  create-cursors 1 [
    set color gray
    setxy grid-umin grid-vmax
    set size 0
    create-link-with cursor cursor-who ]
;  create-rectangles 1 [  ; white rectangles to write on
;    set rectangle-who who]
;  create-rectangles 6
;  ask rectangles [ht
;    set shape "rectangle"
;    set color red
;    set size 14 / ratio]
end

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;  heat flow   ;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

to make-heat-flow              ; purposely simple, straight code to maximize time--this is executed many times
  ask patches with [in-model? pxcor pycor][
    let q 0 ; this will be the net infow of energy
    let my-temp patch-temp
    let my-con conductivity
    ask neighbors4 [
      let con min list conductivity my-con        ; the smallest conductivity controls the flow--keeps heat from leaking into the vacuum
      set q q + con * (patch-temp - my-temp) ]    ; inflow if this neighboring patch is hotter
    print q
    set patch-temp patch-temp + flow-speed * q ]  ; flow-speed determines how fast the simulation is
  color-sprites                                   ; sprites show the color temperature of the patches under them
end

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;; mouse actions support ;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

to act-on-mouse-events                              ; This code detects mouse events and sorts them into mouse-click, mouse-up, mouse-drag, and mouse-hover
  if mouse-inside? [                                ;    needs to be inside a forever loop
    if old-mouse-up? and mouse-down? [              ; true once only when a mouse is clicked
     handle-mouse-down stop]
    if (not old-mouse-up?) and (not mouse-down?) [  ; true once only when mouse is released
      handle-mouse-up stop]                         ; sets on-mouse to the number of the selected mouse
    if not old-mouse-up? and mouse-down? [
      stop]
    handle-mouse-hover ]                             ; if nothing else, look for things to do with the un-clicked mouse
end

to handle-mouse-down   ; called once when the user first clicks the mouse
  set old-mouse-up? false
  if in-model? mouse-xcor mouse-ycor [       ; handle a mouse click in the model area
    ;handle-set-material-on-mouse-down
    ]
end

to handle-mouse-up       ; called once when the user first releases the mouse
  set old-mouse-up? true
end

to handle-mouse-hover  ; if there was no click but the mouse is inside the model, show what the 'cursor-shows'
  ;   pull-down selects: nothing, material, temperature, average temperature, mass, contact area
  ; if the cursor is in the grid, show a vertical line and the value of any data nearby.
  ifelse (old-mouse-xcor = mouse-xcor and old-mouse-ycor = mouse-ycor)
    [stop]
    [set old-mouse-xcor mouse-xcor
     set old-mouse-ycor mouse-ycor ]
  if not in-grid? mouse-xcor mouse-ycor [
    ask cursors [set xcor grid-umin]] ; hides the graph cursor
;    ask rectangles [ht]]
  ask reporter reporter-who [  ; use the first reporter in the modeling area
    set label ""
    if in-model? mouse-xcor mouse-ycor [
      setxy mouse-xcor mouse-ycor
      let mc-here material-color                ; get the color from the patch
      let pull-down-color get-color material1
      ifelse view = "Temperature Overlay"
        [set label-color white]
        [set label-color black]
;      if cursor-shows = "Material" [
        set label get-property material-properties material-color 2 0 ] ; by matching color, find name of material "\
        if label = "Silver" [set label "Beverage"]
;      if cursor-shows = "Temperature" [
        set label (word label " " (precision patch-temp 1) "°C")]
;      if cursor-shows = "Average Temperature"[
;        let local 0
;        ask patch mouse-xcor mouse-ycor [
;          set local material-color]
;        let t mean [patch-temp] of patches with [local = material-color]
;        set label (word "Ave. Temp: " (precision t 1) "°C")]
;      if cursor-shows = "Volume" [
;        let local 0
;        ask patch mouse-xcor mouse-ycor [
;          set local material-color]
;        set label (word "Volume: " (count patches with [local = material-color]))]
;    if cursor-shows = "Contact Area"[   ; reports the surface count between the color at the cursor
;                                        ;   and the color of the material in the pull-down
;                                        ; this is the number of patches of the color under the mouse (material-color)
;                                        ; that are in contact with a neighbor of the color of the pull-down material
      ; first get the color and name for the patch under the cursor (mouse)
;      set label ""
;      let color-at-cursor 0   let name-at-cursor ""
;      ask patch mouse-xcor mouse-ycor [
;        set color-at-cursor material-color
;        set name-at-cursor get-material-name color-at-cursor]
;      let name-at-neihgbor material        ; get the name of the material in the material pull-down
;      let color-at-neighbor get-color material  ; get the color of this material
;      if color-at-cursor != color-at-neighbor [  ; contact area with self makes no sense
;        let c count patches with [(material-color = color-at-cursor) and  ; count patches that have the local color and..
;             (any? neighbors with [material-color = color-at-neighbor])]  ;  have a neighbor with the selected color
 ;       set label (word material "/" name-at-cursor " area: " c )]]]

    if in-grid? mouse-xcor mouse-ycor[   ; show a cursor and its intercepts
      ask cursors [set xcor mouse-xcor]  ; moves it into view--when the cursor is not in the grid, it hides under the vertical axis
      let i 0
      while [i < max-number-of-thermometers][  ; repeat for each of the possible thermometers
        if item i thermometers-used? [   ; check whether the i-th thermometer is in use
          let least-dist 1e10                ; find the nearest dot
          let nearest-u 0
          let nearest-v 0
          let nearest-T 0
          ask graph-dots with [color = item i thermometer-colors ][
            let d abs (xcor - mouse-xcor)
            if d < least-dist [
              set least-dist d
              set nearest-u xcor
              set nearest-v ycor
              set nearest-T y-val]]  ; nearest-u, nearest-v now contains the coordinates of the nearest dot
                  ; make the rectangle vanish if cannot write the temp.
          ifelse abs (nearest-u - mouse-xcor) > 1  ; don't report data far from the cursor
           [ask reporter (reporter-who + i) [set label ""]]  ; if the nearest data is distant, hide values
;            ask rectangle (rectangle-who + i) [ht]]
           [let out-of-bounds? false
            ask reporter (reporter-who + i) [
              let u0 nearest-u + 12 / ratio ; offset the values
              let v0 nearest-v
              ifelse not in-grid? u0 v0
                [set out-of-bounds? true]
                [ setxy u0 v0
               set label word precision nearest-t 1 "°C"
               set label-color item i thermometer-colors ]]
;           ask rectangle (rectangle-who + i)[ st
;             let u0 nearest-u + 8 / ratio
;             let v0 nearest-v + 1 / ratio  ; offset the rectangle under the print
;             if in-grid? u0 v0 [
;               setxy u0 v0 ]]
             ]]
         set i i + 1]
      let u 0 let v 0
      ask reporter (reporter-who + 6)[   ; place at the intersection of the cursor and the x-axis
        set u [xcor] of cursor cursor-who   ; find screen coordinates of the lower cursor
        set v [ycor] of cursor cursor-who
        let u0 u + 14 / ratio
        let v0 v + .5 / ratio
        ifelse in-grid? u0 v0
          [setxy u0 v0 st
           set label word (precision ((u - bx) / mx) 1 ) " sec"
           set label-color gray]
          [ht]]
;      ask rectangle (rectangle-who + 6)[ st
;        let u0 u + 8 / ratio
;        let v0 v + 2 / ratio  ; offset the rectangle under the print
;          if in-grid? u0 v0 [
;            setxy u0 v0 ]]
      ]
end


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;; pull-down support ;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

; the following support only immediate actions, not those requiring the mouse
; Mouse actions are determined by pull-down values

to act-on-pull-down-changes   ; called by on/off
  if actions != "None" [                  ; actions are immediate and always result in actions = "None"
    handle-actions-pull-down stop]
;  if not (old-temperature-range = temperature-range) [
;    set old-temperature-range temperature-range
;    handle-temp-range-pull-down]
;  if old-material != material [
;    set old-material material
;    handle-material-pull-down stop]
  if not (old-model-tools = model-tools) [
    set old-model-tools model-tools
;    show-tip model-tool-properties model-tools true true
    stop]
     ; show tip in upper left
;  if model-tools = "Move Rectangle" [  ; show the rectangle tool
;    if empty? under-rectangle [stop]
;    let data first under-rectangle ; turn on rectangle using the first item in the under-rectangle list
;    draw-rectangle first data item 1 data item 2 data item 3 data]]

  if not (old-graph-tools = graph-tools) [
    set old-graph-tools graph-tools
    handle-graph-tools]
end

;to handle-temp-range-pull-down
;  let s temperature-range     ; save some typing
;  if s = "0°C to 100°C" [
;    set min-temp 0 set max-temp 100]
;  if s = "35°C to 45°C" [
;    set min-temp 35 set max-temp 45]
;  if s = "0°C to 300°C" [
;    set min-temp 0 set max-temp 300]
;  if s = "-100°C to 300°C" [
;    set min-temp -100 set max-temp 300]
;  set temperature round (min-temp + temperature-setter * (max-temp - min-temp) * .01)
;  set grid-ymin min-temp
;  set grid-ymax max-temp
;  rescale-grid
;end

to handle-material-pull-down   ; show tip, make background air or vacuum
;  show-tip material-properties material true true  ; displays the tip
    ; set air or vacuum. Note: avoid using air-color or vacuum-color for anything else
;  if material = "Air" [
;    set current-background "Air"
;    ask patches with [pcolor = vacuum-color][
;      set pcolor air-color
;      set conductivity get-property material-properties "Air" 0 3 ]]
;  if material = "Vacuum" [
;    set current-background "Vacuum"
;    ask patches with [pcolor = air-color][
;      set pcolor vacuum-color
;      set conductivity get-property material-properties "Vacuum" 0 3 ]]
end

to handle-actions-pull-down  ; show tip, set color by temp/material, etc
  ; These are all actions that can be completed immediately and end with the action pull-down on "None"
;  show-tip action-properties actions true true  ; displays the tip
;  if actions = "Set Starting State" [
;    restore-state starting-state   ; restore model state at the beginning of the last run
;    set model-source "Starting"
;    set mode "Ready to start"
;    reset-graph
;    ask graph-dots with [size = 4] [die]
;    set actions "None"]
  if actions = "Start" [ ; in reality, this is 'run' and 'resume' together
    ifelse mode = "Paused"
      [set delay delay + timer - time-of-pause]    ;    delay adds up the time paused
;      [reset-graph
       [set time-zero timer
       set delay 0]
;       save-starting-temps ]
    set mode "Running"
;    set model-source ""       ; needed????
    set actions "Overlay Temperature"] ; "Overlay.. ends with setting actions to "None"
  if actions = "Pause" [
    set mode "Paused"
    set time-of-pause timer
    set actions "Show Material Only"]
;  if actions = "Resume" [
;    set mode "Running"
;    set delay delay + timer - time-of-pause
;    set actions "None"]
;  if actions = "Take Snapshot" [ set actions "None"]
  if actions = "Show Temperature Only" [
    set alpha 255 color-sprites
    set view "Temperature Only"
    ask thermometer-labels [set label-color black]]
;    set actions "None"
  if actions = "Show Material Only" [
    set alpha 0 color-sprites color-material
    ask thermometer-labels [set label-color black]
    set view "Material Only"
    set actions "None"]
  if actions = "Overlay Temperature" [
    set alpha 175  color-sprites
    gray-out-material
    ask thermometer-labels [set label-color white]
    set view "Temperature Overlay"
    set actions "None"]
end

to handle-graph-tools  ; called if a graph tool is selected
  if graph-tools = "Autoscale" [
    ifelse any? graph-dots
      [set grid-xmin min [x-val] of graph-dots
       set grid-xmax max [x-val] of graph-dots
       set grid-ymin min [y-val] of graph-dots
       set grid-ymax max [y-val] of graph-dots
       rescale-grid]
      [stop]]
  set graph-tools "--------"
end

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;to act-on-slider-changes
;  if old-temperature-setter != temperature-setter [
;    set old-temperature-setter temperature-setter
;    set temperature round (min-temp + temperature-setter * (max-temp - min-temp) * .01)]
;end
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;  Thermometer handlers ;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

; All support of the thermometers in the model is provided by the mouse
; Thus, the required actions are performed by mouse-click, mouse-drag, and mouse-up

; On a mouse-click inside the model window we need to find out the who of the active thermometer
; each thermometer is a different color. up to six are supported
; If there is no thermometer nearby, a new one is made and its who becomes the active thermometer
; A new one can be made only if it doesn't exceed the max-number
; Because thermometers can be killed by moving them outside the model area, it is a bit tricky to
;    find a color for the new one. A list of logicals called thermometer-available? tracks unused thermometers

; The user then drags the active thermometer to its new home. As it drags it reports the temperature of the patch nearest.
; If the user drags outside the model window, the thermometer is killed and thermometer-available? needs updating.

; When the mouse-up is detected, The thermometer is dropped and no longer 'active.' This happens by changing the mode to "None"

; If running, every .1 sec all thermometers in use send temperature data to update the graph. (called in on/off)

to handle-thermometer-mouse-click
  let dist 1e10            ; find the themometer nearest the mouse
  let w 0                  ; w becomes the who of the nearest thermometer
  let i 0
  ask thermometers [
    let d distancexy mouse-xcor mouse-ycor
      if d < dist [set dist d set w who]]
  ; now w is the nearest thermometer and and its distance to the mouse is dist
  ; if there is no thermometer, w will be zero and the dist 1e10

  if dist < nearby  [             ; if a thermometer is near the mouse, grab it
    set active-thermometer w        ; use its who to identify it as the active thermometer
    ask thermometer w [
        setxy mouse-xcor mouse-ycor ]]   ; snap the thermometer to the mouse
  if dist >= nearby  [  ; if the mouse isn't near an active thermometer, make one at the mouse
    make-thermometer mouse-xcor mouse-ycor]
end

to make-thermometer [u v] ; creates a new thermometer and label at u,v with the first available color
  let found? false               ; if none nearby, search for an available new one
                                 ;    This requires that at least one item in the first max-number items in thermometers-used? be false
  let i 0
  while [i < max-number-of-thermometers and not found?] [
    if not (item i thermometers-used?) [    ; first find an available thermometer
      set found? true
      set thermometers-used? replace-item-hack i thermometers-used? true]   ; indicate that this thermometer is in use
      set i i + 1 ]              ; an available thermometer may have been found or the loop ran out of i values
           ;  at this point, either found? is false, incidating that there are no available thermometers
           ;     or one was found and its index is i - 1
  if not found? [
    clear-output
    output-print "A maximum of eight thermometers is allowed."
    output-print "If you want to get rid of some, click on 'Set Thermometers' and then "
    output-print "click on a thermometer that you don't want and drag it off screen."
    stop]
  let w 0
  create-thermometer-labels 1 [
    set w who
    set size 0
    set label-color black
    set label precision patch-temp 1
    let u0 u + (13 / ratio)  ; the offset of the label from the thermometer
    let v0 v - (1)
    if (in-model? u0 v0) [setxy u0 v0]]
  create-thermometers 1 [
    set thermometer-label-who w  ; save the associated label
    set shape "Thermometer"
    set active-thermometer who
    set size 24 / ratio
    set color item (i - 1) thermometer-colors
    if in-model? u v [setxy u v]]
end

;to handle-thermometer-mouse-drag
;  if in-model? mouse-xcor mouse-ycor [     ; as long as the mouse is inside the model area, move the active thermometer to it.
;    let w 0
;    let local-temp 0
;    ask thermometer active-thermometer [   ;
;      set w thermometer-label-who
;      ask sprites-here [
;        set local-temp precision patch-temp 1]
;      if in-model?  mouse-xcor mouse-ycor [setxy mouse-xcor mouse-ycor ]]
;    ask thermometer-label w [    ; this shadows the thermometer in order to get the temperature label near the bulb
;      let u mouse-xcor + 13 / ratio  ;These are the offsets of the thermometer-label from the thermometer
;      let v mouse-ycor - 1 / ratio
;      if in-model? u v [
;        setxy u v
;        set label word local-temp T-units
;      ]]]
;  if not in-model? mouse-xcor mouse-ycor [           ; if the mouse wanders out of the model area
;    set old-mouse-up? true         ; this stops calling mouse-drag from the on/off loop
;    set current-color [color] of thermometer active-thermometer
;    let i position current-color thermometer-colors  ; make this color of thermometer available
;    set thermometers-used? replace-item i thermometers-used? false
;    let w 0
;    ask thermometer active-thermometer [set w thermometer-label-who]
;    ask thermometer-label w [die]                  ; kill off the label
;    ask thermometer active-thermometer [die]
;    set model-tools "None"]
;end

to update-thermometer-reading       ; called by on/off to ensure that all visible thermometers show the right temperature
  let local-temp 0 let w 0          ; these need to be local but global to this procedure
  if any? thermometers [
    ask thermometers [              ; get the label turtle associated with each thermometer
      set w thermometer-label-who
      ask sprites-here [
        set local-temp precision patch-temp 1]      ; round temperature to one-tenth degree
    ask thermometer-label w [        ; tell the label-thermometer to show the temperature
      set label word local-temp T-units]]]
end


;to handle-set-material-on-mouse-down
;;  set Cursor-Shows "Material"  ; Set the cursor to show material
;  set Actions "Show Material Only" ; get out of overlay mode.
;  let new-color get-property material-properties material 0 2          ; material is a pull-down that gives a name
;   ; read the material at the mouse and give all such material on the same half the material-color of the variable material
;  let new-conductivity get-property material-properties material 0 3
;  let local-material-color 0
;  let clicked-in-left? in-left-half? mouse-xcor mouse-ycor  ; logical used to determine which half-model was clicked
;  ask patch mouse-xcor mouse-ycor [set local-material-color material-color]  ; save the clicked-patch's material color into local-material-color variable
;  let silver-color get-property material-properties "Silver" 0 2
;  if local-material-color = silver-color [stop]   ; cannot change the 'silver' beverage
;  if local-material-color = air-color [stop]      ; cannot change the surround
;  ; change the material-color of all patches of this type, only on the side clicked
;  let maxu -1e8 let minv 1e8
;  ask patches with [(material-color = local-material-color)] [
;    if clicked-in-left? and in-left-half? pxcor pycor[
;      if pxcor > maxu [set maxu pxcor]
;      if pycor < minv [set minv pycor]
;      set conductivity new-conductivity
;      set material-color new-color
;      set pcolor new-color]
;    if not (clicked-in-left? or in-left-half? pxcor pycor)[
;      if pxcor > maxu [set maxu pxcor]
;      if pycor < minv [set minv pycor]
;      set conductivity new-conductivity
;      set material-color new-color
;      set pcolor new-color]]
;  ask one-of sprites-on patch (maxu - 1) (minv + 1) [
;    set label-color black
;    set label material ]
;  ask reporters with [in-model? xcor ycor] [set label material]
;  clear-output
;  output-print "You can continue to change the jacket materials on either model."
;  output-print "When you have the jackets you want to test, press 'Run'"
;  output-print "The model will compute how the heat would be transfered."
;  output-print "The temperature at each thermometer is graphed."
;end

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;; Painting Tools ;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

; Handles Brush, Pencil, Large Eraser, Small Eraser, and Fill
; The first two convert patches to the current material
; The erase options convert patches to air or vacuum, whichever was used last
; Fill defines a rectangle to be filled.

; Mouse down: So the user can see what is being drawn, Actions is set to "Show Material"
; The painting diameter is set small for pencil, large for brush.
; The patch colors are set to the material selected or the current background (for erase)
; The current-conductivity is set.

; Drag causes the change.
; except for fill, every patch within the painting diameter is set to the current material
; Its temperature is set to default and its conductivity is set to current-conductivity
; Fill draws a rectangle that is then filled

; Mouse up always sets Model-tools to None. This turns off the painting

;to handle-painting-mouse-click
;  set actions "Show Material Only"              ; The action tool is set to show the material
;  if model-tools = "Use Pencil" or model-tools = "Use Small Eraser" [set brush-size 1]
;  if model-tools = "Use Brush" or model-tools = "Use Large Eraser" [set brush-size 3]
;  let found? false
;  let i 0                                       ; get the current material's color and conductivity
;  while [not found?] [
;    let prop item i material-properties         ; get the properties of one substance from the list material-properties
;    if first prop = material [set found? true]  ; if this substance is the one selected in the material pull-down, stop looking at the end of this loop
;    set current-color item 2 prop               ; set the current color and conductivity
;    set current-conductivity item 3 prop
;    if member? "Eraser" model-tools [           ; if the tool is an eraser
;      ifelse current-background = "Air"         ; paint with the current background color
;        [set current-color air-color]           ; erasing is actually painting with background
;        [set current-color vacuum-color]]
;    set i i + 1]
;  if model-tools = "Fill Rectangle" [           ; save the click coordinates for the rectangle
;    set first-corner-u mouse-xcor
;    set first-corner-v mouse-ycor]
;end




;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;; move objects ;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

; Overview; When the move tool is selected, The selection rectangle is shown.
; if the user clicks within the rectangle, it can be moved

; This means that every time a rectangle is filled or moved, whatever was under it must be saved in under-rectangle
; under-rectangle also contains the coordinates of the selection rectangle
; Initially, under-rectangle is empty.
; under-rectangle consists of [[u0 v0 u1 v1][u v material-color temperature conductivity][...]] for all patches under the rectangle
; On save and restore the under-rectangle needs to be saved and restored.

; on click. save the mouse location. save the temperature-map of the object

; on drag, all patches under the rectangle are changed to whatever they used to be, using under-rectangle
; the coordinate of the new rectangle are updated by the mouse movement
; a new rectangle is drawn after the patches under it are saved in under-rectangle
; the location of the mouse is saved for the next iteration.

; on mouse-up. the selection rectangle goes away

to handle-move-drag
;  if empty? under-rectangle [stop]
;  let rect first under-rectangle           ; the first element is the coordinates of the rectangle
;  let u0 first rect let v0 item 1 rect
;  let u1 item 2 rect let v1 item 3 rect
;  let du mouse-xcor - old-mouse-xcor       ; calculate the distance the mouse has moved
;  let dv mouse-ycor - old-mouse-ycor
;  if abs dv < .05 and abs du < .05 [stop]  ; the mouse has not moved much so stop
;  set old-mouse-xcor mouse-xcor            ; update the old mouse coordinates
;  set old-mouse-ycor mouse-ycor

;  let data bf under-rectangle              ; start unpacking under-rectangle prior to restoring it
;  while [not empty? data][
;    let p-data first data
;    set data bf data
;    ask patch first p-data item 1 p-data [ ; start restoring patches with under-rectangle
;      set material-color item 2 p-data
;      set pcolor item 2 p-data
;      set patch-temp item 3 p-data
;      set conductivity item 4 p-data
;   ]]  ; the patches under the rectangle are now restored

;  set u0 u0 + du set v0 v0 + dv  ; calculate all the new coordinates
;  set u1 u1 + du set v1 v1 + dv
;  if not (in-model? u0 v0 and in-model? u0 v1 and
;          in-model? u1 v1 and in-model? u1 v0 )[stop]  ; stop if the rectangle strays outside the model area
;  set under-rectangle []          ; clear out under-rectangle
;  set under-rectangle fput (list u0 v0 u1 v1) under-rectangle  ; place new rectangle in under-rectangle 3
;  ask patches [                    ; now paint the new rectangle, first refilling under-rectangle with new data
;    if pxcor < u0 and pxcor > u1 and
;       pycor < v0 and pycor > v1 [
;         set data (list pxcor pycor material-color patch-temp conductivity)
;         set under-rectangle lput data under-rectangle
;         set pcolor current-color
;         set material-color current-color
;         set patch-temp default-temp   ; this is a bad shortcut. The temp should be the temperature of the
;         ; corresponding patch before the move. This will require saving a temperature map of the rectangle before moving it
;         set conductivity current-conductivity]]

;   get the coordinates

;  draw-rectangle u0 v0 u1 v1 ; draw the rectangle
end


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;; useful code ;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

to-report in-model? [u v]
  report u < (separator - buffer) and
         u > (min-pxcor + buffer) and
         v < (max-pycor - buffer) and
         v > (min-pycor + buffer)
end

to-report inside? [u v]
  report u <= max-pxcor and
         u >= min-pxcor and
         v <= max-pycor and
         v >= min-pycor
end

to-report in-left-half? [u v]
  report u < divider and u > min-pxcor and
         v < max-pycor and v > min-pycor
end

to-report in-grid? [u v]      ; reports true if u,v is inside the graphing grid
  report u >= grid-umin and u <= grid-umax and
         v >= grid-vmin and v <= grid-vmax
end

;to show-tip [prop name left-side? upper?] ; shows tips for user
  ; there are four places tips can be displayed: upper left, lower left, upper right, and lower right
  ; this is a bit of a cludge. When upper? is true it gets the message from a list of properties
  ;     the properties are in 'prop' and consist of [name tip] pairs
  ;     the program looks up 'name' in the property list and shows the associated tip
  ; if upper? is false, this simply displays name at bottom left or right

  ; prop is a list of lists where each list starts with name
;  if upper? [
;    while [not empty? prop ][             ;      and the next item is a tip
;      let one-prop first prop             ; tips for the model are on the left, for the graph on the right.
;      set prop bf prop
;      if first one-prop = name [
;        ask tips with [left? = left-side? and top? = upper?][
;          set label item 1 one-prop ]]]]
;  if not upper? [
;    ask tips with [left? = left-side? and top? = upper?][
;       set label name]]
;end

to color-sprites ; colors sprites according to the temperature of the patch they are on
  ; the color ranges from pure blue at min-temp to pure red at max-temp
  ; sprites overlay the patches and are used exclusively for the color map
  let t 0
  ask sprites with [pxcor < separator][
    ask patch-here [set t patch-temp]
    let mid .5 * (min-temp + max-temp) ; the temperature mid-way between min and max
    if t < mid [                       ; shades of blue below mid
      let i round (255 * (t - min-temp) / (mid - min-temp))
      if i < 0 [set i 0] if i > 255 [set i 255]
      set color (list i i 255 alpha) ] ; full blue at min-temp, white at max-temp
    if t >= mid [                      ; shades of red above mid
      let i round (255 * (t - max-temp) / (mid - max-temp))
      if i < 0 [set i 0] if i > 255 [set i 255]
      set color (list 255 i i alpha)]
    if t > max-temp [set color (list 255 0 0 alpha)] ; pure red
    if t < min-temp [set color (list 0 0 255 alpha)]]  ; pure blue
end

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;; functions needed for model    ;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

to clear-model
  ask thermometers [die]
  ask thermometer-labels [die]
  set thermometers-used? [false false false false false false]
  ask patches with [in-model? pxcor pycor] [
    set patch-temp 20
    set conductivity 1
    set pcolor air-color
    set material-color air-color]
;  set under-rectangle []
;  set saved-state []
  color-sprites
end

to gray-out-material      ; When temperature overlays are shown, the materials become gray
  ask patches with [in-model? pxcor pycor] [
    if material-color != air-color and
     material-color != vacuum-color [
      set pcolor (4 + material-color / 50)]] ; assignes a shade of gray to every possible color
end

to color-material  ; colors substances based on their material
  ask patches with [in-model? pxcor pycor] [set pcolor material-color]
end

to-report get-material-name [mc]  ; report the name of the color of material m
  report get-property material-properties mc 2 0
;     ; have to search through material-properties for item 2
;  let prop material-properties            ;    matching material-color, then get first prop
;  while [not empty? prop][
;    let first-prop first prop
;    set prop bf prop
;    if item 2 first-prop = mc [
;      report first first-prop ]]
end

to-report get-color [mat-name]  ; find the color number for the material named mat-name
  report get-property material-properties mat-name 0 2
;  let prop material-properties
;  while [not empty? prop][
;    let first-prop first prop
;    set prop bf prop
;    if first first-prop = mat-name [
;      report item 2 first-prop ]]
end


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;; scale and grid-drawing routines ;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

to draw-grid  ; draws the grid
  ; inputs (all globals) are the grid screen boundaries, the desired ranges of x and y, the intended number of tic marks in the x-direction,
  ; the axis labels, and the colors of the grid and labels
  ; Draws and labels the graphing grid
  ; outputs are the transformation coefs which are stored in the second position in their respective lists
  ask grid-dots [die] ; clear the grid
;  draw-verticals   ; draws the vertical lines and the x-axis
;  draw-horizontals ; draws the horizontal lines and the y-axis
end

to draw-verticals ; draws the vertical lines and labels them along x-axis
  let xTarget (grid-umax - grid-umin ) * ptch-size * .8 * ratio / grid-separation     ;  sets the target number of tics based on the size of the graphing area
                                                    ; allocates about grid-separation pixels per tic
  let a ticMarks grid-xMin grid-xMax xTarget        ; a now contains graph-xmin, graph-xmax, and n-xtics (ticmarks is a procedure)
  set grid-xmin first a set grid-xmax item 1 a
  ; compute the transformation coeficients in u=mx+b
  set mx (grid-umax - grid-umin) / (grid-xmax - grid-xmin)
  set bx grid-umin - mx * grid-xmin
  let n-xtics last a
  let dxx (grid-xmax - grid-xmin) / (n-xtics - 1)
  let x grid-xmin
  repeat n-xtics [   ; draw and label the verticals one at a time
    let w 0
    let u mx * x + bx
    create-grid-dots 1 [
      set size 0
      setxy u grid-vmax  ; place at the top of the grid
      set w who ]
    create-grid-dots 1 [ ; place a linked dot at the bottom
      set size 0
      setxy u grid-vmin - tic-length
      create-link-with grid-dot w [
        set thickness line-width
        set color grid-color
        if abs (x - grid-xmin ) < .01 * dxx or
            abs (x - grid-xmax ) < .01 * dxx [
          set thickness 2 * line-width ]]]   ; make edges wider
    create-grid-dots 1 [      ; used to place the value
      set size 0
      set label precision x 3
      set label-color grid-label-color
      setxy u + 1 grid-vmin - (tic-length + 2 )]
    set x x + dxx ]
  create-grid-dots 1 [    ; label the axis
    set size 0
    let u .5 * (grid-umax + grid-umin) + 1.3 * length grid-xlabel / ratio
    setxy u grid-vmin - 9 / ratio
    set label grid-xlabel
    set label-color grid-label-color]
end

to draw-horizontals ; draws the horizontal lines and labels them along the y-axis
  let yTarget (grid-vmax - grid-vmin ) * ptch-size * ratio / grid-separation      ;  sets the target number of tics based on the size of the graphing area
                                                    ; allocates about grid-separation pixels per tic
  let a ticMarks grid-yMin grid-yMax yTarget        ; a now contains graph-xmin, graph-xmax, x-interval, and n-xtics
  set grid-ymin first a
  set grid-ymax item 1 a
  ; compute the transformation coeficients in u=mx+b
  set my (grid-vmax - grid-vmin) / (grid-ymax - grid-ymin)
  set by grid-vmin - my * grid-ymin
  let n-ytics last a
  let dyy (grid-ymax - grid-ymin) / (n-ytics - 1)
  let y grid-ymin
  repeat n-ytics [   ; draw and label the horizontals one at a time
    let w 0
    let v my * y + by
    create-grid-dots 1 [
      set size 0
      setxy grid-umax v ; place a dot at the right of the grid
      set w who ]
    create-grid-dots 1 [
      set size 0
      setxy (grid-umin - tic-length) v  ; place a second dot tic-length to the left of the grid
      set label precision y 3
      set label-color grid-label-color
      create-link-with grid-dot w [     ; connect the dots to make a grid line and tic
        set thickness line-width
        set color grid-color
        if abs (y - grid-ymin ) < .01 * dyy or
            abs (y - grid-ymax ) < .01 * dyy [
          set thickness 2 * line-width ]]]   ; make edges wider
    set y y + dyy ]
  create-grid-dots 1 [ ; label the y-axis
    set size 0
    set label grid-ylabel
    set label-color grid-label-color
    let u grid-umin + 1.5 * length grid-ylabel / ratio
    setxy u grid-vmax + 3 / ratio]
end

to-report ticMarks [zMin zMax targetNumber]
     ; Computes the scaling parameters.
     ; Inputs are:
     ;     the beginning of the scale
     ;     The end of the scale
     ;     The target number of tic marks in the scale
     ; returns a list:
     ;    The first item is the beginning of the scale (rounded down to an even number)
     ;    The second item is the end of the scale (rounded up)
     ;    The third item is the actual number of tics (differnet from nTics)
   if ( zMax < zMin ) [                       ; swap if in the wrong order
     let z zMax
     set zMax zMin
     set zMin z ]
      ; compute the target interval between scale divisions (tic marks) in problem coordinates.
      ; note that if there are N tic marks, there are N-1 intervals.
   let dz  (zMax - zMin) / (targetNumber - 1) ; the value of the interval for the target number of tics
   let y log dz 10                            ; compute the log base 10 of dz
   let a floor y                              ; round y down to the nearest smaller integer
   let z y - a                                ; z is the fractional part of the log
   let r 0
   ifelse z < .15                             ; if z is less than .15 set r to 1
     [set r 1]
     [ifelse z < .5                           ; otherwise if it is less than .5 set r to 2
        [set r  2]
        [ifelse  z < .85                      ; otherwise if it is less that .85 set r to 5
          [set r 5 ]                          ; and if all else fails, set r to 10
          [set r 10 ]]]                       ; r is the nearest 'nice' number to z: 1, 2, 5 or 10
   set dz  r * 10 ^ a                         ; dz is now the "corrected" tic interval
   let k floor (zMin / dz)
   let lowtic k * dz
   let ntics 1 + ceiling (zMax / dz ) - k     ; the actual number of tic marks
   let hitic lowtic + dz * (ntics - 1)
   report (list lowtic hitic ntics)
end

to place-point [x y c]   ; places the point x,y on the grid as a dot of color c
  if x > grid-xmax [
    set grid-xmax grid-xmin + 1.5 * (grid-xmax - grid-xmin)
    rescale-grid]
  if y > grid-ymax [
    set grid-ymax grid-ymin + 1.5 * (grid-ymax - grid-ymin)
    rescale-grid]
  if y < grid-ymin [
    set grid-ymin grid-ymax - 1.5 * (grid-ymax - grid-ymin)
    rescale-grid]
  let u mx * x + bx
  let v my * y + by
  create-graph-dots 1 [ht
    set x-val x set y-val y ; save the problem coordinates
    set size 1.6 / ratio
    set shape "dot"
    set color c
    if in-grid? u v [ st
      setxy u v ]]
end

to rescale-grid    ; redraws the grid and any points using the globals grid-xmin, grid-ymin,  etc....
;  draw-grid
  ask graph-dots [
    let u mx * x-val + bx
    let v my * y-val + by
    ifelse in-grid? u v
      [st setxy u v ]
      [ht]]
end

to add-points-to-graph      ; reads all active thermometers, up to max-number-of-thermometers
                            ; uses (timer - time-zero) for the x-axis
  let i 0
  while [i < max-number-of-thermometers ][
    let y 0
    if item i thermometers-used? [         ; max-number-of-thermometers is a list. if an item is true, the thermometer is in use
      let therm-color item i thermometer-colors
      ask thermometers with [color = therm-color] [
        set y patch-temp]
;      place-point (timer - (delay + time-zero)) y therm-color
    ]
    set i i + 1 ]
end

to reset-graph       ; sets graph into its default condition ppp
  set grid-ymax 20   ;  HACK
  ask graph-dots with [size = 4][die]     ;
  ; Graph variables
  ; define grid coordinates and labels
  ; define graphing window
  set duration 30    ; default duration of a run in seconds
  set wind-umin separator
  set wind-umax max-pxcor   ; the left and right window area that contains the grid
  set wind-vmin min-pycor                        ; the top and bottom of the window
  set wind-vmax max-pycor
  ; now set the default grid values and draw the grid
  set edge 4 / ratio set edge+ 11 / ratio    ; used to reserve space between graph and grid
  set grid-umin wind-umin + (edge+ + 3 / ratio)
  set grid-umax wind-umax - (edge + 2 / ratio)
  set grid-vmin wind-vmin + (edge+ + .5 / ratio)
  set grid-vmax wind-vmax - (edge + 4 / ratio)   ; leave room for vertical axis label.
  set grid-separation 35 * ratio    ; the approximate number of pixels per grid line
  set grid-xmin 0
  set grid-xmax duration
  set grid-xlabel "Time (s)"
  set grid-ymin 0
;  set grid-ymax 105
  set grid-ylabel "Temperature (°C)"
  set tic-length 1 / ratio   ; the distance a tic mark extends beyond the axis
  set line-width .5 / ratio   ; the thin lines that make up the grid ***
  rescale-grid
end

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;   Button Actions    ;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

; Each of the following buttons sends and abbreviation of its name to 'last-action,'
;   that is used to track progress and generate log data.

to next-left ; use left-pointer to select the next state for the left half of the model window
  erase-half true    ; erase the left side of the model space
  set left-pointer left-pointer + 1
  if left-pointer >= length half-state-list [set left-pointer 0]
  draw-half-state true (item left-pointer half-state-list)
  ; Generate one log event for only the first button press after startup or reset
  clear-output
  output-print "Keep pressing 'Next Left' and 'Next Right' to see possible setups."
  output-print "When you have the setup you want, set the temperature of each object."
end

to next-right; use the right-pointer to select the next state on the right half of the model window
  erase-half false  ; erase the right half of the model space
  set right-pointer right-pointer + 1
  if right-pointer >= length half-state-list [set right-pointer 0]
  draw-half-state false (item right-pointer half-state-list)
  clear-output
  output-print "When you have the setup you want, set the materials you will use."
end

to setup-one-layer
  erase-half true    ; erase the left side of the model space
  draw-half-state true (item 1 half-state-list)
  set old-material1 "Teflon"
  erase-half false    ; erase the right side of the model space
  draw-half-state false (item 1 half-state-list)
  set old-material2 "Teflon"

  clear-output
  output-print "First, be sure that the 'On/Off' button is on and shows dark blue."
  output-print "Next, select a material like 'Wood' and apply it to a jacket."
  output-print "Do this by clicking on the jacket where you want this material."
end

to setup-two-layers
  erase-half true    ; erase the left side of the model space
  draw-half-state true (item 2 half-state-list)
  erase-half false    ; erase the left side of the model space
  draw-half-state false (item 2 half-state-list)
  clear-output
  output-print "First, be sure that the 'On/Off' button is on and shows dark blue."
  output-print "Next, select a material like 'Wood' and apply it to a jacket."
  output-print "Do this by clicking on the jacket where you want this material."
end

to erase-half [left-half?]        ; converts all the patches on the left or right half-model to air
  let center .5 * (min-pxcor + separator)
  let u0 0 let u1 0
  ifelse left-half?
    [set u0 min-pxcor set u1 center]
    [set u0 center set u1 separator]
  ask patches with [pxcor > u0 and pxcor < u1 and
                    pycor < max-pycor and pycor > min-pycor][
    set pcolor get-property material-properties "Air" 0 2
    set conductivity get-property material-properties "Air" 0 3
;    let mp material-properties
;    while [not empty? mp ][
;      let prop first mp
;      set mp bf mp
;      if first prop = "Air" [
;        set pcolor item 2 prop
;        set conductivity item 3 prop
    set material-color pcolor]
  ask thermometers with [pxcor > u0 and pxcor < u1 and
     pycor < max-pycor and pycor > min-pycor] [  ; have to free up thermometer of the color of this thermometer
    let i position color thermometer-colors
    set thermometers-used? replace-item-hack i thermometers-used? false
    die]
  ask thermometer-labels with [pxcor > u0 and pxcor < u1 and
     pycor < max-pycor and pycor > min-pycor] [die]

end


to set-temperature
  ; temperature will have been set by a branch of the forever loop that detects changes in the range and percent slider
  ; read the temperature, wait for the user to click on something and then set everything
  ;   made of that meterial on the side (left or right) clicked
  ; Keep this active until another button is selected
  ; Set the cursor to read temperature.
  set cursor-shows "Temperature"
  set model-tools "Set Temperature"
  clear-output
  output-print "To set the temperature of an object first set the temperature desired"
  output-print "by selecting the range pull-down and the percent slider."
  output-print "Then click on objects to give them that temperature."
  output-print "When you have the temperatures set, go on to change the material."

end

;to set-material
;  ; Read the material pull-down and wait for a click in the model. Then change everything of the
;  ;   material clicked to the material in the pull-down on that side only.
;  set model-tools "Set Material"
;  set cursor-shows "Material"
;  clear-output
;  output-print "To change the material of an object, select the desired material and click on the object."
;  output-print "A click will only influence the material on one side of the model space at a time."
;  output-print "You can click on the surround to make it air or a vacuum."
;  output-print "If you have containers, now fill them with water. If not, go on to set thermometers."
;end

to click-to-fill
  ; Respond only if there is a container and if the user clicks on a container. The fill algorithm
  ;   fills a number of patches with water in proportion to the fill slider.
  ; Erase the water before filling.
  ; Works only with a temperature 0-100 temperature range. Give a hint about this.
  clear-output
  output-print "Use this to fill containers with water. To fill a container,"
  output-print "first use the slider to select the amount of water used, then"
  output-print "click on the container."

end

to set-thermometer
  ; use to create, move, and remove a thermometer. Keep active until another another student action is detected.
  ; set cursor to temperature.
  set model-tools "Add Thermometer"
  clear-output
  output-print "The thermometer reads temperature at its bottom, where the red dot is."
  output-print "A graph will show the history of this temperature using points with the thermometer's color."
  output-print "Create a new thermometer by clicking in the model. You can drag an existing thermometer."
  output-print "Remove one by dragging it outside the model."

end

to set-thermostat   ;
end

to set-heaters
  ; use just like the thermometer to place, move, and remove heaters
  set model-tools "Add Heater"
  clear-output
  output-print "Heaters deliver a short pulse of thermal energy every time 'Pulse' is pressed."
  output-print "Create a new heater by clicking in the model. You can drag an existing heater."
  output-print "Remove one by dragging it outside the model."
  output-print "Heaters are optional--not every experiment needs one."
end

to run-experiment
  ; first obtain and show jacket materials and experiment number. These will be saved with the data
  if not run-pressed? [
  set run-pressed? true
  let w 0
  ask titles [die]
  create-titles 1 [
    set w who
    setxy -52 17
    set label-color black
    set label word "Experiment " experiment-number]
  let mc [material-color] of patch -46 6
  let mat-left get-property material-properties mc 2 0
  set mc [material-color] of patch -18 6
  let mat-right get-property material-properties mc 2 0
  create-titles 1 [       ; show the outer left material
    setxy -52 14.2
    set label-color orange
    set label word "Orange: " mat-left]
  create-titles 1 [
    set label-color green
    setxy -52 12
    set label word "Green: " mat-right]
  if not one-layer? [
    set mc [material-color] of patch -46 5
    let mat-left-inner get-property material-properties mc 2 0
    set mc [material-color] of patch -18 5
    let mat-right-inner get-property material-properties mc 2 0
    ask title (w + 1) [
      set label (word label "/" mat-left-inner)]
    ask title (w + 2) [
      set label (word label "/" mat-right-inner)]]
  ask titles [
    set shape "dot"
    set size .1]

  ; switch to heatmap display
  ; make cursor show temperature
  ; if paused simply continue, un-pause
  set actions "Start"
  clear-output
  output-print "The model now shows a heat map showing red hot and blue cold areas."
  output-print "To pause the model, press 'Pause.' Resume by pressing 'Run' again."
  output-print "Each graph is the color of the thermometer in the model that generates that graph."
  stop
  ]
  if run-pressed? [
    pause
  ]
end

to pause
  set run-pressed? false     ; true only if run was the last button pressed
  save-research-data "Pause"
  set actions "Pause"
  set mode "Paused"
  clear-output
  output-print "To continue, press 'Run' again. To test another material, press 'Reset'."
  output-print "Before resetting, be sure to save your data. 'Reset' removes the graph!"
  output-print "When you want to test a new material, first clear out the old run by pressing 'Reset'."
end

to reset
  set run-pressed? false
  save-research-data "Save"
  set experiment-number experiment-number + 1
  ask titles [die]
  ask graph-dots [die]
  ask reporters [set label ""]
  set time-zero timer set delay 0
  set mode "Ready"
  color-sprites
  set actions "Show Material Only"
;  reset-graph
  ; restore starting-temps
  setup-experiment
;  clear-output
  output-print "Pick materials that you want to test for the left and right sides of the modeling space."
  output-print "Explore the different materials to find the best."
end

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;; Half-model drawing and storage ;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

; The following allow the author to create models that fill the left-hand side of the modeling area


to save-half-state
  ; the new current-half-state is added to the list of half-states: Half-state-list
  ; also locations of heaters and thermometers
  ; the format is [[<d> u0 v0 u1 v1] [...]...] <d> can be the color of materials, or a thermometer or heater
  ask thermometers with [in-left-half? xcor ycor ][  ; append info on thermometers
      let obj (list "Thermometer" round xcor round ycor color 0)
      set current-half-state lput obj current-half-state]
  set half-state-list lput current-half-state half-state-list
;  set current-half-state []          ; empty the current half state
end

to draw-half-state [left-side? half-st]   ; paints a half-state into the left or right half of the model, depending on left-side?
  ; half-st is a list of objects of the format [<c> u0 v0 u1 v1] where c is a color number or "Thermometer"
  let offset round (.5 * (divider - min-pxcor))   ;
  while [not empty? half-st][
    let obj first half-st
    set half-st bf half-st
    let u0 (item 1 obj)    let v0 (item 2 obj)  ;
    let u1 (item 3 obj)    let v1 (item 4 obj)  ;
    if not left-side? [  ; just add the offset to draw this object on the right side
      set u0 u0 + offset
      set u1 u1 + offset]
    if is-number? first obj [  ; if the first item is a number, this is the color of a rectangle
      let clr first obj
      if not left-side? [  ; just add the offset to draw this object on the right side
        set u0 u0 + offset
        set u1 u1 + offset]
      let con get-property material-properties clr 2 3   ; get the conductivity (in item 3) from the color (in item 2)
      let name get-property material-properties clr 2 0  ; get the name of the material
      if name = "Silver" [set name "Beverage"]
      let maxu -1e8                  ; label the lower-right patch with the material type.
      let minv 1e8                   ; this will be the patch with the largest u and smallest v
      ask patches with [(pxcor >= u0) and (pxcor <= u1) and (pycor >= v0) and (pycor <= v1)][
        if pxcor > maxu [set maxu pxcor]
        if pycor < minv [set minv pycor]
        set pcolor clr
        set material-color clr
        set conductivity con
        set patch-temp default-temp]
      if minv = -4 [set minv -3.5]
      ask one-of sprites-on patch (maxu - 1) (minv + 1) [
        set label name  ; label that lower right patch
        set label-color black]
;      show minv
    ]
    if first obj = "Thermometer" [
      ; draw a themometer at u0 v0  The format is ["Thermometer" u0 v0 color 0]
      ; will not necessarily be painted with its original color--it might duplicate something alreay in the model space
      if not left-side? [  ; just add the offset to draw this object on the right side
        set u0 u0 + offset
        set u1 u1 + offset]
      make-thermometer u0 v0]]
end
to save-starting-temps   ; saves the temperatures of all patches on both half-sides when run is first prssed
  set starting-temps []
  ask patches with [in-model? pxcor pycor] [
    set starting-temps lput (list pxcor pycor temperature) starting-temps]
end

to restore-starting-temps  ; restores the entire model to its state when run was first pressed
  if empty? starting-temps [stop]
  while [not empty? starting-temps] [
    let datum first starting-temps
    set starting-temps bf starting-temps
    ask patch first datum item 1 datum [
      set temperature item 2 datum]]
  ; color sprites
end

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;; some missing commands ;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

to-report replace-item-hack [number a-list new-val]    ; needed because replace-item is not supported on the web
  ; returns a list with item number replaced with new-val
  let r []
  let cnt 0
  while [not empty? a-list ][
    ifelse cnt = number
      [set r lput new-val r]
      [set r lput first a-list r]
    set a-list bf a-list
    set cnt cnt + 1]
  report r
end

to-report get-property [LoL match i j]  ; uses a list of lists (LoL)
  ; finds the first sublist that has match in item i and returns item j of that sublist
  ; if the match fails (i.e., match cannot be found in item i of any sublist), 1e-9 is returned
  ; if LoL doesn't have the right structure this will crash.
  ; item i must exist in every sublist and item j must exist in the sublist for which item i is equal to match
  let found false
  let r 1e-9
  while [not (found or empty? LoL) ][
    let sub first LoL
    set LoL bf LoL
    if (item i sub) = match [
      set found true
      set r item j sub]]
  report r
end

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;; Special buttons for challenge ;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

to set-temp [temp]
  let local-material-color 0
  ask patch -46 0 [set local-material-color material-color]
  ; change the temperature of all patches of this type, only on the side clicked.
  ask patches with [(material-color = local-material-color)] [
    set patch-temp temp]
  ask patches with [material-color = air-color][
    set patch-temp 20]
end

to save
  set run-pressed? false
  save-research-data "Save"
  set saved-data fput packaged-data saved-data
  ; saved-data is a list of experiment data
  ; each item of experient data consists of title-data followed by dot-data
  ; title-data consists of four items each consisting of u v color and "Experiment #"
  ; dot-data consists of a list of dot-data each consisting of time temperature and color

  clear-output
  output-print "You can always see these data again; just click on the 'Load Saved Data' button."
  output-print "You can save and later reload many sets of data."
  output-print "Just keep clicking the 'Load' button to see all your saved data, one set at a time."
end

to-report packaged-data
  ; save the graph dots and titles
  let title-data []
  ask titles [
    set title-data lput (list xcor ycor label-color label) title-data]
  let dot-data []
  ask graph-dots [
    set dot-data lput (list (precision x-val 1) (precision y-val 1) color) dot-data]
  report list title-data dot-data
end

to restore-data
  set run-pressed? false
  save-research-data "Restore"
  let n length saved-data     ; this is the number, starting at 0, of saved datasets
  if n = 0 [stop]             ; no data to restore
  ask graph-dots [die]
  ask titles [die]
  if next-dataset >= n [set next-dataset 0]
  let data-set item next-dataset saved-data ;
  let title-data first data-set
  while [not empty? title-data][       ; put up the titles
    let td first title-data
    set title-data bf title-data
    create-titles 1 [
      set xcor first td
      set ycor item 1 td
      set label-color item 2 td
      set label item 3 td
      set size .1 set shape "Dot"]]

  let dot-data last data-set            ; restore the datapoints
  while [not empty? dot-data][
    let dd first dot-data
    set dot-data bf dot-data
    create-graph-dots 1 [
      set x-val first dd
      set y-val item 1 dd
      set color item 2 dd
      set size 1.6 / ratio
      set shape "Dot"]]
  set graph-tools "Autoscale"   ; scales the grid to fit the data
  set next-dataset next-dataset + 1  ; next time 'restore' is clicked, it will point to another dataset
  clear-output
  output-print "You should now be looking at a set of data that you saved."
  output-print "If you have two sets of data with the same experiment number, you pressed 'Save' twice for the same run."
  output-print "My comparing graphs from different experiments, you can learn about which material is best."
end

to pulse-heaters
  set actions "Pulse Heaters"
  clear-output
  output-print "Each pulse gives a fixed amount of thermal energy from all the heaters."
end

to save-research-data [button]
   let new-data (list "New Dataset" (precision timer 1) button packaged-data)
   set research-data word research-data new-data
end



















@#$#@#$#@
GRAPHICS-WINDOW
33
39
865
348
60
20
6.8
1
10
1
1
1
0
0
0
1
-60
60
-20
20
0
0
0
ticks
30.0

BUTTON
40
427
198
460
ON
onOff
T
1
T
OBSERVER
NIL
NIL
NIL
NIL
1

CHOOSER
52
353
186
398
Material1
Material1
"Aluminium" "Cardboard" "Glass" "Cork" "Lead" "Teflon" "Wood"
2

BUTTON
440
354
564
388
Run/Pause
Run-experiment
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
576
354
691
387
Reset
Reset
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
265
354
403
399
Material2
Material2
"Aluminium" "Cardboard" "Glass" "Cork" "Lead" "Teflon" "Wood"
2

CHOOSER
265
415
403
460
BeverageTemperature
BeverageTemperature
95 5
0

@#$#@#$#@
## WHAT IS IT?

(a general understanding of what the model is trying to show or explain)

## HOW IT WORKS

(what rules the agents use to create the overall behavior of the model)

## HOW TO USE IT

(how to use the model, including a description of each of the items in the Interface tab)

## THINGS TO NOTICE

(suggested things for the user to notice while running the model)

## THINGS TO TRY

(suggested things for the user to try to do (move sliders, switches, etc.) with the model)

## EXTENDING THE MODEL

(suggested things to add or change in the Code tab to make the model more complicated, detailed, accurate, etc.)

## NETLOGO FEATURES

(interesting or unusual features of NetLogo that the model uses, particularly in the Code tab; or where workarounds were needed for missing features)

## RELATED MODELS

(models in the NetLogo Models Library and elsewhere which are of related interest)

## CREDITS AND REFERENCES

(a reference to the model's URL on the web if it has one, as well as any other necessary credits, citations, and links)
@#$#@#$#@
default
true
0
Polygon -7500403 true true 150 5 40 250 150 205 260 250

airplane
true
0
Polygon -7500403 true true 150 0 135 15 120 60 120 105 15 165 15 195 120 180 135 240 105 270 120 285 150 270 180 285 210 270 165 240 180 180 285 195 285 165 180 105 180 60 165 15

arrow2
true
0
Polygon -7500403 true true 150 0 0 150 105 150 105 293 195 293 195 150 300 150
Polygon -16777216 true false 135 135 135 270 165 270 165 135 240 135 150 45 60 135

arrowhead
true
0
Polygon -7500403 true true 105 0 105 300 240 150

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

circle 2
false
0
Circle -7500403 true true 0 0 300
Circle -16777216 true false 30 30 240

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
Circle -7500403 true true 90 90 120

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

heater/cooler
false
1
Rectangle -2674135 true true 0 0 300 30
Rectangle -2674135 true true 30 90 270 120
Rectangle -2674135 true true 30 180 270 210
Rectangle -2674135 true true 0 15 30 120
Rectangle -2674135 true true 270 90 300 210
Rectangle -2674135 true true 0 180 30 270
Rectangle -2674135 true true 0 270 300 300

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

rectangle
false
0
Rectangle -1 true false 0 105 300 195

sheep
false
15
Circle -1 true true 203 65 88
Circle -1 true true 70 65 162
Circle -1 true true 150 105 120
Polygon -7500403 true false 218 120 240 165 255 165 278 120
Circle -7500403 true false 214 72 67
Rectangle -1 true true 164 223 179 298
Polygon -1 true true 45 285 30 285 30 240 15 195 45 210
Circle -1 true true 3 83 150
Rectangle -1 true true 65 221 80 296
Polygon -1 true true 195 285 210 285 210 240 240 210 195 210
Polygon -7500403 true false 276 85 285 105 302 99 294 83
Polygon -7500403 true false 219 85 210 105 193 99 201 83

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

tack
false
0
Polygon -7500403 true true 150 165 165 120 165 30 240 30 240 0 60 0 60 30 135 30 135 120 150 165

target
false
0
Circle -7500403 true true 0 0 300
Circle -16777216 true false 30 30 240
Circle -7500403 true true 60 60 180
Circle -16777216 true false 90 90 120
Circle -7500403 true true 120 120 60

thermometer
false
6
Circle -7500403 true false 135 141 42
Polygon -7500403 true false 174 155 285 60 277 40 165 135
Circle -13840069 true true 127 127 46
Polygon -13840069 true true 165 150 285 45 270 30 150 135
Circle -1 true false 135 135 30
Line -7500403 false 165 105 180 120
Line -7500403 false 180 90 195 105
Line -7500403 false 195 75 210 90
Line -7500403 false 210 60 225 75
Line -7500403 false 225 45 240 60
Line -7500403 false 240 30 255 45
Line -1 false 150 150 270 45

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

wolf
false
0
Polygon -16777216 true false 253 133 245 131 245 133
Polygon -7500403 true true 2 194 13 197 30 191 38 193 38 205 20 226 20 257 27 265 38 266 40 260 31 253 31 230 60 206 68 198 75 209 66 228 65 243 82 261 84 268 100 267 103 261 77 239 79 231 100 207 98 196 119 201 143 202 160 195 166 210 172 213 173 238 167 251 160 248 154 265 169 264 178 247 186 240 198 260 200 271 217 271 219 262 207 258 195 230 192 198 210 184 227 164 242 144 259 145 284 151 277 141 293 140 299 134 297 127 273 119 270 105
Polygon -7500403 true true -1 195 14 180 36 166 40 153 53 140 82 131 134 133 159 126 188 115 227 108 236 102 238 98 268 86 269 92 281 87 269 103 269 113

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

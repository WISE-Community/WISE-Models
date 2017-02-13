/// NOTES: SHIT TO DO TO GET GRAPHING WORKING
/// Add this in slider version in getCurrentInputValue() or interpolateGraphByTime and onclick:  if (graph != null && graph.series != null) addToTortoiseGraphLog(mParams.inputId, graph.series[0].data);   
/// Change in tortoise_addPoint, tortoise_removePoint:  if (graph != null && graph.series != null) addToTortoiseGraphLog(series.id, series.data);  
/// Change in mParams all inputId to "Input"
/**
 * Register event listeners so that we can perform processing
 * when certain events are fired
 */
function registerListener(stepObject) {
	/*
	 * the 'beforeSaveNodeState' event is fired right before a node
	 * state is saved. this allows you to access the student work
	 * that the student submitted. it also allows you to modify the 
	 * node state before it's saved to the server.
	 */
	eventManager.subscribe('beforeNodeStateSaved', beforeSaveNodeStateListener, stepObject);
}


/**
 * Called when the 'beforeSaveNodeState' event is fired
 * @param type the event name
 * @param args the arguments that are provided when the event is fired
 * @param obj the object that is provided when this function is subscribed to the event
 */
function beforeSaveNodeStateListener(type, args, obj) {
	debugger;

	//get the step object
	var stepObject = obj;
	if (typeof stepObject.processedExternally === "boolean" && stepObject.processedExternally) return;
	
	//get the node id
	var nodeId = args[0];
	
	//get the node state
	var nodeState = args[1];
	
	//get the node id of the step object
	var stepObjectNodeId = stepObject.node.id;

	/*
	 * make sure the event was fired for the same step this listener was created for.
	 * we need to perform this check because 'beforeSaveNodeState' will be fired
	 * for all steps.
	 */
	if(stepObjectNodeId == nodeId) {
		// for previous work
		var nodeStates = getStudentWorkForStep(stepObject);
		
		// set a flag so that we won't process in an infinite recursion
		stepObject.processedExternally = true;
		nodeState.history = cloneHistory(stepObject.node.history);
		if (stepObject.node.studentGraphs != null){
			nodeState.studentGraphs = cloneDataArray(stepObject.node.studentGraphs);
		}
		nodeState = processStudentWork(stepObject, nodeId, nodeState, nodeStates);
		stepObject.processedExternally = false;
	}
}

function processStudentWork(stepObject, nodeId, nodeState, nodeStates){
	// get indices of all non-empty nodeStates
	var nnindices = [];
	var max_prev_score = null;
	for (var n = 0; n < nodeStates.length; n++){
		if (nodeStates[n] != null && nodeStates[n].studentGraphs != null){
			nnindices.push(n);
			if (nodeStates[n].score != null && (max_prev_score == null || nodeStates[n].score > max_prev_score)){
				max_prev_score = nodeStates[n].score;
			}
		}
	}
	var nodeStatesCount = nnindices.length;

	// last non-empty state is last
	if (nnindices.length > 0){
		var prevNodeState = nodeStates[nnindices[nnindices.length-1]];
	} else {
		var prevNodeState = null;
	}
	
	// get previous work if table	
	var T = null;
	if (typeof stepObject.node.prevWorkNodeIds === "object" && stepObject.node.prevWorkNodeIds.length > 0){
		var prevWorkNodeId = stepObject.node.prevWorkNodeIds[stepObject.node.prevWorkNodeIds.length - 1];
		if (prevWorkNodeId.length > 0){ // make sure this is an actual text string.
			var prevStep = stepObject.view.getState().getLatestNodeVisitByNodeId(prevWorkNodeId);
			if (prevStep !== null && prevStep.nodeType === "TableNode" && prevStep.nodeStates.length > 0){
				var prevTableState = prevStep.nodeStates[prevStep.nodeStates.length-1];
				if (typeof prevTableState.tableData === "object" && prevTableState.tableData.length > 0 && prevTableState.tableData[0].length > 0 ){
					T = prevTableState.tableData;
				}
			}
		}
	}
	
	//console.log(stepObject, T, prevNodeState, nodeState, nodeStatesCount);
	
	// determines which of the array of rubrics to use.
	if (stepObject.content.rubrics != null && stepObject.content.rubrics.length > 0){
		var rubricIndex = 0;
		if (prevNodeState !== null && typeof prevNodeState.rubricIndex !== "undefined" && typeof prevNodeState.score !== "undefined"){
			rubricIndex = prevNodeState.rubricIndex;
			if ((prevNodeState.setCompletedMinScore != null && prevNodeState.score >= prevNodeState.setCompletedMinScore) || (prevNodeState.setCompletedMinScore == null && prevNodeState.score != 0)){
				// move on to the next rubric (unless at end of the array)
				if (rubricIndex < stepObject.content.rubrics.length-1) rubricIndex = prevNodeState.rubricIndex + 1;
			}
		}
	
		var rubric = cloneRubric(stepObject.content.rubrics[rubricIndex]);
		if (T !== null) rubric = insertTableValuesIntoRules(rubric, T);
		rubric = replaceScoreKeysWithIndex(rubric);
		rubric = replaceFeedbackKeysWithIndex(rubric);
		rubric = replaceBranchKeysWithIndex(rubric);
		var setCompletedMinScore = typeof rubric.setCompletedMinScore !== "undefined" ? rubric.setCompletedMinScore : null;
		var setFinalFeedbackScore = typeof rubric.setCompletedMinScore !== "undefined" ? rubric.setCompletedMinScore : null;
		var score = scoreGraph_ruleRubric (stepObject.content, nodeState.studentGraphs, rubric, true);

		var feedbackMessage = null;
		// we will only give feedback if we haven't maxed out score previously
		if (setFinalFeedbackScore == null || max_prev_score == null || max_prev_score < setFinalFeedbackScore){
			feedbackMessage = getGraphFeedback_ruleRubric (stepObject.content, nodeState.studentGraphs, rubric, true);
		}
		var branch = getBranch_ruleRubric (stepObject.content, nodeState.studentGraphs, rubric, true);
		/*
		 * create the message that tells the student they need to type more words
		 * in order for their work to be scored.
		 */
		
		// add relevant information to state	
		nodeState.score = score;
		nodeState.feedbackMessage = feedbackMessage;
		nodeState.rubricIndex = rubricIndex;
		nodeState.rubricCount = stepObject.content.rubrics.length;
		nodeState.setCompletedMinScore = setCompletedMinScore;
		if (branch !== null) nodeState.branch = branch;

		if (eventManager !== null){
			eventManager.fire('unlockScreenEvent');
		
			//display the feedback message in the vle feedback popup
			if (feedbackMessage != null && feedbackMessage.length > 0) eventManager.fire("showNodeAnnotations",[nodeId, feedbackMessage]);
		}		
		//create the annotation value which will contain the auto score and auto feedback
		var autoGradedAnnotation = {
			autoFeedback:feedbackMessage,
			autoScore:score
		};
		//add the auto graded annotation (if there is an actual message)
		if (feedbackMessage !== null && feedbackMessage.length > 0){ 
			stepObject.view.addAutoGradedAnnotation(stepObject.view.getState().getCurrentNodeVisit(), autoGradedAnnotation);
		}
		
		//in cases where there is an external animation script let that script know that we have processed the data
		if (typeof stepObject.animator !== "undefined" && stepObject.animator !== null){
			stepObject.animator.processEvent("getScore", [score, feedbackMessage], stepObject);
		}

		// in cases where there is a branch, go to the branch
		if (branch !== null){
		    var branchNodePosition = stepObject.view.getStepPositionFromStepNumber(branch);
		    stepObject.view.getProject().getNodeByPosition(branchNodePosition).setStatus("isWrong",true);
		    stepObject.view.goToStep(branch);
		}
	}
	return nodeState;
}


/**
 * Get all the node states for a step
 * @param stepObject the step object
 * @return an array of node states for the step
 */
function getStudentWorkForStep(stepObject) {
	//get the node id for the step
	var nodeId = stepObject.node.id;
	
	//get all the node states for the step
	var nodeStates = stepObject.view.getStudentWorkForNodeId(stepObject.node.id);
	
	return nodeStates;
}


/***************  SCORING FUNCTIONS *********************/

function scoreGraph_ruleRubric (stepContent, studentGraphs, rubric, invertIfBackwards){
	var R = getRuleCompletion_ruleRubric(stepContent, studentGraphs, rubric, invertIfBackwards, true);
	if (typeof rubric.scores !== "undefined" && rubric.scores != null){
		for (var s = 0; s < rubric.scores.length; s++){
			var patternResult = eval(rubric.scores[s].pattern);
			// if is logical and true return a given score, if numerical just return value 
			if (patternResult != null && typeof patternResult === "boolean" && patternResult){
				return rubric.scores[s].score;
			} else if (typeof patternResult === "number") {
				return patternResult;
			}
		}
	}
	// No rule found 
	return null;
}
function getGraphFeedback_ruleRubric (stepContent, studentGraphs, rubric, invertIfBackwards){
	var R = getRuleCompletion_ruleRubric(stepContent, studentGraphs, rubric, invertIfBackwards, false);
	if (typeof rubric.feedbacks !== "undefined" && rubric.feedbacks != null){
		for (var s = 0; s < rubric.feedbacks.length; s++){
			var patternResult = eval(rubric.feedbacks[s].pattern);
			// if is logical and true return a given feedback, if numerical just return value 
			if (patternResult != null && typeof patternResult === "boolean" && patternResult){
				var feedback = rubric.feedbacks[s].feedback;
				// in some cases feedback can be prepended or appended
				if (rubric.prependFeedback != null) feedback = rubric.prependFeedback + feedback;
				if (rubric.appendFeedback != null) feedback = feedback + rubric.appendFeedback;

				return feedback;
			} 
		}
	}
	// No rule found 
	return "";
}
function getBranch_ruleRubric (stepContent, studentGraphs, rubric, invertIfBackwards){
	var R = getRuleCompletion_ruleRubric(stepContent, studentGraphs, rubric, invertIfBackwards, false);
	if (typeof rubric.branches !== "undefined" && rubric.branches != null){
		for (var s = 0; s < rubric.branches.length; s++){
			var patternResult = eval(rubric.branches[s].pattern);
			// if is logical and true return a given score, if numerical just return value 
			if (patternResult != null && typeof patternResult === "boolean" && patternResult){
				return rubric.branches[s].branch;
			}
		}
	}
	// No rule found 
	return null;
}

/*
 * Main scoring function using rubric. 
 * @ studentGraphs is the set of all predictions in the state 
 * 
 */
function getRuleCompletion_ruleRubric (stepContent, studentGraphs, rubric, invertIfBackwards, verbose){
	if (typeof invertIfBackwards !== "boolean") invertIfBackwards = true;
	// convert from nodeState to this structure of xy is a data structure of the form [{x: , y: }, {x: , y: }]
	
	var non_critical_labels = ["label", "invert", "xbounds_min", "xbounds_max", "ybounds_min", "ybounds_max", "return_to_point", "collapse_inline_degrees", "relation", "seriesId"];
	
	var R = [];
	var RVALS = [];
	var cp = 0; // we start looking from the first point in xy, but once that is found we don't search it again, we don't go backwards
	//var RVALS = {label:[], x1:[], y1:[], x2:[], y2:[], width:[], height:[], rotation:[], angle:[], npoints:[]}
	for (var r = 0; r < rubric.rules.length; r++){
		var rule = rubric.rules[r];
		// attach xbounds and ybounds to this rule if not present, look in other locations
		if (rule.xbounds_min == null || rule.xbounds_max == null || rule.ybounds_min == null || rule.ybounds_max == null){
			if (typeof stepContent.graphParams !== "undefined" && typeof parseFloat(stepContent.graphParams.xmin) === "number" && !isNaN(parseFloat(stepContent.graphParams.xmin))){
				rule.xbounds_min = parseFloat(stepContent.graphParams.xmin);
				rule.xbounds_max = parseFloat(stepContent.graphParams.xmax);
				rule.ybounds_min = parseFloat(stepContent.graphParams.ymin);
				rule.ybounds_max = parseFloat(stepContent.graphParams.ymax);
			} else if (rubric.rules[0].xbounds_min != null || rubric.rules[0].xbounds_max != null || rubric.rules[0].ybounds_min != null || rubric.rules[0].ybounds_max != null){
				if (rubric.rules[0].xbounds_min != null){
					rule.xbounds_min = rubric.rules[0].xbounds_min;
				}
				if (rubric.rules[0].xbounds_max != null){
					rule.xbounds_max = rubric.rules[0].xbounds_max;
				}
				if (rubric.rules[0].ybounds_min != null){
					rule.ybounds_min = rubric.rules[0].ybounds_min;
				}
				if (rubric.rules[0].ybounds_max != null){
					rule.ybounds_max = rubric.rules[0].ybounds_max;
				}
			} else if (rubric.rules.xbounds_min != null || rubric.rules.xbounds_max != null || rubric.rules.ybounds_min != null || rubric.rules.ybounds_max != null){
				if (rubric.rules.xbounds_min != null){
					rule.xbounds_min = rubric.rules.xbounds_min;
				}
				if (rubric.rules.xbounds_max != null){
					rule.xbounds_max = rubric.rules.xbounds_max;
				}
				if (rubric.rules.ybounds_min != null){
					rule.ybounds_min = rubric.rules.ybounds_min;
				}
				if (rubric.rules.ybounds_max != null){
					rule.ybounds_max = rubric.rules.ybounds_max;
				}
			} else {
				// change these per experiment
				rule.xbounds_min = 0;
				rule.xbounds_max = 5000;
				rule.ybounds_min = 0;
				rule.ybounds_max = 100;
			}
		}
		var xbounds_min = rule.xbounds_min;
		var xbounds_max = rule.xbounds_max;
		var ybounds_min = rule.ybounds_min;
		var ybounds_max = rule.ybounds_max;
		
		var seriesIds = [];
		for (var key in studentGraphs){
			seriesIds.push(key);
		}
		var seriesId = typeof rule.seriesId !== "undefined" && seriesIds.indexOf(rule.seriesId) > -1 ? rule.seriesId : seriesIds[0];
		// get the correct series
		var xy = [];
		if (studentGraphs[seriesId] != null){
			for (var pi = 0; pi < studentGraphs[seriesId].length; pi++){
				xy.push({x:parseFloat(studentGraphs[seriesId][pi][0]), y:parseFloat(studentGraphs[seriesId][pi][1])});
			}
		}
		
		// this was above before but now could be any series
		// remove any duplicates
		if (xy.length > 1){
			for (var i=xy.length-2; i >= 0; i--){
				if (xy[i].x == xy[i+1].x && xy[i].y == xy[i+1].y){
					xy.splice(i+1,1);
				}
			}
		}
		// remove any rows with a null character
		for (var i=xy.length-1; i>= 0; i--){
			if (xy[i] == null || xy[i].x == null || xy[i].y == null){
				xy.splice(i,1);
			}
		}

		// invert based a global parameter if the graph was completed from right to left
		if (invertIfBackwards && xy.length > 1){
			var allNeg = true;
			for (i = 1; i < xy.length; i++){
				if (xy[i].x > xy[i-1].x){
					allNeg = false; break;
				}
			}
			if (allNeg) xy.reverse();
		}

		var invert = false
		// if we are inverting from non-inverted switch cp to the last
		if (typeof rule.invert === "boolean" && rule.invert){
			invert = true;
			xy.reverse();
		}
		
		var collapse = typeof rule.collapse_inline_points === "undefined" ? false : rule.collapse_inline_points;
		var matchedValues, matchFound;
		// if this rule has a "return.to.point" value set, we will begin looking at the corresponding point
		if (typeof rule.return_to_point !== "undefined"){
			cp = rule.return_to_point;
			// if return to point is greater than number of points, then take last
			if (cp >= xy.length){
				cp = xy.length - 1;
			}
		}
		// initial checks:
		//first check whether there is between min and max points
		if ((typeof rule.npoints_min !== "undefined" && xy.length < rule.npoints_min)|| (typeof rule.npoints_max !== "undefined" && xy.length > rule.npoints_max)){
			var matchFound = false;
		} else {
			// search each adjacent pair of points for a hit of these rules
			var matchFound = false;
			// are we ONLY checking npoints?
			var npoints_only = true;
			for (var key in rule){
				if (key != "npoints_min" && key != "npoints_max" && non_critical_labels.indexOf(key) == -1){
					npoints_only = false;
					break;
				}
			}
			
			// if this is just a point check count this will be the last thing we do.
			if (npoints_only){
				matchFound = true; // remember, we've already checked that we've met npoint criteria
				matchedValues = [];
			} else {

				// do we have more points to check?
				if (cp < xy.length && xy.length > 0){
					for (var p = cp; p < xy.length; p++){
						var x1 = xy[p].x;
						var y1 = xy[p].y;
						var x2 = null;
						var y2 = null;
						if (p+1 < xy.length){
							x2 = xy[p+1].x;
							y2 = xy[p+1].y;
						}
						// if inverted, we need to switch p1 and p2
						/*
						if (invert){
							var tx = x1;
							var ty = y1;
							x1 = x2;
							y1 = y2;
							x2 = tx;
							y2 = ty;
						}
						*/

						//if collapsing across multiple points loop until we exceed threshold
						// TODO make available for invert
						if (collapse && x2 != null && y2 != null && !invert){
							var degrees = 180 / Math.PI * Math.atan(((y2-y1)/(ybounds_max-ybounds_min))/((x2-x1)/(xbounds_max-xbounds_min)));
							while (p+2 < xy.length){
								var tx2 = xy[p+2].x;
								var ty2 = xy[p+2].y;
								var tdegrees = 180 / Math.PI * Math.atan(((ty2-y2)/(ybounds_max-ybounds_min))/((tx2-x2)/(xbounds_max-xbounds_min)));
								if (Math.abs(degrees - tdegrees) < rule.collapse_inline_points){
									x2 = tx2;
									y2 = ty2;
									p = p + 1;
								} else {
									break;
								}							
							}
						}
						var x3 = null;
						var y3 = null;
						if (p+2 < xy.length){
							x3 = xy[p+2].x;
							y3 = xy[p+2].y;
						}
						/*
						if (invert){
							// p1 and p2 have already been swapped
							// so put p3 in p1, p1 in p2, and p2 in p3
							var tx = x1;
							var ty = y1;
							x1 = x3;
							y1 = y3;
							x3 = x2;
							y3 = y2;
							x2 = tx;
							y2 = ty; 
						}
						*/
						//console.log(rule)
						matchedValues = scoreGraph_element(rule, x1, y1, x2, y2, x3, y3);
						//console.log(matchFound)
						if (matchedValues != null){
							matchFound = true;
							// advance if we are not just looking at absolute position of first point
							//print(paste(is.na(rule.x1.min) , is.na(rule.x1.max) , is.na(rule.y1.min) , is.na(rule.y1.max) , !is.na(rule.x2.min) , !is.na(rule.x2.max) , !is.na(rule.y2.min) , !is.na(rule.y2.max) , !is.na(rule.width.min) , !is.na(rule.width.max) , !is.na(rule.height.min) , !is.na(rule.height.max) , !is.na(rule.angle.min) , !is.na(rule.angle.max)))
							if (typeof rule.x2_min!== "undefined" || typeof rule.x2_max!== "undefined" || typeof rule.y2_min!== "undefined" || typeof rule.y2_max !== "undefined" || typeof rule.yDIVx_min !== "undefined" || typeof rule.yDIVx_max !== "undefined" || typeof rule.width_min!== "undefined" || typeof rule.width_max!== "undefined" || typeof rule.height_min!== "undefined" || typeof rule.height_max!== "undefined" || typeof rule.rotation_min!== "undefined" || typeof rule.rotation_max!== "undefined" || typeof rule.angle_min!== "undefined" || typeof rule.angle_max!== "undefined"){
								cp = p + 1;
							}
							break;
						}
					}
				}
			}
		}

		if (matchFound){
			var rval = {label:rule.label, x1: null, y1 : null, x2 : null, y2 : null, yDIVx : null, width : null, height : null, rotation : null, angle : null, npoints:xy.length};
			// go through each key of the matchedValues and put in this  obj
			for (key in matchedValues){
				if (typeof rval[key] !== "undefined") rval[key] = matchedValues[key];
			}
		} else {
			rval = {label:rule.label, x1: null, y1 : null, x2 : null, y2 : null, yDIVx : null, width : null, height : null, rotation : null, angle : null, npoints : null};	
		}
		RVALS.push(rval);
		//RVALS = rbind(RVALS, rval)
		R.push(matchFound);
		
	}
	// pass through rules again to see if there are any relational type rules
	for (r = 0; r < rubric.rules.length; r++){
		rule = rubric.rules[r];
		if (typeof rule.relation !== "undefined" && rule.relation.length > 0){
			var pattern = rule.relation;
			// replace R[  with RVALS[
			// Replace labels in pattern with row index
			var ids = [];
			var repls = [];
			var val = true;
			var greg = pattern.match(/\[[a-zA-Z]+.*?\]/g);
			if (greg !== null && greg.length > 0){
				for (var g = 0; g < greg.length; g++){
					var id = greg[g].replace("[","").replace("]","");
					var repl = null;
					for (var r2 = 0; r2 < rubric.rules.length; r2++){
						if (rubric.rules[r2].label == id){
							repl = r2; 
							break;
						}
					}
					if (repl !== null){
						// make sure that this rule evaluated as true
						val = Boolean(eval("R["+repl+"]"));
						if (true){
							ids.push(id);
							repls.push(repl);
						}
					}
				}
				for (var i=0; i < ids.length; i++){
					pattern = pattern.replace("["+ids[i]+"]", "["+repls[i]+"]");
				}
			}
			
			// since we are looking for specific values, not booleans associated with rules, replace R[] with RVALS[]			
			if (true){
				pattern = pattern.replace(/R\[/g,"RVALS[");
				val = Boolean(eval(pattern));		
			}
			
			R[r] = val;
			//if (debug) print(paste(R[r]))
		}
	}	
	if (verbose){
		for (r = 0; r < R.length; r++){
			console.log(RVALS[r]["label"], R[r], RVALS[r]);
		}
	}
	
	return R;
	
}

/**
 * This is a javascript version of JV's R function 'scoreGraph.element'
 * A rule has the format of: {label:"", y1_min:0, y2
 * @return an object with data for each element and whether it matched
 */

function scoreGraph_element (rule, x1, y1, x2, y2, x3, y3){
	var df = {};
	//console.log(rule, x1, y1, x2, y2, x3, y3);
	// just look at point 1 first
	if (x1!=null){
		if ((typeof rule.x1_min === "undefined" || x1 >= rule.x1_min) && (typeof rule.x1_max === "undefined" || x1 <= rule.x1_max)) {
			df['x1'] = x1;
		} else {return null;}
	} else if (typeof rule.x1_min !== "undefined" || typeof rule.x1_max !== "undefined") {
		return null;
	}
	if (y1!=null){
		if ((typeof rule.y1_min === "undefined" || y1 >= rule.y1_min) && (typeof rule.y1_max === "undefined" || y1 <= rule.y1_max)) {
			df['y1'] = y1;
		} else {return null;}
	} else if (typeof rule.y1_min !== "undefined" || typeof rule.y1_max !== "undefined") {
		return null;
	}
	// x1 divided by y1
	if (x1!= null && y1!=null){
		if ((typeof rule.yDIVx_min === "undefined" || y1/x1 >= rule.yDIVx_min) && (typeof rule.yDIVx_max === "undefined" || y1/x1 <= rule.yDIVx_max)) {
			df['yDIVx'] = y1/x1;
		} else {return null;}
	} else if (typeof rule.yDIVx_min !== "undefined" || typeof rule.yDIVx_max !== "undefined"){
		return null;
	}		
	
	// x2 min and max
	if (x2!=null){
		if ((typeof rule.x2_min === "undefined" || x2 >= rule.x2_min) && (typeof rule.x2_max === "undefined" || x2 <= rule.x2_max)) {
			df['x2'] = x2;
		} else {return null;}
	} else if (typeof rule.x2_min !== "undefined" || typeof rule.x2_max !== "undefined") {
		return null;
	}
	if (y2!=null){
		if ((typeof rule.y2_min === "undefined" || y2 >= rule.y2_min) && (typeof rule.y2_max === "undefined" || y2 <= rule.y2_max)) {
			df['y2'] = y2;
		} else {return null;}
	} else if (typeof rule.y2_min !== "undefined" || typeof rule.y2_max !== "undefined") {
		return null;
	}
	
	if (x1!=null && x2!=null){
		if ((typeof rule.width_min === "undefined" || (x2 - x1) >= rule.width_min) && (typeof rule.width_max === "undefined" || (x2 - x1) <= rule.width_max)) {
			df['width'] = x2 - x1;
		} else {return null;}
	} else if (typeof rule.width_min !== "undefined" || typeof rule.width_max !== "undefined") {
		return null;
	}

	if (y1!=null && y2!=null){
		if ((typeof rule.height_min === "undefined" || (y2 - y1) >= rule.height_min) && (typeof rule.height_max === "undefined" || (y2 - y1) <= rule.height_max)) {
			df['height'] = y2 - y1;
		} else {return null;}
	} else if (typeof rule.height_min !== "undefined" || typeof rule.height_max !== "undefined") {
		return null;
	}

	if (x1!=null && y1!=null && x2!=null && y2!=null){
		py2 = y2; py1 = y1; px2 = x2; px1 = x1;
		if (typeof rule.xbounds_min !== "undefined" && typeof rule.xbounds_max !== "undefined" && typeof rule.ybounds_min !== "undefined" && typeof rule.ybounds_min !== "undefined"){
			width = Math.abs(x2 - x1);
			height = Math.abs(y2 - y1);
			py2 = y2/(rule.ybounds_max-rule.ybounds_min); py1 = y1/(rule.ybounds_max-rule.ybounds_min); px2 = x2/(rule.xbounds_max-rule.xbounds_min); px1 = x1/(rule.xbounds_max-rule.xbounds_min);
			if (height != 0){
				rotation = Math.atan((py2 - py1) / (px2 - px1)) * 180 / Math.PI;		
			} else {
				rotation = 0;
			}
		} else {				
			rotation = Math.atan((y2 - y1) / (x2 - x1)) * 180 / Math.PI;	
		}
		if ((typeof rule.rotation_min === "undefined" || rotation >= rule.rotation_min) && (typeof rule.rotation_max === "undefined" || rotation <= rule.rotation_max)) {df['rotation'] = rotation;} 
		else {return null;}
	} else if (typeof rule.rotation_min !== "undefined" || typeof rule.rotation_max !== "undefined"){
		return null;
	}
	
	if (x1!=null && y1!=null && x2!=null && y2!=null && x3!=null && y3!=null){
		////// if we have the bounds create the angle proportional
		py3 = y3; py2 = y2; py1 = y1; px3 = x3; px2 = x2; px1 = x1;
		if (typeof rule.xbounds_min !== "undefined" && typeof rule.xbounds_max !== "undefined" && typeof rule.ybounds_min !== "undefined" && typeof rule.ybounds_min !== "undefined"){
			width1 = Math.abs(x2 - x1);
			height1 = Math.abs(y2 - y1);
			width2 = Math.abs(x3 - x2);
			height2 = Math.abs(y3 - y2);
			//print(paste(x1, y1, x2, y2, x3, y3))
			//print(paste((rule.xbounds_max-rule.xbounds_min), (rule.ybounds_max-rule.ybounds_min)))
			py3 = y3/(rule.ybounds_max-rule.ybounds_min); py2 = y2/(rule.ybounds_max-rule.ybounds_min); py1 = y1/(rule.ybounds_max-rule.ybounds_min); px3 = x3/(rule.xbounds_max-rule.xbounds_min); px2 = x2/(rule.xbounds_max-rule.xbounds_min); px1 = x1/(rule.xbounds_max-rule.xbounds_min);
			//print(paste(px1, py1, px2, py2, px3, py3))
			if (height1 != 0){
				rotation1 = Math.atan((py2 - py1) / (px2 - px1)) * 180 / Math.PI	;	
			} else {
				rotation1 = 0
			}
			if (height2 != 0){
				rotation2 = Math.atan((py3 - py2) / (px3 - px2)) * 180 / Math.PI	;	
			} else {
				rotation2 = 0;
			}
		} else {				
			rotation1 = Math.atan((y2 - y1) / (x2 - x1)) * 180 / Math.PI;	
			rotation2 = Math.atan((y3 - y2) / (x3 - x2)) * 180 / Math.PI;	
		}
		angle = rotation2 - rotation1;
		//print(paste(angle, rotation2, rotation1))
		if ((typeof rule.angle_min === "undefined" || angle >= rule.angle_min) && (typeof rule.angle_max === "undefined" || angle <= rule.angle_max)) { df['angle'] = angle; } 
		else {return null;}	
	} else if (typeof rule.angle_min !== "undefined" || typeof rule.angle_max !== "undefined"){
		return null;
	}

	//if (debug)print("hit")
	return df;
}

/*
 * Author can use placeholders in rubric for values from a table (inserted through previous work).
 * The format should be like: T[COLUMN][ROW]
 * Will lookup appropriate cells in table and parseFloat to get integer values. If NaN, use text as is.
 */
function insertTableValuesIntoRules(rubric, T){
	for (var r = 0; r < rubric.rules.length; r++){
		var rule = rubric.rules[r];
		// cycle through keys, not seriesId or label
		
		for (var key in rule){
			if (key != "label" && key != "seriesId" && typeof rule[key] == "string"){
				var keyVal = rule[key];
				var greg = keyVal.match(/T\[[0-9]+\]\[[0-9]+\]/g);
				if (greg != null){
					var ids = [];
					var repls = [];
					for (var g = 0; g < greg.length; g++){
						var id = greg[g];
						var col = parseInt(greg[g].replace(/T\[([0-9]+)\]\[([0-9]+)\]/, "$1"));
						var row = parseInt(greg[g].replace(/T\[([0-9]+)\]\[([0-9]+)\]/, "$2"));
						var repl = null;
						
						if (col !== NaN && row !== NaN && col < T.length && row < T[col].length){
							
							var repl = T[col][row].text;
							if (parseFloat(repl) != NaN){
								repl = parseFloat(repl);
							}
							keyVal = keyVal.replace(id, repl);
							
							if (parseFloat(repl) != NaN){
								try {
									keyVal = eval(keyVal);
								} catch (err){
									// do nothing
								}	
							}
						}
					}
					rubric.rules[r][key] = keyVal;
				}			
			}
		}	
	}
	return rubric;
}


/* When the author specifies what rule to evaluate he or she will use the label to identify the
 * rule. Need to replace this label with the index of that rule in the rubric.
 */
function replaceScoreKeysWithIndex(rubric){
	if (typeof rubric.scores !== "undefined" && rubric.scores != null){
		for (var s = 0; s < rubric.scores.length; s++){
			var pattern = rubric.scores[s].pattern;
			var greg = pattern.match(/\[.*?[a-z]+.*?\]/g);
			if (greg != null){
				var ids = [];
				var repls = [];
				for (var g = 0; g < greg.length; g++){
					id = greg[g].replace("[","").replace("]","");
					repl = null;
					for (var r = 0; r < rubric.rules.length; r++){
						if (typeof rubric.rules[r].label !== "undefined" && rubric.rules[r].label == id){
							repl = r;
							break;
						}
					}
					if (repl != null){
						ids.push(id);
						repls.push(repl);
					} else {
						console.log("No Match for "+ id);
					}
				}
				for (var i = 0; i < ids.length; i++){
					pattern = pattern.replace("["+ids[i]+"]", "["+repls[i]+"]");
				}
				rubric.scores[s].pattern = pattern;
			}
		}
	}
	return rubric;
}

/*
 * Same as above, but replace keys for feedback
 */
function replaceFeedbackKeysWithIndex(rubric){
	if (typeof rubric.feedbacks !== "undefined" && rubric.feedbacks != null){
		for (var s = 0; s < rubric.feedbacks.length; s++){
			var pattern = rubric.feedbacks[s].pattern;
			var ids = [];
			var repls = [];
			var greg = pattern.match(/\[.*?[a-z]+.*?\]/g);
			if (greg != null){
				for (var g = 0; g < greg.length; g++){
					id = greg[g].replace("[","").replace("]","");
					repl = null;
					for (var r = 0; r < rubric.rules.length; r++){
						if (typeof rubric.rules[r].label !== "undefined" && rubric.rules[r].label == id){
							repl = r;
							break;
						}
					}
					if (repl != null){
						ids.push(id);
						repls.push(repl);
					} else {
						console.log("No Match for "+ id);
					}
				}
				for (var i = 0; i < ids.length; i++){
					pattern = pattern.replace("["+ids[i]+"]", "["+repls[i]+"]");
				}
				rubric.feedbacks[s].pattern = pattern;
			}
		}
	}
	return rubric;
}

/*
 * Same as above, but replace keys for branches
 */
function replaceBranchKeysWithIndex(rubric){
	if (typeof rubric.branches !== "undefined" && rubric.branches != null){
		for (var s = 0; s < rubric.branches.length; s++){
			var pattern = rubric.branches[s].pattern;
			var greg = pattern.match(/\[.*?[a-z]+.*?\]/g);
			if (greg != null){
				var ids = [];
				var repls = [];
				for (var g = 0; g < greg.length; g++){
					id = greg[g].replace("[","").replace("]","");
					repl = null;
					for (var r = 0; r < rubric.rules.length; r++){
						if (typeof rubric.rules[r].label !== "undefined" && rubric.rules[r].label == id){
							repl = r;
							break;
						}
					}
					if (repl != null){
						ids.push(id);
						repls.push(repl);
					} else {
						console.log("No Match for "+ id);
					}
				}
				for (var i = 0; i < ids.length; i++){
					pattern = pattern.replace("["+ids[i]+"]", "["+repls[i]+"]");
				}
				rubric.branches[s].pattern = pattern;
			}
		}
	}
	return rubric;
}


function cloneRubric(obj) {
	if (obj == null || typeof obj !== "object") return obj;
    var copy = obj.constructor();
    if (typeof obj.title === "string") copy.title = obj.title;
    if (typeof obj.setCompletedMinScore !== "undefined") copy.setCompletedMinScore = obj.setCompletedMinScore;
    if (typeof obj.prependFeedback === "string") copy.prependFeedback = obj.prependFeedback;
    if (typeof obj.appendFeedback === "string") copy.appendFeedback = obj.appendFeedback;
    if (typeof obj.rules === "object") {
    	copy.rules = [];
    	for (var i = 0; i < obj.rules.length; i++){
    		var cell = {};
    		for (var attr in obj.rules[i]){
    			cell[attr] = obj.rules[i][attr];
    		}
    		copy.rules.push(cell);
    	}
    }
    if (typeof obj.scores === "object") {
    	copy.scores = [];
    	for (var i = 0; i < obj.scores.length; i++){
    		var cell = {};
    		for (var attr in obj.scores[i]){
    			cell[attr] = obj.scores[i][attr];
    		}
    		copy.scores.push(cell);
    	}
    }
    if (typeof obj.feedbacks === "object") {
    	copy.feedbacks = [];
    	for (var i = 0; i < obj.feedbacks.length; i++){
    		var cell = {};
    		for (var attr in obj.feedbacks[i]){
    			cell[attr] = obj.feedbacks[i][attr];
    		}
    		copy.feedbacks.push(cell);
    	}
    }
    if (typeof obj.branches === "object") {
    	copy.branches = [];
    	for (var i = 0; i < obj.branches.length; i++){
    		var cell = {};
    		for (var attr in obj.branches[i]){
    			cell[attr] = obj.branches[i][attr];
    		}
    		copy.branches.push(cell);
    	}
    }
    
    return copy;
}

function cloneHistory(obj) {
    if (obj == null || typeof obj !== "object") return obj;
    var copy = obj.constructor();

    for (var i = 0; i < obj.length; i++){
      var cell = {};
      for (var attr in obj[i]){
        cell[attr] = obj[i][attr];
      }
      copy.push(cell);
    }
    return copy;
  }

  function cloneDataArray(obj){
  	// make sure this is an associative array
    var copy = {};
    for (var s in obj){
    	copy[s] = [];
    	for (var i = 0; i < obj[s].length; i++){
      		copy[s].push([obj[s][i][0], obj[s][i][1]]);
      	}
    }
    return copy;
  }
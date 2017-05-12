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
	//debugger;
	//get the step object
	var stepObject = obj;
	
	//get the node id
	var nodeId = args[0];
	
	//get the node state
	var nodeState = args[1];

	/*
	 * make sure the event was fired for the same step this listener was created for.
	 * we need to perform this check because 'beforeSaveNodeState' will be fired
	 * for all steps.
	 */
	 debugger;
	if(stepObject.node.id == nodeId) {
		nodeState.history = cloneHistory(stepObject.node.history);
	}
}

function cloneHistory(obj) {
    if (obj == null || typeof obj !== "object") return obj;
    var copy = obj.constructor();

    for (var i = 0; i < obj.length; i++){
      var cell = {};
      cell.event = {};
      cell.event.eventType = typeof obj[i].event.eventType !== 'undefined' ? obj[i].event.eventType : "";
      cell.event.elementId = typeof obj[i].event.elementId !== 'undefined' ? obj[i].event.elementId : "";
      cell.event.newValue = typeof obj[i].event.newValue !== 'undefined' ? obj[i].event.newValue : "";
      cell.globalValues = {};
      for (var attr in obj[i].globalValues){
        cell.globalValues[attr] = obj[i].globalValues[attr];
      }
      cell.timestamp = obj[i].timestamp;
      copy.push(cell);
    }
    return copy;
  };
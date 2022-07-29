/**
* *************************************************
* Make Help Scout conversation threads collapsible.
* *************************************************
* Author - Juan José Machado a.k.a Obi Juan.
* Website - https://obijuan.dev
* Twitter - @obijuandev
* *************************************************
* Logic script of the Chrome Extension.
* Help Scout threads by default are not collapsible.
* In some conversations, it makes it difficult to keep up with the email,
* making it hard to provide support.
* *************************************************
* The script adds a collapsible capability to each response in the email thread,
* allowing you to hide/show the message content by clicking the response header.
***************************************************
* Supports short and long threads.
* Features
* - Add collapsible capabilities for all threads, including threads loaded dynamically.
* - Collapse/Expand functionality.
* - Ignores 'single line' updates.
* - Supports notes.
* - Supports first message.
* - Supports conversation switching.
* *************************************************
* TO DO
* - Fix the thread date acting funny when clicked.
* - Add a collapse/expand all button.
* - Add indicative that the thread is collapsed.
* - Add collapse animation/transition to collapsing threads.
* - Add expand animation/transition to expanding messages.
**/

// Select the threads available on the first load.
const supportThreadResponses = document.getElementsByClassName('pic thread');

// Toggle event listener function added to each node.
function mws_click_toggle(elementVar){

	/*
	Try a switch condition to add a different style display none or display block to the elements depending if the state is to collapse or expand.
	*/

	// Get the current status of the node
	let statusVar = elementVar.getElementsByClassName('messageBody')[0].getAttribute('obiStatus');

	// Debug: Display the status on each click
	//console.log(statusVar);

	/**
	* Switch condition to add two behaviors to the same Event Listener
	* Collapse / Expand
	**/

	switch(statusVar){

		case 'expanded':
		// Hides the message body of the current node.
		elementVar.getElementsByClassName('messageBody')[0].style = 'display:none';
		// Changes the node status to collapsed. 
		elementVar.getElementsByClassName('messageBody')[0].setAttribute('obiStatus', 'collapsed');
		// Sets the statusVar value to the new status changed above.
		statusVar = elementVar.getElementsByClassName('messageBody')[0].getAttribute('obiStatus');
		break;
		
		case 'collapsed':
		// Shows the message body of the current node.
		elementVar.getElementsByClassName('messageBody')[0].style = 'display:block';
		// Changes the node status to expanded.
		elementVar.getElementsByClassName('messageBody')[0].setAttribute('obiStatus', 'expanded');
		// Sets the statusVar value to the new status changed above.
		statusVar = elementVar.getElementsByClassName('messageBody')[0].getAttribute('obiStatus');
		break;
		
		default:
		break;
	}

}

// Adds the collapsible behavior to the responses available on the first load.
function obi_add_collapsible_on_first_load(theThread){
	for( i = 0; i < theThread.length; i++){
		// Store the current thread on each loop.
		var aloxxi = theThread[i];

		// Pass the current selected thread to the Toggle function as an argument.
		theThread[i].getElementsByClassName('threadHeader')[0].addEventListener('click', mws_click_toggle.bind(this, aloxxi) , false);

		theThread[i].getElementsByClassName('threadHeader')[0].style = 'cursor: pointer';

		// Set the initial status of threads to 'Expanded'.
		theThread[i].getElementsByClassName('messageBody')[0].setAttribute('obiStatus', 'expanded');

	}

}
/*
window.onload = function(){

	// On document load, pass the selected threads available on the first load
	// to the obi_add_collapsible_on_first_load function.
	obi_add_collapsible_on_first_load(supportThreadResponses);

}
*/

// Check whether the current page is a conversation or not.
function isConversation(conversationURL){
	
	if( (conversationURL.includes('conversation')) !== true ){
		//console.log('no es una conversacion');
		return; // False if not a conversation.
	} 

	if( (conversationURL.includes('conversation')) == true ){
		//console.log('si es una conversacion');

		// Initialize the collapsible functionality on "first load".
		obi_add_collapsible_on_first_load(supportThreadResponses);
		
		// Initialize the mutation observer in the converation page.
		newElementsObserver();

	} 

}

// Observes help scout for any URL changes.
function urlLoadObserver(){

	let lastUrl = location.href; 

	new MutationObserver(() => {

  	const url = location.href;
	
  	if (url !== lastUrl) {
	  // Check if the new URL is a conversation or not.
	  isConversation(url); 

      lastUrl = url;
      
	  //console.log('URL changed!', location.href);

	}

}).observe(document, {subtree: true, childList: true});

}

window.onload = function(){

	// Start observing URL changes on load.
	urlLoadObserver();

	// Check if the page on the first document load is a conversation.
	isConversation(location.href);


}


/** 
* Mutation code ****************
* This code detects new mutations in the parent of all responses
* in Help Scout email conversation.
* It provides an opportunity to add behavior to new elements
* added to the DOM.
**/

function newElementsObserver(){

	// Select the node that will be observed for mutations.
var targetNode = document.getElementById('tkContent');

// Options for the observer.
var config = { childList: true };

// Callback function to execute when mutations are observed.
var callback = function(mutationsList) {
	// Stoo the observer from observing to add behavior.
	observer.disconnect();

	// Loop through the mutations added.
    for(var mutation of mutationsList) {
    	// Store the mutation node for each loop.
    	let passMutation = mutation.addedNodes[0];
        if (mutation.type == 'childList' && passMutation.className != 'singleLine') {

            passMutation.getElementsByClassName('threadHeader')[0].addEventListener('click', mws_click_toggle.bind(this, passMutation) , false);
            passMutation.getElementsByClassName('messageBody')[0].setAttribute('obiStatus', 'expanded');
			passMutation.getElementsByClassName('threadHeader')[0].style = 'cursor: pointer';

        }

    }
    // Start the observer again after the loop.
    observer.observe(targetNode, config);

};

// Create the observer instance, passing the callback as an argument.
var observer = new MutationObserver(callback);

// Start the observer.
observer.observe(targetNode, config);
}
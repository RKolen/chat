
var xhr = new XMLHttpRequest();
var key = "raymond";
// for the retrieve messages function change 0 to avoid seeing really old messages
var highestId = 0;

$(function() {
	var messageScreen = document.getElementById("chat-messages");
	// attach username to submit and start the session
	$("#textbox").keypress(function(event) {
		if(event.which == 13) {	
		//looks for enter key
			if ( $("#enter").prop("checked") ) {
				// looks if submit on enter is checked
				//console.log("enter pressed, checkbox is checked");
				$("#send").click();
				event.preventDefault();
			}
		}
	});

	// function sends message to the server and displays in chat-messages
	$("#send").click(function() {
		//user name added to message
		var userID = $(".chatname").val();
		var allMessage = $("#chat-messages").html();
		var newMessage = $("#textbox").val();
		//console.log(userID);
		username = "<span class = 'username' >" + userID + " says: </span>";
		//function to clear textbox after sending message
		$("#textbox").val("");
		//sending to server username+message
		xhr.open("POST", "https://www.codegorilla.nl/read_write/api.php?action=write&mykey="+ key +"&value=" + username + newMessage, false);
		xhr.send ();
		//show all messages
		$("#chat-messages").html(allMessage);
		//scrolls down on send automatically
		scrollToBottom();
	});

	//scrolls to the bottom of the page
	function scrollToBottom() {
		$("#chat-messages").scrollTop($("#chat-messages").prop("scrollHeight"));
	}

	//retrieves from the server
	function grabMessageById(id) {
		xhr.open("GET", "https://codegorilla.nl/read_write/api.php?action=read&mykey=" + key + "&id=" + id, false);
		xhr.send();
	}

	// gets the old messages from server
	function getCorrectIds() {
		xhr.open("GET" , "https://codegorilla.nl/read_write/api.php?action=list&mykey=" + key, false);
		xhr.send();
		correctids = xhr.response;
		//splits array of substrings
		correctids = correctids.split(",");
		// gets the id`s used by the specific key
		for (i = 0 ; i < correctids.length; i++) {
			correctids[i] = parseInt(correctids[i]);
		}
	}

	//function to refresh and show old messages
	function refreshChat() {
		var messageScreen = document.getElementById("chat-messages");
			for (i = 0; i < correctids.length; i++) {
				if (correctids[i] > highestId) {
					grabMessageById(correctids[i]);
					var newMessage = xhr.response;
					//line break for messages
					messageScreen.innerHTML += newMessage + "<br>";
					// to see latest messages
					scrollToBottom("chat-messages");
					highestId = correctids[i];
				}
			}
	}

	//refreshes window
	window.setInterval(function() {
		getCorrectIds();
		refreshChat();
	}, 6000);
		
});

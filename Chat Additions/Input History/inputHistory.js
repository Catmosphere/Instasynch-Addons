function loadInputHistoryOnce() {
    events.bind('onInputKeypress', function(event, message) {
        if (event.keyCode === 13 && message !== '') {
            if (inputHistoryIndex !== 0) {
                //remove the string from the array
                inputHistory.splice(inputHistoryIndex, 1);
            }
            //add the string to the array at position 1
            inputHistory.splice(1, 0, message);

            //50 messages limit (for now)
            if (inputHistory.length === 50) {
                //delete the last
                inputHistory.splice(inputHistory.length - 1, 1);
            }
        }
        setInputHistoryIndex(0);
    });
}

function loadInputHistory() {
    $("#chat input").bind('keydown', function(event) {
        if (isAutocompleteMenuActive && inputHistoryIndex === 0) {
            return;
        }
        if (event.keyCode === 38) { //upkey
            if (inputHistoryIndex < inputHistory.length) {
                setInputHistoryIndex(inputHistoryIndex + 1);
            } else {
                setInputHistoryIndex(0);
            }
            //insert the string into the text field
            $(this).val(inputHistory[inputHistoryIndex]);

        } else if (event.keyCode === 40) { //downkey
            if (inputHistoryIndex > 0) {
                setInputHistoryIndex(inputHistoryIndex - 1);
            } else {
                setInputHistoryIndex(inputHistory.length - 1);
            }
            //insert the string into the text field
            $(this).val(inputHistory[inputHistoryIndex]);
        }
    });
}

function setInputHistoryIndex(index) {
    inputHistoryIndex = index;
    if (index === 0) {
        autocomplete = true;
    } else {
        autocomplete = false;
    }
}

var inputHistory = [''],
    inputHistoryIndex = 0;
events.bind('onResetVariables', function() {
    inputHistoryIndex = 0;
});
events.bind('onPostConnect', loadInputHistory);
events.bind('onExecuteOnce', loadInputHistoryOnce);
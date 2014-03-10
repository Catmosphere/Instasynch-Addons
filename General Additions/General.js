function loadGeneralStuff() {

    //http://joquery.com/2012/string-format-for-javascript
    String.format = function() {
        // The string containing the format items (e.g. "{0}")
        // will and always has to be the first argument.
        var theString = arguments[0],
            i,
            regEx;

        // start with the second argument (i = 1)
        for (i = 1; i < arguments.length; i += 1) {
            // "gm" = RegEx options for Global search (more than one instance)
            // and for Multiline search
            regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
            theString = theString.replace(regEx, arguments[i]);
        }
        return theString;
    };

    thisUsername = $.cookie('username');

    // unsafeWindow.addEventListener("message", 
    // function(event){
    //     try{
    //         var parsed = JSON.parse(event.data);
    //         if(parsed.newTabParameters){
    //             openInNewTab(parsed.newTabParameters[0],parsed.newTabParameters[1]);
    //         }
    //     }catch(err){
    //     }
    // }, false);
    // function openInNewTab(url, options){
    //     GM_openInTab(url,options);
    // }
    events.bind('onUserlist', function() {
        isConnected = true;
    });
    events.bind('onDisconnect', function() {
        isConnected = false;
    });
    events.bind('onRoomChange', function() {
        isConnected = false;
    });
    events.bind('onResetVariables', function() {
        if (!isConnected) {
            unsafeWindow.users = new Array();
            unsafeWindow.playlist = new Array();
            unsafeWindow.playlist.move = function(old_index, new_index) //Code is property of Reid from stackoverflow
            {
                if (new_index >= this.length) {
                    var k = new_index - this.length;
                    while ((k--) + 1) {
                        this.push(undefined);
                    }
                }
                this.splice(new_index, 0, this.splice(old_index, 1)[0]);
            };
            unsafeWindow.totalTime = 0;
            unsafeWindow.messages = 0;
            unsafeWindow.MAXMESSAGES = 175;
            unsafeWindow.mouseOverBio = false;
            unsafeWindow.autoscroll = true;
            unsafeWindow.isMod = false;
            unsafeWindow.isLeader = false;
            unsafeWindow.sliderTimer = false;
            unsafeWindow.mutedIps = new Array();
            unsafeWindow.userInfo = null;
            unsafeWindow.newMsg = false;
        }
    });
    //we are already connected
    if (unsafeWindow.userInfo) {
        isConnected = true;
    }
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}
var isConnected = false;

function logError(origin, err) {
    unsafeWindow.console.log("Error in %s %o", origin, err);
}

function isUsername(username) {
    return username.match(/^([A-Za-z0-9]|([\-_](?![\-_]))){5,16}$/) !== null;
}

function getUrlOfInfo(vidinfo) {
    var url;
    switch (vidinfo.provider) {
        case 'youtube':
            url = 'http://youtu.be/' + vidinfo.id;
            break;
        case 'vimeo':
            url = 'http://vimeo.com/' + vidinfo.id;
            break;
        case 'twitch':
            url = 'http://twitch.tv/' + vidinfo.channel;
            break;
        default:
            break;
    }
    return url;
}

function getActiveVideoIndex() {
    return $('.active').index();
}

function isUserMod() {
    return unsafeWindow.isMod;
}

function isBibbyRoom() {
    return unsafeWindow.ROOMNAME.match(/bibby/i) ? true : false;
}

function getIndexOfUser(id) {
    var i;
    for (i = 0; i < unsafeWindow.users.length; i += 1) {
        if (id === unsafeWindow.users[i].id) {
            return i;
        }
    }
    return -1;
}

function blockEvent(event) {
    event.stopPropagation();
}

function getUsernameArray(lowerCase) {
    var arr = [],
        i;
    for (i = 0; i < unsafeWindow.users.length; i += 1) {
        if (unsafeWindow.users[i].username !== 'unnamed') {
            if (!lowerCase) {
                arr.push(unsafeWindow.users[i].username);
            } else {
                arr.push(unsafeWindow.users[i].username.toLowerCase());
            }
        }
    }
    return arr;
}

var thisUsername;

/*
 ** Returns the caret (cursor) position of the specified text field.
 ** Return value range is 0-oField.value.length.
 ** http://flightschool.acylt.com/devnotes/caret-position-woes/
 */
function doGetCaretPosition(oField) {

    // Initialize
    var iCaretPos = 0,
        oSel;

    // IE Support
    if (document.selection) {
        // Set focus on the element
        oField.focus();

        // To get cursor position, get empty selection range
        oSel = document.selection.createRange();

        // Move selection start to 0 position
        oSel.moveStart('character', -oField.value.length);

        // The caret position is selection length
        iCaretPos = oSel.text.length;
    } else if (oField.selectionStart || oField.selectionStart === '0') { // Firefox support
        iCaretPos = oField.selectionStart;
    }

    // Return results
    return iCaretPos;
}

function doSetCaretPosition(oField, position) {
    //IE
    if (document.selection) {
        var oSel;
        oField.focus();
        oSel = document.selection.createRange();
        oSel.moveStart('character', position);
        oSel.moveEnd('character', position);
    } else if (oField.selectionStart || oField.selectionStart === '0') { // Firefox support
        oField.selectionStart = position;
        oField.selectionEnd = position;
    }
}

function pasteTextAtCaret(text) {
    var sel,
        range,
        textNode;
    if (unsafeWindow.getSelection) {
        // IE9 and non-IE
        sel = unsafeWindow.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            textNode = document.createTextNode(text);
            range.insertNode(textNode);

            // Preserve the selection
            range = range.cloneRange();
            range.setStartAfter(textNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    } else if (document.selection && document.selection.type !== "Control") {
        // IE < 9
        document.selection.createRange().text = text;
    }
}

//http://stackoverflow.com/a/4742655
$.fn.bindUp = function(type, fn) {

    type = type.split(/\s+/);

    this.each(function() {
        var len = type.length;
        while (len--) {
            $(this).bind(type[len], fn);

            var evt = $.data(this, 'events')[type[len]];
            evt.splice(0, 0, evt.pop());
        }
    });
};

function css(a) {
    var sheets = document.styleSheets,
        o = {};
    for (var i in sheets) {
        var rules = sheets[i].rules || sheets[i].cssRules;
        for (var r in rules) {
            if (a.is(rules[r].selectorText)) {
                o = $.extend(o, css2json(rules[r].style), css2json(a.attr('style')));
            }
        }
    }
    return o;
}

function css2json(css) {
    var s = {};
    if (!css) return s;
    if (css instanceof CSSStyleDeclaration) {
        for (var i in css) {
            if ((css[i]).toLowerCase) {
                s[(css[i]).toLowerCase()] = (css[css[i]]);
            }
        }
    } else if (typeof css == "string") {
        css = css.split("; ");
        for (var i in css) {
            var l = css[i].split(": ");
            s[l[0].toLowerCase()] = (l[1]);
        }
    }
    return s;
}
var afterConnectFunctions = [];
var beforeConnectFunctions = [];

function afterConnect(){
    if (messages < 3) {
        setTimeout(function () {afterConnect();}, 100);
        return;
    }

    for(var i = 0; i< afterConnectFunctions.length;i++){
            afterConnectFunctions[i]();
    }
}
function beforeConnect(){
    for(var i = 0; i< beforeConnectFunctions.length;i++){
            beforeConnectFunctions[i]();
    }
}
$.when(
    //Messagefilter
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/Chat%20Additions/Messagefilter/messagefilter.js'),
    
    //Autocomplete
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/Chat%20Additions/Autocomplete/autocomplete.js'),
    
    //Inputhistory
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/Chat%20Additions/Input%20History/inputhistory.js'),
    
    //Name Autocomplete
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/Chat%20Additions/Name%20Autocomplete/nameautocomplete.js'),
    
    //OnClick kick&ban
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/Chat%20Additions/OnClickKickBan/OnClickKickBan.js'),

    //Autoscroll Fix
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/Chat%20Additions/Autoscroll%20Fix/AutoscrollFix.js'),

    //wallcounter
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/Playlist%20Additions/Wallcounter/wallcounter.js'),
    
    //Mousewheel Volumecontrol
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/Player%20Additions/Mousewheel%20Volumecontrol/mousewheelvolumecontrol.js'),
    
    //Toggle Player
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/Player%20Additions/Toggle%20Player/TogglePlayer.js'),

    //Mirror Player
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/Player%20Additions/Mirror%20Player/MirrorPlayer.js'),

    //Description replacement
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/General%20Additions/Description.js'),

    //Additional Commands
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/General%20Additions/Additional%20Commands/AdditionalCommands.js'),

    //Settings Loader
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/General%20Additions/Settings%20Loader/SettingsLoader.js'),

    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function(){
        beforeConnect();
        afterConnect();
});

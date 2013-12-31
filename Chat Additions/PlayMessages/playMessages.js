/*
    Copyright (C) 2013 fugXD

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    http://opensource.org/licenses/GPL-3.0
*/

function loadPlayMessages(){
    //load settings
    playMessages = settings.get('playMessages','true');
    
    //add the command
    commands.set('addOnSettings',"PlayMessages",togglePlayMessages);
    
    // Overwriting Adduser
    var oldPlayVideo = playVideo;

    playVideo = function(vidinfo, time, playing) {
        // Only if blackname or mod
        if (playMessages){
            indexOfVid = getVideoIndex(vidinfo);
            title = ((playlist[indexOfVid].title.length>240)?playlist[indexOfVid].title.substring(0,240)+"...":playlist[indexOfVid].title);
            addMessage('', 'Now playing: ' + title, '','hashtext'); 
        }
        oldPlayVideo(vidinfo, time, playing);
    };
}

var playMessages = true;

function togglePlayMessages(){
    playMessages = !playMessages;
    settings.set('playMessages',playMessages);
}

postConnectFunctions.push(loadPlayMessages);
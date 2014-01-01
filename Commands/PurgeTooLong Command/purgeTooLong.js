/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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

function loadPurgeTooLongCommand(){
    commands.set('modCommands',"purgeTooLong ",purgeTooLong);
}

function purgeTooLong(params){
    var maxTimeLimit = params[1]?parseInt(params[1])*60:60*60,
        videos = [],
        i;

    //get all Videos longer than maxTimeLimit
    for (i = 0; i < window.playlist.length; i++) {
        if(window.playlist[i].duration >= maxTimeLimit){
            videos.push({info:window.playlist[i].info, duration:window.playlist[i].duration});
        }
    }  

    function compareVideos(a,b){
        return b.duration - a.duration;
    }
    videos.sort(compareVideos);

    for (var i = 0; i < videos.length; i++) {
        window.sendcmd('remove', {info: videos[i].info});
    }
}

preConnectFunctions.push(loadPurgeTooLongCommand);
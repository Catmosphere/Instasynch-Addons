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

function loadGreynameCount(){
    var oldAddUser = window.addUser,
        oldRemoveUser = window.removeUser;

    window.addUser = function(user, css, sort) {
        oldAddUser(user, css, sort);
        setViewerCount();
    };    
    window.removeUser = function(id) {
        oldRemoveUser(id);
        setViewerCount();
    };
    setViewerCount();
}
function setViewerCount(){
    var greynameCount = 0,
        i;
    for (i = 0; i < window.users.length; i++) {
        if(!window.users[i].loggedin){
            greynameCount++;
        }
    };
    $('#viewercount').html(window.users.length-greynameCount + '/' +greynameCount);
}

preConnectFunctions.push(loadGreynameCount);
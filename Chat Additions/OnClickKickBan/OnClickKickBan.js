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

function loadOnClickKickBan(){
    if(!isUserMod()){
        return;
    }
    var oldAddMessage = window.addMessage;

    //overwrite InstaSynch's  addMessage function
    window.addMessage = function(username, message, userstyle, textstyle) {
        
        oldAddMessage(username, message, userstyle, textstyle);
        //only add the onclick events if the user is a mod and its not a system message
        if(username != ''){
            var currentElement,
                //the cursor doesnt need to be changed if the key is still held down
                isCtrlKeyDown = false,
                keyDown = 
                function(event){
                    if(!isCtrlKeyDown && (event.ctrlKey || (event.ctrlKey && event.altKey))) {
                        isCtrlKeyDown = true;
                        currentElement.css( 'cursor', 'pointer' );
                    }
                },
                keyUp = 
                function(event){
                    if(isCtrlKeyDown && !event.ctrlKey){
                        isCtrlKeyDown = false;
                        currentElement.css('cursor','default');
                    }
                };
            //add the events to the latest username in the chat list
            $('#chat_list > span:last-of-type').prev()
            .on('click', function(event){
                if(event.ctrlKey){
                    var user = $(this)[0].innerHTML,
                        userFound = false,
                        isMod = false,
                        userId,
                        i;
                    user = user.match(/([^ ]* - )?([\w_-]*):/)[2];
                    for(i = 0; i< window.users.length;i++){
                        if(window.users[i].username === user ) {
                            if(window.users[i].permissions > 0){
                                isMod = true;
                                break;
                            }
                            userId = window.users[i].id;
                            userFound = true;
                            break;
                        }
                    }       
                    if(event.altKey){
                        if(isMod){
                            window.addMessage('', "Can't ban a mod", '', 'hashtext');
                        }else{
                            if(userFound){
                                window.sendcmd('ban', {userid: userId});    
                                window.addMessage('', 'b& user: '+user, '', 'hashtext');
                            }else{
                                window.sendcmd('leaverban', {username: user});    
                                window.addMessage('', 'Leaverb& user: '+user, '', 'hashtext');
                            }
                        }
                    }else{          
                    if(isMod){
                            window.addMessage('', "Can't kick a mod", '', 'hashtext');
                        }else{
                            if(userFound){
                                window.sendcmd('kick', {userid: userId});   
                                window.addMessage('', 'Kicked user: '+user, '', 'hashtext');
                            }else{
                                window.addMessage('', "Didn't find the user", '', 'hashtext');
                            }
                        }
                    }
                }
            })        
            .hover(
            function(event){
                currentElement = $(this);
                $(document).bind('keydown',keyDown);
                $(document).bind('keyup',keyUp);
            },function(){       
                currentElement.css('cursor','default');
                isCtrlKeyDown = false;
                $(document).unbind('keydown',keyDown);
                $(document).unbind('keyup',keyUp);
            });
        }
    };
    var chatCtrlDown = false,
        oldScroll,
        blockScrolling = function(event){
            event.stopPropagation();
        },
        chatKeyDown = function (event) {
            if(!chatCtrlDown && (event.ctrlKey || (event.ctrlKey && event.altKey))) {
                window.autoscroll = false;
                $('#chat_list').bind('scroll',blockScrolling);
                chatCtrlDown = true;
            }
        },
        chatKeyUp = function (event) {
            if(chatCtrlDown && !event.ctrlKey){
                window.autoscroll = true;
                $('#chat_list').unbind('scroll',blockScrolling);
                $('#chat_list').scrollTop($('#chat_list')[0].scrollHeight);
                chatCtrlDown = false;
            }
        };
    $('#chat_list').hover(
        function(){
            $(document).bind('keydown',chatKeyDown);
            $(document).bind('keyup',chatKeyUp);
        },function(){       
            chatCtrlDown = false;
            $(document).unbind('keydown',chatKeyDown);
            $(document).unbind('keyup',chatKeyUp);
    });
}

postConnectFunctions.push(loadOnClickKickBan);
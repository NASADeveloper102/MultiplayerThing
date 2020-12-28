
  var player = new Player("Boy", {x: 0, y: 0}, "black");
  var other_players = new Array();
  const uuid = PubNub.generateUUID();
  const pubnub = new PubNub({
    publishKey: "pub-c-2629c722-26bd-4209-8e84-55e579be26fa",
    subscribeKey: "sub-c-f9bf14ca-4931-11eb-ae10-b69578166507",
    uuid: uuid
  });
  
pubnub.subscribe({
    channels: ['game_data', 'chat'],
    withPresence: true
});
pubnub.addListener({
    message: function(event) {
        if(event.channel == "chat"){
            jQuery("#messages").append('<p class = "message">' + event.message.content+'</p>');
        }
        else{
            var x = parseInt(event.message.content.split("|")[1]);
            var y = parseInt(event.message.content.split("|")[2]);
            
            var false_or_true = false;
            for(var i = 0; i < other_players.length; i++){
                if(other_players[i].name == event.message.content.split("|")[0]){
                    false_or_true = true;
                    other_players[i].position = {"x": x, "y":y}
                    other_players[i].color = event.message.content.split("|")[3]
                }
            }
            if(false_or_true == false && event.message.content.split("|")[0] != player.name){
                other_players.push(new Player(event.message.content.split("|")[0], {"x": x, "y":y}, event.message.content.split("|")[3]));
            }
        }
    }
  });
jQuery("#send").click(()=>{
    pubnub.publish({
        channel : "chat",
        message : {"sender": uuid, "content": player.name + " : " + (jQuery("#message_box").val())}
      }, function(status, response) {
        //Handle error here
      });
});
function setup(){
    createCanvas(windowWidth, windowHeight);
    document.getElementById("chat").style.zIndex = "2";
    document.getElementById("coding_input").style.zIndex = "1";
    jQuery("canvas").css({"position" : "absolute", "top":"0px", "left":"0px"});
}
function draw(){
    background(255);
    player.Render();
    for(var i = 0; i < other_players.length; i++){
        other_players[i].Render();
    }
    if(keyIsDown(87)){player.position.y -= 10;}
    if(keyIsDown(83)){player.position.y += 10;}
    if(keyIsDown(65)){player.position.x -= 10;}
    if(keyIsDown(68)){player.position.x += 10;}
    
    
}
setInterval(()=>{
    pubnub.publish({
        channel : "game_data",
        message : {"sender": uuid, "content": player.name + "|" + player.position.x + "|" + player.position.y + "|" + player.color}
      }, function(status, response) {
        //Handle error here
      });
}, 300);

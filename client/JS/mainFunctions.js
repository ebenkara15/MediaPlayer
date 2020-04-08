/* Here we define the main functions used to make the Media Player
working correctly */
var runnin, previous, next;


function playPause(){
    var buttonImg_PlayPause = document.getElementById("playPause_img");
    var audioPlayer = document.getElementById("audioplayer");
    if (buttonImg_PlayPause.getAttribute("src")==="icon/icon-pause.svg"){
        buttonImg_PlayPause.src = "icon/icon-jouer.svg";
        audioPlayer.pause()
    }
    else{
        buttonImg_PlayPause.src = "icon/icon-pause.svg";
        audioPlayer.play();
    }
}

function prevSong(){
    if (previous.childNodes[1] != undefined || previous === null){
        previous.childNodes[1].click();
    }
}

function nextSong(){
    if (next.childNodes[1] != undefined || next === null){
        next.childNodes[1].click();
    }
}

function selectSong(e){
    var btns = document.getElementsByClassName("control");

    for (let i=0; i<btns.length; i++){btns[i].disabled = false}


    var path = e.srcElement.id.split('/');
    var artistDesc = document.getElementsByClassName("artistDesc")[0];
    console.log(artistDesc)
    var artist = data["artists"][parseInt(path[1])]["name"];
    var songInfo = artist+"/"+path[path.length-2];
    artistDesc.id = songInfo;

    var albumImg = document.getElementById("playerAlbum");
    albumImg.src = '/data/img_album/'+data["artists"][parseInt(path[1])]["albums"][parseInt(path[3])]["album_img"]
    
    if (e.srcElement.parentElement.parentElement.id === "playlist"){
        if (runnin != undefined){runnin.className = "trackDivPlaylist";}
        runnin = e.srcElement.parentElement;
        runnin.className = "trackDivPlaylistOnrun";
        previous = e.srcElement.parentElement.previousElementSibling;
        next = e.srcElement.parentElement.nextElementSibling;
    }

    var file = path[path.length-1]
    var audioPlayer = document.getElementById("audioplayer");
    console.log(file);
    audioPlayer.src = '/data/musics/'+file;
    
}

function onload_setup(){
    load_music_lib();
    eventListenerSetter();
}

function load_music_lib(){
    xhr = new XMLHttpRequest();
    xhr.onload = function() {
        data = JSON.parse(this.responseText);
        generateMusicNav(data);
    }
    xhr.open('GET', '/music_lib', true);
    xhr.send();
}

function generateMusicNav() {
    var navigation = document.getElementById("navigation");
    var n_artists = data['artists'].length;
    for (let i=0; i<n_artists; i++){
        var frag = document.createDocumentFragment();
        var div_artist = document.createElement('div');
        var div_artist_clickable = document.createElement('div');

        div_artist.id = data["artists"][i]['name'] + '_' + i + '_global';
        div_artist.className = "divArtistNav";

        div_artist_clickable.id =  data["artists"][i]['name'] + '_' + i;
        div_artist_clickable.onclick = generateMusicAlbum;
        div_artist_clickable.textContent = data["artists"][i]['name'];
        div_artist_clickable.style.height = "100%";

        div_artist.appendChild(div_artist_clickable);
        frag.appendChild(div_artist);
        navigation.appendChild(frag);
    }
}

function makeDivVisible(div){
    var div_artist = document.getElementById(div.srcElement.id+"_global");
    var divChildren = div_artist.children;
    
    for (let i=1; i<divChildren.length; i++){
        divChildren[i].style.visibility = (divChildren[i].style.visibility==="hidden" ? "visible"||"unset" : "hidden");
        div_artist.style.height = (divChildren[i].style.visibility === "hidden" ? "50px" : "auto");
    }
}

function generateMusicAlbum(artist){
    var div_artist = document.getElementById(artist.srcElement.id+"_global");
    document.getElementById(artist.srcElement.id).onclick = makeDivVisible;
    div_artist.style.height = "auto";
    var index = div_artist.id.split('_')[1];
    var albumDesc = document.createElement("div");

    dataArtist = data["artists"][index]["albums"];

    for (let i=0; i<dataArtist.length; i++){
        var div_album = document.createElement('div');
        var album = dataArtist[i];
        var albumDesc = document.createElement("div");
        albumDesc.id = "desc_"+album["name"]+"_"+i;
        albumDesc.className = "divDescAlbum"
       

        div_album.id = album["name"] + "_" + i;
        div_album.className = "divAlbum";
        div_album.onclick = generateMusicTracks;

        var spanAlbumName = document.createElement('span');
        spanAlbumName.className = "spanAlbumName";
        spanAlbumName.textContent = album["name"];

        var spanAlbumDate = document.createElement('span');
        spanAlbumDate.className = "spanAlbumDate";
        spanAlbumDate.textContent = album["date"];

        var imageAlbum = document.createElement('img');
        imageAlbum.className = "imgAlbum";
        imageAlbum.src = 'data/img_album/'+album["album_img"];

        albumDesc.appendChild(spanAlbumName);
        albumDesc.appendChild(spanAlbumDate);
        albumDesc.appendChild(imageAlbum);
        
        div_album.appendChild(albumDesc);
        div_artist.appendChild(div_album);
    }
}

function generateMusicTracks(album){
    var albumDiv;
    
    if (album.srcElement.childElementCount === 0){albumDiv = album.srcElement.parentElement.parentElement}
    else{albumDiv = album.srcElement.parentElement}
    //console.log(albumDiv);

    var idArtist = parseInt(albumDiv.parentElement.id.split('_')[1]);
    var idAlbum = parseInt(albumDiv.id.split('_')[1]);
    var tracksList = data["artists"][idArtist]["albums"][idAlbum]["tracks_name"];
    var tracksContainer = document.createElement("div");
    tracksContainer.className = "tracksContainer";

    for(let i=0; i<tracksList.length; i++){
        var buttonDiv = document.createElement("div")
        buttonDiv.className = "buttonDivTrack";

        var buttonPlay = document.createElement("img");
        buttonPlay.src = "icon/play-circle_icon.svg";
        buttonPlay.className = "buttonTrack";
        buttonPlay.onclick = selectSong;
        buttonPlay.id = "artists/"+idArtist+"/albums/"+idAlbum+"/"+tracksList[i]["name"]+"/"+tracksList[i]["file"];
        
        var addPlaylist = document.createElement("img");
        addPlaylist.src = "icon/plus-circle_icon.svg";
        addPlaylist.className = "buttonTrack";
        addPlaylist.id = "artists/"+idArtist+"/albums/"+idAlbum+"/"+tracksList[i]["name"]+"/"+tracksList[i]["file"];
        addPlaylist.onclick = addToPlaylist;

        var div_track = document.createElement("div");
        div_track.id = tracksList[i]["name"]+"_"+i.toString();
        div_track.className = "trackDiv";

        var spanNum = document.createElement("span");
        spanNum.className = "spanTrackNumber";
        spanNum.textContent = (i+1).toString()+".";

        var spanTrackTitle = document.createElement("span");
        spanTrackTitle.className = "spanTrackTitle";
        spanTrackTitle.textContent = tracksList[i]["name"];
        

        div_track.appendChild(spanNum);
        div_track.appendChild(spanTrackTitle);
        buttonDiv.appendChild(buttonPlay);
        buttonDiv.appendChild(addPlaylist);
        div_track.appendChild(buttonDiv);
        tracksContainer.appendChild(div_track); 
    }
    albumDiv.appendChild(tracksContainer);
    albumDiv.onclick = "";

    var divDescAlbum = document.getElementById("desc_"+albumDiv.id);
    divDescAlbum.onclick = removeTracksContainer;
}

function addToPlaylist(e){
    var path = e.srcElement.id.split('/');
    console.log(path)
    var trackFile = path[path.length-1];
    var trackName = path[path.length-2];

    var buttonRemove = document.createElement("img");
    buttonRemove.src = "icon/bin.svg";
    buttonRemove.className = "buttonTrackPlaylist";
    buttonRemove.onclick = removeFromPlaylist;

    var buttonPlay = document.createElement("img");
    buttonPlay.src = "icon/play-circle_icon.svg";
    buttonPlay.className = "buttonTrackPlaylist";
    buttonPlay.id = e.srcElement.id;
    buttonPlay.onclick = selectSong;

    var trackDivPlaylist = document.createElement("div");
    trackDivPlaylist.id = trackName+"_playlist";
    trackDivPlaylist.className = "trackDivPlaylist";

    var spanTrackTitle = document.createElement("span");
    spanTrackTitle.className = "spanTrackTitlePlaylists";
    spanTrackTitle.textContent = trackName;

    trackDivPlaylist.appendChild(spanTrackTitle);
    trackDivPlaylist.appendChild(buttonPlay);
    trackDivPlaylist.appendChild(buttonRemove);

    var playlist = document.getElementById('playlist');
    playlist.appendChild(trackDivPlaylist);
    
}

function removeFromPlaylist(e){
    e.srcElement.parentElement.remove();
}

function removeTracksContainer(div){
    var divDescAlbum;
    if (div.srcElement.firstElementChild === null){divDescAlbum = div.srcElement.parentElement;}
    else{divDescAlbum = div.srcElement;}


    var tracksContainer = divDescAlbum.nextElementSibling;
    tracksContainer.remove();

    divDescAlbum.onclick = generateMusicTracks;

    var albumDiv = divDescAlbum.parentElement;
    albumDiv.mousedown = generateMusicTracks;

}

function eventListenerSetter(){
    var audioPlayer = document.getElementById("audioplayer");
    audioPlayer.addEventListener("timeupdate", updateTime);
    audioPlayer.addEventListener("loadeddata", initPlayer);
    audioPlayer.addEventListener("ended", nextSong);

    var slider = document.getElementById("slider");
    slider.addEventListener("mousedown", isChanging);
    slider.addEventListener("change", setTimeSong);
}

function deletePlaylist(button){
    var playlist = document.getElementById("playlist");
    playlist.innerHTML = "";
    playlist.appendChild(button);
}

function updateTime(){
    var audioPlayer = document.getElementById("audioplayer");
    var spanBeg = document.getElementById("fromBeg");
    var spanEnd = document.getElementById("toEnd");

    var slider = document.getElementById("slider");
    slider.value = audioPlayer.currentTime.toString();

    var timeEnd = audioPlayer.duration-audioPlayer.currentTime;
    var minEnd = Math.floor(timeEnd / 60);
    var secEnd = Math.floor(timeEnd-60*minEnd);

    var timeBeg = audioPlayer.currentTime;
    var minBeg = Math.floor(timeBeg / 60);
    var secBeg = Math.floor(timeBeg - 60*minBeg);

    [minEnd, secEnd] = format(minEnd, secEnd);
    [minBeg, secBeg] = format(minBeg, secBeg);


    spanBeg.textContent = "-" + minBeg + ":" + secBeg;
    spanEnd.textContent = minEnd + ":" + secEnd;
}

function isChanging(){
    var audioPlayer = document.getElementById("audioplayer");
    audioPlayer.pause();
}

function setTimeSong(e){
    var slider = document.getElementById("slider");
    var audioPlayer = document.getElementById("audioplayer");
    var buttonImg_PlayPause = document.getElementById("playPause_img");

    slider.value = e.target.value;
    audioPlayer.currentTime = e.target.valueAsNumber;

    if (buttonImg_PlayPause.getAttribute("src")==="icon/icon-pause.svg"){
        audioPlayer.play();
    }
}

function initPlayer(){
    
    var slider = document.getElementById("slider");
    var spanBeg = document.getElementById("fromBeg");
    var spanEnd = document.getElementById("toEnd");
    var albumImg = document.getElementById("playerAlbum");
    var spanArtist = document.getElementsByClassName("artistDesc")[0];
    var audioplayer = document.getElementById("audioplayer");


    spanArtist.innerHTML = spanArtist.id.split('/').join(" &ndash; ");

    var minutes = Math.floor(audioplayer.duration/60);
    var sec = Math.floor(audioplayer.duration - 60*minutes);
    [minutes, sec] = format(minutes, sec);

    slider.max =  audioplayer.duration.toString();
    slider.value = "0";

    spanEnd.textContent = minutes.toString() + ":" + sec.toString();
    spanBeg.textContent = "00:00";

    if (document.getElementById("playPause_img").getAttribute("src") === "icon/icon-jouer.svg"){
        document.getElementById("playPause_img").src = "icon/icon-pause.svg"
    }

    audioplayer.play();
}

function format(min,sec){
    var minStr = min.toString(); 
    var secStr = sec.toString();
    if (minStr.length === 1 ){minStr = "0"+minStr;}
    if (secStr.length === 1){secStr = "0"+secStr;}

    return [minStr, secStr];
}

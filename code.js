/* JS for HebrewSongs */
/* by: Misha Iomdin, 2024-2025 */


/* MENU */

// Generates one song link
function getLink(code, name, current) {
    if (code === current) {
        return `<li><a class='current_page_link' href="/HebrewSongs/song?song=${code}">${name}</a></li>`;
        //return `<li><a class='current_page_link' href="/HebrewSongs/song/${code}">${name}</a></li>`;
    }
    return `<li><a href="/HebrewSongs/song?song=${code}">${name}</a></li>`;
}

// Generates unordered list of song links for menu
function getSongsULOld(songs, current = '') {
    const links = songs.map(song => getLink(song.code, song.name, current));
    return `<ul>\n${links.join('\n')}\n</ul>`;
}

// Generates unordered list of song links for menu, sorted by part
function getSongsUL(songs, current = '') {
    // Add the "link" property to each song
    songs.forEach(song => {
        song.link = getLink(song.code, song.name, current);
    });

    // Group songs by part
    const parts = songs.reduce((acc, song) => {
        if (!acc[song.part]) {
            acc[song.part] = [];
        }
        acc[song.part].push(song.link);
        return acc;
    }, {});

    // Generate the HTML
    return Object.entries(parts)
        .map(([part, links]) => `<h3>${part}</h3>\n<ul>${links.join('')}</ul>`)
        .join('\n');
}


/* SONG */

function update_song(song_code, songs) {
    var song = songs.filter(
        item => item.code === song_code);
    if (song.length > 0) {
        window.song = song[0];
    }
    else {
        window.location.href = "/HebrewSongs/";
        window.song = '';
    }
    song = window.song;

    // song_name
    document.getElementById("song_name").childNodes[0].nodeValue = song.name + ' ';

    // song_info_ul
    let song_info_ul = `<li><span class="strong">Оригинал: </span>${song.origAuthor}</li>
        <li><span class="strong">Исполнение оригинала: </span>${song.origSinger}</li>
        <li><span class="strong">Перевод: </span>${song.translator}</li>
        <li><span class="strong">Исполнение: </span>${song.singer}</li>`;
    document.getElementById("song_info_ul").innerHTML = song_info_ul;

    // title
    document.getElementById("title").innerHTML = song.name;

    // songs_ul
    document.getElementById("songs_ul").innerHTML = getSongsUL(window.songs, window.song.code);

    // contents
    if (window.song.contents) {
        // contents button
        contentsButton = `<div style="float: right;">
        <button id="contents_button" class="open_close_button" onclick="openCloseContents();" data-open="closed">☰ Песни в мультфильме</button>
        </div>`
        document.getElementById("contents_button_wrap").innerHTML = contentsButton;

        contents = `<div class="content_column contents_column" id="contents_list" style="display: none">
      <h3>Песни в мультфильме</h3>
      <p>Нажмите, чтобы перейти к песне:</p>
      <div id="video_moments">
        <ul>
          <li/> <button onclick="setTime(0, 1)">Песня друзей</button> 
          <li/> <button onclick="setTime(6, 25)">В клетке птичка томится</button> 
          <li/> <button onclick="setTime(7, 53)">Говорят, мы бяки-буки</button> 
          <li/> <button onclick="setTime(10, 11)">Ох, рано встаёт охрана!</button>
          <li/> <button onclick="setTime(11, 49)">Пиф-паф, и вы покойники</button>
          <li/> <button onclick="setTime(13, 43)">Куда ты, тропинка</button>
          <li/> <button onclick="setTime(21, 19)">Я гениальный сыщик</button>
          <li/> <button onclick="setTime(22, 10)">Что за дети нынче, право</button>
          <li/> <button onclick="setTime(27, 50)">Луч солнца золотого</button>
          <li/> <button onclick="setTime(30, 20)">Ничего я не хочу</button>
          <li/> <button onclick="setTime(32, 12)">Романтики с большой дороги</button>
        </ul>
      </div>
    </div>`;
        document.getElementById("contents_wrap").innerHTML = contents;
    }
}

function get_songs() {
    return fetch('/HebrewSongs/Songs.json').then(response => response.json()).then(data => {
        songs = data;
        console.log('Got songs');
        const urlParams = new URLSearchParams(window.location.search);
        var code = urlParams.get('song');
        if (!code) {
          window.location.href = "/HebrewSongs/404";
        }
        window.songs = songs;
        update_song(code, songs);
        return Promise.resolve(null);
    });
}

/* OPEN-CLOSE CALLBACKS */
function openCloseMenu() {
    var button = document.getElementById("menu_button");
    var menu = document.getElementById("menu_list");
    if (button.dataset.open === "closed") {
        menu.style.display = "block";
        button.innerHTML = "✕";
        button.dataset.open = "open";
    }
    else {
        menu.style.display = "none";
        button.innerHTML = "☰";
        button.dataset.open = "closed";
    }
}


function openCloseContents() {
    var button = document.getElementById("contents_button");
    var contents = document.getElementById("contents_list");
    if (button.dataset.open === "closed") {
        contents.style.display = "block";
        button.innerHTML = "✕ Песни в мультфильме";
        button.dataset.open = "open";
    }
    else {
        contents.style.display = "none";
        button.innerHTML = "☰ Песни в мультфильме";
        button.dataset.open = "closed";
    }
}

function openCloseSongInfo() {
    var song_info = document.getElementById("song_info");
    if (song_info.style.display === "block") {
        song_info.style.display = "none";
    }
    else {
        song_info.style.display = "block";
    }
}

/* OPENING/CLOSING ACCORDING TO DEVICE SIZE */

if (window.matchMedia("(min-width: 800px)").matches) {
      openCloseMenu(); // will open
}

var myVideo = document.getElementById("the_video");
var hoveredSubtitles = false;

function playPause() {
      if (player.getPlayerState() == 1) { // playing
        player.pauseVideo();
      }
      else {
        player.playVideo();
      }
}

function setSpeed(newSpeed) {
    player.setPlaybackRate(newSpeed);
}

function goForward(sec) {
    player.seekTo(player.playerInfo.currentTime + sec);
}

function setTime(min, sec) {
    player.seekTo(min * 60 + sec);
}

function showControls() {
    myVideo.controls = true;
}

function hideControls() {
    myVideo.controls = false;
}

function subtitlesHover() {
    if (!myVideo.paused) {
        hideControls(); // otherwise they annoyingly show
        myVideo.pause();
        hoveredSubtitles = true;
    }
}

function subtitlesUnHover() {
    if (hoveredSubtitles) {
        hideControls(); // otherwise they annoyingly show
        myVideo.play();
        hoveredSubtitles = false;
    }
}

/* VIDEO AND SUBTITLES */

function onYouTubePlayerAPIReady() {
    player = new YT.Player('the_video', {
        videoId: window.song.videoId,
        playerVars: {
        'rel': 0,
        'cc_load_policy': 0,
        'fs': 0,
        },
    });
    player.unloadModule("cc");
    player.unloadModule("captions");
    player.unloadModule("subtitles");
    }

get_songs().then(x => {
    console.log(window.song);

    // Fetches analysis
    fetch(`/HebrewSongs/media/analysis/${window.song.code}_analysis.json`).then(response => response.json()).then(data => {
        analysis = data; // Save the JSON object to a variable
    });

    // Includes Youtube API
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/player_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // fetch and parse the .vtt file using vtt.js
    async function fetchAndParseVTT(vttUrl) {
      const response = await fetch(vttUrl);
      const vttText = await response.text();
      return convertVttToJson(vttText);
    }

    function getSubtitleAtTime(cues, currentTimeInSeconds) {
      const currentCue = cues.find(cue => (currentTimeInSeconds >= cue.start) && (currentTimeInSeconds <= cue.end));
      return currentCue ? currentCue.part : '';
    }

    const vttUrl = `/HebrewSongs/media/subtitles/${window.song.code}_Hebrew.vtt`;

    var cues = fetchAndParseVTT(vttUrl).then(cues => {
      var subtitles_wrap_id = 'subtitles_he_wrap';
      var div1 = document.getElementById("subtitles_he");
      function showSubtitlesByTime() {
        line = getSubtitleAtTime(cues, player.playerInfo.currentTime * 1000);
        if (div1.dataset.line != line) {
          div1.innerHTML = makeInteractive(line);
          div1.dataset.line = line;
        }
      }
      var t = setInterval(showSubtitlesByTime, 100);
    });

    const vttUrl_ru = `/HebrewSongs/media/subtitles/${window.song.code}_Russian.vtt`;

    var cues_ru = fetchAndParseVTT(vttUrl_ru).then(cues_ru => {
      var div_ru = document.getElementById("subtitles_ru");
      function showSubtitlesByTime() {
        line = getSubtitleAtTime(cues_ru, player.playerInfo.currentTime * 1000);
        if (div_ru.dataset.line != line) {
          div_ru.innerHTML = line;
          div_ru.dataset.line = line;
        }
      }
      var t_ru = setInterval(showSubtitlesByTime, 100);
    });

    function show(data) {
      if (!data) {
        return "";
      }
      return data;
    }

    function show_suff(suffix) {
      if (!suffix) {
        return "";
      }
      return "+ " + suffix;
    }

    function designAnalysis(word) {
      return `<span class="tooltip" ontouchstart="this.querySelector("#${word}_analysis").visibility = "visible">
          ${word.word} <span class="tooltiptext_analysis" id="${word}_analysis">
          <table class="word_analysis_table">
        <tr>
          <td class="heb_td">
          ${show(word.prefix)}
          ${show(word.lemma)}
          ${show_suff(word.suffix)}
          </td>
        </tr>
        <tr>
          <td>${show(word.pattern)}</td>
        </tr>
        <tr>
          <td class="heb_td">${show(word.root)}</td>
        </tr>
        <tr>
          <td class="translation">${show(word.translation)}</td>
        </tr>
      </table>
      </span>
      </span>`;
    }

    function makeInteractive(line) {
      if (typeof analysis === 'undefined') {
        console.log("Undefined analysis!");
        return line;
      }
      let new_line = "";
      let words = analysis.filter(item => item.line === line);
      if (words.length > 0) {
        for (let word of words) {
          new_line += designAnalysis(word) + " ";
        }
        return new_line;
      }
      return line;
    }
});


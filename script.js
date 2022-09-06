const musicPlayer = document.querySelector(".music_player");

const songCover = musicPlayer.querySelector(".song_cover img");

const songName = musicPlayer.querySelector(".song_info .song_name");

const songArtist = musicPlayer.querySelector(".song_info .artist_name");

const mainAudio = musicPlayer.querySelector("#main-audio");

const playPauseBtn = musicPlayer.querySelector(".play_pause");

const prevBtn = musicPlayer.querySelector(".prev");

const nextBtn = musicPlayer.querySelector(".next");

const progressBar = musicPlayer.querySelector(".movement_bar-2");

const progressArea = musicPlayer.querySelector(".movement_bar");

const dot = musicPlayer.querySelector(".dot");

const replay = musicPlayer.querySelector(".replay");

const shuffle = musicPlayer.querySelector(".shuffle");

const musicList = musicPlayer.querySelector(".music_list");

const showMoreMusic = musicPlayer.querySelector(".show_song_list_btn");

const hideMoreMusic = musicList.querySelector(".remove_song_list_btn");

let musicIndex = Math.floor(Math.random() * allMusic.length + 1);

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingNow();
});

//load music function
function loadMusic(indexNum) {
  songName.innerHTML = allMusic[indexNum - 1].name;
  songArtist.innerHTML = allMusic[indexNum - 1].artist;
  songCover.src = `image/${allMusic[indexNum - 1].img}.jpg`;
  mainAudio.src = `audio/${allMusic[indexNum - 1].src}.mp3`;
}

// play music function
function playMusic() {
  musicPlayer.classList.add("paused");
  playPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
  mainAudio.play();
}

// pause music function
function pauseMusic() {
  musicPlayer.classList.remove("paused");
  playPauseBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
  mainAudio.pause();
}

// next music function
function nextMusic() {
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
}

// prev music function
function prevMusic() {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
}

// play or pause btn event
playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = musicPlayer.classList.contains("paused");
  isMusicPaused ? pauseMusic() : playMusic();
  playingNow();
});

// next btn event
nextBtn.addEventListener("click", () => {
  nextMusic();
  playingNow();
});

// prev btn event
prevBtn.addEventListener("click", () => {
  prevMusic();
  playingNow();
});

mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;
  dot.style.left = `${progressWidth}%`;

  let musicCurrentTime = musicPlayer.querySelector(".current"),
    musicDuration = musicPlayer.querySelector(".duration");

  mainAudio.addEventListener("loadeddata", () => {
    // updating total song duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });

  // updating playing current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// updating playing song current time according to the progress bar width
progressArea.addEventListener("click", (e) => {
  let progressWidthval = progressArea.clientWidth;
  let clickedOffSetX = e.offsetX;
  let songDuration = mainAudio.duration;

  mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
  playMusic();
});

const musicControl = musicPlayer.querySelector(".music_controls");

let replayfunc = replay.addEventListener("click", function () {
  shuffle.classList.remove("clicked");
  replay.classList.add("clicked");
});

let shufflefunc = shuffle.addEventListener("click", function () {
  replay.classList.remove("clicked");
  shuffle.classList.add("clicked");
});

mainAudio.addEventListener("ended", () => {
  let replayClicked = replay.classList.contains("clicked");
  let shuffleClicked = shuffle.classList.contains("clicked");

  playingNow();

  if (replayClicked) {
    mainAudio.currentTime = 0;
    loadMusic(musicIndex);
    playMusic();
  } else if (shuffleClicked) {
    let randomMusic = Math.floor(Math.random() * allMusic.length + 1);
    do {
      randomMusic = Math.floor(Math.random() * allMusic.length + 1);
    } while (musicIndex == randomMusic);
    musicIndex = randomMusic;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
  } else {
    nextMusic();
  }
});

showMoreMusic.addEventListener("click", function () {
  musicList.classList.toggle("show");
});

hideMoreMusic.addEventListener("click", function () {
  showMoreMusic.click();
});

const ulTag = musicList.querySelector("ul");
for (const [i, song] of allMusic.entries()) {
  let liTag = ` <li li-index="${i + 1}">
                  <span>
                    <p class="nos">${song.name}</p>
                    <p>${song.artist}</p>
                  </span>
                  <audio class="${song.src}" src="audio/${
    song.src
  }.mp3"></audio>
                  <p id="${song.src}" class="song_list_timer">3:40</p>
                </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioTagDuration = ulTag.querySelector(`#${song.src}`);
  let liAudioTag = ulTag.querySelector(`.${song.src}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let audioDuration = liAudioTag.duration;

    let totalMin = Math.floor(audioDuration / 60);

    let totalSec = Math.floor(audioDuration % 60);

    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    liAudioTagDuration.innerText = `${totalMin}:${totalSec}`;

    liAudioTagDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });
}

const allLiTags = ulTag.querySelectorAll("li");
function playingNow() {
  for (const [i, tags] of allLiTags.entries()) {
    let audioTag = tags.querySelector(".song_list_timer");
    if (tags.classList.contains("playing")) {
      tags.classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = `${adDuration}`;
    }

    if (tags.getAttribute("li-index") == musicIndex) {
      tags.classList.add("playing");
      audioTag.innerText = "playing";
    }

    tags.setAttribute("onclick", "clicked(this)");
  }
}

function clicked(e) {
  let getLiIndex = e.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

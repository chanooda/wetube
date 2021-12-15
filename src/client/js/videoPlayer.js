const video = document.querySelector("video");
const canPlay = document.querySelector(".canPlay");
const playBtn = document.querySelector(".playBox i");
const muteBtn = document.querySelector(".soundBox i");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");
const timeline = document.getElementById("timeline");
const videoContainer = document.getElementById("video-container");
const videoControls = document.getElementById("videoControls");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const fullScreen = document.querySelector(".rightBox i");
const moreDropbox = document.querySelector(".video-meta_more_dropbox");
const moreIcon = document.querySelector(".video-meta_more i");
const body = document.body;
const downloadBtn = document.getElementById("download-link");
const textarea = document.querySelector("#commentForm textarea");
const comment_more = document.querySelectorAll(".comment_more");
const heroku = process.env.NODE_ENV === "production";

let controlsTimeout = null;
let controlsMove = null;
let volumeValue = 0.5;

video.volume = volumeValue;

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};
const handleMuteBtn = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
  volumeRange.value = video.muted ? "0" : "0.5";
};

const handleVolume = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "fas fa-volume-mute";
  }
  volumeValue = value;
  video.volume = value;
};

const formatTime = (seconds) => {
  if (seconds * 1000 >= 36000000) {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  } else if (seconds * 1000 >= 3600000) {
    return new Date(seconds * 1000).toISOString().substr(12, 7);
  } else if (seconds * 1000 >= 600000) {
    return new Date(seconds * 1000).toISOString().substr(14, 5);
  } else {
    return new Date(seconds * 1000).toISOString().substr(15, 4);
  }
};

if (heroku) {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
  const asd = document.getElementById("download-link");
  const { downloadname } = downloadBtn.dataset;
  const videoUrl = video.currentSrc;
  asd.href = videoUrl;
  asd.download = `${downloadname}.mp4`;
}

const handleTimeupdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};
const handleFullScreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
};

document.onfullscreenchange = () => {
  const fullscreen = document.fullscreenElement;

  if (fullscreen) {
    fullScreen.classList = "fas fa-compress";
  } else {
    fullScreen.classList = "fas fa-expand";
  }
};

const hideControls = () => videoControls.classList.remove("show");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  videoControls.classList.add("show");
  controlsTimeout = setTimeout(hideControls, 3000);
};
const handleMouseLeave = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  hideControls();
};

const handleended = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
  playBtn.classList = "fas fa-play";
};

const handleLoaded = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const moreIconClickHandler = () => {
  moreDropbox.classList.toggle("drop");
};

const clearDrop = (event) => {
  if (event.target.classList.contains("fa-ellipsis-h")) {
    moreDropbox.classList.add("drop");
  } else {
    moreDropbox.classList.remove("drop");
  }
};

const commentClearDrop = (event) => {
  const comment_mores = document.querySelectorAll(".drop");
  if (event.target.classList.contains("need_drop")) {
    [].forEach.call(comment_mores, function (el) {
      el.classList.remove("drop");
    });
    event.target.nextSibling.classList.add("drop");
  } else {
    [].forEach.call(comment_mores, function (el) {
      el.classList.remove("drop");
    });
  }
};

const handleDownload = () => {
  const asd = document.getElementById("download-link");
  const { downloadname } = downloadBtn.dataset;
  const videoUrl = video.currentSrc;
  asd.href = videoUrl;
  asd.download = `${downloadname}.mp4`;
};

playBtn.addEventListener("click", handlePlayClick);
canPlay.addEventListener("click", handlePlayClick);
document.addEventListener("keyup", (event) => {
  if (event.target !== textarea) {
    if (event.code === "Space") {
      handlePlayClick();
    } else if (event.key === "f") {
      handleFullScreen();
    }
  }
});
muteBtn.addEventListener("click", handleMuteBtn);
volumeRange.addEventListener("input", handleVolume);
video.addEventListener("timeupdate", handleTimeupdate);
video.addEventListener("ended", handleended);
video.addEventListener("loadedmetadata", handleLoaded);
timeline.addEventListener("input", handleTimelineChange);
fullScreen.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
body.addEventListener("click", clearDrop);
if (comment_more) {
  body.addEventListener("click", commentClearDrop);
}
downloadBtn.addEventListener("click", handleDownload);

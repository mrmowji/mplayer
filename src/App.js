import React, { useRef, useState } from 'react';
import VTTConverter from 'srt-webvtt';
import './App.css';

function App() {
  const videoFileInput = useRef(null);
  const subtitleFileInput = useRef(null);
  const videoElement = useRef(null);
  const subtitleTrack = useRef(null);
  const [videoBlobURL, setVideoBlobURL] = useState("");
  const [subtitleBlobURL, setSubtitleBlobURL] = useState("");
  const [subtitle, setSubtitle] = useState("");

  function handleVideoChange() {
    setVideoBlobURL(URL.createObjectURL(videoFileInput.current.files[0]));
    setSubtitleBlobURL("");
    setSubtitle("");
    console.log(videoElement);
    videoElement.current.textTracks[0].mode = "hidden";
  }

  function handleSubtitleChange() {
    const vttConverter = new VTTConverter(subtitleFileInput.current.files[0]);
    setSubtitle("");

    vttConverter
      .getURL()
      .then(function (url) {
        setSubtitleBlobURL(url);
        console.log(subtitleTrack.current);
        subtitleTrack.current.addEventListener("cuechange", function (e) {
          if (e.target.track.activeCues[0] !== undefined) {
            let currentCue = e.target.track.activeCues[0].text;
            console.log(currentCue);
            setSubtitle(currentCue.split("\n").map(line =>
              (
                <div>{line}</div>
              )
            ));
          } else {
            setSubtitle("");
          }
        });
      })
      .catch(function (error) {
        console.error(error);
      })
  }

  // From https://davidwalsh.name/fullscreen
  // Find the right method, call on correct element
  function launchIntoFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  // Whack fullscreen
  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  function handleFullScreen() {
    var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement ||
      document.webkitFullscreenElement || document.msFullscreenElement;
    if (fullscreenElement) {
      exitFullscreen();
    } else {
      launchIntoFullscreen(document.querySelector('.App'));
    }
  }

  return (
    <div className="App">
      <video autoPlay controls src={videoBlobURL} type="video/webm" ref={videoElement}>
        <track default src={subtitleBlobURL} ref={subtitleTrack} />
      </video>
      <div className="controls">
        <input type="file" ref={videoFileInput} onChange={handleVideoChange} />
        <input type="file" ref={subtitleFileInput} onChange={handleSubtitleChange} />
        <button onClick={handleFullScreen}>Full Screen</button>
      </div>
      <div className="subtitle">{subtitle}</div>
    </div>
  );
}

export default App;
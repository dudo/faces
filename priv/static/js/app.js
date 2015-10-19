"use strict";

var constraints = {
  video: true,
  audio: true
};
var context = new AudioContext();

var successCallback = function(stream) {
  var video = document.querySelector('video');
  video.src = window.URL.createObjectURL(stream);
  video.onloadedmetadata = function(e) {
    video.play();
  }

  var microphone = context.createMediaStreamSource(stream);
  var analyser = context.createAnalyser();
  // analyser.fftSize = 1024;
  analyser.minDecibels = -60;
  // microphone -> filter -> destination.
  microphone.connect(analyser);
  analyser.connect(context.destination);

  var frequencyData = new Uint8Array(analyser.frequencyBinCount).slice(0, 32);
  var spectrum = document.querySelector('#spectrum');
  var frequencies = [];
  for (let i in frequencyData) {
    frequencies.push(i * context.sampleRate/analyser.fftSize)
    spectrum.appendChild(document.createElement('DIV'));
  }
  console.log(frequencies)
  var bars = document.querySelectorAll("#spectrum > div");
  var avg=0;

  function renderFrame() {
    requestAnimationFrame(renderFrame);
    // update data in frequencyData
    analyser.getByteFrequencyData(frequencyData);
    // render frame based on values in frequencyData
    // console.log(frequencyData)
    var sums=0,total=0.001;
    for (let i in frequencyData) {
      bars[i].style.height = frequencyData[i] + "px";
      sums+=frequencyData[i]*frequencies[i];
      total+=frequencyData[i];
      bars[i].style.backgroundColor = "hsl(" + ~~avg + ",60%,70%)";
    }
    avg = sums/total;
  }
  renderFrame();
}

var errorCallback = function(e) {
  if (e.name == 'PermissionDeniedError') {
    console.log('Reeeejected!', e);
  } else if (e.name == 'NotFoundError') {
    video.src = '';
  }
}

var gUM = Modernizr.prefixed('getUserMedia', navigator);
gUM(constraints, successCallback, errorCallback);

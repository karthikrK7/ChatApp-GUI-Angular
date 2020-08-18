// //alert('webrtc');
// let myVideoStream;
// const localVideo = document.getElementById('localVideo');
// navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true
//   }).then(stream => {
//     myVideoStream = stream;
//     addVideoStream(myVideo, stream)
//   });

//   function addVideoStream(video, stream) {
//     video.srcObject = stream
//     video.addEventListener('loadedmetadata', () => {
//       video.play()
//     })
//   }
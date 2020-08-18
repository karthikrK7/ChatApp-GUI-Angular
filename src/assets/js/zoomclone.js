
const videoGrid = document.getElementById('video-grid');
let myVideoStream;
$("#callvideo").click(function () {
    const socket = io('ws://192.168.0.102:3000');
    const myPeer = new Peer()
    const myVideo = document.getElementById('local')
    myVideo.muted = true;
    const peers = {}
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream)
        myPeer.on('call', call => {
            call.answer(stream)
            const video = document.getElementById('remote')
            call.on('stream', userVideoStream => {
                addVideoStream(video, userVideoStream)
            })
        })
        socket.on('user-connected', userId => {
            connectToNewUser(userId, stream);
        })
    })

    socket.on('user-disconnected', userId => {
        if (peers[userId]) peers[userId].close()
    })
    myPeer.on('open', id => {
        socket.emit('join-room', 'ROOM_ID', id)
    })

    function connectToNewUser(userId, stream) {
        const call = myPeer.call(userId, stream)
        const video = document.getElementById('remote')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
        call.on('close', () => {
            video.remove()
        })
        peers[userId] = call
    }

    function addVideoStream(video, stream) {
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        videoGrid.append(video);
    }
})

$('.mute').click(function(){
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        this.innerHTML = '<i class="fa fa-microphone-slash"></i>';
    } else {
        myVideoStream.getAudioTracks()[0].enabled = true;
        this.innerHTML = '<i class="fa fa-microphone"></i>';
    }
})

$('.stopvideo').click(function(){
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        this.innerHTML = '<i class="fa fa-video-slash"></i>';
    } else {
        myVideoStream.getVideoTracks()[0].enabled = true;
        this.innerHTML = '<i class="fa fa-video"></i>';
    }
})

$('.endcall').click(function() {
    peers= null;
})
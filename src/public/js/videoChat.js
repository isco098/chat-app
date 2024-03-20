function videoChat(divId){
    $(`#video-chat-${divId}`).unbind("click").on("click", function(){
        let targetId = $(this).data("chat");
        let callerName = $(`#navbar-username`).text();

        let dataToEmit = {
            listenerId: targetId,
            callerName : callerName
        };

        // Người gọi kiểm tra người dc gọi có online ko
        socket.emit("caller-check-listener-online-or-not", dataToEmit);

    });
}

function playVideoStream(videoTagId, stream){
    let video = document.getElementById(videoTagId);
    video.srcObject = stream;
    video.onloadeddata = function(){
        video.play();
    };
}

function closeVideoStream(stream){
    return stream.getTracks().forEach(track => track.stop());
}

$(document).ready(function(){
    // user dc gọi ko online
    socket.on("server-send-listener-is-offline", function(){
        alertify.notify("Người dùng này hiện không trực tuyến.", "error", 7);
    });

    let iceServerList = $("#ice-server-list").val();

    let getPeerId = "";
    const peer = new Peer({
        key: "peerjs", // default
        host: "peerjs-server-trungquandev.herokuapp.com",
        secure: true,
        port: 443,
        config: {"iceServers": JSON.parse(iceServerList)}
        // debug: 3
    });
    peer.on("open", function(peerId){
        getPeerId = peerId;
    });
    // user được gọi lắng nghe
    socket.on("server-request-peer-id-of-listener", function(response){
        let listenerName = $(`#navbar-username`).text();
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName: listenerName,
            listenerPeerId: getPeerId,
        };

        socket.emit("listener-emit-peer-id-to-server", dataToEmit);

    });
    let timerInterval;
    // user gọi
    socket.on("server-send-peer-id-of-listener-to-caller", function(response){
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName: response.listenerName,
            listenerPeerId: response.listenerPeerId,
        };

        socket.emit("caller-request-call-to-server", dataToEmit);

        Swal.fire({
            title: `Đang gọi cho &nbsp; <span style="color: #2ECC71">${response.listenerName}</span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
            html: `Thời gian: <strong style="color: #d43f3a"></strong> giây. <br/><br/>
                <button id="btn-cancel-call" class="btn btn-danger"> Hủy cuộc gọi</button>`,
            backdrop: "rgba(85, 85, 85, 0.4)",
            width: "52rem",
            allowOutsideClick: false,
            timer: 30000, //30s
            onBeforeOpen:() => {
                $("#btn-cancel-call").unbind("click").on("click", function(){
                    Swal.close();
                    clearInterval(timerInterval);

                    //07
                    socket.emit("caller-cancel-request-call-to-server", dataToEmit);
                });

                if(Swal.getContent().querySelector !== null){
                    Swal.showLoading();
                    timerInterval = setInterval(() => {
                        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000)
                    }, 1000);
                }
            },
            onOpen: () =>{
                //12 of caller
                socket.on("server-send-reject-call-to-caller", function(response){
                    Swal.close();
                    clearInterval(timerInterval);

                    Swal.fire({
                        type: "info",
                        title: `<span style="color: #2ECC71">${response.listenerName}</span>&nbsp; hiện tại không thể nghe máy`,
                        backdrop: "rgba(85, 85, 85, 0.4)",
                        width: "52rem",
                        allowOutsideClick: false,
                        confirmButtonColor: "#2ECC71",
                        confirmButtonText: "Xác nhận",
                    });
                });
                
                
            },
            onClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            return false
        });

    });

    //8: user được gọi
    socket.on("server-send-request-call-to-listener", function(response){
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName: response.listenerName,
            listenerPeerId: response.listenerPeerId,
        };
        
        Swal.fire({
            title: `<span style="color: #2ECC71">${response.callerName}</span> &nbsp; muốn trò chuyện video với bạn<i class="fa fa-volume-control-phone"></i>`,
            html: `Thời gian: <strong style="color: #d43f3a"></strong> giây. <br/><br/>
                <button id="btn-reject-call" class="btn btn-danger"> Từ chối </button>
                <button id="btn-accept-call" class="btn btn-success"> Đồng ý </button>`,
            backdrop: "rgba(85, 85, 85, 0.4)",
            width: "52rem",
            allowOutsideClick: false,
            timer: 30000, //30s
            onBeforeOpen:() => {
                $("#btn-reject-call").unbind("click").on("click", function(){
                    Swal.close();
                    clearInterval(timerInterval);

                    //
                    socket.emit("listener-reject-request-call-to-server", dataToEmit);
                });

                $("#btn-accept-call").unbind("click").on("click", function(){
                    Swal.close();
                    clearInterval(timerInterval);

                    //
                    socket.emit("listener-accept-request-call-to-server", dataToEmit);
                });

                if(Swal.getContent().querySelector !== null){
                    Swal.showLoading();
                    timerInterval = setInterval(() => {
                        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000)
                    }, 1000);
                }
            },
            onOpen: () => {
                // 09 of listener
                socket.on("server-send-cancel-request-call-to-listener", function(response){
                    Swal.close();
                    clearInterval(timerInterval);
                });

                
            },
            onClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            return false
        });
    });

    //13 of caller
    socket.on("server-send-accept-call-to-caller", function(response){
        Swal.close();
        clearInterval(timerInterval);

        let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);

        getUserMedia({video: true, audio: true}, function(stream) {
            // show modal streaming
            $("#streamModal").modal("show");

            //play stream in local (of caller)
            playVideoStream("local-stream", stream);

            //call to listener
            let call = peer.call(response.listenerPeerId, stream);

            call.on("stream", function(remoteStream) {
                //play stream in local (of listener)
                playVideoStream("remote-stream", remoteStream);
            });
            // close modal: remove stream
            $("#streamModal").on("hidden.bs.modal", function(){
                closeVideoStream(stream);
                Swal.fire({
                    type: "info",
                    title: `Đã kết thúc cuộc gọi với &nbsp; <span style="color: #2ECC71">${response.listenerName}</span>`,
                    backdrop: "rgba(85, 85, 85, 0.4)",
                    width: "52rem",
                    allowOutsideClick: false,
                    confirmButtonColor: "#2ECC71",
                    confirmButtonText: "Xác nhận",
                });
            });
          }, function(err) {
            console.log(err.toString());
            if(err){
                alertify.notify("Bạn đã tắt quyền truy cập vào thiết bị nghe gọi trên trình duyệt, vui long mở lại trong phần cài đặt của trình duyệt", "error", 7);
            }
                // báo lỗi khi không có camera: chỉ dùng dc cho ggchrome
            // if(err.toString() === "NotFoundError: Requested device not found"){
            //     alertify.notify("Xin lỗi chúng tôi không tìm thấy camera trên máy tính của bạn", "error", 7);
            // }
          });
    });

    // 14 of listener
    socket.on("server-send-accept-call-to-listener", function(response){
        Swal.close();
        clearInterval(timerInterval);

        let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);

        peer.on("call", function(call) {
            getUserMedia({video: true, audio: true}, function(stream) {
                 // show modal streaming
                $("#streamModal").modal("show");

                //play stream in local (of listener)
                playVideoStream("local-stream", stream);

                call.answer(stream);

                call.on("stream", function(remoteStream) {
                    //play stream in local (of caller)
                    playVideoStream("remote-stream", remoteStream);
                });
                //close modal: remove stream
                $("#streamModal").on("hidden.bs.modal", function(){
                    closeVideoStream(stream);
                    Swal.fire({
                        type: "info",
                        title: `Đã kết thúc cuộc gọi với &nbsp; <span style="color: #2ECC71">${response.callerName}</span>`,
                        backdrop: "rgba(85, 85, 85, 0.4)",
                        width: "52rem",
                        allowOutsideClick: false,
                        confirmButtonColor: "#2ECC71",
                        confirmButtonText: "Xác nhận",
                    });
                });

            }, function(err) {
                console.log(err.toString());
                if(err){
                    alertify.notify("Bạn đã tắt quyền truy cập vào thiết bị nghe gọi trên trình duyệt, vui long mở lại trong phần cài đặt của trình duyệt", "error", 7);
                }
                    // báo lỗi khi không có camera: chỉ dùng dc cho ggchrome 
                // if(err.toString() === "NotFoundError: Requested device not found"){
                //     alertify.notify("Xin lỗi chúng tôi không tìm thấy camera trên máy tính của bạn", "error", 7);
                // }
            });
          });
    });
});
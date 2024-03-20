$(document).ready(function(){
    $("#link-read-more-all-chat").on("click", function(){
        let skipPersonal = $("#all-chat").find("li:not(.group-chat)").length;
        let skipGroup = $("#all-chat").find("li.group-chat").length;


        
        $("#link-read-more-all-chat").css("display", "none");
        $(".read-more-all-chat-loader").css("display", "inline-block");

        $.get(`/message/read-more-all-chat?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`,function(data){
            if(data.leftSideData.trim() === ""){
                alertify.notify("Bạn không còn cuộc trò chuyện nào để xem nữa cả.", "error", 7);
                $("#link-read-more-all-chat").css("display", "inline-block");
                $(".read-more-all-chat-loader").css("display", "none");
                return false;
            }

            //01: handle leftside
            $("#all-chat").find("ul").append(data.leftSideData);

            //02: 
            resizeNineScrollLeft();
            nineScrollLeft();

            //03: handle rightside
            $("#screen-chat").append(data.rightSideData);

            //04: 
            changeScreenChat();

            //05 convertEmoji
            convertEmoji();

            //06: handle imageModal
            $("body").append(data.imageModalData);

            //07: 
            gridPhotos(5);

            //08: handle attachmentModal
            $("body").append(data.attachmentModalData);

            //09:
            socket.emit("check-status");

            $("#link-read-more-all-chat").css("display", "inline-block");
            $(".read-more-all-chat-loader").css("display", "none");

            readMoreMessages();
        });
    });
});
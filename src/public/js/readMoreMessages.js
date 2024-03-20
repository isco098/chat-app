function readMoreMessages(){
    $(".right .chat").unbind("scroll").on("scroll", function(){

        //get the first message
        let firstMessage = $(this).find(".bubble:first");
        //get position of first message
        let currentOffset = firstMessage.offset().top - $(this).scrollTop();
        // console.log(currentOffset);

        if($(this).scrollTop() === 0){
            let messageLoading = `<img src="images/chat/message-loading.gif" class="message-loading" />`;
            $(this). prepend(messageLoading);
            
            let targetId = $(this).data("chat");
            let skipMessage = $(this).find("div.bubble").length;
            let chatInGroup = $(this).hasClass("chat-in-group") ? true : false;

            let thisDom = $(this);
            $.get(`/message/read-more?skipMessage=${skipMessage}&targetId=${targetId}&chatInGroup=${chatInGroup}`,function(data){
                if(data.rightSideData.trim() === ""){
                    alertify.notify("Bạn không còn tin nhắn nào để xem nữa cả.", "error", 7);
                    $(thisDom).find("img.message-loading").remove();

                    return false;
                }

                //01: handle rightside
                $(`.right .chat[data-chat=${targetId}]`).prepend(data.rightSideData);

                //02:
                $(`.right .chat[data-chat=${targetId}]`).scrollTop(firstMessage.offset().top - currentOffset);

                //03: convert Emoji
                convertEmoji();

                //04: imageModal
                $(`#imagesModal_${targetId}`).find("div.all-images").append(data.imageModalData);

                //05: 
                gridPhotos(5);

                //06: attachment
                $(`attachmentsModal_${targetId}`).find("ul.list-attachments").append(data.attachmentModalData);

                //07: remove loading
                $(thisDom).find("img.message-loading").remove();

            });
        }
    });
}

$(document).ready(function(){
    readMoreMessages();
})
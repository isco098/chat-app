let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};
let userUpdatePassword = {};

function callLogout(){
    let timerInterval;
    Swal.fire({
        position: "top-end",
        title: "Tự động đăng xuất sau 5 giây",
        html: "Thời gian: <strong></strong>",
        showConfirmButton: false,
        timer: 5000,
        onBeforeOpen:() => {
            Swal.showLoading();
            timerInterval = setInterval(() => {
                Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000)
            }, 1000);
        },
        onClose: () => {
            clearInterval(timerInterval);
        }
    }).then((result) => {
        $.get("/logout", function(){
            location.reload();
        })
    });
}

function updateUserInfo(){
    $("#input-change-avatar").on("change", function(){
        let fileData = $(this).prop("files")[0];
        let math = ["image/png", "image/jpg", "image/jpeg"];
        let limit = 1048576; //byte = 1MB

        if($.inArray(fileData.type, math) === -1){
            alertify.notify("Kiểu file không hợp lệ, chỉ chấp nhận jpg & png.", "error", 7);
            $(this).val(null);
            return false;
        }
        if(fileData.size > limit){
            alertify.notify("Ảnh upload tối đa cho phép là 1MB", "error", 7);
            $(this).val(null);
            return false;
        }
        
        if(typeof(FileReader) != "undefined"){
            let imagePreview = $("#image-edit-profile");
            imagePreview.empty();

            let fileReader = new FileReader();
            fileReader.onload = function(element){
                $("<img>", {
                    "src": element.target.result,
                    "class": "avatar img-circle",
                    "id": "user-modal-avatar",
                    "alt": "avatar"
                }).appendTo(imagePreview);
            };
            imagePreview.show();
            fileReader.readAsDataURL(fileData);

            let formData = new FormData();
            formData.append("avatar", fileData);

            userAvatar = formData;
        }else{
            alertify.notify("Trình duyệt của bạn không hỗ trợ FileReader", "error", 7);
        }
    });

    $("#input-change-username").on("change", function(){
        let username = $(this).val();
        let regexUsername = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
        
        if(!regexUsername.test(username) || username.length <3 || username.length > 17){
            alertify.notify("Username giới hạn trong khoản 3-17 kí tự và không được phép chứa kí tự đặc biệt", "error", 7);
            $(this).val(originUserInfo.username);
            delete userInfo.username;
            return false;
        }
        userInfo.username = username;
    });
    $("#input-change-gender-male").on("click", function(){
        let gender = $(this).val();
        
        if(gender !== "male"){
            alertify.notify("Oh no! Hãy xác định giới tính của mình rồi chọn lại bạn nhé!", "error", 7);
            $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return false;
        }
        userInfo.gender = gender
    });
    $("#input-change-gender-female").on("click", function(){
        let gender = $(this).val();
        
        if(gender !== "female"){
            alertify.notify("Oh no! Hãy xác định giới tính của mình rồi chọn lại bạn nhé!", "error", 7);
            $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return false;
        }
        userInfo.gender = gender
    });
    $("#input-change-address").on("change", function(){
        let address = $(this).val();
        
        if(address.length < 3 || address.length > 30){
            alertify.notify("Địa chỉ giới hạn trong khoảng 3-30 kí tự.", "error", 7);
            $(this).val(originUserInfo.address);
            delete userInfo.address;
            return false;
        }
        userInfo.address = address;
    });
    $("#input-change-phone").on("change", function(){
        let phone = $(this).val();
        let regexPhone = new RegExp(/^(0)[0-9]{9,10}$/);

        if(!regexPhone.test(phone)){
            alertify.notify("Số điện thoại bắt đầu bằng 0, giới hạn trong khoảng 10-11 kí tự.", "error", 7);
            $(this).val(originUserInfo.phone);
            delete userInfo.phone;
            return false;
        }
        userInfo.phone = phone;
    });

    $("#input-current-password").on("change", function(){
        let currentPassword = $(this).val();
        let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

        if(!regexPassword.test(currentPassword)){
            alertify.notify("Mật khẩu phải có 8 kí tự, gồm chữ hoa, chữ thường, số và kí tự đặc biệt", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.currentPassword;
            return false;
        }
        userUpdatePassword.currentPassword = currentPassword;
    });

    $("#input-new-password").on("change", function(){
        let newPassword = $(this).val();
        let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

        if(!regexPassword.test(newPassword)){
            alertify.notify("Mật khẩu phải có 8 kí tự, gồm chữ hoa, chữ thường, số và kí tự đặc biệt", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.newPassword;
            return false;
        }
        userUpdatePassword.newPassword = newPassword;
    });

    $("#input-confirm-new-password").on("change", function(){
        let confirmNewPassword = $(this).val();

        if(!userUpdatePassword.newPassword){
            alertify.notify("Bạn chưa nhập mật khẩu mới", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.confirmNewPassword;
            return false;
        }
        if(confirmNewPassword !== userUpdatePassword.newPassword){
            alertify.notify("Nhập lại mật khẩu chưa chính xác", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.confirmNewPassword;
            return false;
        }
        userUpdatePassword.confirmNewPassword = confirmNewPassword;
    });
}

function callUpdateUserAvatar(){
    $.ajax({
        url: "/user/update-avatar",
        type: "put",
        cache: false,
        contentType: false,
        processData: false,
        data: userAvatar,
        success: function(result){
            $(".user-modal-alert-success").find("span").text(result.message);
            $(".user-modal-alert-success").css("display", "block");
        
            //update avatar at navbar
            $("#navbar-avatar").attr("src", result.imageSrc);

            //update origin avatar src
            originAvatarSrc = result.imageSrc;
            // reset all
            $("#input-btn-cancel-update-user").click();
        },
        error: function(error){
            //Display errors
            $(".user-modal-alert-error").find("span").text(error.responseText);
            $(".user-modal-alert-error").css("display", "block");
        
            // reset all
            $("#input-btn-cancel-update-user").click();
        },
    });
}

function callUpdateUserInfo(){
    $.ajax({
        url: "/user/update-info",
        type: "put",
        data: userInfo,
        success: function(result){
            $(".user-modal-alert-success").find("span").text(result.message);
            $(".user-modal-alert-success").css("display", "block");
         
            //update Origin user info
            originUserInfo = Object.assign(originUserInfo, userInfo);

            //update username at navbar
            $("#navbar-username").text(originUserInfo.username);

            // reset all
            $("#input-btn-cancel-update-user").click();
        },
        error: function(error){
            //Display errors
            $(".user-modal-alert-error").find("span").text(error.responseText);
            $(".user-modal-alert-error").css("display", "block");
        
            // reset all
            $("#input-btn-cancel-update-user").click();
        },
    });
}

function callUpdateUserPassword(){
    $.ajax({
        url: "/user/update-password",
        type: "put",
        data: userUpdatePassword,
        success: function(result){
            // Display success
            $(".user-modal-password-alert-success").find("span").text(result.message);
            $(".user-modal-password-alert-success").css("display", "block");

            // reset all
            $("#input-btn-cancel-update-user-password").click();

            callLogout();
        },
        error: function(error){
            //Display errors
            $(".user-modal-password-alert-error").find("span").text(error.responseText);
            $(".user-modal-password-alert-error").css("display", "block");
        
            // reset all
            $("#input-btn-cancel-update-user").click();
        },
    });
}

$(document).ready(function(){
    originAvatarSrc = $("#user-modal-avatar").attr("src");
    originUserInfo = {
        username : $("#input-change-username").val(),
        gender : ($("#input-change-gender-male").is(":checked")) ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
        address : $("#input-change-address").val(),
        phone : $("#input-change-phone").val(),
    }
    updateUserInfo();
    
    $("#input-btn-update-user").on("click",function(){
        if($.isEmptyObject(userInfo) && !userAvatar){
            alertify.notify("Bạn phải thay đổi thông tin trước khi lưu.", "error", 7);
            return false;
        }
        if(userAvatar){
            callUpdateUserAvatar();
        }
        if(!$.isEmptyObject(userInfo)){
            callUpdateUserInfo();
        }
        
    });
    $("#input-btn-cancel-update-user").on("click",function(){
        userAvatar = null;
        userInfo = {};

        $("#input-change-avatar").val(null);
        $("#user-modal-avatar").attr("src", originAvatarSrc);

        $("#input-change-username").val(originUserInfo.username),
        (originUserInfo.gender === "male") ? $("#input-change-gender-male").click() : $("#input-change-gender-female").click(),
        $("#input-change-address").val(originUserInfo.address),
        $("#input-change-phone").val(originUserInfo.phone)
    });
    $("#input-btn-update-user-password").on("click",function(){
        if(!userUpdatePassword.confirmNewPassword || !userUpdatePassword.currentPassword || !userUpdatePassword.newPassword){
            alertify.notify("Bạn phải nhập đầy đủ thông tin", "error", 7);
            return false;
        };
        Swal.fire({
            title: "Bạn có chắc chắn muốn thay đổi mật khẩu?",
            text: "Bạn không thể hoàn tác lại quá trình này!",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#2ECC71",
            cancelButtonColor: "#ff7675",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if(!result.value){
                $("#input-btn-cancel-update-user-password").click();
                return false;
            }
            callUpdateUserPassword();
        });
        
    });

    $("#input-btn-cancel-update-user-password").on("click",function(){
        userUpdatePassword = {};
        $("#input-current-password").val(null);
        $("#input-new-password").val(null);
        $("#input-confirm-new-password").val(null);
    });
})
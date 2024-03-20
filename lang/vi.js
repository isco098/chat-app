export const transValidation = {
    email_incorrect: "Email phải có dạng example@domain.com",
    gender_incorrect: "Oh No! Hãy xác định rõ giới tính của mình rồi chọn lại nhé !!!",
    password_incorrect: "Mật khẩu phải có 8 kí tự, gồm chữ hoa, chữ thường, số và kí tự đặc biệt",
    password_confirmation_incorrect: "Mật khẩu không giống nhau",
    update_username: "Username giới hạn trong khoản 3-17 kí tự và không được phép chứa kí tự đặc biệt",
    update_gender: "Oh no! Hãy xác định giới tính của mình rồi chọn lại bạn nhé!",
    update_address: "Địa chỉ giới hạn trong khoảng 3-30 kí tự.",
    update_phone: "Số điện thoại bắt đầu bằng 0, giới hạn trong khoảng 10-11 kí tự",
    keyword_find_user: "Lỗi từ khóa tìm kiếm, không được nhập kí tự đặc biệt",
    message_text_emoji_incorrect: "Tin nhắn không hợp lệ, tối thiểu một kí tự, tối đa 400 kí tự",
    add_new_group_users_incorrect: "Vui lòng chọn tối thiểu 2 bạn bè để tạo nhóm",
    add_new_group_name_incorrect: "Vui lòng đặt tên nhóm trò chuyện từ 2-30 kí tự và không chứa các kí tự đặc biệt",
};

export const transErrors = {
    account_in_use: "Email này đã được sử dụng.",
    account_removed: "Email này đã được sử dụng, nhưng đã bị xóa khỏi hệ thống",
    account_not_active: "Email này đã được đăng ký nhưng chưa active.",
    account_undefined: "Tài khoản không tồn tại",
    token_undefined: "Token không tồn tại!",
    login_failed: "Sai tài khoản hoặc mật khẩu",
    server_error: "Có lỗi ở phía server",
    avatar_type: "Kiểu file không hợp lệ, chỉ chấp nhận jpg & png.",
    avatar_size: "Ảnh upload tối đa cho phép là 1MB",
    user_current_password_failed: "Mật khẩu hiện tại không chính xác.",
    conversation_not_found: "Cuộc trò chuyện không tồn tại",
    image_message_type: "Kiểu file không hợp lệ, chỉ chấp nhận jpg & png.",
    image_message_size: "Ảnh upload tối đa cho phép là 1MB",
    attachment_message_size: "Tệp đính kèm tối đa cho phép là 1MB",
}

export const transSuccess = {
    userCreated: (userEmail) => {
        return `Tài khoản <strong>${userEmail}</strong> đã được tạo, kiểm tra email để active tài khoản`
    },
    account_actived: "Kích hoạt tài khoản thành công",
    loginSuccess: (username) => {
        return `Xin chào ${username}, chúc bạn một ngày tốt lành.`
    },
    logout_success: "Đăng xuất tài khoản thành công, hẹn gặp lại!",
    avatar_updated: "Cập nhật ảnh đại diện thành công.",
    user_info_updated: "Cập nhật thông tin người dùng thành công.",
    user_password_updated: "Cập nhật mật khẩu thành công",
};

export const transMail = {
    subject: "Awsome Chat: Xác nhận kích hoạt tài khoản.",
    template: (linkVerify) => {
        return `
            <h2>Bạn nhận được mail này vì đã đăng kí tài khoản ứng dụng Awsome Chat</h2>
            <h3>Vui lòng truy cập vào link bên dưới để kích hoạt tài khoản</h3>
            <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
        `;
    },
    send_failed: "Có lỗi trong quá trình gửi mail, vui lòng liên hệ lại với bộ phận IT"
}
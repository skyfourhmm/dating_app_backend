export const corsOptions = {
  origin: function (origin, callback) {
    // Nếu không có origin hoặc origin là localhost thì cho phép
    return callback(null, true);
  },

  // Some legacy browsers (IE11, various SmartTVs) choke on 204 => cái này là cho phép trình duyệt cũ có thể gửi request lên server
  optionsSuccessStatus: 200,

  // CORS sẽ cho phép nhận cookies từ request
  // bên phía FE có 1 cái trong CORS nữa cần phải bật lên mới dùng được cái này
  credentials: true,
};

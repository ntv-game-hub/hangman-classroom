# Requirements - Đoán Chữ Bí Ẩn

## MVP

Host:
- Tạo phòng realtime bằng mã ngắn.
- Nhập từ/cụm cần đoán và gợi ý.
- Có nút chọn ngẫu nhiên từ kho 1000 mục có nghĩa và mô tả.
- Chọn số lần đoán sai tối đa từ 1 đến 12.
- Chọn mode `free` hoặc `turns`.
- Xem đáp án, bảng gạch, lịch sử đoán, điểm và lượt hiện tại.
- Kết thúc phòng thủ công.

Player:
- Join bằng mã phòng, link `?code=XXXXX`, hoặc danh sách phòng mở.
- Xem gợi ý, bảng gạch và số lần sai còn lại.
- Đoán một chữ cái theo grapheme tiếng Việt.
- Đoán cả từ/cụm để thắng ngay.
- Xem lịch sử đoán và bảng điểm.

Game rules:
- Khoảng trắng và dấu câu hiện sẵn.
- Chữ cái đúng mở tất cả vị trí tương ứng.
- Chữ cái sai tăng `wrongCount`; hết `maxWrong` thì game thua.
- Đoán chữ trùng không phạt thêm.
- Đoán cả đáp án đúng set trạng thái `won` và cộng bonus.
- Mode `free`: mọi người đoán tự do, server áp cooldown ngắn theo người chơi.
- Mode `turns`: chỉ `currentTurnPlayerId` được đoán, mỗi lượt xong chuyển người kế tiếp.

## Events

- `game:create`
- `games:list`
- `game:get`
- `game:join`
- `guess:letter`
- `guess:word`
- `game:finish`
- `player:leave`

## Tests

- Grapheme tiếng Việt.
- Reveal chữ đã đoán.
- So chữ có dấu chính xác.
- Detect solved theo unique grapheme.
- So đáp án đầy đủ case-insensitive nhưng vẫn phân biệt dấu.

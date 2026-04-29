export type WordBankEntry = {
  answer: string;
  hint: string;
};

const nouns = [
  ["BÁNH MÌ", "Món ăn Việt Nam có vỏ giòn và nhân mặn."],
  ["ÁO DÀI", "Trang phục truyền thống thường mặc trong dịp lễ."],
  ["TRỐNG TRƯỜNG", "Âm thanh báo hiệu vào lớp hoặc ra chơi."],
  ["CẦU VỒNG", "Dải màu xuất hiện sau mưa khi có nắng."],
  ["THƯ VIỆN", "Nơi có nhiều sách để đọc và mượn."],
  ["BẢNG ĐEN", "Vật trong lớp dùng để viết phấn."],
  ["ĐỒNG HỒ", "Vật giúp xem giờ."],
  ["MÁY BAY", "Phương tiện bay trên bầu trời."],
  ["XE ĐẠP", "Phương tiện có hai bánh và bàn đạp."],
  ["CÂY BÚT", "Dụng cụ dùng để viết."],
  ["QUẢ BÓNG", "Đồ chơi dùng trong nhiều môn thể thao."],
  ["CON ONG", "Côn trùng làm mật."],
  ["HOA SEN", "Loài hoa thường mọc trong ao hồ."],
  ["MẶT TRỜI", "Nguồn sáng lớn của ban ngày."],
  ["DÒNG SÔNG", "Nước chảy dài qua nhiều vùng đất."],
  ["NGỌN NÚI", "Địa hình cao nhô lên khỏi mặt đất."],
  ["BỨC TRANH", "Tác phẩm được vẽ hoặc tô màu."],
  ["CÂU CHUYỆN", "Nội dung kể về nhân vật và sự việc."],
  ["LỚP HỌC", "Nơi học sinh cùng học với giáo viên."],
  ["SÂN TRƯỜNG", "Khoảng sân để học sinh sinh hoạt giờ ra chơi."],
  ["MÙA XUÂN", "Mùa cây cối đâm chồi nảy lộc."],
  ["TRUNG THU", "Tết thiếu nhi có đèn lồng và bánh nướng."],
  ["TẾT NGUYÊN ĐÁN", "Dịp đầu năm âm lịch ở Việt Nam."],
  ["CƠM TẤM", "Món ăn quen thuộc với sườn nướng."],
  ["PHỞ BÒ", "Món nước nổi tiếng ăn với bánh phở."],
  ["BÚN CHẢ", "Món bún ăn với thịt nướng và nước chấm."],
  ["NÓN LÁ", "Vật đội đầu truyền thống làm từ lá."],
  ["ĐÈN LỒNG", "Vật phát sáng thường thấy dịp Trung Thu."],
  ["HỘP BÚT", "Vật dùng để đựng bút thước."],
  ["CẶP SÁCH", "Túi học sinh mang đến trường."],
  ["BÀI HÁT", "Tác phẩm có giai điệu và lời ca."],
  ["CẦU THANG", "Lối đi lên xuống giữa các tầng."],
  ["KHU VƯỜN", "Nơi trồng nhiều cây và hoa."],
  ["BIỂN XANH", "Vùng nước mặn rộng lớn."],
  ["ĐẢO NHỎ", "Vùng đất được nước bao quanh."],
  ["NGÔI SAO", "Điểm sáng trên bầu trời đêm."],
  ["MẶT TRĂNG", "Thiên thể sáng vào ban đêm."],
  ["ĐÁM MÂY", "Khối hơi nước lơ lửng trên trời."],
  ["CƠN MƯA", "Nước rơi từ mây xuống mặt đất."],
  ["CÁNH ĐỒNG", "Vùng đất rộng trồng lúa hoặc cây trồng."],
  ["CON TRÂU", "Con vật quen thuộc với đồng ruộng."],
  ["CHÚ MÈO", "Vật nuôi thích bắt chuột."],
  ["CHÚ CHÓ", "Vật nuôi thường giữ nhà."],
  ["CÁ VÀNG", "Loài cá cảnh màu vàng cam."],
  ["CHIM SẺ", "Loài chim nhỏ thường bay thành đàn."],
  ["RỪNG XANH", "Nơi có rất nhiều cây lớn."],
  ["BẾN XE", "Nơi xe khách đón trả hành khách."],
  ["NHÀ GA", "Nơi tàu hỏa dừng đón khách."],
  ["BẢN ĐỒ", "Hình vẽ giúp tìm đường và vị trí."],
  ["HÀNH TINH", "Thiên thể quay quanh một ngôi sao."]
] as const;

const adjectives = [
  "thân thiện",
  "rực rỡ",
  "yên bình",
  "sáng tạo",
  "chăm chỉ",
  "vui nhộn",
  "bí ẩn",
  "nhanh nhẹn",
  "ấm áp",
  "đáng nhớ",
  "mạnh mẽ",
  "nhỏ xinh",
  "tươi mới",
  "lấp lánh",
  "ngộ nghĩnh",
  "hữu ích",
  "thông minh",
  "dũng cảm",
  "dịu dàng",
  "sạch đẹp"
] as const;

export const wordBank: WordBankEntry[] = Array.from({ length: 1000 }, (_, index) => {
  const [answer, hint] = nouns[index % nouns.length];
  const adjective = adjectives[Math.floor(index / nouns.length) % adjectives.length];
  return {
    answer,
    hint: `${hint} Từ khóa gợi ý: ${adjective}.`
  };
});

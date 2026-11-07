/* Sử Việt — content data for the Vietnamese history topic.
   Same shape as `chapters` in data.js: { id, title, intro:[...] }, plus the
   optional visual fields read by app.js: facts, figure, timeline, source,
   dynasties. `pin: "label"` puts an entry above chapter 01, unnumbered.
   Ids are "su-…" (never "ch-N": those belong to the diary).
   Main reference: Đại Việt sử ký toàn thư; it wins when sources disagree.
   Every claim must come from the source text; "tr." = page of the PDF. */

const TT = 'Đại Việt sử ký toàn thư (bản PDF), tr. ';

const suViet = [
  {
    id: "su-trieu-dai",
    pin: "Tổng quan",
    icon: "chart",
    title: "Các triều đại theo Toàn thư",
    intro: [
      "Các thời kỳ dưới đây theo đúng cách Đại Việt sử ký toàn thư chia “kỷ”, với số năm do chính sách ghi ở cuối mỗi kỷ. Toàn thư chép đến năm 1675."
    ],
    dynasties: [
      { name: "Hồng Bàng thị", from: -2879, to: -258, years: "Tất cả 2.622 năm", kind: "ky", ch: "su-1",
        note: "Từ Kinh Dương Vương được phong năm Nhâm Tuất, truyền đến cuối thời Hùng Vương, năm Quý Mão. Chú thích của bản dịch nói mốc 2879 TCN chỉ là niên đại suy đoán.",
        src: TT + "3, 6" },
      { name: "Nhà Thục (An Dương Vương)", from: -257, to: -208, years: "Tất cả 50 năm", kind: "ky",
        note: "Từ năm Giáp Thìn đến năm Quý Tỵ.", src: TT + "9" },
      { name: "Nhà Triệu", from: -207, to: -111, years: "5 đời, cộng 97 năm", kind: "ky",
        note: "Từ Vũ Đế năm Giáp Ngọ đến Thuật Dương Vương năm Canh Ngọ.", src: TT + "19" },
      { name: "Thuộc Tây Hán", from: -110, to: 39, years: "Cộng 149 năm", kind: "thuoc",
        note: "Từ năm Tân Mùi đến năm Kỷ Hợi.", src: TT + "20" },
      { name: "Trưng Nữ Vương", from: 40, to: 42, years: "Tất cả 3 năm", kind: "ky",
        note: "Từ năm Canh Tý đến năm Nhâm Dần.", src: TT + "21" },
      { name: "Thuộc Đông Hán", from: 43, to: 186, years: "Tất cả 144 năm", kind: "thuoc",
        note: "Từ năm Quý Mão đến năm Bính Dần.", src: TT + "24" },
      { name: "Sĩ Vương", from: 187, to: 226, years: "Tất cả 40 năm", kind: "ky",
        note: "Từ năm Đinh Mão đến năm Bính Ngọ.", src: TT + "27" },
      { name: "Thuộc Ngô, Tấn, Tống, Tề, Lương", from: 227, to: 540, years: "Cộng 314 năm", kind: "thuoc",
        note: "Từ năm Đinh Mùi đến năm Canh Thân.", src: TT + "36" },
      { name: "Tiền Lý Nam Đế", from: 541, to: 547, years: "Tất cả 7 năm", kind: "ky",
        note: "Từ năm Tân Dậu đến năm Đinh Mão.", src: TT + "38" },
      { name: "Triệu Việt Vương", from: 548, to: 570, years: "Tất cả 23 năm", kind: "ky",
        note: "Từ năm Mậu Thìn đến năm Canh Dần.", src: TT + "39" },
      { name: "Hậu Lý Nam Đế", from: 571, to: 602, years: "Tất cả 32 năm", kind: "ky",
        note: "Từ năm Tân Mão đến năm Nhâm Tuất. Tính chung cả Tiền Nam Đế, Triệu Việt Vương là 62 năm.", src: TT + "41" },
      { name: "Thuộc Tùy, Đường", from: 603, to: 906, years: "Cộng 304 năm", kind: "thuoc",
        note: "Từ năm Quý Hợi đến năm Bính Dần.", src: TT + "51" },
      { name: "Nam Bắc phân tranh", from: 907, to: 938, years: "Tất cả 32 năm", kind: "ky",
        note: "Từ năm Đinh Mão đến năm Mậu Tuất.", src: TT + "53" },
      { name: "Nhà Ngô", from: 939, to: 967, years: "Cộng 29 năm", kind: "ky",
        note: "Gồm 3 vua và Dương Tam Kha cướp ngôi, từ năm Kỷ Hợi đến năm Đinh Mão.", src: TT + "57" },
      { name: "Nhà Đinh", from: 968, to: 980, years: "2 vua, tất cả 13 năm", kind: "ky",
        note: "Từ năm Mậu Thìn đến năm Canh Thìn.", src: TT + "65" },
      { name: "Nhà Lê (Lê Đại Hành)", from: 981, to: 1009, years: "3 vua, tất cả 29 năm", kind: "ky",
        note: "Từ năm Tân Tỵ đến năm Kỷ Dậu.", src: TT + "65, 79" },
      { name: "Nhà Lý", from: 1010, to: 1225, years: "9 vua, cộng 216 năm", kind: "ky",
        note: "Từ Thái Tổ năm Canh Tuất đến Chiêu Hoàng năm Ất Dậu.", src: TT + "158" },
      { name: "Nhà Trần", from: 1226, to: 1399, years: "Tổng cộng 174 năm", kind: "ky",
        note: "Từ năm Bính Tuất đến năm Kỷ Mão.", src: TT + "321" },
      { name: "Họ Hồ", from: 1400, to: 1407, years: "Tháng 3/1400 – tháng 10/1407", kind: "ky",
        note: "Năm 1400 Quý Ly cướp ngôi nhà Trần, đặt quốc hiệu Đại Ngu; chưa đầy một năm thì truyền ngôi cho con là Hán Thương. Sau hai cha con đều bị người Minh bắt. Toàn thư không lập kỷ riêng: sử cũ chép hai người họ Hồ thành kỷ, Toàn thư truất bỏ.",
        src: TT + "293, 296, 309" },
      { name: "Hậu Trần", from: 1407, to: 1413, years: "2 đời vua, 7 năm", kind: "ky",
        note: "Toàn thư chép sau nhà Trần, từ năm Đinh Hợi [1407] đến năm Quý Tỵ [1413].", src: TT + "309, 320, 321" },
      { name: "Nhà Lê", from: 1418, to: 1527, years: "Gồm 110 năm", kind: "ky",
        note: "Từ năm Mậu Tuất đời Thái Tổ đến năm Đinh Hợi đời Cung Hoàng.", src: TT + "596" },
      { name: "Họ Mạc", from: 1527, to: 1592, years: "Truyền 5 đời", kind: "ky", lane: "top",
        note: "Toàn thư chép phụ trong kỷ nhà Lê và gọi là tiếm ngôi: Mạc Đăng Dung tiếm ngôi năm Đinh Hợi [1527]; năm Nhâm Thìn [1592] Mạc Mậu Hợp bị bắt. Tính cả thời Hùng Lễ công từ năm Quý Tỵ [1593], trước sau gồm 67 năm.",
        src: TT + "637" },
      { name: "Nhà Lê trung hưng", from: 1533, to: 1675, years: "Từ năm 1533 (Toàn thư chép đến năm 1675)", kind: "ky", lane: "bot",
        note: "Trang Tông lên ngôi năm Quý Tỵ [1533]; Toàn thư viết “nền móng trung hưng bắt đầu từ đấy”. Toàn thư chép đến tháng 4 năm Ất Mão [1675], khi vua Gia Tông băng.",
        src: TT + "597, 707" }
    ]
  },
  {
    id: "su-1",
    title: "Kỷ Hồng Bàng thị",
    intro: [
      "Đại Việt sử ký toàn thư mở đầu phần Ngoại kỷ bằng Kỷ Hồng Bàng thị, thời đại mà sử cũ chép theo truyền thuyết. Theo đó, cháu bốn đời của Viêm Đế họ Thần Nông là Đế Minh đi tuần phương Nam, lấy con gái Vụ Tiên, sinh ra Lộc Tục. Lộc Tục được phong làm vua phương Nam, xưng là Kinh Dương Vương, đặt tên nước là Xích Quỷ.",
      "Kinh Dương Vương lấy con gái Động Đình Quân, sinh ra Sùng Lãm, tức Lạc Long Quân. Lạc Long Quân lấy Âu Cơ, sinh một bọc trăm trứng, nở ra trăm người con trai. Về sau hai người chia con: năm mươi con theo cha xuống biển, năm mươi con theo mẹ lên núi. Người con trưởng được tôn làm vua, xưng là Hùng Vương, đóng đô ở Phong Châu, đặt tên nước là Văn Lang, chia nước làm mười lăm bộ.",
      "Toàn thư chép nhà Hùng truyền mười tám đời, đến đời Hùng Vương cuối cùng thì mất nước vào tay Thục Phán. Ngay từ thời xưa, các sử gia đã ghi nhận phần này mang nhiều yếu tố truyền thuyết, khó lấy làm sử liệu chắc chắn. Dù vậy, câu chuyện con Rồng cháu Tiên vẫn là cội nguồn tinh thần của người Việt, và giỗ Tổ Hùng Vương mùng mười tháng ba âm lịch vẫn được gìn giữ đến ngày nay."
    ],
    ps: [
      "Bản nháp mẫu: nội dung sẽ được đối chiếu lại với nguyên văn Toàn thư trước khi đăng chính thức.",
      "Nguồn: Đại Việt sử ký toàn thư, Ngoại kỷ, quyển I (Kỷ Hồng Bàng thị); Lịch Sử Việt Nam Bằng Tranh, tập 2–4 (Huyền sử đời Hùng)."
    ]
  }
];

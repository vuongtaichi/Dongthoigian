/* Nhật Ký Lính Thông Tin — content data (v4, full 94 chapters, synced from updated .docx).
   Each chapter: { id, title, intro:[...], signature?, ps?:[...] }
   app.js reads this array only — no content lives in app.js. */

const chapters = [
  {
    id: "ch-1",
    title: "Mở đầu",
    intro: [
      "Lúc nhập ngũ, câu nói mình được nghe nhiều nhất chính là “2 năm như một giấc ngủ trưa”. Một câu nói nghe thật nhẹ nhàng, nhưng với mình, chỉ phù hợp với một người đã kết thúc 2 năm nghĩa vụ, và đang hồi tưởng lại hành trình của mình mà thôi. Còn với một người đang nhập ngũ, giấc ngủ trưa đó thật là dài dằng dặc. Trong quân đội, từng giờ đồng hồ đều đã được lên kế hoạch, thật hiếm hoi để tìm thấy một khoảng thời gian nào đó cho riêng mình. Vào những lúc chỉ có sách và cuốn sổ tay làm bạn, mình thường viết nhật ký để giữ lại những kỷ niệm mà một đời người chắc chỉ một lần được trải qua. Cuốn nhật ký đó đang cũ dần, nét chữ từ mặt sau đang dần hằn lên mặt trước, những trang giấy cứng cáp đang mềm đi và cũ hơn. Một phần vì thời gian, một phần vì mình đọc nó rất nhiều lần.",
      "Rồi có một ngày mình đột nhiên muốn gõ lại toàn bộ quyển nhật ký, để giữ nó thật lâu trên hành trình trưởng thành của mình. Và từ lúc đó, ý định về một trang web cá nhân bắt đầu được nhen nhóm. Đến khi A.I. phát triển, việc làm web đã trở nên đơn giản hơn rất nhiều, ý định kia của mình bắt đầu được thực hiện. Với một trang web, nhật ký không chỉ được lưu lại mà còn có thể chia sẻ, để ai đó muốn nhập ngũ hay chuẩn bị nhập ngũ cũng có thể đọc được, và mường tượng về một phần những gì có thể diễn ra trong những ngày tháng rất dài sắp tới.",
      "Mình nói “một phần”, bởi vì chương trình huấn luyện có thể sẽ khác nhau ở từng đơn vị. Mình thuộc tiểu đoàn bộ binh nên chương trình huấn luyện cũng theo chuyên ngành bộ binh. Sau khi kết thúc 3 tháng huấn luyện tân binh, mình được biên chế về trung đội thông tin, việc huấn luyện lúc này lại theo chuyên ngành thông tin. Ngoài ra, trước khi nhập ngũ, mình không cần phải làm gì nặng và gần như không rèn luyện sức khỏe, nên diễn biến tâm lý ở một vài phân đoạn có thể sẽ nặng nề hơn so với người bình thường. Thêm nữa, nhiệm vụ của mình trong lúc nhập ngũ cũng không giống với nhiều chiến sĩ khác, nên nhật ký này sẽ không thể đại diện cho số đông, mà chỉ đóng góp một góc nhìn chủ quan của cá nhân mình.",
      "Tên của đơn vị và các nhân vật xuất hiện trong nhật ký đều đã được thay đổi để đảm bảo sự riêng tư. Hy vọng 94 chương trong nhật ký này sẽ góp thêm những góc nhìn mới về chuyện nhập ngũ."
    ],
    ps: [
      "Có rất nhiều chương chỉ là các đoạn rất ngắn mình viết vội, nên chỉ có thể đề cập thoáng qua mà không thể mô tả chi tiết. Mình đã thêm phần ghi chú ở một số chương để mô tả kỹ hơn những gì mình còn nhớ."
    ]
  },
  {
    id: "ch-2",
    title: "Ngày đầu nhập ngũ",
    intro: [
      "Vừa nhập ngũ phải cách ly 14 ngày mới bắt đầu huấn luyện. Mình được phân vào trung đội 4, đại đội 4, tiểu đoàn 2, trung đoàn 1. Phụ trách trung đội là anh Quang - trung đội trưởng. Cả trung đội có 40 chiến sĩ, chia thành 4 tiểu đội, mỗi tiểu đội có 1 tiểu đội trưởng - là lính cũ nhập ngũ từ năm trước. Trong ấn tượng ban đầu, cả 4 người đều rất nhiệt tình và dễ tính. Mình được phân sang tiểu đội 4 của anh Việt Anh, thấy anh Việt Anh rất hiền và thoải mái. Cả trung đội ở chung trong 1 phòng có 20 giường tầng. Trong phòng chỉ có 3 người khác cùng làng với mình, còn lại toàn là những gương mặt lạ lẫm.",
      "Trong lúc đang sắp xếp đồ đạc thì bất ngờ anh Quang gọi mình với Hùng dọn đồ sang phòng trung đội trưởng, và rất có thể sẽ ở đây trong ít nhất 2 tuần cách ly. Một lúc sau mới biết anh Quang chọn 2 đứa mình làm cò. Thế nên ngày hôm nay ít phải tập trung hơn so với mọi người, và cũng không cần phải dọn vệ sinh bên ngoài, chủ yếu ngồi trong phòng làm mấy công việc liên quan đến máy tính với sổ sách.",
      "Ở cùng phòng với anh trung đội trưởng có vẻ thoải mái hơn về vấn đề nội vụ vệ sinh và tăng gia sản xuất, nhưng ít được tiếp xúc với mọi người. Thấy thèm cảm giác được ở chung phòng với trung đội, mọi người làm gì cũng làm cùng nhau.",
      "Ngày đầu để lại ấn tượng không tệ!"
    ],
    signature: "Thứ 5, 00:46",
    ps: [
      "Ngày đầu tiên, anh trung đội trưởng sẽ hỏi cả trung đội xem ai đã có bằng Đại học và ai đang là đảng viên. Ngày đó mình là người duy nhất vừa có bằng ĐH vừa là đảng viên, nên có thể vì thế mà được chọn làm cò máy tính với số sách. Còn Hùng thì làm cò phần nội vụ vệ sinh của anh Quang.",
      "Sau này mình mới biết “cò” là vị trí giúp việc, hay còn gọi là liên lạc. Thông thường các anh trung đội trưởng sẽ chọn người có bằng đại học để làm những việc cần dùng máy tính, ví dụ gõ văn bản hoặc in giáo án. Còn viết sổ sách thì chỉ cần người có chữ dễ nhìn là được. Có một số anh trung đội trưởng chọn người làm máy tính riêng và người viết sổ riêng, còn mình kiêm cả hai.",
      "Làm cò trung đội thì vẫn phải tham gia huấn luyện như bình thường. Chỉ là sau giờ huấn luyện, mọi người xuống vườn tăng gia còn mình được ở trong phòng viết sổ hoặc in giáo án.",
      "Trung đội mình có gần 10 người đã tốt nghiệp đại học. Người lớn tuổi nhất hơn mình 2 tuổi, cách người nhỏ nhất 8 tuổi. Xưng hô trong quân đội chỉ tính theo năm nhập ngũ không tính theo năm tuổi đời, nên tất cả đều phải gọi các tiểu đội trưởng là anh, dù rất nhiều người chỉ mới 20 tuổi."
    ]
  },
  {
    id: "ch-3",
    title: "Lần đầu gọi điện về nhà",
    intro: [
      "Hôm nay mượn điện thoại của anh Quang để gọi điện về cho mẹ. Làm cò trung đội nên mượn điện thoại để gọi về nhà có vẻ dễ dàng hơn. Vừa biết mình gọi, mẹ òa lên khóc. Từ lúc mình đi đến giờ mẹ khóc suốt vì sợ mình khổ với bị bắt nạt. Nói chuyện xong thì mẹ cũng yên tâm hơn nhiều rồi. Mới vào vẫn đang cách ly chưa huấn luyện, chưa thấy có gì quá vất vả, mà làm cò thì cũng đã nhàn chân tay hơn người khác rồi."
    ],
    ps: [
      "Trong này chỉ có tiểu đội trưởng là lính cũ, còn lại đều là lính mới cả. Tiểu đoàn mình không ở chung với tiểu đoàn lính cũ nên ít bị ma cũ bắt nạt ma mới. Những lính cũ của năm ngoái đều đóng quân ở doanh trại khác bên Trung đoàn rồi. Đối với tiểu trưởng trong trung đội mình thì chỉ cần sống biết điều, không ngỗ nghịch thì không ai làm gì mình cả. Đối với tiểu trưởng của trung đội khác thì lại càng ít khi động chạm đến mình, vì bắt nạt lính cũng phải nhìn mặt người quản, hầu hết tiểu trưởng lính cũ đều chơi với nhau và nể nang nhau (trừ những trường hợp đặc biệt)."
    ]
  },
  {
    id: "ch-4",
    title: "Mưa cả ngày (1)",
    intro: [
      "Hôm nay trời trở rét, nhưng vẫn mưa nhiều. Được cái thời tiết không nồm nên không ẩm thấp, nền nhà không bị in dấu chân. Hôm nay tập các động tác nghiêm, nghỉ, quay và đặt mũ. Được phát vở ghi kèm với một quyển sổ tay chiến sĩ, và được ghi những thông tin đầu tiên về quân đội (họ tên, cấp bậc của các thủ trưởng trong từng cấp Đại đội, Tiểu đoàn, Trung đoàn, Sư đoàn, Quân khu, Bộ Quốc phòng). Hôm nay cũng bắt đầu phải học thuộc 10 lời thề danh dự của QĐNDVN.",
      "Buổi tối sinh hoạt, lẽ ra được xem thời sự nếu trời không mưa. Nhưng sinh hoạt trong nhà cũng tốt, được học hát 4 bài trong sổ tay chiến sĩ. Có bài hùng tráng, có bài thúc dục, có bài tràn trề sự biết ơn. Học hát tối nay rất vui. Những cái mệt nhọc ban ngày được bù lại bằng những tiếng cười sảng khoái và vô tư. Kết thúc ngày thứ 4 trong quân đội."
    ],
    signature: "Thứ 7, 23:15",
    ps: [
      "Trong quân đội, các cấp đơn vị đều có một ký hiệu riêng",
      "a: Tiểu đội, b - Trung đội, c - Đại đội, d- Tiểu đoàn, e - Trung đoàn",
      "Khi đó, at = tiểu đội trưởng, bt = trung đội trưởng",
      "Như vậy mình thuộc a4 b4 c4 d2 e1",
      "Lúc này mình mới biết vì sao một số người bên ngoài từng gọi tiểu trưởng là a trưởng."
    ]
  },
  {
    id: "ch-5",
    title: "Chuyển chỗ ở (lần 1, 2)",
    intro: [
      "Cả trung đội chuyển sang phòng bên cạnh vì có 1 số người bị F0, F1. Mong muốn thành sự thật vì được ở chung với cả trung đội. Cảm thấy rất vui! Ăn, ngủ, nghỉ đều làm cùng nhau, có gì ăn lại gọi nhau cùng ăn. Đây chính là cảm giác đồng đội thực sự.",
      "Nhưng cảm giác vui vẻ chưa được mấy ngày, cả trung đội lại chuyển chỗ sang khu khác vì tình hình dịch bệnh. Chỗ mới có 3 phòng nhưng nhỏ hơn, khoảng cách giữa các giường hẹp hơn. Mình với Hùng vẫn ở cùng anh Quang. Phòng có 4 giường nên có thêm  người nữa."
    ]
  },
  {
    id: "ch-6",
    title: "Sắp chia lại quân số",
    intro: [
      "Sắp chia lại quân số trung đội, anh Quang ngỏ ý muốn mình ở lại để tiếp tục làm sổ sách. Ban đầu muốn đồng ý, nhưng nghĩ kỹ lại thì lại từ chối. Mình không thích cảm giác làm cò, nhiều lúc muốn ngủ sớm nhưng phải xem còn được giao việc gì nữa không. Nhiều khi chỉ muốn ra ngoài tập và tăng gia cùng mọi người. Mệt mà vui! Ít nhất có những kỷ niệm để nhớ và sau này nhắc lại. Nhưng cũng có thể “trong muốn ra, ngoài muốn vào”. Có thể nhiều người muốn làm cò giống mình để được ngồi trong phòng chép sổ với làm máy tính. Và có thể mình chưa từng trải qua cảm giác mệt mỏi của tăng gia, nên chỉ nghĩ đến chuyện vui buồn và ăn ngủ đúng giờ theo quy định."
    ],
    signature: "Chủ Nhật, 22:22"
  },
  {
    id: "ch-7",
    title: "Chuyển chỗ ở (lần 3)",
    intro: [
      "Hôm nay Đại đội trưởng trực tiếp đứng lớp để giảng về các văn bản, công điện, mệnh lệnh liên quan đến covid 19 và nhập ngũ. Ngày mai sẽ bắt đầu cuộc huấn luyện tân binh trong vòng 3 tháng. Sắp tới sẽ phải học nhiều và rèn luyện nhiều, không được ở trong phòng giờ hành chính để làm giấy tờ nữa.",
      "Chiều nay tiếp tục chuyển chỗ ở, lại thêm 1 lần mệt nhọc. Điểm cộng là phòng này rộng ngang với phòng đầu tiên, và mình được ở chung với mọi người trong trung đội. Hy vọng đây là lần chuyển cuối cùng trong 3 tháng tân binh. Mỗi lần chuyển chỗ ở, ngoài chuyển đồ còn phải làm lại rất nhiều thứ, từ tem giường, chữ T, rồi dây treo khăn mặt. Mà chỗ này cũng khá tốt, rất rộng rãi thoải mái. Chỗ tắm với vệ sinh nghe đồn cũng sạch sẽ và có nước nóng cho mấy anh em tắm gội."
    ],
    signature: "Thứ 2, 22:45",
    ps: [
      "Nước nóng thường được đun thủ công bằng lò hơi đốt củi"
    ]
  },
  {
    id: "ch-8",
    title: "Buổi đầu huấn luyện tân binh",
    intro: [
      "Trước khi bắt đầu huấn luyện tân binh, cả tiểu đoàn tập trung để dự lễ khai mạc do tiểu đoàn trưởng chủ trì. Nghe phổ biến kế hoạch thì thời gian đầu sẽ chủ yếu học lý thuyết và chưa nhiều giờ thực hành. Buổi học đầu tiên có phong cách dạy đọc chép giống hồi cấp 3.",
      "Buổi chiều nhận được thông báo sắp biên chế lại tân binh, xã mình và một xã nữa sẽ sang trung đội 1. Cũng có nghĩa mình sẽ chuyển đi sau khi tình hình dịch ổn định. Trong người không biết nên vui hay buồn. Sang trung đội mới thì không được gọi điện về nhà thường xuyên. Nhưng đi rồi mình không cần thức khuya, cũng không cần làm chân sai vặt, sẽ thoải mái hơn, đi tăng gia cùng mọi người thì vui hơn."
    ]
  },
  {
    id: "ch-9",
    title: "Chuẩn bị học thao trường",
    intro: [
      "Tối nay được nhận bình tông đựng nước và được hướng dẫn cách gấp vải mưa, để chuẩn bị cho buổi học thao trường đầu tiên vào sáng mai. Mai cũng là buổi đầu tiên mặc áo dã ngoại (K20). Thấy hào hứng vì được học bắn súng tiểu liên AK. Cũng vui nhiều phần vì không cần phải mặc áo bông nóng bức trong cái nắng tháng 3 này nữa. Mong đợi buổi học ngày mai!"
    ],
    signature: "Thứ 5, 22:36",
    ps: [
      "Chế độ mùa hè và mùa đông trong này sẽ phải theo thời gian quy định, cho dù thời tiết thay đổi - nếu không quá gay gắt - cũng không được làm khác. Mùa đông phải mặc áo bông, dùng chăn bông. Và buổi sáng thì được dậy muộn hơn 30’, buổi trưa ngủ ít hơn 30’ so với mùa hè."
    ]
  },
  {
    id: "ch-10",
    title: "Buổi học thao trường đầu tiên",
    intro: [
      "Dậy từ 4h30, sớm hơn nhiều so với ngày bình thường vì còn chuẩn bị súng, xẻng/cuốc, bia ngắm bắn, đai để nước, túi đựng hộp tiếp đạn (bao xe). Từng ấy thứ mang lên người và di chuyển ra bãi đất trống của tiểu đoàn. Chưa có balo mà đã trĩu cả người! Nghe nói sau này hành quân sẽ nặng hơn nhiều và xa hơn nhiều! Buổi đầu tập nằm bắn thấy đuối sức vô cùng, vì lúc đang nằm các thao tác với súng đều rất mỏi, mà phải thực hiện liên tục nhiều lần cho quen động tác. Cả buổi nằm nhoài trên nền đất nên cả người chỗ nào cũng lấm lem. Cái lúc đang nằm ấy mà được hỏi có thích thao trường không thì nhất định là không. Nhưng mệt nhiều thì sẽ khỏe lên, mà ra thao trường có cả mọi người cùng đi, có chuyện ra chuyện vào, để quên đi cái mình đang làm ở đây, và để thời gian trôi đi nhanh hơn."
    ],
    ps: [
      "Cả trung đội 40 người chỉ cần vài bia ngắm bắn, nên chỉ những ai cao lớn mới được giao mang theo bia ngắm ra thao trường. Thường sẽ luân phiên, một tiểu đội đi trước để cắm bia ngắm và một tiểu đội ở lại sau buổi học để thu dọn bia mang về. Buổi học thao trường đầu tiên, tiểu đội mình được giao nhiệm vụ đi trước cắm bia.",
      "Cuốc, xẻng dùng trong huấn luyện rất nhỏ và ngắn, ngắn hơn cánh tay mình, thường đeo sau lưng. Nhỏ như vậy để dễ mang theo, và lúc bò trườn trên mặt đất cũng có thể đào hầm ẩn náu.",
      "Khi mới vào, mỗi người sẽ được biên chế một khẩu súng. Mỗi khẩu có một mã số riêng, từng người phải nhớ mã số trên báng súng của mình để không bị nhầm với súng của người khác. Sau mỗi buổi học ngoài thao trường về, việc đầu tiên cần làm là lau súng bằng dẻ khô và giấy thấm dầu. Sau khi cất súng vào tủ để súng xong thì mới được phép cởi quần áo và vệ sinh cá nhân."
    ]
  },
  {
    id: "ch-11",
    title: "Chiếc bánh mì thứ 3",
    intro: [
      "Hôm nay là thứ 7, ngày mai được ăn chiếc bánh mì thứ 3 kể từ lúc nhập ngũ. Tuần đầu tiên thì đếm từng ngày một, nhưng sang tuần thứ 3 không còn thấy lâu như vậy nữa. Liệu mình có thể ở đây 2 năm không? 2 năm tới sẽ dễ dàng chứ?",
      "Hôm nay được in tên quần áo, mũ vải, và balo. Từ giờ không cần sợ bị mất đồ nữa."
    ],
    signature: "Thứ 7, 22:23",
    ps: [
      "Trong này, cứ mỗi sáng chủ nhật hàng tuần đều sẽ được ăn bánh mì, thế nên lúc mới vào mọi người hay đếm đã ăn được bao nhiêu chiếc bánh mì, vì nó tương đương với số tuần đã ở trong quân đội."
    ]
  },
  {
    id: "ch-12",
    title: "Chia lại quân số",
    intro: [
      "Tối nay bất ngờ cả đại đội ra sân tập trung để chia lại quân số theo biên chế mới. Không nghĩ là nhanh như thế! Anh Quang từng bảo xin đại đội trưởng cho mình ở lại, nhưng có vẻ không được, mình vẫn biên chế sang trung đội 1 của anh Vĩ. Buồn vui lẫn lộn, nhưng vui nhiều hơn buồn. Toàn các anh em cùng xã và gần xã ở chung với nhau.",
      "Tối nay chia lại quân số nhưng vẫn ở tạm trung đội cũ. Anh Quang bảo sang kia rồi vẫn về làm sổ sách cho anh. Vậy thì vẫn còn một mối ràng buộc với anh Quang, hơi buồn 1 chút! Nếu có ai đó để mình bàn giao thì tốt biết mấy. Nhưng ít nhất được ở cùng tiểu đội với mấy anh em cũ trong b4, at là anh Hoàn nên cũng phấn khởi trong lòng. Ngày mai mới bắt đầu di chuyển, 3 tháng tân binh sắp sang 1 trang mới. Điều gì sẽ đến vào ngày mai?"
    ],
    signature: "Chủ Nhật, 22:06",
    ps: [
      "b4 - Trung đội 4, at - tiểu đội trưởng"
    ]
  },
  {
    id: "ch-13",
    title: "Làm cò anh Vĩ",
    intro: [
      "Buổi sáng sớm anh Vĩ gọi sang để làm danh sách, không cần tập thể dục sáng. Tối hôm trước, anh Vĩ hỏi mình có phải cò anh Quang không, lại hỏi bình thường làm những gì là mình đã thấy nghi nghi rồi. Vậy là anh Vĩ đã chọn mình làm cò. Anh Vĩ thì hiền và không đòi hỏi cao giống anh Quang, nên cảm giác ban đầu là dễ thở hơn. Đến 16h, anh Vĩ báo mình sang phòng đại trưởng viết thống kê huấn luyện, nhưng của anh Quang. Còn của anh Vĩ thì vẫn bạn cũ viết. Cũng tức là, giờ mình vừa phải viết sổ cho anh Quang vừa phải làm máy tính cho anh Vĩ!"
    ]
  },
  {
    id: "ch-14",
    title: "Chuyển chỗ ở (lần 4)",
    intro: [
      "Hôm nay lại thêm 1 lần chuyển nhà nữa, sang khu b2, b3 cũ. Mình với Thiện sang ở cùng phòng với anh Vĩ, cùng với anh thực tập sinh mới đến. Sau vài ngày ở cùng anh Vĩ, thấy hồ sơ giấy tờ đều bị chậm. Nhiều sổ, giáo án anh Quang làm xong nhiều ngày trước nhưng anh Vĩ chưa làm. Hôm nay 13h30 học thể lực nhưng buổi trưa mới bảo mình đi làm giáo án. Anh Vĩ hiền, dễ tính nhưng lượng hồ sơ lớn hơn bên anh Quang nhiều. Anh Vĩ toàn để nước đến chân mới nhảy nên nhiều việc gấp. Chuyện huấn luyện cũng không sát sao và tập trung, cũng không nắm chắc chuyên môn vì anh Vĩ chuyên ngành thông tin. Ít nhất anh Vĩ thoải mái hơn và không để mình thức khuya nhiều."
    ],
    signature: "Thứ 6, 22:54"
  },
  {
    id: "ch-15",
    title: "Nhận trợ cấp và ăn sinh nhật",
    intro: [
      "Hôm nay là ngày đầu tiên mặc bộ quần áo K03, đeo cầu vai và tiết dùng trong ngày lễ để chụp ảnh thẻ. Nhờ anh Hồng chụp 1 bức với Nghiêm để làm kỉ niệm. Hình ảnh này chắc có tiền cũng không mua được.",
      "Hôm nay được phát trợ cấp tháng thứ 2, 810k. Thời gian trôi ngày càng nhanh! Mới nhận trợ cấp mấy tuần trước. Mai là lần thứ 4 ăn sáng với bánh mì, bước sang ngày thứ 26 trong quân đội. Ngày càng quen dần với môi trường sống ở đây, chỉ có cường độ tập luyện là chưa thể thích ứng ngay được.",
      "Buổi tối trung đội tổ chức sinh nhật cho chiến sĩ sinh vào tháng này, có rất nhiều bánh kẹo và nước ngọt. Cả trung đội cùng ăn uống và hát hò. Cả phòng rộn rã tiếng cười đùa, không có phiền lo, không còn cái nắng, cũng không còn những khuôn mặt ướt đẫm mồ hôi. Trong lúc nhập ngũ, điều khiến mình cảm thấy quý giá nhất và đáng nhớ nhất là tình cảm giữa mấy anh em. Ngày nào cũng ăn, ngủ, huấn luyện cùng nhau nên dễ thân hơn so với lúc mình ở ngoài.",
      "Hôm nay thức muộn để xử lý chồng sổ và giáo án của anh Vĩ. Chắc phải một thời gian nữa mới có thể vực phần sổ sách lên được. Nhiều cái bị thiếu và bị sai. Ngày mai sẽ có nhiều việc phải làm đây!"
    ],
    signature: "Chủ nhật, 00:09"
  },
  {
    id: "ch-16",
    title: "Anh Vĩ bị mắng",
    intro: [
      "Hôm nay giành cả ngày học chính trị. Theo lịch là thủ trưởng Sư đoàn và Quân khu xuống kiểm tra nên dành rất nhiều thời gian cho công tác vệ sinh. Hôm nay anh Vĩ tiếp tục bị đại trưởng mắng về chuyện vệ sinh, còn bị nêu trong giờ tập trung đại đội đầu buổi chiều. Anh Vĩ hơi bất cần và khiến người khác có cảm giác bất an, cả về nội vụ vệ sinh cả về huấn luyện. Ngày mai cả ngày ra thao trường, sẽ mệt đây!!!"
    ],
    signature: "Thứ 3, 22:54"
  },
  {
    id: "ch-17",
    title: "Chuyện phiếm (1)",
    intro: [
      "Ngày thứ 7 đầu tiên cảm thấy khoan khoái, không cần phải chạy ra thao trường tập luyện. Buổi sáng đại hội chi đoàn, buổi chiều khám sức khỏe. Chỉ có chút sổ giao ban làm mình thấy nhọc. Tối qua chép đến 12h, sáng nay mất cả buổi sáng để chép tiếp, cả sổ học tập công tác và ít sổ của anh Vĩ. Gần 20 tờ giao ban, chép rã rời cả tay.",
      "Kiểm tra sức khỏe hôm nay làm qua loa hẳn so với ngày trước, chỉ làm giống như cho đủ thủ tục.",
      "Chiều nay anh Hoạt dặn lại chuyện hồ sơ chuyển đảng chính thức. Cuối tháng phải nộp lên tiểu đoàn nên cần phải chuyển lên nhanh. Mình gọi về cho mẹ, chắc thứ 2 anh Khánh sẽ cầm lên."
    ],
    signature: "Thứ 7, 22:25",
    ps: [
      "Hồi đó mình chỉ cần viết sổ cho anh Quang một thời gian rồi chuyển hẳn về chép sổ cho anh Vĩ.",
      "Anh Khánh là anh trai mình",
      "Anh Hoạt là Chính trị viên Đại đội, cùng cấp với Đại đội trưởng"
    ]
  },
  {
    id: "ch-18",
    title: "Kiểm tra bắn súng (nằm bắn)",
    intro: [
      "Lâu rồi chưa viết nhật ký. Đây là khoảng thời gian dài nhất mình bỏ viết.",
      "Cả đại đội bắn đạn thật, trung đội mình bắn đầu tiên, mình là người đầu tiên của loạt bắn thứ 2. Tiếng súng AK vang thì khỏi bàn, từ lúc đứng cách mấy quả đồi mà vẫn thấy vang rền cả bầu trời. Lúc ngồi đợi đến lượt, thấy tiếng súng từ mấy dải bắn trước không lớn như tưởng tượng nhưng vẫn đủ để giật mình.",
      "Đến lượt mình bắn là lúc hồi hộp nhất, vì những người bắn loạt 1 hầu hết đều làm tốt, và cũng vì tiếng súng nhức óc kia sắp được phát ra từ chính khẩu súng của mình, do chính tay mình bóp cò. Lúc viên đạn đầu tiên bắn ra, khẩu súng như sắp hất văng người mình ra sau, cả người và vai đều phải tỳ chắc để cản lại. Đạn bay nhanh không nhìn thấy vết, chỉ thấy có mùi thuốc súng nồng lên mũi, một thứ mùi chưa bao giờ mình được trải nghiệm.",
      "“Bia 4 bệ 1 báo: 1 điểm chạm - 10”. Nhẹ cả người vì đã vượt qua thử thách đầu tiên là bắn viên đạn thật đầu tiên. 2 viên sau phong độ kém hơn được 9 và 7, tổng là 26, đủ mức điểm giỏi. Tuy viên cuối điểm hơi thấp nhưng nhìn tổng lại cũng không đến lỗi tệ. Bắn xong được gọi sang bắn hộ bạn bắn yếu b2. Lần 2 cầm súng, 24 điểm (7, 10, 7), kết quả sút đi nhưng vẫn có 1 điểm 10. Đợt bắn này trung đội mình điểm cao nhất là 28, không có ai 3 điểm 10. Cả đại đội chỉ có 1 người ở b3."
    ],
    ps: [
      "Lúc bắn AK đạn thật, khoảng cách giữa bia và vị trí bắn khoảng 100m"
    ]
  },
  {
    id: "ch-19",
    title: "Chuyện phiếm (2)",
    intro: [
      "Hôm nay là một ngày thứ 7 thoải mái và nhẹ nhõm vì không cần chạy đua với thời gian, không cần rèn luyện căng thẳng như mấy ngày trước. Đặc biệt là được ngủ nghỉ theo chế độ mùa hè, buổi trưa ngủ mãi mới hết giờ nghỉ. Cảm thấy năng lượng tràn trề.",
      "Hôm nay ném thử lựu đạn chỉ được 5m, 25m mới là điểm đạt! Có kỹ thuật mà sức không tới^^. Tuần sau lại tiếp tục bắn đạn thật, nhưng lần này là quỳ bắn, mục tiêu là bia 7, độ khó cao hơn. Hy vọng kết quả lần này không làm mình thất vọng, để không kéo thành tích của cả tiểu đi xuống."
    ],
    signature: "Thứ 7, 22:52",
    ps: [
      "Nghỉ trưa mùa đông: 12h-13h45, mùa hè: 11h30 - 13h45"
    ]
  },
  {
    id: "ch-20",
    title: "Báo chí của tỉnh phỏng vấn",
    intro: [
      "Bên báo chí của tỉnh xuống đơn vị để phỏng vấn 1 bạn chiến sĩ mới. Mình đã vào đảng và tốt nghiệp đại học nên được chọn. Ngồi đợi ở tòa chỉ huy tiểu đoàn từ 6h30, đến 8h30 họ mới xuống. Từ tối hôm trước anh Hoạt đã chuẩn bị trước kịch bản cho mình học thuộc, còn chú Minh phổ biến trước những nội dung cần chuẩn bị. Cứ nghĩ họ sẽ quay và phỏng vấn luôn tại sân tiểu đoàn. Hóa ra còn quay cả cảnh mình tập điều lệnh và ra thao trường. Ngoài bãi bắn 1, sau khi phỏng vấn xong chú Minh, 2 chị phóng viên phỏng vấn mình. Câu hỏi đúng là xoay quanh chuyện tại sao nhập ngũ và cảm nhận trong thời gian đầu huấn luyện. Lúc cuối được hỏi thêm 1 câu về chuyện thay đổi tư tưởng sau khi nhập ngũ và làm gì để bảo vệ Tổ quốc. Câu này không có trong kịch bản nhưng vẫn nhảy số kịp. Đúng là 1 trải nghiệm đầu đời về chuyện phỏng vấn."
    ],
    ps: [
      "Phần câu hỏi mình học thuộc từ trước rất dài, nhưng lúc lên hình thì họ chỉ đăng mỗi phần phỏng vấn không có trong kịch bản. Mất một buổi tối học thuộc kịch bản làm gì không biết:D",
      "Chú Minh là Chính trị viên tiểu đoàn, cùng cấp với Tiểu đoàn trưởng. Một người phụ trách công tác đảng, một người phụ trách huấn luyện."
    ]
  },
  {
    id: "ch-21",
    title: "Kiểm tra bắn súng (quỳ bắn)",
    intro: [
      "Kiểm tra bắn đạn thật bia số 7. Lần này hồi hộp hơn lần trước. Học hàng ngày hay được khen bắn tốt, tay cầm ổn định. Lúc đi kiểm tra tim đập nhanh, súng bị rung nhiều, chỉ được 17 điểm 3 lượt bắn (8,9,0). Hơi xấu hổ với thành tích này, nhưng cũng đã làm hết sức có thể rồi. Cố gắng tập luyện tốt để lần đứng bắn tốt hơn."
    ]
  },
  {
    id: "ch-22",
    title: "Buổi đầu học thuốc nổ",
    intro: [
      "Hôm nay là buổi học thuốc nổ đầu tiên ra thao trường. Học buổi chiều, nắng cháy da cháy thịt, cảm giác có thể bị thiêu đốt bất cứ lúc nào. Học một lúc thì được nghỉ, cả đám ngồi núp dưới bóng râm ít ỏi của bức tường gạch, đến 3h thì bắt đầu học. Cả người mệt lừ không có sức để vác khẩu trung liên, bước đi như lết trên nền cỏ. Giữa buổi trời nổi gió, đỡ oi bức một chút và bớt mệt đi 1 chút. Chỉ học 1h là được hành quân về đơn vị.",
      "Hôm nay mẹ mua cho thuốc bị táo bón và tai nghe. Lúc tối có nhờ mẹ mua cả lương khô. Mai anh Khánh mang đồ lên đây rồi! Cả Nghiêm và Tuyên cũng gửi anh Khánh để mang lên hộ. Háo hức đồ ngọt ở nhà gửi lên!"
    ],
    signature: "Thứ 5, 22:32"
  },
  {
    id: "ch-23",
    title: "Cỗ giỗ tổ",
    intro: [
      "Hôm nay là ngày 10/3 âm lịch, ở đây tổ chức cỗ mừng ngày giỗ tổ. Buổi sáng mọi người mặc tác phong, xem bóng chuyền giao hữu giữa c3 và c4. Giữa buổi sáng có thời gian đi giặt giũ quần áo rồi ngồi nghe mọi người hát. Thật muốn ngày nào cũng là ngày lễ, không hối hả thúc giục, cũng không cực nhọc thao trường. Buổi trưa đơn vị được ăn cơm cỗ, đúng không kém gì cỗ cưới. Bao nhiêu ngày cơm lính, được 1 bữa cỗ đúng là giây phút đáng nhớ, chỉ muốn thời gian ngừng lại để tận hưởng khoảnh khắc này mãi thôi. Nói chứ phải có cơm lính mới biết trân trọng những gì quý giá mình từng có."
    ],
    ps: [
      "Mặc tác phong khi ở đơn vị là mặc bộ k03, sơ vin, vai đeo tiết (phù hiệu thể hiện cấp bậc)"
    ]
  },
  {
    id: "ch-25",
    title: "Đại hội tiểu đoàn",
    intro: [
      "Là một trong 22 đại biểu của c4 đi dự đại hội liên chi đoàn d2. Ngày đại hội khá buồn ngủ, nhiều thủ tục, nhiều văn bản giống như những buổi đại hội thời học sinh. Cuối buổi đại hội được thông báo mình là 1 trong 17 đại biểu sẽ tham dự đại hội liên chi đoàn cấp cơ sở (bên Trung đoàn). Thấy sĩ phết vì là chiến sĩ mới duy nhất."
    ]
  },
  {
    id: "ch-26",
    title: "Lần đầu xem ti vi",
    intro: [
      "Hôm nay là buổi tối thứ 7 đầu tiên mình ra ngoài sân đại đội để xem ti vi. Buổi đầu tiên xem đúng vào hôm trời trở rét. Cả đám ngồi co ro, xúm lại gần nhau trước màn hình ti vi. Phim không tệ, xem cũng làm mình thay đổi không khí một chút, không cần vùi đầu vào sổ sách cả tối lẫn ngày. Lâu lâu thay đổi không khí một chút để thêm trải nghiệm đời lính, không phải lúc nào cũng chỉ có huấn luyện và chồng sổ sách giáo án. Thứ 2 bắn đạn thật nội dung đứng bắn, c4 bắn đầu và b1 là trung đội mở bát cho cả tiểu đoàn. Nghe thôi đã đầy áp lực! Khả năng cao ngày mai sẽ học bắn súng để ôn luyện. Hy vọng kết quả lần này không quá tệ.",
      "Hôm nay là buổi tối đầu tiên được thoải mái đầu óc, mắc màn đi ngủ sớm. Trùng hợp hôm nay là 2 tháng tròn bước chân vào quân đội. Vẫn là một buổi mưa rét, hệt như tâm trạng của mình khi mới đặt chân vào đây. Nhập ngũ thật giống một chú chim trong lồng, ngóng chờ ngày mở cửa để sải cánh bay đi."
    ],
    signature: "Thứ 7, 22:32"
  },
  {
    id: "ch-27",
    title: "Kiểm tra bắn súng (đứng bắn)",
    intro: [
      "Buổi sáng dậy sớm như những lần bắn súng trước. Lần này bắn đầu nên phải chuẩn bị vật chất mang đi. Đợt bắn này bớt run hơn hẳn so với lần quỳ bắn nhưng kết quả không tốt bằng. Viên cuối bị mất, viên đầu thì được 6, được viên 2 vào vòng 10 gỡ lại nên tổng 16 (đủ điểm đạt). So với mặt bằng chung thì điểm số này không tệ. Số người điểm đạt rất ít. Cả trung đội bị dừng bắn để huấn luyện lại sau khi kiểm tra xong 3 loạt bắn đầu.",
      "Từ tối qua cả đơn vị chuyển sang chế độ mùa hè, phải thu hết ruột chăn và đệm cất dưới kho. Việc gấp chăn bắt đầu chuyển sang cách gấp chăn mùa hè, nghe chừng nhanh hơn chăn mùa đông, nhưng cần sự tỉ mỉ nhiều hơn. Bảo sao đại phó nói gấp chăn chỉ 3-4’, có thể đại phó ám chỉ chăn mùa hè.",
      "Ngày mai ném lựu đạn thử để chuẩn bị cho đợt ném lựu đạn sắp tới. Mình nhận tâm lý yếu và không tham gia ném. Bình thường chỉ ném được hơn 10m. Mà mình cũng hay hồi hộp vào thời khắc quan trọng. Tham gia bắn đạn thật là đủ với mình để trải nghiệm rồi."
    ],
    signature: "Thứ 2, 22:21"
  },
  {
    id: "ch-28",
    title: "Trung trưởng thứ 2",
    intro: [
      "Anh Quý đi hội thao về, trung đội chính thức có 2 trung đội trưởng. Hơi không quen vì đã ở cùng anh Vĩ trong 2 tháng, quen với cảm giác làm việc với 1 trung đội trưởng. Thêm người mới có chút lạ lẫm và chút lo lắng vì anh Quý nghe nói khắt khe hơn, sẽ không còn được thoải mái như khi có mình anh Vĩ duy trì nữa.",
      "Hôm nay là buổi đầu tiên anh Quý tham gia huấn luyện. Đúng chất sĩ quan lục quân, dù không đọc trước giáo án, chỉ xem qua trước lúc dạy vẫn có thể giảng giải cặn kẽ. Nhưng đúng là chuyện giờ giấc và các chế độ có phần kỹ tính hơn anh Vĩ. Mọi vấn đề liên quan đến công tác tăng gia, hồ sơ sổ sách vẫn là anh Vĩ đảm nhận chính nên mình vẫn làm việc trực tiếp với anh Vĩ."
    ]
  },
  {
    id: "ch-29",
    title: "Anh Vĩ về tranh thủ",
    intro: [
      "Anh Vĩ về tranh thủ 5 ngày, anh Hồng sang ngủ giường anh Vĩ. 5 ngày tới mình sẽ làm việc trực tiếp với anh Quý. Mấy ngày tiếp xúc thấy anh Quý thấy nói chuyện nhẹ nhàng, không cáu gắt, nhưng không thoải mái, xuề xòa như anh Vĩ. Các anh tiểu trưởng cũng có vẻ dè chừng hơn, không dám làm gì hoặc nói gì quá trớn. Anh Quý bằng tuổi anh Vĩ. Anh Vĩ thích tìm hiểu về chứng khoán còn anh Quý thì lại thích chơi liên quân, và hay chơi đến đêm. Nhưng anh Quý có trách nhiệm hơn khi có việc cần giải quyết."
    ]
  },
  {
    id: "ch-30",
    title: "Cỗ 30/4 - 1/5 (2 ngày)",
    intro: [
      "Buổi trưa hôm qua được ăn cỗ giống như lần giỗ tổ, nhưng có phần ngon hơn. Có bánh mì chấm sốt vang, lâu lắm rồi không ăn. Trời nắng nóng như đổ lửa, may có bình đá với non pepsi. Ngày lễ đúng thoải mái, chỉ có thể thao, giặt giũ quần áo với tăng gia.",
      "Hôm nay, buổi cỗ thứ 2 vẫn ngon và nhiều món. Vừa dậy trời đã mưa to nên không có hoạt động thể thao. Ăn xong bữa trưa coi như đã hết cỗ, sang chiều lại bắt đầu tăng gia và làm bộc phá. Tiếng chổi, tiếng máy cắt, tiếng gọi nhau đi làm, không khí ngày lễ đã không còn, cuộc sống lại trở về với những ngày bình thường."
    ],
    ps: [
      "Bộc phá là một khối đất tượng trưng cho khối thuốc nổ TNT, dùng trong huấn luyện đánh thuốc nổ"
    ]
  },
  {
    id: "ch-31",
    title: "Cơ động sang trung đoàn",
    intro: [
      "Buổi tối sau khi ăn xong, vừa mới nghĩ tới chuyện xem phim thì có thông báo mặc quần áo k20 để tập trung ở sân đại đội, riêng đội gói buộc thuốc nổ mẫu mang đeo trang bị và vật chất, sau đó tất cả di chuyển sang trung đoàn. Hóa ra là diễn tập trước để chuẩn bị cho buổi thực hành đánh thuốc nổ buổi sáng hôm sau, có sư đoàn xuống kiểm tra, và c4 phụ trách bố trí vật chất. Mình nằm trong đội gói buộc thuốc nổ mẫu nên phải mang đầy đủ súng, trang bị và vác thêm 2 bộc phá, mỗi tay 1 chiếc. Do đại đội tập trung muộn nên vừa xuất phát đã phải chạy, thở không ra hơi, cuồng hết cả tay chân. Được đi bộ 1 đoạn, lúc vào đến ao trung đoàn lại phải tiếp tục chạy. Cả người như bị cả tấn đá đè. Đến nơi, bỏ được đám bộc phá xuống đất như rũ bỏ được cả thế giới. Toàn thân đều là mồ hôi, chưa lúc nào người mình đẫm mồ hôi như tắm thế. Đứng nghe phổ biến một lúc, hóa ra c4 chỉ chuẩn bị còn c3 thực hành mẫu. Thở phào nhẹ nhõm, vì lúc đó không còn sức để làm thêm bất cứ thứ gì nữa. Nhưng mà đội mẫu c3 vẫn chưa tới. Vừa chuẩn bị quyết định thay bằng c4 thì đội mẫu của c3 cuối cùng cũng đến. Thở phào thêm lần nữa!",
      "C4 di chuyển lên phía đường và ngồi nghỉ. Trời tối, chỉ có ít ánh sáng hắt vào từ thao trường, vừa đủ để biết bên cạnh mình có người ngồi. Ngồi dưới gốc cây bạch đàn, ngước mắt phía ngọn cây là một trời đầy sao, xung quanh là tiếng râm ran chuyện trò. Thấy nhớ cảnh mất điện ngày xưa ở quê, lâu rồi không có cảm giác này. Nhớ cả “mảnh súng trăng treo”, vì phía trước mình là các hàng súng của trung đội, đang giá vào nhau và hướng mũi lên trời. Suốt mấy tiếng đồng hồ ngồi như vậy, hơi mỏi nhưng đỡ mệt nhiều.",
      "22h kém cả trung đội thu xếp vật chất và trở về đơn vị. Người nhẹ nhõm hơn nhiều so với lúc đi. 22h30 về đến nơi, sau khi cất súng và treo quần áo, việc đầu tiên là xuống nhà tắm giũ nốt bộ quần áo đang giặt dở trước lúc ăn cơm.",
      "Lúc về anh Vĩ đã ngủ. Hôm nay anh Vĩ đi tranh thủ lên."
    ],
    signature: "Chủ nhật, 17:55"
  },
  {
    id: "ch-32",
    title: "Anh Khánh lên thăm",
    intro: [
      "Anh Khánh lên thăm, mang cho mình ít bánh với lương khô, cũng coi như là đồ gửi cho mình hậu sinh nhật. Khá hoài niệm về thời gian đã qua! Thấy nhớ và thấy bùi ngùi!",
      "Anh Khánh lên đúng lúc mình đang ngồi cùng Phong với mọi người trong tiểu, bạn của Phong lên thăm. Chạy về trung đội để thay áo k03, vì phải mặc vậy mới được gặp người nhà. Lần này đại đội cho gặp nên 2 anh em mới có thời gian ngồi nói chuyện với nhau, không cần phải như mọi lần, chỉ vừa nhìn mặt rồi vội vã đưa đồ đã phải tạm biệt. 2 anh em gặp mặt từ 12h kém đến 1h chiều, tâm sự nhiều chuyện, lâu rồi mới có cảm giác ngồi nói chuyện cùng người nhà như vậy. Anh Khánh về lúc trời đang mưa lâm râm, lưu luyến nhìn tấm lưng nhỏ dần, nhưng cảm thấy được động viên và có động lực để bước tiếp. Mọi con đường mình đi đều có trở ngại và những rào cản, nhưng có đi qua mới thấy bản thân được rèn rũa. Mỗi trải nghiệm đều đem lại một bài học gì đó dù ít hay nhiều."
    ],
    signature: "Thứ 3, 20:04"
  },
  {
    id: "ch-33",
    title: "Kiểm tra 3 tiếng nổ",
    intro: [
      "Chiều qua kiểm tra đánh thuốc nổ ngoài thao trường 4 bên trung đoàn. Từ buổi sáng đã qua để tham quan các anh trung trưởng và tiểu trưởng kiểm tra trước, loạt đầu tiên cả đội đều giật mình. Lần đầu nghe tiếng thuốc nổ, cả 6 dải cùng nổ, oành oành oành … !!! Bộc phá đất bị nổ chẳng còn lại gì, chỉ có nẹp tre và vụn mảnh bọc còn sót lại. Nhìn các loạt đánh thuốc nổ mà hưng phấn, thấy thật đúng đắn vì không xin vào danh sách tâm lý yếu. Sau buổi sáng tham quan, nhiều người đã xin đi kiểm tra trở lại.",
      "Cuối buổi sáng hôm qua cả đại đội được đưa qua điểm cao 1 đứng tham quan ném lựu đạn thật. Các vòng 2,3,4 được trang trí đẹp hơn lúc ném thử, màu đậm hơn và rực rỡ hơn. Lần này được ném 2 quả, lựu đạn nổ nhiều lần và lựu đạn (LĐ) thật. LĐ nổ nhiều lần thực chất là làm nổ kíp bên trong, không làm vỡ vỏ LĐ, có chăng thì chỉ làm nứt thôi. Tiếng nổ khá đanh, nhỏ hơn tiếng súng AK lúc bắn đạn thật. Gây mong đợi nhất là LĐ thật. LĐ vừa lăn, UỲNH!!!! Cả đám giật nảy mình, cảm giác rung cả đất, đất trong vòng tròn bắn tung tóe, tiếng nổ như sấm rền, lớn gấp không biết bao nhiêu lần tiếng nổ của LĐ nổ nhiều lần. Được tham quan đánh thuốc nổ thật và ném LĐ thật đúng là trải nghiệm đáng nhớ.",
      "Hôm nay là ngày cuối kiểm tra 3 tiếng nổ. Sáng nay kiểm tra bắn súng, c4 bắn trước nên phải dậy từ 3h30, cũng giống như hôm trước. Tối hôm qua còn được ngủ từ 20h15 tối, đúng là chưa từng có từ khi nhập ngũ, và sau này chắc cũng sẽ không có chế độ nào như vậy. Nhưng trung đội phải nhặt rau muống để mang xuống bếp nên không được ngủ sớm, vẫn 21h30 lên giường đi ngủ.",
      "Đội hỏa lực có nhiệm vụ đi cáng đạn ra thao trường nên đi trước, đến kho đạn ngoài sân bóng để đợi lấy đạn. C3 lấy LĐ trước vì số lượng thùng nhiều. Đúng chất bộ binh, buộc dây tăng vào cáng để giữ thùng LĐ cũng đều có các bước thực hiện đâu ra đấy. Người cáng thì khỏe, cáng 2 thùng mà vẫn đi băng băng. Đợi c3 lấy xong thì đến c4 lấy đạn thật. Hơn 2000 viên, tưởng nhiều nên 9 người đi, cuối cùng đựng lọt thỏm trong duy nhất 1 thùng, lại còn thừa chỗ cho mấy viên không dùng đến.",
      "Đến điểm cao 1 thấy các dải bắn của 2 trung đội đã ngồi sẵn ở nhà bạt cạnh nhà chỉ huy, tách biệt khỏi phần còn lại. Mọi người đang được xếp vị trí, nhiều người bắn không đạt từ đợt trước sẽ được thay bằng những người bắn tốt. Mấy hôm trước anh Vĩ chọn người bắn hơi cảm tính, nhiều người đạt nhưng không được chọn và ngược lại. Danh sách chỉ có 17 người. Nhưng lần này những ai đạt đều được vào bắn hết. Lần trước bắn thử mình được có 24/90 điểm 3 bia nên trong đầu đã xác định trước sẽ ngồi ngoài để người khác bắn thay. Nhưng anh Vĩ vẫn để mình đi bắn vì biết mình thích bắn. Trong đầu tự nhủ nhất định phải làm tốt.",
      "C4 bắn đầu, trung đội mình khai màn cho cả tiểu đoàn. Bắn loạt 2 nên khá đột ngột, tim đập khá mạnh. Lúc ngồi đợi đến lượt bắn còn tự lấy tay véo vào người thật đau cho bớt run. Thế rồi cái gì đến thì cũng phải đến. Người bắn trước mình được 30/90 điểm, lúc trao súng cho mình thì nói súng bắn khó và bị lệch. Khá thất vọng với lo lắng nhưng vẫn thực hiện đúng như những gì được dạy, không điều chỉnh. Lúc thông báo kết quả được 72/90 điểm, vừa đủ điểm giỏi, khoan khoái vô cùng. Thở phào 1 cái thật mạnh. Không phụ niềm tin của anh Vĩ, mình đã kiếm được 1 điểm giỏi cho trung đội. Sau loạt bắn này mình bắn hộ thêm 2 loạt nữa được 64 và 68 điểm. Không thể kiếm thêm bông hoa bắn giỏi, nhưng 1 bông cũng là quá đủ với mình rồi. Kết thúc thi 3 tiếng nổ, mình tham gia 2 nội dung (bắn súng và đánh thuốc nổ), cả 2 đều điểm giỏi."
    ],
    signature: "Thứ 5, 23:07",
    ps: [
      "3 tiếng nổ là chương trình học bắt buộc trong huấn luyện tân binh, gồm bắn súng tiểu liên AK, ném lựu đạn và đánh thuốc nổ. Thi kết thúc tân binh bao gồm thi 3 tiếng nổ và thêm một học phần khác, ví dụ điều lệnh, võ thuật, hoặc hậu cần quân y."
    ]
  },
  {
    id: "ch-34",
    title: "Làm sổ đến 3h sáng",
    intro: [
      "9 ngày chưa viết nhật ký. Sau khi thi xong 3 tiếng nổ lại lao vào các hoạt động mới, buổi tối mệt rã người, đặt lưng xuống giường là muốn ngủ ngay. Đang viết những dòng này vào buổi trưa oi nóng, ve đang râm ran như chạy trận, vừa mới giặt bộ k03 xong.",
      "Buổi tối sửa sổ với giáo án đến 3h sáng để hôm nay mang nộp cho tiểu đoàn. Chưa bao giờ bị dồn việc nhiều như thế, cũng là lần đầu tiên mình thức muộn như thế, kể từ lúc tốt nghiệp đại học đến giờ. Vẫn còn 1 ít hình chiến thuật của đề mục 6, nhưng mình không thể trụ được nữa rồi, 4h30 phải dậy!"
    ]
  },
  {
    id: "ch-35",
    title: "Mẹ lên thăm",
    intro: [
      "Sáng hôm nay mẹ với Toàn và người nhà của Nghiêm, Vinh, Tuyên lên thăm. Từ mấy hôm trước bàn nhau để gọi mọi người lên. Dự định ban đầu là để tuần sau vì tuần này đang chuẩn bị cho thi kết thúc chiến sĩ mới phần hậu cần quân y. Nhưng chưa biết thời gian chính xác buổi tuyên thệ, anh Vĩ từ trên tiểu đoàn về nói có thể sẽ tổ chức sớm hơn và chuyển đơn vị sớm hơn dự kiến. Tức là nếu cuối tuần này người nhà chưa lên thăm thì sang tuần sau có thể mỗi đứa sẽ tản đi 1 đơn vị khác nhau, muốn thăm đông đủ cùng mấy anh em cùng làng cũng khó. Mà cuối tuần này lại đang bị quán triệt không được cho người nhà lên thăm. Hỏi thử anh Vĩ với anh Quý thì anh Vĩ bảo phải hỏi đại đội. Nghiêm hỏi anh Thanh thì anh Thanh bảo để hôm sau mới quyết định được. Tuyên thì vẫn cứ bảo phải chắc chắn thì lên thăm đỡ mất công, nếu lên rồi lại về hoặc chỉ gặp 5-10’ thì cũng không đáng. Mình với Nghiêm vẫn quyết định gọi mọi người lên tuần này, trường hợp xấu nhất có thể nhờ được anh Thanh bên đại đội!",
      "Buổi sáng đổi tập sang mắc tăng võng vì hôm trước đã tập băng bó. Ngày hôm nay được tập ở nhà nên thấy yên tâm vì chỉ cần mọi người lên là có thể chạy ra ngay. Lẽ ra lúc này đang ở bên trung đoàn để dự đại hội trù bị, nhưng chỉ những ai phát biểu mới phải ở lại nên mình được về tiểu đoàn sớm. Đang mắc tăng võng thì trời bắt đầu lất phất mưa, mẹ và mọi người cũng vừa đến, đang đợi ngoài cổng. Trong lòng thấp thỏm vô cùng! Vừa không biết có được gặp hay không, vừa không biết nếu may mắn được gặp thì sẽ ngồi ở đâu. Ngồi tập bên đường nhìn ra thấy hàng đoàn người từ ngoài cổng nhìn vào. Hôm nay có rất nhiều người gọi người nhà lên thăm, bên ngoài đã không còn nhìn thấy đường đi nữa. Trong hàng người đó mình nhìn thấy mẹ và mọi người. Chỉ vài chục mét mà cảm giác cách nhau thật xa.",
      "Đến 10h đột nhiên có thông báo từ đại đội, người nhà chính thức được vào thăm từ hôm nay, thay vì cuối tuần sau như thông báo trước đó. Và người nhà sẽ ngồi tại hiên của trung đội. Bao nhiêu lo lắng vụt tắt, mọi thứ vỡ òa trong hạnh phúc! Nhìn thấy mọi người bước vào mà lòng sung sướng. Bữa cơm gia đình đầu tiên kể từ sau nhập ngũ, chưa nói đến chuyện ngon hơn và đầy đủ hơn, đây là bữa cơm đầy tràn sự sung sướng. Trời đang mưa mà chẳng có cảm giác gì ướt át, lại càng hả hê và trân quý giây phút được quây quần trò chuyện. 13h15, mọi người ra về, để lại chút hụt hẫng và trống vắng."
    ],
    ps: [
      "Anh Thanh là Chính trị viên phó đại đội. Nghiêm làm cò sổ sách cho anh Thanh."
    ]
  },
  {
    id: "ch-36",
    title: "Viết thư để gửi về nhà",
    intro: [
      "Sáng nay vẫn phải sang trung đoàn để tập duyệt đội ngũ đến 10h mới được về. Trên đường về cảm thấy gọi mẹ lên thăm từ tuần trước đỡ hơn tuần này, hôm nay tập mệt hơn và trời đang nắng gắt. Về đến đơn vị thấy ngoài cổng đã đông nghịt người, nhìn không thua kém gì so với tuần trước. Lịch tuyên thệ không thay đổi nên vẫn còn tuần này để người nhà lên thăm. Trong trung đội hôm nay cũng có mấy người có người nhà đến thăm. Bất ngờ nhất là có Hồng Trâm - chị của Kiểm đến. Lâu rồi không gặp, Trâm có vẻ gầy hơn hồi gặp gần nhất. Ngồi nói chuyện cùng chị Kiểm với mọi người đến đầu giờ chiều. Bạn bè lâu ngày không gặp nói đủ thứ chuyện, đúng là niềm vui ngày cuối tuần!",
      "Buổi tối, đại đội tổ chức viết thư gửi về nhà. Không biết viết gì, nhưng đã dồn hết tâm sức vào nó. Đến 12h đêm, viết xong thư rồi mới đi ngủ. Không có gì nuối tiếc về lá thư đó, toàn bộ tâm can của mình đều ở đấy."
    ],
    ps: [
      "Hồng Trâm là bạn học cùng lớp cấp 3"
    ]
  },
  {
    id: "ch-37",
    title: "Tuyên thệ Chiến sĩ mới",
    intro: [
      "Sau bao ngày luyện tập vất vả, đứng nắng đứng mưa để tập điều lệnh, cuối cùng hôm nay cũng đến ngày tuyên thệ. Ngày quan trọng nên thời tiết cũng ủng hộ. Lúc đứng nghiêm thì trời râm, chỉ thỉnh thoảng có nắng rồi lại bị mây che đi mất. Trên khán đài có nhiều người đến dự, hầu hết là khách mời từ các huyện có người nhập ngũ. Lúc đầu tưởng phải đến gần 90 khách mời, nhưng hôm nay chỉ có khoảng 20~30 người đến. Huyện mình có 4 người đi dự. Cuối buổi, cô chú từ huyện mình tặng mấy anh em thùng bánh kẹo, toàn loại ngon và lạ, thích vô cùng. Thư viết tay thì được nhờ cô chú gửi về hộ.",
      "3 tháng tân binh cứ như vậy mà kết thúc, giờ chỉ còn đợi biên chế đi đơn vị mới nữa thôi. Tạm thời kết thúc những ngày tháng nắng gió đầy mỏi mệt. Giờ ngồi nghĩ lại toàn bộ quá trình huấn luyện mà vẫn thấy rùng mình, không hiểu sao mình có thể trải qua được khoảng thời gian đó."
    ],
    ps: [
      "Để chuẩn bị cho buổi tuyên thệ thì trước đó phải tập luyện rất nhiều, mình không nhớ rõ phải tập trước bao lâu. Có 2 nội dung chính cần luyện là đứng nghiêm và đi điều lệnh (đi đều, đi nghiêm).",
      "Lúc tập đứng nghiêm thì cả trung đoàn sẽ tập trung và luyện đứng nghiêm trong ít nhất 2-3h dưới trời nắng. Thời gian tập và số ngày tập còn tùy thuộc vào mức độ thực hiện của các khối. Thời gian đó, trong lúc đứng mình thậm chí cảm nhận được từng giọt mồ hôi đang chảy thành dòng trong người.",
      "Lúc tập điều lệnh thì sẽ cần tập theo từng giai đoạn. Đứng ke chân, ke tay để quen với cao độ động tác, sau đó tập giậm chân và đánh tay theo nhịp tại chỗ, rồi bắt đầu luyện đi theo từng hàng, tiếp đến là ghép khối trong tiểu đội, rồi trung đội, và cuối cùng là tiểu đoàn. Ban đầu sẽ luyện đi theo nhịp đếm, sau đó sẽ mở loa để luyện đi theo tiếng nhạc. Kết quả cuối cùng là một khối đi đều theo tiếng nhạc, thẳng tắp cả hàng ngang lẫn hàng dọc.",
      "Tập điều lệnh là một trong những thứ khá ám ảnh hồi tân binh vì phải tập quá nhiều, từ lúc mở mắt buổi sáng đến tận lúc đi ngủ. Thời gian đó tập nhiều đến mức kể cả lúc ngủ cũng có thể nằm mơ đang đếm “mốt hai mốt”."
    ]
  },
  {
    id: "ch-38",
    title: "Biên chế đơn vị mới (ngày 1)",
    intro: [
      "Buổi sáng vẫn phải mặc k20 ra sân bóng học ném LĐ, nhưng chủ yếu được ngồi nghỉ giải lao. Khoảng 8h, 3 người về tỉnh đội được gọi về thu dọn quân tư trang. Có Thái với Phong của tiểu mình. Chia tay 3 người đầu tiên của trung đội, thấy buồn hẳn. Cảm giác tạm biệt những người đã cùng mình trải qua ngần ấy chuyện đúng là không dễ chịu chút nào. Nhìn thấy xe đi xa dần vừa thèm cảm giác được trở về, vừa thấy mừng cho đồng đội được về gần nhà, và chắc chắn quãng đường về sau sẽ dễ chịu hơn nhiều. Tiếp đến là Vinh với Tuyển tủ súng. Chia tay nhau ngoài sân bóng nhưng đến giữa trưa mới lên xe chuyển đơn vị.",
      "Buổi chiều cả tiểu đoàn tập trung tại sân nhà ăn để nghe biên chế. Nghiêm về Cối với anh Hào, Tuyên về Cối với anh Quý, còn mình thì về thông tin với anh Vĩ. Thế là anh Vĩ đã xin được cho mình ở lại, không bị chuyển đi. Tâm trạng thoải mái vì nghe đồn thông tin không quá vất vả, còn anh Vĩ thì thoải mái."
    ],
    ps: [
      "Sau khi kết thúc huấn luyện tân binh, tiểu đoàn mình trở về biên chế ban đầu, gồm 3 đại đội bộ binh (c1,c2,c3), 1 đại đội pháo binh (cối 82mm), và 3 trung đội trực thuộc gồm Thông tin, Súng máy phòng không 12,7mm (hay gọi 12 ly 7) và Phục vụ (nấu ăn).",
      "Trung đội trực thuộc tức là không qua quản lý của đại đội mà trực tiếp thuộc quản lý của Tiểu đoàn. Bên Trung đoàn thì sẽ có đại đội trực thuộc, tức là không qua Tiểu đoàn mà trực tiếp thuộc quản lý của Trung đoàn."
    ]
  },
  {
    id: "ch-39",
    title: "Biên chế đơn vị mới (ngày 2)",
    intro: [
      "Chỉ 1 ngày từ lúc biên chế mới mà người ra người vào liên tục, mình phải thay đổi và bổ sung trích ngang mấy lần. Chuyên ngành thông tin đúng là nhiều biến động. Còn mình liệu có bị chuyển đi không??"
    ],
    signature: "Thứ 6, 22:04",
    ps: [
      "3 tháng tân binh tất cả chiến sĩ sẽ theo cùng một chương trình huấn luyện của bộ binh. Sau khi kết thúc huấn luyện mới bắt đầu chia chuyên ngành, ví dụ bộ binh, vệ binh, thông tin, quân y, pháo binh, công binh, trinh sát, vận tải, phục vụ, … Rất nhiều trong số đó không thuộc biên chế của Tiểu đoàn mình.",
      "Sau biên chế có nhiều người vẫn ở lại đây, nhưng cũng rất nhiều người đã chuyển đi đơn vị khác. Tiểu đoàn vắng người hẳn."
    ]
  },
  {
    id: "ch-40",
    title: "Đội học at sắp chuyển đi",
    intro: [
      "Đội học at chỉ còn hôm nay ở lại đơn vị, đến 2h30 sáng hôm sau sẽ phải tập trung ở sân nhà ăn để đi lên trường quân sự. Kịp cắt tóc lần cuối trước khi Toản đi. Buổi tối Tuyên và Nghiêm sang phòng anh Vĩ nói chuyện đến 22h. Tuyên cũng đi học at. Cả đại đội có 50 người đi học, ngày mai đi rồi ở đây lại vắng tanh."
    ],
    ps: [
      "Học at thường sẽ mất khoảng 6 tháng. Sau khi học xong thường sẽ có 2 trường hợp phổ biến mà mình biết, (1) chuyển đến tiểu đoàn lính cũ để năm sau quản lính mới, và (2) chuyển đến tiểu đoàn lính cùng khóa để sang năm quản lính cùng khóa."
    ]
  },
  {
    id: "ch-41",
    title: "Buổi đầu hành quân",
    intro: [
      "“Nhàn trinh sát, mát thông tin”, mọi người vẫn truyền tai nhau như thế từ lúc mới vào. Trinh sát có nhàn hay không thì mình không biết, nhưng học thông tin thì đúng là ngồi mát thật. Từ đầu tuần tới giờ chỉ mang ghế ra gốc cây ngồi ghi lý thuyết một chút rồi nghỉ giải lao, có thời gian ngồi đọc sách.",
      "Tối nay là buổi tối đầu tiên đi hành quân, mang theo balo trực chiến đi 1 vòng lên đập sang trung đoàn lên điểm cao 1 rồi trở về. Bắt đầu từ giờ sẽ được rèn sức khỏe để chuẩn bị cho đợt hành trú quân và diễn tập sắp tới. Cường độ sẽ được nâng dần để tăng sức bền. Hôm nay mệt thật nhưng mà vui. Đi dưới ánh trăng, đằng trước và đằng sau đều có đồng đội đi cùng. Coi như cũng là bù lại cả ngày ngồi ở đơn vị. Hành quân mệt mà vui!"
    ],
    signature: "Thứ 5, 21:45",
    ps: [
      "Điểm cao 1 là một thao trường tập bắn"
    ]
  },
  {
    id: "ch-42",
    title: "Lần đầu tăng gia",
    intro: [
      "Hôm nay anh Vĩ về tranh thủ, trung đội có vẻ thoải mái hơn. Kết thúc tân binh, lịch học chỉ từ thứ 2 đến thứ 5, từ thứ 6 trở đi là ngày nghỉ, nên hôm nay gần như không có nội dung gì cần phải học ngoài điều lệnh, còn lại chủ yếu là tăng gia và công tác tiểu đoàn. Ngày nghỉ nên ít sổ sách cần viết, anh Vĩ mang theo máy tính về nên cũng không cần in giáo án. Nay rảnh đi xuống tăng gia cùng mọi người. Từ lúc nhập ngũ đến giờ gần 4 tháng, hôm nay mới cầm xẻng xuống vườn đào rãnh, rồi cầm chậu với cáng đi múc phân. Hôm nay mới thực sự biết thế nào là tăng gia, biết cả cái lấm lem và mùi mẫn. Chân tay một chút và mồ hôi một chút, nhưng có cảm giác thoải mái hơn ngồi trong phòng viết sổ. Nghe tiếng người, tiếng xô chậu, tiếng cuốc xẻng, nhìn cây, nhìn đất, nhìn trời, nói chung vẫn thấy thích hơn ngồi 1 góc trong 4 bức tường.",
      "Tối nay Cương chính thức chuyển sang c2, có 1 anh at sang dẫn đi. Anh at có vẻ nhanh nhẹn và tâm lý. Cương đi rồi có 1 chút buồn. Sang c2 rồi thì vẫn trong d2, vẫn có thể gặp được nhau. Cương hiền lắm, ít nói nữa, thỉnh thoảng biết cách khịa vui, sang kia chắc sẽ không bị bắt nạt. Bên c2 đông người hơn, 1 thời gian nữa quen rồi chắc sẽ thấy vui, nhiều kỷ niệm đáng nhớ. Cương sang kia đổi cho 1 người đang đi hội thao bắn súng. Như thế ở đây gần như mất hẳn 1 người, công tác, tăng gia đều thiếu 1 người. Từ mai mình sẽ gác cùng mọi người để bảo đảm mỗi người đều gác 2 hôm, nghỉ 1 hôm.",
      "Hôm nay trời mưa lớn, cả trung đội sinh hoạt trong nhà. Có nhiều thời gian ngồi đọc sách với nói chuyện. Ngồi 1 lúc chạy sang phòng anh Vĩ viết lại mấy dòng này."
    ],
    signature: "Thứ 6, 21:14",
    ps: [
      "c1, c2, c3 là 3 đại đội Bộ binh, cường độ huấn luyện sẽ cao hơn và đảm nhiệm những nhiệm vụ tốn sức hơn."
    ]
  },
  {
    id: "ch-43",
    title: "Gác 3 ca",
    intro: [
      "Hôm nay gác trưa và 2 ca tối. Hôm trước mình cắt gác không chuẩn, lại phải trường hợp Cương chuyển đi không có ai bù vào nên phải gác 3 ca mới bù lại được. Buổi gác thứ 2 nhưng là buổi gác đầu tiên ở ca tối. Có bài báo với quyển sách làm bạn nên bớt chán hơn. Lần đầu có cảm giác có nhiều thời gian nghĩ về nhiều thứ.",
      "Viết những dòng này trong ca gác cuối cùng trong ngày."
    ],
    signature: "Thứ 7, 23:24",
    ps: [
      "Sau khi kết thúc huấn luyện tân binh thì bắt đầu nhiệm vụ canh gác. Thường sẽ canh gác ngay tại trung đội, có khi gác cả ở vườn rau. Thời gian gác mỗi ca khoảng 1h, có thể vào buổi trưa hoặc trong thời gian từ tối đến sáng sớm. Lúc đứng gác cần mặc tác phong và đem theo gậy gác."
    ]
  },
  {
    id: "ch-44",
    title: "Buổi đầu học dịch mã",
    intro: [
      "Tối qua thức sửa sổ sách theo ý tiểu đoàn đến 1h30 mới được đi ngủ. Chiều qua học thể lực đã mệt rồi lại được ngủ ít, cả người mệt lừ.",
      "Hôm nay là buổi đầu tiên học dịch mã từ chữ ra số. Mọi người trong tiểu được học từ tối qua nhưng mình bận làm vở học chính trị cho trung đội nên không học được, chỉ kịp hỏi Phụng qua loa cách làm. Hôm nay mới được trực tiếp thực hành, tốc độ ban đầu hơi chậm, lúc làm quen thì nhanh hơn nhưng lại hay sai. Cần cải thiện độ chính xác nhiều hơn. Nghe anh Vĩ bảo sau này sang Trung đoàn phải thi dịch cái này. Học dịch mã lâu có thể sau này cần phải dịch không cần bảng tra. Nghe cũng khủng khiếp đấy!",
      "Chuẩn bị vào ca gác thôi, hôm nay gác từ 23h - 0h."
    ],
    signature: "Thứ 3, 22:49",
    ps: [
      "Dịch mã là dịch chữ ra số và ngược lại. Bất kỳ đoạn văn nào đều có thể chuyển sang một đoạn mã số",
      "Sau này quen rồi thì dịch vẫn cần phải dùng bảng tra, chỉ là quen rồi thì mắt đảo nhanh hơn:)"
    ]
  },
  {
    id: "ch-45",
    title: "Chuyện phiếm (3)",
    intro: [
      "Chiều qua ngủ dậy đột nhiên gặp Toản trong phòng. Mắt chữ O mất một lúc. Lẽ ra giờ này đang ở trên trường quân sự học at. Hóa ra trên đó mới khám sức khỏe, Toản không đạt tiêu chuẩn nên bị đổi người mới. Giờ về đây lại sang c3, bên hỏa lực với thông tin thì đủ người rồi khó xin sang, lại không quen ai. Thời gian tới mệt đây!",
      "Mới có mấy tháng đã thấy chán rồi. Đúng hơn là sau tân binh. Lúc tân binh đông người, lúc nào cũng thấy tiếng ra tiếng vào vui tai. Giờ cả trung đội chỉ hơn chục người, lại chủ yếu là người mới, chưa quen hẳn. Tự dưng nghĩ làm sao để gắn bó ở đây trong thời gian dài thế, phải có 1 thứ niềm vui gì đó để mình quên đi cái chán chường và thấy từng ngày có gì đấy ý nghĩa hơn.",
      "Hôm nay quyết định hỏi anh Vĩ để mua máy nghe nhạc mp3. Mua cái mp3 rồi thì trưa với tối lúc đi ngủ muốn nghe lúc nào cũng được, nghe cả tiếng anh được nữa. Đặt trên shopee lúc chiều rồi, đợi máy về thôi!"
    ]
  },
  {
    id: "ch-46",
    title: "Gác trưa (1)",
    intro: [
      "Hôm nay trung đội mất điện chưa sửa được. Trưa nắng như thiêu như đốt mà không có quạt để ngủ. Ngủ thời tiết này thật ác mộng.",
      "Nay mình gác trưa nên có thời gian ngồi viết nhật ký. Độ 5-10 năm nữa mà đọc lại liệu có thấy mấy trang nhật ký này quý giá không? Hết đời mình có thể quên đi nhiều thứ, nhưng thời gian nhập ngũ này chắc khó có thể quên được. Có vào đây trải nghiệm mới thấy trân trọng những ngày tháng được tự do thoải mái. Ra quân rồi nhất định sẽ không để mình quá thoải mái hoặc thoải mái quá lâu. Bởi vì nếu không có những ngày áp lực và mệt nhọc sẽ không thấy những giây phút tự do thật quý giá biết bao nhiêu.",
      "Những ngày nhập ngũ không có nhiều thời gian luyện tiếng anh và học chuyên ngành. Sau này nhất định phải bù đắp lại - gấp nhiều lần!",
      "Dừng bút ở đây thôi, tối nay chắc không có thời gian viết nữa. Còn 30’ nữa hết ca gác."
    ],
    signature: "Chủ nhật, 12:54"
  },
  {
    id: "ch-47",
    title: "Chạy 3000m vũ trang",
    intro: [
      "Sau khi duyệt đội ngũ, trở về đơn vị để học chạy 3000m vũ trang, tức là chạy 3000m có mang theo trang bị và súng. Làm một vòng từ sân bóng lên đập, rồi nghỉ 1 lúc lại chạy từ đập về cổng tiểu đoàn, mệt bở hơi tai. Chỉ chạy 1 lúc nữa thôi là mình có thể gục ngay được. Sau này diễn tập còn mệt hơn như này, nếu không rèn sức khỏe thì sau này không thể thích ứng được với chuyện hành quân."
    ]
  },
  {
    id: "ch-48",
    title: "Chuyện phiếm (4)",
    intro: [
      "Sáng nay đi duyệt đội ngũ để quân khu kiểm tra. Hết hôm nay không cần phải duyệt đội ngũ nữa. Cái này chắc ám ảnh nhất thời tân binh. Về đơn vị rồi lại lên đồi học chuyên ngành để tránh bị kiểm tra. Ngồi trên đồi có khi còn thoải mái hơn ở nhà, chẳng ai nhòm ngó, chỗ học lại mát.",
      "Trưa nay anh Khánh mang đồ ăn lên kèm cả tiền mặt. Đúng là cứu nguy, trong ví còn mỗi 20k. Có bánh kẹo với vải, đỡ bị buồn miệng.",
      "Chiều nay máy nghe nhạc cũng đã tới nơi, rất hợp với ý mình. Kịp copy ít nhạc với mấy bài nghe tiếng anh. Tối nay sẽ bắt đầu trải nghiệm. Háo hức!!!"
    ],
    signature: "Thứ 4, 21:39"
  },
  {
    id: "ch-49",
    title: "Chuyện phiếm (5)",
    intro: [
      "Mấy hôm nay ngày nào trời cũng nắng to. Buổi trưa đi ngủ có quạt trần mà vẫn mướt mát mồ hôi. Dạo này muốn ngủ trưa kinh khủng, chẳng muốn làm thêm việc gì khác. Đặt lưng xuống giường là muốn ngủ ngay thôi, đến tận lúc báo thức.",
      "Tuần trước có thêm 2 người mới đến bTT, một người từ bên phục vụ chuyển sang, bạn của Thành, một người từ c2 sang nhưng đi bệnh xá cả 3 tháng tân binh, giờ được về bTT. Có thêm người mới giờ mình không cần gác tối, đỡ mệt hẳn. Đi tăng gia cũng thêm người. Mà thực tế chỉ thêm 1 người thôi vì người còn lại biên chế nuôi vịt nên ở dưới vận tải suốt.",
      "Lúc gần cuối buổi sáng, trên đường đi sang Trung đoàn cùng anh Vĩ thấy rừng bạch đàn sau tiểu đoàn bị chặt hết. 3 tháng tân binh toàn học bắn súng ở đây, cứ đến giờ nghỉ lại dựa lưng vào gốc bạch đàn, vừa mát vừa thoải mái. Chặt đi rồi thấy có chút hụt hẫng và hoài niệm. 2 năm sau có nhận tân binh chắc sẽ không học bắn súng ở đây nữa."
    ],
    signature: "Thứ 4, 12:26",
    ps: [
      "bTT: Trung đội Thông tin"
    ]
  },
  {
    id: "ch-50",
    title: "Hành quân 15kg",
    intro: [
      "Buổi hành quân thứ 2, lần này vẫn đi 1 vòng lên đập, sang trung đoàn, qua điểm cao 1. Vẫn mang balo quân tư trang như trước nhưng lần này có thêm cuộn dây thông tin. Cả balo chắc tầm khoảng 15kg. Nặng hơn nhưng có vẻ đỡ hơn lần trước, chỉ là bàn chân bị rộp, lúc về gần đến trung đoàn cảm giác có bọng nước đảo qua đảo lại ở lòng bàn chân. Trên đường đi điểm cao 1 có 1 cô mang cho túi vải. Đi đầu chẳng ai cầm, đến mình thì mình đưa tay ra nhận. Có thể mọi người không muốn đang lúc hành quân nặng lại đèo bòng thêm túi vải nữa. Nhưng vải không nhiều, cũng sắp về đến đơn vị rồi, cố 1 chút là được. Lần tới hành quân sẽ có balo riêng và để đất hoặc cát bên trong, chắc sẽ nặng hơn lần này. Nhưng mình đã chuẩn bị tâm lý rồi. Trong này hơn 4 tháng khỏe hơn hồi mới vào nhiều rồi."
    ]
  },
  {
    id: "ch-51",
    title: "Anh Vĩ và anh Chính nghỉ phép",
    intro: [
      "Chiều qua anh Vĩ về nghỉ phép 11 ngày. Đây là lần nghỉ lâu nhất từ trước đến giờ. Hy vọng không có chuyện gì đặc biệt xảy ra.",
      "Hôm nay anh Chính về nghỉ phép 12 ngày. Giờ trung đội chỉ còn anh Hoàn và anh Côn duy trì."
    ],
    ps: [
      "Trung đội mình có 3 tiểu đội trưởng:",
      "Anh Hoàn - aHTĐ (Hữu tuyến điện - học về dải dây hữu tuyến và kết nối với máy điện thoại có dây),",
      "Anh Chính - aVTĐ (Vô tuyến điện - học dịch mã và liên lạc qua máy thông tin không dây)",
      "Anh Côn - aTTvđ (Thông tin vận động - học sử dụng tổng đài để liên lạc với máy thông tin có dây)",
      "Mình được biên chế về tiểu đội vô tuyến điện của anh Chính."
    ]
  },
  {
    id: "ch-52",
    title: "Gác trưa (2)",
    intro: [
      "Hôm nay gác trưa, đúng vào hôm người nhà lên thăm. Khắp nơi chỗ nào cũng thấy người mặc áo dân sự, có già trẻ trai gái đủ cả. Một tuần chỉ được thấy cảnh này một lần. Có người ngoài vào thăm là không khí khác hẳn, chỗ nào cũng thấy cười nói xôn xao tiếng người. Nhưng giờ có cảm giác ít dần rồi, không đông như hồi mới kết thúc tân binh nữa. Đợi mấy tuần nữa gọi Trung với mọi người lên thăm, lâu lắm chưa được ngồi cùng nhau. Bao nhiêu thứ muốn kể, và bao nhiêu thứ muốn hỏi. Không biết mọi người thế nào rồi?"
    ],
    signature: "Chủ nhật, 12:48",
    ps: [
      "Trung là bạn học đại học với mình"
    ]
  },
  {
    id: "ch-53",
    title: "Đại hội sư đoàn (ngày 1)",
    intro: [
      "12h trưa xe county xuất phát từ trung đoàn trở mình với mọi người lên sư đoàn dự đại hội. Xe chở vào trạm khách, đại biểu sẽ ngủ qua đêm ở đây trong thời gian đại hội. Lúc đi mấy anh em không đem theo chiếu vì tưởng phản giống ở d2 không có cũng chẳng sao. Hóa ra là phản tre giống ở nhà. Đặt balo xuống rồi nghỉ một lúc trước khi tập trung và đi bộ sang sư đoàn để dự đại hội trù bị.",
      "Sư đoàn đúng khác xa với trung đoàn, đẹp hơn nhiều. Có cả nhà truyền thống với đài tưởng niệm. Nhà sở chỉ huy có thêm hai khẩu pháo mô hình, bình thường đã tráng lệ lại càng thêm hoành tráng.",
      "Ăn uống ở đây thì khác xa so với ở d2, thức ăn vừa ngon vừa nhiều. Nước tắm thì trong vắt, căng-tin thì nhiều đồ. Tân binh mà ở đây thì đúng là thiên đường. Nhưng điều vui nhất lúc đi đại hội là gặp lại Đạt. Từ lúc Đạt nhập ngũ năm ngoái tới giờ chưa được gặp. Giờ gặp lại nhau thì cả 2 đều đang cùng nhập ngũ. 2 đứa nói chuyện vội vã lúc đến và lúc nghỉ giữa giờ, rồi cả lúc đại hội kết thúc. Gặp lại bạn cũ ở đây thật là sướng."
    ],
    ps: [
      "Đạt là bạn thân từ cuối tiểu học. Từ lúc hắn chuyển vào học cùng lớp với mình thì danh hiệu cao nhất lớp của mình trong mấy năm đã bị đạp đổ:D."
    ]
  },
  {
    id: "ch-54",
    title: "Đại hội sư đoàn (ngày 2)",
    intro: [
      "Khi đại hội kết thúc, vào nhà ăn để ăn cỗ thì vô tình lại gặp thêm Kiên. Biết Kiên được lên Sư đoàn nhưng không biết ở đâu, hóa ra nấu ăn trên này. Người trắng trẻo béo tốt, mà ở đây không béo mới lạ ^^. Thêm cả Đạt nữa, 3 đứa nói chuyện trong lúc mọi người đang ăn cỗ. Kịp nhờ chụp vội một bức ảnh rồi lại chia tay nhau để về trạm khách theo đơn vị. Gặp nhau trong hoàn cảnh này đúng là thú vị.",
      "Buổi chiều sau khi quay lại Sư đoàn để thu dọn trại triển lãm thì cùng mọi người về d2 và bắt đầu với cuộc sống thường nhật ở bTT. Chờ đến cuối tháng sau để lên Quân khu dự đại hội. Trên đó chắc chắn là không thể gặp được bạn cũ nữa rồi."
    ]
  },
  {
    id: "ch-55",
    title: "Hành quân 20kg",
    intro: [
      "Buổi sáng vừa thức dậy, chạy một vòng từ đơn vị lên chân đập rồi quay lại. Buổi chiều chạy 3000m vũ trang, mang theo bao xe, vác súng chạy 10 vòng quanh sân bóng. Buổi tối lại mang theo balo quân tư trang, thêm một cuộn dây hữu tuyến và một quả tạ 5kg đi hành quân, khoảng 8km đường nhiều dốc. Một ngày rèn thể thực liên tục.",
      "Hành quân lần trước chỉ có balo quân tư trang và 1 cuộn dây, lần này mình cho thêm 1 quả tạ 5kg nữa. Cả balo chắc khoảng 20kg, nặng hơn so với lần trước. Đi nhanh mệt hơn nhưng càng về cuối lại càng thấy ổn, có mệt nhưng vẫn có thể bước tiếp. Lần trước gần về đến đơn vị đã thấy rộp nước dưới lòng bàn chân, cảm nhận được bọng nước di chuyển qua lại theo từng bước đi. Lần này từ sớm đã thấy tức lòng bàn chân nhưng về đến tiểu đoàn vẫn chưa thấy nổi bọng nước, mặc dù có cảm thấy đau. Sau này đi diễn tập còn phải mang nặng hơn, còn cần rèn luyện nhiều nữa."
    ]
  },
  {
    id: "ch-56",
    title: "Mưa cả buổi sáng",
    intro: [
      "Trời mưa cả buổi sáng, có thời gian ngồi đọc sách với tám chuyện. Buổi chiều tiểu đoàn học sẵn sàng chiến đấu (SSCĐ), bên mình không có trung trưởng duy trì nên không cần học. Lại được ngồi tám chuyện với đọc sách. Một ngày thứ 6 yên bình. Ngày mai đi dã ngoại ngoài đơn vị. Cảm thấy háo hức."
    ],
    signature: "Thứ 6, 21:40"
  },
  {
    id: "ch-57",
    title: "Dã ngoại (ngày 1)",
    intro: [
      "Ăn sáng từ 5h, không tập thể dục để lên đường đi dã ngoại. 4 cáng toàn gỗ với cuốc xẻng, thêm 1 bó lứa. 12 người đi tính cả anh Hoàn. Mình với Việt 1 cặp cáng 2 bó gỗ. Vừa đặt lên vai đã thấy khác biệt hẳn so với những ngày hành quân. Bình thường cho thêm cuộn dây với quả tạ thì tất cả khoảng 20kg hoặc hơn 1 chút. Nhưng lần này vẫn balo đó, không có cuộn dây với tạ, thay bằng cáng gỗ, cứ hai người một cặp. Không biết bao nhiêu kg, chỉ thấy rất nặng, mới đi 1 đoạn thôi đã thấy rã cả vai, phải đảo qua đảo lại suốt. Nặng là một chuyện, không hay cáng đồ trên vai nên chưa quen, cáng tì lên vai vừa đau vừa khó chịu. Đi độ 100m đã thở hổn hển như đi hành quân mấy cây số. May mà có người đổi, cứ đi một đoạn mọi người lại đổi cho nhau, người vác nhẹ sang cáng cho người nặng, người không cáng nặng được lâu thì mang thêm balo cho người cáng khỏe.",
      "Cứ đi và đi như thế, đã qua không biết bao nhiêu con dốc và không đếm nổi đã đổi cho nhau bao nhiêu lần. Nếu có chút gì đó hối hận về chuyện đi lính hay có khao khát muốn trở về nhà, thì rất có thể đây chính là khoảnh khắc ấy. Giây phút đó chắc chẳng có ai yêu nổi chuyện đi lính. Cứ đổi nhau cáng, đứa nào đứa nấy đỏ mặt tía tai, thở không ra hơi, mồ hôi lã chã. Càng đi đường lại càng hẹp và càng lầy. Không đếm nổi đã giẫm lên bao nhiêu vũng nước, bước qua bao nhiêu đoạn suối nhỏ, giày đứa nào cũng ướt sũng. Mát thì mát thật, nhưng hai chân vốn đang nặng nề lại càng thêm nặng chịch. Thứ duy nhất hiện lên trước mắt chỉ có con đường mòn quanh co không thấy điểm đến. Cứ đi và đi, chẳng đứa nào xem giờ, không biết đã đi được bao lâu, và không biết còn bao lâu nữa mới tới. Đến lúc nhìn thấy một nhóm người ngồi cạnh mấy cáng gỗ trên sườn đồi, cả đám mới hô lên “ĐÂY RỒI!!!” Đích đến ở đó và chỉ còn cách một đoạn đường nữa. Dù mỏi vai cũng cố đi vào cho đến nơi. Nhưng chỉ cố được đến nửa sườn đồi, không thể cáng thêm được nữa. Đường bằng đã khó nói chi sườn dốc. Phải nhờ Phụng với Thành cáng hộ thêm một đoạn.",
      "HƠN 10KM!!! Thật không thể tin nổi mình với mọi người đã cáng đống gỗ kia một đoạn xa thế. Giờ bảo làm lại thì chắc chắn không thể. Ngay lúc đầu mà bảo cáng đống gỗ kia hơn 10km mình sẽ nghĩ đấy là chuyện hoang đường.",
      "Đến nơi rồi nhưng chưa ngồi nghỉ được bao lâu lại cáng chỗ gỗ đó sang phía bên kia đồi để đào hầm âm ở đấy. Hầm âm có vết đào sẵn, chỉ khoét cho rõ thêm hoặc đào sâu vào trong cho đủ kích thước. Sau này nếu đi dã ngoại qua đêm thì sẽ ngủ trong đó. Chắc chỉ làm được độ 30’ - 1h thì trời mưa lớn, bên trên có lệnh thu dọn đồ quay về đơn vị. Đứa nào đứa nấy há hốc miệng nhìn nhau, rồi nhìn đống gỗ vừa đặt xuống chưa nóng chỗ. Nhưng may mắn chỉ phải mang balo với cuốc xẻng quay về, còn gỗ thì để lại trên đồi để lần sau đến làm tiếp.",
      "Lúc về chỉ cần cáng cuốc xẻng, người nhẹ tênh. Xung quanh nhìn lạ hoắc, có chỗ mình không biết nó có ở đó dù đã đi qua 1 lần lúc nãy. Hóa ra thứ duy nhất mình để ý lúc đi chỉ là đường đi, không để ý 2 bên lại có nhiều chỗ đẹp thế. Có đoạn còn nhìn sang sân đánh thuốc nổ của trung đoàn mà không biết. Về đến tiểu đoàn, 2 vai với 2 chân mỏi nhừ. Đứa nào đứa nấy ướt sũng vì mồ hôi lẫn cả nước mưa. Có đứa lấm lem cả quần áo vì trượt chân ở sườn dốc. Cởi giày ra chân đứa nào cũng trắng toát vì đi giày ướt cả buổi. Ăn cơm xong cả lũ chẳng ai bảo ai mang quần áo đi tắm, đem theo cả bộ k20 với giày và balo đi giặt giũ.",
      "Nghe bảo mai lại đi dã ngoại tiếp. Chắc để đào nốt chỗ hầm âm hôm nay. Không cần cáng gỗ nhưng vẫn phải cáng cuốc xẻng để đến đó đào. Giờ chỉ nhắc đến cáng thôi đã ám ảnh rồi. 2 vai vẫn còn nhức lắm. Đi ngủ để mai lên đường!"
    ],
    signature: "Thứ 7, 22:09"
  },
  {
    id: "ch-58",
    title: "Dã ngoại (ngày 2)",
    intro: [
      "Vẫn ăn sáng lúc 5h rồi lên đường đi dã ngoại. Lần này chỉ cáng cuốc xẻng nên không nặng nhọc như hôm qua, nhưng vẫn phải đem theo 2 khăn mặt trực chiến để đệm vào vai cho đỡ nhức. 7h đã có mặt tại điểm đến, nhanh hơn nhiều so với 8h30 ngày hôm qua. Nghỉ 1 lúc rồi tiếp tục vào việc, làm nốt hầm âm hôm qua chưa hoàn thiện. Đến 10h30 Khiêm với Minh đem theo 2 xoong chia để đi nhận cơm cho cả đội. Hôm nay ăn trưa và nghỉ trưa tại đây rồi chiều mới về đơn vị. Trong lúc đợi, mấy anh em làm nốt hầm âm và khơi sạch bậc thang, rồi xuống suối rửa tay. Cởi bỏ đôi giày đầy đất rồi xỏ dép lội suối mà sảng khoái cả người. Đến hơn 11h Khiêm với Minh về, cả đội dải tăng ngồi quây quanh nồi cơm ăn ngon lành. Hôm nay ăn cơm thấy ngon hơn mọi hôm. Mà cũng chưa bao giờ hơn chục người lại cùng quây quần ăn cơm cùng nhau như thế. Chắc chỉ có mỗi cái này là giống với dã ngoại thực sự trong tưởng tượng của mình.",
      "Dọn xong, mấy anh em đứa thì mang tăng, đứa lấy áo mưa, tản mỗi đứa 1 nơi để ngủ trưa. Mình với Việt ra ngủ chỗ gốc xoài. Giá mà vào ban đêm thì có thể thoải mái ngắm trời đếm sao, rồi suy nghĩ vẩn vơ như ngày nào đó hồi còn nhỏ, nằm ngoài đồng trông máy bơm, rồi cả những ngày trèo lên nóc bể hóng gió. Tiếc là vào buổi trưa, trời nắng chói mắt và tất nhiên cũng không thấy được sao. Thỉnh thoảng đón một cơn gió trời, làm dịu đi cái nóng giữa trưa trên đỉnh đồi. Lấy 2 chiếc lá che mắt rồi ngủ thiếp đi. Đến lúc có 1 con kiến nào đó đốt nhói một cái vào chân mới choàng tỉnh dậy. Nhìn đồng hồ thì còn 5’ nữa đến giờ báo thức. Ngồi 1 lúc rồi mình với Việt dọn áo với vải mưa ra chỗ anh Côn đợi tập trung đủ đội.",
      "Buổi chiều lại bắt đầu với bậc thang và đường hào. Trời nắng rát, không phải chỗ nào cũng có bóng cây che. Làm 1 lúc đứa nào cũng nhễ nhại mồ hôi. Thấy cô bán nước đến là gọi nhau ra mua liền. Không có nước lọc mà chỉ còn nước ngọt, uống rồi thì lại nhanh khát, cả ngày hôm nay đã uống không biết bao nhiêu lần nước. Chưa hôm nào phải mua đồ uống nhiều như thế. Có bình tông đựng đầy nước lọc mang đi lúc sáng, nhưng chỉ trong nửa tiếng là hết ngay được. Đến 15h30 trời nổi sấm và lất phất mưa. Cả đoàn được lệnh thu trang bị và trở về. Vẫn chưa làm xong, nhất định còn phải quay lại đây ít nhất 1 lần nữa.",
      "Về đến tiểu đoàn, việc đầu tiên mọi người gọi nhau làm luôn là mua đá. Rồi cả đám xúm lại quanh bình nước lọc với bình đá. Cảm giác như đứa nào cũng có khả năng uống hết nửa cái bình nước đó. Hôm nay không tăng gia nhưng vẫn phải đi công tác tiểu đoàn. Nhóm đi nhặt rau, nhóm đi rẫy cỏ. Lúc nhóm rẫy cỏ xong việc và đi tắm thì cũng là lúc bên 12,7mm xếp hàng đi ăn cơm. Còn nhóm nhặt rau thì chưa thấy về. Lúc mình ăn cơm xong đi rửa bát thì đội đó vẫn chưa xong. Đến giờ xem phim, trung đội còn phải cắt thêm 2 người đi làm nốt bể lọc nước dưới nhà tắm.",
      "Có mấy người sốt phải uống paradol. Còn chân với vai thì chẳng có ai cảm thấy bình thường, đứa nào cũng đau nhức cả. Nghe bảo tuần sau vẫn sẽ đi tiếp mấy buổi nữa, bắt đầu từ sáng mai. Chưa chắc chắn, nhưng đứa nào cũng mắt chữ A miệng chữ O. Có lẽ đây là lần rèn luyện khắc nghiệt nhất từ lúc nhập ngũ đến giờ, để chuẩn bị cho đợt diễn tập sắp tới. May mà chưa giặt giày với quần áo dã ngoại, nếu mai còn đi tiếp thì lại mặc tiếp."
    ],
    signature: "Chủ nhật, 21:55"
  },
  {
    id: "ch-59",
    title: "Dã ngoại (ngày 3)",
    intro: [
      "1 tuần chưa viết nhật ký. Mấy hôm nay thèm ngủ trưa quá mà viết lại sợ mất nhiều thời gian, buổi tối thì không có nhiều thời gian mấy. Hôm nay còn thời gian rảnh trước khi vào ca gác, viết mấy dòng không lại quên mất sự kiện của mấy ngày trước.",
      "Đi dã ngoại ngày thứ 3 liên tiếp. Lần này mỗi đứa 1 cuốc hoặc 1 xẻng, không dùng cáng như hôm trước vì mỏi vai. Chia như này ai cũng thoải mái hơn. Đến nơi ai lại vào việc của người nấy. Mình, Phụng, Khiêm lại tiếp tục làm đường hào. Trời nắng quá, làm được 1 lúc thì mấy đứa bảo nhau để lại, rồi tản hết xuống phía bên kia để tránh nắng. Đứa thì đào cùng đội khác, đứa vét bậc, đứa phạt cỏ. Hôm nay Việt với Hoàng đi nhận cơm. Ngồi đợi cơm ai cũng mệt, còn chẳng buồn nhấc mông xuống suối để rửa chân tay, chỉ có mình và Thành đi lội suối, vừa lội vừa đợi Việt với Hoàng về thì bê đồ lên cùng. Cơm đến nơi cũng chẳng buồn tìm chỗ mát, cứ dải dây tăng dưới gốc nhãn rồi bắt đầu ăn. Đứa đứng đứa ngồi, đứa ngồi trong gắp thức ăn cho đứa ngồi ngoài, cứ thế giải quyết nhanh gọn bữa trưa, rồi đứa nào đứa nấy nhanh chóng tìm chỗ ngủ để chiều báo thức sớm.",
      "Buổi chiều nắng dịu hơn buổi trưa, có thể làm tiếp chỗ đường hào lúc sáng. Phụng với Khiêm sếch bị sốt phải nằm nghỉ không làm được. anh Côn có vẻ cũng đang cúm, chỉ giao việc rồi lại ngủ thiếp đi. Lúc trưa có xin mình 2 viên paradol cảm cúm. Mấy đứa bảo nhau làm nhanh rồi nghỉ sớm. Tầm giữa buổi chiều gặp cô bán nước, cô cho mấy viên đá để chườm cho Khiêm với Phụng. Cho mỗi đứa 1 viên paradol hạ sốt còn lại của mình rồi tiếp tục chườm đá. Được 1 lúc thì trời đổ mưa, cả đội tụm hết nhau lại dưới gốc cây nhãn, chăng tăng rồi chăng vải mưa, quây kín hết lại để chắn mưa tạm bợ. Đứa chống, đứa chọc, đứa giữ, lúc dột chỗ này, lúc lại hắt chỗ kia, nhưng vẫn vô tư ngồi buôn chuyện, đủ thứ chuyện trên trời dưới đất. Nếu không đi dã ngoại chắc không có khoảnh khắc đáng nhớ như thế.",
      "Lúc ngớt mưa, cả đoàn được lệnh thu trang bị để trở về. Về đến nhà đứa nào cũng mệt lừ, không phải do vác nặng mà do thời tiết nắng mưa thất thường. Buổi tối có rất nhiều người bị sốt phải sang gặp anh Dung quân y để xin thuốc. Mình cũng sụt sịt cả tối, dùng hết nửa cuộn giấy vệ sinh. Và thứ mọi người đợi chờ nhiều nhất cả buổi cuối cùng cũng đến, là thông báo triển khai công việc ngày mai. Ngày mai chỉ huấn luyện theo kế hoạch, không đi dã ngoại nữa. Cả đám mở cờ trong bụng. Nếu đi tiếp chắc gục hết cả trung đội.",
      "Chiều nay anh Vĩ lên, mọi thứ lại trở về như lúc ban đầu."
    ]
  },
  {
    id: "ch-60",
    title: "Bắt đầu sốt",
    intro: [
      "Sáng sớm nay mình mới bắt đầu bị sốt, cả người nóng rực không ngủ được. Buổi sáng lúc báo thức cả người mệt lừ. Cố nhấc người dậy dọn vệ sinh rồi sang phòng anh Vĩ viết sổ để nộp. Sau đấy xin sang phòng quân y nằm ngủ. Uống 2 viên paradol hạ sốt mà người vẫn không đỡ đi mấy. Thuốc sốt tối qua a Dung cho trung đội dùng hết rồi. Cả ngày toàn thân rệu rã, người nóng bừng, không muốn ăn cơm. Tối nay đến lịch đi hành quân. Mình mệt quá rồi, có khi đứng lâu còn không đứng được, nên xin nghỉ ở nhà. Ăn tạm bánh mì rồi uống liều thuốc sốt của anh Vĩ cho. In cố 2 quyển giáo án rồi lên giường ngủ luôn chẳng biết giời đất gì nữa. Ngủ ngon lành đến sáng hôm sau."
    ]
  },
  {
    id: "ch-61",
    title: "Minh với Phụng chuyển sang c1",
    intro: [
      "Buổi sáng đang ngồi học thì anh Tú bên c1 sang nhận người. Minh với Phụng bị chuyển đi, thay bằng 1 người hội thao với Kim ruồi ở b2 cũ. 2 người nhanh nhẹn làm được việc thì lại bị đẩy đi, nhưng chỉ có 1 người chuyển về. Người đi hội thao kia chỉ có tên trong danh sách mà người không ở đây. Vừa buồn vừa thất vọng. Tiếc cho Phụng vô cùng! 1 tháng rưỡi sau biên chế rồi mà bây giờ vẫn còn chuyển qua chuyển lại."
    ]
  },
  {
    id: "ch-62",
    title: "Hành quân 20kg & chia tay đội dân vận",
    intro: [
      "Buổi sáng đội đi dân vận lên đường vào khu Z để làm đường. 98 người đi, 2 xe county chờ sẵn. Trung mình có Thành đi vì mỗi Thành biết xây. Tối hôm trước copy cho cu cậu một loạt nhạc vào thẻ nhớ, thấy cu cậu hài lòng lắm. Đi 2 tuần chắc sẽ mệt nhưng nhất định là vui với thoải mái hơn. Mà lại có thêm kỷ niệm để nhớ, chứ ở lại đây cũng chỉ quanh đi quẩn lại những công việc cũ và những địa điểm cũ.",
      "Buổi tối đi hành quân. Người chưa khỏe hẳn sau đợt ốm nhưng vẫn quyết định đi. Lần này cả trung đội đi bao đất không dưới 20kg. Balo của mình đem cân thử được 21,5kg. Cùng là 20kg nhưng so với quân tư trang thì đất có cảm giác nặng hơn nhiều. Chỉ đeo lên vai và đứng 1 lúc thôi đã phải gồng lên rồi, chưa nói đến chuyện phải đi cả tiếng đồng hồ. Lần này đi chiều ngược lại so với mọi lần. Leo lên dốc nhiều hơn và dài hơn, đặc biệt là con dốc thách thức nhất, dài phải mấy trăm mét, càng đến gần thì lại càng dốc.",
      "Nếu muốn biết cảm giác tuyệt vọng thì nhất định phải đeo balo đất 20kg hành quân lên đoạn dốc này. Đứa nào đứa nấy thở hổn hển, chẳng ai còn sức nói với nhau câu nào, gồng hết sức mà đi lên. Lúc lên đến đỉnh dốc mà tưởng như hết hơi, nhưng vẫn phải lấy lại hơi thở và tinh thần rồi bước tiếp. Cái khắc nghiệt của những lần hành quân là không được nghỉ dọc đường, và phải giữ tốc độ để bám với người đằng trước. Không cần biết người mệt như thế nào, vẫn phải gồng mình mà đi tiếp. Về đến tiểu đoàn, hạ được cái balo xuống mà như trút bỏ được cả thế giới đang ghì trên vai, cả người nhẹ tênh. Lần đầu hành quân balo đất đúng là trải nghiệm đáng nhớ."
    ],
    signature: "Thứ 7, 20:29"
  },
  {
    id: "ch-63",
    title: "Anh Khánh lên thăm",
    intro: [
      "Hình như có duyên với gác trưa ngày chủ nhật. Tuần này vắng người thăm hẳn. Một phần do gần 100 người đi dân vận, một phần do được thăm cách đây 3 tháng hơn rồi nên cũng ít người đến.",
      "Sáng nay anh Khánh lên thăm, mang cho mình ít bánh với ít đồ. Lần nào gửi đồ lên cũng phải cả bao, toàn bánh kẹo. Có bánh mì chả với vịt quay, gọi cả Nghiêm ra ăn cùng. Phải gần 4 tháng từ lúc anh Khánh được vào bên trong tiểu đoàn và ngồi nói chuyện như này. Mọi lần chỉ mang đồ lên rồi lại quay về, chỉ kịp chào rồi hỏi thăm mấy câu lại đi. Có lần thì chưa được thăm, có lần thì vào giữa tuần không được thăm, rồi có lần lại bận.",
      "Hơn 6h sáng anh Khánh đi từ nhà, hơn 8h đã đến gần đây để mua lương khô với sổ cho mình, hơn 9h có người vào gọi ra. Chỉ ngồi nói chuyện với nhau đến hơn 10h anh Khánh phải về đón chị Ngàn về quê viếng đám ma. Bà Chi mới mất tối qua! Gần nửa năm rồi chưa gặp bà, giờ không còn được gặp nữa. “Khách đến nhà không gà thì vịt”. Ngày trước sang nhà mình chơi bà hay đùa như thế. Hồi bé cứ có quả chuối với cái bánh lại mang sang cho mình. Giờ bà đang ở thế giới bên kia, nhất định sẽ có cuộc sống tốt và vui tươi.",
      "Một tuần nữa lại sắp qua, tuần sau vẫn là tuần huấn luyện đệm, chắc sẽ còn hành quân với dã ngoại nhiều. Còn điều gì chờ đợi mình tuần tới nữa không đây!"
    ],
    signature: "Chủ nhật, 12:39"
  },
  {
    id: "ch-64",
    title: "Hành trú quân (ngày 1)",
    intro: [
      "Hôm nay cả trung đoàn hành quân ra điểm cao 2 ăn ngủ qua đêm rồi chiều mai về. Cả trung đoàn học về chuyển trạng thái SSCĐ. Từ sáng đã rục rịch xếp balo, nhận gạo, nhận đạn, làm bàn giao để buổi chiều xuất phát sớm. 12h45 báo thức, 13h xuất phát sang trung đoàn. Chỉ mang tăng võng bạt với bộ quần áo cộc, còn lại để hết trong balo k20 và đem theo balo hành quân. Lần này đi có thêm 1 cuộn dây, bao xe, phòng hóa, tượng gạo, 2 súng AK (cầm hộ cả cho đội đi trước từ sáng nay). Tổng lại chắc cũng tầm 25kg, chỉ nặng hơn không nhiều so với balo đất hành quân. Nhưng đồ đạc nhiều, cái vắt cổ, cái quàng vai, tất cả đồ ghì vai xuống, cảm giác khó chịu hơn nhiều so với balo hành quân. Chỉ đi 1 đoạn đã thấy mệt rã người, gồng hết mình mới đến được trung đoàn.",
      "Đến trung đoàn được nghỉ 1 lúc rồi bắt đầu vào tập trung. Mình đi theo bảo đảm thông tin cho c1, Thành c2, Lương c3. Chỉ còn 2 máy 811S Thành với Lương cầm đi, còn mình thì phải mượn anh Cầm, đại trưởng của c1, vì các đại đội đều được biên chế máy vô tuyến. Mới đi từ sân vận động trung đoàn đến nhà ăn trực thuộc đã mệt bở hơi tai, phải hạ balo xuống rồi uống nước. Qua trung đoàn được 1 lúc, đến vườn bưởi cả đoàn ngồi nghỉ, đúng là không khác gì con đang khóc được mẹ cho bú. Hạ máy, súng với balo rồi ngồi phệt luôn xuống đất thở hổn hển, lấy ngay bình tông để uống nước. Mệt chóng cả mặt, mắt dính chặt vào nhau. Nếu được nằm trên giường chắc mình có thể ngủ đến sáng mai. Ngồi được 20’ lại tiếp tục lên đường. Cũng hồi lại nhiều và có thể đi tiếp được. Dọc đường mình đổi sang máy 812/A của anh Chính vì máy anh Chính bị hỏng không nghe thấy gì. anh Chính dùng máy mình để liên lạc với trung đoàn, rồi mượn thêm máy thứ 2 của anh Cầm để đổi tần số liên lạc với tiểu đoàn. Máy mình đang cầm không nghe gọi được coi như bỏ đó, và chỉ đèo bòng theo vậy mà đi.",
      "Đi hành quân bao nhiêu lần, đi ngược đi xuôi đủ cả nhưng chẳng mệt bằng lần đi này. Đến đoạn suối anh Cầm cho bạn sắp ngất tạt vào bên dìa để nghỉ, mình không đứng thêm được nữa, cũng phải ngồi bệt ngay xuống đất, vẫn đeo cả súng với balo trên người. Nhìn nước suối chảy trong vắt, nhưng chẳng buồn ngồi dậy để lấy nước rửa mặt. Nghỉ một lúc lại tiếp tục hành trình. Lúc đến khu vực đóng quân của c1, hệ thống hầm hào sâu tít bên trong, lên dốc rồi lại xuống rồi lại lên không biết bao nhiêu nhịp. Mình đi theo tiểu đội hỏa lực ở mãi tít phía trên cao nữa, bậc thang dài tít tắp. Nghỉ 1 lúc, uống cạn chai nước vừa mua rồi mà mới chỉ đi đến đoạn dốc. Phải bỏ lại 2 khẩu súng với máy A nhờ người đang ở lại trông giùm, chỉ đeo balo lết theo người dẫn đường lên chỗ hầm giao ban trên đỉnh đồi, rồi lại đi lượt nữa xuống lấy đồ. Trên hầm giao ban anh Cầm đang ngồi nghỉ.",
      "Bên c1 còn phải dựng cọc, chăng mái, làm bậc thang với đường hào. Bên trung đội mình thì làm xong rồi, không biết tối nay bên đó còn làm gì nữa không. Còn bên này đến tận bây giờ vẫn còn làm, gần 11 rưỡi đêm đến nơi rồi. Mình chỉ phụ mấy việc nhẹ còn chủ yếu ngồi trực máy. Lúc chiều anh Côn với Khoa dải dây từ tổng đài sang đây rồi lắp máy điện thoại. Chưa dùng cái này bao giờ nhưng nom cũng không quá khó, cũng liên lạc được mấy lần với bên tổng đài. Trên đường quay lại bTT, anh Côn với Khoa giúp mình mang 2 khẩu súng và máy A về trung đội ở quả đồi khác.",
      "Đêm nay mình ngủ luôn ở hầm nhà giao ban để trực máy luôn. Chuẩn bị đi ngủ thôi. Nghe anh Cầm bảo mai 4h báo thức.",
      "Vừa viết đến đây thì có tiếng bên dưới vọng lên, báo tất cả phải chuyển sang bên trung đội 1 dưới lưng đồi để ngủ. Cách đây 1 lúc anh y tá của c1 đi tắm bị rắn cắn, phải đưa đi viện cấp cứu. Vì thế cả đại đội phải di chuyển ra phía bên ngoài. 0h kém thu dọn xong đồ đạc cùng mọi người chuyển chỗ. Vừa đến nơi, người giá súng, người mắc tăng võng, người ra người vào, tiếng qua tiếng lại, nhộn nhịp cả vùng đồi, chỗ nào cũng thấy ánh đèn soi. Cho anh Huy mượn võng, còn mình thì chui vào hầm âm gần nhất để ngủ. Lúc mắc xong màn, đặt lưng nằm xuống thì đồng hồ hiện 00:30. Nằm trằn trọc mãi, vừa tiếng người vừa chỗ ngủ lạ, mãi hơn tiếng sau mới ngủ được. Kết thúc 1 ngày vừa mệt vừa nhiều biến cố."
    ],
    ps: [
      "Trong trung đội Thông tin, chỉ có đội vô tuyến điện là đi theo bảo đảm thông tin và sinh hoạt cùng các đại đội khác. Còn đội hữu tuyến điện thì dải dây thông tin rồi quay lại sinh hoạt cùng trung đội. Thế nên trung đội mình cũng có 1 khu vực hầm riêng."
    ]
  },
  {
    id: "ch-65",
    title: "Hành trú quân (ngày 2)",
    intro: [
      "Buổi sáng 4h, anh trung trưởng trung 1 gọi mọi người dậy đúng như kế hoạch hôm qua. Mình ngồi dậy thu dọn màn và mặc tác phong xong xuôi vẫn còn người nằm cố. Có người chạy từ võng vào hầm âm để đỡ phải dậy ngay. Trùng trình đến tận hơn 5h mới có người đi nhận cơm. Dậy từ sớm mà chẳng bằng dậy từ 4h30 như mọi khi. Ăn sáng xong đội hỏa lực lại vác súng trở về khu đồi chỉ huy, tiếp tục những công việc còn dang dở. Mình được giao lấy dây leo rừng quấn quanh cột để ngụy trang, rồi sau đó bào phẳng phòng giao ban.",
      "Đến 11h anh Huy lên báo thu dọn đồ đạc để chuẩn bị về đơn vị. Đúng mắt chữ O miệng chữ A. Mọi thứ đều bất ngờ đáng kinh ngạc. Ai cũng thu dọn đồ đạc trong tình trạng mệt mỏi. Lết ra đến ngoài, việc đầu tiên là mua 1 chai nước cam, đứng uống sạch rồi mới đi tiếp. Sau đấy là 1 cốc chè. Trời nắng rát, nhìn mặt ai cũng đỏ bừng, mồ hôi nhễ nhại. Ăn được 1 cốc chè đúng là mát lòng mát dạ. Ăn cơm xong chạy liền xuống suối lấy nước uống, tiện rửa luôn đống bát với xoong. Mọi người đi nhận cơm rồi nên mình nhận rửa xoong. Xong xuôi thì dải bạt nằm đánh 1 giấc ngon lành đến hơn 1h. Trên sườn đồi gió mát ngủ chẳng biết giờ đất là gì. Lúc tỉnh dậy thấy cô Hà bán nước đang ngồi ở đỉnh đồi, mua ngay 1 cốc chè ăn tiếp. Đi hành trú quân nhiều, thứ động lực duy nhất của mình chắc chỉ có cốc chè này thôi. Thơm, nhiều nhân, ngọt, mát, thứ chè ăn rồi là chẳng muốn quên. Mà sao mình ăn được khỏe thế!",
      "Đến 14h mọi người ngủ dậy mang xẻng cuốc đi lấp hầm âm, dỡ cột với bạt, mình ở lại giúp mọi người thu tăng võng. Xong xuôi mọi việc, được ngồi nghỉ đến hơn 15h mới bắt đầu xuất phát. Đến đoạn suối lại tạt vào bên trong ngồi nghỉ tiếp. 1 lúc lâu sau, chẳng để ý mấy giờ, mới bắt đầu di chuyển đến cầu tập trung. Khiêm chạy từ cầu vào trong suối để đưa cho mình súng và máy S. Anh Chính để thêm 1 quả pin để dự phòng mà vào đúng quả pin còn 1 vạch. Lúc mang xuống suối chưa kịp liên lạc đã hết sạch. Ra đến cầu, mình ra chỗ anh Cầm để tiếp tục đảm bảo liên lạc. Quá trình hành quân về đơn vị bắt đầu.",
      "Ở chiều về bước đi chậm hơn, balo với trang bị ghì chặt trên vai, cảm giác uể oải hơn chiều đi. Được nghỉ dọc đường nhưng chỉ được độ 2’ chẳng thấm vào đâu, còn làm mệt hơn. Trên đường đi gặp mấy người bị ngất với căng cơ. Còn mình, cảm giác có thể đổ gục bất cứ lúc nào. Mệt rã rời mà vẫn cố nhấc chân lên mà bước. Mệt đến mức chỉ cần đi lên 1 đoạn dốc thoải thôi cũng cảm giác cả người đang nặng xuống, phải cúi người gồng sức mà tiến lên. Về đến tiểu đoàn, đặt được balo xuống, cả người nhẹ tênh, tu hết chỗ nước còn lại trong bình tông, mặc kệ mồ hôi đang chảy từng hàng từ trên trán và trên má xuống.",
      "Lúc đầu vẫn nghĩ hành quân là thứ mệt nhọc nhất, nhưng hành trú quân còn mệt hơn thế. Nghe nói sau này diễn tập còn mệt hơn cả hành trú quân nữa. Thích nghi và cố gắng!"
    ],
    signature: "Thứ 6, 22:11"
  },
  {
    id: "ch-66",
    title: "Chuẩn bị cho SSCĐ",
    intro: [
      "Có 10 ngày chưa viết nhật ký mà như bỏ cả tháng rồi. Hơn tuần này cứ rục rịch chuẩn bị luyện tập trực chiến. Vì tháng này cả trung đoàn trực chiến cho bộ và quân khu. Tuần trước cứ liên tục báo động di chuyển, phải đeo balo cùng vũ khí trang bị (VKTB) sang trung đoàn để kiểm tra. Hết trung đoàn lại đến sư đoàn. Mỗi lần kiểm tra lại lẽo đẽo chuẩn bị đồ gói buộc với trang bị. Hết chuẩn bị đồ lại học tích kê sẵn sàng chiến đấu (SSCĐ) với tên thủ trưởng, chẳng có tối nào trung đội được ngủ sớm, đặc biệt là tuần vừa rồi, vì còn phải ngồi ôn tích kê. Chú Minh còn phải thốt lên, chú ở đây 10 năm rồi mà chưa thấy năm nào báo động di chuyển trong trực chiến lại nhiều với mệt như năm nay.",
      "Hôm nay Bộ kiểm tra công tác SSCĐ của trung đoàn. Lịch dự kiến là buổi chiều, từ sáng đã rục rịch đi cài tần số máy VTĐ ở các cBB với hỏa lực. Còn chuẩn bị cả tượng gạo với cuốc xẻng. Trưa nay đến lượt mình gác. Lúi húi dọn phòng anh Vĩ với chuẩn bị balo cũng hơn 12h. Ngồi khoảng 30’ đến 12h45 mình gọi mọi người dậy mặc tác phong để tư thế sẵn sàng chờ báo động.",
      "Cuối cùng chỉ báo động mỗi d3 bên trung đoàn, bên mình ngồi cả buổi ở hiên. Mặc dù hơi có chút cảm giác lạ lạ khó tả vì bao nhiêu hôm luyện tập lại không kiểm tra, nhưng cũng đỡ hơn là phải đèo bòng cả đống đồ sang trung đoàn tập trung. Hết ngày hôm nay coi như được thoải mái tư tưởng trong 1 thời gian. Sắp diễn tập rồi thì cũng sắp phải rèn thể lực rồi."
    ],
    signature: "Thứ 2, 21:39"
  },
  {
    id: "ch-67",
    title: "Công tác trung đoàn",
    intro: [
      "Nay sang công tác cho anh Đạo bên Trung đoàn. Sang gõ nốt mấy mẫu biểu còn lại hôm chủ nhật chưa làm xong. Đúng hôm học chính trị, cứ tưởng được xả hơi, ai mà dè đi nguyên cả ngày.",
      "Buổi trưa lúc nói chuyện với anh Vĩ, anh Vĩ bảo phải hỏi rõ anh Đạo xem có muốn mình sang làm hẳn không để còn biết chừng. Có thể có trường hợp cắt hẳn mình sang trung đoàn, ăn ngủ bên đó dù quân số vẫn bên thông tin giống như 2 trường hợp hội thao. Từ hồi anh Vĩ về phép mình có sang giúp anh Đạo sửa file excel 1 lần nên có việc gì liên quan đến máy tính lại gọi mình, thế nên anh Vĩ mới sợ mình bị đưa hẳn sang kia luôn.",
      "Buổi chiều anh Đạo không có ở phòng, mình ngồi làm đến 17h xong cái quy hoạch thì để lại tờ giấy ghi chú rồi về. anh Đạo không có ở đó không hỏi được, mà thực ra mình cũng không muốn hỏi. Vì lúc có người hỏi anh Đạo sao không lấy người trong trung đoàn mà lại lấy người xa thế, thì anh Đạo bảo chỉ thỉnh thoảng mới nhờ. Nên mình nghĩ chuyện chuyển hẳn sang bên kia là không thể."
    ]
  },
  {
    id: "ch-68",
    title: "Trồng rau đến 22h",
    intro: [
      "Nay cả trung đội được huy động xuống vườn tăng gia để trồng rau cải. Luống đã làm xong từ hôm qua nên chỉ việc trồng, nhưng cũng lâu không tưởng. Trồng là một chuyện, còn phải chặt cọc, đóng cọc, buộc dây dứa, cắt bạt, rồi chăng bạt để che nắng. Còn phải huy động cả bên 12,7mm xuống trồng cùng mà phải đến 22h kém mới trồng xong cơ bản. Lúc đó mới đi tắm rồi ăn cơm. Chắc đây là lần ăn cơm tối muộn nhất từ lúc nhập ngũ tới giờ, và có thể cũng là bữa mình ăn nhiều nhất ở d2! Trước lúc trung đội lên, anh Hoàn đã mua mì tôm rồi gửi nhà bếp để úp hộ vào nước canh nóng. Vừa mệt vừa đói, 1 bàn úp tới 7 gói mì mà 5 đứa ăn vẫn hết nhẵn, mà đứa nào cũng ăn trước 1 bát cơm đầy để chờ cho mì với rau chín. Ăn xong đứa nào cũng thấy thoải mái, vào phòng mắc màn rồi đi ngủ ngay.",
      "Làm xong muộn, ăn cơm muộn nhưng lại thấy vui vì làm chung với cả trung đội, lúc nào cũng rộn rã tiếng người và cả những tiếng cười!"
    ],
    ps: [
      "Ở bên ngoài, mì tôm thường là lựa chọn cuối cùng trong thực đơn. Nhưng ở trong này, mì tôm úp chính là 1 loại mỹ vị nhân gian."
    ]
  },
  {
    id: "ch-69",
    title: "Lần đầu đi bảo đảm thao trường",
    intro: [
      "Lần đầu đi bảo đảm thông tin cho đợt kiểm tra bắn đạn thật của tiểu đoàn. Từ trưa đi thu hồi 1 máy bên c2 và 2 máy bên c1 để đủ 5 máy chiều nay mang đi bảo đảm. Có 4 vọng, mỗi vọng có 1 VTĐ và 1 HTĐ canh gác để đảm bảo báo cáo kịp thời khi có thủ trưởng đến và chắc chắn không để người dân đi lên thao trường bắn. Mình với Mừng nổ vọng 1 ngay cổng vào điểm cao 1, Thành với Việt vọng 2 ngay điểm cao 3, Khiêm với Tấn bê vọng 3, Lương với anh Hoàn vọng 4.",
      "Vọng 1 ngay cổng dù có buồn ngủ cũng không dám ngủ vì thủ trưởng sẽ đi lên trường bắn qua lối này. Ngồi vọng này mới biết chỉ cần nhận được xe ô tô với tiết thôi cũng giúp ích rất lớn cho việc nhận biết thủ trưởng. Cần phải chú ý và luyện tập nhiều! Chiều nay mình với Mừng không để ý, để cho cô Hà bán nước đi vào thao trường. Dù Mừng kịp chạy lên gọi cô Hà xuống nhưng cũng đáng bị khiển trách. Vì đây là buổi đầu bảo đảm nên mọi thứ đều nhẹ nhàng. Các buổi tới cần rút kinh nghiệm."
    ],
    signature: "Thứ 5, 21:54",
    ps: [
      "HTĐ: Hữu tuyến điện",
      "VTĐ: Vô tuyến điện"
    ]
  },
  {
    id: "ch-70",
    title: "Mưa cả ngày (2)",
    intro: [
      "Một ngày chủ nhật mưa gió, gần như ở trong phòng cả ngày. Cuối buổi sáng với chiều trời tạnh thì đi làm ít việc lặt vặt, còn lại có nhiều thời gian cho bản thân. Rảnh ngồi nghe tiếng anh với đọc sách. Hiếm khi trời mưa cả ngày, nếu không đã phải đi làm bao nhiêu thứ. Lần đầu có cảm giác tận hưởng ngày nghỉ thật sự."
    ],
    signature: "Chủ nhật, 21:30",
    ps: [
      "Đi lính rất thích trời mưa. Mọi người hay rêu rao “nắng tốt dưa, mưa tốt lính”. Trời mưa vừa không phải tưới rau, vừa không phải đi thao trường, cũng không phải đi làm."
    ]
  },
  {
    id: "ch-71",
    title: "Đại hội Quân khu (ngày 1)",
    intro: [
      "Bỏ bê quyển nhật ký lâu quá rồi. Tối nay là ngày lễ, cả trung đội đi xem phim hết, mình cũng không có nhiều việc để làm, ngồi ghi lại mấy dòng để sau này đọc lại mà nhớ.",
      "Dậy từ sáng sớm để gói ghém chăn màn với chiếu, cùng anh Tài đi dự đại hội quân khu. Xe xuất phát từ trung đoàn lúc 5h sáng, dừng ở sư đoàn lúc 6h kém 15 để hội quân. Đủ đại biểu trong sư mới bắt đầu di chuyển lên quân khu ở Thái Nguyên, tầm 6h sáng. Lần thứ 2 được đi ra ngoài đường phố rồi mà lòng vẫn háo hức lắm. Lần này không chỉ tới tỉnh X, còn lên tỉnh Y. Gần 2h đồng hồ chạy xe, được ngủ nhiều và cũng được ngắm nghía nhiều. Đi lính mới hơn nửa năm mà lúc nhìn thấy những dãy nhà san sát nhau vẫn mừng rỡ hết sảy.",
      "Quân khu đúng khác biệt hẳn so với sư đoàn, trạm khách ở 4 người 1 phòng mà có phòng tắm với chỗ phơi đồ ngay phía sau, cảm giác chẳng khác gì ở nhà. Mỗi người được tặng 1 túi quà, bên trong có 1 hũ sứ và 1 tập tài liệu, đựng 1 quyển văn kiện và 1 quyển sổ tay dày bìa cứng, nhìn giống hệt quyển dịch mã điện của mình.",
      "Buổi chiều mới họp phiên trù bị mà 8h sáng đã đến nơi rồi nên có nhiều thời gian nghỉ ngơi. Cơm buổi trưa ngồi theo bàn 7 người như cơm nhà không chia suất. Thức ăn vừa nhiều vừa ngon, hơn hẳn trên sư đoàn. Đi đại hội trên quân khu đúng đã đời. Buổi chiều có xe county đưa đại biểu vào trong nhà văn hóa. Ở đây mọi người không tự đi mà phải có xe của quân khu chở thì mới được qua cổng, chắc để kiểm soát người ra vào. Hội trường mát lạnh, 4 phía đều có camera, 2 bên sân khấu có 2 màn hình lớn chiếu hình từ camera, ai đang ngáp ngủ là biết liền.",
      "Hết phiên trù bị mọi người về phòng tắm rửa, đi ăn tối, rồi lại tập trung để sang sân vận động xem dạ hội. Quân khu có hẳn 1 bộ phận văn công để biểu diễn trong những dịp lễ hoặc hội họp như thế này. Khá chuyên nghiệp và khá cuốn. Cuối dạ hội có màn đốt lửa trại, lâu lắm không được thấy cảnh này. Tự nhiên làm mình nhớ buổi đốt lửa trại ở hội trường dưới quê hồi mới thi xong đại học.",
      "Một ngày đi đại hội để lại nhiều thứ mới mẻ và những trải nghiệm thú vị."
    ],
    ps: [
      "Anh Tài là Chính trị viên phó của Tiểu đoàn"
    ]
  },
  {
    id: "ch-72",
    title: "Đại hội Quân khu (ngày 2)",
    intro: [
      "Ngày đại hội chính thức được gặp nhiều tướng. Có chính ủy, phó chính ủy, tư lệnh và phó tư lệnh quân khu. Không phải lúc nào cũng có cơ hội hiếm hoi như thế này.",
      "Không giống ở sư đoàn, đại hội ở đây kéo dài cả ngày, nên buổi sáng và chiều đều được ăn buffet, tha hồ tận hưởng bánh với sữa và hoa quả. Đi đại hội chắc thích nhất cái này.",
      "Cả ngày đại hội trời mưa suốt, thấy bảo đang trong cơn bão số 3. Lúc kết thúc thì vào tầm 5h chiều, xe chở đoàn quay về trạm khách sư đoàn để nghỉ qua đêm, đợi đến hôm sau thì về cùng đội thu trại của trung đoàn. Tối được ăn mì xào vì không có cơm hộp. Vị không ấn tượng lắm nhưng là một trải nghiệm mới vì ăn cơm lính được hơn nửa năm rồi. Về trạm khách sư đoàn lần thứ 2 nên cảm thấy rất thân thuộc. 2 tháng mới quay trở lại, mọi thứ vẫn vậy không có gì thay đổi."
    ]
  },
  {
    id: "ch-73",
    title: "Bắt điện thoại",
    intro: [
      "Buổi trưa về đến d2 thì anh Vĩ đã về tranh thủ rồi. Thấy mọi người kể mình đi đúng lúc tiểu đoàn kiểm tra sổ sách với giáo án, anh Vĩ mấy hôm không dám đi đâu cứ ở trong phòng làm giáo án. anh Minh gọi đi uống nước cũng không đi. Lần đầu tiên anh Vĩ về tranh thủ mà không đem theo laptop về, còn khoe với mình in giáo án xong rồi, có dùng gì laptop thì bỏ ra dùng.",
      "Buổi tối định gọi về nhà thì anh Hoàn bị anh Tài bắt điện thoại. Lúc đó đại phó đang ở trong phòng anh Vĩ chuẩn bị đi ngủ. Vì không có trung trưởng nên đại phó sang ngủ phòng anh Vĩ để duy trì trung đội. anh Tài bắt điện thoại anh Hoàn xong thì báo động cả trung đội ra ngoài tập trung. Đại phó ở ngoài kiểm tra người, còn anh Tài ở bên trong khám balo với tìm các ngóc ngách. Thấy có thêm điện thoại của Khoa. aHTĐ phải sinh hoạt đến 12h đêm. Anh Vĩ vừa về đã đầy sóng gió như vậy."
    ],
    ps: [
      "aHTĐ: Tiểu đội Hữu tuyến điện"
    ]
  },
  {
    id: "ch-74",
    title: "Cỗ 2/9",
    intro: [
      "Hôm nay là ngày lễ, toàn quân được ăn cỗ. Từ sáng đã mang ghế sang trung đoàn xem chơi thể thao. Nói là ngày lễ nhưng thực ra không có quá nhiều thời gian cho riêng mình, mọi thứ đều được lên lịch cả rồi. Cỗ hôm nay hơi thất vọng vì không ngon như những lần trước. Chỉ khác hơn so với ngày thường là được bày ra đĩa, số lượng nhiều hơn và có nước ngọt.",
      "Nhưng điều thích nhất ngày lễ là cảm thấy thoải mái hơn, làm ít hơn hẳn mọi ngày. Ngày mai được ăn thêm một ngày cỗ như hôm nay nữa."
    ],
    signature: "Thứ 6, 20:58"
  },
  {
    id: "ch-75",
    title: "Diễn tập cấp tiểu đội (ngày 1)",
    intro: [
      "5h sáng 3 cBB và 2 b trực thuộc (bPV và bTT) xuất phát đi diễn tập cấp tiểu đội vào thao trường bắn X. Từ lâu đã nghe kể về sự vất vả của diễn tập. Chiều dài hành quân diễn tập sẽ tăng dần theo cấp độ. Lần này cấp a chỉ khoảng hơn 20km, những lần sau sẽ tăng nhiều hơn. Đợt này là đợt diễn tập đầu tiên, cũng háo hức lắm mặc dù hơi sợ. Không quá lo lắng vì từ hôm trước đã được gửi bạt nằm, dây hữu tuyến, và máy điện thoại vào trước, toàn những thứ nặng nhất. Lại còn không cần mang theo súng với bao xe, vì trung đội mình chỉ đi để đảm bảo thông tin, không cần tham gia bắn.",
      "Lần này vẫn là Lương bảo đảm c3, Thành c2, còn c1 lần này do Khiêm phụ trách, mình thì đi theo trung đội. Đi được 1,5h vào đến trạm nghỉ đầu tiên là một bãi gửi xe ô tô, vẫn còn nhiều chỗ trống. Cũng không quá mệt, trời vẫn chưa nắng gắt. Nghỉ được khoảng 30’ thì cả đoàn xuất phát. Cả chặng đường đi có nhiều đường quốc lộ, có vài đoạn là đường đồng với đường đồi. Nhớ nhất là có một quả đồi siêu dốc, dốc hơn cả điểm cao 1, mà còn là đường đất không phải bê tông, rất khó đi và dễ trượt chân. Chặng đi thứ 2 trời bắt đầu nắng rát hơn, nhưng đường qua đồi với rừng nhiều nên nhiều bóng mát, cảm thấy chuyện hành quân bớt nhọc đi mấy phần.",
      "Đi được khoảng 2h thì vào đến trạm nghỉ thứ 2. Chẳng biết là công ty hay cơ quan nào của tỉnh, thấy rộng hơn trạm nghỉ đầu tiên, có sân vận động, có cả phòng giám đốc và 1 dãy trọ phía sau. Sân rộng và nhiều bóng mát, nghỉ ở đây chẳng chê vào đâu được. Lúc đặt balo với trang bị xuống ai cũng ướt đẫm mồ hôi, nhìn mặt ai cũng uể oải. Nghe bảo thao trường X còn cách chỗ này gần 10km nữa, vẫn còn cả một chặng đường dài đang đợi. Nghỉ được khoảng 30’ thấy có xe Kamaz đỗ tại cổng và trung đội mình được lên trước. Thế là có xe Kamaz chở đi nốt chặng còn lại, không cần phải cuốc bộ hành quân nữa rồi. Ai cũng mừng ra rỡ! Trên xe có bTT, bPV và một phần c1. Sắp được đặt chân đến thao trường X rồi!",
      "Vừa đặt chân xuống X, thứ đầu tiên hiện lên trước mắt là một bãi bắn rộng tít tắp, cảm giác hệt như lần đầu nhìn thấy bãi tập ở điểm cao 1. Ở đây cũng có đài chỉ huy nhưng mục đích chính như một đài quan sát, không bán đồ ăn giống như ở bãi bắn 1. Nhìn xung quanh không có căng-tin, chỉ có nhà ăn và 2 dãy nhà nằm 2 bên. Thấy Đạt kể bán căng-tin ở thao trường này mà nhìn mãi không thấy có. Bảo sao ngoài đường các cô bán nước ngồi một hàng dài đợi người đến, ai cũng đầy giỏ nước với đồ ăn.",
      "Vừa xuống xe, c1 đã cơ động luôn ra bãi bắn để tập bài, còn bên mình thì đi chuẩn bị cột cờ, và dải dây hữu tuyến từ đài chỉ huy sang 2 bãi tạo giả 2 bên. Nhìn ai cũng thấy tất bật cả. 3h chiều nay c1 sẽ bắn thật theo kế hoạch, sáng mai đến c2 và c3. Trung đội mình ăn trưa dưới gốc cây, cả đám ngồi quanh mấy cái nồi với mấy cái nắp đựng thức ăn, cảm giác hệt như hồi ở điểm cao 2. Ăn xong no căng cả bụng.",
      "Tưởng được nghỉ 1 chút buổi trưa mà không phải. Lúc cả đội đông đủ, các vọng gác xuất phát luôn, mình thì ở lại thao trường, ngồi trong đài chỉ huy với anh Vĩ, vọng gác của mình là ở đài chỉ huy. Lúc định hình xong chỗ cắm cờ ở vọng 2 và 3 của Nghệ với Khiêm trên sườn núi thì 13h30, c1 đang ra tập trung, loa đài thì đang được chuẩn bị, mình với anh Vĩ cũng ra theo. C1 tập dượt một lần trước rồi mới bắn thật. Mọi chuyện có vẻ ổn cho đến khi phát hiện ra máy VTĐ bên c1 đang cầm và bên cảnh giới của đội mình đang dùng chung tần số, mà máy bên c1 đang kết nối với loa phát thanh ở đài chỉ huy, giờ mà các vọng gác bên mình liên lạc với nhau thì cả thao trường cùng nghe thấy. Đợi lúc c1 tập dượt xong mình vội vã chạy ngay lên tầng 2 đài chỉ huy, nhờ anh trực ở đó ngắt loa với máy VTĐ để thông báo cho 4 vọng đổi tần số. Nhưng chỉ có mỗi vọng của Khiêm có phản hồi, vọng của Nghệ và Lương không thấy đâu. Thành thì đổi cùng tần số với mình từ lúc chuẩn bị ra bãi tạo giả 1, chỉ là đang loay hoay không biết chỗ vọng 4 với Việt đang ở đâu, và vẫn đang đi tìm. Còn 2 vọng nữa cần đổi tần số. Mình chạy ra chỗ bãi tạo giả 2 của Lương thấy đang tắt máy, bảo sao mình gọi không thấy phản hồi. Còn chỗ của Nghệ ở vọng 3 mãi khe núi, muốn ra tận nơi cũng không được nên đành kệ. Lúc trên đường đi về từ chỗ của Lương thì Thành báo đã tìm thấy Việt, mọi chuyện coi như đã ổn.",
      "Theo kế hoạch là 15h mới bắn thật, nhưng mới 14h c1 đã bắt đầu bắn. Lúc này vấn đề lại xảy ra ở máy HTĐ, do máy điện thoại ở 2 bãi tạo giả không có phản hồi. Chủ nhiệm công binh và thông tin ở đó quát ầm lên, cả tham mưu phó cũng phải gắt theo. Đổi máy điện thoại khác cũng không được, cuối cùng phải mượn máy VTĐ bên c3 để thông liên lạc với 2 bãi tạo giả. Còn máy HTĐ coi như để vậy không dùng đến. Cuối buổi anh Vĩ phải hỏi mượn máy điện thoại bên c17 của anh Khải, và nhờ gửi xe ôm lên để hôm sau thay. Cảnh giới ở vọng đài chỉ huy có thể nói là vọng mệt nhọc nhất.",
      "c1 bắn xong cả đội tập trung trong phòng tầng 1 dưới đài chỉ huy để ngủ qua đêm ở đây. Kiểm tra vật chất xong thì đi tắm rửa và dọn phòng rồi ăn tối. Anh Vĩ có xuống rút kinh nghiệm và giao nhiệm vụ, xong rồi cả đội 14 người ngủ chung trong một phòng đó. Hơi chật nhưng nói chuyện vui quá trời, mình có thể ở mãi như thế được. Đi đảm bảo không cần phải gác nên có thể ngủ ngon lành, để sáng hôm sau dậy sớm tiếp tục công việc."
    ],
    ps: [
      "cBB: Đại đội Bộ binh, b trực thuộc: Trung đội trực thuộc Tiểu đoàn (không qua Đại đội)",
      "bTT: Trung đội Thông tin",
      "bPV: Trung đội Phục vụ (nấu ăn)",
      "HTĐ: Hữu tuyến điện",
      "VTĐ: Vô tuyến điện",
      "Mỗi vọng gác đều có 2 người, một người bên HTĐ và một người bên VTĐ"
    ]
  },
  {
    id: "ch-76",
    title: "Diễn tập cấp tiểu đội (ngày 2)",
    intro: [
      "6h sáng đã bắt đầu bắn. Những sai sót từ hôm trước đã cơ bản được khắc phục nên không có gì nghiêm trọng xảy ra. 2c bắn xong là 9h, trung đoàn phó chỉ đạo 10h cơ động trở về. Cả đội tập trung dọn đồ đạc gửi xe Kamaz, còn người thì đeo balo và đi bộ hành quân theo tiểu đoàn trở về, lần này đi dọc theo đường đồi phía sau thao trường.",
      "Đường trở về chẳng dễ chịu chút nào, nhất là đồi na, đã dốc cao lại còn nhiều gạch đá. Vì đi đường đồi nên đầu hàng với cuối hàng của tiểu đoàn cách nhau hàng km. bTT đi gần cuối, chỉ trước mỗi bPV. Lúc đi đến đỉnh đồi đã thấy đầu hàng vượt qua rừng na dài tít tắp phía dưới. Lúc mình đi đến đường bê tông thì c3 đã gần đến chỗ trạm nghỉ. Lúc nhóm mình đến được trạm nghỉ thì ai nấy đều ướt đẫm mồ hôi, cả người mệt lừ. Lúc chuẩn bị ăn cơm thì trời bắt đầu mưa, mưa khá to. Ăn cơm xong cả đội dựa vào balo mà ngủ, mặc kệ trời có mưa to hay nhỏ, ngủ còn lấy sức để chiều tiếp tục hành quân trở về tiểu đoàn.",
      "Nằm ngủ đến hơn 13h mà trời vẫn không ngớt mưa, cuối cùng tiểu đoàn lại quyết định thuê xe Kamaz để chở cả đoàn về. Hai ngày diễn tập kết thúc ở đó, lại quay về với cuộc sống thường ngày."
    ]
  },
  {
    id: "ch-77",
    title: "Rằm tháng 8",
    intro: [
      "Hôm nay là rằm tháng 8. Buổi tối tiểu đoàn tổ chức đón tết trung thu và sinh nhật cho những ai sinh trong quý 3. Khối trực thuộc tổ chức chung. Cả buổi chỉ có hát hò, ăn bánh kẹo với uống nước ngọt. Những buổi như thế này chỉ sướng những người thích ăn vặt như mình, hẹ hẹ. Hát hò không có gì đặc biệt lắm, nhưng mà có giọng hát của Việt làm mình chú ý. Chất giọng đó hát bài “vẫn nhớ” đúng hợp, nghe rồi không muốn dừng lại. Anh chàng này đúng nhiều tài lẻ, vừa biết sửa điện, biết chơi đàn ghi-ta, còn hát hay nữa."
    ]
  },
  {
    id: "ch-78",
    title: "Việt chuyển sang trung đoàn",
    intro: [
      "Đang kiểm tra sáng thì tiểu đoàn yêu cầu 4 người trung mình lên gặp. Có Việt, Khoa, Lương, Phan đi, không biết có chuyện gì, chắc không phải công tác gì vì chỉ đích danh tên của Phan. Chuẩn bị đi học chính trị thì Lương với Phan quay về, bảo lát nữa sẽ gặp thủ trưởng nào đó, còn Khoa và Việt vẫn đang ngồi đợi trên chòi tiểu đoàn. Học đến nửa buổi thì Khoa quay về bảo sẽ có một người được chọn làm cò cho chú Hán - phó chính ủy e1, có thể là Khoa hoặc Việt, hoặc một trong 3 người bên c2 nữa. Một lúc sau Việt vào lớp và báo anh Hoàn để đi sắp xếp đồ đạc chuyển sang trung đoàn. Lúc này thì chắc chắn Việt đã được chọn và sang e ở luôn dù quân số vẫn ở bTT. Như thế trung mình coi như mất luôn một thợ điện kiêm một tổng đài.",
      "Việt đi đúng buồn, không còn ai suốt ngày réo “A Tường, A Tường” nữa, không có ai tò mò xem mình đang đọc tập giấy tiếng anh gì nữa, cũng không còn ai thảo luận với mình về mấy cái máy mp3 nữa. Buồn quá! Nhưng cu cậu sẽ có cuộc sống nhẹ nhàng hơn khi ở bên đó, không nhiều quy tắc và giới hạn, cũng không nhiều công việc nặng nhọc. Giỏi với chăm như thế nhất định sẽ được trọng dụng và nhiều chế độ."
    ],
    signature: "Thứ 5, 12:31"
  },
  {
    id: "ch-79",
    title: "Anh Khánh đến thăm",
    intro: [
      "1h kém anh Khánh đến thăm. Đến muộn như thế vì đi làm từ tối hôm trước, 6h sáng mới về đến nhà, ngủ được hơn 3 tiếng là đi tắm rồi thăm mình luôn. Đúng nể, đi đường dài không biết mệt. Ra cổng chưa nhìn rõ mặt đã nhận ra liền vì có cả 1 tải bánh kẹo cùng với nước và sữa mẹ chuẩn bị. Hai anh em ngồi nói chuyện đến gần 2h thì anh Khánh về. Chỉ ngồi với nhau được khoảng 1h nhưng cũng thấy ấm lòng. Thấy anh Khánh nghĩ đủ mọi đường để kiếm tiền thêm, làm mình cũng hối hả muốn ra ngoài! Mong thời gian trôi thật nhanh!"
    ]
  },
  {
    id: "ch-80",
    title: "Thực tập chính trị chuyển đến",
    intro: [
      "Đang ngồi học thì đột nhiên thấy có xe county trở 1 đoàn học viên vào tiểu đoàn. Ai cũng đoán già đoán non, người bảo học viên học tiểu trưởng về, người thì bảo thực tập sinh. Ai cũng nhìn nhau tò mò xem có chuyện gì đang xảy ra. Được một lúc thì thấy anh trực ban dẫn 1 anh đeo balo, vai đeo tiết học viên đến trung đội mình và giới thiệu là thực tập chính trị trong 1 tháng. Lần thứ 2 có cảm giác này, vẫn chưa quen lắm, cảm giác trung đội có thêm một trung trưởng thứ 2, trong phòng anh Vĩ lại có thêm một người. Nhưng phải tập quen dần với những cảm giác như thế này.",
      "Anh thực tập tên là Trình, đang học năm 4 trường Sĩ quan Chính trị, về đây thực tập trung trưởng 1 tháng rồi quay lại trường. Hết năm thứ 5 mới đi thực tập chính trị viên 3 tháng giống anh Tú với anh Dương ở c4 ngày trước. Anh Trình khá ít nói mà hay xài nước hoa, bước vào cửa phòng là thấy thơm phức liền. Một ngày tiếp xúc thì thấy anh Trình khá hiền và dễ bắt chuyện, mọi thứ đều tốt đẹp."
    ]
  },
  {
    id: "ch-81",
    title: "Anh Vĩ về phép 10 ngày",
    intro: [
      "Anh Vĩ về nghỉ phép 10 ngày, đến chiều chủ nhật tuần sau mới lên lại. Đúng hôm phải nhập hết rau cải ở vườn dưới rồi làm đất. Sau khi cuốc đất với hót rãnh xong thì trời cũng đã tối om. Cả đội lên tắm rửa, ăn cơm rồi ngồi sinh hoạt. Đến 20h30 thì anh Minh gọi anh Hoàn sang để giao việc. Cả trung đội phải mang cuốc xẻng xuống làm tơi đất và vét bùn ở rãnh, để đề phòng đêm mưa sáng mai không làm được. Cả lũ đứa cuốc, đứa hót, đứa soi đèn, ai cũng lấm lem toàn bùn với đất, đến hơn 22h mới xong. Lúc đó mới lên rửa chân tay rồi đi ngủ, kết thúc một buổi tối thứ 6 không thoải mái lắm.",
      "Có một điều thấy có hy vọng hơn một chút là anh Dinh sẽ phụ trách trung mình trong thời gian anh Vĩ về phép. Không phải anh Quang là thấy vui rồi."
    ]
  },
  {
    id: "ch-82",
    title: "Ngày đầu anh Dinh duy trì",
    intro: [
      "Buổi sáng đang ngồi đợi cắt công tác thì anh Tài gọi lên đưa cho mấy quyển sổ thi đua và bảo mình viết. Phải viết từ 5 tháng trước đến tận bây giờ, mối tuần 2 buổi, tính ra là hơn 40 buổi, còn bảo mình làm xong trong buổi sáng. Máy tính thì chú Minh vẫn thường gọi lên làm hộ excel, giờ sổ sách cũng có anh Tài nhờ, lại thêm anh Đạo bên trung đoàn nữa, giờ không biết mình là cò của ai nữa rồi.",
      "Buổi sáng lúc mình viết sổ thì một nhóm trong trung đội đi chặt cây để nộp tiểu đoàn phục vụ diễn tập, còn lại thì ở nhà củng cố đơn vị và làm đất. Anh Dinh đúng nhiệt tình, lao hẳn vào kho sắp xếp lại cùng với Khiêm, rồi lúc thiếu người thì xuống hẳn vườn để làm đất cùng mọi người. Buổi trưa lúc đội chặt cây về thì mình cũng viết sổ xong, cả nhóm cùng xuống làm cỏ cho xong để trưa đỡ phải xuống làm. Ăn cơm xong thì 12h30, ngủ được 1 tiếng thì đến giờ dậy. Ngày trước ở nhà chỉ ngủ trưa có 30’ đã thấy đủ rồi, còn ở đây được ngủ hẳn 1h mà vẫn thấy thiếu giấc. Phải làm quen dần với chuyện ngủ ít thôi vì sắp sang chế độ mùa đông rồi.",
      "Buổi chiều cả trung đội xuống trồng rau. Trồng xong xuôi và chăng lưới xong thì mới hơn 18h. Ngày trước mà trồng rau toàn đến khuya mới xong, có hôm 22h30 mới được đi tắm để ngủ. Ăn cơm xong mọi người có thời gian ngồi nói chuyện một lúc rồi sang c2 xem phim. Một buổi tối khá yên bình. Mình không đi xem phim, ở trong này viết sổ giao ban rồi ghi nhật ký và gọi điện về cho mẹ."
    ],
    signature: "Thứ 7, 21:34"
  },
  {
    id: "ch-83",
    title: "Học SSCĐ, cảm nhận về anh Dinh",
    intro: [
      "Sáng nay học chuyển trạng thái SSCĐ, cũng là ngày sư đoàn thông báo xuống kiểm tra d2. Từ tối hôm trước cả trung đội đã phải đi quét dọn và củng cố lại đơn bị đến khuya mới được ngủ. Sáng nay gần 5h mới được gọi dậy. Thấy hơi ngạc nhiên vì toàn 4h30 báo thức để dậy đi tưới rau và chạy bao cát. Hóa ra có thông báo kiểm tra nên giờ giấc, chế độ đều chuyển về chính quy. 5h dậy tập thể dục sau đó mới đi làm vệ sinh cá nhân, gấp xếp nội vụ và quét dọn. 5h mới dậy nên không có cảm giác thiếu ngủ như mọi ngày. Đúng là dậy sớm nhiều, chỉ cần một hôm dậy muộn là thấy cả người khoan khoái.",
      "Nói sáng nay học SSCĐ nhưng ngồi ở sân cả buổi để đợi kiểm tra. Nay chỉ huy tiểu đoàn đi từng trung đội để kiểm tra ăn ở chính quy, đồ gì không để đúng quy định sẽ bị thu hết. 3 người đi sau mang theo tải xanh mà cuối buổi tải nào cũng đầy đồ. Kiểm tra xong xuôi và nhận xét xong thì 10h mới bắt đầu báo động chuyển trạng thái SSCĐ. Nhưng chỉ các c thực hiện còn 3b trực thuộc xuống vườn tăng gia củng cố lại. Kết thúc buổi sáng như vậy.",
      "Mấy hôm nay ở cùng anh Dinh thấy đây là một con người cực kỳ tận tụy, việc gì cũng lăn xả và tìm hiểu đến tận cùng vấn đề. Lúc dọn kho thì đi vào dọn cùng với Khiêm, lúc thiếu quân số thì sẵn sàng xuống cuốc đất cùng trung đội. Lúc học bơi thì xem cách bơi từng người để thống kê lỗi, rồi đưa ra cách khắc phục. Lúc rảnh thì xem các video dạy bơi trên youtube để lấy kinh nghiệm, rồi làm thêm cả thiết bị bổ trợ để huấn luyện bơi. Hôm nay học chuyển trạng thái SSCĐ, thì tối hôm trước ngồi liệt kê hết các dụng cụ cần mang theo cho từng kế hoạch và phương án, thậm chí còn đọc và ghi vào sổ các bước chính với khẩu lệnh trong chuyển trạng thái. Có lẽ đây là con người tận tụy trong công việc nhất mà mình từng gặp từ lúc nhập ngũ tới giờ. Làm việc cùng anh Dinh cho mình một cảm giác tràn đầy năng lượng, và nhìn thấy những gì được gọi là thực chất và trách nhiệm. Hình thức được tạo nên từ vẻ đẹp bên trong thay vì sự giả tạo ở vẻ bề ngoài. Sự trách nhiệm xuất phát từ một con tim khao khát giải quyết vấn đề, thay vì một lý trí trực chờ sự hiện diện của cấp trên rồi mới thực hiện. Đây là những thứ từ rất lâu rồi mình chưa được thấy. Không biết trước được tương lai, nhưng anh Dinh cho mình một cảm giác, con người này nhất định sẽ thăng tiến rất nhanh, bằng thực lực mà không phải bằng quan hệ hay tiền bạc. Thực sự môi trường nào cũng có người đáng để mình học hỏi và mến mộ."
    ],
    signature: "Thứ 4, 12:30"
  },
  {
    id: "ch-84",
    title: "Chuyện phiếm (6)",
    intro: [
      "Lâu lắm mới lại có một buổi gác trưa vì hết Khiêm với Tấn bê lại đến Kim ruồi bị phạt gác. Anh Vĩ lên hôm chủ nhật tuần trước, mọi thứ lại trở về ban đầu. Mấy ngày nay không có gì quá đặc biệt, vẫn là huấn luyện chuyên ngành rồi đi tăng gia. Đợt này có thêm công tác bên vườn của c15. Tiểu đoàn mới quản thêm vườn bên đó nên phải tăng gia nhiều hơn. Nhưng chủ yếu cBB tăng cường bên đó nhiều, chỉ thi thoảng 3b trực thuộc mới bị gọi sang thôi.",
      "Cách đây 2 hôm, anh Chính bắt cả tiểu phải ra ngoài sân sinh hoạt. Nguyên nhân thì 4-5 cái, buổi sáng tác phong gấp nội vụ chậm, dọn vệ sinh chậm và không sạch, rồi còn gì nữa mình chẳng nhớ. Anh Chính đứng nói gần 1h đồng hồ, nghe đạo lý và tình cảm lắm, còn cách sống thì không có ai nể. Cả tiểu đang phải cố chịu đựng, chỉ còn 3 tháng nữa là lính cũ ra quân rồi.",
      "Hôm trước điện về nhà thấy mẹ kể Bình đi Nhật mấy hôm trước. Giỏi thật, có thể là đi theo diện công ty cử đi. Bình có tiếng Nhật sẵn rồi, có tài vẽ với thông minh, được sang Nhật làm mấy năm cũng không có gì ngạc nhiên. Thấy mừng cho cu cậu, sang đó làm vừa có trải nghiệm mới, vừa có thu nhập tốt hơn nhiều so với Việt Nam. Lại làm mình nhớ đến Mạnh với Trúc, không biết đang làm gì rồi. Mạnh thì chắc đang chuẩn bị xin học bổng Tiến sĩ, không biết kết quả thế nào. Còn Trúc chắc cũng xong năm nhất thạc sĩ và đang vất vả làm đồ án rồi. Mọi người đều đang tiến lên cả, chỉ còn mình đang chững lại trong này với những thứ chưa biết có đem lại ý nghĩa gì cho mình không. Sau này ra quân còn phải tìm lại một cơ hội mới, bắt đầu từ học thạc sĩ. Là khó khăn hay thử thách? Cứ đợi đó, để xem thử sau khi ra khỏi đây mình có thể đi được đến đâu!"
    ],
    signature: "Thứ 6, 13:10"
  },
  {
    id: "ch-85",
    title: "3 at mới chuyển về",
    intro: [
      "Hôm nay 3at thông tin về, cả trung đội đều ngóng. Từ sáng đi bảo đảm bắn đã bàn nhau về chuyện at mới rồi. Buổi trưa ăn cơm xong, độ 12h có xe Kamaz chở học viên at đỗ tại sân nhà ăn để chờ nhận bàn giao người. Lúc đầu cả anh Vĩ và bên phục vụ đều bảo thông tin có 2 at, nhưng lúc nhận người lại có 3. Cảm giác đón thành viên mới đúng lạ, có háo hức một chút và vui mừng một chút. Nhưng sống trong này lâu phải quen dần với chuyện người đến người đi.",
      "Thêm 3 người mới về nhưng chỉ kê thêm 1 cặp giường nên mình chuyển sang phòng anh Vĩ để nhường chỗ cho một người mới còn lại. 3 at mới mà 2 người là VTĐ, chỉ có 1 người học HTĐ, chắc sẽ có 1 VTĐ sang thông tin vận động (TTvđ). Biên chế ban đầu chỉ có một người học at nhưng có tới 3 người học về nên trung đội đang có tổng 23 người, khả năng sẽ có 2 người khác bị đưa ra khỏi biên chế bTT."
    ],
    signature: "Thứ 7, 22:34"
  },
  {
    id: "ch-86",
    title: "Chuẩn bị chia tay anh Trình",
    intro: [
      "Buổi tối cuối cùng anh Trình ở đây, sáng sớm mai anh Trình về trường rồi. 1 tháng trôi nhanh chẳng kịp nhận ra. Nay trùng hợp lại là sinh nhật anh Côn và Khang ngu. Từ chiều anh Côn đã nhờ anh Vĩ đặt bánh sinh nhật, còn anh Trình thì mua quẩy với nước. Mấy anh em ăn uống, hát hò, rồi chụp ảnh. Anh Trình ít nói mà rất hiền, thỉnh thoảng thấy đứng cạnh một ai đó để nói chuyện với hỏi han. Lúc nào cũng thấy làm việc một cách âm thầm và lặng lẽ. Nói về kỷ niệm thì không có nhiều, có chăng chỉ là những lần ngồi nói chuyện với cả trung đội. Cũng dễ hiểu vì chuyên ngành của anh Trình không phải thông tin nên không tham gia huấn luyện. Chuyện tăng gia thì đã có bt, mà anh cũng không am hiểu nhiều về mảng này. Sĩ quan chính trị thì chắc chỉ đến lúc hết 5 năm rồi đi thực tập 3 tháng đúng chuyên ngành thì mới rõ ràng được, giống như anh Tú với anh Dương thực tập ở c4 ngày trước."
    ],
    signature: "Thứ 6, 12:11"
  },
  {
    id: "ch-87",
    title: "2 người chuyển đi",
    intro: [
      "Buổi sáng trời mưa mãi, vừa mưa vừa rét, trung đội ngồi ôn luyện ngoài hiên. Người ta hay lấy trời mưa để nói chuyện buồn, đâm ra cứ thấy mưa lại thấy sầu sầu. Mà hôm nay thì đúng là không có chuyện gì vui thật. Anh Vĩ gọi Dè vào và thông báo sắp chuyển sang cCO82. Tính cả Dân đi sang bPV chiều qua thì đã có 2 người phải đi để cho đủ biên chế 21 người. Ở với nhau gần 5 tháng lại phải đi đúng là không dễ chịu tí nào. Nhưng nhiều lần như vậy đâm ra lại thành quen, có buồn mất hôm đầu, sau vài ngày sẽ lại quen dần với chuyện thiếu đi một ai đó. Nhưng mà vẫn hy vọng quân số hiện tại không còn biến động gì nữa."
    ],
    signature: "Thứ 6, 12:31",
    ps: [
      "Dè là biệt danh mọi người trong trung đội gọi Hoàng, vì cu cậu giọng khàn khàn",
      "cCO82: Đại đội Cối 82mm"
    ]
  },
  {
    id: "ch-88",
    title: "Sắp đi tập huấn vệ binh",
    intro: [
      "Mấy hôm nay chỉ ngồi suốt trong phòng chép sổ với làm giáo án, làm dồn dập ngày nào cũng như ngày nào. Vì mình đang ôn tập để chuẩn bị thi tìm hiểu pháp luật bên trung đoàn, lại còn nằm trong danh sách đi tập huấn vệ binh chưa biết hôm nào đi. Thế nên phải làm sổ với giáo án nhanh, để dự trù cho trường hợp mình phải đi tập huấn 1 tháng trên sư đoàn. Chẳng hiểu sao dạo gần đây, cứ hễ tiểu đoàn có chuyện gì hoặc sự kiện gì lại thấy mặt của mình, cả chuyện phỏng vấn kênh QPVN mấy hôm trước cũng vậy.",
      "Sáng nay anh Quân chạy sang phòng anh Vĩ báo mình sắp phải đi tập huấn. Có tên trong danh sách là một chuyện, tập huấn xong có thể còn phải chuyển sang vệ binh trung đoàn luôn. Không biết có thật hay không, nếu là thật thì khó xử nhỉ, đang quen sống ở đây. Một đống thứ quay cuồng trong đầu không biết làm sao!"
    ],
    signature: "Thứ 6, 12:45",
    ps: [
      "Trước đó mấy hôm, lúc đang học bơi bên trung đoàn thì anh Hòa trung trưởng vệ binh đi đến ghi lại họ tên những người có dáng cao, để làm danh sách xét chọn đi tập huấn vệ binh. Trung đội có mình và Khoa được ghi vào danh sách. Lúc đó mọi người chưa biết, chỉ nghĩ anh Hòa đang tìm người chuyển sang vệ binh để chuẩn bị thay các anh lính cũ sắp ra quân.",
      "Vừa nhìn thấy mình, anh Hòa liền hỏi đã từng vi phạm gì chưa mà sao nhìn mặt quen thế ^^. Hỏi mình vậy vì anh Hòa hay phải đi bắt các lỗi vi phạm trong cả trung đoàn. Còn nhìn mặt quen vì mình với anh Hòa từng đi đại hội quân khu cùng nhau 2 tháng trước. Nhưng lúc đó mình không nói, vì mình không muốn sang vệ binh."
    ]
  },
  {
    id: "ch-89",
    title: "Đi tập huấn vệ binh",
    intro: [
      "Từ lúc chưa báo thức đã dậy để sắp xếp đồ đạc, quân tư trang để đi tập huấn VB. Mình với Khoa sẽ đi tập huấn ở d17 một tháng mới về. D2 có 23 người đi, tính cả anh Quyền phụ trách lớp tập huấn. Di chuyển từ d2 một đoạn thì anh Quyền yêu cầu cả đội chạy thường, gần đến trung đoàn mới cho dừng. Ngay ấn tượng đầu tiên đã làm mình có một dự cảm về một tháng không được dễ chịu cho lắm.",
      "Đi độ hơn 1h mới đến nơi. Tính cả bVB của trung đoàn thì có 31 người, kèm theo cả balo quân tư trang dồn lén hết trong xe county 29 chỗ. Chật chội nhưng cũng không quá khó chịu. Đến d17 ấn tượng đầu tiên là các dãy nhà 2 tầng được quét sơn, khác hẳn dãy nhà 1 tầng quét ve ở d2. Nhìn sạch sẽ và rộng rãi hơn hẳn, phòng bt thì rộng gấp 2 lần bình thường.",
      "Ngày đầu tiên chủ yếu quét dọn, củng cố đơn vị, lấy vật chất, và dán hệ thống tem nhãn. Đến buổi chiều thì 10 người của tỉnh đội tỉnh mình cũng đến, gộp chung vào b4 của mình thì vừa đủ 40 người. Bên tỉnh đội là a12, ở riêng một phòng bên cạnh. Lúc tò mò ghé mắt vào trong xem có ai quen không thì bất ngờ thấy Tùng với Thái. Tùng thì 14 ngày cách ly ở chung, suốt ngày nhờ mình nhắn tin hộ cho người yêu. Hồi đấy không sợ mình tán mất người yêu hay sao ý:D. Thái thì cùng tiểu đội hồi tân binh. Lâu ngày không gặp giờ thấy nhau ở đây đúng là mừng."
    ],
    ps: [
      "bVB: Trung đội Vệ binh"
    ]
  },
  {
    id: "ch-90",
    title: "Ngày đầu huấn luyện VB",
    intro: [
      "Ngày huấn luyện đầu tiên chủ yếu chép lý thuyết, toàn môn của đại đội, để các anh bt có thời gian in giáo án.",
      "Buổi trưa anh Quyền gọi vào hỏi có phải cò anh Vĩ không rồi bảo mình viết sổ. Tưởng đi huấn luyện 1 tháng sẽ thoát được cảnh làm cò, để tận hưởng 1 tháng làm lính thường, ai mà có dè vẫn là một con cò ở chỗ mới. Nhưng được cái mình chỉ cần viết sổ, người khác sẽ làm máy tính và dọn phòng."
    ],
    ps: [
      "Môn cấp đại đội sẽ do chỉ huy cấp đại đội dạy, còn môn cấp trung đội thì do các anh trung đội trưởng trực tiếp đứng lớp."
    ]
  },
  {
    id: "ch-91",
    title: "Kết thúc huấn luyện VB",
    intro: [
      "Thấm thoát 1 tháng huấn luyện VB kết thúc, chấm dứt chuỗi ngày an nhàn và vô cùng thoải mái. Thi kết thúc khóa tập huấn từ thứ 6 tuần trước, từ đó đến hôm qua chủ yếu nằm đọc tạp chí với xem review phim, không phải làm gì mấy, có làm thì cũng chỉ một lúc là xong. Suốt một tháng, hầu như ngày nào cũng ngủ từ 21h30 đúng chế độ. Từ thứ 6 đến chủ nhật, tối nào cũng có thời gian ra ngoài sinh hoạt và xem tivi. Ở d2 chưa bao giờ mình được như vậy.",
      "Bữa tiệc nào rồi cũng đến lúc phải tàn. Từ đầu buổi sáng đã được thông báo sắp xếp quân tư trang, và dọn dẹp lại đơn vị lần cuối để bàn giao. Lúc 8h, chuyến xe đưa lớp huấn luyện VB e1 xuất phát từ d17, tạm biệt 1 tháng tốt đẹp. Dù thỉnh thoảng vẫn bị phạt vì xếp balo xấu, và cũng có một vài chuyện không vui, nhưng tổng thể là 1 tháng vô cùng lý tưởng. Về đến d2 mọi thứ lại trở về bình thường."
    ]
  },
  {
    id: "ch-92",
    title: "Kiểm tra cuối năm",
    intro: [
      "Mới về được 1 ngày thì phải sang trung đoàn kiểm tra cuối năm. bTT bên mình chỉ kiểm tra dịch mã, quấn dây, không như BB phải kiểm tra cả điều lệnh, võ thuật, hậu cần như hồi tân binh, phải học ngày học đêm. Một tháng không động vào chuyên ngành, mắt đảo chậm hơn nhưng kết quả vẫn tạm ổn."
    ]
  },
  {
    id: "ch-93",
    title: "Chuyển sang trung đoàn",
    intro: [
      "Mới huấn luyện VB về chưa được 1 tuần thì bị gọi sang trung đoàn để làm cò cho phòng tác huấn. Từ chiều qua chú Đông đã sang tiểu đoàn gọi mình lên nói chuyện và báo trước. Sáng nay anh Dinh dẫn sang vì tiện đường anh Dinh sang tăng cường vệ binh trung đoàn. Bình thường vẫn hay chứng kiến mọi người trong trung đội chuyển đi, cuối cùng hôm nay lại đến lượt mình. Anh Vĩ đang về tranh thủ, lúc quay lại mà biết mình bị chuyển sang trung đoàn rồi chắc sẽ bất ngờ lắm^^.",
      "Ngày đầu tiên chủ yếu học việc. Có cảm giác muốn về lại d2. Vừa tối tắm xong lên báo anh Dũng, nhờ anh Dũng báo với anh Bảo mình không muốn làm cò ở đây, muốn trở về bTT. Hy vọng được toại nguyện."
    ],
    signature: "Thứ 7, 21:57",
    ps: [
      "Khi mình vào phòng tác huấn thì cò ở đây có 2 anh lính cũ, anh Dũng và Anh Phát. Hai anh sắp ra quân nên sẽ bàn giao lại công việc cho mình. Thời gian đầu mình sẽ kiêm việc của cả 2 anh. Sau khi ra quân, anh Bảo sẽ chọn thêm 1 người khác.",
      "Chú Đông là Phó tham mưu trưởng Trung đoàn",
      "Anh Bảo là Trợ lý tác huấn Trung đoàn"
    ]
  },
  {
    id: "ch-94",
    title: "Sau khi sang trung đoàn",
    intro: [
      "Sau khi sang trung đoàn mình không còn giữ thói quen viết nhật ký nữa. Có thể do thoải mái quá nên không giữ được mình:v",
      "Hồi mới vào phòng tác huấn, cố gắng giả vờ cái gì cũng không biết làm để được chuyển về lại d2. Sau vài ngày cố gắng cuối cùng vẫn không đi được, đành chấp nhận sự thật và làm việc hết mình ở đây cho đến lúc ra quân. Thời gian đó các chế độ đều thoải mái hơn so với hồi bên d2, cũng không cần phải hành quân rèn luyện và không cần đi diễn tập. Đổi lại, trước mỗi đợt diễn tập đều cần xử lý rất nhiều văn bản, tài liệu, và chỉnh sửa bản đồ chiến thuật (1 người khác làm cò giống mình phụ trách phần bản đồ).",
      "Mà vào phòng tác huấn rồi mới biết một chuyện. Ngày trước, anh Bảo trợ lý tác huấn có gọi điện sang d2 để tìm người thay thế cho anh cò lính cũ sắp ra quân. Ban đầu anh trợ lý tiểu đoàn than khó, nhưng sau khi bị đe sẽ chọn cò của anh trợ lý tiểu đoàn thì cuối cùng lại giới thiệu mình. Và thế là mọi chuyện bắt đầu từ đó. Ngày đó từng có suy nghĩ không biết làm cò trung đội là thiệt thòi hay là may mắn. Sau này nghĩ lại thì có thể là may mắn nhiều hơn. Bắt đầu từ cò trung đội, được trải nghiệm hầu hết những gì mấy anh em trong trung đội trải nghiệm, rồi không qua đại đội và tiểu đoàn mà sang trung đoàn. Nếu khởi đầu của mình là cò tiểu đoàn thì rất có thể vẫn sẽ là cò tiểu đoàn cho đến lúc ra quân, và sẽ không thể trải nghiệm rất nhiều thứ ở cấp trung đội.",
      "Thời gian ở trung đoàn cũng có nhiều dấu mốc. Ví dụ hai anh cò lính cũ ở đây ra quân, buổi tối hôm trước ăn uống rất vui và rất lâu. Sáng sớm hôm sau, trong lúc mơ màng ngủ, chỉ loáng thoáng nghe thấy tiếng tập trung đội hình vọng vào từ ngoài sân, rồi tiếng dặn dò của chỉ huy. Lúc mình thức dậy, lính cũ của cả trung đoàn đã ra quân hết, cảm giác thật trống vắng. Lúc đó, ở các đại đội trong trung đoàn chỉ còn lại các tiểu trưởng cùng khóa với mình, đang đợi để quản tân binh khóa mới - nhập ngũ sau tết âm.",
      "Sau khi sang trung đoàn 1 thời gian mình giới thiệu Nghiêm từ d2 sang làm cò cùng mình. Vị trí cò thường có 2 người, mà 2 anh lính cũ ra quân rồi thì còn thiếu 1 người nữa. Mình giới thiệu Nghiêm vì 2 chú cháu cùng làng, cách nhau có 1 tuổi nên biết nhau, cùng nhau nhập ngũ thì chơi thân. Mà thấy Nghiêm ở bên kia vất vả quá nên mình giới thiệu sang đây làm cùng. Mấy hôm sau Nghiêm được sang thật. 2 chú cháu làm việc rất hợp nhau và rất vui.",
      "Rồi lần đầu ăn tết âm trong quân đội. Ở đâu cũng thấy trang trí đèn hoa, rồi cả đào với quất. Mình với Nghiêm cũng mất một ngày trước tết để trang trí khu nhà ở của phòng tác huấn. Thời gian đó rất vắng vì lính cũ đã ra quân hết, cán bộ thì chỉ những ai trực mới ở lại, còn đâu sẽ về ăn tết với gia đình. Ngày tết cũng không có văn bản để xử lý, nên mình chạy xuống bVB chơi. Dù làm cò ở phòng tác huấn, nhưng biên chế quân số của mình thì ở dưới bVB. Mà cũng quen mấy anh em từ hồi tập huấn VB rồi nên không có ai lạ cả, mọi người đều vui tính với thoải mái.",
      "Qua tết âm, trung đoàn đón đợt tân binh nhập ngũ mới. Nhìn những khuôn mặt đó lại nhớ những ngày đầu mình mới vào, chân ướt chân ráo cái gì cũng không biết, làm gì cũng rụt rè lo trước lo sau. Mình biết mọi chuyện rồi sẽ đâu vào đấy, ai rồi cũng sẽ khác đi sau từng giai đoạn huấn luyện. Đợt nhập ngũ này có cả em họ của mình nữa. Trong lúc đi xin rau thì vô tình gặp cu cậu đang tăng gia với trung đội. Hai anh em gặp nhau rất vui, đứng nói chuyện một hồi mới đi. Sau này em mình có đăng ký đi học at, rồi sau đó được quay lại trung đoàn.",
      "Thời gian thấm thoát trôi, rồi cuối cùng cũng đến lượt mình ra quân. Ngày hôm trước trả lại quân tư trang cho bên hậu cần, và chuẩn bị một bữa tối thật ngon để ăn chia tay với mọi người. Tối đó là một cảm giác thật khó tả, trằn trọc cả đêm mãi mới ngủ được. Ngày hôm sau, đặt chân về đến nhà rồi mà vẫn cảm giác như một giấc mơ. Hành trình nhập ngũ kết thúc ở đó, một hành trình cho mình rất nhiều trải nghiệm, và khiến mình cảm thấy bản thân đã không còn là bản thân mình trước lúc nhập ngũ nữa."
    ]
  },
  {
    id: "ch-95",
    title: "Lời kết",
    intro: [
      "Mình đã từng tự hỏi, cần phải gom góp bao nhiêu may mắn để đổi lấy tất cả những gì đã trải nghiệm chỉ trong một lần nhập ngũ. Làm cò trung đội, vừa biết cảm giác của một liên lạc, vừa có trải nghiệm của một “lính trơn”: tăng gia, tập điều lệnh, rèn thể lực, hành quân, dã ngoại, diễn tập, và sau này là trực chiến. Rồi từ cò trung đội sang trung đoàn, được nhìn thấy cách vận hành của một văn bản trong quân đội, và chứng kiến những sinh hoạt đời thường nhất của chỉ huy. Mình lại nhập ngũ trùng với đợt đại hội, được nhìn thấy đại hội từ cấp đại đội đến quân khu, dù bản thân chỉ là một phần không đáng chú ý trong những lần đại hội đó. Rồi sau này là tập huấn vệ binh, để mình vỡ lẽ vệ binh không chỉ có canh gác, mà chỉ nội việc canh gác cũng có rất nhiều quy tắc phải học.",
      "Nếu được hỏi nhập ngũ có vất vả không, thì đã có lúc mình từng nghĩ hai từ “vất vả” vẫn còn rất nhẹ nhàng để nói về những lần bước đi chỉ bằng ý chí. Nhưng có chịu được không? Hoàn toàn có thể! Chương trình huấn luyện đã được thiết kế với cường độ tăng dần từ thấp đến cao, thế nên chỉ cần tuân thủ chương trình huấn luyện, những cái vất vả đều có thể vượt qua. Sau này mình cũng nhận ra, nhờ những ngày tháng vất vả đó mà mình biết quý lấy những gì mình đang có, và bắt đầu nói chuyện với gia đình nhiều hơn. Bởi vì, quân đội là nơi lần đầu tiên mình có cảm giác nhớ nhà, cũng là nơi lần đầu tiên mình nhận ra, chỉ cần được tự do làm điều mình muốn, tự nó đã là một loại may mắn và hạnh phúc.",
      "Nhìn lại toàn bộ hành trình, điều đọng lại trong mình đấy là, không cần phải quá tính toán thiệt hơn, cứ làm thật tốt công việc của mình và làm có trách nhiệm, mình sẽ nhận lại được những gì thật sự xứng đáng, không ở khía cạnh này thì sẽ ở khía cạnh khác."
    ]
  }
];

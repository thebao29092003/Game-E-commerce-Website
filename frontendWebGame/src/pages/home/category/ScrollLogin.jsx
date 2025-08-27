export const scroll = (categoryMenuListRef) => {
  if (categoryMenuListRef.current) {
    const scrollList = categoryMenuListRef.current;
    scrollList.scrollLeft = 0; // Đặt vị trí cuộn ban đầu
    // Hàm xử lý sự kiện lăn chuột
    const handleWheel = (event) => {
      event.preventDefault(); // Ngăn chặn cuộn dọc mặc định
      scrollList.scrollLeft += event.deltaY * 1.8; // Cuộn ngang
    };
    // Gán sự kiện 'wheel' vào phần tử
    scrollList.addEventListener("wheel", handleWheel);
  }
};
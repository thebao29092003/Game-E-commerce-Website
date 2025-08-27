import SideBarAdmin from "../../sidebarAdmin/SideBarAdmin";
import "./DetailUser.css";
import ChartWrapper from "../../chart/LineChart";
import { useLocation } from "react-router-dom";
import { useGetUserForAdQuery } from "../../../../features/userApi/userApiSlice";
import { useState, useEffect } from "react";
import { formatDateMonth } from "../../../../utility/format/FormatDate";
import { formatCurrency } from "../../../../utility/format/FormatCurrency";

const DetailUser = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [info, setInfo] = useState([]);

  const location = useLocation();
  const { userId } = location.state || {};
  console.log(userId);
  const { isLoading, data: user } = useGetUserForAdQuery({ userId: userId });

  useEffect(() => {
    if (!isLoading && user) {
      const months = user.spentPerMonth?.map((item) =>
        formatDateMonth(item[0])
      );
      const spentPerMonth = user.spentPerMonth?.map((item) => item[1]);
      setChartData({
        labels: months || [],
        datasets: [
          {
            label: "Chi tiêu (VNĐ)",
            data: spentPerMonth,
            borderColor: "rgb(75, 182, 192)",
            backgroundColor: "rgb(75, 192, 192)",
            pointBackgroundColor: "rgb(0, 85, 255)", // màu chấm điểm
            tension: 0.2, // độ cong của đường (0 là thẳng, càng lớn càng cong)
            pointRadius: 4, // độ to nhỏ chấm
            pointHoverRadius: 7, // khi hover vào thì to ra
          },
        ],
      });
      setInfo(user.user);
    }
  }, [isLoading, user]);

  /*
  - Nếu responsive: true → Chart tự động co giãn kích thước để
  phù hợp với màn hình cha (container).
  - Nếu responsive: false → Chart không tự resize nữa, 
  mà nó giữ cố định kích thước mà bạn set bằng width và height trực tiếp.
   */
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Biểu đồ chi tiêu trong 12 tháng gần nhất",
        color: "rgba(19, 137, 233, 1)",
        font: {
          size: 18, // 🔥 Kích thước chữ
          weight: "bold", // 💪 Font weight (normal, bold, bolder, etc.)
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(45, 112, 218, 0.5)",
        },
      },
      y: {
        // 🎯 Đây là một hàm callback dùng để format lại giá trị của trục y
        // (thường là giá tiền bạn vẽ ra biểu đồ đó).
        // value: Là từng con số trên trục (ví dụ 200000, 500000, 1000000...)
        // .toLocaleString("vi-VN"): Chuyển số đó thành dạng có dấu phân
        // cách kiểu Việt Nam (dùng dấu chấm ., không phải dấu phẩy , như tiếng Anh).
        ticks: {
          callback: function (value) {
            return value.toLocaleString("vi-VN") + " ₫"; // format tiền Việt
          },
          stepSize: 1000000,
        },
        grid: {
          color: "rgba(45, 112, 218, 0.5)",
        },
      },
    },
  };
  return (
    <>
      <div className="list-game-page">
        <SideBarAdmin />
        <div className="list-game-content detail-user-page">
          <div className="item-info-name-email">
            <div className="item-info-user">
              <label>Tên hiển thị</label>
              <p>{info[1]}</p>
            </div>

            <div className="item-info-user">
              <label>Địa chỉ email</label>
              <p>{info[2]}</p>
            </div>
          </div>
          <div className="item-info-total-status">
            <div className="item-info-user">
              <label>Số điện thoại</label>
              <p>{info[3]}</p>
            </div>
            <div className="item-info-user">
              <label>Tổng chi</label>
              <p>{formatCurrency(info[4])}</p>
            </div>
          </div>
          {chartData.labels.length > 0 ? (
            <div id="chart-user-buy" className="chart-user-buy">
              <ChartWrapper data={chartData} options={options} />
            </div>
          ) : (
            <div id="chart-user-buy" className="chart-user-buy">
              <p style={{fontSize: "22px", marginTop: "30px", textAlign: "center"}}>{`Khách hàng ${info[1]} chưa từng mua hàng`}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DetailUser;

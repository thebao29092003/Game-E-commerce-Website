import React, { useEffect } from "react";
import SideBarAdmin from "../../sidebarAdmin/SideBarAdmin";
import ChartWrapper from "../../chart/LineChart";
import { useGetGameBestSellYearQuery } from "../../../../features/gameAdminApi/gameAdminApiSlice";
import { useState } from "react";

const GameBestSellYear = () => {
const { isLoading, data:gameBestSellYear } = useGetGameBestSellYearQuery();
const [chartData, setChartData] = useState({ labels: [], datasets: [] });


useEffect(() => {
  if (!isLoading && gameBestSellYear) {
    const gameName = gameBestSellYear.gameList?.map((item) => item[1]);
    const accountGameBuy = gameBestSellYear.gameList?.map((item) => item[2]);
    setChartData({
      labels: gameName || [],
      datasets: [
        {
          label: "Số lượng tài khoản bán được (tài khoản)",
          data: accountGameBuy,
          borderColor: "rgb(65, 212, 209)",
          backgroundColor: "rgb(65, 212, 209)",
          pointBackgroundColor: "rgb(245, 25, 223)", // màu chấm điểm
          tension: 0.2, // độ cong của đường (0 là thẳng, càng lớn càng cong)
          pointRadius: 5, // độ to nhỏ chấm
          pointHoverRadius: 10, // khi hover vào thì to ra
        },
      ],
    });
  }
}, [isLoading, gameBestSellYear]);
 

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
        text: "Biểu đồ game bán chạy năm gần nhất",
        color: "rgb(65, 212, 209)",
        font: {
          size: 18, // 🔥 Kích thước chữ
          weight: "bold", // 💪 Font weight (normal, bold, bolder, etc.)
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(65, 212, 209, 0.5)",
        },
      },
      y: {
        ticks: {
          callback: function (value) {
            return value.toLocaleString("vi-VN"); // format tiền Việt
          },
          stepSize: 5,
        },
        grid: {
          color: "rgba(65, 212, 209, 0.5)",
        },
      },
    },
  };
  return (
    <>
      <div className="list-game-page">
        <SideBarAdmin />
        <div className="list-game-content">
          <ChartWrapper data={chartData} options={options} />
        </div>
      </div>
    </>
  );
};

export default GameBestSellYear;

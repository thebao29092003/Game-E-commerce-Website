import React from "react";
import SideBarAdmin from "../../sidebarAdmin/SideBarAdmin";
import ChartWrapper from "../../chart/LineChart";
import { useState, useEffect } from "react";
import { useGetOrderRevenueQuery } from "../../../../features/orderApi/orderApiSlice";
import { formatDateMonth } from "../../../../utility/format/FormatDate";

const RevenuePerMonth = () => {
  const { isLoading, data:orderRevenue } = useGetOrderRevenueQuery();
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  
  
  useEffect(() => {
    if (!isLoading && orderRevenue) {
      const months = orderRevenue.orderCountRevenue?.map((item) => formatDateMonth(item[0]));
      const revenues = orderRevenue.orderCountRevenue?.map((item) => item[2]);
      setChartData({
        labels: months || [],
            datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: revenues || [],
        borderColor: "rgb(157, 75, 192)",
        backgroundColor: "rgb(157, 75, 192)",
        pointBackgroundColor: "rgb(255, 242, 0)", // màu chấm điểm
        tension: 0.2, // độ cong của đường (0 là thẳng, càng lớn càng cong)
        pointRadius: 4, // độ to nhỏ chấm
        pointHoverRadius: 7, // khi hover vào thì to ra
      },
    ],
      });
    }
  }, [isLoading, orderRevenue]);

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
        text: "Biểu đồ doanh thu trong 12 tháng gần nhất",
        color: "rgb(157, 75, 192)",
        font: {
          size: 18, // 🔥 Kích thước chữ
          weight: "bold", // 💪 Font weight (normal, bold, bolder, etc.)
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(157, 75, 192, 0.5)",
        },
      },
      y: {
        ticks: {
          callback: function (value) {
            return value.toLocaleString("vi-VN") + " ₫"; // format tiền Việt
          },
          stepSize: 1000000,
        },
        grid: {
          color: "rgba(157, 75, 192, 0.5)",
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

export default RevenuePerMonth;

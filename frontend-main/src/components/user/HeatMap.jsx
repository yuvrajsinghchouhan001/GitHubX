import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";

const generateActivityData = (startDate, endDate) => {
  const data = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    // Generate realistic contribution frequencies (some 0, some with commits)
    const hasActivity = Math.random() > 0.4;
    const count = hasActivity ? Math.floor(Math.random() * 8) + 1 : 0;
    data.push({
      date: currentDate.toISOString().split("T")[0],
      count: count,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    // Show last 6 months of contributions
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 5);

    const startStr = startDate.toISOString().split("T")[0];
    const endStr = endDate.toISOString().split("T")[0];

    const data = generateActivityData(startStr, endStr);
    setActivityData(data);
  }, []);

  const panelColors = {
    0: "#161b22",
    1: "#0e4429",
    2: "#006d32",
    4: "#26a641",
    8: "#39d353",
  };

  const totalContributions = activityData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div style={{ color: "#c9d1d9" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <h4 style={{ color: "#f0f6fc", fontSize: "15px" }}>
          {totalContributions} contributions in the last 6 months
        </h4>
        <span style={{ fontSize: "12px", color: "#8b949e" }}>Contribution settings ▾</span>
      </div>
      <HeatMap
        className="HeatMapProfile"
        style={{ maxWidth: "100%", height: "160px", color: "#8b949e" }}
        value={activityData}
        weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        startDate={
          activityData.length > 0 ? new Date(activityData[0].date) : new Date()
        }
        rectSize={14}
        space={3}
        rectProps={{
          rx: 2.5,
        }}
        panelColors={panelColors}
      />
    </div>
  );
};

export default HeatMapProfile;

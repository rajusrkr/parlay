import { useEffect, useRef, useState } from "react";
import { AreaSeries, createChart, type Time } from "lightweight-charts";

export default function AreaChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<{ time: Time; value: number }[]>([
    { value: 0, time: 1642425322 as Time },
    { value: 0.08, time: 1642511722 as Time },
    { value: 0.1, time: 1642598122 as Time },
    { value: 0.2, time: 1642684522 as Time },
    { value: 0.3, time: 1642770922 as Time },
    { value: 0.43, time: 1642857322 as Time },
    { value: 0.41, time: 1642943722 as Time },
    { value: 0.43, time: 1643030122 as Time },
    { value: 0.56, time: 1643116522 as Time },
    { value: 0.59, time: 1643202922 as Time },
  ]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chartOptions = {
      layout: {
        textColor: "black",
        background: { color: "white" },
      },
    };

    const chart = createChart(chartContainerRef.current, chartOptions);

    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: "#2962FF",
      topColor: "#2962FF",
      bottomColor: "rgba(41,98,255,0.28)",
    });

    areaSeries.setData(data);

    chart.timeScale().fitContent();

    // clean
    return () => chart.remove();
  }, [data]);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "800px" }} />
  );
}

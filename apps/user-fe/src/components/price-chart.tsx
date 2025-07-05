import { useEffect, useRef } from "react";
import {
  AreaSeries,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type Time,
} from "lightweight-charts";

export default function AreaChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chartOptions = {
      layout: {
        textColor: "black",
        background: { color: "white" },
      },
    };

    const chart = createChart(chartContainerRef.current, chartOptions);
    chartRef.current = chart;

    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: "#2962FF",
      topColor: "#2962FF",
      bottomColor: "rgba(41,98,255,0.28)",
    });

    seriesRef.current = areaSeries;

    const initialData = [
      { value: 0, time: 1642425322 as Time },
      { value: 8, time: 1642511722 as Time },
      { value: 10, time: 1642598122 as Time },
      { value: 30, time: 1642684522 as Time },
    ];

    areaSeries.setData(initialData);
    chart.timeScale().fitContent();

    // ws data

const ws = new WebSocket("ws://localhost:8001")

wsRef.current = ws

// ws.onmessage  = (event) => {
//   try {
//     const
//   } catch (error) {
    
//   }
// }


    // clean
    return () => chart.remove();
  }, []);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "800px" }} />
  );
}

import { useEffect, useRef } from "react";
import {
  AreaSeries,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type Time,
} from "lightweight-charts";
import { useMarketStore } from "@/stores/useMarketStore";
import { useParams } from "react-router";
import { useuserStore } from "@/stores/useUserStore";
import { useWebsocket } from "@/hooks/useWebSocket";
import TradeCanvasSideNavbar from "@/components/trade-canvas-side-navbar";

export default function TradeCanvas() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  const { fetchPositions } = useuserStore();
  const { connect, disconnect } = useWebsocket();

  useEffect(() => {
    (async () => {
      await fetchPositions();
    })();

    // Connect to ws server
    connect();
    return () => {
      disconnect;
    };
  }, []);

  const paramsId = useParams().id;

  const { markets } = useMarketStore();

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

    // map data
    const map = new Map<number, { time: Time; value: number }>();
    // setting data into map
    markets
      .filter((market) => market.marketId === paramsId)
      .flatMap((market) => market.prices)
      .forEach((price) => {
        const time = price.yes.time as Time;
        const value = Number(price.yes.value);
        map.set(Number(time), { time, value });
      });

    // sorting map data in ascending format
    const priceData = Array.from(map.values()).sort(
      (a, b) => Number(a.time) - Number(b.time)
    );

    areaSeries.setData(priceData);
    chart.timeScale().fitContent();

    // clean up
    return () => chart.remove();
  }, [markets]);

  return (
    <div className="flex  w-full">
      <div ref={chartContainerRef} className="w-[80vw] h-[80vh]" />
      <div>
        <TradeCanvasSideNavbar />
      </div>
    </div>
  );
}

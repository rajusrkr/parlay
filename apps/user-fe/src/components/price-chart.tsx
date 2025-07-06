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
import PlaceOrderBtn from "./place-order-btn";

export default function AreaChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

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

    // flat map and filter
    const priceData = markets
      .filter((market) => market.marketId === paramsId)
      .flatMap((filteredMarket) =>
        filteredMarket.prices.map((price) => ({
          time: price.yes.time as Time,
          value: Number(price.yes.value),
        }))
      );

    areaSeries.setData(priceData);
    chart.timeScale().fitContent();

    // ws data

    const ws = new WebSocket("ws://localhost:8001");
    wsRef.current = ws;

    // clean up
    return () => chart.remove();
  }, [markets]);

  return (
    <div>

    <div ref={chartContainerRef} style={{ width: "100%", height: "800px" }} />


    <div className="p-2 flex gap-2">
      {/* Buy button */}
      <PlaceOrderBtn marketId={paramsId!} orderQty={100}  orderSide="yes" orderType="buy" buttonTitle="Buy"/>
      {/* Sell button */}
      <PlaceOrderBtn buttonTitle="Sell" marketId={paramsId!} orderQty={150} orderSide="yes" orderType="sell"/>
    </div>
    </div>
  );
}

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MarketData } from "types/src/index"


interface MarketStates {
  isError: boolean;
  erroMessage: string | null;

  markets: MarketData[];

  fetchMarkets: () => Promise<void>;
  handlePriceChange: ({ marketId, noPrice, yesPrice, time }: { marketId: string, time: number, yesPrice: number, noPrice: number }) => void;
}

const useMarketStore = create(
  persist<MarketStates>(
    (set) => ({
      isError: false,
      erroMessage: null,

      markets: [],

      fetchMarkets: async () => {
        try {
          const sendReq = await fetch(
            "http://localhost:8000/api/v0/market/get-markets"
          );

          const res = await sendReq.json();

          if (res.success) {
            set({ markets: res.markets });
          } else {
            set({ isError: true, erroMessage: res.message });
          }
        } catch (error) {
          console.log(error);
          set({ isError: true, erroMessage: "Client side error" });
        }
      },

      handlePriceChange: ({ marketId, noPrice, time, yesPrice }) => {
        set((prev) => ({
          markets: prev.markets.map((market) => {
            if (market.marketId === marketId) {
              return {
                ...market,
                prices: [
                  ...market.prices,
                  {
                    yes: { time: time, value: yesPrice },
                    no: { time: time, value: noPrice },
                  },
                ],
              };
            }

            return market;
          }),
        }));
      },
    }),
    { name: "market-store" }
  )
);

export { useMarketStore };

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Price {
  yes: { time: number; value: number };
  no: { time: number; value: number };
}


interface Market {
  marketId: string;
  marketTitle: string;
  thumbnailImage: string;
  marketStarts: string;
  marketEnds: string;
  currentStatus: string;
  winnerSide: string | null;
  prices: Price[];
}

interface MarketStates {
  isError: boolean;
  erroMessage: string | null;
  
  markets: Market[];

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

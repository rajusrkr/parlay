interface wsPacket {
  eventName: string;
  requestId?: string;
  data: any;
}

interface WsPayload {
  eventType: string;
  requestId?: string;
  data: {
    authToken?: string;
    marketId?: string;
    marketSide?: string;
    time?: number;
    avgPrice?: string;
    newAdjustedQty?: number;
    price?: {
      yes?: number;
      no?: number;
    };
    // User order
    userOrderSide?: string;
    userOrderType?: string;
    userOrderQty?: number;
    prevYesSideQty?: number;
    prevNoSideQty?: number;

    // LMSR calculation
    yesPriceBeforeOrder?: number;
    noPriceBeforeOrder?: number;
    yesPriceAftereOrder?: number;
    noPriceAfterOrder?: number;
    costBeforeOrder?: number;
    costAfterOrder?: number;
    returnToUser?: number;
    costToUser?: number;
    requestId?: string;
  };
}

export { wsPacket, WsPayload };

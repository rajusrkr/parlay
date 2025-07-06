import { Button } from "./ui/button";

export default function PlaceOrderBtn({
  marketId,
  orderSide,
  orderType,
  orderQty,
  buttonTitle,
}: {
  orderSide: string;
  orderType: string;
  marketId: string;
  orderQty: number;
  buttonTitle: string;
}) {
  return (
    <div>
      <Button
        onClick={async () => {
          try {
            const sendReq = await fetch(
              "http://localhost:8000/api/v0/user/handle-order",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                  marketId,
                  orderQty,
                  orderSide,
                  orderType,
                }),
              }
            );

            const res = await sendReq.json();

            console.log(res);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        {buttonTitle}
      </Button>
    </div>
  );
}

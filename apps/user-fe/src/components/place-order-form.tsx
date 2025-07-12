import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useParams } from "react-router";

export default function PlaceOrderForm() {
  const [noQty, setNoQty] = useState<number>(0);
  const [yesQty, setYesQty] = useState<number>(0);


  const paramsId = useParams().id;

  const handleOrderPlacement = async ({
    orderSide,
    orderType,
    orderQty,
  }: {
    orderType: string;
    orderSide: string;
    orderQty: number;
  }) => {
    try {
      const sendReq = await fetch(
        "http://localhost:8000/api/v0/user/handle-order",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderSide,
            orderType,
            orderQty,
            marketId: paramsId,
          }),
        }
      );

      const res = await sendReq.json();

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div>
        <Tabs defaultValue="yes">
          <TabsList>
            <TabsTrigger value="yes" className="hover:cursor-pointer" onClick={() => setNoQty(0)}>
              Yes Side
            </TabsTrigger>
            <TabsTrigger value="no" className="hover:cursor-pointer" onClick={() => setYesQty(0)}>
              No Side
            </TabsTrigger>
          </TabsList>

          <TabsContent value="yes">
            <Card>
              <CardHeader>
                <CardTitle>Take position in Yes side</CardTitle>
                <CardDescription>Place order for buy side</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="yes-tab">Quantity</Label>
                  <Input
                    id="yes-qty"
                    type="number"
                    placeholder="Put your quantity. eg: 50"
                    onChange={(e) => setYesQty(Number(e.target.value))}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  disabled={yesQty <= 0}
                  className="w-full hover:cursor-pointer"
                  onClick={() =>
                    handleOrderPlacement({
                      orderSide: "yes",
                      orderType: "buy",
                      orderQty: yesQty,
                    })
                  }
                >
                  Let's Buy - I'm Yes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="no">
            <Card>
              <CardHeader>
                <CardTitle>Take position in No Side</CardTitle>
                <CardDescription>Place order for no side</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="no-tab">Quantity</Label>
                  <Input
                    id="no-qty"
                    type="number"
                    placeholder="Put your quantity. eg: 50"
                    onChange={(e) => setNoQty(Number(e.target.value))}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full cursor-pointer"
                  disabled={noQty <= 0}
                  onClick={() =>
                    handleOrderPlacement({
                      orderQty: noQty,
                      orderSide: "no",
                      orderType: "buy",
                    })
                  }
                >
                  Let's Buy - I'm No
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

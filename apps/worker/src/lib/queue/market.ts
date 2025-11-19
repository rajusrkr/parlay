import { Worker } from "bullmq";
import Redis from "ioredis";
import { db, market } from "@repo/db/dist/src";
import { and, eq } from "drizzle-orm";
import axios from "axios";
import Groq from "groq-sdk";

class MarketQueue {
  private redis: Redis;
  constructor(redis: Redis) {
    this.redis = redis;
  }
  open() {
    new Worker(
      "market_open",
      async (job) => {
        const marketId = job.data.marketId;
        await this.updateMarletStatus(marketId);
      },
      { connection: this.redis }
    ).on("completed", (job) =>
      console.log(
        `Market Open Queue: market with id ${job.data.marketId} is now open.`
      )
    );
  }

  async close() {
    new Worker(
      "market_close",
      async (job) => {
        const marketId = job.data.marketId;

        const [marketDetails] = await db
          .select()
          .from(market)
          .where(
            and(eq(market.marketId, marketId), eq(market.currentStatus, "open"))
          );

        // console.log(marketDetails);

        if (!marketDetails) {
          throw new Error("No open market found with the provided market id");
        }

        switch (marketDetails.marketCategory) {
          case "crypto":
            const dt = new Date();

            console.log(
              `Making req at: ${dt.getHours()}, ${dt.getMinutes()}, ${dt.getSeconds()}`
            );

            const priceDataFromBackpack = await axios.get(
              `https://api.backpack.exchange/api/v1/klines?symbol=${marketDetails.cryptoDetails?.symbol}&interval=${marketDetails.cryptoDetails?.interval}&startTime=${marketDetails.cryptoDetails?.interval === "1d" ? marketDetails.marketEnds - 24 * 60 * 60 : marketDetails.marketEnds}`
            );

            console.log(priceDataFromBackpack.data);



            // Will look for failure later
            if (priceDataFromBackpack.data.length === 0) {
              console.log("going for fetch again");

              const priceDataFromBackpack = await axios.get(
                `https://api.backpack.exchange/api/v1/klines?symbol=${marketDetails.cryptoDetails?.symbol}&interval=${marketDetails.cryptoDetails?.interval}&startTime=${marketDetails.cryptoDetails?.interval === "1d" ? marketDetails.marketEnds - 24 * 60 * 60 : marketDetails.marketEnds}`
              );

              const aiRes = await this.aiDecissionMaker(
                marketDetails.title,
                marketDetails.outcomes,
                priceDataFromBackpack.data[0]
              );

              console.log(aiRes);

              const finalOutcomes = marketDetails.outcomes.map((otcm) => {
                return otcm.title === aiRes.answer
                  ? { ...otcm, price: 1 }
                  : { ...otcm, price: 0 };
              });

              console.log(finalOutcomes);

              await db
                .update(market)
                .set({
                  outcomes: finalOutcomes,
                  winnerSide: aiRes.answer,
                  currentStatus: "settled",
                })
                .where(eq(market.marketId, marketId));

              break;
            }

            const aiRes = await this.aiDecissionMaker(
              marketDetails.title,
              marketDetails.outcomes,
              priceDataFromBackpack.data[0]
            );

            console.log(aiRes);

            const finalOutcomes = marketDetails.outcomes.map((otcm) => {
              return otcm.title === aiRes.answer
                ? { ...otcm, price: 1 }
                : { ...otcm, price: 0 };
            });

            console.log(finalOutcomes);

            await db
              .update(market)
              .set({
                outcomes: finalOutcomes,
                winnerSide: aiRes.answer,
                currentStatus: "settled",
              })
              .where(eq(market.marketId, marketId));

            break;

          default:
            throw new Error("Unknow market type");
        }
      },
      { connection: this.redis }
    );
  }

  private async aiDecissionMaker(question: string, reference: any, data: any) {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    console.log("groq groq");

    const groqRes = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a strict multiple-choice evaluator",
        },
        {
          role: "user",
          content: `
		    Answer a multiple-choice question using only the given reference data.
		  Rules:
      - Use only the reference data to select an answer.
      - The correct answer must exactly match one of the provided multiple choices based on the reference data.
      - If the reference data is null/undefined, or none of the choices can be confirmed as correct from it, return null.
      - Output must be ONLY in this format: {"answer":"<choice>"} with no other text.
      
      ### Question
      ${JSON.stringify(question)}

      ### Multiple choices
      ${JSON.stringify(reference)}

      ### Reference data
      ${JSON.stringify(data)}
		`,
        },
      ],
      model: "openai/gpt-oss-20b",
    });
    const answer = groqRes.choices[0].message.content;
    console.log(answer);

    return JSON.parse(answer!);
  }

  private async updateMarletStatus(marketId: string) {
    try {
      await db
        .update(market)
        .set({
          currentStatus: "open",
        })
        .where(eq(market.marketId, marketId));
    } catch (error) {
      throw new Error(
        `Unable to change market status to open for the market:${marketId}. Error: ${error instanceof Error ? error.message : "Unknown"}`
      );
    }
  }
}

export { MarketQueue };

/**
 * I need redis also in another places
 *
 * What will be the job this market worker???
 * 1. Opening market
 * 2. Closing market
 * 3. Change market  status, like open to stale
 * 4. Users balance settle
 *      How i will settle users balance
 *          => Get the winner and the Market, and then make a db call
 *             to update the market outcomes, update the winner and make
 *             the price 1, and update the winner
 *      Do not update those position that have 0 qty
 *      add column in position table => settled_price
 *
 *
 *
 *
 * When closing a crypto market what question should i ask?
 * Which candle should i take?
 * when should i stop trading?
 * if one api req fails what then?
 */

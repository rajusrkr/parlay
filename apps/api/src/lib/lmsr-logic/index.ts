import { type Outcomes } from "@repo/types/dist/src"

class LMSRLogic {
    private readonly b: number = 1000;

    private outcomes: Outcomes[];
    private selectedOutcomeIndex: number;
    private orderedQty: number
    constructor(outcomes: Outcomes[], selectedOutcomeIndex: number, orderedQty: number) {
        this.outcomes = outcomes;
        this.selectedOutcomeIndex = selectedOutcomeIndex;
        this.orderedQty = orderedQty
    }

    /**
     * @param quantities 
     * @returns a number that is the cost depended on quantities
     */
    private cost(quantities: number[]): number {
        const maxQ = Math.max(...quantities.map((qty) => qty / this.b));
        const sumExp = quantities.map((qty) => Math.exp(qty / this.b - maxQ)).reduce((acc, val) => acc + val, 0);

        const cost = this.b * (maxQ + Math.log(sumExp))
        return cost
    }

    /**
     * @param quantities 
     * @returns a array of calculated prices
     */
    private price(quantities: number[]): number[] {
        const maxQ = Math.max(...quantities.map((qty) => qty / this.b));
        const expVals = quantities.map((qty) => Math.exp(qty / this.b - maxQ))
        const sumExp = expVals.reduce((acc, val) => acc + val, 0);

        const prices = expVals.map((val) => val / sumExp)
        return prices
    }

    buy(): { returnThingsToUser: Outcomes[], tradeCost: number } {
        const providedQty = this.outcomes.map((outcome) => outcome.tradedQty);
        const addedQty = [...providedQty];
        addedQty[this.selectedOutcomeIndex] += this.orderedQty

        const tradeCost = (this.cost(addedQty) - this.cost(providedQty))
        const newPrices = this.price(addedQty)
        const newActiveVolume = this.outcomes[this.selectedOutcomeIndex].totalActiveVolume + tradeCost;

        const returnThingsToUser = this.outcomes.map((outcome, i) => ({
            ...outcome,
            price: newPrices[i],
            tradedQty: addedQty[i],
            totalActiveVolume: i === this.selectedOutcomeIndex ? newActiveVolume : this.outcomes[i].totalActiveVolume
        }))

        return { returnThingsToUser, tradeCost }
    }

    sell() {
        const providedQty = this.outcomes.map((outcome) => outcome.tradedQty);
        const substractedQty = [...providedQty]
        substractedQty[this.selectedOutcomeIndex] -= this.orderedQty;

        const returnToTheUser = (this.cost(providedQty) - this.cost(substractedQty))
        const newPrices = this.price(substractedQty)
        const newActiveVolume = this.outcomes[this.selectedOutcomeIndex].totalActiveVolume - returnToTheUser;

    }
}   
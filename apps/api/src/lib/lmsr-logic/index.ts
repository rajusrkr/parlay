import { type Outcome } from "@repo/types/dist/src"

class LMSRLogic {
    private readonly b: number = 1000;

    private outcomes: Outcome[];
    private selectedOutcomeIndex: number;
    private orderedQty: number

    constructor(outcomes: Outcome[], selectedOutcomeIndex: number, orderedQty: number) {
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

    buy(): { calculatedOutcomes: Outcome[], tradeCost: number } {
        const providedQty = this.outcomes.map((outcome) => outcome.totalActiveTradingVolume);
        const addedQty = [...providedQty];
        addedQty[this.selectedOutcomeIndex] += this.orderedQty

        const tradeCost = (this.cost(addedQty) - this.cost(providedQty))
        const newPrices = this.price(addedQty)
        const newActiveVolume = this.outcomes[this.selectedOutcomeIndex].totalActiveTradingVolume + this.orderedQty;

        const calculatedOutcomes = this.outcomes.map((outcome, i) => ({
            ...outcome,
            price: newPrices[i],
            totalActiveTradingVolume: i === this.selectedOutcomeIndex ? newActiveVolume : this.outcomes[i].totalActiveTradingVolume
        }))

        return { calculatedOutcomes, tradeCost }
    }

    sell(): { returnToTheUser: number, calculatedOutcomes: Outcome[] } {
        const providedQty = this.outcomes.map((outcome) => outcome.totalActiveTradingVolume);
        const substractedQty = [...providedQty]
        substractedQty[this.selectedOutcomeIndex] -= this.orderedQty;

        const returnToTheUser = this.cost(substractedQty) - this.cost(providedQty)
        const newPrices = this.price(substractedQty)
        const newActiveVolume = this.outcomes[this.selectedOutcomeIndex].totalActiveTradingVolume - this.orderedQty;

        const calculatedOutcomes = this.outcomes.map((outcome, i) => ({
            ...outcome,
            price: newPrices[i],
            totalActiveTradingVolume: i === this.selectedOutcomeIndex ? newActiveVolume : this.outcomes[i].totalActiveTradingVolume
        }))

        return { returnToTheUser, calculatedOutcomes }

    }
}


export { LMSRLogic }
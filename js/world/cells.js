// WORLD-LAB v0.2.5 §8. Pure structural value, no effect execution.
class Cell {
    constructor(traversal, effect) {
        if (!validate_Cell({traversal, effect})) {
            throw new ContractError("invalid initial_state");
        }
        this.traversal = traversal;
        this.effect = effect === null ? null : {...effect};
    }

    static free() {
        return new Cell("FREE", null);
    }

    static blocked() {
        return new Cell("BLOCKED", null);
    }

    copy() {
        if (!validate_Cell(this)) throw new ContractError("invalid initial_state");
        return new Cell(this.traversal, this.effect);
    }
}

// Celda del grid. Tipo puro, sin lógica.
// Contrato: js/world/cell.js según especificación §8.1.
//
// traversal: "FREE" | "BLOCKED"
// effect:    null | { kind: "RESOURCE", stock: 0|1 } | { kind: "HAZARD" }

class Cell {
    constructor(traversal, effect) {
        this.traversal = traversal;
        this.effect = effect || null;
    }

    static free() {
        return new Cell("FREE", null);
    }

    static blocked() {
        return new Cell("BLOCKED", null);
    }
}

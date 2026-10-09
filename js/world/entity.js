// Entidad. Tipo puro, sin lógica.
// Contrato: js/world/entity.js según especificación §8.2.

class EntityState {
    constructor(id, position, energy) {
        this.id = id;
        this.position = { x: position.x, y: position.y };
        this.energy = energy;
    }

    copy() {
        return new EntityState(this.id, this.position, this.energy);
    }
}

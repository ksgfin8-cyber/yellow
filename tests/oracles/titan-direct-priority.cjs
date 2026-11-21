'use strict';
// Test oracle only. No imports from TITAN, no costs/phi/L/argmin or selector calls.
class DirectPriorityOracle {
    #visited;
    #consumed;
    constructor() { this.reset(); }
    reset() { this.#visited=new Set();this.#consumed=new Set(); }
    memory() { return {visited:[...this.#visited],consumed:[...this.#consumed]}; }
    step(feedback) {
        const self=feedback.observation.self, view=feedback.observation.local_view;
        this.#visited.add(self.position.x+','+self.position.y);
        if(feedback.has_prior_action) for(const event of feedback.last_action_result.events) {
            if(event.type==='RESOURCE_CONSUMED') this.#consumed.add(event.position.x+','+event.position.y);
        }
        const adjacent=[
            ['MOVE_N',self.position.x,self.position.y-1,view[0][1]],
            ['MOVE_E',self.position.x+1,self.position.y,view[1][2]],
            ['MOVE_S',self.position.x,self.position.y+1,view[2][1]],
            ['MOVE_W',self.position.x-1,self.position.y,view[1][0]]
        ];
        for(const [type,x,y,cell] of adjacent) if(cell.representation==='RESOURCE'&&!this.#consumed.has(x+','+y)) return {type};
        for(const [type,x,y,cell] of adjacent) if(cell.representation==='FREE'&&!this.#visited.has(x+','+y)) return {type};
        return {type:'WAIT'};
    }
}
module.exports={DirectPriorityOracle};

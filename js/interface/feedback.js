// Feedback. Proyección de ActionResult + Observation según FeedbackConfig.
// Contrato: js/interface/feedback.js según especificación §13.

class FeedbackConfig {
    constructor(params) {
        this.expose_validity = !!params.expose_validity;
        this.expose_reason = !!params.expose_reason;
        this.expose_events = !!params.expose_events;
        Object.freeze(this);
    }

    static defaults() {
        return new FeedbackConfig({
            expose_validity: true,
            expose_reason: false,
            expose_events: false
        });
    }
}

const NONE_FEEDBACK = Object.freeze({
    validity: "NONE",
    reason: "NONE",
    events: []
});

function build_feedback(observation, last_action_result, feedback_config) {
    const fb = {
        observation: observation,
        action_validity: "NONE",
        action_reason: "NONE",
        action_events: []
    };

    if (!last_action_result) {
        return fb;
    }

    if (feedback_config.expose_validity) {
        fb.action_validity = last_action_result.validity;
    }
    if (feedback_config.expose_reason) {
        fb.action_reason = last_action_result.reason;
    }
    if (feedback_config.expose_events) {
        fb.action_events = last_action_result.events.slice();
    }

    return fb;
}

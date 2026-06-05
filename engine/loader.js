// DSLO Meaning Physics Engine — Shared Loader (v0.1)

const Engine = {
    fields: {
        drift: null,
        continuity: null,
        curvature: null,
        collapse: null,
        restoration: null,
        susceptibility: null
    },

    async loadJSON(path) {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed to load ${path}: ${response.status}`);
        }
        return response.json();
    },

    async loadFields() {
        this.fields.drift = await this.loadJSON("../fields/DriftField.json");
        this.fields.continuity = await this.loadJSON("../fields/ContinuityField.json");
        this.fields.curvature = await this.loadJSON("../fields/CurvatureField.json");
        this.fields.collapse = await this.loadJSON("../fields/CollapseBoundaries.json");
        this.fields.restoration = await this.loadJSON("../fields/RestorationFlows.json");
        this.fields.susceptibility = await this.loadJSON("../fields/SusceptibilityWindows.json");

        return this.fields;
    },

    // v0.1 API — simple getters
    getDrift() {
        return this.fields.drift;
    },

    getContinuity() {
        return this.fields.continuity;
    },

    getCurvature() {
        return this.fields.curvature;
    },

    getCollapseBoundaries() {
        return this.fields.collapse;
    }

    ,

    getRestorationFlows() {
        return this.fields.restoration;
    },

    getSusceptibilityWindows() {
        return this.fields.susceptibility;
    }
};

// Expose globally
window.Engine = Engine;

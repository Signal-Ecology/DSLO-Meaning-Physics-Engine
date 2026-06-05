// DSLO Meaning Physics Engine — Shared Loader (v0.2)
// Adds schema validation for all six physics fields.

const Engine = {
    fields: {
        drift: null,
        continuity: null,
        curvature: null,
        collapse: null,
        restoration-flows: null,
        susceptibility: null
    },

    schemas: {
        drift: null,
        continuity: null,
        curvature: null,
        collapse: null,
        restoration-flows: null,
        susceptibility: null
    },

    async loadJSON(path) {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed to load ${path}: ${response.status}`);
        }
        return response.json();
    },

    async loadSchemas() {
        this.schemas.drift = await this.loadJSON("../schemas/DriftField.schema.json");
        this.schemas.continuity = await this.loadJSON("../schemas/ContinuityField.schema.json");
        this.schemas.curvature = await this.loadJSON("../schemas/CurvatureField.schema.json");
        this.schemas.collapse = await this.loadJSON("../schemas/CollapseBoundaries.schema.json");
        this.schemas.restoration-flows = await this.loadJSON("../schemas/RestorationFlows.schema.json");
        this.schemas.susceptibility = await this.loadJSON("../schemas/SusceptibilityWindows.schema.json");
    },

    async loadFields() {
        // Load schemas first
        await this.loadSchemas();

        // Load fields
        this.fields.drift = await this.loadJSON("../fields/DriftField.json");
        this.fields.continuity = await this.loadJSON("../fields/ContinuityField.json");
        this.fields.curvature = await this.loadJSON("../fields/CurvatureField.json");
        this.fields.collapse = await this.loadJSON("../fields/CollapseBoundaries.json");
        this.fields.restoration-flows = await this.loadJSON("../fields/RestorationFlows.json");
        this.fields.susceptibility = await this.loadJSON("../fields/SusceptibilityWindows.json");

        // Validate each field
        this.validateField("drift", this.fields.drift, this.schemas.drift);
        this.validateField("continuity", this.fields.continuity, this.schemas.continuity);
        this.validateField("curvature", this.fields.curvature, this.schemas.curvature);
        this.validateField("collapse", this.fields.collapse, this.schemas.collapse);
        this.validateField("restoration-flows", this.fields.restoration-flows, this.schemas.restoration-flows);
        this.validateField("susceptibility", this.fields.susceptibility, this.schemas.susceptibility);

        return this.fields;
    },

    // Minimal deterministic validator (no external libs)
    validateField(name, data, schema) {
        if (!schema || !schema.properties) {
            console.warn(`No schema found for ${name}`);
            return;
        }

        // Check required fields
        if (schema.required) {
            schema.required.forEach(req => {
                if (!(req in data)) {
                    throw new Error(`Validation error in ${name}: missing required field "${req}"`);
                }
            });
        }

        // Check const fields (e.g., field: "drift")
        Object.entries(schema.properties).forEach(([key, rule]) => {
            if (rule.const && data[key] !== rule.const) {
                throw new Error(
                    `Validation error in ${name}: field "${key}" must be "${rule.const}", got "${data[key]}"`
                );
            }
        });

        // v0.2: Only structural validation — no deep recursion yet
        console.log(`✓ ${name} validated successfully`);
    },

    // v0.1 API — simple getters
    getDrift() { return this.fields.drift; },
    getContinuity() { return this.fields.continuity; },
    getCurvature() { return this.fields.curvature; },
    getCollapseBoundaries() { return this.fields.collapse; },
    getRestorationFlows() { return this.fields.restoration-flows; },
    getSusceptibilityWindows() { return this.fields.susceptibility; }
};

// Expose globally
window.Engine = Engine;

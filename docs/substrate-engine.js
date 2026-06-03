// DSLO Deterministic Semantic Layered Orchestration
// v0.1 – Proof-of-Concept Substrate Engine

const DSLO_Substrate = (() => {
    const ROOT = "./docs";

    async function loadJSON(path) {
        const res = await fetch(path);
        if (!res.ok) {
            throw new Error(`Failed to load ${path}: ${res.status} ${res.statusText}`);
        }
        return res.json();
    }

    async function loadManifest() {
        return loadJSON(`${ROOT}/manifest.json`);
    }

    async function loadCorpusEntry(entry) {
        const fullPath = `${ROOT}/corpus/${entry.path}`;
        const data = await loadJSON(fullPath);
        return {
            id: entry.id,
            type: entry.type,
            version: entry.version,
            data
        };
    }

    async function loadCorpus(manifest) {
        if (!manifest.corpus || !Array.isArray(manifest.corpus)) {
            return [];
        }
        const tasks = manifest.corpus.map(loadCorpusEntry);
        return Promise.all(tasks);
    }

    async function loadGraphs(manifest) {
        if (!manifest.graphs || !Array.isArray(manifest.graphs)) {
            return [];
        }
        const tasks = manifest.graphs.map(g => loadJSON(`${ROOT}/graphs/${g.path}`));
        const graphs = await Promise.all(tasks);
        return graphs.map((g, i) => ({
            id: manifest.graphs[i].id,
            type: manifest.graphs[i].type,
            data: g
        }));
    }

    async function loadInvariants(manifest) {
        if (!manifest.invariants || !Array.isArray(manifest.invariants)) {
            return [];
        }
        const tasks = manifest.invariants.map(inv => loadJSON(`${ROOT}/invariants/${inv.path}`));
        const invariants = await Promise.all(tasks);
        return invariants.map((inv, i) => ({
            id: manifest.invariants[i].id,
            scope: manifest.invariants[i].scope || "local",
            data: inv
        }));
    }

    async function initialize() {
        // 1. Load manifest
        const manifest = await loadManifest();

        // 2. Load core components in parallel
        const [corpus, graphs, invariants] = await Promise.all([
            loadCorpus(manifest),
            loadGraphs(manifest),
            loadInvariants(manifest)
        ]);

        // 3. Build deterministic payload
        const payload = {
            version: manifest.version || "0.1",
            timestamp: new Date().toISOString(),
            manifest,
            corpus,
            graphs,
            invariants
        };

        return payload;
    }

    return {
        initialize
    };
})();

// Expose globally for browser
window.DSLO_Substrate = DSLO_Substrate;


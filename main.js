// main.js - AVIA_TECH Initialization and Vega-Lite Config
document.addEventListener('DOMContentLoaded', () => {
    // Configuration for Vega-Lite charts tailored for a clean white background
    const vegaOptions = {
        actions: true,
        config: {
            background: "transparent", // Container is white, so transparent is fine
            view: { stroke: "transparent" },
            axis: {
                domainColor: "#475569", // slate-600
                gridColor: "rgba(0, 0, 0, 0.05)",
                labelColor: "#334155", // slate-700
                titleColor: "#0f172a", // slate-900 (dark)
                titleFontWeight: 600
            },
            legend: {
                labelColor: "#334155",
                titleColor: "#0f172a",
                titleFontWeight: 600
            },
            title: {
                color: "#0f172a",
                fontWeight: 700
            }
        }
    };

    // Initialize the Vega-Lite charts
    // Catch errors gracefully
    const mountChart = (id, spec, options) => {
        vegaEmbed(id, spec, options).catch(err => {
            console.error(`Error loading chart ${id}:`, err);
            const container = document.querySelector(id);
            if (container) {
                container.innerHTML = `<span class="text-red-500 font-mono-data">Error loading visualization</span>`;
            }
        });
    };

    // Mount charts from JSON files
    mountChart('#vis1', 'heatmap.json', vegaOptions);
    mountChart('#vis2', 'barras.json', vegaOptions);
    mountChart('#vis3', 'bump_chart.json', vegaOptions);
    mountChart('#vis4', 'dashboard.json', vegaOptions);
});

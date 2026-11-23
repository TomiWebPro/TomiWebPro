/**
 * tomiweb.pro — Spatial 3D Engine Launcher
 * Seamless bridge initializing SpatialEngine with full multi-mode support.
 */

(function () {
  'use strict';

  function bootSpatial() {
    const canvas = document.getElementById('spatial-canvas');
    if (!canvas) return;

    if (typeof SpatialEngine !== 'undefined') {
      window.spatialInstance = new SpatialEngine('spatial-canvas', {
        mode: 'lattice',
        numNodes: 42,
        numDust: 36,
        accentColor: '184, 134, 59',
        inkColor: '28, 27, 24'
      });

      // Bind mode switcher buttons
      const modeButtons = document.querySelectorAll('[data-spatial-mode]');
      modeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetMode = btn.getAttribute('data-spatial-mode');
          if (window.spatialInstance) {
            window.spatialInstance.setMode(targetMode);
          }
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootSpatial);
  } else {
    bootSpatial();
  }
})();

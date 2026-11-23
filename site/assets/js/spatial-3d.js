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
      const modes = ['lattice', 'gyroscope', 'field'];
      const startMode = modes[Math.floor(Math.random() * modes.length)];
      window.spatialInstance = new SpatialEngine('spatial-canvas', {
        mode: startMode,
        numNodes: 42,
        numDust: 36,
        accentColor: '184, 134, 59',
        inkColor: '28, 27, 24'
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootSpatial);
  } else {
    bootSpatial();
  }
})();

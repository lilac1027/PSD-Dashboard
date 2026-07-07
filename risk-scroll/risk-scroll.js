/**
 * Risk Projects Scrolling List — Reusable Component
 * ==================================================
 * Smooth continuous upward scroll, 5 rows visible, expandable detail rows, auto-loops.
 * Zero external dependencies.
 *
 * Data format (each item):
 *   { project: string, country: string, riskScore: number, issue: string,
 *     nextAction?: string, owner?: string, targetDate?: string }
 *
 * Usage:
 *   1. Include risk-scroll.css and this file
 *   2. Add a container: <div id="risk-panel"></div>
 *   3. Call: initRiskScroll(dataArray, { containerId: 'risk-panel', title: 'Risk Projects' })
 */

(function(global) {
  'use strict';

  var RISK_ROW_H = 49;
  var RISK_SCROLL_SPEED = 20; // px/sec
  var riskScrollRAF = null;
  var riskScrollOffset = 0;

  /**
   * Build the full risk panel HTML and append to container.
   * @param {Array} data - Array of risk project objects
   * @param {Object} opts - { containerId, title, subtitle, geoMap }
   */
  function buildPanel(data, opts) {
    var container = document.getElementById(opts.containerId || 'risk-panel');
    if (!container) return;

    var geoMap = opts.geoMap || {};
    var title = opts.title || 'Risk Projects';
    var subtitle = opts.subtitle || '';

    var itemsHTML = data.length === 0
      ? '<div style="padding:10px;text-align:center;font-size:10px;color:#8899aa;">No risk projects</div>'
      : data.map(function(p, i) {
          var cls = i < 3 ? 'red' : i < 6 ? 'amber' : 'blue';
          var geoName = geoMap[p.country] || '';
          var rid = 'risk-' + i;
          return '<div class="risk-item" id="' + rid + '-header" onclick="RiskScroll.toggleDetail(\'' + rid + '\')">' +
            '<div class="num ' + cls + '">' + (i + 1) + '</div>' +
            '<div class="info">' +
              '<div class="pname">' + p.project + '</div>' +
              '<div class="pdetail"><span>' + p.country + '</span><span>' + (geoName.split(' (')[0] || '') + '</span><span>' + p.issue + '</span></div>' +
            '</div>' +
            '<div class="score">' + p.riskScore + '</div>' +
            '<span style="font-size:8px;color:#8899aa;flex-shrink:0;">&#9660;</span>' +
          '</div>' +
          '<div class="risk-detail" id="' + rid + '-detail">' +
            '<div class="rd-row"><span class="rd-label">Next Action:</span><span class="rd-val">' + (p.nextAction || 'N/A') + '</span></div>' +
            '<div class="rd-row"><span class="rd-label">Owner:</span><span class="rd-val">' + (p.owner || 'N/A') + '</span></div>' +
            '<div class="rd-row"><span class="rd-label">Target Date:</span><span class="rd-val">' + (p.targetDate || 'N/A') + '</span></div>' +
          '</div>';
        }).join('');

    container.className = 'risk-panel';
    container.innerHTML =
      '<div class="risk-panel-header">' +
        '<h4>&#128680; ' + title + '</h4>' +
        (subtitle ? '<div class="ctx">' + subtitle + '</div>' : '') +
      '</div>' +
      '<div class="risk-list-wrap" id="risk-list-wrap">' +
        '<div class="risk-list-inner" id="risk-list-inner">' + itemsHTML + '</div>' +
      '</div>' +
      '<div class="risk-panel-footer">Total ' + data.length + ' projects</div>';
  }

  /**
   * Start the continuous scroll animation.
   */
  function startScroll() {
    if (riskScrollRAF) { cancelAnimationFrame(riskScrollRAF); riskScrollRAF = null; }
    riskScrollOffset = 0;

    var inner = document.getElementById('risk-list-inner');
    if (!inner) return;
    inner.style.transform = 'translateY(0)';
    inner.style.transition = 'none';

    var items = inner.querySelectorAll('.risk-item');
    if (items.length <= 5) return;

    var lastTime = performance.now();

    function scroll(now) {
      var dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      riskScrollOffset += RISK_SCROLL_SPEED * dt;

      if (riskScrollOffset >= RISK_ROW_H) {
        riskScrollOffset -= RISK_ROW_H;
        var firstItem = inner.querySelector('.risk-item');
        var firstDetail = inner.querySelector('.risk-detail');
        if (firstItem) {
          firstItem.classList.remove('expanded');
          if (firstDetail) { firstDetail.classList.remove('show'); inner.appendChild(firstDetail); }
          inner.appendChild(firstItem);
        }
      }

      inner.style.transform = 'translateY(-' + riskScrollOffset + 'px)';
      riskScrollRAF = requestAnimationFrame(scroll);
    }

    riskScrollRAF = requestAnimationFrame(scroll);
  }

  /**
   * Stop the scroll animation and clean up.
   */
  function stopScroll() {
    if (riskScrollRAF) { cancelAnimationFrame(riskScrollRAF); riskScrollRAF = null; }
    riskScrollOffset = 0;
  }

  /**
   * Toggle expand/collapse of a risk item's detail.
   * @param {string} rid - Risk item ID prefix
   */
  function toggleDetail(rid) {
    var header = document.getElementById(rid + '-header');
    var detail = document.getElementById(rid + '-detail');
    if (!header || !detail) return;
    var isOpen = detail.classList.contains('show');
    // Close all others
    var allDetails = document.querySelectorAll('.risk-detail.show');
    var allHeaders = document.querySelectorAll('.risk-item.expanded');
    for (var i = 0; i < allDetails.length; i++) allDetails[i].classList.remove('show');
    for (var j = 0; j < allHeaders.length; j++) allHeaders[j].classList.remove('expanded');
    if (!isOpen) {
      detail.classList.add('show');
      header.classList.add('expanded');
    }
  }

  /**
   * Main entry point.
   * @param {Array} data - Risk project array
   * @param {Object} opts - { containerId, title, subtitle, geoMap }
   */
  function initRiskScroll(data, opts) {
    opts = opts || {};
    buildPanel(data, opts);
    startScroll();
  }

  // Expose public API
  global.RiskScroll = {
    init: initRiskScroll,
    toggleDetail: toggleDetail,
    start: startScroll,
    stop: stopScroll
  };

})(window);

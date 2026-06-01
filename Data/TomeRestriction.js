// =============================================================================
// TomeRestriction.js  –  Modular Tome Restriction system for FactionCreator
// =============================================================================
// This file is entirely self-contained.  It exposes a single global:
//   window.TomeRestriction
//
// Required ONE-LINE hooks already added to Faction.js:
//   1. SetTomePathOptions, after list is built:
//        if (window.TomeRestriction && TomeRestriction.isEnabled()) list = TomeRestriction.filterTomes(list, tomeInsertionIndex);
//   2. SetRandomStart, after RecalculateStats(false) in the else-branch:
//        if (window.TomeRestriction) TomeRestriction.onRandomize();
//   3. selectTomePath, after toggleOriginButtons():
//        if (window.TomeRestriction && TomeRestriction.isEnabled()) TomeRestriction.updateDisplay();
//
// Required HTML in FactionCreator.html (already added):
//   - <input type="checkbox" id="tomeRestrictionToggle">  (near Tome Path header)
//   - <div id="tomeRestrictionDisplay">                   (below Tome Path header)
// =============================================================================

window.TomeRestriction = (function () {
    "use strict";

    // ── State ─────────────────────────────────────────────────────────────────
    var distribution = null;  // { 1:n, 2:n, 3:n, 4:n, 5:1 }  total slots per tier
    var lockedTier5  = null;  // tome object determined at randomize time
    var baseAff      = null;  // { tag: count } map from culture+societies only (no tomes/extras)

    // ── Public API ────────────────────────────────────────────────────────────

    function isEnabled() {
        var cb = document.getElementById("tomeRestrictionToggle");
        return !!(cb && cb.checked);
    }

    /** Called when the toggle checkbox changes. */
    function onToggle(checked) {
        var el = document.getElementById("tomeRestrictionDisplay");
        if (!checked) {
            distribution = null;
            lockedTier5  = null;
            baseAff      = null;
            if (el) el.style.display = "none";
        } else if (!distribution) {
            if (el) {
                el.style.display = "block";
                el.innerHTML = _promptHtml();
            }
        }
    }

    /** Called by SetRandomStart (hook #2) after RecalculateStats. */
    function onRandomize() {
        if (!isEnabled()) return;
        distribution = _generateDistribution();
        // Capture the FULL affinity total visible to the user at randomize time
        // (culture + societies + starting tome + extra points).
        // This is what defines the affinity ordering that must be preserved.
        baseAff = _parseAffinityTotal(
            typeof currentAffinityTotal !== "undefined" ? currentAffinityTotal : _computeBaseAffinities()
        );
        lockedTier5  = _selectTier5Tome();
        updateDisplay();
    }

    /**
     * Filters the tome list shown in the picker popup.
     * Called by SetTomePathOptions (hook #1).
     * @param {Array}  list           - tomes from GetNextSetOfTomes, duplicates already removed
     * @param {number} insertionIndex - current tomeInsertionIndex from Faction.js
     */
    function filterTomes(list, insertionIndex) {
        if (!distribution) return list;

        // Position of the new tome in the final list (0-based)
        var insertPos = (insertionIndex === undefined || insertionIndex < 0)
            ? currentTomeList.length
            : insertionIndex + 1;

        // ── Final slot (#9): only the locked T5 tome ─────────────────────────
        if (insertPos >= 8) {
            return lockedTier5
                ? [lockedTier5]
                : list.filter(function (t) { return t.tier === 5; });
        }

        // ── Check if T5 is already selected ────────────────────────────────────
        var tier5Selected = isTier5Selected();

        var currentCounts  = _getTierCounts(currentTomeList);
        var affAtInsertion = _getAffinityAtIndex(insertPos);
        var playerElements = _getPlayerElements(affAtInsertion);

        // 1. Quota constraint: FREED after T5 selected, otherwise apply quota
        if (!tier5Selected) {
            // Before T5 selected: apply normal quota restrictions
            list = list.filter(function (t) {
                var quota = distribution[t.tier] || 0;
                if (quota === 0) return false;
                return (currentCounts[t.tier] || 0) < quota;
            });
        } else {
            // After T5 selected: quotas freed for T1-T4, but block other T5
            list = list.filter(function (t) {
                if (t.tier === 5) return false;  // No more T5 tomes allowed
                return true;                      // T1-T4 quotas are freed
            });
        }

        // 2. Only tomes whose affinity elements match the player's element set
        list = list.filter(function (t) {
            return _tomeElementsMatchPlayer(t, playerElements);
        });

        // 3. Exclude tomes that would violate affinity ordering
        list = list.filter(function (t) {
            return !_wouldViolateAffinityOrder(t, affAtInsertion);
        });

        // 4. Never show the locked T5 tome before the final slot
        if (lockedTier5) {
            list = list.filter(function (t) { return t !== lockedTier5; });
        }

        return list;
    }

    /** Re-renders the distribution progress bar below the Tome Path header. */
    function updateDisplay() {
        var el = document.getElementById("tomeRestrictionDisplay");
        if (!el) return;
        if (!distribution || !isEnabled()) {
            el.style.display = "none";
            return;
        }
        el.style.display = "block";
        el.innerHTML = _buildDisplayHtml();
    }

    // ── Distribution Generation ───────────────────────────────────────────────

    /**
     * Randomly builds a { 1:n1, 2:n2, 3:n3, 4:n4, 5:1 } distribution where:
     *   n1 + n2 + n3 + n4 = 8,  n1 >= 1,  n5 = 1  (always one T5)
     * Pre-requisite constraints kept so the path is achievable:
     *   n2 > 0  →  n1 >= 2         (need 2 tomes before first T2)
     *   n3 > 0  →  n1+n2 >= 4      (need 4 tomes before first T3)
     *   n4 > 0  →  n1+n2+n3 >= 6   (need 6 tomes before first T4)
     */
    function _generateDistribution() {
        var n1, n2, n3, n4, tries = 0;
        do {
            n1 = _rand(1, 5);
            n2 = _rand(0, Math.min(4, 8 - n1));
            n3 = _rand(0, Math.min(3, 8 - n1 - n2));
            n4 = 8 - n1 - n2 - n3;
            tries++;
            if (n4 < 0)                       continue;
            if (n2 > 0 && n1 < 2)             continue;
            if (n3 > 0 && n1 + n2 < 4)        continue;
            if (n4 > 0 && n1 + n2 + n3 < 6)   continue;
            break;
        } while (tries < 200);
        return { 1: n1, 2: n2, 3: n3, 4: n4, 5: 1 };
    }

    /**
     * Picks the T5 tome based on BASE affinities only
     * (culture + societies + subtype/subculture — no tomes, no extra affinity points).
     * Hybrid T5 tomes that contain the primary element also qualify.
     * If multiple elements are tied for highest, one is chosen at random.
     */
    function _selectTier5Tome() {
        // Use the captured base affinity map (set in onRandomize) for T5 selection.
        // Fall back to _computeBaseAffinities if called before onRandomize.
        var affStr      = (typeof currentAffinityTotal !== "undefined") ? currentAffinityTotal : _computeBaseAffinities();
        var topElements = _getTopAffinityElements(affStr);

        // Candidates: T5 tomes (excluding Cosmos) that reference a top-affinity element
        var pool = (typeof jsonTomes !== "undefined" ? jsonTomes : []).filter(function (t) {
            if (t.tier !== 5)                  return false;
            if (t.id === "tome_of_the_cosmos")  return false;
            if (!t.affinities)                  return false;
            return topElements.some(function (el) { return t.affinities.indexOf(el) !== -1; });
        });

        // Fallback: any T5 (except Cosmos)
        if (!pool.length) {
            pool = (typeof jsonTomes !== "undefined" ? jsonTomes : []).filter(function (t) {
                return t.tier === 5 && t.id !== "tome_of_the_cosmos";
            });
        }
        if (!pool.length) return null;
        return pool[Math.floor(Math.random() * pool.length)];
    }

    // ── Affinity Helpers ──────────────────────────────────────────────────────

    /**
     * Returns the affinity total string computed from culture/societies/subtype only —
     * EXCLUDING tome contributions and extra affinity points.
     */
    function _computeBaseAffinities() {
        // Temporarily zero out the extra-affinity globals defined in Faction.js
        var sO = extraOrder,    sC = extraChaos,   sN = extraNature,
            sM = extraMaterium, sSh = extraShadow, sA = extraAstral;
        extraOrder = extraChaos = extraNature = extraMaterium = extraShadow = extraAstral = 0;

        var r = GetAffinityTotalFromList(
            GetCurrentChoiceList(), [],
            currentSubType, currentSubCulture,
            currentSubSociety1, currentSubSociety2
        );

        extraOrder = sO; extraChaos = sC; extraNature = sN;
        extraMaterium = sM; extraShadow = sSh; extraAstral = sA;
        return r;
    }

    /**
     * Returns the affinity total string simulating the state just before the tome
     * at position `index` would be added (i.e. using tomes 0..index-1 only).
     * Includes extra affinity points (they are always active).
     */
    function _getAffinityAtIndex(index) {
        return GetAffinityTotalFromList(
            GetCurrentChoiceList(),
            currentTomeList.slice(0, index),
            currentSubType, currentSubCulture,
            currentSubSociety1, currentSubSociety2
        );
    }

    /**
     * Parses a GetAffinityTotalFromList result string into a { tag: count } map.
     * Input format: " <empirearcana></empirearcana> 3  <empireorder></empireorder> 2 …"
     */
    function _parseAffinityTotal(str) {
        var map = {}, re = /<(\w+)><\/\1>\s*(\d+)/g, m;
        while ((m = re.exec(str)) !== null) map[m[1]] = parseInt(m[2], 10);
        return map;
    }

    /**
     * Parses a tome `affinities` field into a { tag: pointCount } contribution map.
     * Input format: "1 <empirearcana></empirearcana> Empire Astral Affinity, …"
     */
    function _parseTomeContrib(str) {
        var map = {}, re = /(\d+)\s+<(\w+)><\/\2>/g, m;
        while ((m = re.exec(str)) !== null) {
            var k = m[2], v = parseInt(m[1], 10);
            map[k] = (map[k] || 0) + v;
        }
        return map;
    }

    /** Returns all affinity element tags whose count is > 0. */
    function _getPlayerElements(affinityStr) {
        var map = _parseAffinityTotal(affinityStr);
        return Object.keys(map).filter(function (k) { return map[k] > 0; });
    }

    /** Returns the element tag(s) with the highest count (for T5 selection). */
    function _getTopAffinityElements(affinityStr) {
        var map  = _parseAffinityTotal(affinityStr);
        var keys = Object.keys(map);
        if (!keys.length) return [];
        var max = Math.max.apply(null, keys.map(function (k) { return map[k]; }));
        return keys.filter(function (k) { return map[k] === max; });
    }

    /**
     * Returns true if AT LEAST ONE affinity element of the tome is present
     * in the player's current element set (playerElements).
     * A hybrid tome (e.g. Chaos+Shadow) shows for any player who has Chaos.
     */
    function _tomeElementsMatchPlayer(tome, playerElements) {
        if (!tome.affinities) return true;
        var contrib  = _parseTomeContrib(tome.affinities);
        var tomeElts = Object.keys(contrib).filter(function (k) { return contrib[k] > 0; });
        if (!tomeElts.length) return true;
        return tomeElts.some(function (el) { return playerElements.indexOf(el) !== -1; });
    }

    /**
     * Returns true if picking this tome would violate the affinity ordering.
     *
     * Two constraints are checked:
     *  1. BASE constraint (fixes the "tie" bug): the ordering established by the
     *     initial base affinities (culture+societies, no tomes) must never be
     *     broken — even if two affinities later become tied in the running total.
     *     e.g. base has Chaos=3 > Order=1 → nxt[chaos] must always remain >= nxt[order].
     *
     *  2. RUNNING constraint: if the running total already has A > B (A got ahead
     *     via earlier tome picks), then nxt[A] must remain >= nxt[B].
     */
    function _wouldViolateAffinityOrder(tome, currentAffinityStr) {
        if (!tome.affinities) return false;
        var cur     = _parseAffinityTotal(currentAffinityStr);
        var contrib = _parseTomeContrib(tome.affinities);

        // Build hypothetical post-tome totals (include any brand-new element tags)
        var nxt = {}, allKeys = Object.keys(cur).concat(Object.keys(contrib)), i, j, k, a, b;
        for (i = 0; i < allKeys.length; i++) { k = allKeys[i]; if (!nxt[k]) nxt[k] = 0; }
        for (k in cur)     { nxt[k] = (nxt[k] || 0) + cur[k]; }
        for (k in contrib) { nxt[k] = (nxt[k] || 0) + contrib[k]; }

        // 1. Base constraint: baseAff[a] > baseAff[b]  →  nxt[a] >= nxt[b]
        if (baseAff) {
            var bKeys = Object.keys(baseAff);
            for (i = 0; i < bKeys.length; i++) {
                for (j = 0; j < bKeys.length; j++) {
                    if (i === j) continue;
                    a = bKeys[i]; b = bKeys[j];
                    if ((baseAff[a] || 0) > (baseAff[b] || 0) &&
                        (nxt[a]    || 0) <  (nxt[b]    || 0)) return true;
                }
            }
        }

        // 2. Running constraint: cur[a] > cur[b]  →  nxt[a] >= nxt[b]
        var cKeys = Object.keys(cur);
        for (i = 0; i < cKeys.length; i++) {
            for (j = 0; j < cKeys.length; j++) {
                if (i === j) continue;
                a = cKeys[i]; b = cKeys[j];
                if (cur[a] > cur[b] && (nxt[a] || 0) < (nxt[b] || 0)) return true;
            }
        }
        return false;
    }

    // ── Tier Count Helpers ────────────────────────────────────────────────────

    function _getTierCounts(list) {
        var c = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, i, t;
        for (i = 0; i < list.length; i++) { t = list[i].tier; if (c[t] !== undefined) c[t]++; }
        return c;
    }

    // ── Display HTML ──────────────────────────────────────────────────────────

    function _promptHtml() {
        return '<span style="color:#d7c297;font-family:\'Decorative\';font-size:12px;">' +
               '&#9854; Click <b>Randomise</b> to generate your tome path restrictions.</span>';
    }

    function _buildDisplayHtml() {
        var counts  = _getTierCounts(currentTomeList);
        var romans  = ["", "I", "II", "III", "IV", "V"];
        var colors  = { 1: "#b5b5b1", 2: "#a3c4e0", 3: "#90c090", 4: "#d4a030", 5: "#e07070" };
        var filled  = "#4caf50";
        var empty   = "#333";

        var html = '<div style="display:flex;flex-wrap:wrap;gap:6px;padding:4px 0 2px 0;align-items:center;">';
        html += '<span style="color:#d7c297;font-family:\'Decorative\';font-size:12px;' +
                'white-space:nowrap;margin-right:2px;">Restrictions:</span>';

        for (var tier = 1; tier <= 5; tier++) {
            var total = distribution[tier] || 0;
            if (total === 0) continue;
            var used  = Math.min(counts[tier] || 0, total);
            var slots = "";
            for (var d = 0; d < total; d++) {
                slots += '<span style="font-size:14px;margin:0 1px;color:' +
                         (d < used ? filled : empty) + ';">&#9632;</span>';
            }

            html += '<div style="display:inline-flex;align-items:center;gap:3px;padding:2px 7px;' +
                    'background:rgba(255,255,255,0.06);border-radius:3px;border:1px solid #3a3a3a;">';
            html += '<span style="color:' + colors[tier] + ';font-family:\'Decorative\';' +
                    'font-size:12px;min-width:22px;text-align:center;">' + romans[tier] + '</span>';
            html += slots;

            if (tier === 5 && lockedTier5) {
                var shortName = lockedTier5.name
                    .replace("Tome of the ", "").replace("Tome of ", "").trim();
                html += '<img src="/aow4db/Icons/TomeIcons/' + lockedTier5.icon + '.png" ' +
                        'height="18px" style="margin-left:5px;vertical-align:middle;" ' +
                        'title="' + _esc(lockedTier5.name) + '">';
                html += '<span style="color:#e07070;font-size:11px;white-space:nowrap;' +
                        'font-family:\'Regular\';">' + _esc(shortName) + '</span>';
            }
            html += '</div>';
        }
        html += '</div>';
        return html;
    }

    function _esc(s) {
        return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
                .replace(/"/g,"&quot;");
    }

    // ── Utilities ─────────────────────────────────────────────────────────────

    /** Returns a random integer in [min, max] inclusive. */
    function _rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // ── Init ─────────────────────────────────────────────────────────────────

    document.addEventListener("DOMContentLoaded", function () {
        var cb = document.getElementById("tomeRestrictionToggle");
        if (cb) cb.addEventListener("change", function () { onToggle(this.checked); });
    });

    // ── Public Interface ──────────────────────────────────────────────────────
    /** Returns the locked T5 tome, or null if not set. */
    function getTier5() {
        return lockedTier5;
    }

    /** Returns the current distribution { 1:n, 2:n, 3:n, 4:n, 5:1 }, or null if not set. */
    function getDistribution() {
        return distribution;
    }

    /** Sets the distribution directly (used for loading from URL). */
    function setDistribution(n1, n2, n3, n4) {
        if (distribution) {
            distribution[1] = n1;
            distribution[2] = n2;
            distribution[3] = n3;
            distribution[4] = n4;
            updateDisplay();
        }
    }

    // ── Check if T5 is selected ──────────────────────────────────────────────
    function isTier5Selected() {
        return !!(lockedTier5 && isInArray(currentTomeList, lockedTier5));
    }

    return {
        isEnabled:     isEnabled,
        onToggle:      onToggle,
        onRandomize:   onRandomize,
        filterTomes:   filterTomes,
        updateDisplay: updateDisplay,
        getTier5:      getTier5,
        getDistribution: getDistribution,
        setDistribution: setDistribution,
        isTier5Selected: isTier5Selected
    };
})();

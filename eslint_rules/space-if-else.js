/**
 * @fileoverview Disallows or enforces spaces between if / else if and condition.
 * @author Philipp Kyeck
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

  //--------------------------------------------------------------------------
  // Helpers
  //--------------------------------------------------------------------------

  function checkIfStatement(node) {
    var diff = node.range[0] - node.test.range[0];

    if (diff !== -4) {
      context.report(node, "Aron, add a space between if and ().");
    }
  }

  function checkForStatement(node) {
    var end, diff, check;

    if (node.init) {
      end = node.init.range[0];
      check = -5;
    } else if (node.test) {
      end = node.test.range[0];
      check = -7;
    } else if (node.update) {
      end = node.update.range[0];
      check = -8;
    }

    diff = node.range[0] - end;

    if (diff !== check) {
      context.report(node, "add a space between for and ().");
    }
  }


  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------

  return {

    "IfStatement": checkIfStatement,
    "ForStatement": checkForStatement
    // "TryStatement": checkTryStatement,
    // "CatchClause": checkCatchClause,
    // "DoWhileStatement": checkBlock("body"),
    // "WhileStatement": checkBlock("body"),
    // "WithStatement": checkBlock("body"),
    // "ForStatement": checkBlock("body"),
    // "ForInStatement": checkBlock("body"),
    // "SwitchStatement": checkSwitchStatement

  };

};

'use strict';

const path = require('path');

/**
 * Final Strike player events
 */
module.exports = (srcPath) => {
  const B = require(srcPath + 'Broadcast');
  const combatPath = path.join(srcPath, '..', 'bundles', 'ranvier-combat', 'lib', 'Combat')
  const sockPath = path.join(srcPath, '..', 'bundles', 'ranvier-websocket', 'lib', 'WebsocketStream')

  const Combat = require(combatPath);
  const WebsocketStream = require(sockPath);

  return  {
    listeners: {
      login: state => function () {
        const strike = state.SkillManager.get("final-strike");

        if (!this.playerClass.hasAbility(strike.id)) {
          if (this.playerClass.id == 'warrior') {
            this.playerClass.config.abilityTable[1] = this.playerClass.config.abilityTable[1] || {}
            this.playerClass.config.abilityTable[1].skills = this.playerClass.config.abilityTable[1].skills || []
            this.playerClass.config.abilityTable[1].skills.push('final-strike');
          }
        }
      }
    }
  };
};

'use strict';

const path = require('path');

module.exports = (srcPath) => {

  const combatPath = path.join(srcPath, '..', 'bundles', 'ranvier-combat', 'lib', 'Combat')
  const classesPath = path.join(srcPath, '..', 'bundles', 'ranvier-classes', 'classes')
  const Combat = require(combatPath);
  const Broadcast = require(srcPath + 'Broadcast');
  const SkillType = require(srcPath + 'SkillType');
  const Damage = require(srcPath + 'Damage');

  // config placed here just for easy copy/paste of this skill later on
  const cooldown = 1;
  const badPercent = 80;
  const goodPercent = 200;
  const healthThreshold = 50;

  return {
    name: 'Final Strike',
    type: SkillType.SKILL,
    requiresTarget: true,
    initiatesCombat: true,
    cooldown,
    aliases: ['finalstrike'],
    
    run: state => function (args, player, target) {
      const targetHPPercent = target.getAttribute('health') / target.getMaxAttribute('health') * 100;
      const activated = healthThreshold > targetHPPercent;
      let damagePercent;

      if (activated) {
        Broadcast.sayAt(player, `<b><yellow>You used Final Strike ${target.name} and got the bonus!</yellow></b>`);
        Broadcast.sayAtExcept(player.room, `<b><yellow>${player.name} used Final Strike on ${target.name} and got the bonus!</yellow></b>`, [target, player]);
        Broadcast.sayAt(target, `<b><yellow>${player.name} used Final Strike on you and got the bonus!</yellow></b>`);
        damagePercent = goodPercent;
      }
      else {
        Broadcast.sayAt(player, `<b><yellow>You used Final Strike ${target.name} but no bonus :(.</yellow></b>`);
        Broadcast.sayAtExcept(player.room, `<b><yellow>${player.name} used Final Strike on ${target.name} but no bonus :(.</yellow></b>`, [target, player]);
        Broadcast.sayAt(target, `<b><yellow>${player.name} used Final Strike on you but no bonus :(.</yellow></b>`);
        damagePercent = badPercent;
      }

      const damage = new Damage({
        attribute: 'health',
        amount: Combat.calculateWeaponDamage(player) * (damagePercent / 100),
        attacker: player,
        type: 'holy',
        source: this
      });

      damage.commit(target);
    },

    info: (player) => {
      return `New Warrior ability. Finish off an opponent by dealing <b>${goodPercent}%</b> weapon damage if they are below <b>${healthThreshold}%</b> health. It deals only <b>${badPercent}%</b> if they are not.`;
    }
  };
};

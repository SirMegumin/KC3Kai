(function () {
  const battle = {};
  const { pipe, juxt, flatten, reduce } = KC3BattlePrediction;
  /*--------------------------------------------------------*/
  /* ----------------------[ PUBLIC ]---------------------- */
  /*--------------------------------------------------------*/

  battle.simulateBattle = (battleData, initalFleets, battleType) => {
    const { battle: { getPhases }, fleets: { simulateAttack } } = KC3BattlePrediction;

    battle.battleType = battleType;
    return pipe(
      juxt(getPhases(battleType)),
      flatten,
      reduce(simulateAttack, initalFleets)
    )(battleData);
  };

  battle.simulateBattlePartially = (battleData, initalFleets, battlePhases = []) => {
    const { fleets: { simulateAttack } } = KC3BattlePrediction;
    const { getPhaseParser } = KC3BattlePrediction.battle;

    // User-defined phases only used by SupportFleet/LBAS analyzing for now, build a pseudo battleType here
    battle.battleType = {
      player: KC3BattlePrediction.Player.SINGLE,
      enemy: KC3BattlePrediction.Enemy.SINGLE,
      time: KC3BattlePrediction.Time.DAY,
      phases: battlePhases
    };
    return pipe(
      juxt(battlePhases.map(getPhaseParser)),
      flatten,
      reduce(simulateAttack, initalFleets)
    )(battleData);
  };

  battle.getBattleType = () => {
    return battle.battleType || {};
  };

  /*--------------------------------------------------------*/
  /* ---------------------[ INTERNAL ]--------------------- */
  /*--------------------------------------------------------*/

  battle.getPhases = (battleType) => {
    const { getBattlePhases, getPhaseParser } = KC3BattlePrediction.battle;
    return getBattlePhases(battleType).map(getPhaseParser);
  };

  /*--------------------------------------------------------*/
  /* ---------------------[ EXPORTS ]---------------------- */
  /*--------------------------------------------------------*/

  Object.assign(window.KC3BattlePrediction.battle, battle);
}());

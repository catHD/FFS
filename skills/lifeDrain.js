// You can safely assume that the following attributes are set:
//
// - id:          ID of this skill.
// - name:        Name of this skill.
// - target:      Target of this skill (if there is only one target). Character.
// - targets:     Array of targets of this skill. [Character].
// - caller:      Character performing using this skill.
// - Round:       Round API.
// - accuracy:    Accuracy of the skill (0...1).
// - multiTarget: Whether this skill is a multi target skill or not.

var Constants = require( '../vendor/constants.js' );

module.exports = function () {
	this.type = Constants.MAGICAL;
	var percentageHealed = -0.5;
	// Initialization, called when a skill is used.
	this.init = function () {
		this.Round.do( this.damage, this );
	};
	this.damage = function () {
		var damageDone = this.target.damage( 3500, this );
		this.caller.damage( damageDone * percentageHealed, this );
	};
};
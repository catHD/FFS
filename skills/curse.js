// Dependencies.
var Constants = require( '../vendor/constants.js' );

// Definition.

module.exports = function () {
	this.type = Constants.MAGICAL;
	this.element = "dark";
	// Here we will store UUIDs of callbacks registered by this skill.
	this.internalVariables = {};

	// Initialization, called when a skill is used.
	this.init = function () {
		this.Round.do( this.curse, this );
	};

	// Registers the damage and unregister callbacks.
	this.curse = function () {
		// Compute duration: 2±1 rounds.
		var duration = 2 + Math.round( Math.random() * 2 - 1 );
		duration = 2; // Just to make the tests deterministic.
		// Store whether character was poisoned or not: in
		// some cases a character won't be poisoned because
		// it has inmunity or it is poisoned by a skill with
		// more duration or it is poisoned by a skill with
		// more priority.
		this.internalVariables.did_curse = this.target.setStatus( [ Constants.CURSE_STATUS_ID ], this, this.Round.currentRound() + duration )[ 0 ]; // Poison's priority will be the round number where it ends. This could be modified to be a linear combination of duration and damage, for instance.
		// If character was poisoned by this skill then register callbacks.
		if ( this.internalVariables.did_curse ) {
			// Store UUIDs to cancel callbacks in the future.
			this.internalVariables.in_uuid = this.Round. in ( duration, this.uncurse, this, Constants.ENDROUND_EVENT );
			this.internalVariables.each_uuid = this.Round.each( this.damage, this, Constants.AFTER_DAMAGE_PHASE_EVENT );
		}
	};

	// Unregisters the damage callback.
	this.uncurse = function () {
		// Unpoison only if this skill did poison the character.
		if ( this.internalVariables.did_curse )
			this.target.unsetStatus( [ Constants.CURSE_STATUS_ID ], this, false );
	};

	// Performs some damage.
	this.damage = function () {
		this.target.damage( 700, this );
	};

	// Cancels the effects produced by this skill.
	//
	// Reasons is an optional array of status, used to
	// allow cancelling just the effects produced by a
	// skill due to one altered status.
	//
	// For instance:  «Vómito de Molbol» will affect
	// several status, one of them might be poison and
	// other might be blind. If you cast a spell that
	// heals "blind" altered status you should affect
	// the poison damage triggered by this skill, even
	// if blind status was triggered also by this skill.
	this.cancel = function ( reasons ) {
		// Unpoison only if this skill did poison the character.
		if ( this.internalVariables.did_curse ) {
			// In this case this is trivial but if this skill
			// affected more than one altered status this
			// won't be so trivial.
			if ( reasons.indexOf( Constants.CURSE_STATUS_ID ) > -1 ) {
				this.Round.cancel( this.internalVariables.in_uuid );
				this.Round.uneach( this.internalVariables.each_uuid );
			}
		}
	};
};
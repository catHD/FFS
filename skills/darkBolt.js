var Constants = require( '../vendor/constants.js' );

module.exports = function ()
{
	this.type = Constants.MAGICAL;
	this.element = 'Dark';
	// Initialization, called when a skill is used.
	this.init = function ()
	{
		this.Round.do( this.damage, this );
	};
	this.damage = function ()
	{
		this.caller.realDamage(this.cost, Constants.ACTUALMP_STAT_ID);
		this.targets[ 0 ].consumeMP( 2000, this );
	};
	// Array of altered status that prevent this skill to be performed.
	this.blockedBy = [ Constants.PARALYSIS_STATUS_ID, Constants.SILENCE_STATUS_ID ];
};
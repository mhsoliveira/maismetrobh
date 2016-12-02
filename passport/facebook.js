var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/account');
var fbConfig = require('../fb.js');
var cloudinary = require('cloudinary');
var cdConfig = require('../cloud.js');
cloudinary.config(cdConfig);

module.exports = function(passport) {

    passport.use('facebook', new FacebookStrategy({
        clientID        : fbConfig.appID,
        clientSecret    : fbConfig.appSecret,
        callbackURL     : fbConfig.callbackUrl,
        profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'picture'],
    },

    // facebook will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {
		// asynchronous
		process.nextTick(function() {

			// find the user in the database based on their facebook id
	        User.findOne({ 'email' : profile.emails[0].value }, function(err, user) {

	        	// if there is an error, stop everything and return that
	        	// ie an error connecting to the database
	            if (err)
	                return done(err);

				// if the user is found, then log them in
	            if (user) {
	                return done(null, user); // user found, return that user
	            } else {
                var newUser = new User();
                cloudinary.uploader.upload(profile.photos[0].value, function(result) {
                  newUser.picture = result.url;
                  newUser.access_token = access_token; // we will save the token that facebook provides to the user
	                newUser.username  = profile.name.givenName+' '+profile.name.familyName; // look at the passport user profile to see how names are returned
	                newUser.email = profile.emails[0].value;
                  newUser.save(function(err) {
                      if (err)
                          throw err;

                      // if successful, return the new user
                      return done(null, newUser);
                  });
                }, { public_id: profile.id });
              }
	        });
        });

    }));

};

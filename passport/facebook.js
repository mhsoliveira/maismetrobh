var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/account');
var fbConfig = require('../fb.js');
var image_downloader = require('image-downloader');


module.exports = function(passport) {

    passport.use('facebook', new FacebookStrategy({
        clientID        : fbConfig.appID,
        clientSecret    : fbConfig.appSecret,
        callbackURL     : fbConfig.callbackUrl,
        profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'picture'],
    },

    // facebook will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {

    	console.log('profile', profile);

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

                options = {
                    url: profile.photos[0].value,
                    dest: './public/avatars/'+profile.id+'.jpg',        // Save to /path/to/dest/photo.jpg
                    done: function(err, filename, image) {
                        if (err) {
                            throw err;
                        }
                        console.log('File saved to', filename);
                    },
                };
                image_downloader(options);
	                // if there is no user found with that facebook id, create them
	                var newUser = new User();

					// set all of the facebook information in our user model
	                newUser.access_token = access_token; // we will save the token that facebook provides to the user
	                newUser.username  = profile.name.givenName+' '+profile.name.familyName; // look at the passport user profile to see how names are returned
	                newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                  newUser.picture = '../avatars/'+profile.id+'.jpg';

					// save our user to the database
	                newUser.save(function(err) {
	                    if (err)
	                        throw err;

	                    // if successful, return the new user
	                    return done(null, newUser);
	                });
	            }

	        });
        });

    }));

};

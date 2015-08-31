$(document).ready(function(){
	Parse.initialize('uT5O2lcpFZ4RiBD39PwImM95uF0a6WUqCe1XICPl', 'XBTcHU2vmpEHjHYBlGV43LpVybBNstw19HhiG0UM');
 	Parse.User.current().fetch();
  var ratingDatabase = Parse.Object.extend('Ratings');

 	var barNamesArr = ['cannons', 'tt', 'heights', 'mels', 'bs'];
 	var ratingTypesArr = ['fun', 'eoe', 'sex'];

  rankingQuery = new Parse.Query(Parse.User);
  rankingQuery.descending("score");
  rankingQuery.limit(10);
  rankingQuery.find({
    success: function(results) {
      for(var i = 0; i < results.length; i++)
        document.getElementById('rankings').innerHTML += '<li>' + results[i].get('username') + '</li>';
    },
    error: function(error) {}
  });

  document.getElementById('userScore').innerHTML += Parse.User.current().get("score");

  $('#changeUsernameBtn').click(function(){
    if($.trim($("#newUsername").val()) === "")
      alert('You did not fill out a username');
    else{
      Parse.User.current().set("username", $("#newUsername").val());
      Parse.User.current().save();
      var newUsernameField = $("#newUsername").attr("value");
      newUsernameField = "";
      alert("Username successfully changed!");
      location.reload();
    }
  });

 	var getBarCompositeRating = function(barName) {
		var compositeScore = 0;
		var queryCount = 3;
    var pastHour = new Date();
    pastHour.setHours(pastHour.getHours() - 1);
		for(var i = 0; i < ratingTypesArr.length; i++){
			myQuery = new Parse.Query(ratingDatabase);
			myQuery.equalTo('Bar', barName);
			myQuery.equalTo('Type', ratingTypesArr[i]);
      myQuery.greaterThan('createdAt', pastHour);

			myQuery.find({
  			success: function(results) {
  				var sumOfScores = 0;
  				for(var j = 0; j < results.length; j++)
  					sumOfScores += results[j].get('Score');
  				var averageOfScores = sumOfScores/results.length;
  				if(results.length != 0)
            if(results[0].get('Type') == 'fun')
  					 compositeScore += 0.5 * averageOfScores;
  				  else if(results[0].get('Type') == 'eoe')
  					 compositeScore += 0.3 * averageOfScores;
  				  else
  					 compositeScore += 0.2 * averageOfScores;
  				queryCount--;
  				setBarCompositeRating();
  			},
  			error: function(error) {}
			});
		}

		var setBarCompositeRating = function(){
			if(queryCount == 0){
				$('#' + barName).raty({
					readOnly: true,
					score: compositeScore
				});
			}
		};
	};

 	for(var i = 0; i < barNamesArr.length; i++)
 		getBarCompositeRating(barNamesArr[i]);	
	
  var getTypeRating = function(ratingType, barName) {
    var pastHour = new Date();
    pastHour.setHours(pastHour.getHours() - 1);
    myQuery = new Parse.Query(ratingDatabase);
    myQuery.equalTo('Bar', barName);
    myQuery.equalTo('Type', ratingType);
    myQuery.greaterThan('createdAt', pastHour);

    myQuery.find({
      success: function(results) {
        var sumOfScores = 0;
        for(var j = 0; j < results.length; j++)
          sumOfScores += results[j].get('Score');
        if(results.length == 0)
          setTypeRating(0);
        else
          setTypeRating(sumOfScores/results.length);
      },
      error: function(error) {}
    });

    var setTypeRating = function(averageScore){
      $('#' + barName + '_' + ratingType).raty({
        click: function(score, evt) {
          Parse.User.current().fetch();
          if(Parse.User.current().get("emailVerified") == true && Parse.User.current().get(barName + "_" + ratingType + "_recentlyrated") == false){
            var rating = new ratingDatabase();
            rating.set('Bar', barName);
            rating.set('Type', ratingType);
            rating.set('Score', score);
        
            rating.save(null, {       
              success: function(item) {},
              error: function(gameScore, error) {
                alert("Fail to send");
              }
            });

            $(this).raty({
              readOnly: true,
              score: score,
              starOff: 'beer-off.png',
              starHalf:'beer-half.png', 
              starOn: 'beer-on.png'
            });

            document.getElementById(barName + '_' + ratingType + '_PO').className = '';
            document.getElementById(barName + '_' + ratingType + '_PO').className = 'plusOne';

            var accountQuery = new Parse.Query(Parse.User);
            accountQuery.equalTo('username', Parse.User.current().get('username'));
            accountQuery.first({
              success: function (account) {
                account.save(null, {
                  success: function (updatedAccount) {
                    updatedAccount.set('score', account.get('score') + 1);
                    updatedAccount.set('recentlyrated', true);
                    updatedAccount.set(barName + "_" + ratingType + "_recentlyrated", true);
                    updatedAccount.save();
                    // location.reload();
                  }
                });
              }
            });

            getBarCompositeRating(barName);
            return false;
          }
          else if(Parse.User.current().get("emailVerified") == false)
            alert("Rating not accepted. Please verify your email first")
          else if(Parse.User.current().get(barName + "_" + ratingType + "_recentlyrated") == true)
            alert("Users can only rerate a bar after 5 minutes")
          else
            alert("Error");

        },
        score:averageScore,
        starOff:'beer-off.png',
        starHalf:'beer-half.png', 
        starOn: 'beer-on.png'
      });

    };
  };

  for(var i = 0; i < barNamesArr.length; i++)
    for(var j = 0; j < ratingTypesArr.length; j++)
      getTypeRating(ratingTypesArr[j], barNamesArr[i]);

  $('.collapsible').on('collapsibleexpand', function(event, ui){
    var plusOneArr = document.getElementsByClassName('plusOne');
    for(var j = 0; j < plusOneArr.length; j++)
      plusOneArr[j].className = 'plusOne hidden';
    for(var i = 0; i < ratingTypesArr.length; i++)
      getTypeRating(ratingTypesArr[i], this.id.split('_')[0]);
  });

  // $('#addButton').click(function(){
  //   Parse.User.logOut();
  //   window.location.href = 'index.html';
  // });
});
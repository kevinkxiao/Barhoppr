$(document).ready(function(){
  Parse.initialize('uT5O2lcpFZ4RiBD39PwImM95uF0a6WUqCe1XICPl', 'XBTcHU2vmpEHjHYBlGV43LpVybBNstw19HhiG0UM');
	
  if(Parse.User.current())
    window.location.href = 'home.html';

  $('#signupButton').click(function (e) {
    e.preventDefault();
    var x = $.trim($("#email").val());
    if($.trim($("#name").val()) === "" || $.trim($("#alias").val()) === "" || $.trim($("#email").val()) === "")
      alert('You did not fill out all of the fields');  
    else if($.trim($("#email").val()).substr(-13) != "@columbia.edu" && $.trim($("#email").val()).substr(-12) != "@barnard.edu")
      alert('You need to have a Columbia or Barnard email to sign up');
  	else{
      var user = new Parse.User();
      user.set("name", $("#name").val());
      user.set("username", $("#alias").val().toLowerCase());
      user.set("password", 'XiaoKapur');
      user.set("gender", $("#gender").val());
      user.set("email", $("#email").val().toLowerCase());
      user.set("score", 0);
      user.set("ban", false);
      user.set("recentlyrated", false);
      user.set("cannons_fun_recentlyrated", false);
      user.set("cannons_eoe_recentlyrated", false);
      user.set("cannons_sex_recentlyrated", false)
      user.set("tt_fun_recentlyrated", false);
      user.set("tt_eoe_recentlyrated", false);
      user.set("tt_sex_recentlyrated", false);
      user.set("heights_fun_recentlyrated", false);
      user.set("heights_eoe_recentlyrated", false);
      user.set("heights_sex_recentlyrated", false);
      user.set("mels_fun_recentlyrated", false);
      user.set("mels_eoe_recentlyrated", false);
      user.set("mels_sex_recentlyrated", false);
      user.set("bs_fun_recentlyrated", false);
      user.set("bs_eoe_recentlyrated", false);
      user.set("bs_sex_recentlyrated", false);


      user.signUp(null, {
          success: function(user) {
            alert("You have been successfully signed up! Check your inbox for a verification email")
            window.location.href = 'home.html';
          },
          error: function(user, error) {
            alert("Error: " + error.code + " " + error.message);
          }
      });
    }
  });
});
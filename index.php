<?php

  include_once 'moves_api/Moves.php';
  include_once 'moves_api/config.php';
    
  $m = new PHPMoves\Moves(Config::$client_id, Config::$client_secret, Config::$redirect_url);

  $request_url = $m->requestURL();

  if (isset($_GET['code'])) {

    $moves = "authorized";

    $requestToken = $_GET['code'];
    $tokens = $m->auth($requestToken);
    //Save this token for all future request for this user
    $accessToken = $tokens['access_token'];
    //Save this token for refeshing the token in the future
    $refreshToken = $tokens['refresh_token'];
    //echo json_encode($m->get_profile($accessToken)); 
  } else {

     $moves = "none";
  }

?>

<!DOCTYPE html>
<html lang="en">
<head>
  <title>Human Spatial Movement</title>
  <script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
  <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="css/style.css" />
</head>

<body>
<div> 
<div class="jumbotron">
  <div class="container">
    <h1>Human Spatial Movement</h1>
      <p>Visualize your mobility patterns</p>
      <button id="getStartedBT" class="btn btn-default btn-lg" type="button" data-toggle="collapse" data-target="#movesAuth" aria-expanded="false" aria-controls="started">Get Started</button>
      <button id="loginBT" type="button" class="btn btn-link" data-toggle="collapse" data-target="#loginContainer" aria-expanded="false" aria-controls="login">login</button>
  </div>
</div>

<div class="collapse" id="loginContainer">
  <div class="well">
      <div class="formContainer">
        <form id="formLogin" class="form-inline">

          <div id="loginEmail" class="input-group input-group-lg">
            <span class="input-group-addon" id="sizing-addon1">email</span>
            <input name="email "id="email" type="text" class="form-control" placeholder="email" aria-describedby="email">
          </div>

          <div id="loginPassword" class="input-group input-group-lg">
            <span class="input-group-addon" id="sizing-addon1">password</span>
            <input name="password "id="password" type="password" class="form-control" placeholder="password" aria-describedby="password">
          </div>

          <button id="submitLogin" type="button" class="btn btn-default btn-lg">Sign in</button>
          <button id="forgotBT" type="button" class="btn btn-link btn-sm" data-toggle="collapse" data-target="#forgot" aria-expanded="false" aria-controls="forgot">forgot password</button>

        </form>
  
      </div>
  </div>
</div>

<div class="collapse" id="movesAuth">
  <div class="well">
    <div class="formContainer">
      <a class="btn btn-info btn-lg" href="<?php echo $request_url; ?>" role="button">Get Moves Authorization</a>
    </div>
    <div class="textContainer center-block">
      Human Spatial Movement use data collect by <a href="https://www.moves-app.com/" target="_blank">Moves</a>. You need to have an account an give permission to Human Spatial Movement to use your Moves data. We won't store your geo-locative data.
    </div>
  </div>
</div>

<div class="collapse" id="forgot">
  <div class="well">
    <div class="formContainer">
      <form id="formForgot" class="form-inline">
        <div class="textContainer center-block">
          Please inform the email you have registered.  
        </div>
        <div id="forgotEmail" class="input-group input-group-lg">
                <span class="input-group-addon" id="sizing-addon1">email</span>
                <input name="email "id="email" type="text" class="form-control" placeholder="email" aria-describedby="email">
            </div>

            <button id="submitForgot" type="button" class="btn btn-default btn-lg">Send</button>
      
          </form>
      </div>
    </div>
</div>
<div class="container-fluid">
	<div id="content" class="row textBody center-block">
		<div class="col-md-4">
	  	
		  	<h3>About</h3>

			<div id="aboutText">
			    <p>As an inherent human condition, mobility brings together communicative, technological, geographical, economical, cultural, and social forces that transform the surrounding space. In fact, space only becomes social meaningful through human agency and activities, such as walking and the desire to move in one or another direction. As we walk, we always leave some sort of traces behind, which could be both immaterial, like nostalgia or desire, and concrete, such as built environment, and marks on the sand.</p>
			    <p>All these moments and traces are transitory (space) and temporary (time), which makes difficult to understand and analyze their nature and rules. Yet, if we follow our trails we might be able to understand our interactions with the surrounding environment and with other people; we even might be able to grasp the patterns and rules that govern our movements.</p>
			    <p>Either you are walking, running, cycling, driving, or even flying, mobile technologies can follow and track your movements through space: <a href="https://www.moves-app.com/" target="_blank">Moves</a>, for instance, locates you storing geo-coordinates and timestamps to calculate distances, durations and even the type of transportation you are using.</p>
			    <p>At first glance, visualize human spatial flow seems to be chaotic: endless vectors of movement coming and going to an infinite number of places as we drive from home to work, take public transportation to go to school, walk on the streets, and fly to any place in the planet.</p>
			    <p>Human Spatial Movement is a interactive visualization that enable you to discover your mobility pattern through time and space. It shows all your Moves data into map while you can filter by date and type of transportation, and encode information by type of transportation and duration. You can uncover your digital traces to learn about your mobility preferences in everyday life.
			    </p>
			</div>
		</div>
		<div class="col-md-8">
			<h3>Features</h3>

			<h5 class="text-primary"><span class="glyphicon glyphicon-chevron-right"></span> Visualize your movements in a map</h5>
			<img src="images/map-snapshot_map.png" class="img-responsive img-thumbnail">

			<div class="row">

				<div class="col-md-5">

					<h5 class="text-primary"><span class="glyphicon glyphicon-chevron-right"></span> Encode by type of transportation</h5>
					<img src="images/icons/airplane.png" width="20px" height="20px">
					<img src="images/icons/bus.png" width="20px" height="20px">
					<img src="images/icons/car.png" width="20px" height="20px">
					<img src="images/icons/cycling.png" width="20px" height="20px">
					<img src="images/icons/ferry.png" width="20px" height="20px">
					<img src="images/icons/funicular.png" width="20px" height="20px">
					<img src="images/icons/running.png" width="20px" height="20px">
					<img src="images/icons/train.png" width="20px" height="20px">
					<img src="images/icons/transport.png" width="20px" height="20px">
					<img src="images/icons/underground.png" width="20px" height="20px">
					<img src="images/icons/walking.png" width="20px" height="20px">

					<h5 class="text-primary"><span class="glyphicon glyphicon-chevron-right"></span> Filter by date</h5>
					<img src="images/map-snapshot_period.png" class="img-responsive img-thumbnail">

				</div>

				<div class="col-md-7">
					<h5 class="text-primary"><span class="glyphicon glyphicon-chevron-right"></span> See trends in distances and durations</h5>
					<img src="images/map-snapshot_trend.png" class="img-responsive img-thumbnail">
				</div>
			</div>

		</div>

	</div>
</div>

<div id="footer">
  <!-- <div id="footerText" class="bodyCenter center-block"> -->
  <p class="text-center">Designed By: <a href="http://luciano.fluxo.art.br" target="_blank">Luciano Frizzera</a></p>
  <!-- </div> -->
</div>

<script type="text/javascript">

$('#getStartedBT').click(function() {

  $('#loginContainer').collapse('hide');
  $('#formLogin').find("input").val("");
  changeInputState($("#loginEmail"),"default");
  changeInputState($("#loginPassword"),"default");
  

  $('#forgot').collapse('hide');
  $('#formForgot').find("input").val("");
  $("#forgotHelpBlock").remove();
  changeInputState($("#forgotEmail"),"default");
  
});

$('#loginBT').click(function() {
  $('#movesAuth').collapse('hide');

  $('#forgot').collapse('hide');
  $('#formForgot').find("input").val("");
  $("#forgotHelpBlock").remove();
  changeInputState($("#forgotEmail"),"default");
  
});

$('#forgotBT').click(function() {
  $('#loginContainer').collapse('hide');
  $('#formLogin').find("input").val("");
  changeInputState($("#loginEmail"),"default");
  changeInputState($("#loginPassword"),"default");
});

//login submit button
$("#submitLogin").click(function() {

  var formData = $('#formLogin').serializeArray();

  var valid = true;

  //test if email is filled
  if (formData[0].value == "") {
    changeInputState($("#loginEmail"),"warning");
    valid = false;
  } else {
    changeInputState($("#loginEmail"),"default");
  }

  //test if password is filled
  if (formData[1].value == "") {
    changeInputState($("#loginPassword"),"warning");
    valid = false;
  } else {
    changeInputState($("#loginPassword"),"default");
  }

  if(valid) {

    $.ajax({
      method: "POST",
      url: "php/getUser.php",
      data: {
        action: "getUser",
        email: formData[0].value,
        password: formData[1].value
      }
    })
    .done(function(data) {

      if (data.success) {
        post('hspVis.php', {
          status:"signed",
          accessToken:data.accessToken,
          refreshToken: data.refreshToken,
          userID: data.userID
        });
      } else {

        switch (data.error) {

          case "Invalid username":
            changeInputState($("#loginEmail"),"error");
            changeInputState($("#loginPassword"),"error");
            break;

          case "Invalid password":
            changeInputState($("#loginEmail"),"default");
            changeInputState($("#loginPassword"),"error");
            break;
        }

      }

    });
  }

});

//forgot password button - go to map
$("#submitForgot").click(function() {

  var formData = $('#formForgot').serializeArray();

  var valid = true;

  //test if email is filled
  if (formData[0].value == "") {
    changeInputState($("#forgotEmail"),"warning");
    valid = false;
  } else {
    changeInputState($("#forgotEmail"),"default");
  }

  if(valid) {

    $.ajax({
      method: "POST",
      url: "php/forgotPass.php",
      data: {
        action: "getPass",
        email: formData[0].value
      }
    })
    .done(function(data) {

      //console.log(data);

      if (data.success) {
        $("#formForgot").append(
            '<span id="forgotHelpBlock" class="help-block">Your password has been sent to your email</span>'
        );

      } else {

        if (data.error == "Invalid email") {
            changeInputState($("#forgotEmail"),"error");
            $("#formForgot").append(
                '<span id="forgotHelpBlock" class="help-block">Email not found</span>'
            );
        }

      }

    });
  }

});

function changeInputState(input,state) {

  switch (state) {
    case "default":
      input.removeClass( "has-error" );
      input.removeClass( "has-warning" );
      break;

    case "warning":
      input.removeClass( "has-error" );
      input.addClass( "has-warning" );
      
      break;

    case "error":
      input.removeClass( "has-warning" );
      input.addClass( "has-error" );
      break;
  }
}

//submit POST var to another URL
function post(path, params, method) {
  method = method || "post"; // Set method to post by default if not specified.

  // The rest of this code assumes you are not using a library.
  // It can be made less wordy if you use one.
  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for(var key in params) {
      if(params.hasOwnProperty(key)) {
          var hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", params[key]);

          form.appendChild(hiddenField);

       }
  }

  form.submit();
}

//go to map if authorized by Moves App
(function(){
  if (<?php echo json_encode($moves); ?> == "authorized") {
    post('hspVis.php', {
      status:"signed",
      accessToken: <?php echo json_encode($accessToken); ?>,
      refreshToken: <?php echo json_encode($refreshToken); ?>,
      userID: ""
    });
  }
})();

</script>


</body>
</html>
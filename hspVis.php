<?php
    if($_POST['status'] != "signed") {
        header('Location: index.php');
        exit();
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    
    <title>Human Spatial Movement</title>

    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false"></script>

    <script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
    <!-- <script src="http://code.jquery.com/ui/1.11.2/jquery-ui.js"></script>-->

    <script src="library/moment/moment.js"></script>
    <script src="library/moment/twix.js"></script>

    <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>

    <link href='http://fonts.googleapis.com/css?family=Muli' rel='stylesheet' type='text/css' />

    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
    <script src="library/bootStrap/js/collapse.js"></script>
    <script src="library/bootStrap/js/transition.js"></script>

    <script src="library/dateTimePicker/js/bootstrap-datetimepicker.min.js"></script>

    <script type="text/javascript" src="js/map.js"></script>
    <script type="text/javascript" src="js/menu_bar.js"></script>
    <script type="text/javascript" src="js/info_panel.js"></script>

    <link rel="stylesheet" type="text/css" href="css/style.css" />
    <link rel="stylesheet" type="text/css" href="library/dateTimePicker/css/bootstrap-datetimepicker.min.css" />
    <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
</head>
<body>
    <div id="loading">
        <div class="spinner">
            <div class="dot1"></div>
            <div class="dot2"></div>
        </div>
    </div>

    <div id="bar">

        <div class="btn-toolbar" role="toolbar">

            <div id="registrationBTContainer" class="btn-group dropup">
                <button id="registrationBT" class="btn btn-primary" type="button" data-toggle="modal" data-target="#registrationModal">register</button>
            </div>

            <div id="bar-period-option">

                <h4>Period</h4>

                <div class="btn-group-sm btn-group-justified" role="group" data-toggle="buttons">
                    <label class="btn btn-default periodPiker"><input type="radio" name="options" id="option1" autocomplete="off">Day</label>
                    <label class="btn btn-default periodPiker"><input type="radio" name="options" id="option2" autocomplete="off">Month</label>
                    <label class="btn btn-default periodPiker active"><input type="radio" name="options" id="option3" autocomplete="off">Range</label>
                </div>

                <div class="btn-group" id="initialDate">
                    <div class='input-group date' id='datetimepicker1'>
                        <input type='text' class="form-control btn-default" />
                        <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span>
                        </span>
                    </div>
                </div>

                <div class="btn-group" id="finalDate">
                    <div class='input-group date' id='datetimepicker2'>
                        <input type='text' class="form-control btn-default" />
                        <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span>
                        </span>
                    </div>
                </div>

                <div class="btn-group" id="monthDate">
                    <div class='input-group date' id='datetimepicker3'>
                        <input type='text' class="form-control btn-default" data-date-format="MMMM YYYY"/>
                        <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span>
                        </span>
                    </div>
                </div>

            </div>

            <div id="bar-mode-option" class="btn-group-vertical" data-toggle="buttons">
                <h4>Mode</h4>
                <label class="btn btn-default active"><input type="radio" name="options" id="option1" autocomplete="off">all</label>
            </div>

            <div id="bar-code-option" class="btn-group-vertical" data-toggle="buttons">
                <h4>Encode</h4>
                <label class="btn btn-default active"><input type="radio" name="options" id="option1" autocomplete="off">none</label>
                <label class="btn btn-default"><input type="radio" name="options" id="option2" autocomplete="off">transportation</label>
                <label class="btn btn-default"><input type="radio" name="options" id="option3" autocomplete="off">duration (color)</label>
                <label class="btn btn-default"><input type="radio" name="options" id="option4" autocomplete="off">duration (thickness)</label>
            </div>

        </div>

    </div>

    <!-- MAP -->
    <div id="map-wrap">
        <div id="map"></div>
    </div>

    <!-- INFO PANEL -->
    <div id="info-panel" class="panel panel-default">
        <div class="panel-body">
            <div id="info-mode-option" class="btn-group" data-toggle="buttons">
                <label class="btn btn-xs btn-default active"><input type="radio" name="options" id="option0" autocomplete="off">Distance</label>
                <label class="btn btn-xs btn-default"><input type="radio" name="options" id="option1" autocomplete="off">Duration</label>
            </div>
            <div id="info-modes">
                <hr class="hr-sep">
                <div id="info-mode-vis"></div>
                <hr class="hr-sep">
                <div id="day-list"></div>
                
            </div>
        </div>
    </div>

    <!-- Registrationn Modal -->
    <div class="modal fade" id="registrationModal" tabindex="-1" role="dialog" aria-labelledby="registrationModal" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <button id="closeRegistration" type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">Registration</h4>
              </div>
              <div class="modal-body">
                <div id="registrationText" class="center-block">
                    Register to Human Spatial Movement will make it easier for you to come back and see more of your data. We only store your email, password and the access key to your moves account. We will not store or access your Moves data.
                </div>
               <form id="registrationForm">

                <div id="registrationEmail" class="form-group">
                    <div class="input-group">
                        <span class="input-group-addon" id="sizing-addon1">email</span>
                        <input name="email "id="email" type="text" class="form-control" placeholder="email" aria-describedby="email">
                    </div>
                </div>

                <div id="registrationPassword" class="form-group">
                    <div class="input-group">
                        <span class="input-group-addon" id="sizing-addon1">password</span>
                        <input name="password "id="password" type="password" class="form-control" placeholder="password" aria-describedby="password">
                    </div>
                </div>      

                </form>

              </div>
              <div class="modal-footer">
            <button id="submitRegistration" type="button" class="btn btn-default btn">Sign up</button>
          </div>
        </div>
      </div>
    </div>

<script>

//save user information
userInfo = {
    userID: <?php echo json_encode($_POST['userID']); ?>,
    accessToken: <?php echo json_encode($_POST['accessToken']); ?>,
    refreshToken: <?php echo json_encode($_POST['refreshToken']); ?>
};


var registrationModalTimer;

//show registration after a few time ~ 2 min
//or do not show registratation button if user is already registered
$(document).ready(function() {

    if (userInfo.userID == "") {
        registrationModalTimer = setTimeout(showRegistrationModal, 120000);
    } else {
        $("#registrationModal").remove();
        $("#registrationBTContainer").remove();
    }

});

//modal timer
function showRegistrationModal() {
    $('#registrationModal').modal('show');
    clearTimeout(registrationModalTimer);
}

//registration 

$("#closeRegistration").click(function() {
    $("#registerHelpBlock").remove();
    changeInputState($("#registrationEmail"),"default");
    changeInputState($("#registrationPassword"),"default");
    var inputs = $('#registrationForm').find("input");
    inputs.val("");
    clearTimeout(registrationModalTimer);
});

//registration submit button
$("#submitRegistration").click(function() {

    var formData = $('#registrationForm').serializeArray();

    var valid = true;

    //test if email is filled
    if (formData[0].value == "") {
            changeInputState($("#registrationEmail"),"warning");
            valid = false;
        } else {
            changeInputState($("#registrationEmail"),"default");
    }

    //test if password is filled
    if (formData[1].value == "") {
        changeInputState($("#registrationPassword"),"warning");
        valid = false;
    } else {
        changeInputState($("#registrationPassword"),"default");
    }

    if (valid) {

        $.ajax({
            method: "POST",
            url: "php/insertUser.php",
            data: {
                action: "insertUser",
                email: formData[0].value,
                password: formData[1].value,
                userID: userInfo.userID,
                accessToken: userInfo.accessToken,
                refreshToken: userInfo.refreshToken
            }
        })
        .done(function(data) {

            //console.log(data);

            if (data.success) {
                $('#registrationModal').modal('hide');
                $("#registrationBTContainer").remove();
            } else {
                if(data.error == "Email already registered") {
                    changeInputState($("#registrationEmail"),"error");
                    $("#registrationEmail").append(
                        '<span id="registerHelpBlock" class="help-block">Email already registered</span>'
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



//initialize
init();
     
</script>

        
</body>
</html>
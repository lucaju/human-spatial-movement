<?php
	include_once 'Moves.php';
    include_once 'config.php';
    
    $m = new PHPMoves\Moves(Config::$client_id, Config::$client_secret, Config::$redirect_url);

    $request_url = $m->requestURL();

	if (isset($_POST['action'])) {

		$access_token = $_POST['accessToken'];

		//actions

		switch ($_POST['action']) {

			case "profile":
				echo json_encode($m->get_profile($access_token));
				break;

			case "storyline":

				//multiples requests
				if ($_POST['rangeRequest'] == "multiple") {

					//request
					$rangeRequest = $_POST['range'];

					//result variable
					$rangeResult = [];

					//loop in the range request array
					foreach ($rangeRequest as $rangeValue) {
					    $startDate = $rangeValue['start'];
					    $endDate = $rangeValue['end'];
					    //request
					    $result = $m->get_range($access_token,'/user/storyline/daily', $startDate, $endDate);

					    //bind results together
					    $rangeResult = array_merge($rangeResult, $result);
					}


					echo json_encode($rangeResult);
					

				} else {

					$startDate = $_POST['startDate'];
					$endDate = $_POST['endDate'];
					echo json_encode($m->get_range($access_token,'/user/storyline/daily', $startDate, $endDate));

				}

				break;

		}


	}

?>
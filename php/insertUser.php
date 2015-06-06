<?php

header('Content-type: application/json');

 if($_POST['action']) {
	
	//required
	require_once("DBConn.php");
	require_once("functions.php");
	
	//mysql
	$dbConn = DBConn::getConnection();
	
	//save data
	$userID = $_POST['userID'];
	$email = $_POST['email'];
	$password = $_POST['password'];
	$accessToken = $_POST['accessToken'];
	$refreshToken = $_POST['refreshToken'];

	// test if user name / email already exists
	$queryUser = "SELECT id, email FROM users WHERE email = '$email' LIMIT 1";
	if ($resultUser = $dbConn->query($queryUser)) {

		//if there is no user registered with the informed email
		if ($dbConn->affected_rows == 0) {

			/* free result set */
			//$dbConn->close();

			//query - Insert new item
			$query = "INSERT INTO users (userID, email, password, accessToken, refreshToken) VALUES ('$userID', '$email', AES_ENCRYPT('$password', SHA1('hsp')), '$accessToken', '$refreshToken')";
			
			if ($dbConn->query($query)) {
				
				$data["success"] = true;
				
				$data["userID"] = utf8_encode($userID);
				$data["email"] = utf8_encode($email);
				$data["accessToken"] = utf8_encode($accessToken);
				$data['refreshToken'] = utf8_encode($refreshToken);
				
				
			} else {
			
				$data["success"] = false;
				
				$data["error"] = $dbConn->error;
				$data["errno"] = $dbConn->errno;
			
			}
	
		} else {

			//if there is a user with the informed email
			$data["success"] = false;
				
			$data["error"] = "Email already registered";
			$data["errno"] = 1001;
		}
	
	
	} else {

		//connection fails
		$data["success"] = false;
		
		$data["error"] = $dbConn->error;
		$data["errno"] = $dbConn->errno;
	}
		
	//Convert to JSON and print
	//print json_encode($data);
	print jsonRemoveUnicodeSequences($data);
	
	/* close connection */
	$dbConn->close();
	
}

?>
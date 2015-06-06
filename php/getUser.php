<?php

header('Content-type: application/json');

 if($_POST['action']) {

 	//required
	require_once("DBConn.php");
	require_once("functions.php");
	
	$dbConn = DBConn::getConnection();
	
	//save data
	$email = $_POST['email'];
	$password = $_POST['password'];

	$query = "SELECT id, userID, email, AES_DECRYPT(password, SHA1('hsp')), accessToken, refreshToken FROM users WHERE email = '$email' LIMIT 1";
	
	if ($result = $dbConn->query($query)) {
	
		if ($dbConn->affected_rows == 1) {
		
			$row = $result->fetch_assoc();
			
			//test password
			$cryptPass = $row["AES_DECRYPT(password, SHA1('hsp'))"];
			
			if ($password === $cryptPass) {
			
				$data["success"] = true;
				
				$data['userID'] = (int)$row['userID'];	
				$data['accessToken'] = $row['accessToken'];
				$data['refreshToken'] =$row['refreshToken'];
		
			} else {
			
				$data["success"] = false;
				$data['error'] = "Invalid password";
				$data["errno"] = $dbConn->errno;
			
			}
		
		
		} else {
			
			$data["success"] = false;
			$data['error'] = "Invalid username";
			$data["errno"] = $dbConn->errno;
			$data["success"] = false;
		
		}
		
	
	} else {
		
		//connection fails
		$data["success"] = false;
		
		$data["error"] = $dbConn->error;
		$data["errno"] = $dbConn->errno;
	
	}

	//print json_encode($rows);
	print jsonRemoveUnicodeSequences($data);
	
	/* close connection */
	$dbConn->close();

}

?>
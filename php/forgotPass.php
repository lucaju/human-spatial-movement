<?php

header('Content-type: application/json');

if($_POST['action']) {

	//required
	require_once("DBConn.php");
	require_once("functions.php");
	
	//mysql
	$dbConn = DBConn::getConnection();
	
	//save data
	$email = $_POST['email'];
	
	$query = "SELECT email, AES_DECRYPT(password, SHA1('hsp')) FROM users WHERE email = '$email' LIMIT 1";
	
	if ($result = $dbConn->query($query)) {
	
		if ($dbConn->affected_rows == 1) {
		
			$row = $result->fetch_assoc();
					
			$email = $row['email'];
			$password = $row["AES_DECRYPT(password, SHA1('hsp'))"];
			
			
			///--------- EMAIL
			$to      = $email;
			$subject = '[Human Spatial Movement App] - Password recovery';
			
			$headers = 'From: Human Spatial Movement App' . "\r\n" .
			    'Reply-To: lucaju@@gmail.ca' . "\r\n" .
			    'X-Mailer: PHP/' . phpversion();
			    
			$message = "Hello \n\n".
						"You resquest to recover your Human Spatial Movement App password. \n\n".
						"username: $email \n".
						"password: $password";
			
			if (mail($to, $subject, $message, $headers)) {
				$data["success"] = true;
			} else {
				$data["success"] = false;
			}
			
			
			//----------
		
		
		} else {
		
			$data["success"] = false;
			$data['error'] = "Invalid email";
			$data["errno"] = $dbConn->errno;
		
		}
		
	
	} else {
	
		$data["success"] = false;
		$data['error'] = $dbConn->error;
		$data["errno"] = $dbConn->errno;
	
	}

	//print json_encode($rows);
	print jsonRemoveUnicodeSequences($data);
	
	/* close connection */
	$dbConn->close();


}

?>
<?php

class DBConn {
	
	private static $connection;
	
	public static function getConnection() {

		$db = ""; //Database name

		//local
		$user = ""; // User
		$pass = ""; // Password
	
		//if I have no connection, build one
		if (empty(self::$connection)) {
			self::$connection = new mysqli('localhost', $user, $pass,$db);
		}
		
		return self::$connection;
	}
	
	
}
?>

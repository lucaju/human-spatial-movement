<?php

class DBConn {
	
	private static $connection;
	
	public static function getConnection() {

		$db = "db";
		$user = "user";
		$pass = "pass";
	
		//if I have no connection, build one
		if (empty(self::$connection)) {
			self::$connection = new mysqli('localhost', $user, $pass,$db);
		}
		
		return self::$connection;
	}
	
	
}
?>

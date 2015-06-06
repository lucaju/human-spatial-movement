<?php

class DBConn {
	
	private static $connection;
	
	public static function getConnection() {

		$db = "fluxoart_hsp";

		//local
		// $user = "root";
		// $pass = "root";

		//remore
		$user = "fluxoart_movemen";
		$pass = "HumanSpatialMovement";
	
		//if I have no connection, build one
		if (empty(self::$connection)) {
			self::$connection = new mysqli('localhost', $user, $pass,$db);
		}
		
		return self::$connection;
	}
	
	
}
?>
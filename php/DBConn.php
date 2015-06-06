<?php

class DBConn {
	
	private static $connection;
	
	public static function getConnection() {
	
		//if I have no connection, build one
		if (empty(self::$connection)) {
			self::$connection = new mysqli('localhost', 'fluxoart_movemen', 'HumanSpatialMovement','fluxoart_hsp');
		}
		
		return self::$connection;
	}
	
	
}
?>
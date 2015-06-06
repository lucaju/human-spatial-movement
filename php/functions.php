<?php

//encode special characters to json
function jsonRemoveUnicodeSequences($struct) {
   return preg_replace("/\\\\u([a-f0-9]{4})/e", "iconv('UCS-4LE','UTF-8',pack('V', hexdec('U$1')))", json_encode($struct));
}

function getDateNow() {
	$date = getDate();
	$today = $date['year']."-".$date['mon']."-".$date['mday'];
	return $today;
}

function getTimeNow() {
	$date = getDate();
	$time = $date['hours'].":".$date['minutes'].":".$date['seconds'];
	return $time;
}

?>


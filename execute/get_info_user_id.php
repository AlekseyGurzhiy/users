<?
	header("Content-Type: text/html; charset=utf-8");
	$link = mysqli_connect("localhost","root","","storage");
	mysqli_query($link,'SET names "utf8"');

$query = mysqli_query("SELECT * FROM `users` WHERE `id`=".$_POST['id_user']);
$number = mysqli_num_rows($query);
$row = mysqli_fetch_assoc($query);

$query_range = mysqli_query("SELECT `name` FROM `range` WHERE `id`='".$row['id_range']."'");	
$row_range = mysqli_fetch_assoc($query_range);

$query_range_employ = mysqli_query("SELECT `name` FROM `range_employ` WHERE `id`='".$row['id_range_employ']."'");	
$row_range_employ = mysqli_fetch_assoc($query_range_employ);

echo json_encode(array(/*0*/$number,/*1*/$row['surname'],/*2*/$row['name'],/*3*/$row['fathername'],/*4*/date("d-m-Y",strtotime($row['date'])),/*5*/$row['avatar'],/*6*/$row['otdel'],/*7*/$row['otdelenie'],/*8*/$row['phone'],/*9*/$row['phone_city'],/*10*/$row['room'],/*11*/$row['corps'],/*12*/$row['id_job'],/*13*/$row_range['name'],/*14*/$row_range_employ['name'],/*15*/$row['id_range'],/*16*/$row['id_range_employ'],/*17*/$row['id'],/*18*/$row['status']));
?>
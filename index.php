<?php
	//Указываем всем браузерам, что кодировка должна быть UTF-8
header("Content-Type: text/html; charset=utf-8");  
	//Подключаемся к базе
$link = mysqli_connect("localhost","root","","storage");
mysqli_query($link,'SET names "utf8"');

$hide_me = "style='display:none;'";
$show_me = "style='display:block;'";
$number = -1;
$login=false;
$autorization=false;

	//Запускаем глобальную переменную "Сессия". 
session_start();
$_SESSION['sname'] = '';

	//Если нажата кнопка "Выход", то уничтожаем сессию
if(isset($_POST['out'])){
	$_SESSION['slogin'] = '';
	$_SESSION['sname'] = '';
	$_SESSION['ssurname'] = '';
	$_SESSION['sfathername'] = '';
	$_SESSION['skaf'] = '';
	$_SESSION['srools'] = '';
	session_destroy();	
}

//Функция для уменьшения размера изображения
function imageresize($outfile,$infile,$neww,$newh,$quality){
	$vert_image = false;	
	$gor_image = false;
	$kvadrat = false;
	$im=ImageCreateFromJpeg($infile);
	
	$im1=imagecreatetruecolor($neww,$newh);
	imagecopyresampled($im1,$im,0,0,0,0,$neww,$newh,imagesx($im),imagesy($im));
	imagejpeg($im1,$outfile,$quality);
	imagedestroy($im);
	imagedestroy($im1);
}

//Если нажата кнопка авторизации
if(isset($_POST["autoriz_submit"])){
	//Если логин и пароль введены
	$autorization_login = $_POST["autoriz_login"];
	$autorization_password = $_POST["autoriz_password"];

	//То делаем запрос к базе. Ищем запись с таким логином
	$query = mysqli_query($link,"SELECT * FROM `users` WHERE `login`='".$autorization_login."'");
	$number = mysqli_num_rows($query);

	//Если количество таких записей не равно нулю, то сохраняем запись в переменную row
	if($number!=0) $rows = mysqli_fetch_assoc($query);

	//Если количество записей равно одному, то скажем, что такой пользователь есть. Посмотрим на пароль...
	if($number == 1){
		$login = true;
		//Если пароль введён верно, то сохраняем все значения записи в переменные сессии
		if($autorization_password == $rows["password"]){
			$autorization = true;
			$_SESSION['slogin'] = $autorization_login;
			$_SESSION['sname'] = $rows["name"];
			$_SESSION['ssurname'] = $rows["surname"];
			$_SESSION['sfathername'] = $rows["fathername"];
			$_SESSION['skaf'] = $rows["otdel"];
			$_SESSION['srools'] = $rows["rools"];
		} else {
			$autorization = false;
		}
	}
}

if (isset($_POST['my_button'])){
	//Получаем полное и краткое имя к файлу
	$filename = $_FILES["input_foto"]["name"];
	$tmp_filename = $_FILES["input_foto"]["tmp_name"];
	$full_filename = "avatar/".$filename;
			
	if(is_uploaded_file($tmp_filename)){
		imageresize($full_filename,$tmp_filename,150,200,75);
		//move_uploaded_file($tmp_filename, $full_filename);
	}

	//Если это новый сотрудник, то вносим в базу новую запись с его данными, если старый то изменяем существующую
	if ($_POST['new_old'] == 0) {
		mysqli_query($link,"INSERT INTO `users` (`surname`,`name`,`fathername`,`date`,`avatar`,`otdel`,`otdelenie`,`phone`,`phone_city`,`room`,`corps`,`id_job`,`id_range`,`rools`,`id_range_employ`,`status`) VALUES ('".$_POST['input_surname']."','".$_POST['input_name']."','".$_POST['input_fathername']."','".date("Y-m-d",strtotime($_POST['input_date']))."','".$filename."','".$_POST['select_otdel']."','0','".$_POST['input_phone_mini']."','".$_POST['input_phone']."','".$_POST['input_kabinet']."','".$_POST['select_korpus']."','".$_POST['select_job']."','".$_POST['select_range']."','user','".$_POST['select_range_employ']."','".$_POST['input_status']."')");
	} else {
		//Если файл выбрали, то имя нового файла сохраняем в базу, иначе ячейку с именем файла не трогаем
		if($filename!=''){
			mysqli_query($link,"UPDATE `users` SET `surname`='".$_POST['input_surname']."',`name`='".$_POST['input_name']."',`fathername`='".$_POST['input_fathername']."',`date`='".date("Y-m-d",strtotime($_POST['input_date']))."',`avatar`='".$filename."',`otdel`='".$_POST['select_otdel']."',`otdelenie`='0',`phone`='".$_POST['input_phone_mini']."',`phone_city`='".$_POST['input_phone']."',`room`='".$_POST['input_kabinet']."',`corps`='".$_POST['select_korpus']."',`id_job`='".$_POST['select_job']."',`id_range`='".$_POST['select_range']."',`id_range_employ`='".$_POST['select_range_employ']."',`status`='".$_POST['input_status']."' WHERE `id`='".$_POST['new_old']."'");			
		} else {
			mysqli_query($link,"UPDATE `users` SET `surname`='".$_POST['input_surname']."',`name`='".$_POST['input_name']."',`fathername`='".$_POST['input_fathername']."',`date`='".date("Y-m-d",strtotime($_POST['input_date']))."',`otdel`='".$_POST['select_otdel']."',`otdelenie`='0',`phone`='".$_POST['input_phone_mini']."',`phone_city`='".$_POST['input_phone']."',`room`='".$_POST['input_kabinet']."',`corps`='".$_POST['select_korpus']."',`id_job`='".$_POST['select_job']."',`id_range`='".$_POST['select_range']."',`id_range_employ`='".$_POST['select_range_employ']."',`status`='".$_POST['input_status']."' WHERE `id`='".$_POST['new_old']."'");			
		}
		
	}
}

$query = mysqli_query($link,"SELECT * FROM `pulpit`");
$query_job = mysqli_query($link,"SELECT * FROM `job` ORDER BY `priority`");
$query_range = mysqli_query($link,"SELECT * FROM `range`");
$query_range_employ = mysqli_query($link,"SELECT * FROM `range_employ`");
?>

<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="UTF-8">
	<title>Редактор: Постоянный состав</title>
	<link rel="stylesheet" href="css/jquery-ui.css">
	<link rel="stylesheet" href="css/style.css">
	<link href="favicon.ico" rel="shortcut icon" type="image/vnd.microsoft.icon">
	<script src="js/jq_1.5.2.min.js"></script>
	<script src="js/jquery-ui.js"></script>
	<script src="js/datepicker-ru.js"></script>
	<script src="js/jquery.validate.min.js"></script>

</head>
<body>
<div class="darken"></div>
	<header>
		<div class="header_name_user">
<?php
		if($_SESSION['sname'] !=''){
			echo ($_SESSION['ssurname']." ".$_SESSION['sname']." ".$_SESSION['sfathername']);
		} else {
		 	echo ( ($login)?("Пароль введен неверно"):("Авторизируйтесть в системе -->") );
		}
?> 
		</div>
		<ul>
			<li class="autorization_button" <?php if($autorization){
				echo $hide_me;
			} else {
				echo $show_me;
			}
			?>> Авторизация</li>
			<li class="header_element out" <?php if(!$autorization){
				echo $hide_me;
			} else {
				echo $show_me;
			}?>>
				<form action="" method="post">
					<input type="submit" name="out" class="out" value="Выход">
				</form>
			</li>
		</ul>
	</header>
	<!-- Поле авторизации -->
	<div class="autorization_area" >
		<div class="area_head">Введите логин и пароль</div>
		<form id="autorizForm" action="" method="post">
			<table>
				<tr>
					<td> Логин: </td>
					<td> <input type="text" name="autoriz_login" class="autoriz_login"> </td>
				</tr>
				<tr>
					<td> Пароль: </td>
					<td> <input type="password" name="autoriz_password"> </td>
				</tr>
			</table>
			<input type="submit" name="autoriz_submit" class="autoriz_submit" value="Авторизация">
		</form>
	</div>

	<!-- Блок с поиском сотрудников -->
	<div class="message">
		<div class="message_text">Идёт поиск...</div>
		<table id="change_user_table">
			<tr>
				<td> № </td> 
				<td> Фамилия </td>
				<td> Имя </td>
				<td> Отчество </td>
				<td> Дата рождения </td>
				<td> Выбор <br> (Tab) </td>
			</tr>
		</table>
		<input type="button" class="message_button" value="Добавить нового (Enter)">
	</div>

	<a class="header" href="http://localhost/"> Редактор: Постоянный состав </a>
	<div class="main">
		<div class="avatar"></div>
		<div class="user_year">???</div>
		<form action="index.php" method="post" id="myform" enctype="multipart/form-data" onkeypress="if(event.keyCode == 13) return false;">
			<label id="label_surname" for="input_surname" title="Поле обязательно для заполнения">Фамилия:<span class="red" title="Поле обязательно для заполнения">*</span></label>	<input id="input_surname" name="input_surname" type="text" autocomplete="off" placeholder="Введите фамилию"> 
			<div class="clear"></div>
			<label id="label_name" for="input_name">Имя:</label>	<input id="input_name" name="input_name" type="text" autocomplete="off" placeholder="Введите имя"> 
			<div class="clear"></div>
			<label id="label_fathername" for="input_fathername">Отчество:</label>	<input id="input_fathername" name="input_fathername" type="text" autocomplete="off" placeholder="Введите отчество">
			<div class="clear"></div>
			<label id="label_date" for="input_date">Дата рождения:</label>	<input id="input_date" name="input_date" type="text" autocomplete="off" placeholder="Введите дату рождения">
			<div class="clear"></div>
			<input type="button" class="my_button scan" value="Поиск (Enter)">
			<div class="more_info">
				<label id="label_foto" for="input_foto">Фото:</label>	<input id="input_foto" name="input_foto" type="file">
				<div class="clear"></div>
				<label id="label_otdel" for="input_otdel">Подразделение:</label>	
				<select name="select_otdel" id="input_otdel">
					<option value="0" selected>Выберите подразделение</option>
					<?php while($row = mysqli_fetch_assoc($query)){ ?>
					<option value="<?php echo $row['id'];?>"><?php echo$row['name'];?></option>
					<?php } ?>
				</select>
				<div class="clear"></div>
				<label id="label_job" for="input_job">Должность:</label>	
				<select name="select_job" id="input_job">
					<?php while($row_job = mysqli_fetch_assoc($query_job)){ ?>
					<option title="<?php echo $row_job['job_otdel'];?>" value="<?php echo $row_job['id'];?>"><?php echo $row_job['name'];?></option>
					<?php } ?>
				</select>
				<div class="clear"></div>
				<label id="label_range" for="input_range">Звание:</label>	
				<select name="select_range" id="input_range">
					<?php while($row_range = mysqli_fetch_assoc($query_range)){ ?>
					<option value="<?=$row_range['id'];?>"><?=$row_range['name'];?></option>
					<?php } ?>
				</select>
				<div class="clear"></div>
				<label id="label_range_employ" for="input_range_employ">Служба:</label>	
				<select name="select_range_employ" id="input_range_employ">
					<?php while($row_range_employ = mysqli_fetch_assoc($query_range_employ)){ ?>
					<option value="<?=$row_range_employ['id'];?>"><?=$row_range_employ['name'];?></option>
					<?php } ?>
				</select>
				<div class="clear"></div>

				<label id="label_phone_mini" for="input_phone_mini">Внут. телефон:</label> <input class="input_mini" id="input_phone_mini" name="input_phone_mini" type="text">
				<input class="input_mini" id="input_phone" name="input_phone" type="text"> <label id="label_phone" class="right" for="input_phone">Внеш. телефон:</label>
				<div class="clear"></div>
				<label id="label_kabinet" for="input_kabinet">Кабинет:</label> <input class="input_mini" id="input_kabinet" name="input_kabinet" type="text">
				<select name="select_korpus" id="input_korpus">
					<option value="0">-</option>
					<option value="А">А</option>
					<option value="Б">Б</option>
					<option value="Крим">Крим</option>
				</select>
				<label id="label_korpus" class="right" for="input_korpus">Корпус:</label>
				<div class="clear"></div>
				<label id="label_status" for="input_status">Состояние:</label> 
				<select name="input_status" id="input_status">
					<option value="0">Не известно</option>
					<option value="1">Работает (служит)</option>
					<option value="-1">Уволен</option>
					<option value="2">Ветеран</option>
				</select>
				<div class="clear"></div>
				<input type="hidden" name="new_old" id="new_old" value="0">
				<input class="my_button rools" type="button" value="Права доступа">
				<input id="add_button" class="my_button save" name="my_button" type="submit" value="Сохранить">
			</div>
		</form>		
	</div>
<script src="js/script.js"></script>
</body>
</html>
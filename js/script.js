function get_current_age(date) {
  year_user = date[6]+date[7]+date[8]+date[9];
  year = (new Date().getFullYear() - year_user*1)*1;
  str = '';
  ost = year % 10;
  if (year < 21){
  	switch(year){
			case 1: str = " год"; break;
			case 2: str = " года"; break;
			case 3: str = " года"; break;
			case 4:	str = " года"; break;
			default: str = " лет"; break;
		}
  } else {
  	switch(ost){
			case 1: str = " год"; break;
			case 2:	str = " года"; break;
			case 3: str = " года"; break;
			case 4: str = " года"; break;
			default: str = " лет"; break;
  	}
  }
  result = year+str;
  return (result);
}

function get_info_user(surname,name,fathername,date_user){
	$.ajax({
		type: "POST",
		url: "/execute/get_info_user.php",
		dataType: "json",
		data: "surname="+surname+"&name="+name+"&fathername="+fathername+"&date_user="+date_user,
		success: function(response){
			$("a.header").html("Новый поиск! (Esc)");
			if(response[0] > 1){
				$(".message_text").html("Найдена группа пользователей!");
				$("#change_user_table").css({"display":"table"});
				var matrix = [];
				for(i=0;i<=response[0]-1;i++){
					array = response[i+1].split(";");
					matrix[i] = [];
					for(j=0;j<=4;j++){
						matrix[i][j]=array[j];
					}
				}
				//Создаём таблицу
				var tbody = document.getElementById('change_user_table').getElementsByTagName("TBODY")[0];
				for(i=0;i<=response[0]-1;i++){
				var row = document.createElement("TR");
				var td1 = document.createElement("TD");
				td1.appendChild(document.createTextNode(i+1));
				var td2 = document.createElement("TD");
				td2.appendChild(document.createTextNode(matrix[i][1]));
				var td3 = document.createElement("TD");
				td3.appendChild(document.createTextNode(matrix[i][2]));
				var td4 = document.createElement("TD");
				td4.appendChild(document.createTextNode(matrix[i][3]));
				var td5 = document.createElement("TD");
				td5.appendChild(document.createTextNode(matrix[i][4]));
				var td6 = document.createElement("TD");
				td6.innerHTML = "<input type='radio' name='radio_user' class='radio_user_change' value='"+matrix[i][0]+"'>";
				row.appendChild(td1);
				row.appendChild(td2);
				row.appendChild(td3);
				row.appendChild(td4);
				row.appendChild(td5);
				row.appendChild(td6);
				tbody.appendChild(row);
				}
			}

			if(response[0] == 0){
				$(".message_text").html("Такого пользователя не существует!");
				$(".message_button").val("Добавить нового");
				$("#new_old").val("0");
				$(".message_button").show(200);
			}
			 if(response[0] == 1) {
				if (response[13]!=0){
					string_range = "<br>"+response[13]+" "+response[14];
				} else {
					string_range = "";
				}
				$(".message_button").val("Редактировать данные (Enter)");	
				$(".message_text").html("Возможно, Вы имели в виду пользователя: "+string_range+" <br>"+response[1]+" "+response[2]+" "+response[3]);
				$("#input_surname").val(response[1]);
				$("#input_name").val(response[2]);
				$("#input_fathername").val(response[3]);
				$("#input_date").val(response[4]);
				if(response[5]!=''){
					$(".avatar").html("<img src='avatar/"+response[5]+"' alt=''>");
				}
				$("#input_otdel").val(response[6]);
				$("#input_phone_mini").val(response[8]);
				$("#input_phone").val(response[9]);
				$("#input_kabinet").val(response[10]);
				$("#input_korpus").val(response[11]);
				$("#input_job").val(response[12]);
				$("#input_range_employ").val(response[16]);
				$("#input_range").val(response[15]);
				$("#new_old").val(response[17]);
				$("#input_status").val(response[18]);
				if( response[18]==1 ){
				$("#input_status").addClass("green_bg");
				$("#input_status").removeClass("red_bg");
			} else if(response[18]==-1){
				$("#input_status").addClass("red_bg");
				$("#input_status").removeClass("green_bg");
			} else {
				$("#input_status").removeClass("green_bg");
				$("#input_status").removeClass("red_bg");
			}

				$(".message_button").show(200);

				$("#input_job option").hide();
				str_find = "("+response[6]+")";
				$("#input_job option").each(function(){
					title_find = $(this).attr("title");
					if( title_find.indexOf(str_find)>=0 ){
						$(this).show();
					}
				});
			}
			$(".radio_user_change").click(function(){
				$(".message_button").show(200);
				$(".message_button").val("Выбрать и редактировать (Enter)");
			});
		}
	});
}

function get_info_user_id(id_user){
	$.ajax({
		type: "POST",
		url: "/execute/get_info_user_id.php",
		dataType: "json",
		data: "id_user="+id_user,
		success: function(response){
			$("#input_surname").val(response[1]);
			$("#input_name").val(response[2]);
			$("#input_fathername").val(response[3]);
			$("#input_date").val(response[4]);
			if(response[5]!=''){
				$(".avatar").html("<img src='avatar/"+response[5]+"' alt=''>");
			}
			$("#input_otdel").val(response[6]);
			$("#input_phone_mini").val(response[8]);
			$("#input_phone").val(response[9]);
			$("#input_kabinet").val(response[10]);
			$("#input_korpus").val(response[11]);
			$("#input_job").val(response[12]);
			$("#input_range_employ").val(response[16]);
			$("#input_range").val(response[15]);
			$("#new_old").val(response[17]);
			$("#input_status").val(response[18]);
			if( response[18]==1 ){
				$("#input_status").addClass("green_bg");
				$("#input_status").removeClass("red_bg");
			} else if(response[18]==-1){
				$("#input_status").addClass("red_bg");
				$("#input_status").removeClass("green_bg");
			} else {
				$("#input_status").removeClass("green_bg");
				$("#input_status").removeClass("red_bg");
			}

			$(".message_button").css({"display":"none"});
			$("#change_user_table").css({"display":"none"});
			$(".message_text").html("Идёт поиск...");
			$(".message").css({"display":"none"});
			$(".darken").css({"display":"none"});
			$(".scan").css({"display":"none"});
			$(".more_info").css({"display":"block"});

			$("#input_surname").animate({"width":"220px"},100,function(){
				$("#input_name").animate({"width":"220px"},100,function(){
					$("#input_fathername").animate({"width":"220px"},100,function(){
						$("#input_date").animate({"width":"100px"},100,function(){
							$(".avatar").fadeIn(300);
							date_year_string = $("#input_date").val();
							$(".user_year").html(get_current_age(date_year_string));

							$(".user_year").animate({"right":"250px"});
						});
					});
				});
			});

			$("#input_job option").hide();
			str_find = "("+response[6]+")";
			$("#input_job option").each(function(){
				title_find = $(this).attr("title");
				if( title_find.indexOf(str_find)>=0 ){
					$(this).show();
				}
			});
		}
	});
}

$(document).ready(function(){
	$("#input_date").datepicker({changeMonth:true,changeYear:true,dateFormat:'dd-mm-yy',showAnim:'clip'});

	$("#input_surname").focus();

	$("#input_status").change(function(){
		if( $(this).val()==1 ){
				$("#input_status").addClass("green_bg");
				$("#input_status").removeClass("red_bg");
			} else if($(this).val()==-1){
				$("#input_status").addClass("red_bg");
				$("#input_status").removeClass("green_bg");
			} else {
				$("#input_status").removeClass("green_bg");
				$("#input_status").removeClass("red_bg");
			}
	});

	$(document).keyup(function (e){

		if(event.keyCode == 13){
			if( $(".message").is(":hidden") ){
				if( $(".scan").is(":visible") ){
					$(".scan").click();
				} else {
					//$("*:focus").click();
					$(".save").click();
				}
			} else {
				if( $(".message_button").is(":visible") ){
					$(".message_button").click();
				}
			}
		}

		if(event.keyCode == 9){
			if( $("#change_user_table").is(":visible") ){
				$(".radio_user_change:first").click();
				$(".radio_user_change:first").focus();
			}
		}

		if(event.keyCode == 27){
			window.location.href = "http://localhost/";
		}
	});

 	
	$(".scan").click(function(){
		_surname = $("#input_surname").val();
		_name = $("#input_name").val();
		_fathername = $("#input_fathername").val();
		_date = $("#input_date").val();
		if(_name==''){_name=0;}
		if(_fathername==''){_fathername=0;}
		if(_date==''){_date=0;}

		if ( _surname != '' )  {
			$(".darken").css({"display":"block"});
			$(".message").show(200);
			get_info_user(_surname,_name,_fathername,_date);
		} else {
			if (_surname =='') {
				$("#input_surname").addClass("error");
				$("#input_surname").attr({"placeholder":"Обязательно для заполнения!"});
			}
		}
	});

	$("#input_surname").keyup(function(){
		$(this).removeClass("error");
		$(this).attr({"placeholder":"Введите фамилию"});
	});

//////////////////////////////////////// Смена цвета label'a при фокусировке
// Фамилия
$("#label_surname").css({"color":"white"});
	$("#input_surname").focus(function(){
		$("#label_surname").css({"color":"white"});
	});
	$("#input_surname").blur(function(){
		$("#label_surname").css({"color":"#5FC0CE"});
	});
// Имя
	$("#input_name").focus(function(){
		$("#label_name").css({"color":"white"});
	});
	$("#input_name").blur(function(){
		$("#label_name").css({"color":"#5FC0CE"});
	});
// Отчество
	$("#input_fathername").focus(function(){
		$("#label_fathername").css({"color":"white"});
	});
	$("#input_fathername").blur(function(){
		$("#label_fathername").css({"color":"#5FC0CE"});
	});
// День рождения
	$("#input_date").focus(function(){
		$("#label_date").css({"color":"white"});
	});
	$("#input_date").blur(function(){
		$("#label_date").css({"color":"#5FC0CE"});
	});

// Выбор отдела
	$("#input_otdel").focus(function(){
		$("#label_otdel").css({"color":"white"});
	});
	$("#input_otdel").change(function(){
		$("#label_otdel").css({"color":"#5FC0CE"});
		/////////////////////////////////////////////////////////////////////////////
		$("#input_job option").hide();
		str_find = "("+$("#input_otdel").val()+")";
		$("#input_job option").each(function(){
			title_find = $(this).attr("title");
			if( title_find.indexOf(str_find)>=0 ){
				$(this).show();
			}
		});
		$("#input_job").val("0");
	});
		$("#input_otdel").blur(function(){
		$("#label_otdel").css({"color":"#5FC0CE"});
	});
// Выбор должности
	$("#input_job").focus(function(){
		$("#label_job").css({"color":"white"});
	});
	$("#input_job").change(function(){
		$("#label_job").css({"color":"#5FC0CE"});
	});
	$("#input_job").blur(function(){
		$("#label_job").css({"color":"#5FC0CE"});
	});
// Выбор звание
	$("#input_range").focus(function(){
		$("#label_range").css({"color":"white"});
	});
	$("#input_range").change(function(){
		$("#label_range").css({"color":"#5FC0CE"});
	});
	$("#input_range").blur(function(){
		$("#label_range").css({"color":"#5FC0CE"});
	});
// Выбор служба
	$("#input_range_employ").focus(function(){
		$("#label_range_employ").css({"color":"white"});
	});
	$("#input_range_employ").change(function(){
		$("#label_range_employ").css({"color":"#5FC0CE"});
	});
	$("#input_range_employ").blur(function(){
		$("#label_range_employ").css({"color":"#5FC0CE"});
	});
// Внутренний телефон
	$("#input_phone_mini").focus(function(){
		$("#label_phone_mini").css({"color":"white"});
	});
	$("#input_phone_mini").blur(function(){
		$("#label_phone_mini").css({"color":"#5FC0CE"});
	});
// Внешний телефон
	$("#input_phone").focus(function(){
		$("#label_phone").css({"color":"white"});
	});
	$("#input_phone").blur(function(){
		$("#label_phone").css({"color":"#5FC0CE"});
	});
// Номер кабинета
	$("#input_kabinet").focus(function(){
		$("#label_kabinet").css({"color":"white"});
	});
	$("#input_kabinet").blur(function(){
		$("#label_kabinet").css({"color":"#5FC0CE"});
	});
// Выбор корпуса
	$("#input_korpus").focus(function(){
		$("#label_korpus").css({"color":"white"});
	});
	$("#input_korpus").change(function(){
		$("#label_korpus").css({"color":"#5FC0CE"});
	});
	$("#input_korpus").blur(function(){
		$("#label_korpus").css({"color":"#5FC0CE"});
	});

//Валидация формы
$("#myform").validate({
       rules:{
            input_surname:{
                required: true,
            },
            select_otdel:{
                min: 1,
            },
       },
       messages:{
            input_surname:{
                required: "",
            },
            select_otdel:{
                min: "",
            },
       }
  });

//-------------------------------
	$(".darken").click(function(){
		$(".message").css({"display":"none"});
		$(".darken").css({"display":"none"});
		$(".message_button").css({"display":"none"});
		$("#change_user_table").css({"display":"none"});
		$(".message_text").html("Идёт поиск...");
		$("#input_surname").val("");
		$("#input_name").val("");
		$("#input_fathername").val("");
		$("#input_date").val("");
		$(".autorization_area").hide();
	});

	$(".message_button").click(function(){
		if( $("#change_user_table").is(":visible") ){
			change_id = $("input[name='radio_user']:checked").val();
			$(".message_button").fadeOut();
			$("#change_user_table").fadeOut();
			$(".message_text").html("Ищу...");
			get_info_user_id(change_id);
		} else {
			$(".message_button").css({"display":"none"});
			$("#change_user_table").css({"display":"none"});
			$(".message_text").html("Идёт поиск...");
			$(".message").css({"display":"none"});
			$(".darken").css({"display":"none"});
			$(".scan").css({"display":"none"});
			$(".more_info").css({"display":"block"});

			$("#input_surname").animate({"width":"220px"},100,function(){
				$("#input_name").animate({"width":"220px"},100,function(){
					$("#input_fathername").animate({"width":"220px"},100,function(){
						$("#input_date").animate({"width":"100px"},100,function(){
							$(".avatar").fadeIn(300);
							date_year_string = $("#input_date").val();
							$(".user_year").html(get_current_age(date_year_string));
							$(".user_year").animate({"right":"250px"});
						});
					});
				});
			});
		}
	});

	$(".autorization_button").click(function(){
		$(".darken").show();
		$(".autorization_area").fadeIn(200);
		$(".autoriz_login").focus();
	});

	$(".rools").click(function(){
		alert("В разработке...");
	});
});
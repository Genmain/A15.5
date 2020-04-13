// ссылка на загрузку сказки
const dataURL = "https://api.jsonbin.io/b/5e905926172eb643896166e7";
// загруженая сказка 
var tail_text = String();
var array_of_vals=[];
// функция поиска уникальных вхождений
function unique(arr) {
	let result = [];
	for (let str of arr) {
		if (!result.includes(str)) {
			result.push(str);
		}
	}
	return result;
}

// обнуляем обьекты в DOM
function initial() {
	tail_text ='';
	$('#source-tail-text').html("");
	$('.form-group').html("");
	$('#result-tail-text').html("");
}

// тянем JSON и склеиваем в строку
function handleGetButton() {
	// взять данные по dataUrl, вытащить их и передать в handleData
	initial();
	$.getJSON(dataURL,
		function (data) {
			items = [];
			$.each(data,
				function (key, val) {
					items.push(val);
				});
			tail_text = items[0].join('\n');
			// console.log(tail_text)
			$('#source-tail-text').html("<h2 class='h2'> Исходный текст</h2><pre>" + tail_text + "</pre>");
		});
}
// ищем в полученной строке вхождения переменных
function find_val() {
	$('.form-group').html("");
	$('<h2/>', {
		"class" : "h2 row col-12",	
		html : "Найденные переменные",
	}).appendTo('.form-group');
	// var array_of_vals = []	
	array_of_vals = unique(String(tail_text).match(/\{.\S*\b\}/g));
	// console.log(array_of_vals);
	let form_group=$('.form-group');
	for (let val in array_of_vals){
		let var_row = $('<div/>', {
			"class" : "row col-6",
			// "id"	: "variables",
		}).appendTo(form_group);
		let name = array_of_vals[val].substr(1,`${array_of_vals[val]}`.length-2)
		let input_field = $('<input/>', {
			"class"	: 	"form-control col-6",
			"name"	: 	name,
			"id" 	:	name,
			"placeholder" : name,
		});
		let label = $('<label/>', {
			"class": "pad col-5",
			"for" : name,
			html : name,
		})
		
		label.appendTo(var_row);
		input_field.appendTo(var_row);
	}
}
// используем значения из полей
function useVal() {
	let result=$('#result-tail-text');
	let result_tail_text = tail_text;
	for (let i in array_of_vals){
		let regex = new RegExp(array_of_vals[i], "g");
		result_tail_text=result_tail_text.replace(regex,$("#"+array_of_vals[i].substr(1,array_of_vals[i].length-2)).val())
	}
	result.html("<h2 class='h2 row col-12'>Результат</h2><pre>"+result_tail_text+"</pre>");
}

$('#button-fetch').click(handleGetButton);
$('#button-parse').click(find_val);
$('#button-set').click(useVal);
$(document).ready(handleGetButton);
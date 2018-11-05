'use strict';
$(function() {

	//выравниваем по ширине названия всех пунктов
	let span = document.getElementsByClassName('item');
	for (let i = 0; i < span.length; i++) {
		let elem = span[i];
		elem.style.cssText = 'display: inline-block; width: 150px;';
	}

	//применяем стили размеров для разных форм
	let frm = document.forms.SITE_INFO;
	frm.elements.DEVELOPERS.style.cssText = 'width: 320px;';
	frm.elements.SITE_NAME.style.cssText = 'width: 320px;';
	frm.elements.SITE_URL.style.cssText = 'width: 200px;';
	frm.elements.DATE.style.cssText = 'width: 100px;';
	frm.elements.VISITORS.style.cssText = 'width: 100px;';
	frm.elements['E-MAIL'].style.cssText = 'box-sizing: border-box; width: 140px;';
	frm.elements.CATEGORY.style.cssText = 'box-sizing: border-box; width: 140px;';
	frm.elements.DESCRIPTION.style.cssText = 'height: 90px; width: 475px;';

	//применяем стили для сообщений об ошибке
	let errorMessage = document.getElementsByClassName('error-message');
	for (let i = 0; i < errorMessage.length; i++) {
		let elem = errorMessage[i];
		elem.style.cssText = `display: none;
                              position:absolute;
                              margin-left: 10px;
                              padding: 0 5px 0;
                              background: red;
                              opacity: .6;`;
	}

	// подписываем форму на событие focusout
	frm.addEventListener('focusout', validateInfoForm, false);

	//находим кнопку отправки формы и подписываем на неё событие click
	let submitButton = document.querySelector('input[type="button"]');
	submitButton.addEventListener('click', sendingForm, false);

	//находим все нужные элементы формы для валидации при отправке
	let allElements = document.querySelectorAll(`form[name="SITE_INFO"] input,
                                                   form[name="SITE_INFO"] select,
                                                   form[name="SITE_INFO"] textarea`);

	//очищаем данные при рефреше страницы
	for (let i = 0; i < allElements.length; i++) {
		let elem = allElements[i];

		switch (elem.name) {
			case 'LOCATION':
			case 'COMMENTS':
				elem.checked = false;
				break;
			default:
				elem.value = '';
				break;
		}
	}

	//сообщение об ошибке для радиобаттонов
	let errorRadio = document.getElementsByClassName('error-message--radio')[0];


	function validateInfoForm(e) {
		let errorItem = e.target.nextElementSibling,
			//выбранный радиобаттон пользователем
			radioChecked = document.querySelector('input[name="LOCATION"]:checked'),
			//выбранный чекбокс
			checkboxChecked = document.querySelector('input[name="COMMENTS"]:checked');

		switch (e.target.name) {
			case 'SITE_NAME':
				if (e.target.value.length > 30 || e.target.value.length < 1) {
					errorItem.style.display = 'inline-block';
				} else {
					errorItem.style.display = 'none';
				}
				break;
			case 'SITE_URL':
				//если формат строки верный, то обращаемся к серверу
				//и узнаём существует ли домен на самом деле
				if (e.target.value.match(/^http:\/\/.+\.\w{2,3}/) || e.target.value.match(/^https:\/\/.+\.\w{2,3}/)) {

					let ajaxHandlerScript = 'https://fe.it-academy.by/TestAjax3.php';

					let userDomain = e.target.value.replace(/https?:\/\//, '');
					//получаем данные с сервера
					let getDomain = function() {
						return new Promise((resolve, reject) => {
							try {
								$.ajax({
									url: ajaxHandlerScript,
									type: 'GET',
									dataType: 'text',
									data: {
										func: 'GET_DOMAIN_IP',
										domain: userDomain
									},
									cache: false,
									success: resolve,
									error: reject
								});
							} catch (ex) {
								console.log(ex);
							}
						});
					};

					let readReady = function(callresult) {
						if (callresult.error !== undefined)
							alert(callresult.error);
						else if (callresult === "104.239.213.7") {
							errorItem.style.display = 'inline-block';
						} else {
							errorItem.style.display = 'none';
						}
					};

					let errorHandler = function(jqXHR) {
						alert(jqXHR.status + ' ' + jqXHR.statusText);
					};

					getDomain().then(readReady, errorHandler);

				} else {
					errorItem.style.display = 'inline-block';
				}
				break;
			case 'DATE':
				if (e.target.value.match(/^(0?[1-9]|[1-2]\d|3[0-1])\.(0?[1-9]|1[1-2])\.(19|20)\d\d$/)) {
					errorItem.style.display = 'none';
				} else {
					errorItem.style.display = 'inline-block';
				}
				break;
			case 'DEVELOPERS':
				if (isNaN(e.target.value) && !parseFloat(e.target.value)) {
					errorItem.style.display = 'none';
				} else {
					errorItem.style.display = 'inline-block';
				}
				break;
			case 'VISITORS':
				if (!isNaN(parseFloat(e.target.value)) && isFinite(e.target.value)) {
					errorItem.style.display = 'none';
				} else {
					errorItem.style.display = 'inline-block';
				}
				break;
			case 'E-MAIL':
				if (e.target.value.match(/\w@\w/)) {
					errorItem.style.display = 'none';
				} else {
					errorItem.style.display = 'inline-block';
				}
				break;
			case 'CATEGORY':
				if (e.target.value !== '') {
					errorItem.style.display = 'none';
				} else {
					errorItem.style.display = 'inline-block';
				}
				break;
			case 'LOCATION':
				if (radioChecked) {
					errorRadio.style.display = 'none';
				} else {
					errorRadio.style.display = 'inline-block';
				}
				break;
			case 'COMMENTS':
				if (checkboxChecked) {
					errorItem.style.display = 'none';
				} else {
					errorItem.style.display = 'inline-block';
				}
				break;
			case 'DESCRIPTION':
				if (e.target.value.length < 300 && e.target.value.length > 30) {
					errorItem.style.display = 'none';
				} else {
					errorItem.style.display = 'inline-block';
				}
				break;
			default:
				break;
		}
	}

	//функция валидации и отправки формы
	function sendingForm(e) {
		//перебираем каждый элемент формы
		for (let i = 0; i < allElements.length; i++) {
			let elem = allElements[i],
				errorItem = elem.nextElementSibling,
				//выбранный радиобаттон пользователем
				radioChecked = document.querySelector('input[name="LOCATION"]:checked'),
				//выбранный чекбокс
				checkboxChecked = document.querySelector('input[name="COMMENTS"]:checked');

			switch (elem.type) {
				case 'url':
				case 'email':
				case 'textarea':
				case 'text':
					if (elem.value === '') {
						errorItem.style.display = 'inline-block';
						elem.focus();
					}
					break;
				case 'select-one':
					if (elem.value === '0') {
						errorItem.style.display = 'inline-block';
						elem.focus();
					}
					break;
				case 'radio':
					if (!radioChecked) {
						errorRadio.style.display = 'inline-block';
						elem.focus();
					}
					break;
				case 'checkbox':
					if (!checkboxChecked) {
						errorItem.style.display = 'inline-block';
						elem.focus();
					}
					break;
				default:
					break;
			}

		}

		let errorMessages = document.querySelectorAll('span.error-message');
		let arrErrorMessages = [...errorMessages];
		//если не показано ни одного сообщения об ошибке - отправляем форму
		let noErrors = arrErrorMessages.every((i) => i.style.display === 'none');
		if (noErrors) {
			frm.submit();
		}

	}



});
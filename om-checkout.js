//Create HTML for payment
function formCard() {
	var raizHtml = ".step.store-country-BRA .accordion-body .accordion-inner .box-step .box-step-content form.form-step.box-new.row-fluid .steps-view";
	var htmlCard = '\
					<div class="contentCard">\
						<form id="formCard">\
							<div class="numberCard contentForm">\
								<label for="numbercart">Número do cartão</label>\
								<input type="text" name="numbercart" id="numbercart" />\
							</div>	\
							<div class="cardsOptions contentForm">\
								<div class="optionsRadio">\
								</div>\
								<select class="installments">\
									<option value="parce">Selecione o numero de parcela</option>\
								</select>\
							</div>\
							<div class="nameUser contentForm">\
								<label for="nameCard">Nome impresso no cartão</label>\
								<input type="text" name="nameCard" id="nameCard" />\
							</div>\
							<div class="shelfLifeCard contentForm">\
								<label for="shelfLife">Validade</label>\
								<div class="contentShelfLife">\
									<select name="shelfLife--day" id="shelfLife--day">\
										<option value="mes">Mês</option>\
										<option value="01">01</option>\
										<option value="02">02</option>\
										<option value="03">03</option>\
										<option value="04">04</option>\
										<option value="05">05</option>\
										<option value="06">06</option>\
										<option value="07">07</option>\
										<option value="08">08</option>\
										<option value="09">09</option>\
										<option value="10">10</option>\
										<option value="11">11</option>\
										<option value="12">12</option>\
									</select>\
									<span>/</span>\
									<select name="shelfLife--year" id="shelfLife--year">\
									    <option value="ano">Ano</option>\
									    <option value="17">17</option>\
									    <option value="18">18</option>\
									    <option value="19">19</option>\
									    <option value="20">20</option>\
									    <option value="21">21</option>\
									    <option value="22">22</option>\
									    <option value="23">23</option>\
									    <option value="24">24</option>\
									    <option value="25">25</option>\
									    <option value="26">26</option>\
									    <option value="27">27</option>\
									    <option value="28">28</option>\
									    <option value="29">29</option>\
									    <option value="30">30</option>\
									    <option value="31">31</option>\
									    <option value="32">32</option>\
									    <option value="33">33</option>\
									    <option value="34">34</option>\
									    <option value="35">35</option>\
									    <option value="36">36</option>\
									    <option value="37">37</option>\
									</select>\
								</div>\
							</div>\
							<div class="safety">\
								<label for="codSafety">Código de segurança</label>\
								<input type="text" name="codSafety" id="codSafety" />\
							</div>\
						</form>\
					</div>';

	$(''+raizHtml+' iframe').css('display','none');
	$(''+raizHtml+'').append(htmlCard);
}


//Get info simulation (items, ratesAndBenefitsData, paymentData, selectableGifts, marketingData, postalCode, country, logisticsInfo)
function requestGetCard() {
	var data = JSON.stringify({
	 	"items": [
	   		{
	    		"id": "24",
	    		"quantity": 1,
	    		"seller": "1"
	    	}
	  	],
	  	"postalCode": "21760520",
	  	"country": "BRA",
	  	"marketingData": {
	    	"coupon": "",
	    	"utmSource": ""
	  	}
	});

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
	  	if (this.readyState === 4) {
	    	var getInfoSimlation = this.responseText;
	    	var dataGetCard = jQuery.parseJSON(getInfoSimlation)
	    	var paymentOptions = dataGetCard.paymentData.paymentSystems;
	    	var installmentOptions = dataGetCard.paymentData.installmentOptions;
	    	
	    	//Create Radios wiht is cards
	    	for(var i = 0; i < paymentOptions.length; i++) {
	    		
	    		if(paymentOptions[i].groupName == "creditCardPaymentGroup") {
	    			var nameCard = paymentOptions[i].name;
	    			var inputRadio = '<div class="'+nameCard+'"><input type="radio" name="options" value="'+nameCard+'"><br></div>';
	    			$('.cardsOptions .optionsRadio').append(inputRadio);
	    		}
	    		
	    	}

	    	//Create select
	    	for(var i = 0; i < installmentOptions.length; i++) {
	    		
	    		if(installmentOptions[i].paymentGroupName == "creditCardPaymentGroup") {
	    			var installments = installmentOptions[i].installments;
	    			var nameCardSelect = installmentOptions[i].paymentName;

	    			for(var x = 0; x < installments.length; x++) {
	    				// x = x+1;
		    			var select = '<option value="'+nameCardSelect+'">'+ (x+1) +'X</option>';
		    			$('.cardsOptions .installments').append(select);
	    			}

	    		}

	    	}
	  	} else {
	  		return false;
	  	}
	});

	xhr.open("POST", "//originalmedia.vtexcommercestable.com.br/api/checkout/pub/orderForms/simulation");
	xhr.setRequestHeader("accept", "application/json");
	xhr.setRequestHeader("content-type", "application/json");
	xhr.setRequestHeader("cache-control", "no-cache");
	xhr.setRequestHeader("postman-token", "93ef4aa2-8cdc-d13c-897d-1ca2841a155a");

	xhr.send(data);
}

//Get is flag of card
function validadeCard() {
	$('#numbercart').cardcheck({
		callback: function(result) {

			var status = (result.validLen && result.validLuhn) ? 'valid' : 'invalid',
			message = '',
			types = '';

			// Get the names of all accepted card types to use in the status message.
			for (i in result.opts.types) {
				types += result.opts.types[i].name + ", ";
			}
			types = types.substring(0, types.length-2);

			// Set status message
			if (result.len < 1) {
				message = 'Please provide a credit card number.';
			} else if (!result.cardClass) {
				message = 'We accept the following types of cards: ' + types + '.';
			} else if (!result.validLen) {
				message = 'Please check that this number matches your ' + result.cardName + ' (it appears to be the wrong number of digits.)';
			} else if (!result.validLuhn) {
				message = 'Please check that this number matches your ' + result.cardName + ' (did you mistype a digit?)';
			} else {
				message = 'Great, looks like a valid ' + result.cardName + '.';
			}


			$('.optionsRadio div').each(function() {
				var nameRadio = $(this).find('input').val().toLowerCase();
				var nameNumberCard = result.cardName.toLowerCase();

				if(nameNumberCard == nameRadio) {
					$(this).fadeIn();
					$(this).find('input').attr('checked', 'true');
				} else {
					$(this).fadeOut();
				}

				$(this).find('input').each(function() {
					if($(this).attr('checked') == 'checked') {
						var nemaRadioSelect = $(this).val();
						$('.installments option').each(function() {
							if($(this).val() == nemaRadioSelect) {
								$(this).css('display','block');
							} else {
								$(this).css('display','none');
							}
						})
					}
				})
			})
		}
	});
}

function validateUser(emailUser) {
	$.ajax({
		"async": true,
		"crossDomain": true,
		"url": "//originalmedia.vtexcommercestable.com.br/api/checkout/pub/profiles?email=ronald.junger%40originalmedia.com.br",
		"method": "GET",
		"headers": {
			"cache-control": "no-cache",
			"postman-token": "134e570e-60e8-7dbf-85d1-1bfa05ac3001"
		},
		success : function (searchClient) {
			console.log(searchClient)
	    	//Validade 
			var numberCardClient = $('input#numbercart').val();
			var installmentsClient = $('select.installments option:selected').text().replace(/X/gi, "");
			var nameCardClient = $('input#nameCard').val();
			var dayCardCleint = $('select#shelfLife--day').val();
			var yearCardCleint = $('select#shelfLife--year').val();
			var codSafety = $('input#codSafety').val();

			if(searchClient.userProfile !== null) {

		    	if(installmentsClient !== "parce") {
		    		if(dayCardCleint !== "mes" && yearCardCleint !== "ano") {
		    			if(codSafety !== "") {

							//profile
							var idItem = "";
							var priceItem = "";
							var emailClient = searchClient.userProfile.email;
							var addressClient = searchClient.availableAddresses[0].addressId;

							//shippingData address
							var addressType = "";
							var receiverName = "";
							var postalCode = "";
							var city = "";
							var state = "";
							var country = "";
							var street = "";
							var number = "";
							var neighborhood = "";
							var complement = "";
							var value = "";

							//logisticsInfo
							var selectedSla = "";
							var slas = "";
							var shippingEstimate = "";
							var price = "";

							var typeCardUser = "";
							var paymentSystem = "";
							var paymentSystemName = "";
							

							$('.optionsRadio div').each(function() {
								if($(this).find('input').attr('checked') == "checked") {
									typeCardUser = $(this).find('input').val();
								}
							})

							vtexjs.checkout.getOrderForm().then(function(orderForm) {
								//Card
								for(var i = 0; i < orderForm.paymentData.paymentSystems.length; i++) {
									if(orderForm.paymentData.paymentSystems[i].name == typeCardUser) {
										paymentSystem = orderForm.paymentData.paymentSystems[i].stringId;
										paymentSystemName = orderForm.paymentData.paymentSystems[i].name;
									}
								}

								console.log(paymentSystem)

								//profile
								idItem = orderForm.items[0].id;
								priceItem = orderForm.items[0].price;
								firstName = orderForm.clientProfileData.firstName;
								lastName = orderForm.clientProfileData.lastName;

								value = orderForm.value;

								//logisticsInfo
								selectedSla = orderForm.shippingData.logisticsInfo[0].selectedSla;
								slas = orderForm.shippingData.logisticsInfo[0].slas;

								//Get information of wight delivery select
								for(var i = 0; i < slas.length; i++) {
									if(slas[i].name == selectedSla) {
										shippingEstimate = slas[i].shippingEstimate;
										price = slas[i].price;
									}
								}

								//create json wight an orders
								var data = JSON.stringify({
								    "items":[
								        {
								            "id": ""+idItem+"",
								            "quantity":1,
								            "seller":"1",
								            "price": priceItem,
								            "unitMultiplier": 1
								        }
								    ],
								    "clientProfileData":{
								        "email": emailClient
								    },
								    "shippingData":{
								        "id":"shippingData",
								        "address":{
								            "addressId": addressClient
								        },
								        "logisticsInfo":[
								            {
									            "itemIndex":0,
								                "selectedSla":"Normal",
								                "lockTTL":null,
								                "shippingEstimate":"3bd",
								                "price":800
								            }
								        ]
								    },
								    "openTextField":{
								        "value":null,
								        "expectedOrderFormSections":[

								        ]
								    },
								    "marketingData":null,
								    "paymentData":{
								        "id":"paymentData",
								        "payments":[
								            {
								                "paymentSystem": paymentSystem,
								                "referenceValue": value,
								                "value": value,
								                "installments": installmentsClient
								            }
								        ],
								        "gift-cards":[

								        ]
								    }
								});

								var xhr = new XMLHttpRequest();
								xhr.withCredentials = true;

								xhr.addEventListener("readystatechange", function () {
								  	if (this.readyState === 4) {
								    	var placeOrder = this.responseText;
								    	var placeOrderJson = jQuery.parseJSON(placeOrder);

								    	console.log(placeOrderJson)

										var value = placeOrderJson.transactionData.merchantTransactions[0].payments[0].value;
										var orderGroup = placeOrderJson.orders[0].orderGroup;
										var addressIdOrder = placeOrderJson.orders[0].shippingData.addressId;
										var currencyCode = placeOrderJson.orders[0].shippingData.country;
										var transactionID = placeOrderJson.transactionData.merchantTransactions[0].transactionId;
										var merchantName = placeOrderJson.transactionData.merchantTransactions[0].merchantName;

										var data = JSON.stringify([
										    {
										        "paymentSystem": paymentSystem,
										        "paymentSystemName": paymentSystemName,
										        "group":"creditCardPaymentGroup",
										        "installments": installmentsClient,
										        "installmentsInterestRate": 0,
										        "installmentsValue": value,
										        "value": value,
										        "referenceValue": value,
										        "fields":{
										            "holderName": nameCardClient,
										            "cardNumber": numberCardClient,
										            "validationCode": codSafety,
										            "dueDate": dayCardCleint+"/"+yearCardCleint,
										            "addressId": addressIdOrder
										        },
										        "interestRate": 0,
										        "installmentValue": installmentsClient,
										        "transaction":{
										            "id": transactionID,
										            "merchantName": merchantName
										        },
										        "currencyCode": currencyCode
										    }
										]);

										var xhr = new XMLHttpRequest();
										xhr.withCredentials = true;

										xhr.addEventListener("readystatechange", function () {
										  	if (this.readyState === 4) {
										    	console.log(this.responseText);
										    	console.log('Pedido enviado');
												
												var data = null;

												var xhr = new XMLHttpRequest();
												xhr.withCredentials = true;

												xhr.addEventListener("readystatechange", function () {
												  	if (this.readyState === 4) {
												    	console.log(this.responseText);

												    	window.location = "/checkout/orderPlaced/?og="+orderGroup;
												  	}
												});

												xhr.open("POST", "//originalmedia.vtexcommercestable.com.br/api/checkout/pub/gatewayCallback/"+orderGroup);
												xhr.setRequestHeader("content-type", "application/json");
												xhr.setRequestHeader("accept", "application/json");
												xhr.setRequestHeader("set-cookie", "Vtex_CHKO_Auth=JpkQgZR+MlpgnB1PNfx8x5MBtOVAhjTJGA6BZzfy3k8=");
												xhr.setRequestHeader("cache-control", "no-cache");
												xhr.setRequestHeader("postman-token", "c3a6f200-7bcb-801a-7ce2-c83250257cc0");

												xhr.send(data);

										  	} else {
										  		console.log('error: Send Payment');
										  	}
										});

										xhr.open("POST", "//originalmedia.vtexpayments.com.br/api/pub/transactions/"+transactionID+"/payments");
										xhr.setRequestHeader("content-type", "application/json");
										xhr.setRequestHeader("cache-control", "no-cache");
										xhr.setRequestHeader("postman-token", "cbc8f50c-3a8f-d3d5-ab57-c96cae1a782e");

										xhr.send(data);
								  	}
								});

								xhr.open("PUT", "//originalmedia.vtexcommercestable.com.br/api/checkout/pub/orders");
								xhr.setRequestHeader("content-type", "application/json");
								xhr.setRequestHeader("accept", "application/json");
								xhr.setRequestHeader("cache-control", "no-cache");
								xhr.setRequestHeader("postman-token", "b0722d6e-97cc-6bd7-d962-6929a66500d0");

								xhr.send(data);
							});
		    				
		    			} else {
		    				alert('coloque o codigo de segurançado cartão !!');		
		    			}

		    		} else {
		    			alert('O campo validade não foi !!');	
		    		}
		    	} else {
		    		alert('Escolha o numero de parcela !!');
		    	}

			} else {
		    	//Validade 
				var numberCardClient = $('input#numbercart').val();
				var installmentsClient = $('select.installments option:selected').text().replace(/X/gi, "");
				var nameCardClient = $('input#nameCard').val();
				var dayCardCleint = $('select#shelfLife--day').val();
				var yearCardCleint = $('select#shelfLife--year').val();
				var codSafety = $('input#codSafety').val();

		    	if(installmentsClient !== "parce") {
		    		if(dayCardCleint !== "mes" && yearCardCleint !== "ano") {
		    			if(codSafety !== "") {
							//profile
							var idItem = "";
							var priceItem = "";
							var emailClient = "";
							var firstName = "";
							var lastName = "";
							var documentClient = "";
							var phone = "";

							//shippingData address
							var addressType = "";
							var receiverName = "";
							var postalCode = "";
							var city = "";
							var state = "";
							var country = "";
							var street = "";
							var number = "";
							var neighborhood = "";
							var complement = "";
							var value = "";

							//logisticsInfo
							var selectedSla = "";
							var slas = "";
							var shippingEstimate = "";
							var price = "";
							var paymentSystem = "";
							
							vtexjs.checkout.getOrderForm().then(function(orderForm) {

								//profile
								idItem = orderForm.items[0].id;
								priceItem = orderForm.items[0].price;
								emailClient = orderForm.clientProfileData.email;
								firstName = orderForm.clientProfileData.firstName;
								lastName = orderForm.clientProfileData.lastName;
								documentClient = orderForm.clientProfileData.document;
								phone = orderForm.clientProfileData.phone;

								//shippingData address
								addressType = orderForm.shippingData.address.addressType;
								receiverName = orderForm.shippingData.address.receiverName;
								postalCode = orderForm.shippingData.address.postalCode;
								city = orderForm.shippingData.address.city;
								state = orderForm.shippingData.address.state;
								country = orderForm.shippingData.address.country;
								street = orderForm.shippingData.address.street;
								number = orderForm.shippingData.address.number;
								neighborhood = orderForm.shippingData.address.neighborhood;
								complement = orderForm.shippingData.address.complement;
								value = orderForm.value;

								//logisticsInfo
								selectedSla = orderForm.shippingData.logisticsInfo[0].selectedSla;
								slas = orderForm.shippingData.logisticsInfo[0].slas;

								//Get information of wight delivery select
								for(var i = 0; i < slas.length; i++) {
									if(slas[i].name == selectedSla) {
										shippingEstimate = slas[i].shippingEstimate;
										price = slas[i].price;
									}
								}
					
								console.log(idItem)

								//create json wight an orders
								var data = JSON.stringify({
								    "items":[
								        {
								            "id": ""+idItem+"",
								            "quantity": 1,
								            "seller": "1",
								            "price": priceItem,
								            "unitMultiplier": 1
								        }
								    ],
								    "clientProfileData":{
								        "email": emailClient,
								        "firstName": firstName,
								        "lastName": lastName,
								        "document": documentClient,
								        "documentType":"cpf",
								        "phone": phone,
								        "corporateName":null,
								        "tradeName":null,
								        "corporateDocument":null,
								        "stateInscription":null,
								        "corporatePhone":null,
								        "isCorporate":false,
								        "expectedOrderFormSections":[

								        ]
								    },
								    "shippingData":{
								        "id":"shippingData",
								        "address":{
								            "addressType": addressType,
								            "receiverName": receiverName,
								            "addressId":"",
								            "postalCode": postalCode,
								            "city": city,
								            "state": state,
								            "country": country,
								            "street": street,
								            "number": number,
								            "neighborhood": neighborhood,
								            "complement": complement,
								            "reference":null,
								            "geoCoordinates":[

								            ]
								        },
								        "logisticsInfo":[
								            {
								                "itemIndex":0,
								                "selectedSla":"Normal",
								                "lockTTL":null,
								                "shippingEstimate":"3bd",
								                "price":800
								            }
								        ]
								    },
								    "paymentData":{
								        "id":"paymentData",
								        "payments":[
								            {
								                "paymentSystem": installmentsClient,
								                "referenceValue": value,
								                "value": value,
								                "installments": installmentsClient
								            }
								        ]
								    }
								});

								console.log()

								//Put place order
								var xhr = new XMLHttpRequest();
								xhr.withCredentials = true;

								xhr.addEventListener("readystatechange", function () {
								  if (this.readyState === 4) {
								    console.log(this.responseText);
								  }
								});

								xhr.open("PUT", "//originalmedia.vtexcommercestable.com.br/api/checkout/pub/orders");
								xhr.setRequestHeader("content-type", "application/json");
								xhr.setRequestHeader("accept", "application/json");
								xhr.setRequestHeader("x-vtex-api-appkey", "ronald.junger@originalmedia.com.br");
								xhr.setRequestHeader("x-vtex-api-apptoken", "R0n@ld95");
								xhr.setRequestHeader("cache-control", "no-cache");
								xhr.setRequestHeader("postman-token", "514da740-9ced-60f8-cd01-6bdd8101bc91");

								xhr.send(data);
							});
		    				
		    			} else {
		    				alert('coloque o codigo de segurançado cartão !!');		
		    			}

		    		} else {
		    			alert('O campo validade não foi !!');	
		    		}
		    	} else {
		    		alert('Escolha o numero de parcela !!');
		    	}
			}
	    },
	    error: function(jqXHR, exception) {
	    }
	}).done(function(data) {
		console.log(data)
	})
}

function clickFinish() {
	$('.payment-data-submit-novo').on('click', function() {
		validateUser();
	});
}

$(document).ready(function() {
	formCard();
	requestGetCard();
	validadeCard();
	clickFinish();
	
	$('.payment-group-list-btn a').on('click', function(even) {
		event.preventDefault();

		if($(this).attr('id') !== "payment-group-creditCardPaymentGroup") {
			$('.contentCard').remove();
			$('button.payment-data-submit-novo').addClass('removeBtn');
			$('button#payment-data-submit').removeClass('removeBtn');
		} else {
			$('button#payment-data-submit').addClass('removeBtn');
			$('button.payment-data-submit-novo').removeClass('removeBtn');
			formCard();
			requestGetCard();
			validadeCard();
		}
	})

	$('input#numbercart').mask('9999 9999 9999 9999');
	
});

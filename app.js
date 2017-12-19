"use strict";

var app = (function(){
	/*	
	*	Solution: Problem1
	*	JSON representation of the example tree.
	*/
	var data = {
		id: 1,
		label: 'a',
		children: [
			{
				id: 2,
				label: 'B',
				children: [
					{
						id: 5,
						label: 'E'						
					},
					{
						id: 6,
						label: 'F'
					},
					{
						id: 7,
						label: 'G'
					}					
				]
			},
			{
				id: 3,
				label: 'C'
			},
			{
				id: 4,
				label: 'D',
				children: [
					{
						id: 8,
						label: 'H'
					},
					{
						id: 9,
						label: 'I'
					}
				]
			}
		] 
	};

	/*	
	*	Solution: Problem2
	*	AJAX function for fetching JSON data.
	*/

	var url = 'http://localhost:3000/';

	function readResponseBody(xhr) {
	    var data;
	    if (xhr.responseType == "" || xhr.responseType === "text") {
	        data = JSON.parse(xhr.responseText);
	    } else if (xhr.responseType === "document") {
	        data = xhr.responseXML;
	    } else {
	        data = xhr.response;
	    }
	    return data;
	}

	function callApi(opts){
		var xhr = new XMLHttpRequest();
		var data = opts.data || null;
		return new Promise(function(resove, reject){//use callbacks for lagacy browsers with no promise 
			xhr.onreadystatechange = function() {
			    if(xhr.readyState == XMLHttpRequest.DONE) {
					if(xhr.status == 200){//done
						var resp = readResponseBody(xhr);
						resove(resp);
					}else{
						reject("Something went wrong.");
					}
				}		  
			}
			xhr.open(opts.method || "GET", url+opts.endpoint, true);
			xhr.send(data);
		});		
	}

	callApi({endpoint: "getJSON", method: "GET"})
	.then(function(response){		
		var label = getNodeLabelById(response, 4);
		if(label){
			console.log("Label for node 4 is: ", label);
		}else{
			console.log("No label found for provided node id.");
		}
	}, function(err){
		console.error(err);
	});

	/*	
	*	Solution: Problem3
	*	DFS: Recursive function for getting label by id.
	*/

	function getNodeLabelById(node, id){
		if(node.id === id){
			return node["label"];//for optional label
		}
		var label = null;
		if(node.children && node.children.length){
			for(var i=0; i < node.children.length; i++){
				label = getNodeLabelById(node.children[i], id);
				if(label){
					return label;
				}
			}
		}				
	}

	
	/*	
	*	Solution: Problem4
	*	Form validation
	*/

	var form  = document.getElementById("userForm");		
	var inputs = form.getElementsByTagName("input");
	var selects = form.getElementsByTagName("select");

	var patterns = {
		alpha: {
			regex: /^[A-Za-z\s]+$/, 
			msg: ' must only contain alphabets'
		},
		numeric: {
			regex: /^[0-9]+$/,
			msg: ' must only contain numbers'
		}, 
		alphaNumeric: {
			regex: /^[\w\d\s]+$/,
			msg: ' must only contain alphabets and numbers'
		}
	};

	var validationRules = {
		name: setValidations(true, 1, 100, patterns['alpha']),
		address1: setValidations(true, 1, 100, patterns['alphaNumeric']),
		address2: setValidations(false, 0, 100, patterns['alphaNumeric']),
		city: setValidations(true, 1, 50, patterns['alphaNumeric']),
		state: setValidations(true, 2, 2, patterns['alpha']),
		zip_code: setValidations(true, 5, 5, patterns['numeric']),
	};

	function setValidations(isReq, min, max, pattern){
		return {
			required: isReq,
			min: min,
			max: max,
			pattern: pattern
		};
	}
	function addClass(element, classname ) {
	    var cn = element.className;
	    if( cn.indexOf( classname ) != -1 ) {
	        return;
	    }
	    if( cn != '' ) {
	        classname = ' '+classname;
	    }
	    element.className = cn+classname;
	}

	function removeClass(element, classname) {
	    var cn = element.className;
	    var rxp = new RegExp( "\\s?\\b"+classname+"\\b", "g");
	    cn = cn.replace( rxp, '' );
	    element.className = cn;
	}

	function showFieldError(field, msg){
		var errorElm = document.getElementsByClassName(field.getAttribute("name") + ' error-msg')[0];
		errorElm.innerHTML = msg;
		addClass(field, "invalid");
	}

	function hideFieldError(field){
		var errorElm = document.getElementsByClassName(field.getAttribute("name") + ' error-msg')[0];
		errorElm.innerHTML = '';
		removeClass(field, "invalid");
	}
	
	function validateField(name, value){
		var rule = validationRules[name];
		var displayName = name.charAt(0).toUpperCase() + name.slice(1).split('_').join(' ');
		if(!value || value === ""){
			return rule.required ? displayName + " is required" : false;
		}
		
		if(value.length < rule.min || value.length > rule.max){
			if(rule.min == rule.max){
				return displayName +" must be "+ rule.max +" characters long"; 
			}
			return displayName +" must be between "+ rule.min +" to "+ rule.max +" characters"; 
		}
		if(!rule.pattern.regex.test(value)){
			return displayName + rule.pattern.msg;
		}
		return false;
	}

	function validateFields(fields){
		var isValid = true;
		for(var i=0; i < fields.length; i++){
			var field = fields[i];
			var msg = validateField(field.getAttribute("name"), field.value);
			if(msg){//invalid				
				if(isValid){
					isValid = false;				
				}
				showFieldError(field, msg);
			}else{
				hideFieldError(field);
			}
		}
		return isValid;
	}

	function validateForm(){
		return (!validateFields(inputs) && !validateFields(selects));			
	}	

	function resetFields(fields){
		for(var i=0; i < fields.length; i++){
			var field = fields[i];
			field.value = '';
			hideFieldError(field)
		}
	}

	function resetForm(event){
		resetFields(inputs);
		resetFields(selects);
	}

	//app response
	return {
		jsonData: data,
		callApi: callApi,
		getNodeLabelById: getNodeLabelById, 
		validateForm: validateForm,
		resetForm: resetForm
	};

})();



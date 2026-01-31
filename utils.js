document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("generate").addEventListener("click", generatePassword);

	document.getElementsByClassName("icon")[0].addEventListener("click", () => {
		navigator.clipboard.writeText(document.getElementById("password").value);
	});

	const checkbox_l = document.getElementById("lowercase");
	const checkbox_u = document.getElementById("uppercase");
	const checkbox_n = document.getElementById("numbers");
	const checkbox_s = document.getElementById("special");
	const lengthBar = document.getElementById("length-bar");
	const label = document.getElementById("length-label");

	checkbox_l.addEventListener("change", () => {
		chrome.storage.local.set({ lowercase: checkbox_l.checked });
	}); 

	checkbox_u.addEventListener("change", () => {
		chrome.storage.local.set({ uppercase: checkbox_u.checked });
	});

	checkbox_n.addEventListener("change", () => {
		chrome.storage.local.set({ numbers: checkbox_n.checked });
	});

	checkbox_s.addEventListener("change", () => {
		chrome.storage.local.set({ special: checkbox_s.checked });
	});

	lengthBar.addEventListener("input", () => {
		label.textContent = `Length: ${lengthBar.value}`;
		chrome.storage.local.set({ length: lengthBar.value });
	});

	loadSettings();
});


function loadSettings() {
	chrome.storage.local.get(["lowercase", "uppercase", "numbers", "special", "length"]).then((result) => {
		if (result.lowercase === undefined) {
			chrome.storage.local.set({ lowercase: true });
		}
		if (result.uppercase === undefined) {
			chrome.storage.local.set({ uppercase: true });
		}
		if (result.numbers === undefined) {
			chrome.storage.local.set({ numbers: true });
		}
		if (result.special === undefined) {
			chrome.storage.local.set({ special: true });
		}
		if (result.length === undefined) {
			chrome.storage.local.set({ length: 20 });
		}

		chrome.storage.local.get(["lowercase", "uppercase", "numbers", "special", "length"]).then((result) => {
			let checkbox_l = document.getElementById("lowercase");
			checkbox_l.checked = result.lowercase;

			let checkbox_u = document.getElementById("uppercase");
			checkbox_u.checked = result.uppercase;

			let checkbox_n = document.getElementById("numbers");
			checkbox_n.checked = result.numbers;

			let checkbox_s = document.getElementById("special");
			checkbox_s.checked = result.special;

			let lengthBar = document.getElementById("length-bar");
			let label = document.getElementById("length-label");
			lengthBar.value = result.length
			label.textContent = `Length: ${result.length}`;
			generatePassword();
		});	
	});
}

function generatePassword() {
	let low = document.getElementById("lowercase").checked;
	let upp = document.getElementById("uppercase").checked;
	let num = document.getElementById("numbers").checked;
	let spe = document.getElementById("special").checked;
	let len = document.getElementById("length-bar").value;

	const password = document.getElementById("password");

	if (low && upp && num && spe && len == 20) {
		password.value = defaultGeneration();
	}else{
		password.value = customGeneration(low, upp, num, spe, len);
	}
}

function randomNumber(n){
	const array = new Uint8Array(1);
	crypto.getRandomValues(array);
	return array[0] % (n+1);
}

function randomizeString(array, len) {
	let string = "";
	for (let i=0; i<len; i++) {
		let x = randomNumber(array.length-1);
		string = string + array[x];
	}
	return string;
}

function defaultGeneration() {
	const letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
	let password = randomizeString(letters, 16);

	let upp = letters[randomNumber(letters.length-1)].toUpperCase();
	let upp_pos = randomNumber(password.length);
	password = password.slice(0, upp_pos) + upp + password.slice(upp_pos);

	let digit = randomNumber(9);
	let digit_pos = randomNumber(password.length);
	password = password.slice(0, digit_pos) + digit + password.slice(digit_pos);

	password = password.slice(0, 6) + "-" + password.slice(6,12) + "-" + password.slice(12);
	return password;
}

function customGeneration(low, upp, num, spe, len) {
	if (!low && !upp && !num && !spe) {
		return "We need something in it!";
	}

	let password = "";
	let letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

	if (low) {
		
		password = randomizeString(letters, len);
	}

	if (upp) {
		if (password == "") {
			password = randomizeString(letters, len).toUpperCase();
		}else{
			for (let i=0; len-i>0; i+=20){
				upp_pos = randomNumber(password.length);
				password = password.slice(0, upp_pos) + letters[randomNumber(letters.length-1)].toUpperCase() + password.slice(upp_pos+1);
			}
		}
	}

	if (num) {
		let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
		if (password == "") {
			password = randomizeString(numbers, len);
		}else{
			for (let i=0; len-i>0; i+=20){
				upp_pos = randomNumber(password.length);
				password = password.slice(0, upp_pos) + numbers[randomNumber(numbers.length-1)] + password.slice(upp_pos+1);
			}
		}

	}

	if (spe) {
		let special = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "-", "=", "{", "}", "[", "]", "|", "\\", ":", ";", "\"", "'", "<", ">", ",", ".", "?", "/", "~", "`"];
		if (password == "") {
			password = randomizeString(special, len);
		}else{
			for (let i=-20; len-i>0; i+=20){
				upp_pos = randomNumber(password.length);
				password = password.slice(0, upp_pos) + special[randomNumber(special.length-1)] + password.slice(upp_pos+1);
			}
		}
	}
	return password;
}
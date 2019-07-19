const newPw=document.querySelector("#newPassword");
const confirmPw=document.querySelector('#confirmPassword');
const submit=document.querySelector('#submit-btn');
const validation=document.querySelector('#validation');



confirmPw.addEventListener('input',e=>{
	newPwValue=newPw.value;
	confirmPwValue=confirmPw.value
	if(confirmPwValue!==newPwValue){
		validation.classList.remove("alert-success");
		validation.classList.add('alert-danger');
		validation.innerHTML="Password don't match !!"
			submit.setAttribute("disabled",true);

	}
	else{
		if(confirmPwValue==="" && newPwValue===""){
			validation.classList.remove('alert-danger');		
			validation.classList.remove('alert-success');
			validation.innerHTML=""
			submit.removeAttribute("disabled");
		}else{
		validation.classList.remove('alert-danger');		
		validation.classList.add('alert-success');
		validation.innerHTML="Password matched !!"
		submit.removeAttribute("disabled");
	}
}
})

newPw.addEventListener('input',e=>{
	newPwValue=newPw.value;
	confirmPwValue=confirmPw.value
	if(confirmPwValue!==newPwValue){
		validation.classList.remove("alert-success");
		validation.classList.add('alert-danger');
		validation.innerHTML="Password don't match !!"
			submit.setAttribute("disabled",true);

	}else{
	if(confirmPwValue==="" && newPwValue===""){
			validation.classList.remove('alert-danger');		
			validation.classList.remove('alert-success');
			validation.innerHTML=""
			submit.removeAttribute("disabled");
		}else{
		validation.classList.remove('alert-danger');		
		validation.classList.add('alert-success');
		validation.innerHTML="Password matched !!"
		submit.removeAttribute("disabled");
	}
}
})


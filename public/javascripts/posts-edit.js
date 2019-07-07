let form=document.querySelector("#form");
form.addEventListener("submit",function(event){
	let uploadImage=document.querySelector("#imageUpload").files.length;
	let checkedImage=document.querySelectorAll(".imageDeleteCheckbox:checked").length;
	let totalImage=document.querySelectorAll(".imageDeleteCheckbox").length
	if(((totalImage-checkedImage) +uploadImage)>4){
		event.preventDefault();
		alert("images cann't be more than 4 ....")
	}
})

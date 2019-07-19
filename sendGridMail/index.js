const sgMail=require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID_API);

module.exports={
	async postForgotPwMail(req,clientEmail,token){
		const msg = {
		  to: clientEmail,
		  from:'surfBoard - <vikramsingh15j@gmail.com>',
		  subject: 'Surf Shop - Forgot Password / Reset',
		  text:`You are receiving this because you (or someone else)
		  	have requested the reset of the password for your account.
			Please click on the following link, or copy and paste it
			into your browser to complete the process:
			http://${req.headers.host}/reset/${token}
			If you did not request this, please ignore this email and
			your password will remain unchanged.`.replace(/		  	/g, '')
		};
		await sgMail.send(msg);
	},
	async putResetMail(clientEmail){
		const msg = {
	    to: clientEmail,
	    from: 'Surf Shop Admin <vikramsingh15j@email.com>',
	    subject: 'Surf Shop - Password Changed',
	    text: `Hello,
		  This email is to confirm that the password for your account has just been changed.
		  If you did not make this change, please hit reply and notify us at once.`.replace(/	    /g, '')
	  };

	  await sgMail.send(msg);

	}
}
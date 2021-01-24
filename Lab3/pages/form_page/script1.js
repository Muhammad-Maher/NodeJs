$(document).ready(function () {
	

	$('.register_button').click(
		() => {
			let data = {};
			var dateUsed = new Date();
			$(".form input").each((index, item) => {

				data[$(item).attr("name")] = $(item).val()
				
			});
			

			 fetch("/register", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then((res) => {
				console.log("Request complete! response",res);
				(res.status ==200)? window.location.href='./loginPage' :''
			});


		}
	);




});
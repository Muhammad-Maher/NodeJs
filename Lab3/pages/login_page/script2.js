$(document).ready(function () {


	$('.login_button').click(
		() => {
			let data = {};
			var dateUsed = new Date();
			$(".form input").each((index, item) => {

				data[$(item).attr("name")] = $(item).val()

			});


			fetch("/login", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
				.then((res) => {
					return res.json()
				})
				.then((res) => {
					console.log(res);

				});


		}
	);




});
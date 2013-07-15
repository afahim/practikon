$(document).ready(function(){

	$('.span2').slideToggle(0);	

	var oddClick = true;


	$("button").click(function(){
		if (oddClick)
		{
			$('.span1').slideToggle(4000);
			setTimeout(function(){$('.span2').slideToggle(4000);},50);	
			
			oddClick = false;
		}
		else
		{
			$('.span2').slideToggle(4000);			
			setTimeout(function(){$('.span1').slideToggle(4000);},50);	
			oddClick = true;
		}
	});
});


/* Version 1
$(document).ready(function(){

	$('.span2').slideToggle(0);	

	var oddClick = true;


	$("button").click(function(){
		if (oddClick)
		{
			$('.span2').slideToggle(200);	
			$('.span1').slideToggle(200);
			oddClick = false;
		}
		else
		{
			$('.span1').slideToggle(200);			
			$('.span2').slideToggle(200);
			oddClick = true;
		}
	});
});
*/
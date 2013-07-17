/* ============================================================================
  Class Manipulator - Library for performing operations on class objects in JS
  ============================================================================= */


//This function takes in a string and a className which can contain multiple classes
//It returns the class which contains all or part of the string
function getClassWith(string, className){
	var classList = className.split(/\s+/);
	for (var i = 0; i < classList.length; i++) 
	{
		if (classList[i].indexOf(string) !== -1)
		{
			return classList[i];
		}
	}

	return undefined;
}

//This function takes in a string and a className which can contain multiple classes
//It removes the class(es) which match the string
//It returns a modified class list as a string
function removeClassWith(string, className){
	var classList = className.split(/\s+/);
	var newClassList = "";
	for (var i = 0; i < classList.length; i++) 
	{
		if (classList[i].indexOf(string) === -1)
		{
			newClassList = newClassList + classList[i] + " ";
		}
	}
	return newClassList;
}

//This function takes in a string, a className which can contain multiple classes, and another string
//It removes the class(es) which match the string
//It adds the newString as a class to the className
//It returns a modified class list as a string
function replaceClassWith(string, className, newString){
	var classList = className.split(/\s+/);
	var newClassList = "";
	for (var i = 0; i < classList.length; i++) 
	{
		if (classList[i].indexOf(string) === -1)
		{
			newClassList = newClassList + classList[i] + " ";
		}
	}
	return newClassList + newString;
}

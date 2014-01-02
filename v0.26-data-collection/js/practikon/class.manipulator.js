/* =========================================================================
  Class Manipulator - JS Library for manipulating classes of DOM objects
  ========================================================================== */

/*---------------------------------------------------------------------------
    getClassWith
    Arguments - string, className which can contain multiple classes
    Returns - class which contains all or part of the string;
    	undefined otherwise.
    -------------------------------------------------------------------------*/

function getClassWith(string, className){
	var classList = className.split(/\s+/);

	for (var i = 0; i < classList.length; i++) {
		if (classList[i].indexOf(string) !== -1) {
			return classList[i];
		}
	}

	return undefined;
}

/*---------------------------------------------------------------------------
    removeClassWith
    Arguments - string, className which can contain multiple classes
    Returns - class name without class matching the string
    -------------------------------------------------------------------------*/

function removeClassWith(string, className){
	var classList = className.split(/\s+/);
	var newClassList = "";

	for (var i = 0; i < classList.length; i++) {
		if (classList[i].indexOf(string) === -1) {
			newClassList = newClassList + classList[i] + " ";
		}
	}

	return newClassList;
}

//It removes the class(es) which match the string
//It adds the newString as a class to the className
//It returns a modified class list as a string

/*---------------------------------------------------------------------------
    replaceClassWith
    Arguments - string, className which can contain multiple classes,
    	newString
    Returns - class name where string classes are replaced with newString
    -------------------------------------------------------------------------*/

function replaceClassWith(string, className, newString){
	var classList = className.split(/\s+/);
	var newClassList = "";
	
	for (var i = 0; i < classList.length; i++) {
		if (classList[i].indexOf(string) === -1) {
			newClassList = newClassList + classList[i] + " ";
		}
	}

	return newClassList + newString;
}

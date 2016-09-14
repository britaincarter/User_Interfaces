
var factorize = function(n){
	
	var result = [];
	var i = 2;
	while(n>1){
		if(n%i===0){
			n/=i;
			result.push(i);

		}else{
			i++;
		}

	}

return result;

}

console.log(factorize(10));

console.log("hello");
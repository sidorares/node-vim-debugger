var result=[];
var result2= [];
//---------------------------------------
//	Data definition 
//---------------------------------------
class Card {
  constructor(left,right,top,bottom) {
		this._left = left;
		this._right = right;
		this._top= top;
		this._bottom = bottom;
  }
	get right(){
		return this._right;
	}
	set right(value){
		this._right = value;
	}
	get left(){
		return this._left;
	}
	set left(value){
		this._left = value;
	}
	get top(){
		return this._top;
	}
	set top(value){
		this._top = value;
	}
	get bottom(){
		return this._bottom;
	}
	set bottom(value){
		this._bottom = value;
	}
}
Card.prototype.toString = function dogToString() {
	var convert = function convert(number){
		const blueFront 	= 	11;
		const blueBack 		= 	-11;
		const purpleFront	= 	12;
		const purpleBack	= 	-12;
		const grayFront		= 	15;
		const grayBack		= 	-15;
		const redFront 		= 	16;
		const redBack 		= 	-16;
		switch(number){
			case blueFront : 
				return 'blueFront';
			case blueBack: 
				return 'blueBack';  	
			case purpleFront: 
				return 'purpleFront'; 	
			case purpleBack: 
				return 'purpleBack'; 	
			case grayFront: 
				return 'grayFront'; 	
			case grayBack: 
				return 'grayBack'; 	
			case redFront: 
				return 'redFront'; 	
			case redBack: 
				return 'redBack'; 	
			default:
				return "error in element";
		}
	}
	  var result = '(' + this.left  + ' '  + this.right + ' ' + this.top + ' ' + this.bottom + ')';
		  return result;
}
class Game {
  constructor(cardsArray) {
		this.cards=cardsArray;
  }
}


//---------------------------------------
//	Function Defintions 
//---------------------------------------
/**
	* Rotate the card clockwise (to the right )
	* @param card
	*
*/
function rotateCard(card,j){
	//console.log('rotateCard');
	//console.log(card);
	var tmp = Object.assign({},card);
	
	switch (j){
		case 0: 
				return card;
		case 1:
			card.top =  tmp.left;
			card.right =  tmp.top;
			card.bottom =  tmp.right;
			card.left =  tmp.bottom;
			return card;
		case 2:
			card.right =  tmp.left;
			card.bottom =  tmp.top;
			card.left =  tmp.right;
			card.top =  tmp.bottom;
			return card;
		case 3:
			card.bottom =  tmp.left;
			card.left =  tmp.top;
			card.top =  tmp.right;
			card.right =  tmp.bottom;
			return card;
		default: 
			return card;
	}
}
//print each array permutation of the game array 
/**
	* returns an array that contains every permutation of our game array
	* @param game array initial game array
	* @return array containing every permuation of the game array
	*
*/
function print(array, n){
	if(array.length==1) {
		//return n.push(array[0]);
		//var tmp = n.slice();
		//tmp.push(array[0]);
		//result.push(tmp);
		//return result.push(n.push(array[0]));
		//var arr3 = n
		//console.log(n);
		//return result.push(n);  
		//var tmp = n.concat(array);
		//result.push(tmp);
		result.push(n.concat(array[0]));
		//result.push(array[0]);
		return ;

		//return result.push(n + "," +  array[0]+ "this");
		//result.push(n);
		//return result.push(n,array[0]);
		//return result.push(array[0]);
	}
	for(var i = 0;i<array.length;i++){
		var oldValue  = [];
		if(n!==undefined){
			oldValue =oldValue.concat(n);
		}
		var tmp = array.slice();
		var tmp2 = tmp.splice(i,1);
		//oldValue.push(tmp.splice(i,1));
		oldValue.push(tmp2[0]);
		//console.log(tmp);
		//console.log(oldValue);
		print(tmp, oldValue);
	}
}
/**
	* 
	*
*/
function rotate(array,n){
	if(array.length==1) {
		//if(array[0]== undefined){
			//return result2.push(n);
		return console.log(n + "," +  array[0]);
		//}
		//return result2.push(n.concat(array[0]));
	}
	for(var i = 0;i<array.length;i++){
		for(var j =0;j<4;j++){
			var oldValue  = [];
			if(n!==undefined){
				oldValue.push(n);
			}
			var tmp = array.slice();
			oldValue.push(rotateCard(tmp[i],j));
			tmp.splice(i,1);
			rotate(tmp, oldValue);
		}
	}
}
function fact(x){
	if(x==1) { return 1;}
	return x*fact(x-1);
}
/**
	* Checks if the game was solved and all card are in the
	* right places
	* @param game
	* @return bool
	*
*/
function checkSolution(game){
	console.log('===============');
	//console.log(game);
	console.time('checkSolution');
	// check left column 
	if( (game[0].right+game[1].left != 0) || (game[0].bottom+game[3].top != 0) ) return false;
	if( (game[3].right+game[4].left != 0) || (game[3].bottom+game[6].top != 0) ) return false;
	if( (game[6].right+game[7].left != 0) ) return false;
	
	// check middle column 
	if( (game[1].right+game[2].left != 0) || (game[1].bottom+game[4].top != 0) ) return false;
	if( (game[4].right+game[5].left != 0) || (game[4].bottom+game[7].top != 0) ) return false;
	if( (game[7].right+game[8].left != 0) ) return false;
	// check right column 
	if( (game[2].bottom+game[5].top != 0) ) return false;
	if( (game[5].bottom+game[8].top != 0) ) return false;
	console.log('Solution correct');
	console.log(game);
	solved=true;
	return true;
	console.timeEnd('checkSolution');
}

function main(){
	const blueFront 	= 	11;
	const blueBack 		= 	-11;
	const purpleFront	= 	12;
	const purpleBack	= 	-12;
	const grayFront		= 	15;
	const grayBack		= 	-15;
	const redFront 		= 	16;
	const redBack 		= 	-16;
	var soluion = [];
	var solved = false;
	console.log('Knobel Calculations');
	console.log('x x x');
	console.log('x x x');
	console.log('x x x');
	//console.log(game);

	var card0= new Card(grayFront, blueBack, redBack, purpleFront);
	var card1= new Card(purpleFront, blueBack, redFront, grayBack);
	var card2 = new Card(purpleFront, purpleBack, grayFront, blueBack);
	
	var card3 = new Card(blueFront, grayBack, purpleBack, redFront);
	var card4 = new Card(purpleBack, redFront, blueBack, grayFront);
	var card5 = new Card(purpleFront , grayBack, blueFront, redBack);

	var card6 = new Card(blueBack, purpleFront, redFront, grayBack);
	var card7 = new Card(purpleFront, redBack, grayFront, blueBack);
	var card8  = new Card(redFront, redBack, blueFront, grayBack);
	
	var rotateArray = [card0,card1,card2,card3,card4,card5,card6,card7,card8];
	//var game = new Game(cardsArray);
	//console.log(game);
	//console.log(fact(4));
	rotateArray= [card0,card1,card0];
	//rotateArray= [1,2,3];
	console.log('this is our array');
	print(rotateArray);
	console.log(result);
	//console.log(card0);
	var test = result[0];

	//console.log(result[0]);
	//console.log('lets roate our testarray');
	//console.log(rotateArray);
	//rotate(rotateArray);
	//console.log(result2);
	//for(var i = 0; i< result.length;i++){
		//result2=[];
		//console.log('starting to rotate array');
		//rotate(result[i]);
		//console.log('rotation done');
		//for(var j =0; i<result2.length;j++){
			//console.log(i +" of " +result.length +"     " +  i/result.length*100+ "% done");
			//if(checkSolution(result[i])){
				//console.log('found result');
				//console.log(result[i]);
			//}
		//}
	//}

		//for(var j = 0 ; j < result2.length; j++){
			//if(checkSolution(result2[j])){
				//return result2[j];
			//};
			//console.log('false');
		//}
	//}
	//console.log(result2);
	//console.log(result2[0]);
	//console.log('starting with our check for the entire array');
	//console.log(result2[5]);
	return
	return 'no solution found';
}
//---------------------------------------
//	Code Execution 
//---------------------------------------

console.log(main());

//Node.js library for collecting user input and
//Documentation can be found at https://github.com/SBoudrias/Inquirer.js
const inquirer = require('inquirer');

/*******************/
/**SETUP VARIABLES**/
/*******************/

//Default variables provided
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

//Game state boolean
let keepPlaying = true;

//Variable for storing generated field (makes manipulating info easier later on)
let newField;

//Variables for storing position in 2d array, default starting position is at arr[0][0]
let verticalPosition = 0;
let horizontalPosition = 0;

//Variables for storing 2d array lengths when generating field
let verticalCap, horizontalCap;


/***************/
/**CONSTRUCTOR**/
/***************/
class Field {
  constructor(field) {
    this.field = field;
  }

  // Print method
  print() {
    for(var i = 0; i < this.field.length; i++) {
        console.log(this.field[i].join(''));
    }
  }
}

/***********************/
/**GENERATOR FUNCTIONS**/
/***********************/

//Set the holes on the grid based on percentage provided in function call
function generateResultRandomly(percentage){
  var random = Math.floor(Math.random() * 101);
  if (random <= percentage) {
    return 'O'
  }
  else {
    return '░'
  }
}

//Set starting position of player on grid
function setStart(arr) {
    arr[0][0] = "*";
    return arr;
}

//Set a random end point for player on grid within provided limits
function setRandomEnd(arr, height, width) {
    const rand1 = Math.floor(Math.random() * height);
    const rand2 = Math.floor(Math.random() * width);
    //if the generated position is our starting point, shuffle up the rand1 and rand2 variables
    while (arr[rand1][rand2] == "*") {
      rand1 = Math.floor(Math.random() * height);
      rand2 = Math.floor(Math.random() * width);
    }
    //set the value of randomly chosen position in the array to the hat symbol
    arr[rand1][rand2] = "^";
    //return the array
    return arr;
}   

//generate the field based on provided height, width and percentage inputs
function generateField(height, width, percentage) {
  //set values of these variables based on input provided
  verticalCap = height;
  horizontalCap = width;

  return new Promise(function(resolve, reject){
    //edge case for max range, if height is over 10, set value to 10
    if(height > 10) {
      height = 10;
    }
    //edge case for max range, if width is over 10, set value to 10
    if(width > 10) {
      width = 10;
    }
    //edge case for non existent or percentage over 100, if condition met, set to 50/50 odds
    if(!percentage || percentage > 100) {
        percentage = 50;
    }
    //if minimum requirements are met, then proceed
    if (height > 1 && width > 1) {
      //create and populate 2d array based on parameters provided in function call
      let matrix = new Array(height); 
      for (var i = 0; i < height; ++i) {
        let widthArr = [];
        for (var j = 0; j < width; ++j) {
          widthArr.push(generateResultRandomly(percentage));                
        }
        matrix[i] = widthArr;
      }
      //after creating the array, set the start point
      setStart(matrix);
      //after creating the array, and setting the start point, set the random end point
      setRandomEnd(matrix, height, width);
      //pass the array to the Field constructor
      newField = new Field(matrix);    
      resolve(newField);
    }
    else {
      reject(new Error ('An error occured on start up.'));
    }
  }
)};


/****************/
/**GAME METHODS**/
/****************/

//Inquirer.js interface to prompt user for input and return it
function promptPhase() {  
  return new Promise(function(resolve){
    inquirer
      //prompt object with defined key/value pairs according to doc
      .prompt({
        type: 'checkbox',
        name: 'move',
        message: "Please make your move: (↑ ↓ ← →)",
        choices: [
          new inquirer.Separator('Directions: '),
          {
            name: 'Up',
          },
          {
            name: 'Down',
          },
          {
            name: 'Left',
          },
          {
            name: 'Right',
          }
        ],
        validate: function (answer) {
          if (answer.length < 1) {
            return 'You must choose a direction. (make sure to enter <space> to select your option.)';
          }
          return true;  
      }
    })
    .then(answers => {
      console.log('You chose: ' + answers.move);
      resolve(answers.move);
    })
  });
};

//update where we should be in 2d array based on user input
function updatePosition(val) {
  return new Promise(function(resolve, reject) {    
    //test whether the provided input leads to somewhere inside of our defined grid
    function testRange(rangeVar, rangeCap) {
      if(rangeVar < 0 || rangeVar > rangeCap) {
        keepPlaying = false;
        reject(new Error ('Variable outside of range, please select a direction on the grid. You lose. Try again!'));
      }
      else {
        resolve([verticalPosition, horizontalPosition]);
      }
    }
    //update positional variables and test whether locations are within acceptable ranges
    if(val == 'Up') {
      verticalPosition -= 1;
      testRange(verticalPosition, verticalCap);
    }
    else if(val == 'Down') {
      verticalPosition += 1;
      testRange(verticalPosition, verticalCap);
    }
    else if(val == 'Left') {
      horizontalPosition -= 1;
      testRange(horizontalPosition, horizontalCap);
    }
    else if(val == 'Right') {
      horizontalPosition += 1;
      testRange(horizontalPosition, horizontalCap);
    }
    else {
      reject(new Error ('You done broke something!'));
    }
  })
}

//test if winning conditions were met, otherwise update the array
function testWinAndUpdateArray(arr, positions) {
  return new Promise(function(resolve, reject) {
    //test if user jumped to a hole within the 2d array
    if(arr.field[positions[0]][positions[1]].toString() == 'O') {
      keepPlaying = false;
      reject(new Error ('You done jumped in a hole! You lose!'));
    }
    //test if user jumped to the hat within the 2d array
    else if(arr.field[positions[0]][positions[1]].toString() == '^') {
      keepPlaying = false;
      reject(new Error ('You done found your hat! You win!'));
    }
    //otherwise, continue with the promise chain
    else {        
      arr.field[positions[0]][positions[1]] = '*';
      resolve(arr);
    }
  })
}

/************/
/**RUN GAME**/
/************/

//async function that loops for as long as the keepPlaying variable returns true
//this function must await the user's input before continuing
//once the user input is received, a series of nest promises happen
const main = async () => {
  generateField(5, 5, 10);
  while (keepPlaying) {
    newField.print();
    await promptPhase()
    .then((input) => updatePosition(input)      
      .then((newPosition) => {
        testWinAndUpdateArray(newField, newPosition)
          .catch(error => console.log(error.message));
      })
    )
    .catch(error => console.log(error.message))
  }
};

//invoke the game function
main();
// to make the colors independent; red = color 1; blue = color2; green = color3; yellow = color 4
var buttonColors = ["color1", "color2", "color3", "color4"]; // denotes the colors for the 4 buttons
var gamePattern = [];           // this array stores the randomly generated colors by the game
var userClickedPattern = [];    // this array stores the user clicked buttons
var tutorialExecuted = false;   // this is a flag to tell wheater the tutorial was executed or not. false means the tutorial was not executed
var tutorialCounter = 0;        // this is a counter that helps the code switch the different tutorial prompts
var gameStarted = false;        // flag to tell the game to start, false = game has not started yet
var clicksAllowed = false;      // flag to control when the user is allowed to click on the tiles.

// ------------------ GLOBAL EVENT LISTENERS ---------------------
//since we cannot prevent an event from happening, we can only conditionally execute the code inside the even after the event is triggered. This makes sure that the first key press starts the game.
// Intro - PRess A Key to Start
$(document).keypress(function(){
    if (gameStarted      === false && 
        tutorialExecuted === false){ //execute tutorial first 
            tutorial_1();
    } else if (gameStarted      === false && 
               tutorialExecuted === true) { // after completing tutorial start game at lvl 1
    levelTitle();   //exit condition - change the tile to Level 1
    mainGame();     //exit condition - go to main game
    gameStarted = true; //make sure event listener does not execute this code again 
    clicksAllowed = true; // allow user to click on the lvl 1 button 
    }   
});
//Event listener detect which button the USER clicked on
$(".btn").click(function(event){
    if(clicksAllowed){  // if the user is allowed to click on buttons then execute the code below
        var userChosenColor = event.target.id;      // can also use 'this.id' and no event
        userClickedPattern.push(userChosenColor);   // push user clicked button to array
        pressed(userClickedPattern[userClickedPattern.length - 1]);     //call funtion that blinks button when pressed
        playSound(userClickedPattern[userClickedPattern.length - 1]);   //call audio function
        compareArray(userClickedPattern.length - 1);                    //compare user choice with the game's

    }
});
// ------------------ TUTORIAL ---------------------------
function tutorial_1 (){
    switch (tutorialCounter) { 

        case 0:
            $("h1").text("Every level you will be shown a new color");
            tutorialCounter++;
            
        break;
        case 1:
            $("h1").text("complete the level by clicking all the previous color boxes in the right order!");
            tutorialCounter++;
            
        break;
        case 2: // the tutorial counter will increase when te user clicks the correct box in the compare function 
            $("h1").text("Example: click on the box shown.");
            setTimeout(function() {
                getRandomColor();
            }, 800);
            clicksAllowed = true; 
            $("#continue__h2").text("");
        break;
        case 3: // the tutorial counter will increase when te user clicks the correct box in the compare function 
            $("h1").text("Now click on the previous box and the one just shown.");
            setTimeout(function() {
                getRandomColor();
            }, 800);
        break;
        case 4: // the tutorial counter will increase when te user clicks the correct box in the compare function 
        $("h1").text("Now click on the previous 2 boxes and the one just shown.");
        setTimeout(function() {
            getRandomColor();
        }, 800);
    break;
        case 5:
        setTimeout(function() { // this timeout is there to wait for the last box the user clicked to display the pressed animation from the pressed function. 
            $("h1").text("Great!");
            clicksAllowed = false;
            tutorialExecuted = true;
            $("#continue__h2").text("Press any key to start the game ...");
            startOver();
        }, 200);

        break; 
        default: tutorialExecuted = true; // if unexpected case occurs set tutorial to completed
    }
}
function mainGame(){
    //reset the array containing the user Inputs 
    userClickedPattern = [];
    //update level
    levelTitle();
    //we need to call a random color then store it in an array and make it blink and play a sound
    getRandomColor();
}   
//----------------- SUPPORTING FUNCTIONS -------------------------
// RNG - Generates a random number between the range 0 - 3 (4 choices)
function RNG() {
    var randomNumber = Math.random();
    return Math.floor(randomNumber * 4);
}
// selects the last random Color generated and adds a flash
function blink(arrayPosition){
    $("#" + arrayPosition).delay(100).fadeIn(100).fadeOut(100).fadeIn(100);
}
//show a presees effect by adding and removing a css class to the button
function pressed(arrayPosition){
    $("#" + arrayPosition).addClass("pressed");
    setTimeout(function() {
        $("#" + arrayPosition).removeClass("pressed");
    }, 100);
}
// plays the sound for the color selcted
function playSound(arrayPosition){
    var audio = new Audio("sounds/" + arrayPosition + ".mp3");
    audio.play();
}
function levelTitle() {
    $("h1").text("Level " + (gamePattern.length + 1));
    $("#continue__h2").text("");
}
//this function compares the user input against the game generated one for both the tutorial and normal gameplay. 
function compareArray(index){

    if(gamePattern[index] === userClickedPattern[index]){
        //check to see if end of pattern/level is reached 
        if (tutorialExecuted){
            if(gamePattern.length === userClickedPattern.length){
                //wait one second then move to next level
                setTimeout(function () {
                    mainGame();
                  }, 1000);
            }
        } else if (!tutorialExecuted){
            if(gamePattern.length === userClickedPattern.length){
                userClickedPattern = [];
                tutorialCounter++;
                tutorial_1();
            }
        }
    } else {
        if(!tutorialExecuted){
            userClickedPattern=[];
        }
        var gameOverAudio = new Audio("sounds/wrong.mp3");
        gameOverAudio.play();
        $("body").addClass("game-over");
        setTimeout(function () {
            $("body").removeClass("game-over");
          }, 200);
        if(tutorialExecuted){
        clicksAllowed = false; 
        $("h1").text("GAME OVER! :(");
        $("#continue__h2").text("Press any key to restart ...");
        startOver();
        }
    }
}
//resets variables
function startOver(){
    gamePattern = [];
    gameStarted = false;
}
// Links the random number  generated to a random color between 4 color choices
function getRandomColor() {
    var randomChosenColor = buttonColors[RNG()];
    gamePattern.push(randomChosenColor);
    //call blink function
    blink(gamePattern[gamePattern.length - 1]);
    //call audio function
    playSound(gamePattern[gamePattern.length - 1]);
}
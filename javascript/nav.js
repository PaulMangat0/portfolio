
/******************** NAVIGATION SYSTEM  ****************************/
/********************************************************************/
/********************************************************************/
// Author: Paul Mangat. 2022

/***** INIT ******/

// Set up fro Nav menu Button

//grab Nav System
const navMenu = document.querySelector("#nav-menu");
//Grab navbutton
const navButton = document.querySelector("#nav-button");

//Add click listener
navButton.addEventListener('click',activateNavMenu);

function activateNavMenu() {

  //turn on the menu 
  navMenu.classList.toggle("active");
  
}

// Setup for Nav Menu Links

//Grab nav links
const navLinks = document.querySelectorAll("#nav__link");

navLinks.forEach((item)=> {
  item.addEventListener('click',activateNavMenu); //turn off menu
});



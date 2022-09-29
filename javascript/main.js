/******************** Shared Utils  ************************/
/********************************************************************/
/********************************************************************/
// Author: Paul Mangat. 2022


let canvasWidth, canvasHeight;  

/********** Window Size Listener  ****************/
/* Resize the canvas to occupy the full page, 
   by getting the widow width and height and setting it to canvas*/

   onresize = (event) => { setSize(); };

   /**************** setSize  **********************/
   
   function setSize() {
       /* update width/height base on window inner dimensions */
       canvasWidth = window.innerWidth;
       canvasHeight = window.innerHeight;  
   
       /* for background */
       canvas.width  = canvasWidth;
       canvas.height = canvasHeight;
       
       /* for navbar centering */
      // updateNavbar(canvasWidth,canvasHeight); 
   }


/************ Animation End Events **************/


onanimationend = (event) => { 
  
  if(event.animationName==="navbar-connector__connector-drawB") {
    //load hub when navmenu line animation is complete
    //navbarHubBG.classList.toggle("active"); //open hub

  } else if(event.animationName==="slide-left") {

    //Start the typpewriter after hero title slides in
    typewriterGo();
  }
};

   
/************************************************************************* */
/***************************** FX ************************************* */
/***************************************************************************/

/*********** typewriter text effect****************/
function typewriterGo() {
    /* find the element wrapper*/
    const typewriterElement = document.querySelector("#typewriter");
    let  typewriterText = typewriterElement.textContent;
    typewriterElement.textContent="";
    typewriterElement.style.opacity="1";
  
    /* set interval to count through letters and display */
    const typewriterIntervalNum = setInterval(() => {
     
      if (parseInt(typewriterText.length)==0) {
          /* all letters have been shown */
          clearInterval(typewriterIntervalNum);
          return;
      } else {
        /* move the first letter into the textContent */
      typewriterElement.textContent=typewriterElement.textContent+typewriterText.charAt(0);
      typewriterText=typewriterText.substring(1);
      }
    },250); /* 500ms*/
  };



/***************************************************************************/
/***************************** Scroll based events *************************/
/***************************************************************************/

window.addEventListener("scroll",handleScroll);
let currentScrollY=0; /*updates after handling  scroll */

/* debounce scroll event listener */
let debounceWait = false;
function debounceReady() {
    if (debounceWait===true) {
        return false;
    }else {
        debounceWait=true;
        setTimeout( ()=> { debounceWait=false; }, "100");
        return true;
    }

}

/* calls all methods requiring scrollY info */
function handleScroll() {

    if(!debounceReady()) { return; }
    // console.log(currentScrollY);

    handleSlideInEvents(window.scrollY);

    currentScrollY=window.scrollY;
}


/* handle all slide in animations activated by scrollY */

const scrollInElements = document.querySelectorAll("#scroll-event:not(.slide-in-activate)"); /* get a list of all items to be checked */


function handleSlideInEvents(windowY) {
    scrollInElements.forEach ((item)=> {
        /* windowY = top off visible window */
        /* window.innerHeight = height of the visible window */        
        /* item offsetTop = top of the item */
        /* item.height = height of the item */

        const topOfitem = ((item.offsetTop) + (item.offsetHeight/2));

  let visY = ( (windowY+window.innerHeight)- ((item.offsetTop) + (item.offsetHeight/4)) ); //25% fade in
  // let visY = ( (windowY+window.innerHeight)- ((item.offsetTop) + (item.offsetHeight/10)) );  //10%




        if(visY>0) {
            item.classList.add("slide-in-activate");
        }

    })
}


/***************************************************************************/
/***************************** Slide in Tabs *******************************/
/***************************************************************************/

const tabControls = document.querySelectorAll("#tab-control");

tabControls.forEach((item) => {
  item.addEventListener('mouseenter',handleTabHover);
  item.addEventListener('mouseleave',handleTabHover);

  item.addEventListener('click',handleTabClick);
});

function handleTabHover(event) {
  // console.log(this);
  let tabNum = this.getAttribute("data-tabId");
  const tab= document.querySelector(`#tab[data-tabID="${tabNum}"]`);
  // console.log({tab});
  tab.classList.toggle('preview');
}

function handleTabClick(event) {
  // console.log(this);
  let tabNum = this.getAttribute("data-tabId");
  const tab= document.querySelector(`#tab[data-tabID="${tabNum}"]`);
  // console.log({tab});
  tab.classList.toggle('active');

}
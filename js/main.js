
const urlShortenerFn = ()=>{

//get form element
const form = document.querySelector('form');

//get navigation button
const navButton = document.querySelector('#nav--icon');

//get unordered list element
const ul = document.querySelector('.shortened--links');

//submit function from form element
const submitFn =(e)=>{

     //preventing default actions
    e.preventDefault();

    //get input 
     const urlInput = form.querySelector('[type=url]');
     //input value
     const inputValue = urlInput.value;

     //validation
     const valid = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);

     //value object
     const reqUrl ={
         destination: '',
         domain: { fullName: "rebrand.ly" },


     }
     
    
    //check wether input is empty or not 
     if (inputValue.trim() == '') {
         //if then add error function
        errorFn(urlInput, 'enter the url') 
        
        
     }else if (!valid.test(inputValue)) {
         //validating input url
         errorFn(urlInput, 'enter the valid url');

     }else{
        
        //validation success means add success function
        successFn(urlInput);

        //then adding url to the object the we created
        reqUrl.destination = inputValue;

      //loader for fetching  data
       addLoader();

       //reset after each input
       form.reset();

    //make a fetch post request
    fetch('https://api.rebrandly.com/v1/links', {
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'apiKey':'366ef75cbf80471ba0c2d783d15145b9'

            },
            body:JSON.stringify(reqUrl),

            
          
        })
        .then(blob=>blob.json())
         .then(data=>{
             //then receive the data from api and set values to the object
            reqUrl.destination = data.destination;
            reqUrl['shortUrl']= data.shortUrl;
            //create an empty array
            const arr = [];
             //check if local storage has content or not
            if (  localStorage.getItem('links')==null) {

            // local storage content is null 
               arr.push(reqUrl);
               //then set item  to the local storage
               localStorage.setItem('links', JSON.stringify(arr));
       
             
              
          }else{

            //now add another inputs to the array by getting elements from local storage and
              const linksArr = JSON.parse(localStorage.getItem('links'));

              //push that item to the array we set it to local storage 
              linksArr.push(reqUrl);

              //then save the current updated array
              localStorage.setItem('links', JSON.stringify(linksArr))
              
       
        
       
       
       
       
          }
         //fetch data after each entry
          fetchData();

        
        
          
   



         
        })

     }


   
   


  





}

//fetch data function
const fetchData = ()=>{

    //get updated array from local storage
    const arrLinks = JSON.parse(localStorage.getItem('links'));

    //check if its empty or not
    if (arrLinks === null) {
       //if empty return
        return;
        
    }else{

        //else generate html 
        const html = arrLinks.map(links=>{
            return `
             <li>
            <section class="links">
                <a href="${links.destination}" class="unshorten">${links.destination}</a>
                 <input type="text"  value="${links.shortUrl}" class = 'shortened'  readonly>
                <button id="copy" class="copy" >copy</button>
    
            </section>
        </li>
            
            
            
            
            
            `
        }).join('');
       //and sign it to ul inner html
        ul.innerHTML = html;
       
    }
    //get the copy button
    const copy = document.querySelectorAll('.copy');
   
    //copy function from copy  button click event
    const copyClipFn =(e)=>{
       //prevent default actions
        e.preventDefault();
        //get target
        const target = e.target;
        //get targets parent element
        const parent = target.parentElement;
       //get input of each targets 
       const linkInput = parent.querySelector('input');
        //this only works in input element 
        //select method for input
        linkInput.select();
        //and add command copy
       document.execCommand('copy');
        //adding class to change the state
       target.classList.add('copied');
       target.innerHTML = 'copied'






    }

//for each copy button we need to add click event
copy.forEach(button=>button.addEventListener('click', copyClipFn));


}
//error function for validation
const errorFn =(input, message)=>{
   //get small
    const small = form.querySelector('small');
    //add error class to input;
    input.classList.add('error');
   //set message to small
   small.textContent = message;



}
//success function for validation
const successFn =(input)=>{
    //get small
     const small = form.querySelector('small');
     //remove error class to input;
     input.classList.remove('error');
    //set small text content to empty
    small.textContent = '';
 
 
 
 }
//navigation function for nav button 
 const navFn = (e)=>{

    //prevent default actions  
    e.preventDefault();
    //get mobile nav 
    const mobileNav = document.querySelector('.mobile--nav');
   //remove hide class to show
    mobileNav.classList.remove('hide');
    //add nav in to add transition
    mobileNav.classList.add('nav--in');
//get close button
const close = document.querySelector('#close--button');
//close function for close event 
const closeFn = (e)=>{
    //prevent default actions  
    e.preventDefault();
     //add hide class to hide
    mobileNav.classList.add('hide');
        //remove nav in to remove transition
    mobileNav.classList.remove('nav--in');

}


//close event
close.addEventListener('click', closeFn);



}
//loader function to add loader for fetching data
 const addLoader =()=>{

//if ul inner html is empty
if (ul.innerHTML.trim() == '') {
   //add loader html  
    ul.innerHTML = loadHtml();
//loader function for animation and remove it
    loaderFn();
            
}else{
//if not get added li elements
 const li = ul.querySelectorAll('li');
//add loader function to each list of adjacent lists 
li.forEach(list=>list.insertAdjacentHTML('beforebegin', loadHtml()));
//loader function for animation and remove it
 loaderFn();



}

 }
//loader html function to generate html 
 const loadHtml = ()=>{
     return ` <li class="loader hide" tabindex="-1">
     <div class="box"></div>
     <div class="box"></div>
     <div class="box"></div>
     <div class="box"></div>
   
 </li>
     
     
     
     
     `
 }
 
//loader function for animation and remove it
 const loaderFn = ()=>{
    //get loader element    
    const loader = document.querySelector('.loader');
     //first remove hide  
    loader.classList.remove('hide');
    //calculate fetching time and as per time add hide  
        setTimeout(()=>{
              loader.classList.add('hide')
          },2000)
}

//fetching data from local storage to update on time without refresh 
fetchData();

//submit event for form
form.addEventListener('submit', submitFn); 
//click event for nav
 navButton.addEventListener('click', navFn);

}






//main event for the document
window.addEventListener('DOMContentLoaded', urlShortenerFn)
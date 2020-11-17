
const urlShortenerFn = ()=>{

const form = document.querySelector('form');

const navButton = document.querySelector('#nav--icon')


const submitFn =(e)=>{
 
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
    
     if (inputValue.trim() == '') {
        errorFn(urlInput, 'enter the url')       
     }else if (!valid.test(inputValue)) {

          errorFn(urlInput, 'enter the valid url');
     }else{
       successFn(urlInput);
        reqUrl.destination = inputValue;
        form.reset();

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
         
            reqUrl.destination = data.destination;
            reqUrl['shortUrl']= data.shortUrl;

            const arr = [];


            if (  localStorage.getItem('links')==null) {
               arr.push(reqUrl);
               localStorage.setItem('links', JSON.stringify(arr));
       
             
              
          }else{
              const linksArr = JSON.parse(localStorage.getItem('links'));
              
       
          linksArr.push(reqUrl)
       
          localStorage.setItem('links', JSON.stringify(linksArr))
       
       
       
       
          }

          fetchData();

        
        
          
   



         
        })

     }

   
   


  





}

const fetchData = ()=>{
    const ul = document.querySelector('.shortened--links');

    const arrLinks = JSON.parse(localStorage.getItem('links'));

    if (arrLinks === null) {
        return;
        
    }else{
        ul.innerHTML = arrLinks.map(links=>{
            return `
             <li>
            <section class="links">
                <a href="${links.destination}" class="unshorten">${links.destination}</a>
                 <input type="text"  value="${links.shortUrl}" class = 'shortened'>
                <button id="copy" class="copy" >copy</button>
    
            </section>
        </li>
            
            
            
            
            
            `
        }).join('');


    }
    const copy = document.querySelectorAll('.copy');

    const copyClipFn =(e)=>{

        e.preventDefault();
        const target = e.target;
        const parent = target.parentElement;

        const linkInput = parent.querySelector('input');
         
        linkInput.select();
       document.execCommand('copy');

       target.classList.add('copied')
       target.innerHTML = 'copied'






    }






 
   
   






copy.forEach(button=>button.addEventListener('click', copyClipFn));


}

const errorFn =(input, message)=>{
   //get small
    const small = form.querySelector('small');
    //add error class to input;
    input.classList.add('error');
   //set message to small
   small.textContent = message;



}

const successFn =(input)=>{
    //get small
     const small = form.querySelector('small');
     //add error class to input;
     input.classList.remove('error');
    //set message to small
    small.textContent = '';
 
 
 
 }
 


fetchData();

const navFn = (e)=>{
    e.preventDefault();

    const mobileNav = document.querySelector('.mobile--nav');


    mobileNav.classList.remove('hide');
    mobileNav.classList.add('nav--in');


const close = document.querySelector('#close--button');


const closeFn = (e)=>{
    e.preventDefault();
    mobileNav.classList.add('hide');
    mobileNav.classList.remove('nav--in');

}



close.addEventListener('click', closeFn);



}

   form.addEventListener('submit', submitFn); 
   navButton.addEventListener('click', navFn);

}







window.addEventListener('DOMContentLoaded', urlShortenerFn)
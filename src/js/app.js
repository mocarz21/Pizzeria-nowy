import { settings, select, classNames, templates } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
const app = {
  initPages: function(){

    const thisApp = this;
    const idFromHash = window.location.hash.replace('#/','');
    thisApp.pages =document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks =document.querySelectorAll(select.nav.links);
    
    console.log('idFromHash',idFromHash);
    
    let pageMatchingHash = thisApp.pages[0].id;
    
    for(let page of thisApp.pages){
      
      if(page.id == idFromHash){
        
        pageMatchingHash = page.id;
        break;
      }
      thisApp.activatePages(pageMatchingHash);
    }

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /*get page id from href atribute */
        const id = clickedElement.getAttribute('href').replace('#',''); //zrobiłem wczesniej link zamiast clcickedElemet i działało identycznie Czy to robi jakąś różnice ?
        console.log('id',id);
        /* run thisApp.activatePage  with that id*/
        thisApp.activatePages(id);
        /* chnge url hash*/
        window.location.hash = '#/' + id;
      });
    }
  },
  activatePages: function(pageId){
    const thisApp = this;
    /*add class 'active' to matching pages remove from non-matchng*/
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active,page.id == pageId);  //spowoduje wykonanie tego samego co jest zakomentowane poniżej
    }
    //  if(page.id == pageId){
    //    page.classList.add(classNames.pages.active);
    //  }else{
    //    page.classList.remove(classNames.pages.active);
    //  }
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }

    /*add class 'active' to matching LINK remove from non-matchng*/
  },
  initMenu: function(){
    const thisApp = this;
    
    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id , thisApp.data.products[productData]);
    }

  },   
  initCart: function(){
    const thisApp = this;
    
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);   

    thisApp.productList=document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },
  initData: function(){
    const thisApp = this;

    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.products;
    
    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);

        
        thisApp.data.products = parsedResponse;

        thisApp.initMenu(); 
      });
    console.log('thisapp.data', JSON.stringify(thisApp.data));
  },
  init: function(){
    const thisApp = this;
    console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    console.log('templates:', templates);
    thisApp.initPages();
    thisApp.initData();                            
    
    thisApp.initCart();
  }, 
};


app.init();


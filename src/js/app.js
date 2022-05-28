import { settings, select, classNames, templates } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import Home from './components/Home.js';
const app = {
  initPages: function(){

    const thisApp = this;
    const idFromHash = window.location.hash.replace('#/','');
    thisApp.pages =document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks =document.querySelectorAll(select.nav.links);
    thisApp.order = document.querySelector('.left h1');
    thisApp.bookTable = document.querySelector('.right h1');

    console.log('thisApp.bookTable',thisApp.bookTable);
    
    let pageMatchingHash = thisApp.pages[0].id;
    
    
    for(let page of thisApp.pages){
      console.log('page',page);
      if(page.id == idFromHash){
        
        pageMatchingHash = page.id;
        break;
      }
      
    }
    thisApp.activatePages(pageMatchingHash);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /*get page id from href atribute */
        const id = clickedElement.getAttribute('href').replace('#',''); 
        
        /* run thisApp.activatePage  with that id*/
        thisApp.activatePages(id);
        /* chnge url hash*/
        window.location.hash = '#/' + id;
      });
    }
    
    thisApp.order.addEventListener('click', function(){
      thisApp.activatePages(thisApp.pages[1].id);
      window.location.hash = '#/' + thisApp.pages[1].id;
    });

    thisApp.bookTable.addEventListener('click', function(){
      thisApp.activatePages(thisApp.pages[2].id);
      window.location.hash = '#/' + thisApp.pages[2].id;

    });
  
    
  },
  activatePages: function(pageId){
    const thisApp = this;
    /*add class 'active' to matching pages remove from non-matchng*/
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active , page.id == pageId);  
    }

    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }

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
        

        
        thisApp.data.products = parsedResponse;

        thisApp.initMenu(); 
      });
    
  },
  initBooking: function(){
    const bookingContainer = document.querySelector(select.containerOf.booking);
    new Booking(bookingContainer);
  },
  initHome: function(){
    new Home();
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
    thisApp.initHome();
    thisApp.initBooking();
  },
  
};



app.init();


import { settings, select, classNames, templates } from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';


class Cart{
  constructor(element){
    const thisCart = this;
    thisCart.products = [];  

    thisCart.getElements(element);
    thisCart.initActions();
    thisCart.update();

    

    
  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {};     

    thisCart.dom.wrapper = element;   
    thisCart.dom.toggleTrigger =thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger); 
    thisCart.dom.productList =thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    thisCart.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
    thisCart.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
    console.log('asdasd',thisCart.dom.form)
  }

  initActions(){
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);

    });
    thisCart.dom.productList.addEventListener('update', function(){ //wiem ze dzieki bubbles mozemy uzyc ale nie zabardzo wiem co sie dzieje czemu to działa wszedzie itd
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function(event){
      event.preventDefault();
      
      thisCart.remove(event.detail.cartProduct);
    
    });
    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  sendOrder(){
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.orders;
    let payLoad = {};
    
    payLoad.products = [];
    payLoad.address = thisCart.dom.form.address.value;
    payLoad.phone = thisCart.dom.form.phone.value;
    payLoad.totalPrice = thisCart.totalPrice.innerHTML;
    payLoad.subtotalPrice = thisCart.subtotalPrice.innerHTML;
    payLoad.totalNumber = thisCart.totalNumber.innerHTML;
    payLoad.deliveryFee = thisCart.deliveryFee.innerHTML;
    for(let prod of thisCart.products){  
      payLoad.products.push(prod.getData());             // po co jest getData?
     

    }
    
    
    const options ={
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payLoad)
    };
    fetch(url, options);

    

  }

  add(menuProduct){
    const thisCart = this;

    

    const generatedHTML = templates.cartProduct(menuProduct);   
    

    const generatedDOM = utils.createDOMFromHTML(generatedHTML);   
    


    const cartContainer = thisCart.dom.productList;
    

    cartContainer.appendChild(generatedDOM);
    
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));

    thisCart.update();
  }
  update(){
    const thisCart = this;
    const deliveryFee =settings.cart.defaultDeliveryFee;
    thisCart.deliveryFee.innerHTML = deliveryFee;
    let totalNumber = 0;
    let subtotalPrice = 0;
    for(let product of  thisCart.products){
    
      totalNumber += product.amount;
      subtotalPrice += product.price;
    }  
    if(subtotalPrice ==0){
    //empty

    }else{
      thisCart.subtotalPrice.innerHTML = subtotalPrice;
      
      for (let totalPriceSum of thisCart.totalPrice) {
        totalPriceSum.innerHTML = subtotalPrice + deliveryFee;
      }
    }

    thisCart.totalNumber.innerHTML = totalNumber;
    
  }
  remove(cartProduct){                                                        
    const thisCart = this;
    //1
    cartProduct.dom.wrapper.remove();

    //2

    const indexOfRemoveProduct = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(indexOfRemoveProduct,1);
    
    //3
    thisCart.update();
  }
}
export default Cart;
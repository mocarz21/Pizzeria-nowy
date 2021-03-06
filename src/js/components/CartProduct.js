import {select } from '../settings.js';
import AmountWidget from './AmountWidget.js';

class CartProduct{
  constructor(menuProduct, element){                           
    const thisCartProduct = this;
    thisCartProduct.id = menuProduct.id;
    thisCartProduct.name = menuProduct.name;
    thisCartProduct.price = menuProduct.price;
    thisCartProduct.priceSingle = menuProduct.priceSingle;
    thisCartProduct.amount = menuProduct.amount;
    thisCartProduct.params = menuProduct.params;
    thisCartProduct.getElements(element);
    thisCartProduct.initAmountWidget();
    thisCartProduct.initActions();
    thisCartProduct.getData();

  }
  getElements(element){
    const thisCartProduct = this;
    thisCartProduct.dom = {};
    thisCartProduct.dom.wrapper = element;
    thisCartProduct.dom.amountWidget =thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget); 
    thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
    thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
    thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);

  }
  initAmountWidget(){
    const thisCartProduct = this;

    thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);    
    thisCartProduct.dom.amountWidget.addEventListener('update', function(){

    
      //czemu tutaj musiałem wstawić  thisCartProduct.amountWidget.value a nie działało  thisCartProduct.dom.amountWidget.value
      thisCartProduct.amount = thisCartProduct.amountWidget.value;
      thisCartProduct.price = thisCartProduct.amountWidget.value * thisCartProduct.priceSingle;

      thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
    
    
    });
  }

  remove(){
    const thisCartProduct = this;
    const event = new CustomEvent ('remove', {
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct

      },
    });
    thisCartProduct.dom.wrapper.dispatchEvent(event);
  }

  initActions(event){
    const thisCartProduct = this;

    thisCartProduct.dom.edit.addEventListener('click', function(){
      event.preventDefault();

    });

    thisCartProduct.dom.remove.addEventListener('click', function(){
    //  event.preventDefault();
      thisCartProduct.remove();
      

    });

    

  }
  getData(){
    const thisCartProduct = this;
    let orderObject = {};
    orderObject.id = thisCartProduct.id;
    orderObject.amount = thisCartProduct.amount;
    orderObject.price = thisCartProduct.price;
    orderObject.priceSingle = thisCartProduct.priceSingle;
    orderObject.name = thisCartProduct.name;
    orderObject.params = thisCartProduct.params;

    
    return orderObject;
  }
}
export default CartProduct;
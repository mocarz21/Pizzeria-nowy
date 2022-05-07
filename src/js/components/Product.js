import{select, templates, classNames} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product{
  constructor(id , data){
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();                     
    thisProduct.processOrder();
    thisProduct.prepareCartProductParams();
    
  }
  renderInMenu(){
    const thisProduct = this;

    const generatedHTML = templates.menuProduct(thisProduct.data);   

    thisProduct.element = utils.createDOMFromHTML(generatedHTML);       

    const menuContainer = document.querySelector(select.containerOf.menu);

    menuContainer.appendChild(thisProduct.element);
  }
  getElements(){
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);         // Spróbuj wprowadzić ten sam pomysł w klasie Product. Tak, żeby wszystkie referencje do elementów DOM były "schowane" w obiekcie dodatkowym obiekcie thisProduct.dom.
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }
  initAccordion(){
    const thisProduct = this;
    
    /* find the clickable trigger (the element that should react to clicking) */
    //const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);   
    
    /* START: add event listener to clickable trigger on event click */
    thisProduct.accordionTrigger.addEventListener('click', function(event) {            

      /* prevent default action for event */
      event.preventDefault();
      /* find active product (product that has active class) */
        
    
      let activeProducts = document.querySelectorAll(select.all.menuProductsActive);   
      for(let activProduct of activeProducts){
        
        
    
        /* if there is active product and it's not thisProduct.element, remove class active from it */     
        if( activProduct && (activProduct != thisProduct.element) ){                             
          activProduct.classList.remove('active');
        }        
      }
      /* toggle active class on thisProduct.element */
      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
    
    });
  }
  initOrderForm(){
    const thisProduct = this;
    

    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.prepareCartProductParams();
    });
    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
        thisProduct.prepareCartProductParams();
      });
    }
    
    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
    
  }
  processOrder(){
    const thisProduct = this;

    // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
    const formData = utils.serializeFormToObject(thisProduct.form);

    // set price to default price
    let price = thisProduct.data.price;

    // for every category (param)...
    for( let paramId in thisProduct.data.params){
    

      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];                          
    
      // for every option in this category
      for(const optionId in param.options){       
        
        // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        const option = param.options[optionId];                            
        
        
        let image = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        

        if (optionSelected){                 
            
          if(option.default == true){
            price += option.price;   
          }
            
        }else if (option.default != true ){
                
          price -= option.price;
            
        }
        if(optionSelected && image){
          image.classList.add('active');
        
        }else if(image){
          image.classList.remove('active');
        }

      }

    }
    // update calculated price in the HTML
    
    price *= thisProduct.amountWidget.value; 
    thisProduct.priceSingle = price / thisProduct.amountWidget.value;
    thisProduct.priceElem.innerHTML = price;  
    

    thisProduct.priceElem.innerHTML = price;     
    
  }
  initAmountWidget(){
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);    //skad się bierze amountWidget ? 
    thisProduct.amountWidgetElem.addEventListener('update', function(){
      thisProduct.processOrder();
    
    });

  }
  addToCart(){
    
    const thisProduct = this;
    thisProduct.name = thisProduct.data.name;   //dodałem
    thisProduct.amount =thisProduct.amountWidget.value; //dodałem
    
    //app.cart.add(thisProduct.prepareCartProduct()); 
    
    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct.prepareCartProduct()
      }
    });
    thisProduct.element.dispatchEvent(event);                    //dispatchEvent przecwiczyc dispachowanie co to popatrzec
    

  }

  prepareCartProduct(){
    const thisProduct = this;

    const productSummary = {id: thisProduct.id , name: thisProduct.data.name , amount: thisProduct.amountWidget.value, 
      priceSingle: thisProduct.priceSingle, price: thisProduct.priceSingle * thisProduct.amountWidget.value, params: thisProduct.prepareCartProductParams() };
    

    return productSummary;
    
  }


  prepareCartProductParams(){


    const params = {};
    
    const thisProduct = this;

    // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
    const formData = utils.serializeFormToObject(thisProduct.form);

    

    // for every category (param)...
    for( let paramId in thisProduct.data.params){
    
    

      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];      

      params[paramId] = {
        label: param.label,
        options: {}
      };

      // for every option in this category
      for(const optionId in param.options){       
        
        

        // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
                                
        
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        
        

        if (optionSelected){    

          params[paramId].options[optionId] = optionId;
        }                    

      }
    }
    return params;  
  }
}
export default Product;
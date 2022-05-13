class BaseWidget{
  constructor(wrapperElement,initialValue){
    const thisWidget = this;

    thisWidget.dom={};
    thisWidget.dom.wrapper = wrapperElement;

    thisWidget.corectValue = initialValue;

  }
  get value(){
    const thisWidget = this;
    return thisWidget.corectValue;
  }
  set value(value){   
    const thisWidget = this;               
    
    const newValue = thisWidget.parseValue(value);
    
    if(thisWidget.corectValue != newValue && thisWidget.isValid(newValue)) {    
      thisWidget.corectValue = newValue;
      thisWidget.announce(); 
    }
    
    thisWidget.renderValue();
  }
  setValue(value){
    const thisWidget = this;
    
    thisWidget.value = value;
  }
  parseValue(value){
    return parseInt(value);
  }
  isValid(value){
    return !isNaN(value);
    
  }
  renderValue(){
    const thisWidget = this;
    thisWidget.dom.wrapper= thisWidget.value;            //domyslnie .wrapper
  }
  announce(){
    const thisWidget = this;
    
    const event = new CustomEvent('update',{bubbles: true});
    thisWidget.dom.wrapper.dispatchEvent(event);    //?????? niewiem co tu sie dzieje
  }
}
export default BaseWidget;
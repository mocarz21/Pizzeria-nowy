/* eslint-disable */


class Home{
  constructor(){
    const thisHome = this;
    thisHome.Slider();

  }
  Slider(){
    var elem = document.querySelector('.gride-slider-wrap');
    
    var flkty = new Flickity( elem, {
      // options
      cellAlign: 'left',
      contain: true,
      autoPlay: 6500,
      wrapAround: true,
      fullscreen: true,
      lazyLoad: 1
    });
  }

}
export default Home;
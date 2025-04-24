function checkVisibility() {
    const hiddenElements = document.querySelectorAll('.hidden');
  
    hiddenElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const offset = window.innerHeight * 0.2; 
  
      const isVisible = rect.top < window.innerHeight - offset && rect.bottom > 0;
  
      if (isVisible) {
        el.classList.add('show1');
      } else {
        el.classList.remove('show1'); 
      }
    });
  }
  
  window.addEventListener('scroll', checkVisibility);
  window.addEventListener('load', checkVisibility);
  
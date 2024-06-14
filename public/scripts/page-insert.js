document.addEventListener("DOMContentLoaded", function(event) { 
  // take params from url (including utm-marks and so on)
  const urlParams = document.location.search;
  const pageAttr = 'data-deva-page';
  // get all elements to insert pages
  const elementsToRender = document.querySelectorAll('[' + pageAttr + ']');
  elementsToRender.forEach(element => {
    const devaPageName = element.getAttribute(pageAttr);
    // insert iframe inside target element
    element.innerHTML = `<iframe src="https://deva-crm.dreamcatchme.ru/${devaPageName}${urlParams}" frameBorder="0"></iframe>`;
  });
});
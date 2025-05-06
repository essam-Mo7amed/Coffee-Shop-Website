let navbar =document.querySelector('.navbar')

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
};

let searchForm =document.querySelector('.search-form')

document.querySelector('#search-btn').onclick = () =>{
    searchForm.classList.toggle('active');
    navbar.classList.remove('active');
    cartItem.classList.remove('active');
}
 

let cartItem =document.querySelector('.cart-items-container')

document.querySelector('#cart-btn').onclick = () =>{
    cartItem.classList.toggle('active');
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
}
window.onscroll = () =>{
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');





}
document.addEventListener('click', function(event) {
    let isClickInsideNavbar = navbar.contains(event.target) || event.target.id === 'menu-btn';
    let isClickInsideSearch = searchForm.contains(event.target) || event.target.id === 'search-btn';
    let isClickInsideCart = cartItem.contains(event.target) || event.target.id === 'cart-btn';

    if (!isClickInsideNavbar && !isClickInsideSearch && !isClickInsideCart) {
        navbar.classList.remove('active');
        searchForm.classList.remove('active');
        cartItem.classList.remove('active');
    }
});

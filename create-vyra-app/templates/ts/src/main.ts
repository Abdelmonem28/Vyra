import Home from './component/home.ts';

const navLink = document.querySelector('#home-link');
Home.setTrigger(navLink, 'click', '/');
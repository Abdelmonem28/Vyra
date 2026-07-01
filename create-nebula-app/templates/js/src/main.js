import { Router } from 'nebula';
import Home from './components/Home.js';

const navLink = document.querySelector('#home-link');
Home.setTrigger(navLink, 'click', '/');
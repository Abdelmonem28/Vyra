import { Component, createState } from 'nebula';

const [count, setCount] = createState(0);

const Home = new Component(
    `<div>
        <h1>Welcome to {{name}}!</h1>
        <p>Count: {{count}}</p>
        <button id="inc">Click me</button>
    </div>`,
    'Home'
);

Home.bindState('count', count);
Home.data = { name: 'Nebula' };
Home.setInteraction('inc', 'click', () => setCount(prev => prev + 1));

export default Home;
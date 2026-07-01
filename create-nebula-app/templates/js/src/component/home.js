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

Home.data = { name: 'Nebula', count: count() };
Home.setInteraction('inc', 'click', () => {
    setCount(count() + 1);
    Home.data = { ...Home.data, count: count() };
});

export default Home;
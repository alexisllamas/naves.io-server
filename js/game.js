import SpaceShip from './spaceship';
import BulletManager from './bulletmanager';
const PIXI = require( 'pixi.js' );
const EventEmitter = require( 'events' ).EventEmitter;

class Game extends EventEmitter {
  constructor(element, sc) {
    super();
    this.stage = new PIXI.Container();
    this.sc = sc;
    this.renderer = PIXI.autoDetectRenderer(
      window.innerWidth,
      window.innerHeight,
      { transparent: true },
      false
    );
    this.spaceShips = [];
    this.scores = [];
    this.lastFrameTime = 0;

    this.bulletManager = new BulletManager(this);

    element.appendChild(this.renderer.view);
    requestAnimationFrame(this.tick.bind(this));

    this.sc.onNewPlayer(this.addPlayer.bind(this));
  }

  tick(currentTime) {
    this.emit('update', currentTime - this.lastFrameTime, currentTime);
    this.lastFrameTime = currentTime;
    this.renderer.render(this.stage);
    this.scores.forEach(score => {
      score.text = `${score.spaceship.name} - ${score.spaceship.kills}`;
    })
    requestAnimationFrame(this.tick.bind(this));
	}

  addPlayer(name) {
    if (!this.spaceShips.some((space) => space.name === name)) {
		  const x = this.renderer.width * (0.1 + Math.random() * 0.8);
		  const y = this.renderer.height * (0.1 + Math.random() * 0.8);
      const spaceship = new SpaceShip(this, x, y, name, this.sc);
		  this.spaceShips = [...this.spaceShips, spaceship];
      const textStyle = { fontFamily : 'Arial', fontSize: '14px', fill: 'rgb(0,255,0)', align : 'center' };
      const score = new PIXI.Text(`${name} - ${spaceship.kills}`, textStyle);
      score.anchor.x = 0.5;
      score.anchor.y = 0.5;
      score.position = { x: this.renderer.width - 100, y: this.scores.length * 20 + 50};
      score.spaceship = spaceship;
      this.scores = [...this.scores, score];
      this.stage.addChild(score)
    }
	}

  removePlayer(name) {
    const speceshipToRemove = this.spaceShips.find(spaceship => spaceship.name === name);
    if(speceshipToRemove) {
      speceshipToRemove.remove();
      this.spaceShips = this.spaceShips.filter(spaceship => spaceship.name !== name);
    }
	}

}

export default Game;

import Phaser from 'phaser';

const CANNONBALL_SPEED = 500;
const FIRE_DIR_OFFSET = 30;
const MAX_FIRE_DISTANCE = 400;

export default class Cannonball extends Phaser.Physics.Arcade.Sprite {
	firedAt = null;

	constructor(scene, x, y, key, frame) {
		super(scene, x, y, key, frame);
	}

	create() {
		this.body.onCollide = true;
		this.body.onWorldBounds = true;
	}

	fire(rotation) {
		this.firedAt = this.getCenter();

		this.play('ball');

		const offset = new Phaser.Math.Vector2();
		offset.setToPolar(rotation + Math.PI / 2, FIRE_DIR_OFFSET);
		this.enableBody(true, this.x + offset.x, this.y + offset.y, true, true);

		const velocity = new Phaser.Math.Vector2();
		velocity.setToPolar(rotation + Math.PI / 2, CANNONBALL_SPEED);
		this.setVelocity(velocity.x, velocity.y);
	}

	stop() {
		this.setVelocity(0, 0);
		this.disableBody(true, true);

		this.firedAt = null;
	}

	shipHit(ship) {
		this.setVelocity(0, 0);
		this.play('ship-hit');
		this.scene.time.delayedCall(100, () => {
			this.stop();
		});
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);

		const distance = this.firedAt?.distance(this.getCenter());
		if (distance > MAX_FIRE_DISTANCE) {
			this.stop();
		}
	}

	static createAnimations(anims) {
		anims.create({
			key: 'ball',
			frames: [{ key: 'ship', frame: 'cannonBall' }],
		});

		anims.create({
			key: 'ship-hit',
			frames: [{ key: 'ship', frame: 'explosion_3' }],
		});
	}
}
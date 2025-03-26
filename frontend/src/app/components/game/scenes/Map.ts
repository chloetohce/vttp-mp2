import { GameObjects, Geom } from 'phaser';
import { SCENES } from '../../../constants/scenes.const';
import { generate } from 'rxjs';
import { MAP_LOCATIONS } from '../../../constants/map.const';
import { MapLocation } from '../../../model/player-data.model';
import { EventBus } from '../bootstrap/eventbus';

export class Map extends Phaser.Scene {
  private width!: number;
  private height!: number;
  private isMapDragged = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private containerStartX: number = 0;
  private containerStartY: number = 0;

  private map!: GameObjects.Image;
  private savedPosition!: Geom.Point;
  private points!: GameObjects.Container[];
  private container!: GameObjects.Container;
  private btnBackIcon!: Phaser.GameObjects.Image;
  private btnBack!: Phaser.GameObjects.Image;

  constructor() {
    super(SCENES.MAP);
  }

  init() {
    this.width = this.game.renderer.width;
    this.height = this.game.renderer.height;
  }

  preload() {
    this.load.image('map', '/phaser/bg/map.png');
    this.load.image('pin', '/phaser/misc/pin.png')
    this.load.image('btn-sq', '/phaser/misc/btn-square.png')
    this.load.image('btn-back', '/phaser/icons/back.png')
  }

  create() {

    
    this.points = [];
    this.container = this.add.container(0, 0);

    this.map = this.add.image(this.width / 2, this.height / 2, 'map');
    this.map.setInteractive().setScale(0.8).setAlpha(0.8);
    this.container.add(this.map);

    for (var location of MAP_LOCATIONS) {
      const circle = this.generateMapPin(location)
      this.points.push(circle);
      this.container.add(circle);
    }

    this.input.setDraggable(this.map);

    this.savedPosition = new Phaser.Geom.Point(this.map.x, this.map.y);

    this.map
      .on('dragstart', (pointer: Phaser.Input.Pointer) => {
        // this.isMapDragged = true;
        // Store initial positions
        this.dragStartX = pointer.x;
        this.dragStartY = pointer.y;
        this.containerStartX = this.container.x;
        this.containerStartY = this.container.y;
      })
      .on('drag', (pointer: Phaser.Input.Pointer) => {
        // Calculate movement based on initial offset
        const moveX = pointer.x - this.dragStartX;
        const moveY = pointer.y - this.dragStartY;

        // Apply movement to the container (with bounds)
        this.container.x = this.boundX(this.containerStartX + moveX);
        this.container.y = this.boundY(this.containerStartY + moveY);
      });

      this.btnBack = this.add.image(55, 10, 'btn-sq')
      .setOrigin(0)
      .setInteractive({useHandCursor: true})
      .on('pointerup', () => {
        this.scene.start(SCENES.MENU)
        this.scene.stop(SCENES.DIALOGUE)
        this.scene.stop(SCENES.MAP)
      })
      .on('pointerover', () => {
        this.btnBack.setTint(0xaaaaaa)
        this.btnBackIcon.setTint(0xaaaaaa)
      })
      .on('pointerout', () => {
        this.btnBack.clearTint()
        this.btnBackIcon.clearTint()
      })
      this.btnBackIcon = this.add.image(this.btnBack.getCenter().x, this.btnBack.getCenter().y, 'btn-back')
  
  }

  override update(time: number, delta: number): void {
    EventBus.on('dialogue-end', () => {
        this.scene.stop(SCENES.DIALOGUE)
        this.scene.resume(SCENES.MAP)
        EventBus.emit('dialogue-end-close')
    })
  }

  boundX(x: number): number {
    const scaledWidth = this.map.displayWidth / 2;
    const minX = this.width / 2 - scaledWidth;
    const maxX = scaledWidth - this.width / 2;
    return Phaser.Math.Clamp(x, minX, maxX);
  }

  boundY(y: number): number {
    const scaledHeight = this.map.displayHeight / 2;
    const minY = this.height / 2 - scaledHeight;
    const maxY = scaledHeight - this.height / 2;
    return Phaser.Math.Clamp(y, minY, maxY);
  }

  generateMapPin(location: MapLocation) {
    const container = this.add.container(this.normaliseX(location.x), this.normaliseY(location.y))
    const pin = this.add.image(0, 0, 'pin')

    const text = this.add.text(
        pin.getTopCenter().x, pin.getTopCenter().y + 10,
        `${location.name}: ${location.desc}`,
        {
            wordWrap: {width: 300},
            backgroundColor: '#121212',
            padding: {x: 10, y: 10}
        }
    )
    .setAlpha(0.8)
    container.add([pin, text])
    text.setVisible(false)

    pin.setInteractive({useHandCursor: true})
        .on('pointerover', () => {
            pin.setTint(0xaaaaaa)
            text.setPosition(pin.x, pin.y)
            text.setVisible(true)

        })
        .on('pointerout', () => {
            pin.clearTint()
            text.setVisible(false)
        })
        .on('pointerup', () => {
            text.setVisible(false)
            this.scene.launch(SCENES.DIALOGUE, {key: location.key, speaker: location.npc})
            .bringToTop(SCENES.DIALOGUE)
            this.scene.pause(SCENES.MAP)
        })

    return container
  }

  private normaliseX(x: number) {
    return (x *this.map.displayWidth * 0.8)
  }

  private normaliseY(x: number) {
    return (x* this.map.displayHeight * 0.8)
  }

  // For generating postions within map
  generateValidSpritePosition(): { x: number; y: number } {
    const mapWidth = this.map.displayWidth;
    const mapHeight = this.map.displayHeight;

    // Calculate the map's boundaries in world coordinates
    const mapLeft = this.width / 2 - mapWidth / 2;
    const mapRight = this.width / 2 + mapWidth / 2;
    const mapTop = this.height / 2 - mapHeight / 2;
    const mapBottom = this.height / 2 + mapHeight / 2;

    const randomX = Phaser.Math.Between(mapLeft, mapRight);
    const randomY = Phaser.Math.Between(mapTop, mapBottom);

    const relativeX = randomX - this.container.x;
    const relativeY = randomY - this.container.y;

    return { x: relativeX, y: relativeY };
  }
}

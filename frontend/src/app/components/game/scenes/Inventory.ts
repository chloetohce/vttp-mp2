import { Store } from "@ngrx/store";
import { Item, PlayerData } from "../../../model/player-data.model";
import { selectPlayerData, selectPlayerState } from "../../../store/player/player.store";
import { AppState } from "../../../store/app.store";
import { SCENES } from "../../../constants/scenes.const";

export class Inventory extends Phaser.Scene {
    private width!: number;
    private height!: number
    
    private playerData!: PlayerData
    private store!: Store<AppState>
    private invt!: Item[];

    private slots: Phaser.GameObjects.Rectangle[] = [];
    private itemSprites: Phaser.GameObjects.Sprite[] = [];
    private itemTexts: Phaser.GameObjects.Text[] = [];
    private itemNameText!: Phaser.GameObjects.Text;
    private itemDescText!: Phaser.GameObjects.Text;
    private selectedIndex: number = -1;

    constructor() {
        super(SCENES.INVENTORY)
    }

    init() {
        this.store = this.game.registry.get('store')
        this.store.select(selectPlayerData)
            .subscribe((v: PlayerData) => this.playerData = v)
            .unsubscribe()
        this.width = this.game.renderer.width;
        this.height = this.game.renderer.height;
    }

    preload() {
        this.invt = this.playerData.items;
        this.invt.forEach(i => {
            this.load.image(`icon-${i.name}`, `/phaser/icons/${i.name}.png`)
        })
    }

    create() {
            
        // Title
        this.add.text(this.width/2, this.height * 0.05, 'INVENTORY', { 
            font: '24px', color: '#ffffff' 
        }).setOrigin(0.5);
        
        // Create inventory slots grid (5x4)
        this.createGrid();
        
        // Create item details panel
        this.createDetailsPanel();
        
        // Add close button
        this.add.text(this.width * 0.05, this.height * 0.05, 'Back', { font: '18px', color: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.stop();
                // this.scene.resume(SCENES.GAME);
            });
        
        // 6. Fill inventory with player items
        this.populateInventory();
    }

    private createGrid() {
        const rows = 4, cols = 5;
        const size = 64, spacing = 10;
        const startX = 50, startY = 100;
        
        for (let i = 0; i < rows * cols; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            
            // Position for this slot
            const x = startX + col * (size + spacing);
            const y = startY + row * (size + spacing);
            
            // Create slot background
            const slot = this.add.rectangle(
                x + size/2, y + size/2, size, size, 0x454545
            ).setStrokeStyle(2, 0x666666);
            
            // Make interactive
            slot.setInteractive()
                .on('pointerdown', () => this.selectSlot(i));
            
            this.slots.push(slot);
            
            // Add empty sprite and text placeholders
            this.itemSprites.push(
                this.add.sprite(x + size/2, y + size/2, '')
                    .setVisible(false)
            );
            
            this.itemTexts.push(
                this.add.text(x + size - 10, y + size - 10, '', 
                    { font: '14px Arial', color: '#ffffff' }
                ).setOrigin(1, 1)
            );
        }
    }

    private createDetailsPanel() {
        // Panel background
        this.add.rectangle(500, 150, 250, 200, 0x333333)
            .setStrokeStyle(2, 0x666666);
        
        // Item name and description
        this.itemNameText = this.add.text(
            400, 100, 'Select an item',
            { font: '18px Arial', color: '#ffffff' }
        );
        
        this.itemDescText = this.add.text(
            400, 130, 'Item details will appear here',
            { font: '14px Arial', color: '#cccccc', wordWrap: { width: 230 } }
        );
        
        // Action buttons
        this.add.text(400, 230, 'USE', 
            { font: '16px Arial', color: '#ffffff', backgroundColor: '#446644' }
        )
        .setPadding(10, 5)
        .setInteractive()
        .on('pointerdown', () => this.useItem());
        
        this.add.text(470, 230, 'DROP', 
            { font: '16px Arial', color: '#ffffff', backgroundColor: '#664444' }
        )
        .setPadding(10, 5)
        .setInteractive()
        .on('pointerdown', () => this.dropItem());
    }

    private populateInventory() {
        // Clear existing items
        this.itemSprites.forEach(sprite => sprite.setVisible(false));
        this.itemTexts.forEach(text => text.setText(''));
        
        // Add each inventory item
        if (this.invt) {
            this.invt.forEach((item, index) => {
                if (index < this.itemSprites.length) {
                    // Set sprite
                    this.itemSprites[index]
                        .setTexture(`icon-${item.name}`)
                        .setVisible(true);
                }
            });
        }
    }

    private selectSlot(index: number) {
        // Deselect previous slot
        if (this.selectedIndex >= 0) {
            this.slots[this.selectedIndex].setStrokeStyle(2, 0x666666);
        }
        
        // Select new slot
        this.selectedIndex = index;
        this.slots[index].setStrokeStyle(2, 0xffff00);
        
        // Update item details
        if (!this.invt || index >= this.invt.length) {
            this.itemNameText.setText('Empty slot');
            this.itemDescText.setText('');
            return;
        }
        
        const item = this.invt[index];
        this.itemNameText.setText(item.name);
        this.itemDescText.setText(item.desc || 'No description');
    }

    private useItem() {
        if (this.selectedIndex < 0 || 
            !this.invt || 
            this.selectedIndex >= this.invt.length) {
            return;
        }
        
        const item = this.invt[this.selectedIndex];
        console.log(`Using: ${item.name}`);
        
        // // Handle item usage (dispatch store action in real implementation)
        // if (item.quantity > 1) {
        //     item.quantity--;
        //     this.itemTexts[this.selectedIndex].setText(String(item.quantity));
        // } else {
        //     this.playerData.inventory.splice(this.selectedIndex, 1);
        //     this.populateInventory();
        //     this.slots[this.selectedIndex].setStrokeStyle(2, 0x666666);
        //     this.selectedIndex = -1;
        //     this.itemNameText.setText('Select an item');
        //     this.itemDescText.setText('Item details will appear here');
        // }
    }

    private dropItem() {
        if (this.selectedIndex < 0 || 
            !this.invt || 
            this.selectedIndex >= this.invt.length) {
            return;
        }
        
        // Remove item (dispatch store action in real implementation)
        this.invt.splice(this.selectedIndex, 1);
        this.populateInventory();
        this.slots[this.selectedIndex].setStrokeStyle(2, 0x666666);
        this.selectedIndex = -1;
        this.itemNameText.setText('Select an item');
        this.itemDescText.setText('Item details will appear here');
    }
}
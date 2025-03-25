import { filter, firstValueFrom, take, tap } from "rxjs";
import { SCENES } from "../../../constants/scenes.const";
import { GameStateService } from "../../../services/game/game-state.service";
import { AppState } from "../../../store/app.store";
import { endDay } from "../../../store/player/player.action";
import { Store } from "@ngrx/store";

export class EndDay extends Phaser.Scene {
    private width!: number;
    private height!: number;
    private username!: string;
    private results!: {name: string, output: number}[]

    private svc!: GameStateService;
    private store!: Store<AppState>

    // Scene Objects
    private loadingText!: Phaser.GameObjects.Text;
    private loadingGraphics!: Phaser.GameObjects.Graphics;
    private isLoading: boolean = false;

    constructor() {
        super(SCENES.ENDDAY)
    }

    init() {
        this.width = this.game.renderer.width
        this.height = this.game.renderer.height

        this.username = this.game.registry.get("username")
        this.svc = this.game.registry.get('svc')
        this.store = this.game.registry.get('store')
    }

    preload() {
        // this.store.dispatch(endDay())
        
        
    }

    create() {
        // Create loading text
        this.loadingText = this.add.text(
            this.width / 2, 
            this.height / 2, 
            'Loading...', 
            { 
                font: '24px Arial',
                color: '#ffffff'
            }
        ).setOrigin(0.5);
        
        // Create loading spinner/progress bar
        this.loadingGraphics = this.add.graphics();
        this.loadingGraphics.fillStyle(0xffffff, 1);
        
        // Initially hide loading elements
        this.loadingText.setVisible(false);
        this.loadingGraphics.setVisible(false);
        
        // Start the data fetching process
        this.fetchNextDayData();
    }
    
    private showLoading() {
        this.isLoading = true;
        this.loadingText.setVisible(true);
        this.loadingGraphics.setVisible(true);
        
        // Add animation for loading spinner
        this.tweens.add({
            targets: this.loadingGraphics,
            rotation: { from: 0, to: Math.PI * 2 },
            duration: 1000,
            repeat: -1,
            onUpdate: () => {
                this.loadingGraphics.clear();
                this.loadingGraphics.fillStyle(0xffffff, 1);
                this.loadingGraphics.fillCircle(this.width / 2, this.height / 2 + 40, 8);
                this.loadingGraphics.fillCircle(this.width / 2 + 15, this.height / 2 + 30, 8);
                this.loadingGraphics.fillCircle(this.width / 2 + 15, this.height / 2 + 50, 8);
            }
        });
    }
    
    private hideLoading() {
        this.isLoading = false;
        this.loadingText.setVisible(false);
        this.loadingGraphics.setVisible(false);
        this.tweens.killTweensOf(this.loadingGraphics);
    }
    
    private async fetchNextDayData() {
        // Show loading UI
        this.showLoading();
        
        try {
            // Fetch data
            this.results = await firstValueFrom(this.svc
                .startNextDay(this.username)
                .pipe(
                    filter(v => v != undefined && v != null),
                    take(1)
                )
            );
            
            console.log(this.results);
            
            // Hide loading UI
            this.hideLoading();
            
            // Continue with displaying results or transitioning to next scene
            this.displayResults();
            
        } catch (error) {
            console.error('Error fetching next day data:', error);
            
            // Hide loading UI and show error
            this.hideLoading();
            this.showError('Failed to load data. Please try again.');
        }
    }
    
    private displayResults() {
        // Implement your results display logic here
        // For example:
        const resultsTitle = this.add.text(
            this.width / 2,
            100,
            'Day Results',
            {
                font: '32px Arial',
                color: '#ffffff'
            }
        ).setOrigin(0.5);
        
        // Display each result item
        if (this.results && this.results.length > 0) {
            this.results.forEach((result, index) => {
                this.add.text(
                    this.width / 2,
                    180 + (index * 40),
                    `${result.name}: ${result.output}`,
                    {
                        font: '18px Arial',
                        color: '#ffffff'
                    }
                ).setOrigin(0.5);
            });
        }
    }
    
    private showError(message: string) {
        this.add.text(
            this.width / 2,
            this.height / 2,
            message,
            {
                font: '18px Arial',
                color: '#ff0000'
            }
        ).setOrigin(0.5);
    }
    
    override update() {
        // Update logic if needed
    }

}
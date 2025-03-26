import { filter, firstValueFrom, take, tap } from "rxjs";
import { SCENES } from "../../../constants/scenes.const";
import { GameStateService } from "../../../services/game/game-state.service";
import { AppState } from "../../../store/app.store";
import { endDay } from "../../../store/player/player.action";
import { Store } from "@ngrx/store";
import { GameObjects, Time } from "phaser";
import Menu from "phaser3-rex-plugins/templates/ui/menu/Menu";

export class EndDay extends Phaser.Scene {
    private width!: number;
    private height!: number;
    private username!: string;
    private results!: {name: string, output: number}[]

    private svc!: GameStateService;
    private store!: Store<AppState>

    // Scene Objects
    private loadingText!: Phaser.GameObjects.Text;
    private updateTimer!: Time.TimerEvent
    private isLoading: boolean = false;
    private btnNext!: GameObjects.Image;

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
        this.load.image('btn-play', '/phaser/icons/play.png')
        this.load.image('banner', '/phaser/bg/banner.png')
        this.load.image('panel', '/phaser/bg/panel.png')
        this.load.image('btn', '/phaser/misc/grey-btn.png')
    }

    create() {
        this.add.rectangle(0,0, this.width, this.height, 0x121212)
            .setOrigin(0)
        
        // Create loading text
        this.loadingText = this.add.text(
            this.width / 2, 
            this.height / 2, 
            'Calculating', 
            { 
                font: '24px vcr',
                color: '#ffffff'
            }
        ).setOrigin(0.5);
        
        this.loadingText.setVisible(false);

        this.updateTimer= this.time.addEvent({
            delay: 400,
            callback: this.updateLoadingText,
            callbackScope: this,
            loop: true
        })
        
        // Start the data fetching process
        this.fetchNextDayData();
    }
    
    private showLoading() {
        this.isLoading = true;
        this.loadingText.setVisible(true);
        
    }

    updateLoadingText() {
        const dots = this.loadingText.text.replace("Calculating", "").length
        let add = ''
        if (dots < 3) {
            add += '.'.repeat(dots + 1)
        }
        this.loadingText.setText(`Calculating${add}`)
    }
    
    private hideLoading() {
        this.isLoading = false;
        this.loadingText.setVisible(false);
        this.updateTimer.remove()
    }
    
    private async fetchNextDayData() {
        // Show loading UI
        this.showLoading();
    
        try {
            // Fetch data
            this.results = await firstValueFrom(this.svc
                .startNextDay(this.username)
                .pipe(
                    tap(v => console.log(v)),
                    take(1)
                )
            );
            
            // Hide loading UI
            this.hideLoading();
            
            // Continue with displaying results or transitioning to next scene
            this.displayResults();
            
        } catch (error) {
            console.error('Error fetching next day data:', error);
            
            this.hideLoading();
            this.showError('Failed to load data. Please try again.');
        }
    }
    
    private displayResults() {
        const banner = this.add.image(
            this.width/2, 115, 'banner'
        )

        const panel = this.add.nineslice(
            (this.width + 50) / 2, banner.getBottomCenter().y + 40,
            'panel', 0, 
            this.width * 0.8 - 50, this.height * 0.5,
            20,20,20,20
        )
        .setOrigin(0.5, 0)

        const resultsTitle = this.add.text(
            this.width / 2,
            100,
            'Bot Output',
            {
                font: '32px',
                color: '#dfe0f2'
            }
        ).setOrigin(0.5);
        
        // Display each result item
        if (this.results && this.results.length > 0) {
            this.results.forEach((result, index) => {
                this.add.text(
                    (this.width + 50) / 2,
                    panel.getTopCenter().y + 30 + (index * 40),
                    `${result.name}:         ${result.output}`,
                    {
                        font: '16px',
                        color: '#dfe0f2'
                    }
                ).setOrigin(0.5);
            });
        }
        this.displayMenuButton()
    }

    private displayMenuButton() {
        
        this.btnNext = this.add.image(this.width/2, this.height * 0.8, 'btn')
        const play = this.add.image(this.width/2, this.height * 0.8, 'btn-play')
        this.btnNext.setScale(2)
        this.btnNext.setInteractive({useHandCursor: true})
        .on('pointerover', () => {
            this.btnNext.setTint(0xaaaaaa)
            play.setTint(0xaaaaaa)
        })
        .on('pointerout', () => {
            this.btnNext.clearTint()
            play.clearTint()
        })
        .on('pointerup', () => {
            this.scene.start(SCENES.BOOT)
        })
    }
    
    private showError(message: string) {
        this.add.text(
            this.width / 2,
            this.height / 2,
            message,
            {
                font: '18px vcr',
                color: '#ff0000'
            }
        ).setOrigin(0.5);
        this.displayMenuButton()
    }
    
    override update() {
    }

}
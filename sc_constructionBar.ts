import { UIComponent, View, Text, Binding, ViewStyle, } from 'horizon/ui';
import * as hz from 'horizon/core';
import * as ui from 'horizon/ui';

// Imports custom UI components and styling from a separate flexible panel library.
import {
    cuiCustomFlexPanelConfig,
    cuiSetupCustomFlexPanel,
    cuiThemeStyle,
    defaultcuiThemeStyle,
    cuiGreenThemeStyle,
    cuiYellowThemeStyle,
} from 'cuiFlexPanel';

/**
 * @class HealthBar
 * @extends UIComponent
 * A UI component that displays a dynamic health bar with a name and color-coded progress.
 */
export class sc_constructionBar extends UIComponent<typeof sc_constructionBar> {
    // A reactive data binding for the progress value (0-100). The UI's width is bound to this.
    private progressValue = new Binding(0);
    // The target health percentage. The animated bar will move towards this value.
    private percentHealth: number = 100; // start at full health
    // A reactive data binding for the name string, allowing it to be updated dynamically.
    private nameString = new Binding('DefaultName');
    // binding to show/hide the percentage
    private displayPercentage = new Binding(false);


    /**
     * @static propsDefinition
     * Defines properties that can be set for this component in the editor.
     * @property theme The visual theme to apply (0 for default, 1 for green, 2 for yellow).
     */
    static propsDefinition = {
        showPercentage: { type: hz.PropTypes.Boolean, default: false },
        theme: { type: hz.PropTypes.Number, default: 0 },
    };

    // A derived binding that calculates the bar's color based on the `progressValue`.
    // The color changes from green to yellow to red as health decreases.
    private barColor = this.progressValue.derive(value => {
        if (value < 33) {
            return 'red';
        } else if (value < 50) {
            return 'yellow';
        } else {
            return 'green';
        }
    });

    // Defines the layout configuration for the flexible panel.
    // It's a simple vertical column with a single child node.
    private flexConfig: cuiCustomFlexPanelConfig = {
        type: 'column',
        children: [
            {
                nodeIdx: 0,
                type: 'row',
                children: [],
            },
        ]
    };

    // Defines the fixed dimensions of the UI panel.
    panelWidth = 460
    panelHeight = 160

    /**
     * @method initializeUI
     * The main entry point for building the component's UI tree.
     * It sets the theme and constructs the name label and the health bar view.
     * @returns A UINode representing the complete UI.
     */
    initializeUI() {
        let theme: cuiThemeStyle;
        // Sets the theme based on the component's `theme` property.
        switch (this.props.theme) {
            case 1:
                theme = cuiGreenThemeStyle;
                break;
            case 2:
                theme = cuiYellowThemeStyle;
                break;
            default:
                theme = defaultcuiThemeStyle;
                break;
        }
        const childPanels: ui.UINode[] = [];

        // Main container view for the health bar UI.
        childPanels.push(View({
            children: [
                // Text component to display the name, bound to `nameString`.
                ui.Text({
                    text: this.nameString,
                    style: {
                        ...theme.panelHeaderTextStyle,
                        textAlign: 'center',
                        fontSize: 44,
                        height: 48
                    }
                }),
                // Outer container for the bar and its background.
                ui.View({
                    children: [
                        // Inner container for the actual progress bar.
                        ui.View({
                            children: [
                                // The actual progress bar visual element.
                                ui.View({
                                    style: {
                                        height: 40, // Height of the progress bar.
                                        // Dynamically sets the width as a percentage string based on `progressValue`.
                                        width: this.progressValue.derive(value => `${value}%`),
                                        backgroundColor: this.barColor,
                                        borderRadius: 5,
                                    },
                                }),
                                // Displays the percentage text on top of the bar.
                                ui.Text({
                                    // Dynamically sets the text, rounding the progress value.
                                    text: this.progressValue.derive(value => `${Math.round(value)}%`),
                                    style: {
                                        color: 'white',
                                        position: 'absolute', // Positions the text over the bar.
                                        alignSelf: 'center',
                                        // The `display` property is controlled by the `displayPercentage` binding.
                                        display: this.displayPercentage.derive((show => {
                                            if (show)
                                                return 'flex'
                                            else
                                                return 'none'
                                        }))
                                    },
                                }),
                            ],
                            style: {
                                width: 400, // Total width of the health bar container.
                                height: 40,
                                borderRadius: 5,
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                            },
                        }),
                    ],
                    style: {
                        width: 420, // Total width of the health bar container, including padding.
                        height: 60,
                        backgroundColor: 'grey', // Background for the empty part of the bar.
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center'
                    },
                })
            ],
        }));

        // Returns the final assembled UI tree.
        return cuiSetupCustomFlexPanel(this.flexConfig, childPanels);
    }

    /**
     * @method start
     * The main entry point for the component's runtime logic.
     * It sets up an interval timer to smoothly animate the health bar's value.
     */
    start() {
        this.displayPercentage.set(this.props.showPercentage)
        // The current value of the animated bar.
        let currentProgress = 100; // Start at full health for a smooth initial animation.
        // The interval at which the progress bar updates.
        const updateRateInMS = 100;
        // Maximum rate of change per second (in percent).
        const updateRatePerSecond = 50;
        // The amount to change per frame of the animation.
        const deltaPerFrame = updateRatePerSecond / (1000 / updateRatePerSecond);

        // Sets up a repeating timer to animate the bar.
        let timerId = this.async.setInterval(() => {
            // If the current progress is very close to the target health, snap to it.
            if (Math.abs(currentProgress - this.percentHealth) <= (100.0 / updateRateInMS)) {
                currentProgress = this.percentHealth;
            }
            else {
                // Animate the bar up or down towards the target health value.
                if (currentProgress < this.percentHealth) {
                    currentProgress += deltaPerFrame;

                    // Clamp the value to prevent overshooting the target.
                    if (currentProgress > this.percentHealth) {
                        currentProgress = this.percentHealth;
                    }
                }
                else {
                    currentProgress -= deltaPerFrame;

                    // Clamp the value to prevent undershooting the target.
                    if (currentProgress < this.percentHealth) {
                        currentProgress = this.percentHealth;
                    }
                }
            }
            // Update the reactive binding, triggering a UI refresh.
            this.progressValue.set(currentProgress);
        }, updateRateInMS);
    }

    /**
     * @public
     * @method updateName
     * A public method to update the name displayed above the health bar.
     * @param name The new name string.
     */
    updateName(name: string) {
        this.nameString.set(name)
    }

    /**
     * @public
     * @method updateHealthBar
     * A public method to set the target health value that the bar will animate to.
     * @param newPercentHealth The new health percentage (0-100).
     */
    updateHealthBar(newPercentHealth: number) {
        this.percentHealth = newPercentHealth;
    }
}

// Registers the component with the Horizon UI system
//UIComponent.register(HealthBar);
hz.Component.register(sc_constructionBar);

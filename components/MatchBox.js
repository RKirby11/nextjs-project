// Based of:: https://betterprogramming.pub/how-to-create-a-swipeable-button-in-javascript-react-c8d1214a0c20
// This is an example of a class component, it:
// extends the React.Component class, 
// uses the render methods to return the JSX descibing components UI
// has access to reacts lifecycle hooks
// can manage their internal state without using the 'use state' functionality
// require 'this' keyword to access props and state 
import React, { Component } from "react";
import Image from 'next/image';

const slider = React.createRef();
const container = React.createRef();

export default class MatchBox extends Component {
    state = {
        lightMatch: false,
        isTouchDevise: false,

    };

    //invoked immmediatlly after component is mounted
    componentDidMount() {
        this.setState({ isTouchDevice: 'ontouchstart' in document.documentElement });
        //check if touch device (e.g mobile or tablet) or not and set event listeners accordingly
        if (this.isTouchDevice) {
            document.addEventListener('touchmove', this.onDrag);
            document.addEventListener('touchend', this.stopDrag);
        }
        else {
            document.addEventListener('mousemove', this.onDrag);
            document.addEventListener('mouseup', this.stopDrag);
        }
        this.strikePoint = container.current.clientWidth * 0.45;
    }
    //invoked immediately before a component is unmounted and destroyed


    onDrag = e => {
        if (this.isDragging && !this.disable) {
            if (this.isTouchDevice) {
                this.sliderWidth = Math.min(Math.max(0, e.touches[0].clientX - this.startX), (this.strikePoint));
            } else {
                this.sliderWidth = Math.min(Math.max(0, e.clientX - this.startX), (this.strikePoint));
            }
            this.updateSliderStyle();
        }
    }

    updateSliderStyle = () => {
        slider.current.style.left = this.sliderWidth + 'px';
        if (this.sliderWidth >= this.strikePoint) {
            this.setState({ lightMatch: true });
            this.lit = true;
        }
    }

    stopDrag = () => {
        if (this.isDragging && !this.disable) {
            this.isDragging = false;
            if (this.sliderWidth >= this.strikePoint) {
                this.disable = true;
                if (this.props.onSuccess) {
                    const timeout = setTimeout(() => {
                        this.props.onSuccess();
                    }, 500);
                    return () => clearTimeout(timeout);
                }
            } else {
                this.sliderWidth = 0;
                this.setState({ lightMatch: false });
            }
            this.updateSliderStyle();
        }
    }

    startDrag = e => {
        if (!this.disable) {
            this.isDragging = true;
            if (this.isTouchDevice) {
                this.startX = e.touches[0].clientX;
            } else {
                this.startX = e.clientX;
            }
        }
    }
    getText = () => {
        return (this.props.text || 'SLIDE TO UNLOCK')
    }

    render() {
        return (
            <div className="relative">
                <div 
                    className="absolute -top-14 select-none z-10  cursor-pointer"
                    ref={slider}
                    draggable="false"
                    onMouseDown={this.startDrag}
                    onTouchStart={this.startDrag}
                >
                    <Image 
                        className="pointer-events-none select-none" 
                        src="/unlitMatch.png" 
                        width="160" 
                        height="160" 
                        alt="match image"
                    />
                    <Image 
                        className={
                            `z-20 pointer-events-none select-none relative -top-40 transition-all duration-1000 
                            ${this.state.lightMatch ? "opacity-1" : "opacity-0"}`
                        } 
                        src="/litMatch.png" 
                        width="160" 
                        height="160"                         
                        alt="match image"
                    />
                    <div 
                        className={
                            `bg-white w-32 h-32 rounded-full blur-lg relative -top-64 right-5 transition-all duration-[2000ms] 
                            ${this.state.lightMatch ? "opacity-1" : "opacity-0"}`
                        }
                    />
                </div>
                <Image 
                    className="pointer-events-none select-none" 
                    src="/matchbox.png" 
                    width="300" 
                    height="300" 
                    alt="matchbox"
                    ref={container}
                />
                <div className="text-white">{this.state.image}</div>
            </div >
        )
    }
}

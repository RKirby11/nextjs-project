// https://betterprogramming.pub/how-to-create-a-swipeable-button-in-javascript-react-c8d1214a0c20

import React, { Component } from "react";
import '/styling/SwipeButton.css'
import Image from 'next/image';

const slider = React.createRef();
const container = React.createRef();
const isTouchDevice = 'ontouchstart' in document.documentElement

export default class SwipeButton extends Component {
    state = {};

    componentDidMount() {
        if (isTouchDevice) {
            document.addEventListener('touchmove', this.onDrag);
            document.addEventListener('touchend', this.stopDrag);
        }
        else {
            document.addEventListener('mousemove', this.onDrag);
            document.addEventListener('mouseup', this.stopDrag);
        }
        this.containerWidth = container.current.clientWidth;
    }

    onDrag = e => {
        if (this.isDragging) {
            if (isTouchDevice) {
                this.sliderWidth = Math.min(Math.max(0, e.touches[0].clientX - this.startX), this.containerWidth);
            } else {
                this.sliderWidth = Math.min(Math.max(0, e.clientX - this.startX), this.containerWidth);
            }
            this.updateSliderStyle();
        }
    }

    updateSliderStyle = () => {
        slider.current.style.width = (this.sliderWidth + 50) + 'px';
    }

    stopDrag = () => {
        if (this.isDragging) {
            this.isDragging = false;
            if (this.sliderWidth > this.containerWidth * 0.9) {
                this.sliderWidth = this.containerWidth;
                if (this.props.onSuccess) {
                    this.props.onSuccess();
                }
            } else {
                this.sliderWidth = 0;
                if (this.props.onFailure) {
                    this.props.onFailure();
                }
            }
            this.updateSliderStyle();
        }
    }

    startDrag = e => {
        this.isDragging = true;
        if (isTouchDevice) {
            this.startX = e.touches[0].clientX;
        } else {
            this.startX = e.clientX;
        }
    }
    getText = () => {
        return (this.props.text || 'SLIDE TO UNLOCK')
    }

    render() {
        return (
            <div className="w-1/2 h-10 relative">
                <div className=
                    'float-left w-full h-full bg-white rounded-md relative overflow-hidden'
                    ref={container}
                >
                    <div className={'h-full w-14 absolute top-0 left-0 z-10 bg-slate-600 rounded-md'}
                        ref={slider}
                        onMouseDown={this.startDrag}
                        onTouchStart={this.startDrag}>
                        <Image className='absolute right-4 top-2.5 select-none pointer-events-none' src='arrow.svg' width="20" height="20" alt='arrow'></Image>
                    </div>
                    <div className='absolute h-10 w-full leading-10 text-center text-slate-600 '>{this.getText()}</div>
                </div>
            </div >
        )
    }
}

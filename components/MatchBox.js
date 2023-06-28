// Based of:: https://betterprogramming.pub/how-to-create-a-swipeable-button-in-javascript-react-c8d1214a0c20
// This is an example of a class component extending the React.Component class rather than a function component

"use client"
import React, { Component } from "react";
import Image from 'next/image';
import { Tooltip } from 'react-tooltip'

const slider = React.createRef();
const container = React.createRef();

export default class MatchBox extends Component {
    state = {
        isMatchLit: false,
        isTouchDevice: false,
        isLocked: true,
        isDragging: false,
        strikePoint: 0,
        sliderWidth: 0,
        startX: 0,
        mounted: false
    }

    //invoked immmediatlly after component is mounted
    componentDidMount() {
        const touchDevice = 'ontouchstart' in window ? true : false;
        this.setState({ isTouchDevice: touchDevice });
        if (touchDevice) {
            document.addEventListener('touchmove', this.onDrag);
            document.addEventListener('touchend', this.stopDrag);
        }
        else {
            document.addEventListener('mousemove', this.onDrag);
            document.addEventListener('mouseup', this.stopDrag);
        }
        this.setState({ strikePoint : container.current.clientWidth * 0.45});
        this.setState({ mounted: true });
    }

    onDrag = e => {
        if (this.state.isDragging && this.state.isLocked) {
            if (this.state.isTouchDevice)
                this.setState({ sliderWidth: Math.min(Math.max(0, e.touches[0].clientX - this.state.startX), (this.state.strikePoint)) });
            else 
                this.setState({ sliderWidth: Math.min(Math.max(0, e.clientX - this.state.startX), (this.state.strikePoint)) });
            slider.current.style.left = this.state.sliderWidth + 'px';
            if (this.state.sliderWidth >= this.state.strikePoint) this.setState({ isMatchLit: true });
            else this.setState({ isMatchLit: false });
        }
    }

    stopDrag = () => {
        if (this.state.isDragging && this.state.isLocked) {
            this.setState({ isDragging: false });
            if (this.state.sliderWidth >= this.state.strikePoint) {
                this.setState({ isLocked: false });
                const timeout = setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 3000);
                return () => clearTimeout(timeout);
            }
        }
    }

    startDrag = e => {
        if (this.state.isLocked) {
            this.setState({ isDragging: true });
            if (this.state.isTouchDevice) this.setState({startX: e.touches[0].clientX});
            else this.setState({startX: e.clientX});
        }
    }

    render() {
        return (
            <>
                {/* Pink Background and Daily Word Appear once Match is Lit */}
                <div className={
                    `absolute transition-all duration-[2500ms] ease-out bg-pink 
                    ${this.state.isLocked ? "w-0 h-0 rounded-full blur-3xl" : "w-screen h-screen rounded-none"}`
                }/>
                <div className="h-20 mb-16 text-center text-2xl z-10 text-offblack">
                    <p className={`font-semibold ${this.state.isLocked ? "hidden" : ""}`}>
                        Today's Word:<br/>
                        <span className="text-4xl font-bold">{this.props.todaysWord}</span>
                    </p>
                </div>

                {/* Match Display Set Up */}
                <div 
                    className={`relative opacity-0 transition-all duration-1000 ease-out ${this.state.mounted ? "opacity-100" : ""}`}
                    data-tooltip-id="btn-tooltip"
                    data-tooltip-content="Swipe the match along the matchbox to light it!"
                    data-tooltip-place="bottom"
                    >
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
                    {/* Lit match is rendered on top of unlit match once fully swiped */}
                    <Image 
                        className={
                            `z-20 pointer-events-none select-none relative -top-40 transition-all duration-1000 
                            ${this.state.isMatchLit ? "opacity-1" : "opacity-0"}`
                        } 
                        src="/litMatch.png" 
                        width="160" 
                        height="160"                         
                        alt="match image"
                    />
                    {/* Light effect is rendered below match once match is lit */}
                    <div className={
                        `bg-white w-32 h-32 rounded-full blur-lg relative -top-64 right-5 transition-all duration-[2000ms] 
                         ${this.state.isMatchLit ? "opacity-1" : "opacity-0"}`
                    }/>
                </div>
                <Image 
                    className="pointer-events-none select-none" 
                    src="/matchbox.png" 
                    width="300" 
                    height="300" 
                    alt="matchbox"
                    ref={container}
                />
            </div >
            {/* Tooltip explains what user must do */}
            <Tooltip id="btn-tooltip" className={`${this.state.isLocked ? "" : "hidden"}`}/>
        </>
        )
    }
}

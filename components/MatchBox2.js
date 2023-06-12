import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Tooltip } from 'react-tooltip'


export default function MatchBox ({ onSuccess, text })  {
  const [lightMatch, setLightMatch] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [strikePoint, setStrikePoint] = useState(0);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in document.documentElement);

    const onDrag = e => {
      if (isDragging) {
        const x = isTouchDevice ? e.touches[0].clientX : e.clientX;
        setSliderWidth(Math.min(Math.max(0, x - startX), strikePoint));
        updateSliderStyle();
      }
    };

    const stopDrag = () => {
      if (isDragging) {
        setIsDragging(false);
        if (sliderWidth >= strikePoint) {
          setLightMatch(true);
          setIsDragging(true);
          if (onSuccess) {
            const timeout = setTimeout(() => {
              onSuccess();
            }, 500);
            return () => clearTimeout(timeout);
          }
        } else {
          setSliderWidth(0);
          setLightMatch(false);
        }
        updateSliderStyle();
      }
    };

    setIsDragging(false);
    setStrikePoint(containerRef.current.clientWidth * 0.45);

    if (isTouchDevice) {
      document.addEventListener("touchmove", onDrag);
      document.addEventListener("touchend", stopDrag);
    } else {
      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseup", stopDrag);
    }

    return () => {
      if (isTouchDevice) {
        document.removeEventListener("touchmove", onDrag);
        document.removeEventListener("touchend", stopDrag);
      } else {
        document.removeEventListener("mousemove", onDrag);
        document.removeEventListener("mouseup", stopDrag);
      }
    };
  }, [isTouchDevice, isDragging, startX, strikePoint, onSuccess]);

  const startDrag = e => {
    if (!isDragging) {
      setIsDragging(true);
      setStartX(isTouchDevice ? e.touches[0].clientX : e.clientX);
    }
  };

  const updateSliderStyle = () => {
    sliderRef.current.style.left = `${sliderWidth}px`;
    if (sliderWidth >= strikePoint) {
      setLightMatch(true);
    } else {
      setLightMatch(false);
    }
  };

  return (
    <>
      <div 
        className="relative"
        data-tooltip-id="btn-tooltip"
        data-tooltip-content="Swipe the match along the matchbox to light it!"
        data-tooltip-place="bottom"
      >
        <div 
          className="absolute -top-14 select-none z-10 cursor-pointer"
          ref={sliderRef}
          draggable="false"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
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
              ${lightMatch ? "opacity-1" : "opacity-0"}`
            } 
            src="/litMatch.png" 
            width="160" 
            height="160"                         
            alt="match image"
          />
          <div 
            className={
              `bg-white w-32 h-32 rounded-full blur-lg relative -top-64 right-5 transition-all duration-[2000ms] 
              ${lightMatch ? "opacity-1" : "opacity-0"}`
            }
          />
        </div>
        <Image 
          className="pointer-events-none select-none" 
          src="/matchbox.png" 
          width="300" 
          height="300" 
          alt="matchbox"
          ref={containerRef}
        />
      </div>
      <Tooltip id="btn-tooltip" />
    </>
  );
}

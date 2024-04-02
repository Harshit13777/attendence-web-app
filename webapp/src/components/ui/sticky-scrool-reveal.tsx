"use client";
import React, { useEffect, useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";
import { TracingBeam } from "./tracing-beam";
import { act } from "react-dom/test-utils";
import '../../index.css'
import { Meteors } from "./meteors";

export const StickyScroll = ({
    content,
    contentClassName,
}: {
    content: {
        title: string;
        description: string;
        content?: React.ReactNode | any;
    }[];
    contentClassName?: string;
}) => {
    const [activeCard, setActiveCard] = React.useState(0);
    const ref = useRef<any>(null);
    const { scrollYProgress } = useScroll({
        // uncomment line 22 and comment line 23 if you DONT want the overflow container and want to have it change on the entire page scroll
        // target: ref
        container: ref,
        offset: ["start start", "end start"],
    });
    const cardLength = content.length;

    const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const screenWidth = window.outerWidth

    const scrollToTop = (offsety: number, globaly: number) => {

        let value = (globaly - offsety);
        if (screenWidth < 768)
            value = 2 * value;
        else value = value / 2
        console.log(value, globaly, offsety, screenWidth)
        // const scrollTop = index * screenHeight;
        if (value > 0)
            window.scrollTo({ top: value, behavior: 'smooth' });
    };

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const cardsBreakpoints = content.map((_, index) => (index) / cardLength);
        const closestBreakpointIndex = cardsBreakpoints.reduce(
            (acc, breakpoint, index) => {
                const distance = Math.abs(latest - breakpoint);
                if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
                    return index;
                }
                return acc;
            },
            0
        );
        setActiveCard(closestBreakpointIndex);
    });



    // Function to stop auto-scrolling
    const stopAutoScroll = () => {
        if (scrollIntervalRef.current) {
            if (ref.current) ref.current.scrollTop = 0;
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
        }
    };

    // Function to scroll to the top of the active card
    const startautoscoll = () => {
        stopAutoScroll();
        let inc = 80;
        let value = 0;
        if (ref.current) {
            const scrollheight = ref.current.scrollHeight;
            scrollIntervalRef.current = setInterval(() => {
                console.log(value,)
                if (scrollheight < value)
                    value = 0
                else value = value + inc;
                if (ref.current) ref.current.scrollTop = value
                else stopAutoScroll();
            }, 2500);
        }
    };

    // Start auto-scrolling on component mount
    useEffect(() => {
        startautoscoll()
        return () => {
            stopAutoScroll();
        };
    }, []);



    const backgroundColors = [
        "var(--black)",
        "var(--slate-900)",
        "var(--neutral-900)",
    ];
    const linearGradients = [
        "linear-gradient(to bottom right, var(--pink-500), var(--indigo-500))",
        "linear-gradient(to bottom right, var(--cyan-500), var(--emerald-500))",
        "linear-gradient(to bottom right, var(--orange-500), var(--yellow-500))",
    ];




    return (
        <motion.div
            animate={{
                backgroundColor: backgroundColors[activeCard % backgroundColors.length],
            }}
            onMouseEnter={(e) => { scrollToTop(e.nativeEvent.offsetY, e.nativeEvent.pageY); }}
            onMouseMove={stopAutoScroll}
            onMouseLeave={startautoscoll}
            className="h-screen scroll-my-0 max-w-screen overflow-hidden no-scrollbar relative  md:h-[30rem] rounded-xl pt-2  md:p-10 pb-12 space-x-10">
            {/*this comp only visible for mobile*/}
            <motion.div
                animate={{
                    background: linearGradients[activeCard % linearGradients.length],
                }}
                className={cn(
                    "md:hidden h-1/2   rounded-xl m-10 items-center justify-center flex",
                    contentClassName
                )}
            >

                <img src={(content[activeCard].content)}>

                </img>

            </motion.div>

            <motion.div

                className="md:h-full h-1/2 no-scrollbar overflow-y-auto flex justify-center  relative  rounded-xl m-2 p-5"
                ref={ref}
            >


                <div
                    className="div relative flex items-start md:px-4">
                    <div className="md:max-w-2xl">
                        {content.map((item, index) => (
                            <div key={item.title + index} className="my-20">
                                <motion.h2
                                    initial={{
                                        opacity: 0,
                                    }}
                                    animate={{
                                        opacity: activeCard === index ? 1 : 0.3,
                                    }}
                                    className="text-2xl font-bold text-slate-100"
                                >
                                    {item.title}
                                </motion.h2>
                                <motion.p
                                    initial={{
                                        opacity: 0,
                                    }}
                                    animate={{
                                        opacity: activeCard === index ? 1 : 0.3,
                                    }}
                                    className="text-kg text-slate-300 md:first-line:max-w-sm mt-10"
                                >
                                    {item.description}
                                </motion.p>
                            </div>
                        ))}
                        <div />
                    </div>

                </div>

                <motion.div
                    animate={{
                        background: linearGradients[activeCard % linearGradients.length],
                    }}
                    className={cn(
                        "hidden md:block h-60  md:w-80 rounded-md bg-white sticky top-10 ",
                        contentClassName
                    )}
                >
                    <div className="w-full h-full items-center justify-center flex">
                        <img src={(content[activeCard].content)}></img>
                    </div>
                </motion.div>


            </motion.div>
            <Meteors number={20} className=" md:top-0 top-1/2" />

        </motion.div>
    );
};

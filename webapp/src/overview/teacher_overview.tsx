import { motion } from "framer-motion";
import { TypewriterEffect } from "../components/ui/typewriter-effect";
import Joyride from 'react-joyride';

export const Teacher_overview = ({ set_show_tutorial }: { set_show_tutorial: React.Dispatch<React.SetStateAction<boolean>> }) => {

    return (
        <div>
            <TypewriterEffect_comp />
            <div className="flex flex-col justify-center items-center">

                <div data-testid="Hellotut" className="rounded-lg bg-red-400 text-xl border-2 p-2 font-semibold text-gray-300 text-center m-10 w-fit" onClick={() => { set_show_tutorial(true) }}>
                    User Guide
                </div>
            </div>
        </div>
    )
}

const TypewriterEffect_comp = () => {
    const words = [
        {
            text: "Welcome",
        },
        {
            text: "to",
        },
        {
            text: "the",
        },
        {
            text: "Teacher",
        },
        {
            text: "Portal",
        },

    ];

    return (

        <motion.div
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
            }}
            className="mt-8 h-3/6 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >

            <div className="m-10">
                <TypewriterEffect words={words} className="md:text-3xl text-2xl" />


            </div>
        </motion.div>


    );
};
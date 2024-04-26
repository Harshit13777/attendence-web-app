import { words } from "lodash"
import { TypewriterEffect } from "../components/ui/typewriter-effect"
import { StickyScroll } from "../components/ui/sticky-scrool-reveal";
import { TracingBeam } from "../components/ui/tracing-beam";
import { Link } from "react-router-dom";
import { Meteors } from "../components/ui/meteors";
import { motion } from "framer-motion";
import { useState } from "react";


export const main_screen = () => {

    return (
        <div className="relative items-center justify-center overflow-y-hidden">{/** over flow hidden beacuse tracing bean is absolute and if steps show are close then height of screen is very large*/}
            <TracingBeam className=" z-50">
                <div className="ml-2 z-40 min-h-fit">

                    <TypewriterEffect_comp />
                    <Introduction />

                    <Sticky_Scroll_comp />
                    <HowWorks />
                </div>
            </TracingBeam>
        </div>
    )
}


const Introduction = () => {
    const story = 'Your innovative solution for automated Face attendance management in educational institutions. Our team is passionate about leveraging technology to simplify tasks and improve efficiency in the education sector.'
    return (
        <div className=" items-center justify-center flex m-5">
            <div className="relative ">
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
                <div className="relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">


                    <h1 className="font-bold text-xl text-white mb-4 relative  opacity-70">
                        Welcome
                    </h1>

                    <p className="text-base text-slate-300 font-medium mb-4 relative">
                        {story}
                    </p>
                    <Meteors number={20} />
                </div>
            </div>
        </div>
    );

}

const HowWorks = () => {
    const [open_step, set_openStep] = useState(false);//this false then all step are shown,this is because tracing bean calculate all height

    const stepsData = [
        {
            image: require('../screenshots/signup.png'),
            header: 'Admin Account Creation',
            description:
                'The first step is for the admin to create an account. They will provide necessary details such as name, email, and password to set up their account.',
        },
        {
            image: require('../screenshots/add teacher .png'),
            header: 'Add Teachers and Students',
            description:
                'After creating the account, the admin can add teachers and students to the system. They will input details such as name, email, and role (teacher/student) for each user.',
        },
        {
            image: require('../screenshots/student upload.jpg'),
            header: 'Student Login and Photo Upload',
            description:
                'Students will receive a welcome email with login credentials (email and password) provided by the admin. Upon logging in, students will be prompted to upload their photo using a designated photo upload feature. This photo will be used for facial recognition during attendance tracking.',
        },
        {
            image: require('../screenshots/login.png'),
            header: 'Teacher Login and Classroom Setup',
            description:
                'Teachers receive login credentials on their email from the admin. They can log in to the platform using their email and password. Once logged in, teachers can set up their classrooms or subjects within the system.',
        },
        {
            image: require('../screenshots/attendance real.png'),
            header: 'Taking Face Attendance',
            description:
                "The system will automatically detect faces in the captured image and system will mark the student as present. If not, the system will mark them as absent . The attendance data is then recorded and stored securely in the system for future reference and reporting.",
        },

    ];



    return (

        <div className="bg-gray-900 shadow-md min-h-screen rounded-lg p-2  m-5">
            <div className=" relative md:p-10 pt-10 text-center">

                <h1 className="text-3xl font-bold text-white opacity-80 mb-8">How it Works</h1>
                <p className="text-gray-400 text-center items-center mt-5">
                    AI Attend has three types of users: <p className=" font-semibold m-5 space-x-5"><span className="">Admins</span> <span>Teachers</span> <span>Students</span></p>
                </p>

                <div>
                    <div className="flex items-center justify-center flex-col mt-10">

                        <div className={`${open_step ? ' translate-y-full' : ''} duration-1000`}>

                            <h1 className="text-xl font-bold text-gray-400 mb-2">
                                Steps to Capture Face-Attendance
                            </h1>
                            <div className="flex items-center flex-col" onClick={() => set_openStep((p) => !p)}>
                                <p className=" font-semibold text-sm text-gray-200">{open_step ? 'Show' : 'Hide'} Steps</p>
                                <div className="w-10 h-10">

                                    {
                                        !open_step ?
                                            <img src={require('../.icons/show_eye.png')} alt="icon" />
                                            :
                                            <img src={require('../.icons/hide_eye.png')} alt="icon"></img>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`shadow-md p-8 rounded-lg  ${open_step ? 'hidden' : ''}`}>
                        <ol className=" list-none list-inside text-gray-200">
                            {
                                stepsData.map((obj, i) => (

                                    <motion.div
                                        initial={{ opacity: 0.5, y: 100 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 0.3,
                                            duration: 0.8,
                                            ease: "easeInOut",
                                        }}>
                                        <li className={`mb-4 shadow-xl border-2 border-blue-200 rounded-xl p-10`}>





                                            <div className="mb-2 ">

                                                <p className=" text-left font-medium mt-2">
                                                    Step {i + 1}.
                                                </p>
                                                <div className="flex items-center">
                                                    <div className=" space-y-5">

                                                        <strong>{obj.header}</strong>
                                                        <p>
                                                            {obj.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <img
                                                src={obj.image}
                                                alt={obj.header}
                                                className=" m-auto"
                                            />
                                        </li>
                                    </motion.div>
                                ))
                            }



                        </ol>
                    </div>

                </div>


            </div>
        </div>
    );
};
const TypewriterEffect_comp = () => {
    const words = [
        {
            text: "Welcome",
        },
        {
            text: "to",
        },
        {
            text: "AI-Attend",
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
                <p className="text-neutral-600 text-center dark:text-neutral-200 text-base mb-10">

                    The future of attendance management is here
                </p>

                <div className=" flex md:flex-row flex-col   space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-10 justify-center items-center ">
                    <Link to="/signup">
                        <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
                            Get Started
                        </button>
                    </Link>
                    <Link to="/login">
                        <button className="w-40 h-10 rounded-xl hover:bg-black border-2 border-black  dark:border-white hover:text-white text-sm">
                            Login
                        </button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

const Sticky_Scroll_comp = () => {
    const img = require('../extra_res/detect attend 2.jpg')
    const img2 = require('../extra_res/teacher_photo click.png')
    const img3 = require('../extra_res/teacher_photo click 2.png')
    const img4 = require('../extra_res/teacher_photo click 3.png')
    const img5 = require('../extra_res/detect attend.jpg')
    const content = [
        {
            title: "Automated Face Attendance",
            description:
                "Say goodbye to manual attendance taking and hello to accurate, real-time attendance records.",
            content: img // You can replace img with the actual image related to attendance tracking
        },
        {
            title: "Real-time Access and Updates",
            description:
                "Access attendance records and receive real-time updates from anywhere, anytime.",
            content: img2 // You can replace img with the actual image related to real-time updates
        },
        {
            title: "Data Analysis",
            description:
                "Track progress, identify patterns, and make data-driven decisions for improved attendance management.",
            content: img5 // You can replace img with the actual image related to data analysis
        },
    ];

    return (
        <div className="m-5">
            <StickyScroll content={content} />

        </div>
    )
}


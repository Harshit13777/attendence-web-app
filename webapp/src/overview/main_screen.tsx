import { words } from "lodash"
import { TypewriterEffect } from "../components/ui/typewriter-effect"
import { StickyScroll } from "../components/ui/sticky-scrool-reveal";
import { TracingBeam } from "../components/ui/tracing-beam";
import { Link } from "react-router-dom";


export const main_screen = () => {

    return (
        <div className="flex  flex-col items-center justify-center h-[100rem]  ">
            <TracingBeam>

                <TypewriterEffect_comp />

                <Sticky_Scroll_comp />
            </TracingBeam>
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
            text: "AI-Attend",
        },

    ];

    return (
        <div className="m-10">
            <TypewriterEffect words={words} />
            <p className="text-neutral-600 text-center dark:text-neutral-200 text-base mb-10">
                The future of attendance management is here
            </p>
            <div className=" flex md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-10 justify-center">
                <Link to="/signup">
                    <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
                        Get Started
                    </button>
                </Link>
            </div>
        </div>
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
            title: "Automated Attendance Tracking",
            description:
                "AI Attend automates attendance tracking using advanced facial recognition technology. Say goodbye to manual attendance taking and hello to accurate, real-time attendance records.",
            content: img // You can replace img with the actual image related to attendance tracking
        },
        {
            title: "Real-time Access and Updates",
            description:
                "Access attendance records and receive real-time updates from anywhere, anytime. Stay informed about attendance changes instantly without delays.",
            content: img2 // You can replace img with the actual image related to real-time updates
        },
        {
            title: "User-friendly Interface",
            description:
                "Enjoy a user-friendly interface that makes navigation and attendance management a breeze. Our intuitive design ensures a seamless experience for teachers, students, and administrators.",
            content: img3 // You can replace img with the actual image related to user-friendly interface
        },
        {
            title: "Integration with Google Services",
            description:
                "Seamlessly integrate AI Attend with Google Sheets and Google Apps Script. Manage attendance data efficiently and securely using familiar Google services.",
            content: img4 // You can replace img with the actual image related to Google services integration
        },
        {
            title: "Data Analysis and Insights",
            description:
                "Gain valuable insights from attendance data analysis. Track progress, identify patterns, and make data-driven decisions for improved attendance management.",
            content: img5 // You can replace img with the actual image related to data analysis
        },
    ];

    return (
        <div className="m-5">
            <StickyScroll content={content} />

        </div>
    )
}
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
        <div className="relative items-center justify-center  ">
            <TracingBeam className=" z-50">
                <div className="ml-2">

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
    const [open_step, set_openStep] = useState(false);

    return (

        <div className="bg-gray-900 relative shadow-md  rounded-lg p-2  m-5">
            <div className=" relativep-10 p-3">

                <h1 className="text-3xl font-bold text-white opacity-80 mb-4">How it Works</h1>
                <p className="text-gray-400">
                    AI Attend has three types of users: admins, teachers, and students.
                </p>
                <ul className="list-disc list-inside text-gray-400">
                    <li>
                        <strong>Admins:</strong> Admins have access to all features of AI
                        Attend and can manage users, courses, and attendance records.
                    </li>
                    <li>
                        <strong>Teachers:</strong> Teachers can take attendance for their
                        classes, view attendance records, and communicate with students.
                    </li>
                    <li>
                        <strong>Students:</strong> Students can check their attendance records
                        and receive notifications about their attendance status.
                    </li>
                </ul>
                <div>
                    <button className=" text-gray-200" onClick={() => set_openStep((p) => !p)}>{!open_step ? 'Show' : 'Hide'} Steps</button>
                    <div className={`shadow-md p-8 rounded-lg ${open_step && 'hidden'}`}>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            Taking Face Attendance in React
                        </h1>
                        <ol className="list-decimal list-inside text-gray-200">
                            <li className="mb-4">
                                <img
                                    src="https://example.com/admin-account-creation.png"
                                    alt="Admin Account Creation"
                                    className="inline-block h-16 w-16 mr-4"
                                />
                                <strong>Admin Account Creation:</strong> The first step is for the
                                admin to create an account on the attendance management platform.
                                They will provide necessary details such as name, email, and password
                                to set up their account.
                            </li>
                            <li className="mb-4">
                                <img
                                    src="https://example.com/add-teachers-and-students.png"
                                    alt="Add Teachers and Students"
                                    className="inline-block h-16 w-16 mr-4"
                                />
                                <strong>Add Teachers and Students:</strong> After creating the
                                account, the admin can add teachers and students to the system.
                                They will input details such as name, email, and role (teacher/student)
                                for each user.
                            </li>
                            <li className="mb-4">
                                <img
                                    src="https://example.com/student-login-and-photo-upload.png"
                                    alt="Student Login and Photo Upload"
                                    className="inline-block h-16 w-16 mr-4"
                                />
                                <strong>Student Login and Photo Upload:</strong> Students will
                                receive a welcome email with login credentials (email and password)
                                provided by the admin. They can log in to the platform using these
                                credentials. Upon logging in, students will be prompted to upload
                                their photo using a designated photo upload feature. This photo will
                                be used for facial recognition during attendance tracking.
                            </li>
                            <li className="mb-4">
                                <img
                                    src="https://example.com/teacher-login-and-classroom-setup.png"
                                    alt="Teacher Login and Classroom Setup"
                                    className="inline-block h-16 w-16 mr-4"
                                />
                                <strong>Teacher Login and Classroom Setup:</strong> Teachers will
                                also receive login credentials from the admin. They can log in to
                                the platform using their email and password. Once logged in, teachers
                                can set up their classrooms or subjects within the system. This
                                includes adding class schedules, subject names, and any other relevant
                                details.
                            </li>
                            <li className="mb-4">
                                <img
                                    src="https://example.com/taking-face-attendance.png"
                                    alt="Taking Face Attendance"
                                    className="inline-block h-16 w-16 mr-4"
                                />
                                <strong>Taking Face Attendance:</strong> When it's time to take
                                attendance, teachers can access the attendance feature from their
                                dashboard. The system will prompt the teacher to capture an image or
                                video of the classroom using a webcam or mobile device. This image will
                                be used for face detection and recognition. The system will automatically
                                detect faces in the captured image and compare them against the stored
                                student photos uploaded earlier. If a match is found, the system will
                                mark the student as present. If not, the system will mark them as absent
                                or prompt the teacher for manual input. The attendance data is then
                                recorded and stored securely in the system for future reference and
                                reporting.
                            </li>
                            <li className="mb-4">
                                <img
                                    src="https://example.com/attendance-reports-and-analytics.png"
                                    alt="Attendance Reports and Analytics"
                                    className="inline-block h-16 w-16 mr-4"
                                />
                                <strong>Attendance Reportsand Analytics:</strong> After the
                                attendance session, teachers and admins can access detailed attendance
                                reports and analytics. This includes data such as attendance percentages,
                                trends, and individual student attendance records. The platform may
                                also provide insights and recommendations based on the attendance
                                data, helping educators make informed decisions.
                            </li>
                        </ol>
                    </div>

                </div>

                <Meteors number={20} />
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

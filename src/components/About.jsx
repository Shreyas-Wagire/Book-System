import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaUsers, FaChartLine, FaHandshake, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

const About = () => {
    const features = [
        {
            icon: <FaLeaf className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />,
            title: "Digital Learning",
            description: "Access to high-quality digital learning resources anytime, anywhere."
        },
        {
            icon: <FaUsers className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />,
            title: "Community Driven",
            description: "Join a thriving community of students and educators sharing knowledge."
        },
        {
            icon: <FaChartLine className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />,
            title: "Continuous Growth",
            description: "Regular updates and new content additions to support your learning journey."
        },
        {
            icon: <FaHandshake className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />,
            title: "Collaborative Learning",
            description: "Engage with peers, share insights, and learn together in our interactive environment."
        }
    ];

    const images = [
        {
            src: "https://www.travancoreanalytics.com/wp-content/uploads/2024/11/Education-App-Development-1-1-scaled.webp",
            alt: "Education App Development",
            className: "w-full h-32 md:h-48 object-cover rounded-lg shadow-lg"
        },
        {
            src: "https://img.etimg.com/thumb/width-420,height-315,imgsize-70320,resizemode-75,msid-103917100/nri/study/us-australia-uk-may-win-over-most-indian-students/indian-students.jpg",
            alt: "International Students",
            className: "w-full h-32 md:h-48 object-cover rounded-lg shadow-lg mt-4 md:mt-8"
        },
        {
            src: "https://s3.youthkiawaaz.com/wp-content/uploads/2019/07/11170102/hindu-college-students.jpg",
            alt: "College Students",
            className: "w-full h-32 md:h-48 object-cover rounded-lg shadow-lg"
        },
        {
            src: "https://dubeat.com/wp-content/uploads/2023/09/Delhi-University-Girls-Coll_50.jpg",
            alt: "University Students",
            className: "w-full h-32 md:h-48 object-cover rounded-lg shadow-lg mt-4 md:mt-8"
        }
    ];

    const teamMembers = [
        {
            name: "Shreyas Wagire",
            role: "Founder & Lead Developer",
            image: "https://lh3.googleusercontent.com/a/ACg8ocJ1O5bUE2cb45K3ylfMAwdw9T3_nlVmqAymkV6qDis1w4aAwPg=s96-c",
            bio: "Computer Science enthusiast with a passion for creating educational platforms that make learning accessible to all.",
            social: [
                { icon: <FaLinkedin />, url: "#" },
                { icon: <FaGithub />, url: "#" },
                { icon: <FaTwitter />, url: "#" }
            ]
        },
        {
            name: "Priya Sharma",
            role: "Content Strategist",
            image: "https://randomuser.me/api/portraits/women/44.jpg",
            bio: "Educational content expert focused on creating engaging learning materials for students across various disciplines.",
            social: [
                { icon: <FaLinkedin />, url: "#" },
                { icon: <FaTwitter />, url: "#" }
            ]
        },
        {
            name: "Rahul Patel",
            role: "UX Designer",
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            bio: "Passionate about creating intuitive user experiences that make educational platforms accessible and enjoyable.",
            social: [
                { icon: <FaLinkedin />, url: "#" },
                { icon: <FaGithub />, url: "#" }
            ]
        },
        {
            name: "Ananya Gupta",
            role: "Community Manager",
            image: "https://randomuser.me/api/portraits/women/68.jpg",
            bio: "Dedicated to building and nurturing the NoteCafe community, ensuring a supportive learning environment.",
            social: [
                { icon: <FaLinkedin />, url: "#" },
                { icon: <FaTwitter />, url: "#" }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20 px-4 lg:px-24 pb-16">
            {/* Hero Section */}
            <motion.div 
                className="max-w-7xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.h1 
                    className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-4 md:mb-8"
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    About <span className="text-blue-600">NoteCafe</span>
                </motion.h1>

                {/* Mission Statement */}
                <motion.p
                    className="text-center text-gray-600 max-w-3xl mx-auto text-sm md:text-base lg:text-lg mb-12 md:mb-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    Our mission is to democratize education by creating a platform where students can easily access, share, and collaborate on learning resources.
                </motion.p>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center mt-8 md:mt-16">
                    {/* Left Side - Text Content */}
                    <motion.div 
                        className="space-y-4 md:space-y-6 order-2 md:order-1"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                            Empowering Students with Digital Learning Solutions
                        </h2>
                        <p className="text-sm md:text-lg text-gray-600 leading-relaxed">
                            NoteCafe is your digital learning companion, providing access to a vast library of educational resources. 
                            We believe in making quality education accessible to everyone, everywhere. Our platform connects students 
                            with the best learning materials and creates an environment where knowledge sharing thrives.
                        </p>
                        <p className="text-sm md:text-lg text-gray-600 leading-relaxed">
                            Founded in 2023, we've grown from a small project to a platform serving thousands of students across India and beyond.
                            Our focus on quality content and user experience has made us a trusted resource in the educational community.
                        </p>
                        <motion.button
                            className="bg-blue-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-medium hover:bg-blue-700 transition-colors duration-300 text-sm md:text-base"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Explore Resources
                        </motion.button>
                    </motion.div>

                    {/* Right Side - Image Grid */}
                    <motion.div 
                        className="grid grid-cols-2 gap-2 md:gap-4 order-1 md:order-2 mb-8 md:mb-0"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        {images.map((image, index) => (
                            <motion.div
                                key={index}
                                className={index % 2 === 1 ? "mt-4 md:mt-8" : ""}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className={image.className}
                                    loading="lazy"
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Features Section */}
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mt-16 md:mt-24"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                            whileHover={{ y: -5 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                        >
                            <div className="bg-blue-50 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 md:mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">{feature.title}</h3>
                            <p className="text-sm md:text-base text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Team Section */}
                <motion.div
                    className="mt-16 md:mt-24"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-8 text-gray-800">Meet Our Team</h2>
                    <p className="text-center text-gray-600 max-w-3xl mx-auto text-sm md:text-base mb-8 md:mb-12">
                        The passionate individuals behind NoteCafe who are dedicated to transforming the educational experience
                    </p>

                    {/* Mobile Horizontal Scroll */}
                    <div className="md:hidden overflow-x-auto -mx-4 px-4 pb-6">
                        <div className="flex space-x-4" style={{ minWidth: 'min-content' }}>
                            {teamMembers.map((member, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white rounded-xl shadow-lg p-4 w-64 flex-shrink-0"
                                    whileHover={{ y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="flex flex-col items-center">
                                        <img 
                                            src={member.image} 
                                            alt={member.name} 
                                            className="w-20 h-20 rounded-full object-cover border-2 border-blue-100"
                                        />
                                        <h3 className="font-bold text-lg mt-3 text-gray-800">{member.name}</h3>
                                        <p className="text-blue-600 text-sm mb-2">{member.role}</p>
                                        <p className="text-gray-600 text-xs text-center mb-3 line-clamp-3">{member.bio}</p>
                                        <div className="flex space-x-3">
                                            {member.social.map((social, idx) => (
                                                <a 
                                                    key={idx} 
                                                    href={social.url} 
                                                    className="text-gray-500 hover:text-blue-600 transition-colors"
                                                >
                                                    {social.icon}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Grid */}
                    <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex flex-col items-center">
                                    <img 
                                        src={member.image} 
                                        alt={member.name} 
                                        className="w-24 h-24 rounded-full object-cover border-2 border-blue-100"
                                    />
                                    <h3 className="font-bold text-xl mt-4 text-gray-800">{member.name}</h3>
                                    <p className="text-blue-600 text-sm mb-3">{member.role}</p>
                                    <p className="text-gray-600 text-sm text-center mb-4">{member.bio}</p>
                                    <div className="flex space-x-4">
                                        {member.social.map((social, idx) => (
                                            <a 
                                                key={idx} 
                                                href={social.url} 
                                                className="text-gray-500 hover:text-blue-600 transition-colors text-lg"
                                            >
                                                {social.icon}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Stats Section */}
                <motion.div 
                    className="mt-16 md:mt-24 bg-blue-600 rounded-xl md:rounded-2xl p-6 md:p-12 text-white"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
                        <div>
                            <h4 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">10K+</h4>
                            <p className="text-blue-100 text-xs md:text-base">Active Users</p>
                        </div>
                        <div>
                            <h4 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">5K+</h4>
                            <p className="text-blue-100 text-xs md:text-base">Resources</p>
                        </div>
                        <div>
                            <h4 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">100+</h4>
                            <p className="text-blue-100 text-xs md:text-base">Contributors</p>
                        </div>
                        <div>
                            <h4 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">50+</h4>
                            <p className="text-blue-100 text-xs md:text-base">Institutions</p>
                        </div>
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    className="mt-16 md:mt-24 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                >
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">Ready to Join Our Community?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-6 text-sm md:text-base">
                        Become part of NoteCafe today and transform your learning experience with access to quality resources and a supportive community.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.button
                            className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Sign Up Now
                        </motion.button>
                        <motion.button
                            className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-full font-medium hover:bg-blue-50 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Learn More
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>

            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-0 w-48 md:w-72 h-48 md:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute top-1/3 right-0 w-48 md:w-72 h-48 md:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
};

export default About;

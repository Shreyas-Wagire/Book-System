import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaBookOpen, FaGraduationCap, FaLightbulb } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

const Banner = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const featuredImages = [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcIk40xdR6Mx1-x6y8iGzChlqV4a4mVupcsg&s",
        "https://edit.org/images/cat/book-covers-big-2019101610.jpg",
        "https://marketplace.canva.com/EAFVq1e7RZg/1/0/1003w/canva-blue-and-white-modern-business-book-cover-Y3vn3BxkwKw.jpg"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % featuredImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for:", searchTerm);
    };

    const categories = [
        { name: "Engineering", icon: <FaGraduationCap /> },
        { name: "Sciences", icon: <FaLightbulb /> },
        { name: "Humanities", icon: <HiSparkles /> }
    ];

    return (
        <div className="px-4 lg:px-24 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 min-h-screen flex items-center relative overflow-hidden">
            {/* Background Decoration */}
            <motion.div
                className="absolute inset-0 opacity-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ duration: 1 }}
            >
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl"></div>
            </motion.div>

            <div className="flex w-full flex-col md:flex-row justify-between items-center gap-12 py-40 relative z-10">
                {/* Left Side */}
                <motion.div
                    className="md:w-1/2 space-y-8"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <motion.h2 
                        className="text-6xl font-bold leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                    >
                        Discover Your
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            College Notes
                        </span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            E-Book Haven
                        </span>
                    </motion.h2>

                    <motion.p 
                        className="text-lg text-gray-600 md:w-4/5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                    >
                        Unlock a world of knowledge with our comprehensive collection of college notes. From engineering to
                        humanities, find the resources you need to excel in your studies.
                    </motion.p>

                    <motion.form
                        onSubmit={handleSearch}
                        className="flex items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.7 }}
                    >
                        <div className="relative flex-grow">
                            <motion.input
                                type="search"
                                placeholder="Search for notes..."
                                className={`w-full py-4 px-6 rounded-l-full outline-none border-2 transition-all duration-300 ${
                                    isSearchFocused 
                                        ? "border-blue-500 shadow-lg shadow-blue-100" 
                                        : "border-blue-200"
                                }`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                            <FaSearch className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                                isSearchFocused ? "text-blue-500" : "text-gray-400"
                            }`} />
                        </div>
                        <motion.button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-white font-medium rounded-r-full hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 flex items-center"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FaBookOpen className="mr-2" />
                            Find Notes
                        </motion.button>
                    </motion.form>

                    <motion.div
                        className="flex flex-wrap gap-4 mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.7 }}
                    >
                        {categories.map((category, index) => (
                            <motion.span
                                key={category.name}
                                className="bg-white px-6 py-2 rounded-full text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center gap-2 cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                            >
                                {category.icon}
                                {category.name}
                            </motion.span>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right Side */}
                <motion.div
                    className="md:w-1/2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <motion.div
                        className="bg-white p-8 rounded-2xl shadow-xl max-w-sm mx-auto overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={currentImageIndex}
                                src={featuredImages[currentImageIndex]}
                                alt="Featured E-Book"
                                className="w-full h-64 object-cover rounded-xl mb-6"
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5 }}
                            />
                        </AnimatePresence>
                        <motion.h3 
                            className="text-2xl font-bold text-gray-800 mb-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            Featured E-Book
                        </motion.h3>
                        <motion.p 
                            className="text-gray-600 mb-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            Discover our top-rated college notes and boost your academic performance.
                        </motion.p>
                        <motion.button
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium w-full flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-200 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaBookOpen />
                            Explore Now
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Banner;

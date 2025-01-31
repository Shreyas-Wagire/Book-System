import { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaBookOpen } from "react-icons/fa";

const Banner = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for:", searchTerm);
    };

    return (
        <div className="px-4 lg:px-24 bg-gradient-to-r from-teal-100 to-blue-100 min-h-screen flex items-center">
            <div className="flex w-full flex-col md:flex-row justify-between items-center gap-12 py-40">
                {/* Left Side */}
                <motion.div
                    className="md:w-1/2 space-y-8"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-5xl font-bold leading-tight text-gray-800">
                        Discover Your
                        <br />
                        <span className="text-blue-700">College Notes</span>
                        <br />
                        <span className="text-teal-600">E-Book Haven</span>
                    </h2>
                    <p className="text-lg text-gray-600 md:w-4/5">
                        Unlock a world of knowledge with our comprehensive collection of college notes. From engineering to
                        humanities, find the resources you need to excel in your studies.
                    </p>
                    <motion.form
                        onSubmit={handleSearch}
                        className="flex items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <div className="relative flex-grow">
                            <input
                                type="search"
                                placeholder="Search for notes..."
                                className="w-full py-3 px-4 rounded-l-full outline-none border-2 border-blue-300 focus:border-blue-500 transition-all duration-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-700 px-6 py-3 text-white font-medium rounded-r-full hover:bg-blue-800 transition-all duration-300 flex items-center"
                        >
                            <FaBookOpen className="mr-2" />
                            Find Notes
                        </button>
                    </motion.form>
                    <motion.div
                        className="flex gap-4 mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <span className="bg-white px-4 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                            Engineering
                        </span>
                        <span className="bg-white px-4 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                            Sciences
                        </span>
                        <span className="bg-white px-4 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                            Humanities
                        </span>
                    </motion.div>
                </motion.div>

                {/* Right Side */}
                <motion.div
                    className="md:w-1/2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <img src="/placeholder.svg" alt="Featured E-Book" className="w-full h-64 object-cover rounded-md mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Featured E-Book</h3>
                        <p className="text-gray-600 mb-4">
                            Discover our top-rated college notes and boost your academic performance.
                        </p>
                        <motion.button
                            className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            Explore Now
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Banner;

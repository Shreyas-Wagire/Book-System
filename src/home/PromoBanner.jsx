import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import bookPic from "../assets/awardbooks.png"

const PromoBanner = () => {
    return (
        <div className="mt-16 py-16 bg-gradient-to-r from-blue-100 to-blue-200 px-4 lg:px-24 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                <motion.div
                    className="md:w-1/2"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl font-bold mb-6 leading-tight text-blue-900">
                        Discover Upcoming <span className="text-blue-600">Books & Notes</span> for 1st Year Students
                    </h2>
                    <p className="text-lg text-gray-700 mb-8">
                        Get ahead of your studies with our curated collection of resources tailored for freshmen. Don't miss out on
                        our exclusive promotions!
                    </p>
                    <Link to="/shop" className="inline-block">
                        <motion.button
                            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Explore Promos
                        </motion.button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <img
                        src={bookPic || "/placeholder.svg"}
                        alt="Award-winning books"
                        className="w-full max-w-md rounded-lg shadow-2xl"
                    />
                </motion.div>
            </div>

            <motion.div
                className="absolute bottom-0 left-0 w-full h-2 "
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            />
        </div>
    )
}

export default PromoBanner


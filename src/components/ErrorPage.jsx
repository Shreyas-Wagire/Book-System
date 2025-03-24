import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const ErrorPage = () => {
    const error = useRouteError();

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center"
            >
                <div className="mb-6">
                    <FaExclamationTriangle className="mx-auto text-6xl text-red-500" />
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Oops!</h1>
                
                <p className="text-gray-600 mb-6">
                    {error?.statusText || error?.message || "Sorry, an unexpected error occurred."}
                </p>

                {error?.status === 404 ? (
                    <p className="text-gray-500 mb-8">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                ) : (
                    <p className="text-gray-500 mb-8">
                        Please try again later or contact support if the problem persists.
                    </p>
                )}

                <Link
                    to="/"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                >
                    <FaHome className="mr-2" />
                    Back to Home
                </Link>
            </motion.div>
        </div>
    );
};

export default ErrorPage; 
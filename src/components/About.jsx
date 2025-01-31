import React from 'react';

const About = () => {
  return (
    <div className='mt-28 px-4 lg:px-24'>
      <h1 className='text-5xl font-bold text-center mb-12 text-gradient'>About Us</h1>
      
      <section className='mb-12 p-6 bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg shadow-lg'>
        <h2 className='text-3xl font-semibold mb-4 text-blue-800'>Our Mission</h2>
        <p className='text-lg text-gray-700'>
          At BookStore, our mission is to provide students with easy access to a wide range of educational materials. 
          We believe that knowledge should be accessible to everyone, and we strive to make this a reality by offering 
          a vast collection of books at affordable prices.
        </p>
      </section>

      <section className='mb-12 p-6 bg-gradient-to-r from-green-100 to-green-300 rounded-lg shadow-lg'>
        <h2 className='text-3xl font-semibold mb-4 text-green-800'>Our Collection</h2>
        <p className='text-lg text-gray-700'>
          We offer a diverse collection of books covering various subjects including science, technology, engineering, 
          mathematics, literature, and more. Whether you are looking for textbooks, reference books, or leisure reading, 
          we have something for everyone.
        </p>
      </section>

      <section className='mb-12 p-6 bg-gradient-to-r from-yellow-100 to-yellow-300 rounded-lg shadow-lg'>
        <h2 className='text-3xl font-semibold mb-4 text-yellow-800'>Our Team</h2>
        <p className='text-lg text-gray-700'>
          Our team is comprised of passionate individuals dedicated to promoting education and learning. We work tirelessly 
          to ensure that our collection is up-to-date and that our customers have the best experience possible.
        </p>
      </section>

      <section className='mb-12 p-6 bg-gradient-to-r from-purple-100 to-purple-300 rounded-lg shadow-lg'>
        <h2 className='text-3xl font-semibold mb-4 text-purple-800'>Contact Us</h2>
        <p className='text-lg text-gray-700'>
          If you have any questions, suggestions, or feedback, please don't hesitate to reach out to us. You can contact us 
          at <a href="mailto:info@bookstore.com" className='text-blue-600 underline'>info@bookstore.com</a>. We look forward 
          to hearing from you!
        </p>
      </section>
    </div>
  );
}

export default About;

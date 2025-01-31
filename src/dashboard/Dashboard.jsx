import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  // Example state variables
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate fetching user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Simulate fetching data from an API
        // Replace with actual fetch logic
        const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Dummy widget components
  const UserWidget = () => (
    <div className='bg-white shadow-md p-4 rounded-lg border'>
      <h3 className='text-xl font-semibold mb-4'>User Information</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p><strong>Name:</strong> {userData?.name}</p>
          <p><strong>Email:</strong> {userData?.email}</p>
          <p><strong>Phone:</strong> {userData?.phone}</p>
          <p><strong>Website:</strong> {userData?.website}</p>
        </div>
      )}
    </div>
  );

  const LatestOrdersWidget = () => (
    <div className='bg-white shadow-md p-4 rounded-lg border'>
      <h3 className='text-xl font-semibold mb-4'>Latest Orders</h3>
      <ul>
        <li>Order 1</li>
        <li>Order 2</li>
        <li>Order 3</li>
      </ul>
    </div>
  );

  return (
    <div className='my-8 px-4 lg:px-24'>
      <h2 className='text-3xl font-bold text-center mb-8'>Dashboard</h2>

      <div className='grid gap-6 lg:grid-cols-2'>
        <div className='grid gap-6 lg:grid-cols-1'>
          <UserWidget />
          <LatestOrdersWidget />
        </div>
        {/* Add more widgets/components as needed */}
      </div>
    </div>
  );
};

export default Dashboard;

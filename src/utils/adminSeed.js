// Default admin credentials
export const defaultAdmin = {
    email: 'admin@notecafe.com',
    password: 'Admin@123',
    displayName: 'NoteCafe Admin',
    isAdmin: true
};

// Function to create admin user if it doesn't exist
export const seedAdmin = async () => {
    try {
        const response = await fetch('YOUR_API_ENDPOINT/check-admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: defaultAdmin.email }),
        });

        if (!response.ok) {
            // Admin doesn't exist, create one
            const createResponse = await fetch('YOUR_API_ENDPOINT/create-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(defaultAdmin),
            });

            if (!createResponse.ok) {
                throw new Error('Failed to create admin user');
            }

            console.log('Admin user created successfully');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    }
}; 
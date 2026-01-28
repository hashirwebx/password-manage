const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hashirkhan15432_db_user-password-manang:khanisking@cluster0.kwepzkr.mongodb.net/?appName=Cluster0';

async function checkUser(email) {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const UserSchema = new mongoose.Schema({
            email: String,
            passwordHash: String,
            role: String,
            organizationId: String
        });

        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        console.log(`Checking user: ${email}`);
        const user = await User.findOne({ email: email.toLowerCase() });

        if (user) {
            console.log('User found:');
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`);
            console.log(`Has PasswordHash: ${!!user.passwordHash}`);
            console.log(`PasswordHash Length: ${user.passwordHash ? user.passwordHash.length : 0}`);
        } else {
            console.log('User NOT found');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkUser('hashirkhan15432@gmail.com');

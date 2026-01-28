const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hashirkhan15432_db_user-password-manang:khanisking@cluster0.kwepzkr.mongodb.net/?appName=Cluster0';

async function listUsers() {
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

        const users = await User.find({});
        console.log(`Found ${users.length} users:`);

        users.forEach(u => {
            console.log(`- ID: ${u._id}`);
            console.log(`  Email: '${u.email}' (Length: ${u.email.length})`);
            console.log(`  Hash exists: ${!!u.passwordHash}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

listUsers();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hashirkhan15432_db_user-password-manang:khanisking@cluster0.kwepzkr.mongodb.net/?appName=Cluster0';

async function testLogin(email, password) {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const UserSchema = new mongoose.Schema({
            email: String,
            passwordHash: String,
        });

        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        console.log(`Testing login for: ${email}`);
        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            console.log('❌ User not found');
            return;
        }

        console.log('✅ User found');
        console.log(`Stored Hash: ${user.passwordHash.substring(0, 20)}...`);

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (isMatch) {
            console.log('✅ Password MATCHES! Login should work.');
        } else {
            console.log('❌ Password DOES NOT match.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

// Replace 'your_password_here' with the password you are trying to use
// Since I don't know your password, I'll use a placeholder. 
// You can edit this file or I can run it with a common password if you tell me, 
// OR better, I will reset the password to a known value if this fails.

// For now, I will just check if I can reset it to a known good password.
// But first, let me create a script that resets the password to 'password123' so you can try logging in with that.

async function resetPassword(email, newPassword) {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB for Reset');

        const UserSchema = new mongoose.Schema({
            email: String,
            passwordHash: String,
        });

        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        const normalizedEmail = email.trim().toLowerCase();
        const hash = await bcrypt.hash(newPassword, 10);

        const result = await User.findOneAndUpdate(
            { email: normalizedEmail },
            { passwordHash: hash },
            { new: true }
        );

        if (result) {
            console.log(`✅ Password for ${email} reset to: ${newPassword}`);
        } else {
            console.log(`❌ User ${email} not found for reset`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

// UNCOMMENT THE LINE BELOW TO RESET PASSWORD
resetPassword('hashirkhan15432@gmail.com', 'password123');

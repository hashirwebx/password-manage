const mongoose = require('mongoose');

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hashirkhan15432_db_user-password-manang:khanisking@cluster0.kwepzkr.mongodb.net/?appName=Cluster0';

async function checkData() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        // Define simplified schemas
        const InvitationSchema = new mongoose.Schema({
            email: String,
            token: String,
            status: String,
            organizationId: String
        });
        const UserSchema = new mongoose.Schema({
            email: String,
            organizationId: String
        });

        const Invitation = mongoose.models.Invitation || mongoose.model('Invitation', InvitationSchema);
        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        // List all pending invitations
        const invitations = await Invitation.find({ status: 'pending' });
        console.log('\n=== PENDING INVITATIONS ===');
        for (const inv of invitations) {
            console.log(`Email: ${inv.email}`);
            console.log(`Token: ${inv.token}`);
            console.log(`Status: ${inv.status}`);

            // Check if user exists
            const user = await User.findOne({ email: inv.email });
            if (user) {
                console.log(`User Account: EXISTS`);
                console.log(`User Org ID: ${user.organizationId || 'None (Ready to join)'}`);
            } else {
                console.log(`User Account: DOES NOT EXIST (Must register first)`);
            }
            console.log('-------------------');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkData();

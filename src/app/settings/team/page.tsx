'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type User = {
  _id: string;
  email: string;
  name?: string;
  role: string;
  organizationId?: string;
};

type SessionUser = {
  id: string;
  email: string;
  name?: string;
  role: string;
  organizationId?: string;
};

type Invitation = {
  _id: string;
  email: string;
  role: string;
  status: string;
  invitedBy: string;
  invitedByEmail: string;
  token: string;
  expiresAt: string;
  createdAt: string;
};

interface Member {
  _id: string;
  email: string;
  role: string;
  name?: string;
  createdAt: string;
}

export default function TeamSettingsPage() {
  const { data: session, status } = useSession();
  const user = session?.user as SessionUser | undefined;
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [processing, setProcessing] = useState(false);
  const [orgId, setOrgId] = useState('');

  // Type guard to check if user has required properties
  const isValidUser = (user: any): user is SessionUser => {
    return user && user.id && user.email && user.role;
  };

  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load
    
    if (status === 'unauthenticated' || !user) {
      router.push('/login?callbackUrl=' + encodeURIComponent('/settings/team'));
      return;
    }

    if (!isValidUser(user)) {
      setError('Invalid user session');
      setLoading(false);
      return;
    }

    if (user.organizationId) {
      setOrgId(user.organizationId);
      fetchTeamData(user.organizationId);
    } else {
      setError('You are not part of any organization');
      setLoading(false);
    }

    const canRemove = (memberRole: string, memberId: string) => {
      const userRole = user?.role;
      return (
        (userRole === 'owner' && memberRole !== 'owner') ||
        (userRole === 'admin' && !['owner', 'admin'].includes(memberRole))
      ) && !isCurrentUser(memberId);
    };

    const isCurrentUser = (memberId: string) => user?.id === memberId;
    const isAdmin = user?.role === 'admin' || user?.role === 'owner';
    const isOwner = user?.role === 'owner';
  }, [status, session]);

  const fetchTeamData = async (organizationId: string) => {
    try {
      setLoading(true);
      
      // Fetch team members
      const membersRes = await fetch(`/api/team/members?organizationId=${organizationId}`);
      if (!membersRes.ok) throw new Error('Failed to fetch team members');
      const membersData = await membersRes.json();
      setMembers(membersData.members || []);
      
      // Fetch pending invitations
      const invitesRes = await fetch(`/api/invitations?organizationId=${organizationId}`);
      if (invitesRes.ok) {
        const invitesData = await invitesRes.json();
        setInvitations(invitesData.invitations || []);
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to load team data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteEmail) {
      setError('Please enter an email address');
      return;
    }
    
    setProcessing(true);
    setError('');
    
    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send invitation');
      }
      
      // Refresh the invitations list
      await fetchTeamData(orgId);
      setInviteEmail('');
      
    } catch (err: any) {
      setError(err.message || 'Failed to send invitation');
    } finally {
      setProcessing(false);
    }
  };

  const handleResendInvite = async (invitationToken: string) => {
    try {
      setProcessing(true);
      
      const res = await fetch(`/api/invitations/${invitationToken}/resend`, {
        method: 'POST',
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to resend invitation');
      }
      
      // Refresh the invitations list
      if (orgId) fetchTeamData(orgId);
      
    } catch (err: any) {
      setError(err.message || 'Failed to resend invitation');
    } finally {
      setProcessing(false);
    }
  };

  const handleRevokeInvite = async (invitationToken: string) => {
    if (!confirm('Are you sure you want to revoke this invitation?')) return;
    
    try {
      setProcessing(true);
      
      const res = await fetch(`/api/invitations/${invitationToken}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to revoke invitation');
      }
      
      // Refresh the invitations list
      if (orgId) fetchTeamData(orgId);
      
    } catch (err: any) {
      setError(err.message || 'Failed to revoke invitation');
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    
    try {
      setProcessing(true);
      
      const res = await fetch(`/api/team/members/${memberId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to remove member');
      
      // Refresh the members list
      if (orgId) fetchTeamData(orgId);
      
    } catch (err: any) {
      setError(err.message || 'Failed to remove member');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Team Settings</h1>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Team Settings</h1>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">{error}</div>
              <button
                onClick={() => orgId && fetchTeamData(orgId)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // or redirect to login
  }

  const isCurrentUser = (memberId: string) => user?.id === memberId;
  const isAdmin = user?.role === 'admin' || user?.role === 'owner';
  const isOwner = user?.role === 'owner';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Team Settings</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {/* Invite Team Member */}
        {(isAdmin || isOwner) && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Invite Team Member</h2>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="email@example.com"
                    disabled={processing}
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="role"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    disabled={processing || !isOwner}
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    {isOwner && <option value="owner">Owner</option>}
                  </select>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={processing || !inviteEmail}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    processing || !inviteEmail
                      ? 'bg-indigo-300 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {processing ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pending Invitations */}
        {invitations.length > 0 && (isAdmin || isOwner) && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Pending Invitations</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invited By
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sent
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expires
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invitations.map((invitation) => (
                    <tr key={invitation._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-600 font-medium">
                                {invitation.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {invitation.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {invitation.token?.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          invitation.role === 'owner' 
                            ? 'bg-purple-100 text-purple-800'
                            : invitation.role === 'admin'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {invitation.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 text-xs font-medium">
                                {invitation.invitedBy?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-2">
                            <div className="text-sm text-gray-900">
                              {invitation.invitedBy || 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {members.find(m => m.email === invitation.invitedBy)?.role || 'Member'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invitation.createdAt).toLocaleDateString()}
                        <div className="text-xs text-gray-400">
                          {new Date(invitation.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className={`text-sm ${
                          new Date(invitation.expiresAt) < new Date() 
                            ? 'text-red-600 font-medium' 
                            : 'text-gray-900'
                        }`}>
                          {new Date(invitation.expiresAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(invitation.expiresAt).toLocaleTimeString()}
                        </div>
                        {new Date(invitation.expiresAt) < new Date() && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                            Expired
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          invitation.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : invitation.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {invitation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleResendInvite(invitation.token)}
                          disabled={processing}
                          className="text-indigo-600 hover:text-indigo-900 mr-3 disabled:opacity-50"
                          title="Resend invitation"
                        >
                          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Resend
                        </button>
                        <button
                          onClick={() => handleRevokeInvite(invitation.token)}
                          disabled={processing}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Revoke invitation"
                        >
                          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Team Members */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Team Members</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  {(isAdmin || isOwner) && (
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((member) => (
                  <tr key={member._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {member.name?.[0]?.toUpperCase() || member.email[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{member.name || 'No name'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.email}
                      {member._id === user?.id && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          You
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.role === 'owner' 
                          ? 'bg-purple-100 text-purple-800' 
                          : member.role === 'admin' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>
                    {(isAdmin || isOwner) && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {member._id !== user?.id && (
                          <button
                            onClick={() => handleRemoveMember(member._id)}
                            disabled={processing || (member.role === 'owner' && !isOwner)}
                            className={`text-red-600 hover:text-red-900 ${
                              (processing || (member.role === 'owner' && !isOwner)) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            title={member.role === 'owner' && !isOwner ? 'Only the owner can remove other owners' : ''}
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

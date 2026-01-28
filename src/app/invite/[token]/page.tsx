'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function InvitationPage() {
  const { token } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (token) {
      fetchInvitation();
    }
  }, [token]);

  const fetchInvitation = async () => {
    try {
      const res = await fetch(`/api/invitations/${token}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch invitation');
      }

      setInvitation(data);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (accept: boolean) => {
    if (!token) return;

    setProcessing(true);
    setError('');

    try {
      const res = await fetch(`/api/invitations/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accept }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === 'USER_NOT_FOUND') {
          setError('This email is not registered. Please create an account first.');
          // Optional: redirect to register
          setTimeout(() => {
            router.push(`/register?email=${encodeURIComponent(data.email)}&callbackUrl=${encodeURIComponent(window.location.href)}`);
          }, 2000);
          return;
        }

        if (data.code === 'ALREADY_MEMBER') {
          setError('You are already a member of this organization.');
          return;
        }

        throw new Error(data.error || 'Failed to process invitation');
      }

      if (accept) {
        if (data.switched) {
          setSuccess('Successfully switched to the new organization! Redirecting...');
        } else {
          setSuccess('Successfully joined the organization! Redirecting...');
        }
        // Refresh session to get updated user data
        if (status === 'authenticated') {
          await fetch('/api/auth/session?update');
        }
        // Redirect to vault after a short delay
        setTimeout(() => router.push('/vault'), 2000);
      } else {
        setSuccess('Invitation declined.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Loading invitation...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Invitation Error</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <div className="mt-6">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600">Success!</h2>
            <p className="mt-2 text-gray-600">{success}</p>
            {!success.includes('Redirecting') && (
              <div className="mt-6">
                <Link
                  href="/"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Return to Home
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Team Invitation
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You've been invited to join a team
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-md bg-gray-50 p-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Invited by</span>
              <span className="text-sm text-gray-900">{invitation?.invitedBy}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-sm font-medium text-gray-500">Email</span>
              <span className="text-sm text-gray-900">{invitation?.email}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-sm font-medium text-gray-500">Role</span>
              <span className="text-sm font-medium text-gray-900 capitalize">
                {invitation?.role}
              </span>
            </div>
          </div>

          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => handleResponse(true)}
              disabled={processing}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${processing ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              {processing ? 'Processing...' : 'Accept Invitation'}
            </button>
            <button
              onClick={() => handleResponse(false)}
              disabled={processing}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Decline
            </button>
          </div>

          {status !== 'authenticated' && (
            <div className="mt-4 text-sm text-center text-gray-600">
              <p>You need to be signed in to accept this invitation.</p>
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(window.location.href)}`}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
              {' '}or{' '}
              <Link
                href={`/register?callbackUrl=${encodeURIComponent(window.location.href)}`}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                create an account
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

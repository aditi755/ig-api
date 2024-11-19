'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type UserData = {
  id: string;
  username: string;
  account_type: string;
};

export default function ConnectInstagram() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log('function runs')
    const queryParams = new URLSearchParams(window.location.search);
    console.log(queryParams)
    const code = queryParams.get('code');
    console.log(code)
    if (code) {
      // Automatically send the code to our server-side endpoint to exchange for an access token
      fetch(`/api/auth/instagram/callback?code=${code}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch Instagram user data');
          }
          return response.json();
        })
        .then((data) => {
          setUserData(data); // Display Instagram user data
          router.replace('/'); // Optionally remove the code query parameter
        })
        .catch((error) => {
          console.error('Error fetching Instagram data:', error);
        });
    }

    console.log('function ends')
  }, [router]);

  return (
    <div>
      <h1>Connect with Instagram</h1>
      {!userData ? (
        <a
          href={`https://api.instagram.com/oauth/authorize?client_id=564900196121353&redirect_uri=${encodeURIComponent(
            'https://ig-api-indol.vercel.app/api/auth/instagram/callback'
          )}&scope=instagram_business_basic,instagram_business_manage_insights,instagram_business_manage_comments,instagram_business_content_publish,instagram_business_manage_messages&response_type=code`}
        >
          Connect with Instagram
        </a>
      ) : (
        <div>
          <h2>Instagram User Info</h2>
          <p>ID: {userData.id}</p>
          <p>Username: {userData.username}</p>
          <p>Account Type: {userData.account_type}</p>
        </div>
      )}
    </div>
  );
}

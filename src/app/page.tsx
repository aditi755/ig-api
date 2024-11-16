
// frontend code - app/ConnectInstagram.tsx
'use client';
import { useEffect, useState } from 'react';

type UserData = {
  id: string;
  username: string;
  account_type: string;
};

export default function ConnectInstagram() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');

    if (code) {
      fetch(`/api/auth/instagram/callback?code=${code}`)
        .then(response => response.json())
        .then(data => {
          setUserData(data);
        })
        .catch(error => {
          console.error('Error fetching Instagram data:', error);
        });
    }
  }, []);

  return (
    <div>
      <h1>Connect screen</h1>
      {!userData ? (
        <a
        href={`https://api.instagram.com/oauth/authorize?client_id=564900196121353&redirect_uri=http://localhost:3000/api/auth/instagram/callback&response_type=code&scope=user_profile,user_media`}
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




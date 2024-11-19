// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// type UserData = {
//   id: string;
//   username: string;
//   account_type: string;
// };

// export default function ConnectInstagram() {
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     console.log('function runs')
//     const queryParams = new URLSearchParams(window.location.search);
//     console.log(queryParams)
//     const code = queryParams.get('code');
//     console.log(code)
//     if (code) {
//       // Automatically send the code to our server-side endpoint to exchange for an access token
//       fetch(`/api/auth/instagram/callback?code=${code}`)
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error('Failed to fetch Instagram user data');
//           }
//           return response.json();
//         })
//         .then((data) => {
//           setUserData(data); // Display Instagram user data
//           router.replace('/'); // Optionally remove the code query parameter
//         })
//         .catch((error) => {
//           console.error('Error fetching Instagram data:', error);
//         });
//     }

//     console.log('function ends')
//   }, [router]);

//   return (
//     <div>
//       <h1>Connect with Instagram</h1>
//       {!userData ? (
//         <a
//           href={`https://api.instagram.com/oauth/authorize?client_id=564900196121353&redirect_uri=${encodeURIComponent(
//             'https://ig-api-indol.vercel.app/api/auth/instagram/callback'
//           )}&scope=instagram_business_basic,instagram_business_manage_insights,instagram_business_manage_comments,instagram_business_content_publish,instagram_business_manage_messages&response_type=code`}
//         >
//           Connect with Instagram
//         </a>
//       ) : (
//         <div>
//           <h2>Instagram User Info</h2>
//           <p>ID: {userData.id}</p>
//           <p>Username: {userData.username}</p>
//           <p>Account Type: {userData.account_type}</p>
//         </div>
//       )}
//     </div>
//   );
// }






'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type MediaData = {
  id: string;
  media_type: string;
  media_url: string;
  like_count: number;
  comments_count: number;
};

type UserData = {
  id: string;
  username: string;
  account_type: string;
  full_name: string;
  profile_picture_url: string;
  media_count: number;
  media?: MediaData[];
};

export default function ConnectInstagram() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');

    if (code) {
      fetch(`/api/auth/instagram/callback?code=${code}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch Instagram user data');
          }
          return response.json();
        })
        .then((data) => {
          setUserData({ ...data.userData, media: data.mediaData.data });
          router.replace('/'); // Optionally remove the code query parameter
        })
        .catch((error) => {
          console.error('Error fetching Instagram data:', error);
        });
    }
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
          <img src={userData.profile_picture_url} alt="Profile" width={100} />
          <p>Full Name: {userData.full_name}</p>
          <p>Username: {userData.username}</p>
          <p>Account Type: {userData.account_type}</p>
          <p>Total Posts: {userData.media_count}</p>
          <h3>Recent Media</h3>
          {userData.media?.map((media) => (
            <div key={media.id}>
              <p>Media Type: {media.media_type}</p>
              <img src={media.media_url} alt="Media" width={100} />
              <p>Likes: {media.like_count}</p>
              <p>Comments: {media.comments_count}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

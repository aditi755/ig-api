// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image'
// interface InstagramUserData {
//   id: string;
//   username: string;
//   account_type: string;
//   media_count: number;
// }

// interface InstagramMediaData {
//   id: string;
//   caption: string;
//   media_type: string;
//   media_url: string;
//   thumbnail_url?: string;
//   permalink: string;
// }

// export default function ConnectInstagram() {
//   const [userData, setUserData] = useState<InstagramUserData | null>(null);
//   const [mediaData, setMediaData] = useState<InstagramMediaData[] | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const queryParams = new URLSearchParams(window.location.search);
//     const code = queryParams.get('code');

//     if (code) {
//       fetch(`/api/auth/instagram/callback?code=${code}`)
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error('Failed to fetch Instagram data');
//           }
//           return response.json();
//         })
//         .then((data) => {
//           // Map user profile and media data to respective state
//           setUserData(data.userProfile);
//           setMediaData(data.userMedia);
//           console.log('remove the code query paramtere')
//           router.replace('/'); // Optionally remove the code query parameter
//           console.log('done removing code ')
//         })
//         .catch((error) => {
//           console.error('Error fetching Instagram data:', error);
//         });
//     }
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
//           <p>User ID: {userData.id}</p>
//           <p>Username: {userData.username}</p>
//           <p>Account Type: {userData.account_type}</p>
//           <p>Total Posts: {userData.media_count}</p>
//           <h3>Recent Media</h3>
//           {mediaData && mediaData.length > 0 ? (
//             mediaData.map((media) => (
//               <div key={media.id}>
//                 <p>Caption: {media.caption || 'No caption available'}</p>
//                 <p>Media Type: {media.media_type}</p>
//                 <Image
//                   src={media.media_url}
//                   alt={media.caption || 'Instagram Media'}
//                   width={100}
//                 />
//                 {media.thumbnail_url && (
//                   <Image
//                     src={media.thumbnail_url}
//                     alt="Thumbnail"
//                     width={100}
//                   />
//                 )}
//                 <p>
//                   View on Instagram:{" "}
//                   <a href={media.permalink} target="_blank" rel="noopener noreferrer">
//                     Link
//                   </a>
//                 </p>
//               </div>
//             ))
//           ) : (
//             <p>No media available.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'

interface FacebookUserData {
  id: string;
  name: string;
  username?: string;
  followers_count?: number;
  media_count?: number;
}

interface FacebookMediaData {
  id: string;
  caption?: string;
  media_type: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  like_count?: number;
  comments_count?: number;
  insights?: {
    data: Array<{
      name: string;
      values: Array<{ value: number }>
    }>
  };
}

export default function ConnectInstagram() {
  const [userData, setUserData] = useState<FacebookUserData | null>(null);
  const [mediaData, setMediaData] = useState<FacebookMediaData[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');

    if (code) {
      fetch(`/api/auth/instagram/callback?code=${code}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch Instagram data');
          }
          return response.json();
        })
        .then((data) => {
          setUserData(data.userProfile);
          setMediaData(data.userMedia);
          router.replace('/');
        })
        .catch((error) => {
          console.error('Error fetching Instagram data:', error);
        });
    }
  }, [router]);

  const getInsightValue = (media: FacebookMediaData, metricName: string) => {
    const insight = media.insights?.data.find(
      (insight) => insight.name.toLowerCase() === metricName.toLowerCase()
    );
    return insight?.values[0]?.value || 'N/A';
  };

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
          <p>Name: {userData.name}</p>
          <p>User ID: {userData.id}</p>
          <p>Followers: {userData.followers_count}</p>
          <p>Total Posts: {userData.media_count}</p>
          
          <h3>Recent Media</h3>
          {mediaData && mediaData.length > 0 ? (
            mediaData.map((media) => (
              <div key={media.id} className="mb-4 p-2 border">
                {media.media_url && (
                  <Image
                    src={media.media_url}
                    alt={media.caption || 'Instagram Media'}
                    width={200}
                    height={200}
                    className="mb-2"
                  />
                )}
                
                <p>Caption: {media.caption || 'No caption'}</p>
                <p>Media Type: {media.media_type}</p>
                
                <div className="mt-2">
                  <strong>Engagement Metrics:</strong>
                  <p>Likes: {media.like_count || 0}</p>
                  <p>Comments: {media.comments_count || 0}</p>
                  <p>Impressions: {getInsightValue(media, 'impressions')}</p>
                  <p>Reach: {getInsightValue(media, 'reach')}</p>
                  <p>Video Views: {getInsightValue(media, 'video_views')}</p>
                  <p>Shares: {getInsightValue(media, 'shares')}</p>
                </div>
                
                {media.permalink && (
                  <a 
                    href={media.permalink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View on Instagram
                  </a>
                )}
              </div>
            ))
          ) : (
            <p>No media available.</p>
          )}
        </div>
      )}
    </div>
  );
}
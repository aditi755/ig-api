
 import { NextRequest, NextResponse } from 'next/server';

// interface InstagramTokenData {
//   access_token: string;
//   error?: { message: string };
// }

// interface InstagramUserData {
//   id: string;
//   username: string;
//   account_type: string;
// }

// export async function GET(req: NextRequest): Promise<NextResponse> {
//   const url = new URL(req.url);
//   console.log("url", url)
//   const code = url.searchParams.get('code');

//   console.log("code",code);

//   if (!code) {
//     return new NextResponse('Authorization code not found', { status: 400 });
//   }

//   // Exchange the authorization code for an access token
//   const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body: new URLSearchParams({
//       client_id: '564900196121353',
//       client_secret: 'faad8ab62a7f87122cbbbe167b1d81e3',
//       grant_type: 'authorization_code',
//       redirect_uri: 'https://ig-api-indol.vercel.app/api/auth/instagram/callback',
//       code,
//     }),
//   });

//   console.log('tokenResponse', tokenResponse.status)

//   const tokenData: InstagramTokenData = await tokenResponse.json();

//   if (!tokenResponse.ok || tokenData.error) {
//     return new NextResponse(
//       `Error fetching access token: ${tokenData.error?.message || 'Unknown error'}`,
//       { status: 400 }
//     );
//   }

//   console.log('tokenDtata', tokenData)
//   // Fetch user details using the access token
//   const userResponse = await fetch(
//     `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${tokenData.access_token}`
//   );

//   const userData: InstagramUserData = await userResponse.json();

//   if (!userResponse.ok) {
//     return new NextResponse('Failed to fetch Instagram user data', { status: 400 });
//   }

//   // Optionally save the userData to your database here
//   return NextResponse.json(userData, { status: 200 });
// }




interface InstagramTokenData {
  access_token: string;
  error?: { message: string };
}

interface InstagramUserData {
  id: string;
  username: string;
  account_type: string;
  full_name: string;
  profile_picture_url: string;
  media_count: number;
  followers_count: number; // Requires additional setup for Insights API
  following_count: number; // Requires additional setup for Insights API
  top_locations: string[]; // Example placeholder for top location data
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new NextResponse('Authorization code not found', { status: 400 });
  }

  // Exchange authorization code for an access token
  const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: '564900196121353',
      client_secret: 'faad8ab62a7f87122cbbbe167b1d81e3',
      grant_type: 'authorization_code',
      redirect_uri: 'https://ig-api-indol.vercel.app/api/auth/instagram/callback',
      code,
    }),
  });

  const tokenData: InstagramTokenData = await tokenResponse.json();

  if (!tokenResponse.ok || tokenData.error) {
    return new NextResponse(
      `Error fetching access token: ${tokenData.error?.message || 'Unknown error'}`,
      { status: 400 }
    );
  }

  // Fetch user details and media metrics
  const userResponse = await fetch(
    `https://graph.instagram.com/me?fields=id,username,account_type,full_name,profile_picture_url,media_count&access_token=${tokenData.access_token}`
  );

  const userData: InstagramUserData = await userResponse.json();

  if (!userResponse.ok) {
    return new NextResponse('Failed to fetch Instagram user data', { status: 400 });
  }

  // Fetch additional media metrics (posts, likes, comments, etc.)
  const mediaResponse = await fetch(
    `https://graph.instagram.com/me/media?fields=id,media_type,media_url,like_count,comments_count&access_token=${tokenData.access_token}`
  );

  const mediaData = await mediaResponse.json();

  if (!mediaResponse.ok) {
    return new NextResponse('Failed to fetch Instagram media data', { status: 400 });
  }

  return NextResponse.json({ userData, mediaData }, { status: 200 });
}

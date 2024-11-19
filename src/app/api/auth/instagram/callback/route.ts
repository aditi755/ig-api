
// // app/api/auth/instagram/callback/route.ts
// import { NextRequest, NextResponse } from 'next/server';

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
//   console.log(url)
//   const code = url.searchParams.get('code');

//   console.log("auth code",code);
//   //const { INSTAGRAM_APP_ID, INSTAGRAM_APP_SECRET, REDIRECT_URI } = process.env;

//   if (!code) {
//     return new NextResponse('Authorization code not found', { status: 400 });
//   }

//   // Exchange code for access token
//   const tokenResponse = await fetch(
//     `https://api.instagram.com/oauth/access_token`,
//     {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: new URLSearchParams({
//         client_id: '1068594868074995',
//         client_secret: '7aa94560586507e6c840da8105090984',
//         grant_type: 'authorization_code',
//         redirect_uri: 'https://ig-api-indol.vercel.app/api/auth/instagram/callback',
//         code,
//       }),
//     }
//   );

//   const tokenData: InstagramTokenData = await tokenResponse.json();

//   if (tokenData.error) {
//     return new NextResponse(`Error fetching token: ${tokenData.error.message}`, { status: 400 });
//   }

//   // Fetch user info using access token
//   const userResponse = await fetch(
//     `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${tokenData.access_token}`
//   );

//   const userData: InstagramUserData = await userResponse.json();

//   return new NextResponse(JSON.stringify(userData), { status: 200 });
// }















import { NextRequest, NextResponse } from 'next/server';

interface InstagramTokenData {
  access_token: string;
  error?: { message: string };
}

interface InstagramUserData {
  id: string;
  username: string;
  account_type: string;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new NextResponse('Authorization code not found', { status: 400 });
  }

  // Exchange the authorization code for an access token
  const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: '564900196121353',
      client_secret: 'faad8ab62a7f87122cbbbe167b1d81e3',
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:3000/api/auth/instagram/callback',
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

  // Fetch user details using the access token
  const userResponse = await fetch(
    `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${tokenData.access_token}`
  );

  const userData: InstagramUserData = await userResponse.json();

  if (!userResponse.ok) {
    return new NextResponse('Failed to fetch Instagram user data', { status: 400 });
  }

  // Optionally save the userData to your database here
  return NextResponse.json(userData, { status: 200 });
}

// import { NextRequest, NextResponse } from 'next/server';

// interface InstagramTokenData {
//   access_token: string;
//   error?: { message: string };
// }

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

// export async function GET(req: NextRequest): Promise<NextResponse> {
//   const url = new URL(req.url);
//   const code = url.searchParams.get('code');

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

//   const tokenData: InstagramTokenData = await tokenResponse.json();

//   if (!tokenResponse.ok || tokenData.error) {
//     return new NextResponse(
//       `Error fetching access token: ${tokenData.error?.message || 'Unknown error'}`,
//       { status: 400 }
//     );
//   }

//   const { access_token } = tokenData;

//   // Fetch user profile
//   const userProfileResponse = await fetch(
//     `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${access_token}`
//   );

//   const userProfile: InstagramUserData = await userProfileResponse.json();

//   if (!userProfileResponse.ok) {
//     return new NextResponse('Failed to fetch Instagram user profile', { status: 400 });
//   }

//   // Fetch user media
//   const userMediaResponse = await fetch(
//     `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${access_token}`
//   );

//   const userMedia: InstagramMediaData[] = await userMediaResponse.json().then((res) => res.data);

//   if (!userMediaResponse.ok) {
//     return new NextResponse('Failed to fetch Instagram user media', { status: 400 });
//   }

//   // Combine and return both user profile and media
//   return NextResponse.json({ userProfile, userMedia }, { status: 200 });
// }



import { NextRequest, NextResponse } from 'next/server';

interface FacebookTokenData {
  access_token: string;
  token_type: string;
  expires_in: number;
  error?: { message: string };
}

interface FacebookUserData {
  id: string;
  username: string;
  account_type: string;
  media_count?: number;
  followers_count?: number;
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
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new NextResponse('Authorization code not found', { status: 400 });
  }

  // Exchange the authorization code for an access token
  const tokenResponse = await fetch('https://graph.facebook.com/v19.0/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: '564900196121353',
      client_secret: 'faad8ab62a7f87122cbbbe167b1d81e3',
      grant_type: 'authorization_code',
      redirect_uri: 'https://ig-api-indol.vercel.app/api/auth/instagram/callback',
      code,
    }),
  });

  const tokenData: FacebookTokenData = await tokenResponse.json();

  if (!tokenResponse.ok || tokenData.error) {
    return new NextResponse(
      `Error fetching access token: ${tokenData.error?.message || 'Unknown error'}`,
      { status: 400 }
    );
  }

  const { access_token } = tokenData;

  // Fetch Instagram Business Account ID
  const accountResponse = await fetch(
    `https://graph.facebook.com/v19.0/me/accounts?access_token=${access_token}`
  );
  const accountData = await accountResponse.json();
  
  if (!accountResponse.ok || !accountData.data || accountData.data.length === 0) {
    return new NextResponse('No Instagram Business Account found', { status: 400 });
  }

  // Assuming first account is the Instagram Business Account
  const instagramAccountId = accountData.data[0].id;

  // Fetch user profile
  const userProfileResponse = await fetch(
    `https://graph.facebook.com/v19.0/${instagramAccountId}?fields=name,username,followers_count,media_count&access_token=${access_token}`
  );

  const userProfile: FacebookUserData = await userProfileResponse.json();

  if (!userProfileResponse.ok) {
    return new NextResponse('Failed to fetch Instagram user profile', { status: 400 });
  }

  // Fetch user media with insights
  const userMediaResponse = await fetch(
    `https://graph.facebook.com/v19.0/${instagramAccountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,like_count,comments_count,insights.metric(impressions,reach,video_views,shares)&access_token=${access_token}`
  );

  const userMediaData = await userMediaResponse.json();
  const userMedia: FacebookMediaData[] = userMediaData.data;

  if (!userMediaResponse.ok) {
    return new NextResponse('Failed to fetch Instagram user media', { status: 400 });
  }

  // Combine and return both user profile and media
  return NextResponse.json({ userProfile, userMedia }, { status: 200 });
}
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { playlistUrl } = await request.json();

    if (!playlistUrl) {
      return NextResponse.json({ error: 'Playlist URL is required' }, { status: 400 });
    }

    // Fetch the playlist
    const playlistResponse = await fetch(playlistUrl);
    if (!playlistResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch playlist' }, { status: 400 });
    }
    
    const playlistText = await playlistResponse.text();
    
    // Parse segment URLs from playlist
    const segmentUrls = playlistText
      .split("\n")
      .filter(line => line && !line.startsWith("#"))
      .map(url =>
        url.startsWith("http") ? url : new URL(url, playlistUrl).toString()
      );

    // Download all segments
    const { fetchFile } = await import("@ffmpeg/util");
    
    const segmentDataArray = await Promise.all(
      segmentUrls.map((url, i) =>
        fetchFile(url).then(data => {
          console.log(`Fetched segment ${i + 1}/${segmentUrls.length}`);
          return data;
        })
      )
    );

    // Combine all segments into a single array
    const totalLength = segmentDataArray.reduce((sum, arr) => sum + arr.length, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const arr of segmentDataArray) {
      combined.set(arr, offset);
      offset += arr.length;
    }

    // Return the combined video data as base64
    const base64Data = Buffer.from(combined).toString('base64');
    
    return NextResponse.json({ 
      success: true, 
      data: base64Data,
      segmentCount: segmentUrls.length,
      totalSize: combined.length
    });

  } catch (error) {
    console.error('Error downloading segments:', error);
    return NextResponse.json({ error: 'Failed to download segments' }, { status: 500 });
  }
}


export const runtime = 'edge';
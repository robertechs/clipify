# Clipify App

A Next.js application for processing and transcribing video clips from Pump.fun, with automatic subtitle generation and video editing capabilities.

## Features

- Download and process video clips from Pump.fun URLs
- Automatic voice activity detection to create clips
- Video transcription using OpenAI Whisper API
- Subtitle burning into videos
- Video cropping to different aspect ratios (9:16, 16:9, 1:1)

## Getting Started

### Prerequisites

1. **OpenAI API Key**: You'll need an OpenAI API key for transcription functionality.
   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a `.env.local` file in the root directory with:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. **Load a Pump.fun URL**: Enter a Pump.fun clip URL in the input field and click "Load"
2. **Select a clip**: Click on any generated clip thumbnail to select it
3. **Crop video**: Use the aspect ratio buttons (9:16, 16:9, 1:1) to crop the selected video
4. **Transcribe**: Click "Transcribe Clip" to generate subtitles and burn them into the video

## Troubleshooting

- **"Error transcribing video"**: Make sure your OpenAI API key is correctly set in `.env.local`
- **File size errors**: Videos must be under 25MB for transcription
- **API rate limits**: If you hit rate limits, wait a moment and try again

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

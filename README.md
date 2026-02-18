
# AI Influencer Studio

This is a vibe-coding project using Google AI Studio to support part of my MPhil application. Also inspired by Your Average Tech Bro (@YourAverageTechBro) and his app Yorby, I built this app without a viral-reel database to make it a bit handy. However, one of the greatest falls in this app AI search is not very accurate at all. I also highly recommend checking out Yorby, the social media marketing tool for startups: https://www.yorby.ai.

## The web app for demonstration
The public link: https://viralvault-896682388828.us-west1.run.app/

This webapp mainly has three functions:
1. Identify the viral reels in a specific industry within a region.
   <div align ="left">
   <img width="1200"  alt="Selections to identify viral reels in your industry" src="https://github.com/lyhui/ai-influencer/blob/main/pictures/Screenshot%202026-02-18%20132347.png" />
   </div>

3. Generated a relevant AI user profile based on your saved viral content in 1 and your preference in the persona.
   <div align ="left">
   <img width="1200" alt="Your selcections on AI influencer tone and characters" src="https://github.com/lyhui/ai-influencer/blob/main/pictures/Screenshot%202026-02-18%20132331.png" />
   </div>
5. Generated reels based on your selections in 1 and 2. 

 
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1wqK7dXZKAIZiqYF0_JMQJu5mn69uDZpz

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

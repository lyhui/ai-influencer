import { GoogleGenAI, Type } from "@google/genai";
import { ViralPost, Platform, InfluencerOptions, InfluencerProfile } from "../types";

const isValidVideoUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname;

    // YouTube: Must be a specific video or short
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return (
        pathname.includes('/shorts/') || 
        pathname.includes('/watch') || 
        (hostname.includes('youtu.be') && pathname.length > 2) // direct short link
      );
    }

    // Instagram: Must be a reel or post (posts are often videos in this context)
    if (hostname.includes('instagram.com')) {
      return pathname.includes('/reel/') || pathname.includes('/p/');
    }

    // TikTok: Must be a specific video
    if (hostname.includes('tiktok.com')) {
      return pathname.includes('/video/');
    }
    
    // If it doesn't match a known video pattern, discard it
    return false;
  } catch (e) {
    return false;
  }
};

export const generateViralPosts = async (industry: string, region: string, language: string, minShares: number): Promise<ViralPost[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing");
    return [];
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelId = "gemini-3-flash-preview";
  
  const prompt = `
    Generate a database of 6 highly viral social media post concepts specifically for the "${industry}" industry targeting the "${region}" region.
    
    IMPORTANT: The content (Title, Hook, Description, Psychological Trigger) MUST be written in ${language}.
    
    CRITICAL CRITERIA:
    1. Each post must theoretically achieve at least ${minShares.toLocaleString()} shares within 3 days of publishing.
    2. Focus strictly on VIDEO formats: "Reels", "TikToks", "YouTube Shorts".
    3. The "hook" must be extremely compelling.
    4. Provide a psychological trigger explaining WHY it goes viral.
    5. The 'shares' value must be a number greater than ${minShares}.
    6. 'daysActive' should be exactly 3.
    7. Provide a 'sourceHandle' (e.g. @famouscreator) and their estimated 'sourceFollowers' (e.g. "2.5M", "500k").
    8. MANDATORY STRICT VIDEO LINK & AVAILABILITY CHECK: 
       - Provide a 'sourceLink' that is a VALID, WORKING URL to a specific VIDEO (not a profile).
       - Check the video whether it is available. If not, start searching for the next one and do not include it in the result.
       - It MUST be a YouTube Short, Instagram Reel, or TikTok Video.
       - Do not use generic profile links.
       - Do not use fake or placeholder URLs.
       - If you cannot find a real, available video example, SKIP this concept entirely and find another one.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: `A catchy internal title for the post in ${language}` },
              industry: { type: Type.STRING },
              region: { type: Type.STRING, description: "The target region" },
              language: { type: Type.STRING, description: "The language of the content" },
              platform: { type: Type.STRING, enum: Object.values(Platform) },
              shares: { type: Type.NUMBER, description: `Projected share count, must be > ${minShares}` },
              daysActive: { type: Type.NUMBER, description: "Must be 3" },
              hook: { type: Type.STRING, description: `The first 3 seconds or first line text in ${language}` },
              contentDescription: { type: Type.STRING, description: `Brief summary of the visual content in ${language}` },
              psychologicalTrigger: { type: Type.STRING, description: `Why users share this (in ${language})` },
              engagementScore: { type: Type.NUMBER, description: "0 to 100 score" },
              estimatedReach: { type: Type.STRING, description: "e.g., '2.5M', '5M'" },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              sourceHandle: { type: Type.STRING, description: "The handle of the creator" },
              sourceFollowers: { type: Type.STRING, description: "Estimated follower count (e.g. 1.2M, 500k)" },
              sourceLink: { type: Type.STRING, description: "A full URL to the specific video (Reel/TikTok/Short)" }
            },
            required: ["title", "industry", "region", "platform", "shares", "daysActive", "hook", "contentDescription", "psychologicalTrigger", "engagementScore", "estimatedReach", "tags", "sourceHandle", "sourceFollowers", "sourceLink"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    // Strict Client-Side Filtering
    // Only return items with valid VIDEO URLs
    return data
      .filter((item: any) => isValidVideoUrl(item.sourceLink))
      .map((item: any, index: number) => ({
        ...item,
        id: `${Date.now()}-${index}`,
        isSaved: false
      }));

  } catch (error) {
    console.error("Error generating viral posts:", error);
    return [];
  }
};

export const analyzeCompetitorViralStrategy = async (industry: string, region: string, language: string): Promise<string> => {
   const apiKey = process.env.API_KEY;
   if (!apiKey) return "API Key missing.";
   
   const ai = new GoogleGenAI({ apiKey });
   const modelId = "gemini-3-flash-preview";
   const prompt = `Analyze the current state of viral content in the ${industry} industry within the ${region} region. 
   What specific formats (e.g., Green Screen, POV, Lists) are getting over 100k shares right now? 
   Provide a concise 3-bullet point summary strategy in ${language}.`;

   try {
     const response = await ai.models.generateContent({
       model: modelId,
       contents: prompt,
     });
     return response.text || "Analysis failed.";
   } catch (e) {
     return "Could not generate analysis.";
   }
}

export const generateAIInfluencer = async (savedPosts: ViralPost[], options: InfluencerOptions): Promise<InfluencerProfile | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  if (savedPosts.length === 0) return null;

  const ai = new GoogleGenAI({ apiKey });
  const modelId = "gemini-3-flash-preview";
  
  // 1. Generate the textual profile
  const context = savedPosts.map(p => `Title: ${p.title}, Hook: ${p.hook}, Style: ${p.contentDescription}`).join('\n');
  
  const textPrompt = `
    Create a detailed profile for an AI Influencer designed to create viral content based on these successful post concepts:
    ${context}

    The influencer must fit these constraints:
    - Age: ${options.age}
    - Sex: ${options.sex}
    - Race: ${options.race}
    - Character/Personality: ${options.character}
    - Primary Language: ${options.language}
    - Expected Reach: ${options.expectedReach}
    - Preferred Content Duration: ${options.contentDuration}
    - Target Platform: ${options.platform}

    Output JSON with:
    - name: A catchy name for the influencer.
    - bio: A short social media bio (max 150 chars).
    - strategy: A brief strategy on how they will dominate the ${options.platform} niche, SPECIFICALLY tailoring the content to be ${options.contentDuration} long (e.g. if 15s, focus on loops/trends; if 3 mins, focus on storytelling).
    - visualDescription: A highly detailed, photorealistic prompt to generate an image of this person. Include lighting, camera angle, clothing style, and background.
  `;

  try {
    const textResponse = await ai.models.generateContent({
      model: modelId,
      contents: textPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            bio: { type: Type.STRING },
            strategy: { type: Type.STRING },
            visualDescription: { type: Type.STRING },
          },
          required: ["name", "bio", "strategy", "visualDescription"]
        }
      }
    });

    const profile = JSON.parse(textResponse.text || "{}") as InfluencerProfile;

    if (!profile.visualDescription) return null;

    // 2. Generate the image
    const imageModelId = "gemini-2.5-flash-image";
    const imageResponse = await ai.models.generateContent({
      model: imageModelId,
      contents: {
        parts: [{ text: `A photorealistic photo (medium shot) of an influencer: ${profile.visualDescription}` }]
      },
      config: {
        imageConfig: {
            aspectRatio: "1:1"
        }
      }
    });

    let imageUrl = '';
    for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
        }
    }

    return { 
        ...profile, 
        imageUrl, 
        id: crypto.randomUUID(), 
        dateCreated: Date.now(),
        platform: options.platform
    };

  } catch (error) {
    console.error("Error generating influencer:", error);
    return null;
  }
};

export const generateInfluencerVideo = async (profile: InfluencerProfile): Promise<string> => {
    // IMPORTANT: Create a new instance to grab the latest Key from window selection if available
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) {
        throw new Error("API Key is missing. Please select a paid API Key.");
    }
    const freshAi = new GoogleGenAI({ apiKey });

    const prompt = `A cinematic, high-quality social media video of an influencer named ${profile.name}. 
    Visuals: ${profile.visualDescription}. 
    Action: They are engaging with the camera, appearing charismatic and confident.
    Style: Trending social media aesthetic for ${profile.platform || 'social media'}, bright lighting, high resolution, 4k. 
    Context: They are about to deliver a viral hook based on this strategy: ${profile.strategy}`;

    let operation = await freshAi.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: '9:16'
        }
    });

    // Poll for completion
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await freshAi.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (!downloadLink) {
        throw new Error("Video generation completed but no video URI was returned.");
    }

    // Fetch the video bytes
    // The key must be appended to the URL as per documentation for download links
    const videoResponse = await fetch(`${downloadLink}&key=${apiKey}`);
    
    if (!videoResponse.ok) {
         throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }

    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
};

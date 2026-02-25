import { GoogleGenAI, Type } from "@google/genai";
import { ViralPost, Platform, InfluencerOptions, InfluencerProfile, ContentType, DatePeriod, GenerationType } from "../types";

const isValidUrlForPlatform = (url: string, platform: Platform): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname;

    switch (platform) {
        case Platform.YouTube:
        case Platform.YouTubeShorts:
            if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
                 return (
                    pathname.includes('/shorts/') || 
                    pathname.includes('/watch') || 
                    (hostname.includes('youtu.be') && pathname.length > 2)
                 );
            }
            return false;
        case Platform.Instagram:
            return (hostname.includes('instagram.com') && (pathname.includes('/reel/') || pathname.includes('/p/')));
        case Platform.TikTok:
            return (hostname.includes('tiktok.com') && pathname.includes('/video/'));
        case Platform.LinkedIn:
            return hostname.includes('linkedin.com');
        case Platform.Twitter:
            return hostname.includes('twitter.com') || hostname.includes('x.com');
        default:
            return true;
    }
  } catch (e) {
    return false;
  }
};

export const generateViralPosts = async (
  industry: string, 
  region: string, 
  language: string, 
  minShares: number, 
  platforms: Platform[],
  contentType: ContentType = ContentType.Video,
  datePeriod: DatePeriod = DatePeriod.AllTime
): Promise<ViralPost[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing");
    return [];
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelId = "gemini-3-flash-preview";
  
  const platformString = platforms.length > 0 ? platforms.join(", ") : "Social Media";

  const prompt = `
    Generate a database of 6 highly viral social media post concepts specifically for the "${industry}" industry targeting the "${region}" region.
    
    CONTENT TYPE: ${contentType}
    DATE PERIOD: ${datePeriod}

    IMPORTANT: The content (Title, Hook, Description, Psychological Trigger) MUST be written in ${language}.
    
    CRITICAL CRITERIA:
    1. Each post must theoretically achieve at least ${minShares.toLocaleString()} shares within 3 days of publishing.
    2. Focus strictly on these selected platforms: ${platformString}.
    3. The content must be of type: ${contentType}.
    4. The posts should have been published within the period: ${datePeriod}.
    5. The "hook" must be extremely compelling.
    6. Provide a psychological trigger explaining WHY it goes viral.
    7. The 'shares' value must be a number greater than ${minShares}.
    8. 'daysActive' should be exactly 3.
    9. Provide a 'sourceHandle' (e.g. @famouscreator) and their estimated 'sourceFollowers' (e.g. "2.5M", "500k").
    10. MANDATORY STRICT SOURCE LINK & AVAILABILITY CHECK: 
       - Provide a 'sourceLink' that is a VALID, WORKING URL to a specific Post/Video (not a profile).
       - It MUST match one of the requested platforms: ${platformString}.
       - If it is a video platform (TikTok, Reels, Shorts), it must be a video link if contentType is Video.
       - If contentType is Image, it must be an image post link.
       - Do not use generic profile links.
       - Do not use fake or placeholder URLs.
       - If you cannot find a real, available example, SKIP this concept entirely and find another one.
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
              sourceLink: { type: Type.STRING, description: "A full URL to the specific post/video" }
            },
            required: ["title", "industry", "region", "platform", "shares", "daysActive", "hook", "contentDescription", "psychologicalTrigger", "engagementScore", "estimatedReach", "tags", "sourceHandle", "sourceFollowers", "sourceLink"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    // Strict Client-Side Filtering matching the selected platforms and their valid URL patterns
    return data
      .filter((item: any) => {
          // Must be one of the selected platforms
          const matchesPlatform = platforms.includes(item.platform as Platform);
          // Must have a valid URL for that platform
          const validUrl = isValidUrlForPlatform(item.sourceLink, item.platform as Platform);
          return matchesPlatform && validUrl;
      })
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
    - Generation Type: ${options.generationType}

    Output JSON with:
    - name: A catchy name for the influencer.
    - bio: A short social media bio (max 150 chars).
    - strategy: A brief strategy on how they will dominate the ${options.platform} niche, SPECIFICALLY tailoring the content to be ${options.contentDuration} long.
    - visualDescription: A highly detailed, photorealistic prompt to generate an image of this person. Include lighting, camera angle, clothing style, and background.
    - scripts: ${options.generationType === GenerationType.ScriptsAndPrompts ? 'MANDATORY: Provide 3 viral script concepts and image/video generation prompts for them.' : 'Optional: Any additional scripts or prompts.'}
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
            scripts: { type: Type.STRING },
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

export const generateInfluencerVideo = async (profile: InfluencerProfile, aspectRatio: '9:16' | '16:9' = '9:16'): Promise<string> => {
    // IMPORTANT: Create a new instance to grab the latest Key from window selection if available
    // Attempt to access process.env safely to prevent runtime crashes in some environments
    let apiKey = '';
    try {
        apiKey = process.env.API_KEY || '';
    } catch (e) {
        console.warn("process.env is not defined, relying on auto-injection if available");
    }

    if (!apiKey) {
        throw new Error("API Key is missing. Please ensure you have selected a paid API Key.");
    }
    const freshAi = new GoogleGenAI({ apiKey });

    // SIMPLIFIED PROMPT: Removes potential PII triggers (specific names) and focuses on visual description
    // This reduces the chance of safety filters blocking the output unnecessarily.
    const prompt = `A cinematic, high-quality social media video of a content creator. 
    Visuals: ${profile.visualDescription}. 
    Action: The creator is looking at the camera, engaging with the audience.
    Style: High resolution, 4k, professional lighting.`;

    let operation = await freshAi.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio
        }
    });

    // Poll for completion
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await freshAi.operations.getVideosOperation({ operation: operation });
        
        // Check for server-side errors in the operation
        if (operation.error) {
            throw new Error(`Video generation server error: ${operation.error.message || 'Unknown error'}`);
        }
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (!downloadLink) {
        // Log the full operation to debug why it failed silently (likely safety ratings)
        console.error("Full operation response:", JSON.stringify(operation, null, 2));
        throw new Error("Video generation completed but no video URI was returned. This often means the content was filtered by safety settings.");
    }

    // Fetch the video bytes
    // Determine the correct separator for the API key parameter
    const separator = downloadLink.includes('?') ? '&' : '?';
    const videoResponse = await fetch(`${downloadLink}${separator}key=${apiKey}`);
    
    if (!videoResponse.ok) {
         throw new Error(`Failed to download video bytes: ${videoResponse.status} ${videoResponse.statusText}`);
    }

    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
};

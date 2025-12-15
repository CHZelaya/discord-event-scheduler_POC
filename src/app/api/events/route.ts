import { NextResponse } from "next/server";

export async function GET(request: Request) {

    //* Discord variables
    const GUILD_ID = process.env.DISCORD_GUILD_ID;
    const token = process.env.DISCORD_BOT_TOKEN;

    // Validate that both required environment variables are set.
    // - DISCORD_GUILD_ID: The numeric ID of your Discord server
    // - DISCORD_BOT_TOKEN: Your bot's authentication token (keep secret!)
    // If either is missing, return a 500 error instead of trying to fetch from Discord.
    if (!GUILD_ID || !token) {
        return NextResponse.json(
            { error: 'Missing key variables' },
            { status: 500 }
        );
    }

    // Fetch scheduled events from the Discord API.
    // Endpoint: https://discord.com/api/v10/guilds/{GUILD_ID}/scheduled-events
    // This returns an array of all scheduled events (e.g., voice chats, game nights, etc.)
    // in the specified guild.
    // Auth header: 'Bot' prefix + token is required for Discord API v10.
    const res = await fetch(
        `https://discord.com/api/v10/guilds/${GUILD_ID}/scheduled-events`,
        {
            headers: { Authorization: `Bot ${token}` },
            next: { revalidate: 30 },  // Cache for 30 seconds (ISR: incremental static regeneration)
        }
    );

    if (!res.ok) {
        const text = await res.text();
        return NextResponse.json(
            { error: 'Discord fetch failed', details: text},
            {status: 500},
        );
    }

    const events = await res.json();
    // Discord's API response includes many fields; we extract only what we need for the UI.
    // Transform the raw Discord event objects into a simpler shape:
    //   - id: Event ID (used for React keys)
    //   - name: Event name (displayed as title)
    //   - startTime: When the event begins (formatted on the client)
    //   - endTime: When the event ends (optional; may be null)
    //   - description: Event details (optional)
    //   - location: For external events (from entity_metadata.location)
    const simplifiedEvents = events.map((e: any) => ({
        id: e.id,
        name: e.name,
        startTime: e.scheduled_start_time,
        endTime: e.scheduled_end_time ?? null,
        description: e.description ?? null,
        location: e.entity_type === 3 && e.entity_metadata ? e.entity_metadata.location ?? null : null,
        image: e.image ? `https://cdn.discordapp.com/guild-events/${e.id}/${e.image}.png?size=1024` : null,
        
    }));

    return NextResponse.json(simplifiedEvents);


}
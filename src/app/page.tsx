import Image from "next/image";

async function getEvents() {
  // On the server, fetch requires an absolute URL. Use configured base or localhost.
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const url = new URL('/api/events', base).toString();
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    try {
      const err = await res.json();
      console.error('Failed to fetch events', err);
    } catch (e) {
      console.error('Failed to fetch events', e);
    }
    return [];
  }

  return res.json();
}

export default async function Home() {

  const events = await getEvents();
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Is it possible to update a web page based on a discord event being created?
          </h1>
          <main className="w-full max-w-4xl p-6">

            <section className="mt-10">
              <h2 className="text-lg font-semibold">Upcoming Events (Discord)</h2>

              <ul className="mt-4 space-y-3">
                {(!Array.isArray(events) || events.length === 0) ? (
                  <li className="rounded-lg border p-4 text-sm text-gray-600">
                    NO EVENTS FOUND
                  </li>
                ) : (
                  events.map((e: any) => (
                    <li key={e.id} className="rounded-lg border p-4">

{e.image && (
  <Image 
    src={e.image} 
    alt={e.name} 
    width={800}
    height={400}
    className="w-full h-auto rounded-lg object-cover"
    quality={100}
    priority={false}
    unoptimized={true}
  />
)}
{/* {e.image && (
  <img 
    src={e.image} 
    alt={e.name} 
    className="w-full h-auto rounded-lg object-cover"
  />
)} */}
                      <div className="font-medium">{e.name}</div>
                      <div className="mt-1 text-sm text-gray-600">
                        {new Date(e.startTime).toLocaleString()}
                        {e.location ? ` ${e.location}` : ""}
                      </div>
                      {e.description ? (
                        <p className="mt-2 text-sm text-gray-700">{e.description}</p>
                      ) : null}
                    </li>
                  ))

                )}
              </ul>
            </section>
          </main>


        </div>
      </main>
    </div>
  );
}

'use client';
import { setupDatabase } from '@/lib/db/seed';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  useEffect(()=>{
    const initializeDB = async () => {
      await setupDatabase();
    };
    initializeDB();
  }, [])

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold">Fugitive Capture Game</h1>
      <button onClick={() => router.push('/select-city')} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg">
        Start Game
      </button>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { checkCapture } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const [result, setResult] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkCapture().then(setResult);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Game Result</h1>
      <p className="mt-4 text-lg">{result}</p>

      <button
        onClick={() => router.push('/')}
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg"
      >
        Play Again
      </button>
    </div>
  );
}

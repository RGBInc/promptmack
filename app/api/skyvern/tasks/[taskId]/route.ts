import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { taskId: string } }) {
  const taskId = params.taskId;

  try {
    const response = await fetch(`https://api.skyvern.com/api/v1/tasks/${taskId}`, {
      headers: {
        'x-api-key': process.env.SKYVERN_API_KEY || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch task details from Skyvern API');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Skyvern task details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task details' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { taskId: string } }) {
  const taskId = params.taskId;

  try {
    const response = await fetch(`https://api.skyvern.com/api/v1/tasks/${taskId}/cancel`, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.SKYVERN_API_KEY || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to cancel task in Skyvern API');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error canceling Skyvern task:', error);
    return NextResponse.json(
      { error: 'Failed to cancel task' },
      { status: 500 }
    );
  }
}
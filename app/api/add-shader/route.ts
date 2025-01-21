import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

// Define the file path for saving data
const filePath = path.join(process.cwd(), 'data', 'data.json');

// POST handler
export async function POST(req: Request) {
    // Restrict the API to development mode
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json(
            { success: false, message: 'Forbidden' },
            { status: 403 }
        );
    }

    const body = await req.json();
    try {
        let fileData: any[] = [];
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            fileData = JSON.parse(fileContent);
        } catch (error) { }

        fileData.push(body);
        await fs.writeFile(filePath, JSON.stringify(fileData, null), 'utf-8');
        return NextResponse.json(
            { success: true, message: 'Data saved successfully.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error saving data:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to save data.' },
            { status: 500 }
        );
    }
}
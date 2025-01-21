import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'data', 'data.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error reading data file:', error);
        return NextResponse.json({ error: 'Failed to read data file' }, { status: 500 });
    }
}   
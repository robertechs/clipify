import { NextResponse } from "next/server";

export async function GET(req: Request) {

	const { searchParams } = new URL(req.url);
	const url = searchParams.get("url");

	console.log(url);
	if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });


	const response = await fetch(url.toString());
	console.log(response);
	const data = await response.text();

	return new NextResponse(data, {
		status: 200,
		headers: {
			"Content-Type": "text/plain",
		},
	});
}

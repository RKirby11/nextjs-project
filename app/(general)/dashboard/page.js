import CardLink from "/components/CardLink.js"
export default function Dashboard() {
    return (
        <main className="h-full flex flex-col justify-between">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <CardLink href="/submission" text="Submit Today's Entry"></CardLink>
                <CardLink href="/history" text="View Past Entries"> </CardLink>
            </div>
            <div className="border-2 border-solid border-offblack mt-10 w-full h-full">
                Something will go here...
            </div>
        </main>
    );
}
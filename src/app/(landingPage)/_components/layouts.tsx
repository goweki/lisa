export function PageLayout({
    title,
    subtitle,
    children
}: {
    title: string;
    subtitle?: React.ReactNode;
    children: React.ReactNode;
}) {

    //render
    return (
        <main className="flex flex-col flex-grow items-center px-4">
            <div className="max-w-screen-lg mx-auto px-4 md:px-6">
                <div className="space-y-2 pt-6 md:space-y-5 mb-4">
                    <h1 className="text-center">{title}</h1>
                    {subtitle}
                </div>
                {children}
            </div>
        </main>
    );
}
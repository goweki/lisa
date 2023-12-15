import { Context } from "./context";

export const metadata = {
  title: "lisa - Home",
  description: "Legal Intelligent Support Assistant",
};

export default function PortalLayout({ home, settings }) {
  return (
    <div
      id="content"
      className="flex flex-col flex-1 py-2 md:py-4 px-4 sm:px-6 md:px-8"
    >
      <Context routes={{ home, settings }} />
    </div>
  );
}

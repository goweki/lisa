import { Context } from "./context";

export const metadata = {
  title: "lisa - Home",
  description: "Legal Intelligent Support Assistant",
};

export default function PortalLayout({ home, settings }) {
  return (
    <div id="content" className="flex flex-col flex-1 p-2 sm:p-6 md:p-8">
      <Context routes={{ home, settings }} />
    </div>
  );
}

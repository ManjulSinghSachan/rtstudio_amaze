import { TopNav } from "@/components/TopNav";
import { Sidekick } from "@/components/Sidekick";

const SidekickPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <div className="h-[calc(100vh-120px)]">
          <Sidekick />
        </div>
      </main>
    </div>
  );
};

export default SidekickPage;

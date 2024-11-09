import { BannerSection } from "./section/banner.section";
import RecentSection from "./section/recent.section";
import RecommendationSection from "./section/recommendation";
import TutorialSection from "./section/tutorial.section";

export default function HomeContainer() {
  return (
    <div className="mt-5">
      <BannerSection />
      <RecommendationSection />
      <RecentSection />
      <TutorialSection />
    </div>
  );
}

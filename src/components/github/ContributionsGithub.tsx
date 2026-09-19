import { useEffect, useState, useContext } from "react";
import { TbBrandGithub, TbGitFork } from "react-icons/tb";
import { motion } from "framer-motion";
import GithubConfig from "@/config/Github";
import { ContainerContext } from "@/context/ContainerProvider";
import axios from "axios";

// --- Types ---
interface ContributionDay {
  color: string;
  contributionCount: number;
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
  firstDay: string;
}

interface ContributionMonth {
  firstDay: string;
  name: string;
  totalWeeks: number;
}

interface GithubData {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        colors: string[];
        totalContributions: number;
        months: ContributionMonth[];
        weeks: ContributionWeek[];
      };
    };
  };
}

// --- Service Logic ---


function formatContributions(data: GithubData) {
  const calendar = data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) return { total: "0", thisWeek: "0", thisMonth: "0" };

  const total = calendar.totalContributions.toString();
  const currentWeek = calendar.weeks[calendar.weeks.length - 1];
  const weeklyCount = currentWeek.contributionDays.reduce((sum, day) => sum + day.contributionCount, 0);

  const currentMonth = calendar.months[calendar.months.length - 1];
  const monthStartWeekIndex = Math.max(0, calendar.weeks.length - currentMonth.totalWeeks);
  const monthlyCount = calendar.weeks
    .slice(monthStartWeekIndex)
    .reduce((sum, week) => sum + week.contributionDays.reduce((daySum, day) => daySum + day.contributionCount, 0), 0);

  return { total, thisMonth: monthlyCount.toString(), thisWeek: weeklyCount.toString() };
}

const getContributionColor = (count: number): string => {
  if (count === 0) return "";
  if (count < 2) return "#BBDEFB";
  if (count < 3) return "#90CAF9";
  if (count < 4) return "#42A5F5";
  return "#1E88E5";
};

// --- Sub-components ---
const DefinitionGithub = () => {
  const [showMore, setShowMore] = useState(false);
  return (
    <p className="text-neutral-600 dark:text-neutral-400">
      GitHub contributions refer to the activity and participation of developers in repositories
      {!showMore ? (
        <button onClick={() => setShowMore(true)} className="text-blue-400 hover:opacity-70 ml-1">...learn more</button>
      ) : (
        " hosted on GitHub. Contributions include commits, pull requests, issue tracking, code reviews, and discussions within projects. Developers can contribute to open-source projects or collaborate within private repositories by adding new features, fixing bugs, improving documentation, and reviewing code. GitHub tracks these contributions and visualizes them on a developer's profile, showcasing their activity and involvement in the community. Contributing to GitHub projects helps developers improve their coding skills, collaborate with others, and build a strong professional portfolio."
      )}
    </p>
  );
};

const Square = ({ color }: { color: string }) => {
  const { isTiny } = useContext(ContainerContext);
  return (
    <motion.li
      className="aspect-square rounded-full bg-neutral-300 dark:bg-neutral-700"
      style={!isTiny ? { backgroundColor: color || undefined } : {}}
      initial={!isTiny ? { opacity: 0 } : {}}
      whileInView={!isTiny ? { opacity: 1 } : {}}
      transition={!isTiny ? { delay: Math.random() * 0.9 + 0.1 } : {}}
      viewport={!isTiny ? { once: true, amount: 0.8 } : {}}
    />
  );
};

// --- Main Component ---
function ContributionsGithub() {
  const [data, setData] = useState<GithubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGithubContributions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/github/contributions`);
        setData(response.data);
      } catch (error: any) {
        setError(error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchGithubContributions();
  }, []);

  if (loading) {
    return (
      <div className="mt-12 px-7 md:px-24">
        <div className="flex animate-pulse flex-col gap-4">
          <div className="h-8 w-48 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-32 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mt-12 px-7 md:px-24 text-red-500">
        <p>Error: {error || "Invalid GitHub Token!"}</p>
      </div>
    );
  }

  const calendar = data?.user?.contributionsCollection?.contributionCalendar;
  const contributionsData = formatContributions(data);

  if (!calendar) {
    return (
      <div className="mt-12 px-7 md:px-24 text-red-500">
        <p>Error: Could not retrieve GitHub contribution data for this user.</p>
      </div>
    );
  }

  return (
    <div className="mt-12 px-7 font-light text-neutral-700 dark:text-neutral-300 md:px-24 z-0">
      <div className="flex items-center gap-3">
        <TbBrandGithub className="h-7 w-7" />
        <h2 className="text-2xl text-neutral-700 dark:text-neutral-400">Contributions</h2>
      </div>

      <a
        href={`https://github.com/${GithubConfig.username}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View On Github"
        className="flex w-fit items-center gap-1 text-blue-600 duration-100 hover:opacity-70 dark:text-neutral-600 mb-2"
      >
        Visit On Github
        <TbGitFork className="h-full w-6" />
      </a>

      <DefinitionGithub />

      <p className="font-normal text-neutral-600 dark:text-neutral-400 mt-4">
        My contributions from last year on github:
      </p>

      <div className="my-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        {[
          { label: "Past Year", value: contributionsData.total },
          { label: "This Month", value: contributionsData.thisMonth },
          { label: "This Week", value: contributionsData.thisWeek },
        ].map((stat, index) => (
          <div
            key={index}
            className="relative w-full overflow-hidden rounded-xl shadow-2xl border border-neutral-300/30 p-4 backdrop-blur-md dark:border-neutral-800/50 dark:bg-neutral-900/50 hover:border-blue-500/30 transition-colors"
          >
            <span className="text-sm opacity-70">{stat.label}</span>
            <p className="text-2xl font-bold text-blue-500">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="relative h-full w-full overflow-x-auto rounded-xl shadow-2xl border border-neutral-300/30 pb-5 backdrop-blur-md dark:border-neutral-800/50 dark:bg-neutral-900/50">
        <div className="min-w-175 px-5 pt-5 text-center">
          <div className="flex text-xs font-medium opacity-60 md:text-sm mb-2 text-left">
            {calendar.months.map((month, index) => (
              <span key={index} style={{ width: `${(month.totalWeeks / 53) * 100}%` }}>
                {month.totalWeeks > 2 && month.name}
              </span>
            ))}
          </div>

          <div className="flex gap-1 justify-center">
            {calendar.weeks.slice(1).map((week, index) => (
              <ul key={index} className="flex flex-col gap-1 flex-1 text-center">
                {week.contributionDays.map((day, dayIndex) => (
                  <Square key={dayIndex} color={getContributionColor(day.contributionCount)} />
                ))}
              </ul>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-6 font-medium text-sm">
            <span className="opacity-60 text-xs text-left">Less</span>
            <div className="flex gap-1">
              {["bg-neutral-300 dark:bg-neutral-700", "bg-blue-100", "bg-blue-200", "bg-blue-400", "bg-blue-600"].map((bgColor, index) => (
                <div key={index} className={`h-4 w-4 rounded-full ${bgColor}`} />
              ))}
            </div>
            <span className="opacity-60 text-xs">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContributionsGithub;




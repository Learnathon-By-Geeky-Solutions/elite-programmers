import { Card, CardHeader, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";

const stats = [
  { icon: "lucide:users", value: 1424, title: "Total Users", subtitle: "in this platform" },
  { icon: "lucide:user-plus", value: 245, title: "New Users", subtitle: "registered this month" },
  { icon: "lucide:book-open", value: 425, title: "Total Exams", subtitle: "created in this platform" },
  { icon: "lucide:list", value: 6424, title: "Total Questions", subtitle: "created in this platform" },
  { icon: "lucide:check-circle", value: 2894, title: "Total Submissions", subtitle: "attempted by candidates" },
  { icon: "lucide:pie-chart", value: 75, title: "Average Score", subtitle: "across all candidates" },
];

export default function Component() {
  return (
    <div className="flex flex-wrap gap-6 h-screen w-full items-center justify-center">
      {stats.map((stat, index) => (
        <Card key={index} className="py-4 w-[300px] text-center">
          <CardHeader className="pb-0 pt-2 px-4 flex flex-col items-center">
            <Icon icon={stat.icon} width={80} height={80} />
            <h1 className="font-bold text-6xl">{stat.value}</h1>
          </CardHeader>
          <CardBody className="py-2 mt-4 text-center">
            <h2 className="text-lg font-semibold">{stat.title}</h2>
            <p className="text-sm text-gray-400">{stat.subtitle}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

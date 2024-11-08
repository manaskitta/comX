import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import TasksList from "./TasksList";
import { cards } from "@/lib/DummyData";
import { Task } from "@/types/tasks";
import SingleTask from "./SingelTask";
import { useParams } from "react-router-dom";
import ErrorPage from "../genral/ErrorPage";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export default function TaskPage() {
  const { ID,projectId } = useParams();

  const [active, setActive] = useState<Task | boolean | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  const {
    data: taskList,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`community${ID}/project/${projectId}/task`],
    queryFn: async () => {
      const response = await axios.get(
        `${backend_url}/task/get-all-tasks-in-project/${ID}/${projectId}`,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    },
    staleTime: Infinity,
  });

  if (projectId === undefined) return <div>Hello World</div>;

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (error) {
    return <ErrorPage />;
  }

  console.log(taskList);

  return (
    <>
      <Card className="w-full h-full overflow-x-hidden overflow-y-scroll no-scrollbar">
        <CardContent className="mt-12">
          <AnimatePresence>
            {active && typeof active === "object" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 h-full w-full z-10"
              />
            )}
          </AnimatePresence>
          <SingleTask active={active} setActive={setActive} />
          <ul className="mx-auto w-full gap-4">
            <TasksList cards={cards} setActive={setActive} />
          </ul>
        </CardContent>
        <Button
          variant="outline"
          className="absolute right-12 bg-gray-50 h-12 bottom-6 w-36"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </Card>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

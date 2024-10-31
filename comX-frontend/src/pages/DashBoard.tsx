import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import CreateCommunity from "./dashboard/CreateCommunity";
import JoinCommunity from "./dashboard/JoinCommunity";
import LastTask from "./dashboard/Last-Task";
import CommunityCard from "./dashboard/CommunityCard";
import { useQuery } from "@tanstack/react-query";
import ErrorPage from "./ErrorPage";
import axios from "axios";
import { dummyCommunities } from "@/lib/DummyData";
import { Community } from "@/types/Community";
import useAuthCheck from "@/hooks/useAuthCheck";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { Toaster } from "react-hot-toast";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const fetchCommunityList = async () => {
  const response = await axios.get(
    `${backend_url}/community/get-user-communities`,
    {
      withCredentials: true,
    }
  );
  return response.data.data;
};

export default function Dashboard() {
  const user = useSelector((state: RootState) => state.userDetails);

  useAuthCheck(user.user);

  const { isError, data, error } = useQuery({
    queryKey: [`communityList${user.user?.id}`],
    queryFn: fetchCommunityList,
    staleTime: Infinity,
  });

  if (isError) {
    console.error(error);
    return <ErrorPage />;
  }

  const [communities, setCommunities] = useState(dummyCommunities);

  useEffect(() => {
    if (Array.isArray(data)) setCommunities(data);
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="mr-2" /> Your Communities
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {communities.map((community: Community) => (
                <CommunityCard
                  key={community.id}
                  coverImage={community.coverImage}
                  createdAt={community.createdAt}
                  description={community.description}
                  memberCount={community.memberCount}
                  name={community.name}
                  owner={community.owner}
                  id={community.id}
                  joinCode={community.joinCode}
                />
              ))}
            </div>
          </motion.div>

          <div className="space-y-6">
            <CreateCommunity />
            <JoinCommunity />
            <LastTask />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

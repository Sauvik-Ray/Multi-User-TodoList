import { useState, useEffect } from "react";
import { joinRoom } from "@/api/roomApi";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Copy } from "lucide-react";
import AppLayout from "../components/AppLayout";

export default function JoinRoom() {
  const navigate = useNavigate();
  const params = useParams();

  const [username, setUsername] = useState("");
  const [joinKey, setJoinKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-fill joinKey from URL
  useEffect(() => {
    if (params.joinKey) {
      setJoinKey(params.joinKey);
    }
  }, [params.joinKey]);

  const handleCopy = () => {
    navigator.clipboard.writeText(joinKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleJoin = async () => {
    if (!username || !joinKey) return;

    setLoading(true);

    try {
      const { data } = await joinRoom(joinKey);

      if (!data.joined) {
        alert("Invalid join link");
        return;
      }

      localStorage.setItem("username", username);
      localStorage.setItem("roomId", data.roomId);

      navigate(`/room/${data.roomId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex justify-center pt-12">
        <Card
          className="max-w-md w-full shadow-lg border border-gray-200 
          dark:border-gray-700 bg-white dark:bg-[#1c1f29] rounded-xl"
        >
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center text-gray-900 dark:text-gray-100">
              Join the Room
            </CardTitle>
            <CardDescription className="text-center text-sm text-gray-600 dark:text-gray-400">
              Enter your username and proceed
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-1">
              <Label className="font-medium text-gray-800 dark:text-gray-200">
                Username
              </Label>
              <Input
                className="h-11 bg-white dark:bg-[#252933] border-gray-300 
                dark:border-gray-600 text-gray-900 dark:text-gray-100"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. John"
              />
            </div>

            <div className="space-y-1">
              <Label className="font-medium text-gray-800 dark:text-gray-200">
                Join Key
              </Label>

              <div className="flex gap-2">
                <Input
                  disabled
                  value={joinKey}
                  className="h-11 bg-gray-100 dark:bg-[#2e3340] 
                  border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100"
                />
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="min-w-[90px] h-11 text-sm flex items-center gap-1"
                >
                  <Copy size={16} />
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>

            <Button
              onClick={handleJoin}
              disabled={loading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 
              disabled:opacity-60 text-white font-medium"
            >
              {loading ? "Joining..." : "Enter Room"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

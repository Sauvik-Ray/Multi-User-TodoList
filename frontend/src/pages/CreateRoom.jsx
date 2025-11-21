import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../api/roomApi";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Eye, EyeOff } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { saveSession, getSession } from "@/hooks/useRoomStorage";

export default function CreateRoom() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);

  const session = getSession();
  const sessionAdminKey = session?.adminKey;
  const isAdmin = room && room.adminKey === sessionAdminKey;

  const handleCreate = async () => {
    if (!name.trim() || !username.trim()) {
      toast({
        title: "Missing Fields",
        description: "Room name and username are required.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await createRoom(name.trim(), username.trim());
      setRoom(data);

      saveSession({
        roomId: data.id || data.roomId,
        username,
        adminKey: data.adminKey,
        joinKey: data.joinKey,
      });

      toast({
        title: "Room Created",
        description: "Redirecting...",
      });

      setTimeout(() => {
        const id = data.id || data.roomId;
        navigate(`/room/${id}`);
      }, 700);
    } catch {
      toast({
        title: "Error",
        description: "Failed to create room.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!" });
  };

  const roomUrl = room && `${window.location.origin}/join/${room.joinKey}`;

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 py-12 bg-gray-50 dark:bg-[#0a0b10]">
      <Card className="w-full max-w-lg bg-white dark:bg-[#1b1e27] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
            Create a Room
          </CardTitle>
          <CardDescription className="text-center text-gray-500 dark:text-gray-400">
            Start collaborating instantly.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-2">
          {/* BEFORE ROOM CREATED */}
          {!room && (
            <div className="space-y-5">
              {/* Room Name */}
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-medium">
                  Room Name
                </Label>
                <Input
                  placeholder="e.g. Sprint Planning"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white dark:bg-[#252933] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200"
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-medium">
                  Your Username
                </Label>
                <Input
                  placeholder="e.g. Rohan"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white dark:bg-[#252933] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200"
                />
              </div>

              {/* Create Btn */}
              <Button
                className="w-full h-11 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={handleCreate}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Room"}
              </Button>
            </div>
          )}

          {/* AFTER CREATED */}
          {room && (
            <div className="space-y-6">
              {/* Success Info */}
              <div className="text-center space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Room Created
                </p>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                  {room.name}
                </h2>
              </div>

              {/* JOIN KEY */}
              <div className="bg-white dark:bg-[#252933] border border-gray-300 dark:border-gray-600 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Join Key
                  </p>
                  <p className="font-mono font-medium text-gray-800 dark:text-gray-200">
                    {room.joinKey}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(room.joinKey)}
                  className="border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              {/* SHARE URL */}
              <div className="bg-white dark:bg-[#252933] border border-gray-300 dark:border-gray-600 rounded-lg p-4 flex items-center gap-3">
                <div className="flex-1 space-y-1">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Shareable Link
                  </p>
                  <p className="font-mono text-sm text-gray-800 dark:text-gray-200 break-all">
                    {roomUrl}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(roomUrl)}
                  className="border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              {/* ADMIN SECTION */}
              {isAdmin && (
                <div className="bg-white dark:bg-[#252933] border border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      Admin Key (Private)
                    </p>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAdminKey((s) => !s)}
                      className="border-gray-400 dark:border-gray-500"
                    >
                      {showAdminKey ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <p className="text-lg font-mono select-none text-gray-800 dark:text-gray-200">
                    {showAdminKey ? room.adminKey : "••••••••••"}
                  </p>

                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(room.adminKey)}
                    className="w-full border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                  >
                    Copy Admin Key
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
